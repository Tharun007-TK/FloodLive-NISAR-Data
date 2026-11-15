"""
FloodMap Live — Permanent Water Masking Service
Separates perennial waterbodies (rivers, lakes, reservoirs) from episodic floodwaters
using JRC Global Surface Water (GSW) Occurrence and ESA WorldCover water classes.
"""

import logging
from typing import Dict, Any, Tuple
import numpy as np

logger = logging.getLogger("floodmap.permanent_water")


class PermanentWaterService:
    """
    Manages permanent water baseline masks.
    Enforces that episodic flood extent represents ONLY newly inundated dry land.
    """

    @staticmethod
    def subtract_permanent_water(
        flood_mask: np.ndarray,
        permanent_water_mask: np.ndarray
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Subtracts permanent perennial waterbodies from observed total surface water.
        Returns: (episodic_flood_mask, permanent_water_mask)
        """
        if permanent_water_mask is None or permanent_water_mask.shape != flood_mask.shape:
            return flood_mask, np.zeros_like(flood_mask, dtype=bool)

        episodic_mask = flood_mask & (~permanent_water_mask)
        masked_permanent = flood_mask & permanent_water_mask

        logger.info(f"Permanent water subtraction: Masked {np.sum(masked_permanent)} perennial water pixels.")
        return episodic_mask, permanent_water_mask
