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
    age: int
    slug: Optional[str] = None
    price_per_hour: Optional[int] = None
    price_per_foo: Optional[int] = None
    price_per_night: Optional[int] = None
    new: Optional[bool] = None
    indi: Optional[bool] = None
    elit: Optional[bool] = None
    height: Optional[int] = None
    weight: Optional[int] = None
    boobs: Optional[int] = None
    place: Optional[str] = None
    number: Optional[str] = None
    description: str
    description_en: str
    place_en: str
    name_en: str
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
