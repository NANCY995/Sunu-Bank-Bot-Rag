"""Initialise la base du portail : admin par défaut + données simulées."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from src.api.database import Contract, Transaction, User
from src.api.persistence import SessionLocal, init_db
from src.models.service import (
    ChurnPredictor,
    FraudDetector,
    ProvisioningPredictor,
    generate_contracts,
    generate_transactions,
)

ADMIN_EMAIL = "admin@sunubank.tg"
ADMIN_PASSWORD = "admin1234"


def _hash_password(password: str) -> str:
    import hashlib

    return hashlib.sha256(password.encode()).hexdigest()


def main() -> None:
    init_db()
    db = SessionLocal()

    if db.query(User).filter(User.email == ADMIN_EMAIL).first() is None:
        db.add(
            User(
                email=ADMIN_EMAIL,
                username="admin",
                password_hash=_hash_password(ADMIN_PASSWORD),
                full_name="Administrateur SUNU Bank",
                role="admin",
            )
        )
        print("Admin créé :", ADMIN_EMAIL, "/", ADMIN_PASSWORD)

    if db.query(Contract).count() == 0:
        contracts = generate_contracts(500)
        for _, row in contracts.head(200).iterrows():
            db.add(
                Contract(
                    contract_id=f"CT-{row.name:05d}",
                    product=row["product"],
                    age=int(row["age"]),
                    premium=float(row["premium"]),
                    duration_years=int(row["duration_years"]),
                    sum_assured=float(row["sum_assured"]),
                    provisioning_amount=float(row["provisioning_amount"]),
                )
            )
        print("200 contrats simulés insérés.")

    if db.query(Transaction).count() == 0:
        transactions = generate_transactions(400)
        for _, row in transactions.iterrows():
            db.add(
                Transaction(
                    transaction_id=f"TX-{row.name:05d}",
                    amount=float(row["amount"]),
                    type=row["type"],
                    is_fraud=bool(row["is_fraud"]),
                    fraud_score=0.9 if row["is_fraud"] else 0.1,
                )
            )
        print("400 transactions simulées insérées.")

    db.commit()
    db.close()

    summary = {}
    for name, predictor in [
        ("provisioning", ProvisioningPredictor()),
        ("churn", ChurnPredictor()),
        ("fraud", FraudDetector()),
    ]:
        path = Path("data/models") / f"{name}.pkl"
        if not path.exists():
            summary[name] = predictor.train()
    print("Modèles :", summary or "déjà entraînés")
    print("Base prête.")


if __name__ == "__main__":
    main()
