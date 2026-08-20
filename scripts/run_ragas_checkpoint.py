import json
import logging
import math
import os
import sys
import time

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(SCRIPT_DIR)
sys.path.insert(0, PROJECT_ROOT)
os.chdir(PROJECT_ROOT)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(name)s %(levelname)s %(message)s",
)
logging.getLogger("httpx").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)

from src.utils.ragas_compat import install_ragas_compat

install_ragas_compat()

from ragas import evaluate
from ragas.metrics import (
    answer_relevancy,
    context_precision,
    context_recall,
    faithfulness,
)
from ragas.run_config import RunConfig

from src.evaluation.ragas_eval import build_eval_dataset
from src.generation.llm import get_judge_llm, get_llm
from src.generation.rag_chain import build_rag_chain
from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

LOG = os.path.join(PROJECT_ROOT, "data", "evaluation", "ragas_full.log")
BATCH_SIZE = 4
CHECKPOINT_PATH = EVALUATION_DATA_DIR / "ragas_checkpoint.json"
RESULTS_PATH = EVALUATION_DATA_DIR / "ragas_results_local.json"
PID_FILE = EVALUATION_DATA_DIR / "ragas_worker.pid"


def _pid_running(pid: int) -> bool:
    """Vrai si un process Windows avec ce PID existe encore."""
    import subprocess

    out = subprocess.run(
        ["tasklist", "/FI", f"PID eq {pid}", "/NH"],
        capture_output=True,
        text=True,
    ).stdout
    return str(pid) in out


def acquire_lock() -> bool:
    """Verrou inter-process : False si un autre worker tourne déjà."""
    if PID_FILE.exists():
        try:
            pid = int(PID_FILE.read_text(encoding="utf-8").strip())
        except (ValueError, OSError):
            pid = None
        if pid is not None and _pid_running(pid):
            log("Un autre worker tourne (PID %d) - sortie immédiate", pid)
            return False
    PID_FILE.write_text(str(os.getpid()), encoding="utf-8")
    log("Verrou acquis : PID %d", os.getpid())
    return True


METRICS = {
    "faithfulness": faithfulness,
    "answer_relevancy": answer_relevancy,
    "context_precision": context_precision,
    "context_recall": context_recall,
}


def log(msg, *args):
    if args:
        msg = msg % args
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {msg}\n")


def load_checkpoint():
    if CHECKPOINT_PATH.exists():
        try:
            return json.loads(CHECKPOINT_PATH.read_text(encoding="utf-8"))
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def _is_worker_active() -> bool:
    """Vrai si au moins un worker parallèle tourne (flag partagé)."""
    return (EVALUATION_DATA_DIR / "ragas_workers_running.flag").exists()


def _atomique_save(ckpt):
    """Écriture atomique (tmp + rename) pour les écritures concurrentes."""
    tmp = CHECKPOINT_PATH.with_suffix(".json.tmp")
    tmp.write_text(json.dumps(ckpt, ensure_ascii=False, indent=1), encoding="utf-8")
    os.replace(tmp, CHECKPOINT_PATH)


def save_checkpoint(ckpt):
    CHECKPOINT_PATH.write_text(
        json.dumps(ckpt, ensure_ascii=False, indent=1), encoding="utf-8"
    )


def load_done_scores():
    if RESULTS_PATH.exists():
        try:
            return json.loads(RESULTS_PATH.read_text(encoding="utf-8")).get(
                "scores", {}
            )
        except (json.JSONDecodeError, OSError):
            pass
    return {}


