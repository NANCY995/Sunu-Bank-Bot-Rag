import json
import logging
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

from src.evaluation.ragas_eval import run_ragas_evaluation
from src.generation.llm import get_judge_llm, get_llm
from src.generation.rag_chain import build_rag_chain
from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

LOG = os.path.join(PROJECT_ROOT, "data", "evaluation", "ragas_full.log")


def log(msg):
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(f"{time.strftime('%H:%M:%S')} {msg}\n")


def main():
    questions = json.loads(
        (EVALUATION_DATA_DIR / "test_questions.json").read_text(encoding="utf-8")
    )["questions"]
    target = [q for q in questions if not q.get("needs_escalation")]
    log(f"DEBUT: {len(target)} questions (sans pieges)")
    embeddings = get_embedding_model()
    retriever = create_retriever(load_vectorstore(CHROMA_PERSIST_DIR, embeddings))
    chain = build_rag_chain(retriever, get_llm())
    judge = get_judge_llm()
    t0 = time.time()
    result = run_ragas_evaluation(
        chain, retriever, target, llm=judge, embeddings=embeddings
    )
    log(f"FIN: duree {round((time.time() - t0) / 60, 1)} min")
    for metric in result:
        log(f"METRIC {metric} = {round(float(result[metric]), 3)}")
    summary = {m: round(float(result[m]), 3) for m in result}
    out_path = EVALUATION_DATA_DIR / "ragas_results_local.json"
    out_path.write_text(
        json.dumps(
            {"judge": "local-qwen2.5-1.5b", "scores": summary},
            ensure_ascii=False,
            indent=2,
        ),
        encoding="utf-8",
    )
    log(f"ECRIT: {out_path}")


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        log(f"ERREUR: {type(exc).__name__}: {exc}")
        raise
