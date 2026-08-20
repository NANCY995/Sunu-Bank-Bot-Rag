import json
import logging

from src.intents.intent_classifier import detect_intent, detect_objection
from src.utils.config import EVALUATION_DATA_DIR

log = logging.getLogger("commercial_metrics")

RESULTS_PATH = EVALUATION_DATA_DIR / "commercial_evaluation.json"

GREETING_WORDS = ("bonjour", "bonsoir", "merci", "bienvenue", "ravi")
SOURCE_MARKERS = (
    "selon",
    "brochure",
    "fiche produit",
    "conditions générales",
    "notice",
    "contexte",
    "source",
    "spécifications",
)
DISCOVERY_MARKERS = ("quel", "quelle", "combien", "objectif", "budget", "horizon")
NEXT_STEP_MARKERS = (
    "conseiller",
    "rendez-vous",
    "agence",
    "simulation",
    "fiche récapitulative",
    "souhaitez-vous",
    "voulez-vous",
    "souhaiteriez-vous",
)
VALIDATION_MARKERS = (
    "je comprends",
    "bien sûr",
    "c'est une décision importante",
    "je vous comprends",
    "je note",
    "je prends note",
)
CONFIRM_MARKERS = ("est-ce que cela", "est-ce que ça", "cela répond", "ça vous rassure")


def ton_commercial(response: str) -> float:
    """Score [0, 1] du comportement commercial d'une réponse :
    accueil, reformulation, découverte, citation des sources, closing,
    longueur adaptée."""
    text = response.lower()
    score = 0.0

    if any(word in text for word in GREETING_WORDS):
        score += 0.2
    if any(marker in text for marker in SOURCE_MARKERS):
        score += 0.2
    if "?" in response and any(
        marker in text
        for marker in (*DISCOVERY_MARKERS, "souhaitez-vous", "voulez-vous")
    ):
        score += 0.2
    if any(marker in text for marker in NEXT_STEP_MARKERS):
        score += 0.2
    if 100 <= len(response) <= 800:
        score += 0.2

    return score


def objection_handled(question: str, response: str) -> float:
    """Score [0, 1] du respect du framework d'objection :
    Écouter → Diagnostiquer → Répondre → Prouver → Confirmer → Avancer."""
    text = response.lower()
    score = 0.0

    if detect_objection(question) is not None:
        score += 0.2
    if any(marker in text for marker in VALIDATION_MARKERS):
        score += 0.2
    if "?" in response:
        score += 0.2
    if any(marker in text for marker in SOURCE_MARKERS):
        score += 0.2
    if any(marker in text for marker in NEXT_STEP_MARKERS):
        score += 0.2

    return score


def run_commercial_evaluation(chain, retriever, test_questions) -> dict:
    """Évalue le comportement commercial des réponses générées sur un jeu de
    questions de test. Écrit les résultats dans data/evaluation/."""
    rows = []
    for item in test_questions:
        question = item["question"]
        docs = retriever.invoke(question)
        response = chain.invoke(question)
        rows.append(
            {
                "id": item.get("id"),
                "question": question,
                "response": response,
                "intent": detect_intent(question),
                "objection": detect_objection(question),
                "ton_commercial": ton_commercial(response),
                "objection_handled": objection_handled(question, response),
                "nb_sources": len(docs),
            }
        )

    n = len(rows)
    aggregates = {
        "ton_commercial_moyen": sum(r["ton_commercial"] for r in rows) / n
        if n
        else None,
        "objection_handled_moyen": (
            sum(r["objection_handled"] for r in rows) / n if n else None
        ),
        "part_reponses_avec_source": (
            sum(
                1
                for r in rows
                if any(m in r["response"].lower() for m in SOURCE_MARKERS)
            )
            / n
            if n
            else None
        ),
        "part_questions_objection": (
            sum(1 for r in rows if r["objection"] is not None) / n if n else None
        ),
    }
    results = {"aggregates": aggregates, "per_question": rows}
    RESULTS_PATH.write_text(
        json.dumps(results, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    log.info("Évaluation commerciale écrite dans %s", RESULTS_PATH)
    return results
