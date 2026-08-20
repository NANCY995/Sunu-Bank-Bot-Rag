import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from src.api import persistence
from src.api.database import Base, Contract, Transaction


class PersistenceTestCase(unittest.TestCase):
    def setUp(self):
        engine = create_engine(
            "sqlite:///:memory:", connect_args={"check_same_thread": False}
        )
        persistence.ENGINE = engine
        persistence.SessionLocal = sessionmaker(
            bind=engine, autoflush=False, expire_on_commit=False
        )
        Base.metadata.create_all(engine)
        self.db = persistence.SessionLocal()

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(persistence.ENGINE)

    def test_find_user_by_email(self):
        user = persistence.create_user(self.db, "a@b.tg", "alice", "hash", role="agent")
        self.assertEqual(persistence.find_user_by_email(self.db, "a@b.tg").id, user.id)
        self.assertIsNone(persistence.find_user_by_email(self.db, "x@y.tg"))

    def test_log_conversation_and_stats(self):
        user = persistence.create_user(self.db, "a@b.tg", "alice", "hash", role="agent")
        persistence.log_conversation(
            self.db, user.id, "Question", "Réponse", intent="comprendre_le_produit"
        )
        persistence.log_conversation(
            self.db, user.id, "Question2", "Réponse2", escalated=True
        )
        stats = persistence.get_stats(self.db)
        self.assertEqual(stats["users"], 1)
        self.assertEqual(stats["conversations"], 2)
        self.assertEqual(stats["escalations"], 1)

    def test_contracts_transactions_counted(self):
        self.db.add(
            Contract(
                contract_id="CT-1",
                product="Visa Études",
                age=30,
                premium=5000,
                duration_years=10,
                sum_assured=600000,
                provisioning_amount=200000,
            )
        )
        self.db.add(
            Transaction(
                transaction_id="TX-1", amount=1000, type="cotisation", is_fraud=True
            )
        )
        self.db.commit()
        stats = persistence.get_stats(self.db)
        self.assertEqual(stats["contracts"], 1)
        self.assertEqual(stats["frauds"], 1)


if __name__ == "__main__":
    unittest.main()
