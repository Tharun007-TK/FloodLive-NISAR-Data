"""
FloodMap Live — Pydantic Data Models & REST Schemas
Defines request and response schemas for all geospatial, radar, job orchestration, and impact analytics endpoints.
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
# Job Orchestration Schemas (Phase C)
# ------------------------------------------------------------------------------
class JobCreateRequest(BaseModel):
    aoi_bbox: List[float] = Field(
        default=[90.25, 25.42, 93.43, 28.10],
        description="AOI Bounding box [min_lon, min_lat, max_lon, max_lat] in EPSG:4326"
    )
    pre_granule_id: str = Field(
        default="NISAR_L2_PR_GCOV_024_091_D_075_4005_DHDH_A_20260702T123350_20260702T123424_P05023_N_F_J_001",
        description="Pre-flood baseline NISAR GCOV granule ID"
    )
    post_granule_id: str = Field(
        default="NISAR_L2_PR_GCOV_026_091_D_075_4005_DHDH_A_20260726T123348_20260726T123423_P05023_N_F_J_001",
        description="Target flood event NISAR GCOV granule ID"
    )
    threshold_method: str = Field(
        default="otsu",
        description="Water threshold method: 'otsu', 'bimodal', or 'manual_db'"
    )
    manual_threshold_db: Optional[float] = Field(
        default=-19.5,
        description="Manual cutoff threshold in decibels (if threshold_method=='manual_db')"
    )
    ratio_drop_threshold_db: float = Field(
        default=-4.5,
        description="Decibel drop required to confirm episodic inundation relative to baseline"
    )
    min_mapping_unit_ha: float = Field(
        default=1.0,
        description="Minimum mapping unit size in hectares (1 ha = 0.01 km²)"
    )
    slope_mask_degrees: float = Field(
        default=5.0,
        description="Slope cutoff in degrees from Copernicus GLO-30 DEM"
    )
    detect_flooded_veg: bool = Field(
        default=True,
        description="Flag vegetation double-bounce areas (+3 dB backscatter rise) as separate layer"
    )
    permanent_water_source: str = Field(
        default="JRC_GSW",
        description="Permanent water reference source: 'JRC_GSW' or 'ESA_WorldCover'"
    )


class JobStatusResponse(BaseModel):
    job_id: str
    status: str  # PENDING, RUNNING, COMPLETED, FAILED
    progress_percent: int = 0
    current_step: str
    error_message: Optional[str] = None
    created_at: str
    completed_at: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None
    provenance: Optional[Dict[str, Any]] = None


# ------------------------------------------------------------------------------
# SAR Observation Schemas
# ------------------------------------------------------------------------------
class ObservationMetadata(BaseModel):
    id: str
    granuleId: str
    satellite: str
    mission: str
    agency: str = "NASA / ISRO"
    tier: str  # PROVISIONAL or BETA
    calibrationStatus: str
    acquisitionDate: str
    acquisitionTime: Optional[str] = None
    track: int
    frame: int
    passDirection: str
    polarization: List[str]
    modeCode: str
    frequency: str = "L-band (1.25 GHz)"
    processingLevel: str = "Level-2 GCOV (Geocoded Covariance Matrix)"
    fileSizeBytes: Optional[int] = None
    url: Optional[str] = None
    status: str = "PROCESSED"
    qualityScore: Optional[float] = 1.0
    notes: Optional[str] = None


# ------------------------------------------------------------------------------
# NASA Earthdata Search & Granule Schemas
# ------------------------------------------------------------------------------
class EarthdataSearchQuery(BaseModel):
    bbox: List[float] = Field(
        default=[90.25, 25.42, 93.43, 28.10],
        description="Bounding box [min_lng, min_lat, max_lng, max_lat] in EPSG:4326"
    )
    start_date: Optional[str] = Field(default="2026-06-15", description="Start date YYYY-MM-DD")
    end_date: Optional[str] = Field(default="2026-11-15", description="End date YYYY-MM-DD")
    platform: Optional[str] = Field(default="NISAR", description="Platform e.g. NISAR, Sentinel-1")
    max_results: int = Field(default=20, le=100)


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


class SettlementExposureSummary(BaseModel):
    id: str
    name: str
    district: str
    estimatedPopulation: int
    severity: str
    lat: float
    lng: float


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
    floodedVegetationAreaKm2: float
    affectedDistrictsCount: int
    exposedSettlementsCount: int
    totalModelledExposedPopulation: int
    totalAgriculturalFloodedKm2: float
    districtBreakdown: List[DistrictImpactSummary]
    exposedSettlements: List[SettlementExposureSummary]
    agriculturalBreakdown: List[AgriculturalExposureSummary]
    severityDistribution: Dict[str, int]
    observationMeta: Dict[str, Any]
    validationStatus: str
    validationIoU: Optional[float] = None
    validationF1: Optional[float] = None
    disclaimer: str
