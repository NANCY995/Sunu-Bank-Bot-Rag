import contextlib
import hashlib
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
from src.api.deps import create_access_token
from src.api.main import create_app

PASSWORD = "MotDePasse123"
SETUP_EMAIL = "setup@sunubank.tg"


class FakeChain:
    def invoke(self, question: str) -> str:
        return "Réponse générée pour le test."


class FakeRetriever:
    def invoke(self, question: str) -> list:
        return [Document(page_content="contenu", metadata={"document": "faq.md"})]


class ApiTestCase(unittest.TestCase):
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
        persistence.create_user(
            self.db,
            SETUP_EMAIL,
            "setup",
            hashlib.sha256(PASSWORD.encode()).hexdigest(),
            role="agent",
        )

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

    def _register(self, email="agent@sunubank.tg"):
        response = self.client.post(
            "/api/auth/register",
            json={
                "email": email,
                "username": email.split("@")[0],
                "password": PASSWORD,
                "full_name": "Agent Test",
            },
        )
        return response

    def _login(self, email=SETUP_EMAIL):
        response = self.client.post(
            "/api/auth/login",
            json={"email": email, "password": PASSWORD},
        )
        token = response.json()["access_token"]
        return {"Authorization": f"Bearer {token}"}

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["status"], "healthy")

    def test_register_login_me(self):
        response = self._register()
        self.assertEqual(response.status_code, 201)
        user = response.json()["user"]
        self.assertEqual(user["role"], "agent")
        self.assertIn("access_token", response.json())

        response = self.client.get(
            "/api/auth/me", headers=self._login("agent@sunubank.tg")
        )
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["email"], "agent@sunubank.tg")

    def test_register_duplicate_409(self):
        self._register()
        response = self._register()
        self.assertEqual(response.status_code, 409)

    def test_login_wrong_password_401(self):
        self._register()
        response = self.client.post(
            "/api/auth/login",
            json={"email": "agent@sunubank.tg", "password": "MauvaisMdp123"},
        )
        self.assertEqual(response.status_code, 401)

    def test_me_requires_auth(self):
        response = self.client.get("/api/auth/me")
        self.assertEqual(response.status_code, 401)

    def test_dashboard_kpis(self):
        response = self.client.get("/api/dashboard/kpis", headers=self._login())
        self.assertEqual(response.status_code, 200)
        self.assertIn("users", response.json())

    def test_predict_provisioning(self):
        response = self.client.post(
            "/api/predict/provisioning",
            headers=self._login(),
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

    def test_predict_invalid_product_400(self):
        response = self.client.post(
            "/api/predict/provisioning",
            headers=self._login(),
            json={
                "age": 35,
                "product": "Visa Etudes",
                "premium": 50_000,
                "duration_years": 10,
                "sum_assured": 1_000_000,
            },
        )
        self.assertEqual(response.status_code, 400)

    def test_predict_provisioning_batch(self):
        contracts = [
            {
                "contract_id": "CT-1",
                "product": "Visa Études",
                "age": 35,
                "premium": 50_000,
                "duration_years": 10,
                "sum_assured": 1_000_000,
            },
            {
                "contract_id": "CT-2",
                "product": "Horizon Retraite",
                "age": 45,
                "premium": 100_000,
                "duration_years": 15,
                "sum_assured": 2_000_000,
            },
        ]
        response = self.client.post(
            "/api/predict/provisioning/batch",
            headers=self._login(),
            json={"contracts": contracts},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(len(data["predictions"]), 2)
        self.assertIn("total_provision", data)
        self.assertIn("statistics", data)

    def test_predict_portfolio(self):
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
        response = self.client.get("/api/predict/portfolio", headers=self._login())
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["number_contracts"], 1)
        self.assertEqual(data["total_provision"], 200000.0)
        self.assertIn("by_product", data)

    def test_model_info(self):
        response = self.client.get("/api/predict/model-info", headers=self._login())
        self.assertEqual(response.status_code, 200)
        self.assertIn("provisioning", response.json())

    def test_admin_requires_admin_role(self):
        self._register()
        response = self.client.get("/api/admin/users", headers=self._login())
        self.assertEqual(response.status_code, 403)

    def test_admin_flow(self):
        admin = persistence.create_user(
            self.db,
            "admin@sunubank.tg",
            "admin",
            "hash",
            role="admin",
        )
        token = create_access_token(admin)
        headers = {"Authorization": f"Bearer {token}"}
        response = self.client.get("/api/admin/users", headers=headers)
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.json()), 1)

    def test_rag_chat_escalated(self):
        response = self.client.post(
            "/api/rag/chat",
            headers=self._login(),
            json={"question": "Comment déclarer un sinistre auto ?"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertTrue(data["escalated"])
        self.assertEqual(data["intent"], "poser_une_question_hors_perimetre")

    def test_rag_chat_answer(self):
        response = self.client.post(
            "/api/rag/chat",
            headers=self._login(),
            json={"question": "Quelles sont les garanties de Visa Études ?"},
        )
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertFalse(data["escalated"])
        self.assertEqual(data["answer"], "Réponse générée pour le test.")


if __name__ == "__main__":
    unittest.main()
