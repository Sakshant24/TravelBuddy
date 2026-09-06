import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/travelBuddy"
)

# PostgreSQL engine with connection pooling
# pool_pre_ping=True — tests connections before use (handles stale/dropped connections)
# pool_size=10       — max persistent connections
# max_overflow=20    — extra connections allowed beyond pool_size under load
engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,
    pool_recycle=1800,  # recycle connections every 30 min to avoid timeouts
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session, always closes it after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()