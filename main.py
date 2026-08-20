import argparse


def cmd_index():
    from src.corpus.chunker import chunk_documents
    from src.corpus.loader import load_corpus
    from src.corpus.preprocessor import preprocess_documents
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import create_vectorstore
    from src.utils.logger import get_logger

    logger = get_logger()
    logger.info("Chargement du corpus...")
    documents = load_corpus()
    logger.info("Prétraitement...")
    documents = preprocess_documents(documents)
    logger.info("Découpage en chunks...")
    chunks = chunk_documents(documents)
    logger.info(f"Création de la base vectorielle ({len(chunks)} chunks)...")
    embeddings = get_embedding_model()
    create_vectorstore(chunks, embeddings)
    logger.info("Indexation terminée.")


def cmd_chat():
    from src.escalation.escalation import should_escalate
    from src.generation.llm import get_llm
    from src.generation.rag_chain import build_rag_chain
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import load_vectorstore
    from src.retrieval.retriever import create_retriever
    from src.utils.config import CHROMA_PERSIST_DIR

    embeddings = get_embedding_model()
    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
    retriever = create_retriever(vectorstore)
    llm = get_llm()
    chain = build_rag_chain(retriever, llm)
    print("Assistant prêt. Tapez 'quit' pour quitter.")
    while True:
        question = input("> ").strip()
        if question.lower() in ("quit", "exit", "q"):
            break
        if not question:
            continue
        docs = retriever.invoke(question)
        if should_escalate(question, docs)["escalate"]:
            print("Cette question nécessite l'intervention d'un conseiller humain.")
        else:
            print(chain.invoke(question))
            print()


def cmd_eval_retrieval():
    import json

    from src.evaluation.ragas_eval import run_retrieval_evaluation
    from src.evaluation.retrieval_metrics import aggregate_scores
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import load_vectorstore
    from src.retrieval.retriever import create_retriever
    from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

    questions_path = EVALUATION_DATA_DIR / "test_questions.json"
    if not questions_path.exists():
        print("Fichier data/evaluation/test_questions.json introuvable.")
        return
    questions = json.loads(questions_path.read_text(encoding="utf-8"))["questions"]
    embeddings = get_embedding_model()
    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
    retriever = create_retriever(vectorstore)
    results = run_retrieval_evaluation(retriever, vectorstore, questions)
    aggregated = aggregate_scores(results)
    output_path = EVALUATION_DATA_DIR / "retrieval_results.json"
    output_path.write_text(
        json.dumps(
            {"aggregates": aggregated, "per_question": results},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    print("Agrégats retrieval :")
    for metric, value in aggregated.items():
        print(f"  {metric}: {value:.3f}")
    print(f"Résultats détaillés écrits dans {output_path}")


def cmd_eval(limit: int | None = None):
    import json

    from src.evaluation.ragas_eval import full_evaluation
    from src.generation.llm import get_judge_llm, get_llm
    from src.generation.rag_chain import build_rag_chain
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import load_vectorstore
    from src.retrieval.retriever import create_retriever
    from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

    questions_path = EVALUATION_DATA_DIR / "test_questions.json"
    if not questions_path.exists():
        print("Fichier data/evaluation/test_questions.json introuvable.")
        return
    questions = json.loads(questions_path.read_text(encoding="utf-8"))["questions"]
    embeddings = get_embedding_model()
    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
    retriever = create_retriever(vectorstore)
    llm = get_llm()
    chain = build_rag_chain(retriever, llm)
    if limit is not None:
        print(f"Évaluation RAGAS limitée à {limit} question(s).")
    results = full_evaluation(
        chain,
        retriever,
        vectorstore,
        questions,
        llm=get_judge_llm(),
        embeddings=embeddings,
        limit=limit,
    )
    print(results)


def cmd_eval_commercial(limit: int | None = None):
    import json

    from src.evaluation.commercial_metrics import run_commercial_evaluation
    from src.generation.llm import get_llm
    from src.generation.rag_chain import build_rag_chain
    from src.indexing.embeddings import get_embedding_model
    from src.indexing.vectorstore import load_vectorstore
    from src.retrieval.retriever import create_retriever
    from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

    questions_path = EVALUATION_DATA_DIR / "test_questions.json"
    if not questions_path.exists():
        print("Fichier data/evaluation/test_questions.json introuvable.")
        return
    questions = json.loads(questions_path.read_text(encoding="utf-8"))["questions"]
    if limit is not None:
        questions = questions[:limit]
    embeddings = get_embedding_model()
    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
    retriever = create_retriever(vectorstore)
    llm = get_llm()
    chain = build_rag_chain(retriever, llm)
    results = run_commercial_evaluation(chain, retriever, questions)
    aggregates = results["aggregates"]
    print("Agrégats comportement commercial :")
    for metric, value in aggregates.items():
        if isinstance(value, float):
            print(f"  {metric}: {value:.3f}")
        else:
            print(f"  {metric}: {value}")
    print(
        f"Résultats détaillés écrits dans {EVALUATION_DATA_DIR / 'commercial_evaluation.json'}"
    )


def main():
    parser = argparse.ArgumentParser(description="Assistant RAG SUNU Éducation")
    subparsers = parser.add_subparsers(dest="command", required=True)
    subparsers.add_parser("index", help="Indexer le corpus dans la base vectorielle")
    subparsers.add_parser("chat", help="Lancer une conversation en ligne de commande")
    subparsers.add_parser(
        "eval-retrieval",
        help="Évaluer uniquement la recherche documentaire (sans LLM, sans clé API)",
    )
    eval_parser = subparsers.add_parser(
        "eval", help="Évaluer le pipeline avec RAGAS et les métriques de retrieval"
    )
    eval_parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limiter le nombre de questions évaluées (utile pour les tests locaux)",
    )
    commercial_parser = subparsers.add_parser(
        "eval-commercial",
        help="Évaluer le comportement commercial des réponses (ton, objections, closing)",
    )
    commercial_parser.add_argument(
        "--limit",
        type=int,
        default=None,
        help="Limiter le nombre de questions évaluées (utile pour les tests locaux)",
    )
    args = parser.parse_args()
    if args.command == "index":
        cmd_index()
    elif args.command == "chat":
        cmd_chat()
    elif args.command == "eval-retrieval":
        cmd_eval_retrieval()
    elif args.command == "eval":
        cmd_eval(limit=args.limit)
    elif args.command == "eval-commercial":
        cmd_eval_commercial(limit=args.limit)


if __name__ == "__main__":
    main()
