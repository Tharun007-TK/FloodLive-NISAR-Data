import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, CircleMarker, Popup, ScaleControl, ZoomControl, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  floodExtentGeoJSON,
  permanentWaterGeoJSON,
  studyAreaGeoJSON,
  agriculturalLandGeoJSON,
  villageLocations,
} from '../../data/geoData';

// Fix default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const SEVERITY_COLOR = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB547',
  MODERATE: '#438BFF',
  LOW: '#35D39A',
};

function severityColor(sev) {
  return SEVERITY_COLOR[sev] || '#438BFF';
}

function floodStyle(feature) {
  const color = severityColor(feature.properties?.severity);
  return {
    fillColor: color,
    fillOpacity: 0.45,
    color: color,
    weight: 1.5,
    opacity: 0.85,
  };
}

function waterStyle() {
  return {
    color: '#00D5FF',
    weight: 2.5,
    fillColor: '#00D5FF',
    fillOpacity: 0.3,
    opacity: 0.9,
  };
}

function studyAreaStyle() {
  return {
    color: '#00D5FF',
    weight: 1.5,
    fillColor: 'transparent',
    fillOpacity: 0,
    opacity: 0.4,
    dashArray: '8 6',
  };
}

function agriStyle() {
  return {
    fillColor: '#35D39A',
    fillOpacity: 0.2,
    color: '#35D39A',
    weight: 1,
    opacity: 0.5,
  };
}

// Inner component to handle flyTo
function FlyController({ flyTarget, onFlyDone }) {
  const map = useMap();
  useEffect(() => {
    if (flyTarget) {
      map.flyTo([flyTarget.lat, flyTarget.lng], 11, { duration: 1.5 });
      onFlyDone && onFlyDone();
    }
  }, [flyTarget]);
  return null;
}

// Resolve CARTO Basemap URL with optional API key
function getCartoTileUrl() {
  const env = import.meta.env;
  const rawKey = (
    env.VITE_CARTO_API_KEY ||
    env.CARTO_API_KEY ||
    env.VITE_CARTO_KEY ||
    env.CARTO_KEY ||
    env.VITE_CARTO_BASEMAP_KEY ||
    env.CARTO_BASEMAP_KEY ||
    env.VITE_CARTO_TOKEN ||
    env.CARTO_TOKEN ||
    ''
  ).trim();

  // Official CARTO Leaflet raster tiles endpoint
  const baseUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png';
  if (!rawKey) {
    return baseUrl;
  }

  // CARTO uses ?key= for basemap tiles
  if (rawKey.includes('=')) {
    return `${baseUrl}?${rawKey}`;
  }
  return `${baseUrl}?key=${rawKey}`;
}

export default function FloodMap({ layers, onFeatureClick, flyTarget, onFlyDone }) {
  const floodLayerRef = useRef(null);
  const cartoTileUrl = getCartoTileUrl();

  function onEachFloodFeature(feature, layer) {
    const p = feature.properties || {};
    layer.on('click', () => {
      onFeatureClick && onFeatureClick(p);
    });
    layer.on('mouseover', (e) => {
      e.target.setStyle({ fillOpacity: 0.7, weight: 2.5 });
    });
    layer.on('mouseout', (e) => {
      if (floodLayerRef.current) {
        floodLayerRef.current.resetStyle(e.target);
      }
    });
    layer.bindPopup(`
      <div style="font-family:Inter,sans-serif;min-width:160px;">
        <div style="font-size:13px;font-weight:700;color:#F2F6FC;margin-bottom:4px;">${p.district || 'Unknown'}</div>
        <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
          <span style="
            background:${severityColor(p.severity)};
            color:#080D18;font-size:10px;font-weight:700;
            padding:1px 7px;border-radius:4px;letter-spacing:0.06em;
          ">${p.severity || '—'}</span>
        </div>
        <div style="font-size:11px;color:#8B9AAF;line-height:1.6;">
          <span style="color:#8B9AAF;">Area: </span><b style="color:#F2F6FC;">${(p.floodedAreaKm2 || 0).toLocaleString()} km²</b><br/>
          <span style="color:#8B9AAF;">Villages: </span><b style="color:#F2F6FC;">${p.villages || '—'}</b><br/>
          <span style="color:#8B9AAF;">Observed: </span><b style="color:#F2F6FC;">${p.observationDate || '—'}</b>
        </div>
        <div style="font-size:9px;color:#8B9AAF;margin-top:6px;font-style:italic;">DEMO DATA</div>
      </div>
    `);
  }

  return (
    <MapContainer
      center={[26.0, 68.3]}
      zoom={7}
      style={{ width: '100%', height: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        url={cartoTileUrl}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
        maxZoom={20}
      />

      {/* Study area boundary — always shown */}
      <GeoJSON
        key="study-area"
        data={studyAreaGeoJSON}
        style={studyAreaStyle}
      />

      {/* Flood extent */}
      {layers.floodExtent && (
        <GeoJSON
          key="flood-extent"
          data={floodExtentGeoJSON}
          style={floodStyle}
          onEachFeature={onEachFloodFeature}
          ref={floodLayerRef}
        />
      )}

      {/* Permanent water */}
      {layers.permanentWater && (
        <GeoJSON
          key="permanent-water"
          data={permanentWaterGeoJSON}
          style={waterStyle}
        />
      )}

      {/* Agricultural land */}
      {layers.agriculturalLand && (
        <GeoJSON
          key="agri-land"
          data={agriculturalLandGeoJSON}
          style={agriStyle}
        />
      )}

      {/* Village pins */}
      {layers.villagePins && villageLocations.map((v) => (
        <CircleMarker
          key={v.name}
          center={[v.lat, v.lng]}
          radius={v.population > 100000 ? 7 : v.population > 50000 ? 5 : 3.5}
          pathOptions={{
            fillColor: severityColor(v.severity),
            color: '#080D18',
            weight: 1,
            fillOpacity: 0.9,
          }}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter,sans-serif', minWidth: 150 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#F2F6FC', marginBottom: 4 }}>{v.name}</div>
              <div style={{ fontSize: 11, color: '#8B9AAF', lineHeight: 1.6 }}>
                <span>District: </span><b style={{ color: '#F2F6FC' }}>{v.district}</b><br />
                <span>Population: </span><b style={{ color: '#F2F6FC' }}>{v.population.toLocaleString()}</b><br />
                <span>Severity: </span>
                <span style={{
                  color: severityColor(v.severity),
                  fontWeight: 700,
                }}>{v.severity}</span>
              </div>
            </div>
          </Popup>
        </CircleMarker>
      ))}

      <ScaleControl position="bottomleft" />
      <ZoomControl position="topright" />
      <FlyController flyTarget={flyTarget} onFlyDone={onFlyDone} />
    </MapContainer>
  );
}
