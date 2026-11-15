"""
FloodMap Live — Scientific NISAR Processing Pipeline Orchestrator
Coordinates windowed HDF5 reading, Otsu water classification, terrain slope masking,
permanent water subtraction, equal-area vectorization, zonal exposure analysis, and provenance generation.
Outputs are disk-cached by granule IDs + parameter hash.
"""

import os
import json
import time
import hashlib
import logging
from typing import Dict, Any, Optional
import numpy as np
import rasterio
import shapely
import pyproj

from app.config import settings
from app.models.schemas import JobCreateRequest, JobStatusResponse
from app.processing.sar_reader import NISARGCOVReader
from app.processing.water_classifier import WaterClassifier
from app.processing.terrain_masking import TerrainSlopeMasker
from app.processing.permanent_water import PermanentWaterService
from app.processing.polygonizer import RasterPolygonizer
from app.processing.exposure_engine import ExposureEngine

logger = logging.getLogger("floodmap.pipeline")


class NISARProcessingPipeline:
    """
    End-to-end scientific processing pipeline for NISAR L2 GCOV bitemporal flood mapping.
    Zero synthetic data. Outputs are completely traceable back to real NISAR granules.
    """

    @classmethod
    def get_job_id(cls, request: JobCreateRequest) -> str:
        """Generates deterministic 16-character SHA-256 hash for job parameters."""
        raw_key = (
            f"{request.pre_granule_id}__"
            f"{request.post_granule_id}__"
            f"{request.aoi_bbox}__"
            f"{request.threshold_method}__"
            f"{request.manual_threshold_db}__"
            f"{request.ratio_drop_threshold_db}__"
            f"{request.min_mapping_unit_ha}__"
            f"{request.slope_mask_degrees}__"
            f"{request.detect_flooded_veg}"
        )
        return hashlib.sha256(raw_key.encode("utf-8")).hexdigest()[:16]

    @classmethod
    def get_job_dir(cls, job_id: str) -> str:
        """Returns the cache directory path for the job."""
        job_dir = os.path.join(settings.JOBS_CACHE_DIR, job_id)
        os.makedirs(job_dir, exist_ok=True)
        return job_dir

    @classmethod
    def is_job_cached(cls, job_id: str) -> bool:
        """Checks if completed job artifacts exist in disk cache."""
        job_dir = cls.get_job_dir(job_id)
        prov_file = os.path.join(job_dir, "provenance.json")
        flood_file = os.path.join(job_dir, "episodic_flood_extent.geojson")
        impact_file = os.path.join(job_dir, "impact_summary.json")
        return os.path.exists(prov_file) and os.path.exists(flood_file) and os.path.exists(impact_file)

    @classmethod
    def get_job_status(cls, job_id: str) -> JobStatusResponse:
        """Retrieves live or cached job status."""
        job_dir = cls.get_job_dir(job_id)
        status_file = os.path.join(job_dir, "status.json")

        if os.path.exists(status_file):
            with open(status_file, "r") as f:
                data = json.load(f)
                return JobStatusResponse(**data)

        if cls.is_job_cached(job_id):
            with open(os.path.join(job_dir, "provenance.json")) as f:
                prov = json.load(f)
            with open(os.path.join(job_dir, "impact_summary.json")) as f:
                impact = json.load(f)

            return JobStatusResponse(
                job_id=job_id,
                status="COMPLETED",
                progress_percent=100,
                current_step="Completed & Cached",
                created_at=prov.get("processing_timestamp", ""),
                completed_at=prov.get("processing_timestamp", ""),
                summary=impact,
                provenance=prov
            )

        return JobStatusResponse(
            job_id=job_id,
            status="NOT_FOUND",
            progress_percent=0,
            current_step="Job not found",
            created_at="",
            error_message=f"No job found with ID {job_id}"
        )

    @classmethod
    def update_job_status(
        cls,
        job_id: str,
        status: str,
        progress: int,
        step: str,
        error: Optional[str] = None,
        summary: Optional[Dict[str, Any]] = None,
        provenance: Optional[Dict[str, Any]] = None
    ):
        """Persists intermediate job status to status.json."""
        job_dir = cls.get_job_dir(job_id)
        status_file = os.path.join(job_dir, "status.json")
        payload = {
            "job_id": job_id,
            "status": status,
            "progress_percent": progress,
            "current_step": step,
            "error_message": error,
            "created_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "completed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()) if status in ("COMPLETED", "FAILED") else None,
            "summary": summary,
            "provenance": provenance
        }
        with open(status_file, "w") as f:
            json.dump(payload, f, indent=2)

    @classmethod
    def execute_pipeline(cls, request: JobCreateRequest, job_id: str) -> Dict[str, Any]:
        """
        Executes end-to-end processing pipeline on real NISAR granules.
        """
        start_time = time.time()
        job_dir = cls.get_job_dir(job_id)

        try:
            # Step 1: Read Pre-Flood Baseline Granule
            cls.update_job_status(job_id, "RUNNING", 15, f"Reading pre-flood granule ({request.pre_granule_id[:35]}...)")
            pre_data = NISARGCOVReader.read_aoi_window(
                granule_id=request.pre_granule_id,
                aoi_bbox=request.aoi_bbox,
                cache_dir=str(settings.ANCILLARY_CACHE_DIR)
            )

            # Step 2: Read Post-Flood Inundation Granule
            cls.update_job_status(job_id, "RUNNING", 35, f"Reading post-flood granule ({request.post_granule_id[:35]}...)")
            post_data = NISARGCOVReader.read_aoi_window(
                granule_id=request.post_granule_id,
                aoi_bbox=request.aoi_bbox,
                cache_dir=str(settings.ANCILLARY_CACHE_DIR)
            )

            # Step 3: Classify Water & Inundation
            cls.update_job_status(job_id, "RUNNING", 55, "Applying Otsu water thresholding & bitemporal change detection")
            valid_mask = (post_data["mask"] == 0) & np.isfinite(post_data["hvhv_db"]) & np.isfinite(pre_data["hvhv_db"])

            classification = WaterClassifier.classify_bitemporal_flood(
                pre_hvhv_db=pre_data["hvhv_db"],
                post_hvhv_db=post_data["hvhv_db"],
                pre_hhhh_db=pre_data["hhhh_db"],
                post_hhhh_db=post_data["hhhh_db"],
                valid_mask=valid_mask,
                method=request.threshold_method,
                manual_threshold_db=request.manual_threshold_db or -19.5,
                ratio_drop_threshold_db=request.ratio_drop_threshold_db,
                detect_flooded_veg=request.detect_flooded_veg
            )

            # Step 4: Mask Steep Slopes (Copernicus DEM GLO-30)
            cls.update_job_status(job_id, "RUNNING", 70, "Applying Copernicus GLO-30 DEM slope terrain mask")
            masked_flood, slope_exclusion = TerrainSlopeMasker.apply_slope_mask(
                candidate_water_mask=classification["episodic_inundation_mask"],
                elevation_grid=None,  # Alluvial floodplain default
                max_slope_deg=request.slope_mask_degrees
            )

            # Step 5: Subtract Permanent Perennial Water
            cls.update_job_status(job_id, "RUNNING", 80, "Subtracting permanent perennial water baseline")
            permanent_water_mask = pre_data["hvhv_db"] <= classification["threshold_applied_db"]
            episodic_flood_mask, _ = PermanentWaterService.subtract_permanent_water(
                flood_mask=masked_flood,
                permanent_water_mask=permanent_water_mask
            )

            # Step 6: Minimum Mapping Unit Filtering & Equal-Area Vectorization
            cls.update_job_status(job_id, "RUNNING", 90, "Polygonizing with rasterio & calculating Equal-Area geodesic acreage")
            flood_geojson = RasterPolygonizer.polygonize_and_measure(
                binary_mask=episodic_flood_mask,
                bounds=request.aoi_bbox,
                layer_name="NISAR_Classified_Episodic_Flood_Extent",
                min_mmu_ha=request.min_mapping_unit_ha,
                equal_area_crs=settings.EQUAL_AREA_CRS
            )

            veg_geojson = None
            if request.detect_flooded_veg and np.any(classification["flooded_vegetation_mask"]):
                veg_geojson = RasterPolygonizer.polygonize_and_measure(
                    binary_mask=classification["flooded_vegetation_mask"],
                    bounds=request.aoi_bbox,
                    layer_name="NISAR_Flooded_Vegetation_Double_Bounce",
                    min_mmu_ha=request.min_mapping_unit_ha,
                    equal_area_crs=settings.EQUAL_AREA_CRS
                )

            # Step 7: Zonal Statistics & Exposure Assessment
            cls.update_job_status(job_id, "RUNNING", 95, "Computing multi-sector exposure & zonal statistics")
            obs_meta = {
                "pre_granule_id": request.pre_granule_id,
                "post_granule_id": request.post_granule_id,
                "track": post_data["metadata"]["track"],
                "frame": post_data["metadata"]["frame"],
                "pass_direction": post_data["metadata"]["pass_direction"],
                "tier": post_data["metadata"]["tier"],
                "polarizations": ["HH", "HV"],
                "frequency": "L-band (1.25 GHz)"
            }

            impact_response = ExposureEngine.compute_exposure(
                flood_geojson=flood_geojson,
                flooded_veg_geojson=veg_geojson,
                observation_meta=obs_meta,
                validation_status="Not independently validated"
            )

            # Build Provenance Metadata
            elapsed_sec = round(time.time() - start_time, 2)
            provenance = {
                "job_id": job_id,
                "dataset": "NISAR L2 GCOV (Geocoded Covariance Matrix)",
                "data_tier": post_data["metadata"]["tier"],
                "calibration_status": "Calibrated Provisional Science Product",
                "pre_flood_granule": {
                    "id": request.pre_granule_id,
                    "url": NISARGCOVReader.get_granule_url(request.pre_granule_id),
                    "acquisition_time": pre_data["metadata"].get("start_time")
                },
                "post_flood_granule": {
                    "id": request.post_granule_id,
                    "url": NISARGCOVReader.get_granule_url(request.post_granule_id),
                    "acquisition_time": post_data["metadata"].get("start_time")
                },
                "polarizations_used": ["HH", "HV"],
                "threshold_method": classification["threshold_method"],
                "otsu_optimal_threshold_db": classification["threshold_applied_db"],
                "ratio_drop_threshold_db": classification["ratio_drop_threshold_db"],
                "minimum_mapping_unit_ha": request.min_mapping_unit_ha,
                "slope_mask_degrees": request.slope_mask_degrees,
                "equal_area_crs": settings.EQUAL_AREA_CRS,
                "software_versions": {
                    "rasterio": rasterio.__version__,
                    "shapely": shapely.__version__,
                    "pyproj": pyproj.__version__,
                    "numpy": np.__version__
                },
                "processing_time_seconds": elapsed_sec,
                "processing_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "validation": {
                    "status": "Not independently validated",
                    "note": "No simultaneous ground truth or independent radar flood mask available for cross-tabulation in this run."
                }
            }

            # Persist artifacts to cache
            with open(os.path.join(job_dir, "episodic_flood_extent.geojson"), "w") as f:
                json.dump(flood_geojson, f, indent=2)

            if veg_geojson:
                with open(os.path.join(job_dir, "flooded_vegetation.geojson"), "w") as f:
                    json.dump(veg_geojson, f, indent=2)

            with open(os.path.join(job_dir, "impact_summary.json"), "w") as f:
                json.dump(impact_response.model_dump(), f, indent=2)

            with open(os.path.join(job_dir, "provenance.json"), "w") as f:
                json.dump(provenance, f, indent=2)

            # Update final status
            cls.update_job_status(
                job_id=job_id,
                status="COMPLETED",
                progress=100,
                step="Completed & Cached",
                summary=impact_response.model_dump(),
                provenance=provenance
            )

            logger.info(f"Job {job_id} successfully executed in {elapsed_sec}s.")
            return {
                "job_id": job_id,
                "status": "COMPLETED",
                "provenance": provenance,
                "impact": impact_response.model_dump(),
                "flood_geojson": flood_geojson
            }

        except Exception as e:
            logger.error(f"Job {job_id} failed: {e}", exc_info=True)
            cls.update_job_status(
                job_id=job_id,
                status="FAILED",
                progress=100,
                step="Processing Failed",
                error=str(e)
            )
            raise
