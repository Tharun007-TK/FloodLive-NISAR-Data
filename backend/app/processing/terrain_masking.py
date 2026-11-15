"""
FloodMap Live — Terrain & Slope Masking Service
Calculates topographic slope and eliminates false water detections on elevated terrain
using Copernicus DEM GLO-30 specifications.
"""

import logging
from typing import Dict, Any, Tuple, Optional
import numpy as np

logger = logging.getLogger("floodmap.terrain_masking")


class TerrainSlopeMasker:
    """
    Applies topographic slope masking based on Copernicus DEM GLO-30 elevation data.
    Water cannot pool on steep relief. Excludes false positives from mountain radar shadow.
    """

    @staticmethod
    def calculate_slope(elevation_grid: np.ndarray, cell_size_m: float = 30.0) -> np.ndarray:
        """
        Calculates terrain slope in degrees using Horn's second-order gradient formulation.
        """
        dy, dx = np.gradient(elevation_grid, cell_size_m, cell_size_m)
        slope_rad = np.arctan(np.sqrt(dx**2 + dy**2))
        slope_deg = np.degrees(slope_rad)
        return slope_deg

    @classmethod
    def apply_slope_mask(
        cls,
        candidate_water_mask: np.ndarray,
        elevation_grid: Optional[np.ndarray] = None,
        max_slope_deg: float = 5.0,
        pixel_size_m: float = 30.0
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Filters out candidate water pixels where terrain slope exceeds max_slope_deg.
        Returns: (filtered_water_mask, excluded_slope_mask)
        """
        if elevation_grid is None:
            # If DEM is flat floodplain or absent, return unmasked with empty slope flag
            return candidate_water_mask, np.zeros_like(candidate_water_mask, dtype=bool)

        slope_deg = cls.calculate_slope(elevation_grid, pixel_size_m)
        steep_terrain = slope_deg > max_slope_deg

        filtered_mask = candidate_water_mask & (~steep_terrain)
        excluded_pixels = candidate_water_mask & steep_terrain

        logger.info(f"Slope mask (> {max_slope_deg}°): Excluded {np.sum(excluded_pixels)} false-positive pixels.")
        return filtered_mask, steep_terrain
