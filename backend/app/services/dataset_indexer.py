"""
FloodMap Live — Dataset Storage & Indexing Service
Provides high-performance in-memory caching and filesystem resolution
for local GeoJSON, JSON, and CSV datasets.
"""

import json
import csv
from pathlib import Path
from typing import Dict, Any, List, Optional
from app.config import settings

# In-memory GeoJSON cache to prevent repetitive disk I/O
_CACHE: Dict[str, Any] = {}


class DatasetStorageService:
    """Manages reading, caching, and serving geospatial datasets from the data folder."""

    @classmethod
    def get_data_dir(cls) -> Path:
        return settings.DATASET_STORAGE_PATH

    @classmethod
    def load_json(cls, relative_path: str, use_cache: bool = True) -> Optional[Dict[str, Any]]:
        """Loads and caches a JSON/GeoJSON file relative to the data root."""
        clean_rel = relative_path.lstrip("/\\")
        if clean_rel.startswith("data/"):
            clean_rel = clean_rel[5:]

        full_path = cls.get_data_dir() / clean_rel
        cache_key = str(full_path.resolve())

        if use_cache and cache_key in _CACHE:
            return _CACHE[cache_key]

        if not full_path.exists():
            return None

        try:
            with open(full_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                if use_cache:
                    _CACHE[cache_key] = data
                return data
        except Exception as e:
            print(f"[Error] Failed to read JSON at {full_path}: {e}")
            return None

    @classmethod
    def load_csv(cls, relative_path: str) -> List[Dict[str, Any]]:
        """Parses a CSV file into a list of row dictionaries."""
        clean_rel = relative_path.lstrip("/\\")
        if clean_rel.startswith("data/"):
            clean_rel = clean_rel[5:]

        full_path = cls.get_data_dir() / clean_rel
        if not full_path.exists():
            return []

        rows = []
        try:
            with open(full_path, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    # Cast numbers where appropriate
                    parsed_row = {}
                    for k, v in row.items():
                        try:
                            parsed_row[k] = float(v) if "." in v else int(v)
                        except ValueError:
                            parsed_row[k] = v
                    rows.append(parsed_row)
        except Exception as e:
            print(f"[Error] Failed to read CSV at {full_path}: {e}")
        return rows

    @classmethod
    def get_manifest(cls) -> Dict[str, Any]:
        """Loads the auto-generated manifest.json."""
        manifest = cls.load_json("manifest.json", use_cache=False)
        if not manifest:
            return {
                "generatedAt": "",
                "summary": {"totalDatasets": 0, "byCategory": {}, "byFormat": {}},
                "datasets": [],
            }
        return manifest

    @classmethod
    def get_flood_extent_geojson(cls, observation_id: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Returns the classified flood extent GeoJSON for an observation."""
        if observation_id and "20240610" in observation_id:
            return cls.load_json("nisar/nisar_20240610_preflood_extent.geojson")
        return cls.load_json("nisar/nisar_20240708_flood_extent.geojson")

    @classmethod
    def get_permanent_water_geojson(cls) -> Optional[Dict[str, Any]]:
        return cls.load_json("permanent-water/permanent_water_mask.geojson")

    @classmethod
    def get_districts_geojson(cls) -> Optional[Dict[str, Any]]:
        return cls.load_json("boundaries/districts.geojson")

    @classmethod
    def get_villages_geojson(cls) -> Optional[Dict[str, Any]]:
        return cls.load_json("boundaries/villages.geojson")

    @classmethod
    def get_cropland_geojson(cls) -> Optional[Dict[str, Any]]:
        return cls.load_json("agriculture/cropland_exposure.geojson")

    @classmethod
    def get_observations_catalog(cls) -> List[Dict[str, Any]]:
        catalog = cls.load_json("nisar/nisar_observations_catalog.json")
        return catalog if isinstance(catalog, list) else []

    @classmethod
    def get_rainfall_timeseries(cls) -> List[Dict[str, Any]]:
        return cls.load_csv("reference-data/daily_rainfall_timeseries.csv")
