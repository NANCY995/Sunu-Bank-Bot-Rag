from src.utils.config import (
    EMBEDDING_MODEL,
    HF_EMBEDDING_MODEL,
    USE_OPENAI_EMBEDDINGS,
)


def get_embedding_model():
    if USE_OPENAI_EMBEDDINGS:
        from langchain_openai import OpenAIEmbeddings

        return OpenAIEmbeddings(model=EMBEDDING_MODEL)
    from langchain_huggingface import HuggingFaceEmbeddings

    return HuggingFaceEmbeddings(model_name=HF_EMBEDDING_MODEL)
