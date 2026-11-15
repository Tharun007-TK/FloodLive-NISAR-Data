import React, { useState, useEffect } from 'react';
import { Layers, Activity, AlertTriangle, RefreshCw, Info, Calendar, Radio } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { getJobStatus, getJobFloodExtent, getJobFloodedVegetation, getJobImpact, getJobProvenance } from '../../services/dataService';
import FloodMap from '../../components/maps/FloodMap';
import LeftRail from '../../components/dashboard/LeftRail';
import RightDrawer from '../../components/dashboard/RightDrawer';
import ProvenancePopover from '../../components/dashboard/ProvenancePopover';

export default function Dashboard() {
  const { activeEvent, activeJobId, selectedFeature, setSelectedFeature, layers, opacity } = useLocationContext();

  const [floodGeoJSON, setFloodGeoJSON] = useState(null);
  const [floodedVegGeoJSON, setFloodedVegGeoJSON] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [provenance, setProvenance] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadJobData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [flood, veg, impact, prov] = await Promise.all([
        getJobFloodExtent(activeJobId),
        getJobFloodedVegetation(activeJobId),
        getJobImpact(activeJobId),
        getJobProvenance(activeJobId)
      ]);

      setFloodGeoJSON(flood);
      setFloodedVegGeoJSON(veg);
      setImpactData(impact);
      setProvenance(prov);
    } catch (err) {
      console.error('Failed to load NISAR job data:', err);
      setError(err.message || 'Failed to connect to backend processing service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobData();
  }, [activeJobId]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%', overflow: 'hidden' }}>
      {/* KPI Top Strip */}
      <section
        aria-label="Summary KPIs"
        style={{
          height: '52px',
          minHeight: '52px',
          backgroundColor: 'var(--surface-panel)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 var(--space-4)',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {/* KPI 1: Inundated Area */}
          <ProvenancePopover provenance={provenance} title="Episodic Flood Inundation">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Episodic Inundation (km²)
              </span>
              <span className="tabular-nums font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--accent-blue)' }}>
                {impactData ? `${impactData.totalFloodedAreaKm2.toLocaleString()} km²` : loading ? '...' : '0.0 km²'}
              </span>
            </div>
          </ProvenancePopover>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* KPI 2: Flooded Vegetation Double-Bounce */}
          <ProvenancePopover provenance={provenance} title="Flooded Vegetation">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Flooded Veg. Double-Bounce
              </span>
              <span className="tabular-nums font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--status-success)' }}>
                {impactData ? `${impactData.floodedVegetationAreaKm2.toLocaleString()} km²` : loading ? '...' : '0.0 km²'}
              </span>
            </div>
          </ProvenancePopover>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* KPI 3: Affected Districts */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Affected Districts
            </span>
            <span className="tabular-nums font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-primary)' }}>
              {impactData ? `${impactData.affectedDistrictsCount} Districts` : loading ? '...' : '0'}
            </span>
          </div>

          <div style={{ height: '20px', width: '1px', backgroundColor: 'var(--border-subtle)' }} />

          {/* KPI 4: Modelled Population Exposed */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Exposed Pop. (Modelled Estimate)
            </span>
            <span className="tabular-nums font-mono" style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--status-warning)' }}>
              {impactData ? impactData.totalModelledExposedPopulation.toLocaleString() : loading ? '...' : '0'}
            </span>
          </div>
        </div>

        {/* Orbit / Pass Telemetry Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Orbit Overpass:</span>
          <span className="font-mono" style={{ fontWeight: 600 }}>Track 091 / Frame 075</span>
          <span style={{ color: 'var(--text-muted)' }}>Polarization:</span>
          <span className="font-mono">Dual HH / HV</span>
        </div>
      </section>

      {/* Main Workspace Body */}
      <div style={{ position: 'relative', flex: 1, width: '100%', overflow: 'hidden' }}>
        {/* Error Notification Overlay (Honest State) */}
        {error && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--space-4)',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1200,
              backgroundColor: 'var(--status-critical-bg)',
              border: '1px solid var(--status-critical)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-3) var(--space-4)',
              boxShadow: 'var(--shadow-md)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              maxWidth: '600px'
            }}
          >
            <AlertTriangle size={18} color="var(--status-critical)" />
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-primary)', flex: 1 }}>
              <div style={{ fontWeight: 600, color: 'var(--status-critical)' }}>Backend Service Unreachable</div>
              <div style={{ marginTop: '2px' }}>{error}</div>
            </div>
            <button
              onClick={loadJobData}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-1)',
                padding: '4px 8px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--surface-panel)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                cursor: 'pointer'
              }}
            >
              <RefreshCw size={12} />
              Retry
            </button>
          </div>
        )}

        {/* Left Rail Controls */}
        <LeftRail />

        {/* Center Interactive Leaflet Viewport */}
        <FloodMap
          floodGeoJSON={floodGeoJSON}
          floodedVegGeoJSON={floodedVegGeoJSON}
          settlements={impactData?.exposedSettlements || []}
          selectedFeature={selectedFeature}
          onSelectFeature={setSelectedFeature}
          layers={layers}
          opacity={opacity}
          center={activeEvent.center}
          zoom={activeEvent.zoom}
        />

        {/* Right Feature Details Drawer */}
        <RightDrawer />
      </div>
    </div>
  );
}
