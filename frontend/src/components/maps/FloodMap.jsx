import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Tooltip, ScaleControl, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Coordinate tracker component
function CoordinateReadout() {
  const [coords, setCoords] = useState(null);

  useMapEvents({
    mousemove(e) {
      setCoords([e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)]);
    },
    mouseout() {
      setCoords(null);
    }
  });

  if (!coords) return null;

  return (
    <div
      className="coord-readout font-mono"
      style={{
        position: 'absolute',
        bottom: '8px',
        right: '8px',
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        padding: '2px 8px',
        borderRadius: 'var(--radius-xs)',
        fontSize: 'var(--text-xs)',
        color: 'var(--text-secondary)',
        zIndex: 1000,
        boxShadow: 'var(--shadow-sm)',
        pointerEvents: 'none'
      }}
    >
      Lat: {coords[0]}° N, Lon: {coords[1]}° E
    </div>
  );
}

// Single-hue sequential flood severity ramp (Color-blind safe)
function getFloodColor(areaKm2) {
  if (areaKm2 > 250) return '#0369A1'; // Critical
  if (areaKm2 > 200) return '#0284C7'; // High
  if (areaKm2 > 100) return '#38BDF8'; // Moderate
  return '#BAE6FD'; // Low
}

export default function FloodMap({
  floodGeoJSON,
  floodedVegGeoJSON,
  settlements = [],
  selectedFeature,
  onSelectFeature,
  layers = { floodExtent: true, floodedVeg: true, settlements: true, baseMap: 'streets' },
  opacity = { floodExtent: 0.85, floodedVeg: 0.75 },
  center = [26.35, 92.45],
  zoom = 9
}) {
  // Base map provider selection (OpenStreetMap & Esri)
  let baseMapUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  let baseMapAttr = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  if (layers.baseMap === 'satellite') {
    baseMapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    baseMapAttr = '&copy; Esri, Maxar, Earthstar Geographics';
  } else if (layers.baseMap === 'topo') {
    baseMapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
    baseMapAttr = '&copy; Esri, DeLorme, USGS, NPS';
  } else if (isDark) {
    baseMapUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}';
    baseMapAttr = '&copy; Esri, HERE, Garmin, METI/NASA, USGS';
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        style={{ width: '100%', height: '100%', backgroundColor: 'var(--surface-base)' }}
      >
        <TileLayer
          attribution={baseMapAttr}
          url={baseMapUrl}
          maxZoom={19}
        />

        <ScaleControl position="bottomleft" metric={true} imperial={false} />
        <CoordinateReadout />

        {/* Episodic Flood Inundation Polygons */}
        {layers.floodExtent && floodGeoJSON && (
          <GeoJSON
            key={`flood-${floodGeoJSON.properties?.job_id || 'default'}-${opacity.floodExtent}`}
            data={floodGeoJSON}
            style={(feature) => {
              const area = feature.properties?.area_km2 || 100;
              const color = getFloodColor(area);
              const isSelected = selectedFeature && selectedFeature.properties?.sector === feature.properties?.sector;

              return {
                fillColor: color,
                fillOpacity: opacity.floodExtent,
                color: isSelected ? 'var(--text-primary)' : color,
                weight: isSelected ? 2.5 : 1.2,
                opacity: 0.95
              };
            }}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => {
                  if (onSelectFeature) onSelectFeature(feature);
                }
              });
            }}
          />
        )}

        {/* Flooded Vegetation Double-Bounce Layer */}
        {layers.floodedVeg && floodedVegGeoJSON && (
          <GeoJSON
            key={`veg-${floodedVegGeoJSON.properties?.job_id || 'default'}-${opacity.floodedVeg}`}
            data={floodedVegGeoJSON}
            style={(feature) => ({
              fillColor: '#15803D',
              fillOpacity: opacity.floodedVeg,
              color: '#16A34A',
              weight: 1.5,
              dashArray: '3, 4'
            })}
            onEachFeature={(feature, layer) => {
              layer.on({
                click: () => {
                  if (onSelectFeature) onSelectFeature(feature);
                }
              });
            }}
          />
        )}

        {/* Settlement Location Markers */}
        {layers.settlements && settlements.map((settle) => (
          <CircleMarker
            key={settle.id}
            center={[settle.lat, settle.lng]}
            radius={settle.severity === 'CRITICAL' ? 5 : 4}
            pathOptions={{
              color: settle.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--text-primary)',
              fillColor: settle.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--surface-panel)',
              fillOpacity: 0.9,
              weight: 1.5
            }}
          >
            <Tooltip direction="top" offset={[0, -4]} opacity={0.95}>
              <div style={{ fontSize: 'var(--text-xs)', lineHeight: 1.3 }}>
                <div style={{ fontWeight: 600 }}>{settle.name}</div>
                <div style={{ color: 'var(--text-muted)' }}>{settle.district} District</div>
                <div className="font-mono" style={{ marginTop: '2px' }}>
                  Modelled Pop: {settle.estimatedPopulation.toLocaleString()}
                </div>
              </div>
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
