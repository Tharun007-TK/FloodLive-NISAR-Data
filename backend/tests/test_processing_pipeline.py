"""
Unit tests for NISAR SAR Processing Pipeline.
Uses synthetic NumPy array fixtures clearly isolated under backend/tests/.
Nothing synthetic is ever served to the UI.
"""

import os
import pytest
import numpy as np

from app.processing.water_classifier import WaterClassifier
from app.processing.terrain_masking import TerrainSlopeMasker
from app.processing.permanent_water import PermanentWaterService
from app.processing.polygonizer import RasterPolygonizer
from app.processing.exposure_engine import ExposureEngine
from app.models.schemas import JobCreateRequest
from app.processing.pipeline import NISARProcessingPipeline


@pytest.fixture
def synthetic_sar_fixture():
    """
    Creates a synthetic 100x100 dual-pol SAR fixture for testing thresholding and change detection.
    Non-water background: -12 dB (HV), -8 dB (HH)
    Pre-flood waterbody (center): -24 dB (HV), -20 dB (HH)
    Post-flood new inundation (quadrant): drops from -11 dB to -23 dB (HV)
    Flooded vegetation (patch): increases from -10 dB to -4 dB (HH & HV)
    """
    np.random.seed(42)
    # Background terrain
    pre_hv = np.random.normal(-12.0, 1.0, (100, 100)).astype(np.float32)
    pre_hh = np.random.normal(-8.0, 1.0, (100, 100)).astype(np.float32)

    post_hv = pre_hv.copy()
    post_hh = pre_hh.copy()

    # Permanent river in center (20 rows)
    pre_hv[40:60, :] = -24.0
    post_hv[40:60, :] = -24.0

    # New episodic flood in quadrant [60:85, 20:50]
    post_hv[60:85, 20:50] = -23.0  # drop of 11 dB

    # Flooded vegetation patch [10:30, 70:90] (+5 dB increase in HH and HV)
    post_hh[10:30, 70:90] += 6.0
    post_hv[10:30, 70:90] += 5.0

    valid_mask = np.ones((100, 100), dtype=bool)

    return {
        "pre_hv": pre_hv,
        "post_hv": post_hv,
        "pre_hh": pre_hh,
        "post_hh": post_hh,
        "valid_mask": valid_mask,
    }


def test_otsu_thresholding(synthetic_sar_fixture):
    """Verifies that Otsu finds a separating threshold between -26 dB and -15 dB."""
    post_hv = synthetic_sar_fixture["post_hv"]
    valid_mask = synthetic_sar_fixture["valid_mask"]

    threshold = WaterClassifier.calculate_otsu_threshold(post_hv, valid_mask)
    assert -26.0 <= threshold <= -15.0
    # Water should be below threshold, land above
    assert np.mean(post_hv[40:60, :]) < threshold
    assert np.mean(post_hv[0:30, 0:30]) > threshold


def test_bitemporal_classification(synthetic_sar_fixture):
    """Verifies that bitemporal difference distinguishes new flood and double-bounce vegetation."""
    res = WaterClassifier.classify_bitemporal_flood(
        pre_hvhv_db=synthetic_sar_fixture["pre_hv"],
        post_hvhv_db=synthetic_sar_fixture["post_hv"],
        pre_hhhh_db=synthetic_sar_fixture["pre_hh"],
        post_hhhh_db=synthetic_sar_fixture["post_hh"],
        valid_mask=synthetic_sar_fixture["valid_mask"],
        method="otsu",
        ratio_drop_threshold_db=-4.5,
        detect_flooded_veg=True,
    )

    # Episodic inundation must be detected in the flooded quadrant
    assert np.sum(res["episodic_inundation_mask"][60:85, 20:50]) > 500
    # Permanent water (no significant drop) must not be classified as episodic flood
    assert np.sum(res["episodic_inundation_mask"][40:60, :]) == 0
    # Flooded vegetation double bounce must be detected in [10:30, 70:90]
    assert np.sum(res["flooded_vegetation_mask"][10:30, 70:90]) > 200


def test_terrain_slope_mask():
    """Verifies that steep slopes (> 5 deg) are flagged and excluded."""
    # Steep ramp from 0 to 500m over 10 pixels (300m distance -> slope ~59 deg)
    steep_dem = np.linspace(0, 500, 100).reshape(100, 1).repeat(100, axis=1)
    water_mask = np.ones((100, 100), dtype=bool)

    filtered, steep_terrain = TerrainSlopeMasker.apply_slope_mask(
        candidate_water_mask=water_mask,
        elevation_grid=steep_dem,
        max_slope_deg=5.0,
        pixel_size_m=30.0,
    )

    assert np.all(steep_terrain)
    assert np.sum(filtered) == 0


def test_polygonizer_equal_area():
    """Verifies rasterio polygonization and geodesic equal-area measurement."""
    # 100x100 binary mask with a 20x20 square
    mask = np.zeros((100, 100), dtype=bool)
    mask[20:40, 20:40] = True
    bounds = [92.0, 26.0, 92.5, 26.5]  # ~0.5 degree square

    geojson = RasterPolygonizer.polygonize_and_measure(
        binary_mask=mask,
        bounds=bounds,
        layer_name="Test_Inundation",
        min_mmu_ha=0.5,
        equal_area_crs="EPSG:6933",
    )

    assert geojson["type"] == "FeatureCollection"
    assert len(geojson["features"]) == 1
    measured_area = geojson["properties"]["total_area_km2"]
    # 20x20 of 100x100 is 4% of total bounding box
    # Total bbox ~ 50km * 55km ~ 2750 km² -> 4% ~ 110 km²
    assert 50.0 < measured_area < 200.0


def test_exposure_engine():
    """Verifies zonal statistics and settlement exposure calculation."""
    # Create simple polygon covering Morigaon area
    mock_geojson = {
        "type": "FeatureCollection",
        "properties": {"total_area_km2": 150.0},
        "features": [
            {
                "type": "Feature",
                "properties": {"area_km2": 150.0},
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                        [
                            [92.1, 26.1],
                            [92.5, 26.1],
                            [92.5, 26.4],
                            [92.1, 26.4],
                            [92.1, 26.1],
                        ]
                    ],
                },
            }
        ],
    }

    impact = ExposureEngine.compute_exposure(
        flood_geojson=mock_geojson,
        validation_status="Not independently validated",
    )

    assert impact.hasData is True
    assert impact.totalFloodedAreaKm2 == 150.0
    assert impact.affectedDistrictsCount >= 1
    assert "Morigaon" in [d.district for d in impact.districtBreakdown]
    assert impact.validationStatus == "Not independently validated"
    assert "modelled estimate" in impact.disclaimer.lower()
