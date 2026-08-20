from pathlib import Path
from threading import Lock

from langchain_core.language_models.llms import LLM
from langchain_core.outputs import Generation, LLMResult
from langchain_core.runnables import RunnableLambda
from pydantic import PrivateAttr

from src.utils.config import (
    GOOGLE_API_KEY,
    GOOGLE_LLM_MODEL,
    LLM_MODEL,
    LOCAL_JUDGE_CONTEXT,
    LOCAL_JUDGE_MAX_TOKENS,
    LOCAL_JUDGE_TEMPERATURE,
    LOCAL_JUDGE_THREADS,
    LOCAL_LLM_BATCH_SIZE,
    LOCAL_LLM_CONTEXT,
    LOCAL_LLM_MAX_TOKENS,
    LOCAL_LLM_MODEL_PATH,
    LOCAL_LLM_THREADS,
    MAX_TOKENS,
    OPENAI_API_KEY,
    PROJECT_ROOT,
    TEMPERATURE,
    USE_GOOGLE_LLM,
    USE_LOCAL_LLM,
)

_LOCAL_LLM_INSTANCE = None
_LOCAL_LLM_LOCK = Lock()


class LocalLlamaLLM(LLM):
    """Juge LLM local compatible avec l'interface langchain-core (BaseLLM).

    Utilisé par RAGAS pour l'évaluation automatique sans clé API externe.
    Un verrou sérialise les appels : llama-cpp n'est pas thread-safe et
    RAGAS évalue les lignes en parallèle.
    """

    model_path: str
    n_ctx: int = 2048
    n_threads: int = LOCAL_LLM_THREADS
    temperature: float = 0.0
    max_tokens: int = 512

    _llm: object | None = PrivateAttr(default=None)
    _lock: Lock = PrivateAttr(default_factory=Lock)

    @property
    def _llm_type(self) -> str:
        return "local-llama-gguf"

    def _get_llm_instance(self):
        if self._llm is None:
            import llama_cpp

            self._llm = llama_cpp.Llama(
                model_path=self.model_path,
                n_ctx=self.n_ctx,
                n_threads=self.n_threads,
                n_batch=LOCAL_LLM_BATCH_SIZE,
                verbose=False,
            )
        return self._llm

    def _call(self, prompt: str, stop=None, run_manager=None, **kwargs) -> str:
        with self._lock:
            return self._raw_generate(prompt)

    def _generate(self, prompts, stop=None, run_manager=None, **kwargs):
        generations = []
        for prompt in prompts:
            with self._lock:
                text = self._raw_generate(prompt)
            generations.append([Generation(text=text)])
        return LLMResult(generations=generations)

    def _raw_generate(self, prompt: str) -> str:
        llm = self._get_llm_instance()
        out = llm.create_chat_completion(
            messages=[{"role": "user", "content": prompt}],
            max_tokens=self.max_tokens,
            temperature=self.temperature,
        )
        return out["choices"][0]["message"]["content"] or ""


def _get_local_llm_instance():
    global _LOCAL_LLM_INSTANCE
    if _LOCAL_LLM_INSTANCE is None:
        import llama_cpp

        model_path = Path(LOCAL_LLM_MODEL_PATH)
        if not model_path.is_absolute():
            model_path = PROJECT_ROOT / model_path
        _LOCAL_LLM_INSTANCE = llama_cpp.Llama(
            model_path=str(model_path),
            n_ctx=LOCAL_LLM_CONTEXT,
            n_threads=LOCAL_LLM_THREADS,
            n_batch=LOCAL_LLM_BATCH_SIZE,
            verbose=False,
        )
    return _LOCAL_LLM_INSTANCE


def _local_invoke(prompt_value) -> str:
    llm = _get_local_llm_instance()
    with _LOCAL_LLM_LOCK:
        if hasattr(prompt_value, "to_messages"):
            messages = prompt_value.to_messages()
        elif isinstance(prompt_value, list):
            messages = prompt_value
        else:
            messages = [{"role": "user", "content": str(prompt_value)}]
        chat = []
        for message in messages:
            role = getattr(message, "type", None) or message.get("role", "user")
            content = (
                message.content
                if hasattr(message, "content")
                else message.get("content", "")
            )
            chat.append(
                {"role": "system" if role == "system" else "user", "content": content}
            )
        out = llm.create_chat_completion(
            messages=chat,
            max_tokens=LOCAL_LLM_MAX_TOKENS,
            temperature=TEMPERATURE,
        )
        return out["choices"][0]["message"]["content"]


def _google_invoke(prompt_value, max_tokens: int | None = None) -> str:
    from google import genai

    client = genai.Client(api_key=GOOGLE_API_KEY)
    if hasattr(prompt_value, "to_messages"):
        messages = prompt_value.to_messages()
    elif isinstance(prompt_value, list):
        messages = prompt_value
    else:
        messages = [{"role": "user", "content": str(prompt_value)}]
    system_parts = []
    chat = []
    for message in messages:
        role = getattr(message, "type", None) or message.get("role", "user")
        content = (
            message.content
            if hasattr(message, "content")
            else message.get("content", "")
        )
        if role == "system":
            system_parts.append(content)
        else:
            chat.append({"role": "user", "content": content})
    response = client.models.generate_content(
        model=GOOGLE_LLM_MODEL,
        contents=[
            {"role": "user", "parts": [{"text": msg["content"]}]} for msg in chat
        ],
        config={
            "system_instruction": "\n\n".join(system_parts) if system_parts else None,
            "temperature": TEMPERATURE,
            "max_output_tokens": max_tokens or LOCAL_LLM_MAX_TOKENS,
        },
    )
    return response.text


def get_llm(
    model_name: str | None = None,
    temperature: float | None = None,
    max_tokens: int | None = None,
):
    if USE_GOOGLE_LLM and GOOGLE_API_KEY:
        effective_tokens = max_tokens or LOCAL_LLM_MAX_TOKENS
        return RunnableLambda(
            lambda prompt_value: _google_invoke(prompt_value, effective_tokens)
        )
    if USE_LOCAL_LLM:
        return RunnableLambda(_local_invoke)
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=model_name or LLM_MODEL,
        temperature=TEMPERATURE if temperature is None else temperature,
        max_tokens=MAX_TOKENS if max_tokens is None else max_tokens,
        api_key=OPENAI_API_KEY or None,
    )


def get_judge_llm():
    """LLM juge pour RAGAS : local si USE_LOCAL_LLM, sinon OpenAI."""
    if USE_LOCAL_LLM:
        model_path = Path(LOCAL_LLM_MODEL_PATH)
        if not model_path.is_absolute():
            model_path = PROJECT_ROOT / model_path
        return LocalLlamaLLM(
            model_path=LOCAL_LLM_MODEL_PATH,
            n_ctx=LOCAL_JUDGE_CONTEXT,
            n_threads=LOCAL_JUDGE_THREADS,
            temperature=LOCAL_JUDGE_TEMPERATURE,
            max_tokens=LOCAL_JUDGE_MAX_TOKENS,
        )
    from langchain_openai import ChatOpenAI

    return ChatOpenAI(
        model=LLM_MODEL,
        temperature=0.0,
        max_tokens=MAX_TOKENS,
        api_key=OPENAI_API_KEY or None,
    )
