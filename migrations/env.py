from logging.config import fileConfig
import os
from sqlalchemy import engine_from_config, pool
from alembic import context

# Импорт Base с твоими моделями
from src.core.base import Base
from src.models.models import Models
from src.managers.models import SiteManagers
from src.models.models import Services
from src.auth.models import  User
from src.models.models import ModelPhoto
config = context.config

# Настраиваем logging из файла alembic.ini
fileConfig(config.config_file_name)

# Если используешь DATABASE_URL из переменных окружения, то подставляем его в конфиг
DATABASE_URL = os.getenv("DATABASE_URL")
if DATABASE_URL:
    config.set_main_option("sqlalchemy.url", DATABASE_URL)

target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode.

    Это генерирует SQL скрипты без подключения к базе.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Run migrations in 'online' mode.

    Это подключается к базе и выполняет миграции.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            compare_type=True,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
