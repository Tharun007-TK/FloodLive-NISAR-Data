import React from 'react';
import { Layers, Sliders, Eye, EyeOff, Map as MapIcon, Info } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';

export default function LeftRail() {
  const { layers, toggleLayer, opacity, setLayerOpacity } = useLocationContext();

  return (
    <div
      style={{
        position: 'absolute',
        top: 'var(--space-3)',
        left: 'var(--space-3)',
        width: '240px',
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-md)',
        zIndex: 1000,
        overflow: 'hidden',
        fontSize: 'var(--text-xs)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: 'var(--space-2) var(--space-3)',
          borderBottom: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--surface-subtle)',
          fontWeight: 600,
          color: 'var(--text-secondary)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
          <Layers size={13} />
          <span>Observatory Layers</span>
        </div>
      </div>

      <div style={{ padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {/* Layer Toggles */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Episodic Flood Inundation</span>
            <input
              type="checkbox"
              checked={layers.floodExtent}
              onChange={() => toggleLayer('floodExtent')}
              style={{ cursor: 'pointer' }}
            />
          </label>

          {layers.floodExtent && (
            <div style={{ paddingLeft: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '10px' }}>Opacity:</span>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={opacity.floodExtent}
                onChange={(e) => setLayerOpacity('floodExtent', parseFloat(e.target.value))}
                style={{ flex: 1, height: '4px', cursor: 'pointer' }}
              />
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                {Math.round(opacity.floodExtent * 100)}%
              </span>
            </div>
          )}

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Flooded Vegetation (Double-Bounce)</span>
            <input
              type="checkbox"
              checked={layers.floodedVeg}
              onChange={() => toggleLayer('floodedVeg')}
              style={{ cursor: 'pointer' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
            <span style={{ fontWeight: 500, color: 'var(--text-primary)' }}>Exposed Settlements</span>
            <input
              type="checkbox"
              checked={layers.settlements}
              onChange={() => toggleLayer('settlements')}
              style={{ cursor: 'pointer' }}
            />
          </label>
        </div>

        {/* Base Map Selector */}
        <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
            Base Layer
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-1)' }}>
            <button
              onClick={() => toggleLayer('baseMap')}
              style={{
                padding: '3px 6px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: layers.baseMap === 'streets' ? 'var(--accent-blue-border)' : 'var(--border-subtle)',
                backgroundColor: layers.baseMap === 'streets' ? 'var(--accent-blue-subtle)' : 'transparent',
                color: layers.baseMap === 'streets' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Carto Positron
            </button>
            <button
              onClick={() => toggleLayer('baseMap')}
              style={{
                padding: '3px 6px',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-xs)',
                border: '1px solid',
                borderColor: layers.baseMap === 'satellite' ? 'var(--accent-blue-border)' : 'var(--border-subtle)',
                backgroundColor: layers.baseMap === 'satellite' ? 'var(--accent-blue-subtle)' : 'transparent',
                color: layers.baseMap === 'satellite' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              Satellite
            </button>
          </div>
        </div>

        {/* Legend */}
        <div style={{ paddingTop: 'var(--space-2)', borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginBottom: 'var(--space-1)', textTransform: 'uppercase' }}>
            Flood Severity Ramp
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '12px', height: '10px', backgroundColor: '#0369A1', borderRadius: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Critical (&gt; 250 km²)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '12px', height: '10px', backgroundColor: '#0284C7', borderRadius: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>High (200 - 250 km²)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '12px', height: '10px', backgroundColor: '#38BDF8', borderRadius: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Moderate (100 - 200 km²)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: '12px', height: '10px', backgroundColor: '#BAE6FD', borderRadius: '1px' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Low (&lt; 100 km²)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: '2px' }}>
              <div style={{ width: '12px', height: '10px', backgroundColor: '#15803D', borderRadius: '1px', border: '1px dashed #16A34A' }} />
              <span style={{ color: 'var(--text-secondary)' }}>Flooded Veg. (Double-Bounce)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
