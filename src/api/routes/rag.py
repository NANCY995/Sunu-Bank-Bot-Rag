"""Route de conversation RAG via l'API."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.api.database import User
from src.api.deps import get_current_user
from src.api.persistence import get_session, log_conversation
from src.api.rate_limiter import rate_limit
from src.escalation.escalation import should_escalate
from src.generation.llm import get_llm
from src.generation.prompts import ESCALATION_MESSAGE
from src.generation.rag_chain import build_rag_chain
from src.indexing.embeddings import get_embedding_model
from src.indexing.vectorstore import load_vectorstore
from src.retrieval.retriever import create_retriever
from src.utils.config import CHAT_MAX_TOKENS, CHROMA_PERSIST_DIR

router = APIRouter(prefix="/rag", tags=["rag"])

_chain = None
_retriever = None


def _get_chain():
    global _chain, _retriever
    if _chain is None:
        embeddings = get_embedding_model()
        vectorstore = load_vectorstore(CHROMA_PERSIST_DIR, embeddings)
        _retriever = create_retriever(vectorstore)
        _chain = build_rag_chain(_retriever, get_llm(max_tokens=CHAT_MAX_TOKENS))
    return _chain, _retriever


class ChatRequest(BaseModel):
    question: str = Field(
        min_length=2,
        max_length=500,
        description="Question posée par l'utilisateur (2 à 500 caractères)",
    )


class ChatResponse(BaseModel):
    answer: str
    escalated: bool
    intent: str = ""


@router.post(
    "/chat",
    response_model=ChatResponse,
    dependencies=[Depends(rate_limit(max_requests=20, window_seconds=60))],
)
def chat(
    payload: ChatRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_session),
):
    chain, retriever = _get_chain()
    docs = retriever.invoke(payload.question)
    escalation = should_escalate(payload.question, docs)
    if escalation["escalate"]:
        answer = ESCALATION_MESSAGE.format(question=payload.question)
    else:
        answer = chain.invoke(payload.question)
    log_conversation(
        db,
        user_id=user.id,
        question=payload.question,
        answer=answer,
        intent=escalation.get("intent", ""),
        escalated=bool(escalation["escalate"]),
    )
    return ChatResponse(
        answer=answer,
        escalated=bool(escalation["escalate"]),
        intent=escalation.get("intent", ""),
    )
