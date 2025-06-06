from datetime import timedelta
from fastapi import APIRouter, Depends, Response
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from starlette.requests import Request
from fastapi.responses import RedirectResponse
from fastapi import HTTPException
from starlette.templating import Jinja2Templates

from src.auth.models import User
from src.auth.schemas import UserCreate
from src.core.settings import settings
from src.database import get_db
from src.utils.tool import create_password_hash, verify_password, create_access_token, get_current_superuser, \
    get_current_user

router = APIRouter(tags=["Auth"], prefix='/api')
templates = Jinja2Templates(directory="app/templates")


@router.post("/register")
def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)):
    result = db.execute(
        select(User).where((User.username == user.username) | (User.email == user.email))
    )
    existing_user = result.scalars().first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Юзернейм либо почта заняты.")

    new_user = User(
        username=user.username,
        password_hash=create_password_hash(user.password),
        email=user.email,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post("/login")
def login_user(response: Response, form_data: OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    result = db.execute(select(User).where(User.username == form_data.username))
    user = result.scalars().first()

    if not user or not verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User is inactive")

    access_token = create_access_token(
        data={"sub": user.username},
    )
    response.set_cookie(key="access_token", value=access_token, httponly=True, samesite="Strict")
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/admin_protected")
async def protected_route(current_user: str = Depends(get_current_superuser)):
    return {"message": f"Привет, {current_user.username}! ТЫ АДМИН."}


@router.get("/user_protected")
async def get_me(current_user: str = Depends(get_current_user)):
    return {"Привет!": current_user.username}


@router.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})


@router.get("/register")
async def registration(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})
