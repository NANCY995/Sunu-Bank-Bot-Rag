import re

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.utils.config import CHUNK_OVERLAP, CHUNK_SIZE


def extract_section(text: str) -> str:
    match = re.search(r"^#+\s+(.+)$", text, flags=re.MULTILINE)
    return match.group(1).strip() if match else ""


def chunk_documents(
    documents: list[Document],
    chunk_size: int | None = None,
    chunk_overlap: int | None = None,
) -> list[Document]:
    chunk_size = chunk_size or CHUNK_SIZE
    chunk_overlap = CHUNK_OVERLAP if chunk_overlap is None else chunk_overlap
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        separators=["\n## ", "\n### ", "\n\n", "\n", ". ", " "],
    )
    chunks = splitter.split_documents(documents)
    for i, chunk in enumerate(chunks):
        chunk.metadata["chunk_id"] = i
        chunk.metadata["section"] = extract_section(chunk.page_content)
    return chunks
