import sys
import types


def install_ragas_compat() -> None:
    try:
        from langchain_community.chat_models.vertexai import ChatVertexAI
    except ImportError:
        module = types.ModuleType("langchain_community.chat_models.vertexai")

        class ChatVertexAI:
            def __init__(self, *args, **kwargs):
                raise NotImplementedError(
                    "VertexAI n'est pas disponible : utilisez un LLM OpenAI ou compatible."
                )

        module.ChatVertexAI = ChatVertexAI
        sys.modules["langchain_community.chat_models.vertexai"] = module
