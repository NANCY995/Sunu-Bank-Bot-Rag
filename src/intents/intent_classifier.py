from __future__ import annotations

from typing import Literal

INTENT_LABELS: dict[str, str] = {
    "comprendre_le_produit": "Comprendre le produit",
    "connaitre_les_garanties": "Connaître les garanties",
    "connaitre_les_exclusions": "Connaître les exclusions",
    "comprendre_les_cotisations": "Comprendre les cotisations",
    "connaitre_les_beneficiaires": "Connaître les bénéficiaires",
    "preparer_une_souscription": "Préparer une souscription",
    "demander_les_pieces_necessaires": "Demander les pièces nécessaires",
    "poser_une_question_hors_perimetre": "Question hors périmètre",
    "demander_un_conseiller": "Demander un conseiller",
    "objection_prix": "Objection sur le prix",
    "objection_confiance": "Objection sur la confiance",
    "objection_timing": "Objection sur le timing",
    "objection_concurrence": "Objection concurrence existante",
}

INTENT_ESCALATE = {
    "poser_une_question_hors_perimetre",
    "demander_un_conseiller",
}

OUT_OF_SCOPE_KEYWORDS = [
    "sinistre",
    "réclamation",
    "remboursement de soins",
    "résiliation de mon contrat",
    "accident de voiture",
    "assurance auto",
    "assurance santé",
    "crédit",
    "prêt",
    "pret",
    "placement boursier",
    "voyage",
    "santé",
    "auto",
    "voiture",
    "immobilier",
    "assurance habitation",
    "prêt immobilier",
]

ASK_ADVISOR_KEYWORDS = [
    "un conseiller",
    "le conseiller",
    "votre conseiller",
    "mon conseiller",
    "parler à",
    "parler a",
    "joindre",
    "appel",
    "contact",
    "rendez-vous",
    "accompagnement personnalisé",
    "qui peut m'aider",
    "aide humaine",
]

DOCUMENT_KEYWORDS = [
    "pièce",
    "document",
    "justificatif",
    "dossier",
    "papier",
]

SUBSCRIPTION_KEYWORDS = [
    "souscrire",
    "souscription",
    "adhérer",
    "adhésion",
    "proposition",
    "contrat",
    "offre",
    "ouvrir un contrat",
    "s'inscrire",
]

BENEFICIARY_KEYWORDS = [
    "bénéficiaire",
    "bénéficiaires",
    "enfant",
    "titulaire",
    "assuré",
    "cessionnaire",
]

PREMIUM_KEYWORDS = [
    "cotisation",
    "prime",
    "versement",
    "mensuel",
    "annuel",
    "montant",
    "échéance",
    "paiement",
    "taux",
]

GUARANTEE_KEYWORDS = [
    "garantie",
    "garanties",
    "couverture",
    "protection",
    "indemnité",
    "décès",
    "invalidité",
    "prévu",
]

EXCLUSION_KEYWORDS = [
    "exclusion",
    "exclusions",
    "non couvert",
    "pas couvert",
    "sauf",
    "hors périmètre",
    "ne couvre pas",
    "cas non",
    "risques exclus",
]

PRODUCT_KEYWORDS = [
    "produit",
    "assurance vie",
    "bancassurance",
    "fonctionnement",
    "qu'est-ce",
    "c'est quoi",
    "description",
    "objectif",
    "comment ça marche",
    "explication",
    "en quoi consiste",
    "détails du produit",
]

PRICE_OBJECTION_KEYWORDS = [
    "trop cher",
    "cher",
    "coûteux",
    "coûte",
    "prix élevé",
    "budget serré",
    "je n'ai pas les moyens",
    "pas les moyens",
    "c'est hors de prix",
    "dépense",
    "ça fait beaucoup",
    "trop d'argent",
    "argent pour ça",
]

CONFIDENCE_OBJECTION_KEYWORDS = [
    "pas confiance",
    "méfiance",
    "méfiant",
    "peur d'être arnaqué",
    "arnaqué",
    "escroquerie",
    "foutre l'argent en l'air",
    "perdre mon argent",
    "c'est une arnaque",
    "j'ai entendu dire",
    "on m'a dit que",
    "fiable",
    "sérieux",
]

TIMING_OBJECTION_KEYWORDS = [
    "je dois réfléchir",
    "je réfléchis",
    "je vais réfléchir",
    "je réfléchirai",
    "plus tard",
    "pas maintenant",
    "pas le temps",
    "je n'ai pas le temps",
    "je verrai",
    "on verra",
    "je reviendrai",
    "je reviens",
    "je vais y penser",
    "j'y penserai",
    "c'est trop tôt",
    "attendre",
]

CONCURRENCE_OBJECTION_KEYWORDS = [
    "déjà une assurance",
    "j'ai déjà une assurance",
    "déjà assuré",
    "j'ai un contrat",
    "chez un autre",
    "une autre assurance",
    "mon assurance actuelle",
    "je suis déjà couvert",
    "déjà couvert",
    "j'ai une autre",
]

IntentName = Literal[
    "comprendre_le_produit",
    "connaitre_les_garanties",
    "connaitre_les_exclusions",
    "comprendre_les_cotisations",
    "connaitre_les_beneficiaires",
    "preparer_une_souscription",
    "demander_les_pieces_necessaires",
    "poser_une_question_hors_perimetre",
    "demander_un_conseiller",
    "objection_prix",
    "objection_confiance",
    "objection_timing",
    "objection_concurrence",
]

DEFAULT_INTENT = "comprendre_le_produit"

OBJECTION_INTENTS: set[str] = {
    "objection_prix",
    "objection_confiance",
    "objection_timing",
    "objection_concurrence",
}


def detect_objection(question: str) -> str | None:
    """Détecte le type d'objection commerciale exprimée, ou None."""
    text = question.lower().strip()
    if not text:
        return None
    for intent, keywords in (
        ("objection_prix", PRICE_OBJECTION_KEYWORDS),
        ("objection_concurrence", CONCURRENCE_OBJECTION_KEYWORDS),
        ("objection_confiance", CONFIDENCE_OBJECTION_KEYWORDS),
        ("objection_timing", TIMING_OBJECTION_KEYWORDS),
    ):
        if any(keyword in text for keyword in keywords):
            return intent
    return None


def detect_intent(question: str) -> str:
    text = question.lower().strip()
    if not text:
        return DEFAULT_INTENT

    if any(keyword in text for keyword in ASK_ADVISOR_KEYWORDS):
        return "demander_un_conseiller"

    if any(keyword in text for keyword in OUT_OF_SCOPE_KEYWORDS):
        return "poser_une_question_hors_perimetre"

    objection = detect_objection(question)
    if objection is not None:
        return objection

    if any(keyword in text for keyword in DOCUMENT_KEYWORDS):
        return "demander_les_pieces_necessaires"

    if any(keyword in text for keyword in SUBSCRIPTION_KEYWORDS):
        return "preparer_une_souscription"

    if any(keyword in text for keyword in BENEFICIARY_KEYWORDS):
        return "connaitre_les_beneficiaires"

    if any(keyword in text for keyword in EXCLUSION_KEYWORDS):
        return "connaitre_les_exclusions"

    if any(keyword in text for keyword in GUARANTEE_KEYWORDS):
        return "connaitre_les_garanties"

    if any(keyword in text for keyword in PREMIUM_KEYWORDS):
        return "comprendre_les_cotisations"

    if any(keyword in text for keyword in PRODUCT_KEYWORDS):
        return "comprendre_le_produit"

    return DEFAULT_INTENT


def get_intent_label(intent: str) -> str:
    return INTENT_LABELS.get(intent, intent)
