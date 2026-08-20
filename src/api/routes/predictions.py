"""Routes de prédiction : provisioning, churn, fraude."""

import statistics

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from src.api.database import Contract, User
from src.api.deps import get_current_user
from src.api.persistence import get_session
from src.api.schemas.provisioning import (
    ProvisioningBatchRequest,
    ProvisioningBatchResponse,
    ProvisioningPortfolioSummaryResponse,
    ProvisioningPredictRequest,
    ProvisioningPredictResponse,
)
from src.models.service import (
    MODELS_DIR,
    ChurnPredictor,
    FraudDetector,
    ProvisioningPredictor,
)

router = APIRouter(prefix="/predict", tags=["predict"])

VALID_PRODUCTS = ["Visa Études", "Visa Études Plus", "Horizon Retraite"]


class ContractFeatures(BaseModel):
    age: int = Field(ge=18, le=90)
    product: str
    premium: float = Field(gt=0)
    duration_years: int = Field(ge=1, le=50)
    sum_assured: float = Field(gt=0)


class ProvisioningOut(BaseModel):
    provisioning_amount: float


class ChurnOut(BaseModel):
    churn_probability: float
    risk_level: str


class TransactionIn(BaseModel):
    amount: float = Field(gt=0)
    type: str


class FraudOut(BaseModel):
    fraud_score: float
    is_fraud: bool


def _check_product(product: str) -> None:
    if product not in VALID_PRODUCTS:
        raise HTTPException(
            status_code=400,
            detail=f"Produit invalide : {product}. Produits attendus : {VALID_PRODUCTS}",
        )


def _risk_level(provision: float, sum_assured: float) -> str:
    """Niveau de risque heuristique : ratio provisionnement / capital assuré."""
    ratio = provision / sum_assured if sum_assured else 1.0
    if ratio < 0.5:
        return "low"
    if ratio < 0.65:
        return "medium"
    return "high"


def _to_contract_features(item: ProvisioningPredictRequest) -> dict:
    return {
        "age": item.age,
        "product": item.product,
        "premium": item.premium,
        "duration_years": item.duration_years,
        "sum_assured": item.sum_assured,
    }


@router.post("/provisioning", response_model=ProvisioningOut)
def predict_provisioning(
    features: ContractFeatures, user: User = Depends(get_current_user)
):
    _check_product(features.product)
    predictor = ProvisioningPredictor()
    amount = predictor.predict(features.model_dump())
    return ProvisioningOut(provisioning_amount=round(amount, 2))


@router.post("/provisioning/batch", response_model=ProvisioningBatchResponse)
def predict_provisioning_batch(
    payload: ProvisioningBatchRequest, user: User = Depends(get_current_user)
):
    predictor = ProvisioningPredictor()
    predictions = []
    amounts = []
    for item in payload.contracts:
        _check_product(item.product)
        amount = predictor.predict(_to_contract_features(item))
        predictions.append(
            ProvisioningPredictResponse(
                contract_id=item.contract_id,
                predicted_provision=round(amount, 2),
                risk_level=_risk_level(amount, item.sum_assured),
                explanation=(
                    f"Prédiction basée sur {item.product}, âge {item.age}, "
                    f"prime {item.premium:.0f} FCFA, durée {item.duration_years} ans."
                ),
            )
        )
        amounts.append(amount)
    return ProvisioningBatchResponse(
        predictions=predictions,
        total_provision=round(sum(amounts), 2),
        average_provision=round(statistics.mean(amounts), 2) if amounts else 0.0,
        statistics={
            "count": len(amounts),
            "min": round(min(amounts), 2) if amounts else 0.0,
            "max": round(max(amounts), 2) if amounts else 0.0,
            "stdev": round(statistics.stdev(amounts), 2) if len(amounts) > 1 else 0.0,
        },
    )


@router.get("/portfolio", response_model=ProvisioningPortfolioSummaryResponse)
def portfolio_summary(
    user: User = Depends(get_current_user), db: Session = Depends(get_session)
):
    contracts = db.query(Contract).all()
    if not contracts:
        return ProvisioningPortfolioSummaryResponse(
            total_provision=0.0,
            number_contracts=0,
            average_provision=0.0,
            min_provision=0.0,
            max_provision=0.0,
            by_product={},
            by_risk_level={},
        )
    amounts = [c.provisioning_amount for c in contracts]
    by_product: dict[str, float] = {}
    by_risk_level: dict[str, int] = {}
    for contract in contracts:
        by_product[contract.product] = by_product.get(contract.product, 0.0) + (
            contract.provisioning_amount or 0.0
        )
        level = _risk_level(contract.provisioning_amount, contract.sum_assured)
        by_risk_level[level] = by_risk_level.get(level, 0) + 1
    return ProvisioningPortfolioSummaryResponse(
        total_provision=round(sum(amounts), 2),
        number_contracts=len(contracts),
        average_provision=round(statistics.mean(amounts), 2),
        min_provision=round(min(amounts), 2),
        max_provision=round(max(amounts), 2),
        by_product={k: round(v, 2) for k, v in by_product.items()},
        by_risk_level=by_risk_level,
    )


@router.get("/model-info")
def model_info(user: User = Depends(get_current_user)):
    """Méta-données des modèles ML disponibles."""
    info = {}
    for name in ("provisioning", "churn", "fraud"):
        path = MODELS_DIR / f"{name}.pkl"
        info[name] = {
            "trained": path.exists(),
            "size_bytes": path.stat().st_size if path.exists() else None,
        }
    return info


@router.post("/churn", response_model=ChurnOut)
def predict_churn(features: ContractFeatures, user: User = Depends(get_current_user)):
    _check_product(features.product)
    predictor = ChurnPredictor()
    proba, label = predictor.predict(features.model_dump())
    return ChurnOut(churn_probability=round(proba, 4), risk_level=label)


@router.post("/fraud", response_model=FraudOut)
def predict_fraud(payload: TransactionIn, user: User = Depends(get_current_user)):
    predictor = FraudDetector()
    score, outlier = predictor.predict(payload.amount, payload.type)
    return FraudOut(fraud_score=score, is_fraud=outlier)
