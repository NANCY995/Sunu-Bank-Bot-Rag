import unittest

from src.models.service import (
    ChurnPredictor,
    FraudDetector,
    ProvisioningPredictor,
    generate_contracts,
    generate_transactions,
)


class TestDataGeneration(unittest.TestCase):
    def test_generate_contracts(self):
        df = generate_contracts(50)
        self.assertEqual(len(df), 50)
        self.assertIn("product", df.columns)
        self.assertTrue((df["premium"] > 0).all())

    def test_generate_transactions(self):
        df = generate_transactions(100)
        self.assertEqual(len(df), 100)
        self.assertIn("is_fraud", df.columns)


class TestProvisioningPredictor(unittest.TestCase):
    def test_train_and_predict(self):
        df = generate_contracts(150)
        predictor = ProvisioningPredictor()
        summary = predictor.train(df)
        self.assertIn("r2", summary)
        prediction = predictor.predict(
            {
                "age": 35,
                "product": "Visa Études",
                "premium": 50_000.0,
                "duration_years": 10,
                "sum_assured": 1_000_000.0,
            }
        )
        self.assertGreater(prediction, 0)


class TestChurnPredictor(unittest.TestCase):
    def test_train_and_predict(self):
        df = generate_contracts(150)
        predictor = ChurnPredictor()
        summary = predictor.train(df)
        self.assertIn("accuracy", summary)
        proba, label = predictor.predict(
            {
                "age": 45,
                "product": "Horizon Retraite",
                "premium": 100_000.0,
                "duration_years": 15,
                "sum_assured": 2_000_000.0,
            }
        )
        self.assertGreaterEqual(proba, 0.0)
        self.assertLessEqual(proba, 1.0)
        self.assertIn(label, ("risque élevé", "risque faible"))


class TestFraudDetector(unittest.TestCase):
    def test_train_and_predict(self):
        df = generate_transactions(150)
        predictor = FraudDetector()
        summary = predictor.train(df)
        self.assertIn("samples", summary)
        _, outlier = predictor.predict(5_000.0, "cotisation")
        self.assertIsInstance(outlier, bool)


if __name__ == "__main__":
    unittest.main()
