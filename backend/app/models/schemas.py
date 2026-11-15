"""
FloodMap Live — Pydantic Data Models & REST Schemas
Defines request and response schemas for all geospatial, radar, and impact analytics endpoints.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


# ------------------------------------------------------------------------------
# System & Telemetry Schemas
# ------------------------------------------------------------------------------
class SystemHealthResponse(BaseModel):
    status: str = "healthy"
    version: str
    environment: str
    earthdata_auth_configured: bool
    copernicus_auth_configured: bool
    dataset_storage_connected: bool
    indexed_dataset_count: int
    message: str


# ------------------------------------------------------------------------------
# SAR Observation Schemas
# ------------------------------------------------------------------------------
class ObservationMetadata(BaseModel):
    id: str
    satellite: str
    mission: str
    agency: Optional[str] = "NASA / ISRO"
    acquisitionDate: str
    acquisitionTime: Optional[str] = None
    passDirection: Optional[str] = "Ascending"
    polarization: List[str] = ["VV", "VH"]
    incidenceAngle: Optional[float] = 37.4
    resolution: Optional[str] = "12m"
    swathWidth: Optional[str] = "240 km"
    frequency: Optional[str] = "L-band (1.25 GHz)"
    processingLevel: Optional[str] = "Level-2 Classified Extent"
    status: str = "PROCESSED"
    coverage: Optional[str] = None
    dataAvailability: Optional[str] = "LOCAL_GEOJSON"
    datasetPath: Optional[str] = None
    qualityScore: Optional[float] = 0.95
    notes: Optional[str] = None


# ------------------------------------------------------------------------------
# NASA Earthdata Search & Granule Schemas
# ------------------------------------------------------------------------------
class EarthdataSearchQuery(BaseModel):
    bbox: List[float] = Field(
        default=[89.8, 25.5, 95.0, 28.0],
        description="Bounding box [min_lng, min_lat, max_lng, max_lat] in EPSG:4326"
    )
    start_date: str = Field(default="2024-06-01", description="Start date YYYY-MM-DD")
    end_date: str = Field(default="2024-07-31", description="End date YYYY-MM-DD")
    platform: Optional[str] = Field(default="NISAR", description="Platform e.g. NISAR, Sentinel-1, OPERA")
    collection_concept_id: Optional[str] = None
    max_results: int = Field(default=10, le=50)


class EarthdataGranuleResult(BaseModel):
    granule_id: str
    title: str
    collection: str
    platform: str
    sensor: str
    acquisition_date: str
    size_mb: float
    download_url: Optional[str] = None
    s3_direct_url: Optional[str] = None
    bbox: Optional[List[float]] = None
    online_status: str = "ONLINE"


# ------------------------------------------------------------------------------
# Radar Processing & Change Detection Request
# ------------------------------------------------------------------------------
class FloodExtentProcessRequest(BaseModel):
    baseline_observation_id: str = Field(..., description="Pre-flood observation ID (e.g. June baseline)")
    flood_observation_id: str = Field(..., description="Target flood observation ID (e.g. July peak)")
    threshold_db: float = Field(default=-19.5, description="Backscatter cutoff threshold in decibels")
    apply_permanent_water_mask: bool = Field(default=True, description="Subtract perennial channels")
    min_area_hectares: float = Field(default=2.0, description="Minimum mapping unit size")


# ------------------------------------------------------------------------------
# Impact Analytics Schemas
# ------------------------------------------------------------------------------
class DistrictImpactSummary(BaseModel):
    district: str
    floodedAreaKm2: float
    totalAreaKm2: float
    percentAffected: float
    severity: str
    population: int
    vulnerabilityTier: str


class VillageExposureSummary(BaseModel):
    id: str
    name: str
    district: str
    population: int
    elevationM: Optional[float] = None
    primaryLivelihood: Optional[str] = None
    severity: str
    lat: Optional[float] = None
    lng: Optional[float] = None


class AgriculturalExposureSummary(BaseModel):
    id: str
    district: str
    zone: str
    totalCroplandKm2: float
    affectedCroplandKm2: float
    primaryCrops: List[str]
    growthStage: Optional[str] = None


class MultiSectorImpactResponse(BaseModel):
    hasData: bool
    totalFloodedAreaKm2: float
    affectedDistrictsCount: int
    exposedVillagesCount: int
    totalExposedPopulation: int
    totalAgriculturalFloodedKm2: float
    districtBreakdown: List[DistrictImpactSummary]
    exposedVillages: List[VillageExposureSummary]
    agriculturalBreakdown: List[AgriculturalExposureSummary]
    severityDistribution: Dict[str, int]
    observationMeta: Dict[str, Any]
    disclaimer: str
