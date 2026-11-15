"""
FloodMap Live — Backend Application Entrypoint
FastAPI geospatial processing microservice for NASA Space Apps 2026 (Dancing with the SARs).
"""

import sys
import logging
from pathlib import Path
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.api import router
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
    logger.info(f"🛰️  Starting {settings.PROJECT_NAME} v{settings.VERSION}")
    logger.info(f"📁 Dataset Directory: {settings.DATASET_STORAGE_PATH}")
    
    # Check manifest availability
    manifest = DatasetStorageService.get_manifest()
    dataset_count = manifest.get("summary", {}).get("totalDatasets", 0)
    logger.info(f"📊 Discovered Datasets: {dataset_count}")

    # Check NASA Earthdata configuration
    auth_status = NASAEarthdataService.get_auth_status()
    if auth_status["configured"]:
        logger.info(f"🔑 NASA Earthdata: Configured ({auth_status['username']})")
    else:
        logger.info("ℹ️  NASA Earthdata: Using public CMR search mode (set credentials in backend/.env for direct downloads)")

    logger.info(f"🚀 API Documentation available at: http://localhost:{settings.PORT}/docs")
    logger.info("==================================================================")
    yield
    logger.info("🛑 Shutting down FloodMap Live backend service.")


# Initialize FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=(
        "Production-grade geospatial processing and Synthetic Aperture Radar (SAR) analytics API "
        "developed for the NASA Space Apps Challenge 2026. Powers automated flood extent classification, "
        "permanent water masking, and multi-sector population/agricultural damage calculations."
    ),
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure Cross-Origin Resource Sharing (CORS) for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API v1 endpoints router
app.include_router(router)


@app.get("/", tags=["Root"])
async def root_endpoint():
    """Service status and quick links."""
    manifest = DatasetStorageService.get_manifest()
    return JSONResponse(
        content={
            "service": settings.PROJECT_NAME,
            "version": settings.VERSION,
            "status": "OPERATIONAL",
            "documentation": "/docs",
            "endpoints": {
                "health": "/api/v1/health",
                "manifest": "/api/v1/manifest",
                "observations": "/api/v1/observations",
                "flood_extent": "/api/v1/flood-extent",
                "impact_analysis": "/api/v1/impact-analysis",
                "search_earthdata": "/api/v1/search-earthdata",
                "rainfall": "/api/v1/rainfall",
            },
            "datasets_indexed": manifest.get("summary", {}).get("totalDatasets", 0),
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG)
