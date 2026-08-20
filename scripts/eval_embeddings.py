import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.corpus.chunker import chunk_documents
from src.corpus.loader import load_corpus
from src.corpus.preprocessor import preprocess_documents
from src.evaluation.ragas_eval import run_retrieval_evaluation
from src.evaluation.retrieval_metrics import aggregate_scores
from src.indexing.vectorstore import create_vectorstore, load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

MODELS = [
    "sentence-transformers/all-MiniLM-L6-v2",
    "sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2",
]
CHUNK_SIZE = 300
CHUNK_OVERLAP = 30


def main():
    questions = json.loads(
        (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    documents = preprocess_documents(load_corpus())
    chunks = chunk_documents(
        documents, chunk_size=CHUNK_SIZE, chunk_overlap=CHUNK_OVERLAP
    )
    summary = {}
    for model_name in MODELS:
        from langchain_huggingface import HuggingFaceEmbeddings

        embeddings = HuggingFaceEmbeddings(model_name=model_name)
        label = model_name.split("/")[-1]
        persist_dir = CHROMA_PERSIST_DIR.parent / f"chroma_db_{label}"
        create_vectorstore(chunks, embeddings, persist_dir=persist_dir)
        vectorstore = load_vectorstore(persist_dir, embeddings)
        retriever = create_retriever(vectorstore, top_k=5)
        results = run_retrieval_evaluation(retriever, vectorstore, questions)
        aggregates = aggregate_scores(results)
        summary[label] = aggregates
        print(
            f"{label} : P@1={aggregates['precision_at_1']:.3f} P@5={aggregates['precision_at_5']:.3f} "
            f"hit@5={aggregates['source_hit_at_5']:.3f} MRR={aggregates['mrr']:.3f}"
        )
    output_path = EVALUATION_DATA_DIR / "embedding_experiment.json"
    output_path.write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    print(f"Résultats écrits dans {output_path}")


if __name__ == "__main__":
    sys.exit(main())
