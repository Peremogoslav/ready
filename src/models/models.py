from uuid import uuid4

from sqlalchemy import Column, String, Integer, ForeignKey, Table, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID as SQLAlchemyUUID
from sqlalchemy.orm import relationship, Mapped, mapped_column
from src.core.base import Base

model_service_association = Table(
    "model_service_association",
    Base.metadata,
    Column("model_uuid", SQLAlchemyUUID(as_uuid=True), ForeignKey("models.uuid"), primary_key=True),
    Column("service_id", Integer, ForeignKey("services.id"), primary_key=True),
)


class ModelPhoto(Base):
    __tablename__ = "model_photos"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    model_uuid: Mapped[uuid4] = mapped_column(SQLAlchemyUUID(as_uuid=True), ForeignKey("models.uuid"))
    photo_url: Mapped[str] = mapped_column(String, nullable=False)

    model: Mapped["Models"] = relationship("Models", back_populates="photos")


class Models(Base):
    __tablename__ = "models"

    uuid: Mapped[uuid4] = mapped_column(SQLAlchemyUUID(as_uuid=True), primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String(150), unique=True, nullable=False)  # для SEO
    price_per_hour: Mapped[str] = mapped_column(String, nullable=True)
    price_per_foo: Mapped[str] = mapped_column(String, nullable=True)
    price_per_night: Mapped[str] = mapped_column(String, nullable=True)
    elit: Mapped[bool] = mapped_column(Boolean, nullable=True)
    new: Mapped[bool] = mapped_column(Boolean, nullable=True)
    indi: Mapped[bool] = mapped_column(Boolean, nullable=True)
    height: Mapped[str] = mapped_column(String, nullable=True)
    weight: Mapped[str] = mapped_column(String, nullable=True)
    boobs: Mapped[str] = mapped_column(String, nullable=True)
    place: Mapped[str] = mapped_column(String, nullable=True)
    number: Mapped[str] = mapped_column(String, nullable=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    photos: Mapped[list["ModelPhoto"]] = relationship("ModelPhoto", back_populates="model", cascade="all, delete-orphan")
    services: Mapped[list["Services"]] = relationship(
        "Services",
        secondary=model_service_association,
        back_populates="models",
        lazy="joined"
    )

class Services(Base):
    __tablename__ = "services"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, index=True)
    models: Mapped[list["Models"]] = relationship(
        "Models",
        secondary=model_service_association,
        back_populates="services",
        lazy="joined"
    )
