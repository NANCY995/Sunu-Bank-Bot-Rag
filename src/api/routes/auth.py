"""Routes d'authentification : inscription, connexion, profil."""

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from sqlalchemy.orm import Session

from src.api.database import User
from src.api.deps import create_access_token, get_current_user
from src.api.persistence import find_user_by_email, get_session

router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=50)
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(default="", max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: str
    username: str
    full_name: str
    role: str
    is_active: bool


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


import hashlib
import hmac
import os
import secrets


def _hash_password(password: str) -> str:
    """Hache le mot de passe avec PBKDF2-HMAC-SHA256 et un sel cryptographique."""
    salt = secrets.token_hex(16)
    key = hashlib.pbkdf2_hmac("sha256", password.encode(), salt.encode(), 100_000)
    return f"pbkdf2_sha256${salt}${key.hex()}"


def _verify_password(plain: str, hashed: str) -> bool:
    """Vérifie le mot de passe avec support PBKDF2 et compatibilité SHA256 legacy."""
    if hashed.startswith("pbkdf2_sha256$"):
        parts = hashed.split("$")
        if len(parts) != 3:
            return False
        salt, stored_hash = parts[1], parts[2]
        key = hashlib.pbkdf2_hmac("sha256", plain.encode(), salt.encode(), 100_000)
        return hmac.compare_digest(key.hex(), stored_hash)
    # Rétrocompatibilité avec les hashs sha256 simples existants
    legacy_hash = hashlib.sha256(plain.encode()).hexdigest()
    return hmac.compare_digest(legacy_hash, hashed)


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(payload: RegisterRequest, db: Session = Depends(get_session)):
    if find_user_by_email(db, payload.email) is not None:
        raise HTTPException(status_code=409, detail="Email déjà utilisé")
    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=_hash_password(payload.password),
        full_name=payload.full_name,
        role="agent",
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    token = create_access_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_session)):
    user = find_user_by_email(db, payload.email)
    if user is None or not _verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Compte désactivé")
    token = create_access_token(user)
    return TokenResponse(access_token=token, user=UserOut.model_validate(user))


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(get_current_user)):
    return UserOut.model_validate(user)
