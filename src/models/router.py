from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List, Optional
from slugify import slugify
from sqlalchemy.sql.expression import func
from utils.img_upload import upload_image_to_imgbb
from database import get_db
from src.models.models import Services, Models, ModelPhoto
from src.utils.tool import get_current_superuser
from models.schemas import ModelResponse, ModelCreate

router = APIRouter(prefix="/api/models", tags=["models"])


@router.post("/create", response_model=ModelResponse)
async def create_model(
    name: str = Form(...),
    description: str = Form(...),
    price_per_hour: Optional[str] = Form(None),
    price_per_foo: Optional[str] = Form(None),
    price_per_night: Optional[str] = Form(None),
    height: Optional[str] = Form(None),
    weight: Optional[str] = Form(None),
    boobs: Optional[str] = Form(None),
    indi: Optional[bool] = Form(False),
    elit: Optional[bool] = Form(False),
    new: Optional[bool] = Form(False),
    place: Optional[str] = Form(None),
    number: Optional[str] = Form(None),
    service_ids: str = Form(""),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_superuser)
):
    slug = slugify(f"{name}-{place or ''}-{'indi' if indi else ''}-{'new' if new else ''}-{'elit' if elit else ''}")
    try:
        service_ids_list = [int(i) for i in service_ids.split(",") if i.strip()]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid service ID format")
    new_model = Models(
        uuid=uuid4(),
        name=name,
        slug=slug,
        description=description,
        price_per_hour=price_per_hour,
        price_per_foo=price_per_foo,
        price_per_night=price_per_night,
        height=height,
        weight=weight,
        boobs=boobs,
        new=new,
        elit=elit,
        indi=indi,
        place=place,
        number=number,
    )
    if service_ids_list:
        services = db.query(Services).filter(Services.id.in_(service_ids_list)).all()
        new_model.services = services
    db.add(new_model)
    db.commit()
    db.refresh(new_model)

    photos = []
    for file in files:
        file_bytes = await file.read()
        photo_url = upload_image_to_imgbb(file_bytes)
        photo = ModelPhoto(model_uuid=new_model.uuid, photo_url=photo_url)
        photos.append(photo)

    if photos:
        new_model.photos.extend(photos)
        db.add_all(photos)
        db.commit()
        db.refresh(new_model)

    return new_model


@router.put("/update-{model_id}", response_model=ModelResponse)
async def update_model(
    model_id: UUID,
    model_data: ModelCreate,
    files: Optional[List[UploadFile]] = File(None),  # новые фото
    db: Session = Depends(get_db),
    _: str = Depends(get_current_superuser)
):
    model = db.query(Models).filter(Models.uuid == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    # Обновление основных полей
    for attr, value in model_data.dict(exclude={"services"}).items():
        setattr(model, attr, value)

    # Обновление услуг
    if model_data.services:
        services = db.query(Services).filter(Services.id.in_(model_data.services)).all()
        model.services = services

    # Если пришли новые фото — добавляем
    if files:
        photos = []
        for file in files:
            file_bytes = await file.read()
            photo_url = upload_image_to_imgbb(file_bytes)
            photo = ModelPhoto(model_uuid=model.uuid, photo_url=photo_url)
            photos.append(photo)
        model.photos.extend(photos)
        db.add_all(photos)

    db.commit()
    db.refresh(model)
    return model


@router.delete("/delete-{model_id}")
def delete_model(
    model_id: UUID,
    db: Session = Depends(get_db),
    _: str = Depends(get_current_superuser)
):
    model = db.query(Models).filter(Models.uuid == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    db.delete(model)
    db.commit()
    return {"detail": "Model deleted successfully"}


@router.get("/random", response_model=List[ModelResponse])
def get_random_models(
    count: int = Query(5, ge=1, le=20),  # по умолчанию 5, от 1 до 20
    db: Session = Depends(get_db),
):
    random_models = db.query(Models).order_by(func.random()).limit(count).all()
    return random_models


@router.get("/all-model", response_model=List[ModelResponse])
def get_all_model(
    db: Session = Depends(get_db),
    limit: int = Query(12, ge=1, le=50),
    offset: int = Query(0, ge=0)
):
    models_query = db.query(Models)
    models = models_query.offset(offset).limit(limit).all()

    if not models:
        raise HTTPException(status_code=404, detail="Models not found")
    return models


@router.get("/get-by-role", response_model=List[ModelResponse])
def get_models_by_role(role: str = Query(..., regex="^(new|elit|indi)$"), db: Session = Depends(get_db)):
    filter_field = getattr(Models, role)
    models = db.query(Models).filter(filter_field == True).all()
    if not models:
        raise HTTPException(status_code=404, detail="Models not found")
    return models


@router.get("/{slug}", response_model=ModelResponse)
def get_model_by_slug(slug: str, db: Session = Depends(get_db)):
    model = db.query(Models).filter(Models.slug == slug).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return model
