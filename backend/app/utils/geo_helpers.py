"""
FloodMap Live — Geospatial Utilities
"""

from typing import List, Tuple, Any


def calculate_bounding_box(coords: List[Any]) -> Tuple[float, float, float, float]:
    """Calculates 2D bounding box (min_lng, min_lat, max_lng, max_lat) from nested coordinate lists."""
    min_lng, min_lat = float("inf"), float("inf")
    max_lng, max_lat = float("-inf"), float("-inf")

    def traverse(item):
        nonlocal min_lng, min_lat, max_lng, max_lat
        if isinstance(item, (list, tuple)):
            if len(item) == 2 and isinstance(item[0], (int, float)) and isinstance(item[1], (int, float)):
                lng, lat = float(item[0]), float(item[1])
                min_lng = min(min_lng, lng)
                min_lat = min(min_lat, lat)
                max_lng = max(max_lng, lng)
                max_lat = max(max_lat, lat)
            else:
                for sub in item:
                    traverse(sub)

    traverse(coords)
    return min_lng, min_lat, max_lng, max_lat
