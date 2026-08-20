from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain_core.documents import Document

from src.utils.config import RAW_DATA_DIR


def load_corpus(data_dir: str | Path | None = None) -> list[Document]:
    data_dir = Path(data_dir) if data_dir else RAW_DATA_DIR
    loader = DirectoryLoader(
        str(data_dir),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    return [
        doc
        for doc in loader.load()
        if Path(doc.metadata.get("source", "")).name != "README.md"
    ]
