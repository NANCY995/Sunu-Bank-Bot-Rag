"""Client HTTP minimal vers l'API FastAPI du portail."""

from __future__ import annotations

from typing import Any

import requests


class ApiClient:
    """Wrapper léger sur l'API REST SUNU Bank (auth bearer + endpoints)."""

    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip("/")
        self.token: str | None = None

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        return headers

    def _request(
        self,
        method: str,
        path: str,
        payload: dict | None = None,
    ) -> tuple[Any | None, str | None]:
        try:
            response = requests.request(
                method,
                f"{self.base_url}{path}",
                json=payload,
                headers=self._headers(),
                timeout=60,
            )
        except requests.RequestException as exc:
            return None, f"Erreur réseau : {exc}"
        if response.status_code >= 400:
            try:
                detail = response.json().get("detail", response.text)
            except ValueError:
                detail = response.text
            return None, str(detail)
        try:
            return response.json(), None
        except ValueError:
            return response.text, None

    def health(self) -> bool:
        try:
            response = requests.get(
                self.base_url.replace("/api", "") + "/health", timeout=5
            )
            return response.status_code == 200
        except requests.RequestException:
            return False

    def login(self, email: str, password: str):
        data, error = self._request(
            "post", "/auth/login", {"email": email, "password": password}
        )
        if error:
            return None, None, error
        self.token = data["access_token"]
        return data["access_token"], data["user"], None

    def register(self, email: str, username: str, password: str, full_name: str = ""):
        data, error = self._request(
            "post",
            "/auth/register",
            {
                "email": email,
                "username": username,
                "password": password,
                "full_name": full_name,
            },
        )
        if error:
            return None, None, error
        return data.get("access_token"), data.get("user"), None

    def kpis(self):
        return self._request("get", "/dashboard/kpis")

    def rag_stats(self):
        return self._request("get", "/dashboard/rag")

    def predict_provisioning(self, features: dict):
        return self._request("post", "/predict/provisioning", features)

    def predict_provisioning_batch(self, contracts: list[dict]):
        return self._request(
            "post", "/predict/provisioning/batch", {"contracts": contracts}
        )

    def portfolio_summary(self):
        return self._request("get", "/predict/portfolio")

    def model_info(self):
        return self._request("get", "/predict/model-info")

    def predict_churn(self, features: dict):
        return self._request("post", "/predict/churn", features)

    def predict_fraud(self, amount: float, tx_type: str):
        return self._request(
            "post", "/predict/fraud", {"amount": amount, "type": tx_type}
        )

    def chat(self, question: str):
        return self._request("post", "/rag/chat", {"question": question})

    def list_users(self):
        return self._request("get", "/admin/users")

    def create_user(self, payload: dict):
        return self._request("post", "/admin/users", payload)

    def update_user(self, user_id: int, payload: dict):
        return self._request("patch", f"/admin/users/{user_id}", payload)
