"""Session SQLAlchemy et helpers de persistance (SQLite local)."""

from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker

from src.api.database import Base, Contract, Conversation, Transaction, User
from src.utils.config import PROJECT_ROOT

DB_PATH = PROJECT_ROOT / "data" / "sunu_portal.db"
ENGINE = create_engine(
    f"sqlite:///{DB_PATH}",
    connect_args={"check_same_thread": False},
)
SessionLocal = sessionmaker(bind=ENGINE, autoflush=False, expire_on_commit=False)


def init_db() -> None:
    """Crée les tables si absentes."""
    Base.metadata.create_all(ENGINE)


def get_session() -> Session:
    return SessionLocal()


def find_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def create_user(
    db: Session,
    email: str,
    username: str,
    password_hash: str,
    full_name: str = "",
    role: str = "agent",
) -> User:
    user = User(
        email=email,
        username=username,
        password_hash=password_hash,
        full_name=full_name,
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def log_conversation(
    db: Session,
    user_id: int,
    question: str,
    answer: str,
    intent: str = "",
    escalated: bool = False,
) -> Conversation:
    conv = Conversation(
        user_id=user_id,
        question=question,
        answer=answer,
        intent=intent,
        escalated=escalated,
    )
    db.add(conv)
    db.commit()
    db.refresh(conv)
    return conv


def get_stats(db: Session) -> dict:
    """KPIs globaux du portail."""
    users = db.query(User).count()
    conversations = db.query(Conversation).count()
    escalations = (
        db.query(Conversation).filter(Conversation.escalated.is_(True)).count()
    )
    contracts = db.query(Contract).count()
    transactions = db.query(Transaction).count()
    frauds = db.query(Transaction).filter(Transaction.is_fraud.is_(True)).count()
    return {
        "users": users,
        "conversations": conversations,
        "escalations": escalations,
        "contracts": contracts,
        "transactions": transactions,
        "frauds": frauds,
    }
