"""
FloodMap Live — REST API Endpoints Router
Defines all client-facing routes for geospatial layers, damage calculations, and NASA telemetry.
"""

from typing import Optional, Dict, Any, List
from fastapi import APIRouter, Query, HTTPException, status
from app.config import settings
from app.models.schemas import (
    SystemHealthResponse,
    ObservationMetadata,
    EarthdataSearchQuery,
    EarthdataGranuleResult,
    FloodExtentProcessRequest,
    MultiSectorImpactResponse,
)
from app.services.dataset_indexer import DatasetStorageService
from app.services.nasa_earthdata import NASAEarthdataService
from app.processing.sar_processor import SARProcessor
from app.processing.impact_engine import GeospatialImpactEngine

router = APIRouter(prefix="/api/v1")


# ------------------------------------------------------------------------------
# 1. Telemetry & Health Endpoint
# ------------------------------------------------------------------------------
@router.get("/health", response_model=SystemHealthResponse, tags=["Telemetry"])
async def get_system_health():
    """Returns service health, NASA Earthdata authentication status, and dataset readiness."""
    manifest = DatasetStorageService.get_manifest()
    total_datasets = manifest.get("summary", {}).get("totalDatasets", 0)

    auth_status = NASAEarthdataService.get_auth_status()

    return SystemHealthResponse(
        status="healthy",
        version=settings.VERSION,
        environment=settings.ENVIRONMENT,
        earthdata_auth_configured=auth_status["configured"],
        copernicus_auth_configured=settings.is_cdse_configured,
        dataset_storage_connected=DatasetStorageService.get_data_dir().exists(),
        indexed_dataset_count=total_datasets,
        message=f"FloodMap Live Radar Engine Active. {total_datasets} datasets indexed.",
    )


# ------------------------------------------------------------------------------
# 2. Manifest & Dataset Discovery
# ------------------------------------------------------------------------------
@router.get("/manifest", tags=["Data Discovery"])
async def get_dataset_manifest():
    """Returns the complete auto-generated dataset discovery manifest."""
    manifest = DatasetStorageService.get_manifest()
    if not manifest or not manifest.get("datasets"):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No manifest found. Execute 'npm run index-data' to generate public/data/manifest.json",
        )
    return manifest


# ------------------------------------------------------------------------------
# 3. Satellite Observations Catalog
# ------------------------------------------------------------------------------
@router.get("/observations", response_model=List[ObservationMetadata], tags=["Observations"])
async def list_satellite_observations():
    """Lists all indexed Synthetic Aperture Radar (NISAR / Sentinel-1) observations."""
    catalog = DatasetStorageService.get_observations_catalog()
    return catalog


# ------------------------------------------------------------------------------
# 4. Classified Flood Extent GeoJSON
# ------------------------------------------------------------------------------
@router.get("/flood-extent", tags=["Geospatial Layers"])
async def get_classified_flood_extent(
    observation_id: Optional[str] = Query(
        None, description="Observation ID (e.g. NISAR_L2_20240708T053412 or NISAR_L2_20240610T053408)"
    ),
    subtract_permanent_water: bool = Query(
        True, description="Subtract permanent perennial river channel from flood extent"
    ),
):
    """
    Returns the classified surface water extent GeoJSON for the requested SAR observation.
    Optionally applies topological permanent water mask subtraction.
    """
    flood_geojson = DatasetStorageService.get_flood_extent_geojson(observation_id)
    if not flood_geojson:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No flood extent dataset found for observation '{observation_id}'.",
        )

    if subtract_permanent_water:
        perm_water = DatasetStorageService.get_permanent_water_geojson()
        flood_geojson = SARProcessor.subtract_permanent_water(flood_geojson, perm_water)

    return flood_geojson


# ------------------------------------------------------------------------------
# 5. Multi-Sector Impact Analytics Engine
# ------------------------------------------------------------------------------
@router.get("/impact-analysis", response_model=MultiSectorImpactResponse, tags=["Analytics"])
async def calculate_geospatial_impact(
    observation_id: Optional[str] = Query(None, description="Observation pass to evaluate"),
):
    """
    Dynamically computes multi-sector damage statistics (flooded area, affected districts,
    exposed settlements, and inundated cropland) directly from vector geometries.
    """
    flood_geojson = DatasetStorageService.get_flood_extent_geojson(observation_id)
    districts_geojson = DatasetStorageService.get_districts_geojson()
    villages_geojson = DatasetStorageService.get_villages_geojson()
    cropland_geojson = DatasetStorageService.get_cropland_geojson()

    return GeospatialImpactEngine.calculate_multi_sector_impact(
        flood_geojson=flood_geojson,
        districts_geojson=districts_geojson,
        villages_geojson=villages_geojson,
        cropland_geojson=cropland_geojson,
    )


# ------------------------------------------------------------------------------
# 6. NASA Earthdata Search
# ------------------------------------------------------------------------------
@router.post("/search-earthdata", response_model=List[EarthdataGranuleResult], tags=["NASA Earthdata"])
async def search_nasa_earthdata_granules(query: EarthdataSearchQuery):
    """
    Queries NASA's Common Metadata Repository (CMR) for satellite radar granules.
    """
    return await NASAEarthdataService.search_granules(query)


# ------------------------------------------------------------------------------
# 7. Bitemporal SAR Change Detection Pipeline
# ------------------------------------------------------------------------------
@router.post("/process-flood", tags=["Radar Processing"])
async def process_bitemporal_flood(request: FloodExtentProcessRequest):
    """
    Executes algorithmic bitemporal change detection between pre-flood baseline
    and target flood SAR observations.
    """
    baseline_geojson = DatasetStorageService.get_flood_extent_geojson(request.baseline_observation_id)
    flood_geojson = DatasetStorageService.get_flood_extent_geojson(request.flood_observation_id)

    if not baseline_geojson or not flood_geojson:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or both observation GeoJSON datasets could not be located in storage.",
        )

    perm_water = (
        DatasetStorageService.get_permanent_water_geojson()
        if request.apply_permanent_water_mask
        else None
    )

    result = SARProcessor.execute_bitemporal_pipeline(
        baseline_geojson=baseline_geojson,
        flood_geojson=flood_geojson,
        permanent_water_geojson=perm_water,
        threshold_db=request.threshold_db,
    )
    return result


# ------------------------------------------------------------------------------
# 8. Rainfall Timeseries
# ------------------------------------------------------------------------------
@router.get("/rainfall", tags=["Reference Data"])
async def get_rainfall_timeseries():
    """Returns meteorological rainfall time series parsed from reference CSV data."""
    return DatasetStorageService.get_rainfall_timeseries()
