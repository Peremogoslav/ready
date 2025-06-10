from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form, Query
from sqlalchemy.orm import Session
from uuid import UUID, uuid4
from typing import List, Optional
from slugify import slugify
from sqlalchemy.sql.expression import func
from starlette.responses import RedirectResponse
from utils.img_upload import upload_image_to_imgbb
from database import get_db
from src.models.models import Services, Models, ModelPhoto
from src.utils.tool import get_current_superuser
from models.schemas import ModelResponse, ModelCreate

router = APIRouter(prefix="/api/models", tags=["models"])


@router.post("/create")
async def create_model(
    name: str = Form(...),
    description: str = Form(...),
    age: Optional[int] = Form(...),
    name_en: str = Form(...),
    description_en: str = Form(...),
    price_per_hour: Optional[int] = Form(None),
    price_per_foo: Optional[int] = Form(None),
    price_per_night: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    weight: Optional[int] = Form(None),
    boobs: Optional[int] = Form(None),
    indi: Optional[bool] = Form(False),
    elit: Optional[bool] = Form(False),
    new: Optional[bool] = Form(False),
    place: Optional[str] = Form(None),
    place_en: Optional[str] = Form(None),
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
        description_en=description_en,
        age=age,
        name_en=name_en,
        slug=slug,
        description=description,
        price_per_hour=price_per_hour,
        price_per_foo=price_per_foo,
        price_per_night=price_per_night,
        height=height,
        weight=weight,
        boobs=boobs,
        place_en=place_en,
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
        try:
            photo_url = upload_image_to_imgbb(file_bytes)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")

        photo = ModelPhoto(model_uuid=new_model.uuid, photo_url=photo_url)
        photos.append(photo)

    if photos:
        new_model.photos.extend(photos)
        db.add_all(photos)
        db.commit()
        db.refresh(new_model)

    return RedirectResponse(url="/admin/models", status_code=303)

@router.post("/update/{model_id}", response_model=ModelResponse)
async def update_model(
    model_id: UUID,
    name: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    age: Optional[int] = Form(None),
    name_en: Optional[str] = Form(None),
    description_en: Optional[str] = Form(None),
    price_per_hour: Optional[int] = Form(None),
    price_per_foo: Optional[int] = Form(None),
    price_per_night: Optional[int] = Form(None),
    height: Optional[int] = Form(None),
    weight: Optional[int] = Form(None),
    boobs: Optional[int] = Form(None),
    indi: Optional[bool] = Form(None),
    elit: Optional[bool] = Form(None),
    new: Optional[bool] = Form(None),
    place: Optional[str] = Form(None),
    number: Optional[str] = Form(None),
    service_ids: Optional[List[int]] = Form([]),
    files: Optional[List[UploadFile]] = File(None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_superuser)
):
    model = db.query(Models).filter(Models.uuid == model_id).first()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")

    update_data = {
        "name": name,
        "description": description,
        "price_per_hour": price_per_hour,
        "price_per_foo": price_per_foo,
        "price_per_night": price_per_night,
        "height": height,
        "age": age,
        "description_en": description_en,
        "name_en": name_en,
        "weight": weight,
        "boobs": boobs,
        "indi": indi,
        "elit": elit,
        "new": new,
        "place": place,
        "number": number,
    }

    for key, value in update_data.items():
        if value is not None:
            setattr(model, key, value)

    if name or place or new is not None or elit is not None or indi is not None:
        model.slug = slugify(f"{model.name}-{model.place or ''}-{'indi' if model.indi else ''}-{'new' if model.new else ''}-{'elit' if model.elit else ''}")

    if service_ids:
        try:
            # Если service_ids уже список, просто приведём элементы к int (если нужно)
            ids = [int(i) for i in service_ids]
            services = db.query(Services).filter(Services.id.in_(ids)).all()
            model.services = services
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid service ID format")

    if files:
        new_photos = []
        for file in files:
            file_bytes = await file.read()
            if not file_bytes:
                continue
            try:
                photo_url = upload_image_to_imgbb(file_bytes)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
            photo = ModelPhoto(model_uuid=model.uuid, photo_url=photo_url)
            new_photos.append(photo)
        if new_photos:
            db.add_all(new_photos)
            model.photos.extend(new_photos)

    db.commit()
    db.refresh(model)
    return RedirectResponse(url="/admin/models", status_code=303)




@router.delete("/delete/{model_id}")
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
