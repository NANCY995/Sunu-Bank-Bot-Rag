import streamlit as st
from chat_interface import render_chat
from sidebar import render_sidebar

from src.generation.llm import get_llm
from src.generation.rag_chain import build_rag_chain
from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHAT_MAX_TOKENS, CHROMA_PERSIST_DIR

st.set_page_config(page_title="Assistant RAG SUNU Bank Togo", layout="wide")


@st.cache_resource
def init_rag():
    embedding_model = get_embedding_model()
    vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embedding_model)
    retriever = create_retriever(vectorstore)
    llm = get_llm(max_tokens=CHAT_MAX_TOKENS)
    chain = build_rag_chain(retriever, llm)
    return chain, retriever


def main():
    st.title("Assistant RAG — SUNU Bank Togo")
    st.caption(
        "Posez vos questions sur les produits d'assurance vie : Visa Études, Visa Études Plus et Horizon Retraite."
    )
    render_sidebar()
    try:
        chain, retriever = init_rag()
    except Exception as exc:
        st.error(f"Impossible d'initialiser l'assistant : {exc}")
        st.info(
            "Vérifiez que la base vectorielle est indexée (python main.py index) "
            "et que vos clés API sont configurées dans le fichier .env."
        )
        return
    render_chat(chain, retriever)


if __name__ == "__main__":
    main()
