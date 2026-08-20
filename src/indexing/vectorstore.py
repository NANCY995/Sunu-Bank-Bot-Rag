import logging
from pathlib import Path

import chromadb
from langchain_chroma import Chroma

from src.utils.config import CHROMA_PERSIST_DIR

COLLECTION_NAME = "sunu_bank_bancassurance"

log = logging.getLogger("vectorstore")


def create_vectorstore(
    chunks,
    embedding_model,
    persist_dir: str | Path | None = None,
):
    persist_dir = Path(persist_dir) if persist_dir else CHROMA_PERSIST_DIR
    persist_dir.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(persist_dir))
    try:
        client.delete_collection(COLLECTION_NAME)
    except Exception as exc:
        log.info(
            "Collection %s inexistante ou non supprimable : %s", COLLECTION_NAME, exc
        )
    client.get_or_create_collection(
        COLLECTION_NAME, metadata={"hnsw:space": "cosine"}
    )
    vectorstore = Chroma(
        client=client,
        collection_name=COLLECTION_NAME,
        embedding_function=embedding_model,
    )
    vectorstore.add_documents(documents=chunks)
    return vectorstore


def load_vectorstore(
    persist_dir: str | Path | None = None,
    embedding_model=None,
):
    persist_dir = Path(persist_dir) if persist_dir else CHROMA_PERSIST_DIR
    return Chroma(
        persist_directory=str(persist_dir),
        embedding_function=embedding_model,
        collection_name=COLLECTION_NAME,
    )
