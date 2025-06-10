from fastapi import APIRouter, Request, Depends, HTTPException
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from uuid import UUID

from src.database import get_db
from src.managers.models import SiteManagers
from src.models.models import Models, Services
from src.utils.tool import get_current_superuser

router = APIRouter(prefix="/admin", tags=["admin"])
templates = Jinja2Templates(directory="C:/Users/Programmer/Desktop/SITESEO/src/templates")


@router.get("/login")
def admin_models_list(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/models")
def admin_models_list(request: Request, db: Session = Depends(get_db), user=Depends(get_current_superuser)):
    models = db.query(Models).all()
    return templates.TemplateResponse("models_list.html", {"request": request, "models": models, "user": user})


@router.get("/contact")
def admin_contact_list(request: Request, db: Session = Depends(get_db), user=Depends(get_current_superuser)):
    contacts = db.query(SiteManagers).all()
    return templates.TemplateResponse("manager.html", {"request": request, "contacts": contacts, "user": user})


@router.get("/models/create")
def admin_model_create_form(request: Request, db: Session = Depends(get_db), user=Depends(get_current_superuser)):
    services = db.query(Services).all()
    return templates.TemplateResponse("model_create.html", {"request": request,"all_services": services,"user": user})


@router.get("/models/edit/{model_id}")
def admin_model_edit_form(model_id: UUID, request: Request, db: Session = Depends(get_db), user=Depends(get_current_superuser)):
    model = db.query(Models).filter(Models.uuid == model_id).first()
    services = db.query(Services).all()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found")
    return templates.TemplateResponse("model_edit.html", {"request": request, "model": model,"all_services": services, "user": user})


@router.get("")
def admin_index(request: Request, db: Session = Depends(get_db), user=Depends(get_current_superuser)):
    total_models = db.query(Models).count()
    return templates.TemplateResponse("admin_index.html", {
        "request": request,
        "user": user,
        "total_models": total_models,
    })
