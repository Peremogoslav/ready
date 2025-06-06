from fastapi import FastAPI
from models.router import router as models_router
from services.router import router as services_router
from auth.router import router as login
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

app.include_router(models_router)
app.include_router(services_router)
app.include_router(login)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api")
def root():
    return {"message": "Hello, Models API!"}
