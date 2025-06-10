from fastapi import APIRouter, Depends, HTTPException, Form
from sqlalchemy.orm import Session
from typing import List

from starlette.responses import RedirectResponse

from src.database import get_db
from src.managers.models import SiteManagers
from src.managers.schemas import TelegramOnlyOut, WhatsappOnlyOut
from src.utils.tool import get_current_superuser

router = APIRouter(prefix="/api/manager", tags=["manager"])

@router.get("/telegram", response_model=List[TelegramOnlyOut])
def get_telegram(db: Session = Depends(get_db)):
    return db.query(SiteManagers).with_entities(SiteManagers.id, SiteManagers.global_telegram).all()

@router.get( "/whatsapp", response_model=List[WhatsappOnlyOut])
def get_whatsapp(db: Session = Depends(get_db)):
    return db.query(SiteManagers).with_entities(SiteManagers.id, SiteManagers.global_whatsapp).all()

@router.get( "/all")
def get_whatsapp(db: Session = Depends(get_db)):
    return db.query(SiteManagers).all()

@router.post("/create")
def add_info(telegram: str, whatsapp: str, number: str, db: Session = Depends(get_db)):
    new_info = SiteManagers(
        global_telegram=telegram,
        global_whatsapp=whatsapp,
        global_number=number,
    )

    db.add(new_info)
    db.commit()
    db.refresh(new_info)

    return new_info

@router.post("/edit/{contact_id}")
def edit_contact(
    contact_id: int,
    global_telegram: str = Form(...),
    global_whatsapp: str = Form(...),
    global_number: str = Form(...),
    db: Session = Depends(get_db),
    user=Depends(get_current_superuser)
):
    contact = db.query(SiteManagers).filter(SiteManagers.id == contact_id).first()
    if not contact:
        raise HTTPException(status_code=404, detail="Contact not found")

    contact.global_telegram = global_telegram
    contact.global_whatsapp = global_whatsapp
    contact.global_number = global_number

    db.commit()
    db.refresh(contact)
    return RedirectResponse(url="/admin/contact", status_code=303)
