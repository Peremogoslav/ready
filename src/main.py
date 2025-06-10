from fastapi import FastAPI, Request
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import RedirectResponse
from starlette.staticfiles import StaticFiles
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_301_MOVED_PERMANENTLY, HTTP_404_NOT_FOUND
from fastapi.middleware.cors import CORSMiddleware

from models.router import router as models_router
from src.admin.router import router as admin_router
from services.router import router as services_router
from src.managers.router import router
from auth.router import router as login

app = FastAPI()

app.mount("/static", StaticFiles(directory="C:/Users/Programmer/Desktop/SITESEO/static"), name="static")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
app.include_router(admin_router)
app.include_router(models_router)
app.include_router(services_router)
app.include_router(login)

@app.get("/api")
def root():
    return {"message": "Hello, Models API!"}
