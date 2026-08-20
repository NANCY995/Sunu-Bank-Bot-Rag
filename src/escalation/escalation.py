from src.generation.prompts import OUT_OF_SCOPE_KEYWORDS
from src.intents.intent_classifier import INTENT_ESCALATE, detect_intent


def should_escalate(
    question: str,
    retrieved_docs,
    similarity_scores: list | None = None,
) -> dict:
    intent = detect_intent(question)
    if intent in INTENT_ESCALATE:
        return {
            "escalate": True,
            "reason": f"Intention détectée nécessitant une escalade : {intent}",
            "intent": intent,
        }

    if not retrieved_docs:
        return {
            "escalate": True,
            "reason": "Aucun document pertinent trouvé pour cette question.",
            "intent": intent,
        }

    if similarity_scores and all(score < 0.5 for score in similarity_scores):
        return {
            "escalate": True,
            "reason": "Aucun document suffisamment pertinent trouvé.",
            "intent": intent,
        }

    question_lower = question.lower()
    for keyword in OUT_OF_SCOPE_KEYWORDS:
        if keyword in question_lower:
            return {
                "escalate": True,
                "reason": f"Question hors périmètre des produits d'assurance vie en bancassurance ({keyword}).",
                "intent": intent,
            }
    return {"escalate": False, "reason": None, "intent": intent}
