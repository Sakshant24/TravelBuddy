import os
import sys
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context
from dotenv import load_dotenv

# ── Add backend/ to sys.path so Alembic can import our models ──
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

load_dotenv()

# Import Base + all models (this registers them on Base.metadata)
from database import Base
import models  # noqa: F401

# Alembic Config
config = context.config

# Override sqlalchemy.url from .env
# % must be doubled (%%) to avoid configparser interpolation errors
raw_url = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@localhost:5432/travelBuddy"
)
config.set_main_option("sqlalchemy.url", raw_url.replace("%", "%%"))

# Set up logging from alembic.ini
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# This is what tells Alembic what the schema SHOULD look like for autogenerate
target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations without a live DB connection (outputs SQL script)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )
    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations with a live DB connection."""
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )
        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
