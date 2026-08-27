"""Pydantic settings for SUNU BANK application."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        extra="ignore",
        case_sensitive=False,
    )

    # Database
    database_url: str = "postgresql://sunuuser:sunupass@localhost:5432/sunubank_db"
    database_echo: bool = False

    # Auth
    jwt_secret_key: str = "your-secret-key-change-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 7

    # API
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    api_workers: int = 4
    api_reload: bool = True
    cors_origins: list[str] = ["http://localhost:8501", "http://localhost:3000"]

    # RAG
    chroma_db_path: str = "./data/processed/chroma_db"
    chroma_persist: bool = True

    # Models
    models_path: str = "./models"
    use_local_llm: bool = True
    local_llm_model_path: str = "./models/qwen2.5-1.5b-instruct-q4_k_m.gguf"
    local_llm_context: int = 2048
    local_llm_max_tokens: int = 256
    local_judge_max_tokens: int = 128
    local_llm_threads: int = 4

    # Redis
    redis_url: str = "redis://localhost:6379"
    redis_enabled: bool = False

    # Logging
    log_level: str = "INFO"
    log_file: str = "./logs/app.log"
    log_format: str = "json"

    # App
    environment: str = "development"
    debug: bool = True
    secret_key: str = "your-app-secret-key"

    # Feature flags
    enable_admin_panel: bool = True
    enable_provisioning: bool = True
    enable_churn_prediction: bool = True
    enable_fraud_detection: bool = False


settings = Settings()
