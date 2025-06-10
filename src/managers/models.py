from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from src.core.base import Base


class SiteManagers(Base):
    __tablename__ = 'sitemanagers'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    global_telegram: Mapped[str] = mapped_column(String, nullable=True)
    global_whatsapp: Mapped[str] = mapped_column(String, nullable=True)
    global_number: Mapped[str] = mapped_column(String, nullable=True)