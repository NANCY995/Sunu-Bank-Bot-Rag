"""Pydantic schemas for provisioning predictions.

Alignés sur les caractéristiques réellement utilisées par le modèle
`ProvisioningPredictor` (src/models/service.py).
"""

from pydantic import BaseModel, Field


class ProvisioningPredictRequest(BaseModel):
    """Request for provisioning prediction."""

    contract_id: str = Field(..., description="Contract ID")
    product: str = Field(..., description="Product type (Visa Études, etc.)")
    age: int = Field(..., ge=18, le=90, description="Customer age")
    premium: float = Field(..., gt=0, description="Premium amount (FCFA)")
    duration_years: int = Field(..., ge=1, le=50, description="Contract duration")
    sum_assured: float = Field(..., gt=0, description="Sum assured (FCFA)")


class ProvisioningPredictResponse(BaseModel):
    """Response with provisioning prediction."""

    contract_id: str
    predicted_provision: float = Field(..., description="Predicted provision amount")
    risk_level: str = Field(..., description="Risk level (low/medium/high)")
    explanation: str = Field(..., description="Explanation of prediction")


class ProvisioningBatchRequest(BaseModel):
    """Request for batch provisioning prediction."""

    contracts: list[ProvisioningPredictRequest] = Field(
        ..., description="List of contracts"
    )


class ProvisioningBatchResponse(BaseModel):
    """Response with batch provisioning predictions."""

    predictions: list[ProvisioningPredictResponse]
    total_provision: float
    average_provision: float
    statistics: dict = Field(..., description="Summary statistics")


class ProvisioningPortfolioSummaryResponse(BaseModel):
    """Portfolio provisioning summary (contrats en base)."""

    total_provision: float
    number_contracts: int
    average_provision: float
    min_provision: float
    max_provision: float
    by_product: dict = Field(..., description="Breakdown by product type")
    by_risk_level: dict = Field(..., description="Breakdown by risk level")
