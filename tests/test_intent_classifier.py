import unittest

from src.intents.intent_classifier import (
    detect_intent,
    detect_objection,
    get_intent_label,
)


class TestIntentClassifier(unittest.TestCase):
    def test_detect_intent_comprendre_le_produit(self):
        intent = detect_intent("Qu'est-ce que couvre ce produit ?")
        self.assertEqual(intent, "comprendre_le_produit")

    def test_detect_intent_connaitre_les_garanties(self):
        intent = detect_intent("Quelles sont les garanties proposées ?")
        self.assertEqual(intent, "connaitre_les_garanties")

    def test_detect_intent_connaitre_les_exclusions(self):
        intent = detect_intent("Y a-t-il des exclusions pour le décès ?")
        self.assertEqual(intent, "connaitre_les_exclusions")

    def test_detect_intent_comprendre_les_cotisations(self):
        intent = detect_intent("Comment se calcule la cotisation ?")
        self.assertEqual(intent, "comprendre_les_cotisations")

    def test_detect_intent_connaitre_les_beneficiaires(self):
        intent = detect_intent("Qui peut être bénéficiaire ?")
        self.assertEqual(intent, "connaitre_les_beneficiaires")

    def test_detect_intent_preparer_une_souscription(self):
        intent = detect_intent("Comment préparer ma souscription ?")
        self.assertEqual(intent, "preparer_une_souscription")

    def test_detect_intent_demander_les_pieces_necessaires(self):
        intent = detect_intent("Quelles pièces faut-il fournir ?")
        self.assertEqual(intent, "demander_les_pieces_necessaires")

    def test_detect_intent_poser_une_question_hors_perimetre(self):
        intent = detect_intent("Comment déclarer un sinistre auto ?")
        self.assertEqual(intent, "poser_une_question_hors_perimetre")

    def test_detect_intent_demander_un_conseiller(self):
        intent = detect_intent("Je veux parler à un conseiller.")
        self.assertEqual(intent, "demander_un_conseiller")

    def test_get_intent_label(self):
        label = get_intent_label("connaitre_les_garanties")
        self.assertEqual(label, "Connaître les garanties")

    def test_detect_objection_prix(self):
        self.assertEqual(
            detect_objection("C'est trop cher pour mon budget."), "objection_prix"
        )

    def test_detect_objection_confiance(self):
        self.assertEqual(
            detect_objection("Je n'ai pas confiance dans les assurances."),
            "objection_confiance",
        )

    def test_detect_objection_timing(self):
        self.assertEqual(
            detect_objection("Je dois réfléchir avant de décider."), "objection_timing"
        )

    def test_detect_objection_concurrence(self):
        self.assertEqual(
            detect_objection("J'ai déjà une assurance chez une autre banque."),
            "objection_concurrence",
        )

    def test_detect_objection_none(self):
        self.assertIsNone(detect_objection("Quelles sont les garanties ?"))

    def test_detect_intent_objection_prix(self):
        intent = detect_intent("C'est trop cher, je n'ai pas les moyens.")
        self.assertEqual(intent, "objection_prix")

    def test_detect_intent_objection_prioritaire_hors_perimetre(self):
        intent = detect_intent("Je veux un crédit auto, c'est trop cher.")
        self.assertEqual(intent, "poser_une_question_hors_perimetre")

    def test_get_intent_label_objection(self):
        label = get_intent_label("objection_prix")
        self.assertEqual(label, "Objection sur le prix")


if __name__ == "__main__":
    unittest.main()
