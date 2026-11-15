"""
FloodMap Live — Backend Application Entrypoint
FastAPI geospatial processing microservice for NASA Space Apps (NISAR SAR Flood Analytics).
"""

import sys
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.endpoints import router
from app.services.dataset_indexer import DatasetStorageService
from app.services.nasa_earthdata import NASAEarthdataService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger("floodmap.main")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle hook for startup verification and cleanup."""
    logger.info("==================================================================")
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"Jobs Cache Directory: {settings.JOBS_CACHE_DIR}")
    
    # Check completed jobs
    manifest = DatasetStorageService.get_manifest()
    job_count = manifest.get("total_completed_jobs", 0)
    logger.info(f"Calibrated NISAR Runs Available: {job_count}")

    # Check NASA Earthdata configuration
    auth_status = NASAEarthdataService.get_auth_status()
    if auth_status["configured"]:
        logger.info(f"NASA Earthdata Auth: Configured ({auth_status['username']}) - {auth_status['auth_method']}")
    else:
        logger.info("NASA Earthdata Auth: Public search active. Range requests require EARTHDATA_TOKEN in backend/.env")

    logger.info(f"API Documentation available at: http://localhost:{settings.PORT}/docs")
    logger.info("==================================================================")
    yield
    logger.info("Shutting down FloodMap Live backend service.")


# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Scientific geospatial processing and Synthetic Aperture Radar (SAR) analytics API. "
        "Powers automated flood extent classification from real NISAR L2 GCOV granules, "
        "permanent water masking, Otsu thresholding, and multi-sector population/agricultural damage calculations."
    ),
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(router)
