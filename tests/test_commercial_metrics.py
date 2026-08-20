import unittest

from src.evaluation.commercial_metrics import objection_handled, ton_commercial


class TestTonCommercial(unittest.TestCase):
    def test_bonne_reponse_commerciale(self):
        response = (
            "Bonjour, merci de votre question. Selon la fiche produit Visa Études, "
            "la cotisation minimale est de 5 000 FCFA par mois. "
            "Souhaitez-vous que je vous mette en relation avec un conseiller ?"
        )
        self.assertGreater(ton_commercial(response), 0.8)

    def test_reponse_seche(self):
        response = "Oui."
        self.assertLess(ton_commercial(response), 0.4)

    def test_reponse_sans_source_ni_closing(self):
        response = "Le produit est disponible dans toutes nos agences."
        score = ton_commercial(response)
        self.assertLess(score, 0.6)

    def test_reponse_trop_longue_penalisee(self):
        response = "Bonjour. " * 200
        self.assertLess(ton_commercial(response), 0.8)


class TestObjectionHandled(unittest.TestCase):
    def test_objection_prix_bien_handlee(self):
        question = "C'est trop cher pour mon budget."
        response = (
            "Je comprends tout à fait votre préoccupation. Quand vous dites trop cher, "
            "vous voulez dire par rapport à votre budget mensuel ? "
            "Selon la fiche produit, la cotisation minimale est de 5 000 FCFA par mois. "
            "Est-ce que cela répond à votre préoccupation ? "
            "Souhaitez-vous que je vous mette en relation avec un conseiller ?"
        )
        self.assertGreater(objection_handled(question, response), 0.8)

    def test_objection_non_handlee(self):
        question = "Je dois réfléchir."
        response = "D'accord."
        self.assertLess(objection_handled(question, response), 0.5)

    def test_pas_objection(self):
        response = (
            "Selon le contexte, le taux minimum garanti est de 3,5 %. "
            "Souhaitez-vous plus de détails ?"
        )
        self.assertGreaterEqual(objection_handled("Quel est le taux ?", response), 0.0)


if __name__ == "__main__":
    unittest.main()
