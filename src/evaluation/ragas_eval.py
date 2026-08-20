import json
import logging
import math

from src.utils.ragas_compat import install_ragas_compat

install_ragas_compat()

from datasets import Dataset
from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,
    context_precision,
    context_recall,
    faithfulness,
)
from ragas.run_config import RunConfig

from src.utils.config import EVALUATION_DATA_DIR

log = logging.getLogger("ragas_eval")

METRICS = {
    "faithfulness": faithfulness,
    "answer_relevancy": answer_relevancy,
    "context_precision": context_precision,
    "context_recall": context_recall,
}

DATASET_CACHE = EVALUATION_DATA_DIR / "ragas_dataset_cache.json"
RESULTS_PATH = EVALUATION_DATA_DIR / "ragas_results_local.json"


def _run_lightweight_ragas_evaluation(dataset, metrics, llm=None, embeddings=None):
    kwargs = {}
    if llm is not None:
        kwargs["llm"] = llm
    if embeddings is not None:
        kwargs["embeddings"] = embeddings
    # LLM local sérialisé par un verrou : un seul worker évite la contention
    # et l'échec sur timeout des appels parallèles de RAGAS. Timeout réduit
    # pour éviter des jobs très longs qui bloquent la file.
    kwargs["run_config"] = RunConfig(max_workers=1, timeout=120, max_retries=0)
    try:
        result = evaluate(dataset, metrics=metrics, **kwargs)
        return result.to_pandas()[list(metrics)].mean().to_dict()
    except Exception:
        return {
            "faithfulness": None,
            "answer_relevancy": None,
            "context_precision": None,
            "context_recall": None,
            "note": "Évaluation RAGAS interrompue à cause de la charge locale ; exécution conservée en mode léger.",
        }


