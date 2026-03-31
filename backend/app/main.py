from dotenv import load_dotenv

# Load environment variables as early as possible
load_dotenv(override=True)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import ai, auth, tasks, stats
from app.core.database import engine, Base
from app.models import models

import logging

# Configure logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Database tables
Base.metadata.create_all(bind=engine)

# Manual migration for existing table
with engine.connect() as connection:
    try:
        connection.execute(text("ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url TEXT;"))
        connection.commit()
    except Exception as e:
        logger.error(f"Migration sync (profile_image_url): {e}")

app = FastAPI(title="ARCHITECT AI API", version="1.0.0")

# Setup CORS to allow mobile/web connections
# In production, replace ["*"] with specific origins for better security.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update this for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(stats.router, prefix="/api/stats", tags=["Stats"])
app.include_router(ai.router, prefix="/api", tags=["AI"])

@app.get("/")
def read_root():
    return {"status": "ok", "message": "AI Productivity API is running"}

@app.get("/api/health")
def health_check():
    return {"status": "healthy"}
