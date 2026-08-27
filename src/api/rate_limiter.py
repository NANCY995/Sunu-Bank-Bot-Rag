"""Module de limitation de débit (Rate Limiting) en mémoire pour protéger l'API.

Protège contre les attaques de type 'Denial of Wallet' (appels répétés et coûteux aux LLM)
et le bruteforce d'authentification sans introduire de dépendance externe obligatoire.
"""

import time
from collections import defaultdict
from fastapi import HTTPException, Request, status


class InMemoryRateLimiter:
    """Limiteur de requêtes simple basé sur fenêtre glissante en mémoire."""

    def __init__(self):
        # Stocke les timestamps de requêtes par clé : key -> list[float]
        self._records: dict[str, list[float]] = defaultdict(list)

    def check(self, key: str, max_requests: int, window_seconds: int = 60) -> None:
        """Vérifie si la limite de requêtes a été dépassée pour la clé donnée."""
        now = time.time()
        cutoff = now - window_seconds
        # Nettoyage des anciennes requêtes
        self._records[key] = [t for t in self._records[key] if t > cutoff]

        if len(self._records[key]) >= max_requests:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Trop de requêtes. Limite de {max_requests} requêtes/{window_seconds}s atteinte. Veuillez patienter.",
            )

        self._records[key].append(now)


# Instance partagée du rate limiter
rate_limiter = InMemoryRateLimiter()


def rate_limit(max_requests: int = 20, window_seconds: int = 60):
    """Dépendance FastAPI pour limiter le débit par IP ou utilisateur."""

    async def _rate_limiter_dep(request: Request):
        client_ip = request.client.host if request.client else "anonymous"
        # Combine l'IP et le chemin d'URL comme clé d'identification
        key = f"{client_ip}:{request.url.path}"
        rate_limiter.check(key, max_requests=max_requests, window_seconds=window_seconds)

    return _rate_limiter_dep
