from fastapi import APIRouter, Depends, HTTPException
from slugify import slugify
from sqlalchemy.orm import Session
from database import get_db
from src.models.models import Services

from src.models.schemas import ServiceBase, ServiceCreate, ServiceModel
from src.utils.tool import get_current_superuser

router = APIRouter(prefix="/api/services", tags=["Services"])

@router.get("/all-services")
def get_all_services(db: Session = Depends(get_db)):
    return db.query(Services).all()

@router.post("/add-service")
def add_service(service: ServiceCreate, db: Session = Depends(get_db), _: str = Depends(get_current_superuser)):
    slug = slugify(service.name)

    existing = db.query(Services).filter(Services.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service with this slug already exists")

    new_service = Services(name=service.name, slug=slug)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.get("/{slug}", response_model=ServiceModel)
def get_service_with_models(slug: str, db: Session = Depends(get_db)):
    service = db.query(Services).filter(Services.slug == slug).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    return service
