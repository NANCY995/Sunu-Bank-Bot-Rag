import sys
from pathlib import Path

project_root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(project_root))

from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHROMA_PERSIST_DIR

embeddings = get_embedding_model()
vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
retriever = create_retriever(vectorstore)

queries = [
    "Comment fonctionne le tirage au sort sur Épargne Moov ?",
    "Quelles sont les conditions de Protect Plus pour l'hospitalisation ?",
    "Que dit l'Article 6 du Code CIMA ?"
]

for q in queries:
    print(f"\n==================== QUERY: {q} ====================")
    docs = retriever.invoke(q)
    for i, d in enumerate(docs[:2]):
        print(f"--- Doc {i+1} [section: {d.metadata.get('section')}, cat: {d.metadata.get('category')}, prod_id: {d.metadata.get('product_id')}]:")
        print(d.page_content[:250].strip().replace("\n", " "))