def _save_scores(scores: dict):
    """Écrit les scores partiels dans ragas_results_local.json, sans écraser
    les métriques déjà calculées (reprise en cas d'interruption)."""
    existing = {}
    if RESULTS_PATH.exists():
        try:
            existing = json.loads(RESULTS_PATH.read_text(encoding="utf-8")).get(
                "scores", {}
            )
        except (json.JSONDecodeError, OSError):
            existing = {}
    existing.update(scores)
    RESULTS_PATH.write_text(
        json.dumps(
            {"judge": "local-qwen2.5-1.5b", "scores": existing},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    log.info("Résultats partiels sauvegardés : %s", list(scores.keys()))


def build_eval_dataset(chain, retriever, test_questions, use_cache=True) -> Dataset:
    """Construit (ou recharge) le jeu de données d'évaluation : questions,
    réponses générées, contextes récupérés et gold answers."""
    if use_cache and DATASET_CACHE.exists():
        cache = json.loads(DATASET_CACHE.read_text(encoding="utf-8"))
        log.info(
            "Dataset d'évaluation rechargé depuis le cache (%d lignes).",
            len(cache["question"]),
        )
        return Dataset.from_dict(cache)
    rows = {"question": [], "answer": [], "contexts": [], "ground_truth": []}
    for i, item in enumerate(test_questions, start=1):
        question = item["question"]
        docs = retriever.invoke(question)
        rows["question"].append(question)
        rows["answer"].append(chain.invoke(question))
        rows["contexts"].append([doc.page_content for doc in docs])
        rows["ground_truth"].append(item["gold_answer"])
        log.info("Ligne %d/%d : %s", i, len(test_questions), question[:60])
    DATASET_CACHE.write_text(json.dumps(rows, ensure_ascii=False), encoding="utf-8")
    log.info(
        "Dataset d'évaluation construit et mis en cache (%d lignes).",
        len(rows["question"]),
    )
    return Dataset.from_dict(rows)


def run_ragas_evaluation(
    chain,
    retriever,
    test_questions: list[dict],
    llm=None,
    embeddings=None,
    limit: int | None = None,
) -> dict:
    """Évalue les 4 métriques RAGAS en sauvegardant chaque métrique dès qu'elle
    est calculée, ce qui permet de reprendre un run interrompu sans tout refaire."""
    questions = test_questions[:limit] if limit is not None else test_questions
    dataset = build_eval_dataset(chain, retriever, questions)
    scores = {}
    existing = {}
    if RESULTS_PATH.exists():
        try:
            existing = json.loads(RESULTS_PATH.read_text(encoding="utf-8")).get(
                "scores", {}
            )
        except (json.JSONDecodeError, OSError):
            existing = {}
    for name, metric in METRICS.items():
        if name in existing and existing[name] is not None:
            log.info("Métrique %s déjà calculée (%s) — reprise.", name, existing[name])
            scores[name] = existing[name]
            continue
        log.info("Évaluation de la métrique %s (%d lignes)...", name, len(dataset))
        try:
            result = evaluate(
                dataset,
                metrics=[metric],
                llm=llm,
                embeddings=embeddings,
                run_config=RunConfig(max_workers=1, timeout=120, max_retries=0),
            )
            value = float(result.to_pandas()[name].mean())
            if math.isnan(value):
                value = None
            scores[name] = value
        except Exception as exc:
            log.error("Échec de la métrique %s : %s", name, exc)
            scores[name] = None
        _save_scores({name: scores[name]})
        log.info("Métrique %s = %s", name, scores[name])
    return scores


from src.evaluation.retrieval_metrics import (
    aggregate_scores,
    mrr,
    precision_at_k,
    recall_at_k,
)


def _source_to_chunk_ids(vectorstore) -> dict[str, list]:
    data = vectorstore.get(include=["metadatas"])
    mapping: dict[str, list] = {}
    for metadata in data["metadatas"]:
        if "chunk_id" not in metadata:
            continue
        source = metadata.get("document") or metadata.get("source", "inconnu")
        mapping.setdefault(source, []).append(metadata["chunk_id"])
    return mapping


def _source_hit(docs, expected_source: str) -> tuple[int, int]:
    hit_1 = 0
    hit_5 = 0
    for rank, doc in enumerate(docs[:5], start=1):
        source = doc.metadata.get("document") or doc.metadata.get("source", "")
        if expected_source and source == expected_source:
            hit_1 = 1 if rank == 1 else hit_1
            hit_5 = 1
    return hit_1, hit_5


def run_retrieval_evaluation(
    retriever,
    vectorstore,
    test_questions: list[dict],
) -> list[dict]:
    source_to_ids = _source_to_chunk_ids(vectorstore)
    results = []
    for item in test_questions:
        question = item["question"]
        expected_source = item.get("expected_source") or ""
        relevant_ids = item.get("relevant_chunk_ids") or source_to_ids.get(
            expected_source, []
        )
        docs = retriever.invoke(question)
        hit_1, hit_5 = _source_hit(docs, expected_source)
        results.append(
            {
                "id": item.get("id"),
                "question": question,
                "expected_source": expected_source,
                "precision_at_1": precision_at_k(docs, relevant_ids, 1),
                "precision_at_5": precision_at_k(docs, relevant_ids, 5),
                "recall_at_5": recall_at_k(docs, relevant_ids, 5),
                "source_hit_at_1": hit_1,
                "source_hit_at_5": hit_5,
                "mrr": mrr(docs, relevant_ids),
            }
        )
    return results


def full_evaluation(
    chain,
    retriever,
    vectorstore,
    test_questions: list[dict],
    llm=None,
    embeddings=None,
    limit: int | None = None,
) -> dict:
    retrieval_results = run_retrieval_evaluation(retriever, vectorstore, test_questions)
    ragas_scores = run_ragas_evaluation(
        chain, retriever, test_questions, llm, embeddings, limit=limit
    )
    return {
        "retrieval_aggregates": aggregate_scores(retrieval_results),
        "retrieval_per_question": retrieval_results,
        "ragas": ragas_scores,
    }
