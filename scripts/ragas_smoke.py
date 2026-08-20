import argparse
import json
import os
import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(PROJECT_ROOT))

os.environ["USE_LOCAL_LLM"] = "true"

from src.utils.ragas_compat import install_ragas_compat

install_ragas_compat()

from src.evaluation.ragas_eval import run_ragas_evaluation
from src.generation.llm import get_judge_llm, get_llm
from src.generation.rag_chain import build_rag_chain
from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHROMA_PERSIST_DIR, EVALUATION_DATA_DIR

parser = argparse.ArgumentParser()
parser.add_argument("--limit", type=int, default=3)
args = parser.parse_args()

questions_path = EVALUATION_DATA_DIR / "test_questions.json"
questions = json.loads(questions_path.read_text(encoding="utf-8"))["questions"][
    : args.limit
]

embeddings = get_embedding_model()
vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
retriever = create_retriever(vectorstore)
judge_llm = get_judge_llm()
answer_llm = get_llm()
chain = build_rag_chain(retriever, answer_llm)

print(f"Questions de test: {len(questions)}")
result = run_ragas_evaluation(
    chain, retriever, questions, llm=judge_llm, embeddings=embeddings
)
print(result)
