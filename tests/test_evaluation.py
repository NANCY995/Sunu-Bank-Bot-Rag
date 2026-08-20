import unittest

from src.evaluation.hallucination_detector import detect_hallucination, overlap_ratio


class TestHallucinationDetector(unittest.TestCase):
    def test_overlap_ratio_high(self):
        answer = "La cotisation minimale est de 5 000 FCFA par mois."
        context = "La cotisation minimale est de 5 000 FCFA par mois."
        self.assertGreater(overlap_ratio(answer, [context]), 0.8)

    def test_overlap_ratio_low(self):
        answer = "La formule du calcul fiscal est totalement différente."
        context = "Les garanties couvrent le décès et la rente éducation."
        self.assertLess(overlap_ratio(answer, [context]), 0.3)

    def test_detect_hallucination_flag(self):
        answer = "Le produit garantit un rendement de 25 % par an."
        context = "Le produit offre une garantie décès et une rente éducation."
        result = detect_hallucination(answer, [context])
        self.assertTrue(result["is_hallucinated"])


if __name__ == "__main__":
    unittest.main()
