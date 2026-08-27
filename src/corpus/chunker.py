import re

from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter

from src.utils.config import CHUNK_OVERLAP, CHUNK_SIZE


def extract_section(text: str) -> str:
    """Extrait le premier titre markdown de section dans un texte."""
    match = re.search(r"^#+\s+(.+)$", text, flags=re.MULTILINE)
    return match.group(1).strip() if match else ""


def extract_metadata_from_text(text: str) -> dict:
    metadata = {}
    
    # Extraction de la section / Titre
    section = extract_section(text)
    if section:
        metadata["section"] = section
        
    # Détection du code produit ID
    match_id = re.search(r"ID Produit\s*:\s*`?([A-Z0-9_-]+)`?", text)
    if match_id:
        metadata["product_id"] = match_id.group(1).strip()
        
    # Détection de la catégorie
    match_cat = re.search(r"Catégorie\s*:\s*(.+)$", text, flags=re.MULTILINE)
    if match_cat:
        metadata["category"] = match_cat.group(1).strip()
        
    # Détection de conformité CIMA
    if "CIMA" in text:
        metadata["is_cima_relevant"] = True
        
    return metadata


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
        separators=["\n## ", "\n### ", "\n#### ", "\n\n", "\n", ". ", " "],
    )
    all_chunks = []
    chunk_counter = 0
    for doc in documents:
        doc_section = doc.metadata.get("section") or extract_section(doc.page_content)
        split_chunks = splitter.split_documents([doc])
        current_section = doc_section
        for chunk in split_chunks:
            chunk.metadata["chunk_id"] = chunk_counter
            chunk_counter += 1
            extracted = extract_metadata_from_text(chunk.page_content)
            if "section" in extracted:
                current_section = extracted["section"]
            chunk.metadata["section"] = current_section
            chunk.metadata.update(extracted)
            all_chunks.append(chunk)
    return all_chunks

