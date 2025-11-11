import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import kols
from .config import get_settings

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(name)s - %(message)s')
logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(
    title=settings.APP_NAME,
    description="A RESTful API for Key Opinion Leader (KOL) data analytics.",
    version="1.0.0",
    debug=settings.DEBUG,
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(kols.router)

@app.get("/", summary="Root endpoint")
def root():
    return {"message": "Welcome to the KOL Analytics API. Check /docs for endpoints."}

@app.get("/health", summary="Health check endpoint")
def health_check():
    return {"status": "ok", "app_name": settings.APP_NAME}

# Example command to run the backend: uvicorn app.main:app --reload