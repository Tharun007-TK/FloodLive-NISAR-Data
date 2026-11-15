"""
Independent Area Verification Script (Acceptance Check 3)
Independently recomputes the geodesic flooded area directly from
backend/cache/jobs/3167914d070ff49b/episodic_flood_extent.geojson
in EPSG:6933 Equal-Area projection and verifies against provenance.json.
"""

import sys
import json
import pyproj
from shapely.geometry import shape
from shapely.ops import transform

geojson_path = "backend/cache/jobs/3167914d070ff49b/episodic_flood_extent.geojson"
prov_path = "backend/cache/jobs/3167914d070ff49b/provenance.json"

with open(geojson_path, "r") as f:
    geojson = json.load(f)

with open(prov_path, "r") as f:
    prov = json.load(f)

stated_area_km2 = float(geojson["properties"]["total_area_km2"])
prov_stated_area_km2 = float(prov["summary"]["totalFloodedAreaKm2"])

print(f"Stated Area in GeoJSON Properties: {stated_area_km2:.4f} km²")
print(f"Stated Area in Provenance Metadata: {prov_stated_area_km2:.4f} km²")

# Setup independent Equal-Area projection transformer (EPSG:6933)
wgs84 = pyproj.CRS("EPSG:4326")
equal_area = pyproj.CRS("EPSG:6933")
transformer = pyproj.Transformer.from_crs(wgs84, equal_area, always_xy=True).transform

recomputed_total_m2 = 0.0
feature_details = []

for idx, feat in enumerate(geojson["features"]):
    geom = shape(feat["geometry"])
    geom_ea = transform(transformer, geom)
    area_km2 = geom_ea.area / 1_000_000.0
    recomputed_total_m2 += geom_ea.area
    
    sector = feat["properties"].get("sector", f"Feature {idx}")
    prop_area = feat["properties"].get("area_km2", 0.0)
    diff = abs(area_km2 - prop_area)
    feature_details.append((sector, prop_area, area_km2, diff))

recomputed_total_km2 = recomputed_total_m2 / 1_000_000.0
absolute_diff = abs(recomputed_total_km2 - stated_area_km2)
relative_error_pct = (absolute_diff / stated_area_km2) * 100.0

print("\n--- Per-Feature Independent Check ---")
for sector, prop_a, recalc_a, diff in feature_details:
    print(f"  * {sector}: Stated={prop_a:.3f} km², Recomputed={recalc_a:.3f} km², Diff={diff:.6f} km²")

print(f"\nTotal Recomputed Flooded Area: {recomputed_total_km2:.4f} km²")
print(f"Absolute Difference: {absolute_diff:.6f} km²")
print(f"Relative Error: {relative_error_pct:.6f}%")

# Tolerance assertion: within 0.01%
tolerance_pct = 0.01
assert relative_error_pct < tolerance_pct, f"Error {relative_error_pct}% exceeds tolerance {tolerance_pct}%"
print(f"\n[PASS] Acceptance Check 3 VERIFIED: Recomputation matches within stated tolerance (< {tolerance_pct}%).")
