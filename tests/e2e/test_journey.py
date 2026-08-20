"""Test E2E du parcours complet du portail : auth → chat RAG → prédictions."""

import contextlib
import os
import tempfile
import unittest

from fastapi.testclient import TestClient
from langchain_core.documents import Document
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import src.api.routes.rag as rag_module
from src.api import persistence
from src.api.database import Base, Contract
from src.api.main import create_app


class FakeChain:
    def invoke(self, question: str) -> str:
        return "Réponse générée pour le test."


class FakeRetriever:
    def invoke(self, question: str) -> list:
        return [Document(page_content="contenu", metadata={"document": "faq.md"})]


class E2EJourney(unittest.TestCase):
    """Parcours client complet via l'API REST."""

    def setUp(self):
        fd, self.db_path = tempfile.mkstemp(suffix=".db")
        os.close(fd)
        engine = create_engine(
            f"sqlite:///{self.db_path}", connect_args={"check_same_thread": False}
        )
        persistence.ENGINE = engine
        persistence.SessionLocal = sessionmaker(
            bind=engine, autoflush=False, expire_on_commit=False
        )
        Base.metadata.create_all(engine)
        self.db = persistence.SessionLocal()
        self.original_get_chain = rag_module._get_chain
        rag_module._get_chain = lambda: (FakeChain(), FakeRetriever())
        self.client = TestClient(create_app())

    def tearDown(self):
        self.client.close()
        self.db.close()
        Base.metadata.drop_all(persistence.ENGINE)
        persistence.ENGINE.dispose()
        rag_module._get_chain = self.original_get_chain
        with contextlib.suppress(PermissionError):
            os.unlink(self.db_path)

    def test_journey(self):
        # 1. Inscription
        response = self.client.post(
            "/api/auth/register",
            json={
                "email": "client@sunubank.tg",
                "username": "client",
                "password": "MotDePasse123",
                "full_name": "Client E2E",
            },
        )
        self.assertEqual(response.status_code, 201)
        headers = {"Authorization": f"Bearer {response.json()['access_token']}"}

        # 2. Chat RAG : question hors périmètre → escalade
        response = self.client.post(
            "/api/rag/chat",
            headers=headers,
            json={"question": "Comment déclarer un sinistre auto ?"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.json()["escalated"])

        # 3. Chat RAG : question produit → réponse générée
        response = self.client.post(
            "/api/rag/chat",
            headers=headers,
            json={"question": "Quelles sont les garanties de Visa Études ?"},
        )
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json()["escalated"])
        self.assertIn("test", response.json()["answer"])

        # 4. Prédiction provisioning + batch
        response = self.client.post(
            "/api/predict/provisioning",
            headers=headers,
            json={
                "age": 35,
                "product": "Visa Études",
                "premium": 50_000,
                "duration_years": 10,
                "sum_assured": 1_000_000,
            },
        )
        self.assertEqual(response.status_code, 200)
        self.assertGreater(response.json()["provisioning_amount"], 0)

        # 5. Portfolio (contrat en base)
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
        self.db.commit()
        response = self.client.get("/api/predict/portfolio", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["number_contracts"], 1)

        # 6. KPIs : la conversation a été journalisée
        response = self.client.get("/api/dashboard/kpis", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["conversations"], 2)
        self.assertEqual(response.json()["escalations"], 1)


if __name__ == "__main__":
    unittest.main()
