"""Routes de dashboard : KPIs globaux et statistiques RAG."""

import json

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from src.api.database import User
from src.api.deps import get_current_user
from src.api.persistence import get_session, get_stats
from src.utils.config import EVALUATION_DATA_DIR

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


def _load_json(name: str) -> dict:
    path = EVALUATION_DATA_DIR / name
    if not path.exists():
        return {}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (json.JSONDecodeError, OSError):
        return {}


@router.get("/kpis")
def kpis(user: User = Depends(get_current_user), db: Session = Depends(get_session)):
    return get_stats(db)


@router.get("/rag")
def rag_stats(user: User = Depends(get_current_user)):
    """Indicateurs d'évaluation RAG : retrieval + RAGAS."""
    retrieval = _load_json("retrieval_results.json")
    ragas = _load_json("ragas_results_local.json")
    questions = _load_json("test_questions.json")
    total = len(questions.get("questions", []))
    hors_pieges = sum(
        1 for q in questions.get("questions", []) if not q.get("needs_escalation")
    )
    # Agrégation des métriques retrieval (moyenne par champ)
    aggregated: dict[str, float] = {}
    if isinstance(retrieval, list):
        keys = [
            "precision_at_1",
            "precision_at_5",
            "source_hit_at_1",
            "source_hit_at_5",
            "mrr",
        ]
        for key in keys:
            values = [float(r[key]) for r in retrieval if r.get(key) is not None]
            if values:
                aggregated[key] = round(sum(values) / len(values), 3)
    return {
        "total_questions": total,
        "questions_hors_pieges": hors_pieges,
        "retrieval": aggregated,
        "ragas": ragas.get("scores", {}),
    }