def save_done_scores(scores):
    existing = load_done_scores()
    existing.update(scores)
    RESULTS_PATH.write_text(
        json.dumps(
            {"judge": "local-qwen2.5-1.5b", "scores": existing},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )


def main():
    if _is_worker_active():
        log("Workers parallèles actifs - le run single sort")
        return
    if not acquire_lock():
        return
    questions = json.loads(
        (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    target = [q for q in questions if not q.get("needs_escalation")]
    done = load_done_scores()
    if len([m for m in METRICS if m in done and done[m] is not None]) == len(METRICS):
        log("TOUTES LES METRIQUES TERMINEES - sortie")
        (EVALUATION_DATA_DIR / "ragas_done.flag").write_text("done", encoding="utf-8")
        return

    embeddings = get_embedding_model()
    retriever = create_retriever(load_vectorstore(CHROMA_PERSIST_DIR, embeddings))
    chain = build_rag_chain(retriever, get_llm())
    judge = get_judge_llm()
    dataset = build_eval_dataset(chain, retriever, target)
    n = len(dataset)
    ckpt = load_checkpoint()

    while len([m for m in METRICS if m in done and done[m] is not None]) < len(METRICS):
        progressed = False
        for metric_name, metric in METRICS.items():
            if metric_name in done and done[metric_name] is not None:
                continue
            metric_state = ckpt.setdefault(metric_name, {})
            pending = [i for i in range(n) if str(i) not in metric_state]
            if not pending:
                scores = [
                    metric_state[str(i)]
                    for i in range(n)
                    if metric_state.get(str(i)) is not None
                ]
                val = sum(scores) / len(scores) if scores else None
                done[metric_name] = val
                save_done_scores({metric_name: val})
                log("Métrique %s TERMINEE = %s", metric_name, val)
                continue
            batch = pending[:BATCH_SIZE]
            key = f"{metric_name}:{batch[0]}"
            failures = ckpt.setdefault("_failures", {})
            if failures.get(key, 0) >= 3:
                for row in batch:
                    metric_state[str(row)] = None
                save_checkpoint(ckpt)
                log(
                    "Lot %d-%d (%s) : 3 échecs consécutifs, marqué None",
                    batch[0] + 1,
                    batch[-1] + 1,
                    metric_name,
                )
                progressed = True
                continue
            log(
                "Métrique %s : lot %d-%d (%d/%d lignes)",
                metric_name,
                batch[0] + 1,
                batch[-1] + 1,
                len(pending),
                n,
            )
            subset = dataset.select(batch)
            try:
                result = evaluate(
                    subset,
                    metrics=[metric],
                    llm=judge,
                    embeddings=embeddings,
                    run_config=RunConfig(max_workers=1, timeout=300, max_retries=0),
                )
                scores = result.to_pandas()[metric_name].tolist()
                for row, val in zip(batch, scores, strict=True):
                    if isinstance(val, (int, float)) and not math.isnan(val):
                        metric_state[str(row)] = float(val)
                    else:
                        metric_state[str(row)] = None
                failures.pop(key, None)
                save_checkpoint(ckpt)
                progressed = True
                log(
                    "Lot %d-%d termine : score lot = %s",
                    batch[0] + 1,
                    batch[-1] + 1,
                    result.to_pandas()[metric_name].mean() if len(scores) else None,
                )
            except Exception as exc:
                failures[key] = failures.get(key, 0) + 1
                save_checkpoint(ckpt)
                log(
                    "ERREUR lot %d-%d (%s) tentative %d : %s - rejoue au prochain tour",
                    batch[0] + 1,
                    batch[-1] + 1,
                    metric_name,
                    failures[key],
                    exc,
                )
                time.sleep(30)
                break
        if not progressed:
            log("Aucun lot traité ce tour - attente 60s")
            time.sleep(60)

    save_done_scores(done)
    (EVALUATION_DATA_DIR / "ragas_done.flag").write_text("done", encoding="utf-8")
    PID_FILE.unlink(missing_ok=True)
    log("TOUTES LES METRIQUES TERMINEES - FIN")


def worker_main(metric_names: list[str], tag: str) -> None:
    """Worker parallèle : traite uniquement les métriques assignées."""
    pid_file = EVALUATION_DATA_DIR / f"ragas_worker_{tag}.pid"
    if pid_file.exists():
        pid = int(pid_file.read_text(encoding="utf-8"))
        if _pid_running(pid):
            log("Worker %s déjà actif (PID %d) - sortie", tag, pid)
            return
    pid_file.write_text(str(os.getpid()), encoding="utf-8")
    (EVALUATION_DATA_DIR / "ragas_workers_running.flag").write_text(
        "running", encoding="utf-8"
    )
    try:
        questions = json.loads(
            (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
        )["questions"]
        target = [q for q in questions if not q.get("needs_escalation")]
        embeddings = get_embedding_model()
        retriever = create_retriever(load_vectorstore(CHROMA_PERSIST_DIR, embeddings))
        chain = build_rag_chain(retriever, get_llm())
        judge = get_judge_llm()
        dataset = build_eval_dataset(chain, retriever, target)
        n = len(dataset)
        for metric_name in metric_names:
            metric = METRICS[metric_name]
            while True:
                ckpt = load_checkpoint()
                metric_state = ckpt.setdefault(metric_name, {})
                given_up = ckpt.setdefault("_given_up", {})
                pending = [
                    i
                    for i in range(n)
                    if str(i) not in metric_state
                    or (
                        metric_state.get(str(i)) is None
                        and f"{metric_name}:{i}" not in given_up
                    )
                ]
                if not pending:
                    log(
                        "Worker %s : métrique %s terminée (%d lignes)",
                        tag,
                        metric_name,
                        n,
                    )
                    break
                batch = pending[:BATCH_SIZE]
                key = f"{metric_name}:{batch[0]}"
                failures = ckpt.setdefault("_failures", {})
                if failures.get(key, 0) >= 3:
                    for row in batch:
                        metric_state[str(row)] = None
                        given_up[f"{metric_name}:{row}"] = True
                    _atomique_save(ckpt)
                    log(
                        "Worker %s : %s lot %d-%d abandonné (3 échecs)",
                        tag,
                        metric_name,
                        batch[0] + 1,
                        batch[-1] + 1,
                    )
                    continue
                log(
                    "Worker %s : %s lot %d-%d (%d/%d lignes)",
                    tag,
                    metric_name,
                    batch[0] + 1,
                    batch[-1] + 1,
                    len(pending),
                    n,
                )
                subset = dataset.select(batch)
                try:
                    result = evaluate(
                        subset,
                        metrics=[metric],
                        llm=judge,
                        embeddings=embeddings,
                        run_config=RunConfig(max_workers=1, timeout=300, max_retries=0),
                    )
                    scores = result.to_pandas()[metric_name].tolist()
                    updates = {}
                    valid = 0
                    for row, val in zip(batch, scores, strict=True):
                        if isinstance(val, (int, float)) and not math.isnan(val):
                            updates[str(row)] = float(val)
                            valid += 1
                        else:
                            updates[str(row)] = None
                    ckpt = load_checkpoint()
                    ckpt.setdefault(metric_name, {}).update(updates)
                    if valid == 0:
                        fkey = f"{metric_name}:{batch[0]}"
                        ckpt.setdefault("_failures", {})[fkey] = (
                            ckpt["_failures"].get(fkey, 0) + 1
                        )
                    else:
                        ckpt.setdefault("_failures", {}).pop(key, None)
                    _atomique_save(ckpt)
                    log(
                        "Worker %s : %s lot %d-%d termine (%d/%d valides)",
                        tag,
                        metric_name,
                        batch[0] + 1,
                        batch[-1] + 1,
                        valid,
                        len(batch),
                    )
                except Exception as exc:
                    ckpt = load_checkpoint()
                    fkey = f"{metric_name}:{batch[0]}"
                    ckpt.setdefault("_failures", {})[fkey] = (
                        ckpt["_failures"].get(fkey, 0) + 1
                    )
                    _atomique_save(ckpt)
                    log(
                        "Worker %s : ERREUR %s lot %d-%d tentative %d : %s - rejoue",
                        tag,
                        metric_name,
                        batch[0] + 1,
                        batch[-1] + 1,
                        ckpt["_failures"].get(fkey, 0),
                        exc,
                    )
                    time.sleep(30)
        log("Worker %s TERMINE", tag)
    finally:
        pid_file.unlink(missing_ok=True)


def _shrink_contexts(dataset, max_chars_per_passage=240, max_total=1100):
    """Tronque les contextes du dataset pour ne pas dépasser la fenêtre du juge."""
    from datasets import Dataset

    df = dataset.to_pandas()

    def _shrink(passages):
        out, total = [], 0
        for p in passages:
            p = p if len(p) <= max_chars_per_passage else p[:max_chars_per_passage]
            if total + len(p) > max_total:
                break
            out.append(p)
            total += len(p)
        return out

    df["contexts"] = df["contexts"].map(_shrink)
    return Dataset.from_pandas(df)


def replay_missing():
    """Rejoue les lignes None (échecs antérieurs) pour chaque métrique."""
    if not acquire_lock():
        return
    questions = json.loads(
        (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    target = [q for q in questions if not q.get("needs_escalation")]

    embeddings = get_embedding_model()
    retriever = create_retriever(load_vectorstore(CHROMA_PERSIST_DIR, embeddings))
    chain = build_rag_chain(retriever, get_llm())
    judge = get_judge_llm()
    dataset = _shrink_contexts(build_eval_dataset(chain, retriever, target))
    n = len(dataset)
    ckpt = load_checkpoint()
    done = load_done_scores()

    for metric_name, metric in METRICS.items():
        metric_state = ckpt.setdefault(metric_name, {})
        missing = [i for i in range(n) if metric_state.get(str(i)) is None]
        log(
            "Replay %s : %d lignes None à rejouer",
            metric_name,
            len(missing),
        )
        while missing:
            batch = missing[:BATCH_SIZE]
            key = f"{metric_name}:{batch[0]}"
            failures = ckpt.setdefault("_failures", {})
            if failures.get(key, 0) >= 3:
                log(
                    "Replay %s lot %d-%d : 3 échecs, abandon (lignes restent None)",
                    metric_name,
                    batch[0] + 1,
                    batch[-1] + 1,
                )
                missing = missing[BATCH_SIZE:]
                continue
            log(
                "Replay %s : lot %d-%d",
                metric_name,
                batch[0] + 1,
                batch[-1] + 1,
            )
            subset = dataset.select(batch)
            try:
                result = evaluate(
                    subset,
                    metrics=[metric],
                    llm=judge,
                    embeddings=embeddings,
                    run_config=RunConfig(max_workers=1, timeout=1800, max_retries=0),
                )
                scores = result.to_pandas()[metric_name].tolist()
                valid = 0
                for row, val in zip(batch, scores, strict=True):
                    if isinstance(val, (int, float)) and not math.isnan(val):
                        metric_state[str(row)] = float(val)
                        valid += 1
                    else:
                        metric_state[str(row)] = None
                if valid == 0:
                    failures[key] = failures.get(key, 0) + 1
                else:
                    failures.pop(key, None)
                save_checkpoint(ckpt)
                log(
                    "Replay %s lot %d-%d termine : %d/%d valides",
                    metric_name,
                    batch[0] + 1,
                    batch[-1] + 1,
                    valid,
                    len(batch),
                )
            except Exception as exc:
                failures[key] = failures.get(key, 0) + 1
                save_checkpoint(ckpt)
                log(
                    "Replay %s lot %d-%d tentative %d : %s - rejoue",
                    metric_name,
                    batch[0] + 1,
                    batch[-1] + 1,
                    failures[key],
                    exc,
                )
                time.sleep(30)
            missing = [i for i in missing if metric_state.get(str(i)) is None]
        scores = [
            metric_state[str(i)]
            for i in range(n)
            if metric_state.get(str(i)) is not None
        ]
        if scores:
            done[metric_name] = sum(scores) / len(scores)
            save_done_scores({metric_name: done[metric_name]})
            log(
                "Replay %s TERMINEE = %s (%d/%d lignes)",
                metric_name,
                done[metric_name],
                len(scores),
                n,
            )

    (EVALUATION_DATA_DIR / "ragas_done.flag").write_text("done", encoding="utf-8")
    PID_FILE.unlink(missing_ok=True)
    log("REPLAY TERMINE")


if __name__ == "__main__":
    try:
        if "--worker" in sys.argv:
            idx = sys.argv.index("--worker")
            tag = sys.argv[idx + 1]
            metrics_arg = sys.argv[idx + 2].split(",")
            worker_main([m for m in metrics_arg if m in METRICS], tag)
        elif "--replay-missing" in sys.argv:
            replay_missing()
        else:
            main()
    except Exception as exc:
        log(f"ERREUR GLOBALE: {type(exc).__name__}: {exc}")
        PID_FILE.unlink(missing_ok=True)
        raise
