from uuid import UUID
from pydantic import BaseModel, Field
from typing import Optional, List


class ServiceBase(BaseModel):
    name: str
    slug: str

    class Config:
        orm_mode = True


class ServiceCreate(BaseModel):
    name: str


class PhotoBase(BaseModel):
    photo_url: str

    class Config:
        orm_mode = True


class ModelBase(BaseModel):
    name: str
    slug: Optional[str] = None
    price_per_hour: Optional[str] = None
    price_per_foo: Optional[str] = None
    price_per_night: Optional[str] = None
    new: Optional[bool] = None
    indi: Optional[bool] = None
    elit: Optional[bool] = None
    height: Optional[str] = None
    weight: Optional[str] = None
    boobs: Optional[str] = None
    place: Optional[str] = None
    number: Optional[str] = None
    description: str
    photo_url: Optional[str] = None


class ModelCreate(ModelBase):
    services: Optional[List[int]] = Field(default_factory=list)


class ModelRead(ModelBase):
    uuid: UUID
    services: List[ServiceBase] = []
    photos: List[PhotoBase] = []

    class Config:
        orm_mode = True


class ModelResponse(ModelBase):
    uuid: UUID
    services: List[ServiceBase] = []
    photos: List[PhotoBase] = []

    class Config:
        orm_mode = True


class ServiceModel(BaseModel):
    name: str
    slug: str
    models: List[ModelResponse] = []

    class Config:
        orm_mode = True
