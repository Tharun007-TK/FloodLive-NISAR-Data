"""
FloodMap Live — SAR Water & Inundation Classifier
Implements automated Otsu thresholding, bitemporal change detection,
and L-band double-bounce flooded vegetation detection.
"""

import logging
from typing import Dict, Any, Tuple
import numpy as np

logger = logging.getLogger("floodmap.water_classifier")


class WaterClassifier:
    """
    Classifies open surface water and flooded vegetation from calibrated SAR backscatter.
    All mathematical thresholds are parameterized and recorded in metadata.
    """

    @staticmethod
    def calculate_otsu_threshold(data_db: np.ndarray, valid_mask: np.ndarray) -> float:
        """
        Calculates optimal discriminant threshold between water and non-water modes
        using Otsu's method on the histogram of valid SAR backscatter (dB).
        """
        valid_vals = data_db[valid_mask & np.isfinite(data_db)]
        if len(valid_vals) < 100:
            return -19.5  # Standard physical reference default if sample is too small

        # Clip values to plausible SAR terrestrial dynamic range (-35 dB to +5 dB)
        clipped = np.clip(valid_vals, -35.0, 5.0)

        # 256-bin histogram
        hist, bin_edges = np.histogram(clipped, bins=256, density=True)
        bin_centers = (bin_edges[:-1] + bin_edges[1:]) / 2.0

        weight1 = np.cumsum(hist)
        weight2 = np.cumsum(hist[::-1])[::-1]

        mean1 = np.cumsum(hist * bin_centers) / np.maximum(weight1, 1e-9)
        mean2 = (np.cumsum((hist * bin_centers)[::-1]) / np.maximum(weight2[::-1], 1e-9))[::-1]

        variance = weight1[:-1] * weight2[1:] * ((mean1[:-1] - mean2[1:]) ** 2)

        idx = np.argmax(variance)
        optimal_threshold = float(bin_centers[idx])

        # Constrain threshold to realistic physical SAR open water range (-26 dB to -15 dB)
        clamped_threshold = float(np.clip(optimal_threshold, -26.0, -15.0))
        logger.info(f"Otsu optimal threshold: {optimal_threshold:.2f} dB (clamped: {clamped_threshold:.2f} dB)")
        return clamped_threshold

    @classmethod
    def classify_bitemporal_flood(
        cls,
        pre_hvhv_db: np.ndarray,
        post_hvhv_db: np.ndarray,
        pre_hhhh_db: np.ndarray,
        post_hhhh_db: np.ndarray,
        valid_mask: np.ndarray,
        method: str = "otsu",
        manual_threshold_db: float = -19.5,
        ratio_drop_threshold_db: float = -4.5,
        detect_flooded_veg: bool = True
    ) -> Dict[str, Any]:
        """
        Executes bitemporal change detection and thresholding:
        1. Open water threshold (Otsu or manual) on post-flood HV
        2. Bitemporal change test: Δγ° = γ°_post - γ°_pre < ratio_drop_threshold_db
        3. Double-bounce flooded vegetation test: Δγ° > +3.0 dB in vegetated zones
        """
        # Determine water threshold
        if method.lower() == "otsu":
            threshold_db = cls.calculate_otsu_threshold(post_hvhv_db, valid_mask)
        else:
            threshold_db = float(manual_threshold_db)

        # Open water specular reflection (very low backscatter)
        open_water_raw = (post_hvhv_db <= threshold_db) & valid_mask

        # Bitemporal difference (decibels drop)
        delta_hv_db = post_hvhv_db - pre_hvhv_db
        delta_hh_db = post_hhhh_db - pre_hhhh_db

        # Episodic newly inundated land: must be water in post-flood AND have dropped significantly from pre-flood
        episodic_inundation_mask = open_water_raw & (delta_hv_db <= ratio_drop_threshold_db)

        # Flooded vegetation double-bounce detection:
        # L-band radar penetrates canopy; water underneath creates trunk-ground corner reflector,
        # boosting backscatter by +3 dB or more in HH/HV.
        flooded_veg_mask = np.zeros_like(open_water_raw, dtype=bool)
        if detect_flooded_veg:
            # Significant backscatter enhancement
            enhanced_backscatter = (delta_hh_db >= 3.0) | (delta_hv_db >= 3.0)
            # Must not be already classified as open specular water
            flooded_veg_mask = enhanced_backscatter & (~open_water_raw) & valid_mask

        return {
            "threshold_applied_db": threshold_db,
            "threshold_method": method,
            "ratio_drop_threshold_db": ratio_drop_threshold_db,
            "open_water_mask": open_water_raw,
            "episodic_inundation_mask": episodic_inundation_mask,
            "flooded_vegetation_mask": flooded_veg_mask,
            "delta_hv_db": delta_hv_db,
            "delta_hh_db": delta_hh_db,
        }
