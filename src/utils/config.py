import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
DATA_DIR = PROJECT_ROOT / "data"
RAW_DATA_DIR = DATA_DIR / "raw"
PROCESSED_DATA_DIR = DATA_DIR / "processed"
EVALUATION_DATA_DIR = DATA_DIR / "evaluation"

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
LLM_MODEL = os.getenv("LLM_MODEL", "gpt-4o-mini")
GOOGLE_LLM_MODEL = os.getenv("GOOGLE_LLM_MODEL", "gemini-2.0-flash")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "text-embedding-3-small")
TEMPERATURE = float(os.getenv("TEMPERATURE", "0.0"))
MAX_TOKENS = int(os.getenv("MAX_TOKENS", "1000"))
TOP_K = int(os.getenv("TOP_K", "5"))
SCORE_THRESHOLD = float(os.getenv("SCORE_THRESHOLD", "0.5"))
CHROMA_PERSIST_DIR = Path(
    os.getenv("CHROMA_PERSIST_DIR", str(PROCESSED_DATA_DIR / "chroma_db"))
)
CHUNK_SIZE = int(os.getenv("CHUNK_SIZE", "300"))
CHUNK_OVERLAP = int(os.getenv("CHUNK_OVERLAP", "30"))
USE_OPENAI_EMBEDDINGS = os.getenv("USE_OPENAI_EMBEDDINGS", "true").lower() == "true"
HF_EMBEDDING_MODEL = os.getenv(
    "HF_EMBEDDING_MODEL", "sentence-transformers/all-MiniLM-L6-v2"
)
USE_GOOGLE_LLM = os.getenv("USE_GOOGLE_LLM", "false").lower() == "true"
USE_LOCAL_LLM = os.getenv("USE_LOCAL_LLM", "false").lower() == "true"
LOCAL_LLM_MODEL_PATH = os.getenv(
    "LOCAL_LLM_MODEL_PATH", "models/qwen2.5-1.5b-instruct-q4_k_m.gguf"
)
LOCAL_LLM_CONTEXT = int(os.getenv("LOCAL_LLM_CONTEXT", "2048"))
LOCAL_LLM_MAX_TOKENS = int(os.getenv("LOCAL_LLM_MAX_TOKENS", "512"))
CHAT_MAX_TOKENS = int(os.getenv("CHAT_MAX_TOKENS", "300"))
LOCAL_JUDGE_MAX_TOKENS = int(os.getenv("LOCAL_JUDGE_MAX_TOKENS", "128"))
LOCAL_JUDGE_CONTEXT = int(os.getenv("LOCAL_JUDGE_CONTEXT", "2048"))
LOCAL_JUDGE_TEMPERATURE = float(os.getenv("LOCAL_JUDGE_TEMPERATURE", "0.0"))
LOCAL_JUDGE_THREADS = int(os.getenv("LOCAL_JUDGE_THREADS", "6"))
LOCAL_LLM_THREADS = int(os.getenv("LOCAL_LLM_THREADS", "8"))
LOCAL_LLM_BATCH_SIZE = int(os.getenv("LOCAL_LLM_BATCH_SIZE", "128"))
