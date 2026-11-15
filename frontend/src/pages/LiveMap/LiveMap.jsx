import React, { useState, useEffect } from 'react';
import FloodMap from '../../components/maps/FloodMap';
import LayerControl from '../../components/maps/LayerControl';
import MapLegend from '../../components/maps/MapLegend';
import FeatureInfoPanel from '../../components/maps/FeatureInfoPanel';
import LocationSearch from '../../components/maps/LocationSearch';
import ComparisonView from './ComparisonView';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import { useWatchArea } from '../../context/LocationContext';
import {
  getFloodExtent,
  getPermanentWaterMask,
  getDistrictBoundaries,
  getStudyAreaBoundary,
  getVillages,
  getCroplandExposure,
  computeImpactStatistics
} from '../../services/dataService';

const TABS = [
  { id: 'map', label: 'Interactive Live Map' },
  { id: 'comparison', label: 'Before / After Comparison' },
];

export default function LiveMap() {
  const { watchArea } = useWatchArea();
  const [layers, setLayers] = useState({
    floodExtent: true,
    permanentWater: true,
    districtBoundaries: true,
    villagePins: true,
    agriculturalLand: false,
  });

  const [selectedFeature, setSelectedFeature] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('map');
  const [flyTarget, setFlyTarget] = useState({ lat: watchArea.lat, lng: watchArea.lng });

  // Dynamic datasets state
  const [geoData, setGeoData] = useState({
    floodExtent: null,
    permanentWater: null,
    districtBoundaries: null,
    studyArea: null,
    villages: null,
    cropland: null,
  });

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync flyTarget when watchArea changes
  useEffect(() => {
    if (watchArea && watchArea.lat && watchArea.lng) {
      setFlyTarget({ lat: watchArea.lat, lng: watchArea.lng });
    }
  }, [watchArea.lat, watchArea.lng]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getFloodExtent(),
      getPermanentWaterMask(),
      getDistrictBoundaries(),
      getStudyAreaBoundary(),
      getVillages(),
      getCroplandExposure()
    ]).then(([flood, water, districts, studyArea, villages, cropland]) => {
      if (!isMounted) return;

      const loaded = {
        floodExtent: flood?.geojson || null,
        permanentWater: water?.geojson || null,
        districtBoundaries: districts?.geojson || null,
        studyArea: studyArea?.geojson || null,
        villages: villages?.geojson || null,
        cropland: cropland?.geojson || null,
      };

      setGeoData(loaded);

      // Compute statistics from loaded datasets
      const computed = computeImpactStatistics({
        floodGeoJSON: loaded.floodExtent,
        districtsGeoJSON: loaded.districtBoundaries,
        villagesGeoJSON: loaded.villages,
        croplandGeoJSON: loaded.cropland
      });

      setStats(computed);
      setLoading(false);
    }).catch(err => {
      console.warn('Error loading map datasets', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  function handleLayerToggle(key) {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function handleFeatureClick(props) {
    setSelectedFeature(props);
  }

  function handleLocationSelect(village) {
    setFlyTarget({ lat: village.lat, lng: village.lng });
    setSearchQuery('');
  }

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#080D18', display: 'flex', flexDirection: 'column' }}>
      {/* Disclaimer strip */}
      <DisclaimerBanner message="SATELLITE EXTENT MAPPING — DERIVED FROM SAR SPECULAR REFLECTION COMPARISON • NOT A FLOOD FORECAST" />

      {/* Tab bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        padding: '6px 16px 0',
        background: '#101827',
        borderBottom: '1px solid rgba(0,213,255,0.15)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 20px',
              background: activeTab === tab.id ? '#141F30' : 'transparent',
              color: activeTab === tab.id ? '#00D5FF' : '#8B9AAF',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #00D5FF' : '2px solid transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {tab.label}
          </button>
        ))}

        {/* Location search in tab bar */}
        {activeTab === 'map' && (
          <div style={{ marginLeft: 'auto', paddingBottom: 6 }}>
            <LocationSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {activeTab === 'map' ? (
          <>
            {/* Leaflet map — fills entire content area */}
            <FloodMap
              layers={layers}
              onFeatureClick={handleFeatureClick}
              flyTarget={flyTarget}
              onFlyDone={() => setFlyTarget(null)}
              dynamicGeoData={geoData}
            />

            {/* Floating layer control — top-left */}
            <LayerControl
              layers={layers}
              onLayerToggle={handleLayerToggle}
              totalFloodedArea={stats?.totalFloodedAreaKm2 || 0}
            />

            {/* Floating feature info panel — top-right when clicked */}
            {selectedFeature && (
              <FeatureInfoPanel
                feature={selectedFeature}
                onClose={() => setSelectedFeature(null)}
              />
            )}

            {/* Floating map legend — bottom-right */}
            <MapLegend />
          </>
        ) : (
          <ComparisonView />
        )}
      </div>
    </div>
  );
}
