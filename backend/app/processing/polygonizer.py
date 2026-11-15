"""
FloodMap Live — Raster-to-Vector Polygonizer & Equal-Area CRS Transformer
Converts classified binary water rasters into GeoJSON polygons with Minimum Mapping Unit (MMU)
filtering and rigorous Equal-Area projection geodesic area calculation.
"""

import logging
from typing import Dict, Any, List, Tuple
import numpy as np
import rasterio
from rasterio.features import shapes
from rasterio.transform import from_bounds
from shapely.geometry import shape, mapping, Polygon, MultiPolygon
from shapely.ops import transform
import pyproj

from app.config import settings

logger = logging.getLogger("floodmap.polygonizer")


class RasterPolygonizer:
    """
    Polygonizes binary classified rasters using rasterio and computes truthful
    equal-area square kilometer measurements. Zero degree-squared approximations.
    """

    @classmethod
    def polygonize_and_measure(
        cls,
        binary_mask: np.ndarray,
        bounds: List[float],  # [min_lon, min_lat, max_lon, max_lat]
        layer_name: str = "Classified_Episodic_Flood_Extent",
        min_mmu_ha: float = 1.0,  # 1 ha = 0.01 km2
        equal_area_crs: str = "EPSG:6933",
        simplify_tolerance_deg: float = 0.0002
    ) -> Dict[str, Any]:
        """
        Polygonizes binary mask, reprojects each polygon to equal-area CRS for area calculation,
        filters by MMU, and returns GeoJSON FeatureCollection.
        """
        min_lon, min_lat, max_lon, max_lat = bounds
        height, width = binary_mask.shape

        if np.sum(binary_mask) == 0:
            return {
                "type": "FeatureCollection",
                "name": layer_name,
                "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
                "properties": {
                    "total_area_km2": 0.0,
                    "feature_count": 0,
                    "mmu_applied_ha": min_mmu_ha,
                    "area_computation_crs": equal_area_crs
                },
                "features": []
            }

        # Affine transform for raster coordinates
        affine_transform = from_bounds(min_lon, min_lat, max_lon, max_lat, width, height)

        # Coordinate transformers
        proj_wgs84 = pyproj.CRS("EPSG:4326")
        proj_equal_area = pyproj.CRS(equal_area_crs)
        transformer_to_equal_area = pyproj.Transformer.from_crs(proj_wgs84, proj_equal_area, always_xy=True).transform

        min_mmu_km2 = min_mmu_ha * 0.01

        features = []
        total_area_km2 = 0.0

        # Vectorize contiguous water regions
        mask_uint8 = binary_mask.astype(np.uint8)
        raw_shapes = shapes(mask_uint8, mask=binary_mask, transform=affine_transform)

        for geom_dict, val in raw_shapes:
            if val != 1:
                continue

            try:
                poly = shape(geom_dict)
                if not poly.is_valid:
                    poly = poly.buffer(0)
                if poly.is_empty:
                    continue

                # Reproject to Equal-Area CRS to compute exact area
                poly_ea = transform(transformer_to_equal_area, poly)
                area_m2 = poly_ea.area
                area_km2 = float(area_m2 / 1_000_000.0)

                # Filter out speckle below Minimum Mapping Unit
                if area_km2 < min_mmu_km2:
                    continue

                total_area_km2 += area_km2

                # Simplify geometry for fast web rendering while keeping exact area
                poly_simplified = poly.simplify(simplify_tolerance_deg, preserve_topology=True)

                features.append({
                    "type": "Feature",
                    "properties": {
                        "area_km2": round(area_km2, 4),
                        "area_ha": round(area_km2 * 100.0, 2),
                        "classification": layer_name,
                        "mmu_compliant": True
                    },
                    "geometry": mapping(poly_simplified)
                })

            except Exception as e:
                logger.warning(f"Error measuring polygon geometry: {e}")
                continue

        logger.info(f"Polygonized {len(features)} MMU-compliant features (Total Area: {total_area_km2:.2f} km²).")

        return {
            "type": "FeatureCollection",
            "name": layer_name,
            "crs": {"type": "name", "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}},
            "properties": {
                "total_area_km2": round(total_area_km2, 4),
                "feature_count": len(features),
                "mmu_applied_ha": min_mmu_ha,
                "area_computation_crs": equal_area_crs
            },
            "features": features
        }
