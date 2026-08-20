"""Authentication service."""

import hashlib
from datetime import UTC, datetime, timedelta

import jwt

from src.core.config import settings
from src.core.exceptions import AuthenticationError, ValidationError


class AuthService:
    """Service for user authentication and token management."""

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash password using SHA256."""
        return hashlib.sha256(password.encode()).hexdigest()

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password against hash."""
        return AuthService.hash_password(plain_password) == hashed_password

    @staticmethod
    def create_access_token(
        user_id: int, email: str, username: str, role: str = "client"
    ) -> tuple[str, datetime]:
        """Create JWT access token."""
        expires = datetime.now(UTC) + timedelta(
            minutes=settings.access_token_expire_minutes
        )
        payload = {
            "sub": str(user_id),
            "email": email,
            "username": username,
            "role": role,
            "exp": expires,
            "iat": datetime.now(UTC),
        }
        token = jwt.encode(
            payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )
        return token, expires

    @staticmethod
    def create_refresh_token(user_id: int) -> str:
        """Create JWT refresh token."""
        expires = datetime.now(UTC) + timedelta(days=settings.refresh_token_expire_days)
        payload = {
            "sub": str(user_id),
            "type": "refresh",
            "exp": expires,
            "iat": datetime.now(UTC),
        }
        token = jwt.encode(
            payload,
            settings.jwt_secret_key,
            algorithm=settings.jwt_algorithm,
        )
        return token

    @staticmethod
    def verify_token(token: str) -> dict:
        """Verify and decode JWT token."""
        try:
            payload = jwt.decode(
                token,
                settings.jwt_secret_key,
                algorithms=[settings.jwt_algorithm],
            )
            return payload
        except jwt.ExpiredSignatureError as e:
            raise AuthenticationError("Token has expired") from e
        except jwt.InvalidTokenError as e:
            raise AuthenticationError("Invalid token") from e

    @staticmethod
    def validate_password(password: str) -> None:
        """Validate password strength."""
        if len(password) < 8:
            raise ValidationError("Password must be at least 8 characters long")
        if not any(c.isupper() for c in password):
            raise ValidationError("Password must contain at least one uppercase letter")
        if not any(c.isdigit() for c in password):
            raise ValidationError("Password must contain at least one digit")
