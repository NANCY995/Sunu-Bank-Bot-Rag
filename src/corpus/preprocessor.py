import re
from pathlib import Path

from langchain_core.documents import Document


def normalize_text(text: str) -> str:
    lines = [re.sub(r"[ \t]+", " ", line).strip() for line in text.splitlines()]
    return "\n".join(line for line in lines if line)


def classify_source(source: str) -> str:
    source = source.lower()
    if "spec" in source:
        return "spec_produits"
    if "condition" in source:
        return "conditions_generales"
    if "notice" in source:
        return "notice_information"
    if "faq" in source:
        return "faq"
    if "guide" in source:
        return "guide_souscription"
    return "autre"


def preprocess_documents(documents: list[Document]) -> list[Document]:
    for doc in documents:
        doc.page_content = normalize_text(doc.page_content)
        source = doc.metadata.get("source", "")
        doc.metadata["source_type"] = classify_source(source)
        doc.metadata["document"] = _short_name(source)
    return documents


def _short_name(source: str) -> str:
    return Path(source.replace("\\", "/")).name
