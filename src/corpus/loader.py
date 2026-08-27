import logging
from pathlib import Path

from langchain_community.document_loaders import DirectoryLoader, PyPDFLoader, TextLoader
from langchain_core.documents import Document

from src.utils.config import RAW_DATA_DIR

log = logging.getLogger("corpus_loader")


def load_corpus(data_dir: str | Path | None = None) -> list[Document]:
    data_dir = Path(data_dir) if data_dir else RAW_DATA_DIR
    documents: list[Document] = []
    
    # 1. Chargement des fichiers Markdown / Textes
    md_loader = DirectoryLoader(
        str(data_dir),
        glob="**/*.md",
        loader_cls=TextLoader,
        loader_kwargs={"encoding": "utf-8"},
    )
    for doc in md_loader.load():
        if Path(doc.metadata.get("source", "")).name != "README.md":
            doc.metadata["file_type"] = "markdown"
            doc.metadata["file_name"] = Path(doc.metadata.get("source", "")).name
            documents.append(doc)

    # 2. Chargement structurel des PDF (Deux couches : page-level + metadata)
    for pdf_path in data_dir.glob("**/*.pdf"):
        try:
            pdf_loader = PyPDFLoader(str(pdf_path))
            pdf_docs = pdf_loader.load()
            for p_doc in pdf_docs:
                p_doc.metadata["file_type"] = "pdf"
                p_doc.metadata["file_name"] = pdf_path.name
            documents.extend(pdf_docs)
            log.info("PDF chargé avec succès: %s (%d pages)", pdf_path.name, len(pdf_docs))
        except Exception as exc:
            log.warning("Impossible de parser le PDF %s : %s", pdf_path.name, exc)
            
    return documents

