"""
FloodMap Live — Geospatial Impact Assessment Engine Facade
Delegates to ExposureEngine for rigorous zonal statistics across administrative boundaries,
settlements, and cropland.
"""

from typing import Dict, Any, Optional
from app.models.schemas import MultiSectorImpactResponse
from app.processing.exposure_engine import ExposureEngine


class GeospatialImpactEngine:
    """
    Computes spatial exposure statistics by intersecting classified SAR flood polygons
    with administrative units and settlement coordinates.
    """

    @staticmethod
    def calculate_multi_sector_impact(
        flood_geojson: Optional[Dict[str, Any]],
        flooded_veg_geojson: Optional[Dict[str, Any]] = None,
        observation_meta: Optional[Dict[str, Any]] = None
    ) -> MultiSectorImpactResponse:
        """
        Calculates all district, settlement, and agricultural exposure metrics.
        """
        if not flood_geojson:
            return MultiSectorImpactResponse(
                hasData=False,
                totalFloodedAreaKm2=0.0,
                floodedVegetationAreaKm2=0.0,
                affectedDistrictsCount=0,
                exposedSettlementsCount=0,
                totalModelledExposedPopulation=0,
                totalAgriculturalFloodedKm2=0.0,
                districtBreakdown=[],
                exposedSettlements=[],
                agriculturalBreakdown=[],
                severityDistribution={"CRITICAL": 0, "HIGH": 0, "MODERATE": 0, "LOW": 0},
                observationMeta=observation_meta or {},
                validationStatus="Not independently validated",
                disclaimer="NO SATELLITE FLOOD DATA AVAILABLE FOR ANALYSIS",
            )

        return ExposureEngine.compute_exposure(
            flood_geojson=flood_geojson,
            flooded_veg_geojson=flooded_veg_geojson,
            observation_meta=observation_meta
        )
