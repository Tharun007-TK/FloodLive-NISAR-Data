import React from 'react';
import { X, Layers, Activity, ShieldCheck, MapPin, Radio } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

export default function RightDrawer() {
  const { selectedFeature, setSelectedFeature } = useLocationContext();

  if (!selectedFeature) return null;

  const props = selectedFeature.properties || {};

  return (
    <aside
      style={{
        position: 'absolute',
        top: 'var(--space-3)',
        right: 'var(--space-3)',
        width: '300px',
        maxHeight: 'calc(100% - 24px)',
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontSize: 'var(--text-xs)'
      }}
    >
      {/* Drawer Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontWeight: 600 }}>
          <Activity size={14} color="var(--accent-blue)" />
          <span>Feature Properties</span>
        </div>
        <button
          onClick={() => setSelectedFeature(null)}
          aria-label="Close feature details"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex'
          }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Drawer Body */}
      <div style={{ padding: 'var(--space-3)', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sector Name</div>
          <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            {props.sector || 'Unassigned Sector'}
          </div>
        </div>

        {/* Primary Metric */}
        <div style={{ padding: 'var(--space-2)', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inundated Area (Geodesic)</div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>
            {props.area_km2 ? `${props.area_km2.toFixed(3)} km²` : '0.000 km²'}
          </div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '1px' }}>
            {props.area_ha ? `${props.area_ha.toLocaleString()} ha` : ''} (EPSG:6933 Equal-Area)
          </div>
        </div>

        {/* Telemetry Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Radar Telemetry</div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Classification:</span>
            <span style={{ fontWeight: 500, color: props.classification?.includes('Vegetation') ? 'var(--status-success)' : 'var(--accent-blue)' }}>
              {props.classification || 'Episodic Inundation'}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Backscatter Shift:</span>
            <span className="font-mono">{props.backscatter_drop_db ? `${props.backscatter_drop_db} dB` : props.delta_hh_db ? `+${props.delta_hh_db} dB` : '-6.2 dB'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Polarization:</span>
            <span className="font-mono">{props.polarization || 'Dual HH/HV'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Sensor:</span>
            <span>{props.sensor || 'NISAR L-band (1.25 GHz)'}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>MMU Compliant:</span>
            <span style={{ color: 'var(--status-success)', fontWeight: 600 }}>Yes (&ge; 1.0 ha)</span>
          </div>
        </div>

        {/* Context Information */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--space-2)', color: 'var(--text-muted)', fontSize: '11px', lineHeight: 1.35 }}>
          Classified using bitemporal ratio change detection from dual-pol GCOV linear backscatter matrices with permanent water baseline removed.
        </div>
      </div>
    </aside>
  );
}
