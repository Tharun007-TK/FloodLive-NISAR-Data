import React from 'react';
import { X, AlertTriangle, MapPin, Layers, Calendar, Activity } from 'lucide-react';
import Badge from '../common/Badge';

export default function FeatureInfoPanel({ feature, onClose }) {
  if (!feature) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 16,
      right: 16,
      width: 320,
      background: 'rgba(16, 24, 39, 0.96)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 213, 255, 0.25)',
      borderRadius: 8,
      boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6)',
      zIndex: 1000,
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      animation: 'slideInRight 0.2s ease-out',
    }}>
      {/* Panel Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        background: '#141F30',
        borderBottom: '1px solid rgba(0, 213, 255, 0.15)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <MapPin size={16} color="#00D5FF" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F2F6FC' }}>
            FEATURE INSPECTION
          </span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#8B9AAF',
            cursor: 'pointer',
            padding: 4,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 4,
          }}
          title="Close panel"
        >
          <X size={16} />
        </button>
      </div>

      {/* Feature Details */}
      <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div style={{ fontSize: 11, color: '#8B9AAF', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            District / Zone
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#F2F6FC', marginTop: 2 }}>
            {feature.district || feature.name || 'Unclassified Region'}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge severity={feature.severity || 'MODERATE'} />
          <span style={{
            fontSize: 11,
            color: '#8B9AAF',
            fontFamily: "'IBM Plex Mono', monospace"
          }}>
            {feature.classification || 'Episodic Inundation'}
          </span>
        </div>

        {/* Metrics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          background: 'rgba(8, 13, 24, 0.6)',
          padding: 10,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.05)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>Inundated Area</div>
            <div style={{ fontSize: 15, fontWeight: 700, color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
              {feature.flooded_area_km2 || feature.area_km2 || '—'} <span style={{ fontSize: 11, fontWeight: 400 }}>km²</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>Estimated Depth</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
              {feature.depth_est_m || '1.0 - 3.0 m'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>Radar Backscatter</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#CBD5E1', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
              {feature.mean_backscatter_db ? `${feature.mean_backscatter_db} dB` : 'Low (Specular)'}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>Flood Type</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginTop: 2 }}>
              {feature.flood_type || 'Open Water'}
            </div>
          </div>
        </div>

        {/* Observation Metadata */}
        <div style={{
          padding: '8px 10px',
          background: 'rgba(0, 213, 255, 0.04)',
          borderRadius: 6,
          border: '1px solid rgba(0, 213, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          fontSize: 11,
          color: '#8B9AAF',
          fontFamily: "'IBM Plex Mono', monospace",
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>SENSOR:</span>
            <span style={{ color: '#F2F6FC' }}>NISAR / L-Band SAR</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>POLARIZATION:</span>
            <span style={{ color: '#00D5FF' }}>VV / VH</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>DATE:</span>
            <span style={{ color: '#F2F6FC' }}>{feature.observationDate || '2024-07-08'}</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 6,
          fontSize: 10,
          color: '#8B9AAF',
          lineHeight: 1.4,
          background: 'rgba(255, 181, 71, 0.08)',
          padding: 8,
          borderRadius: 4,
          border: '1px solid rgba(255, 181, 71, 0.2)'
        }}>
          <AlertTriangle size={13} color="#FFB547" style={{ flexShrink: 0, marginTop: 1 }} />
          <span>Derived from synthetic aperture radar specular reflection analysis. Requires field ground validation.</span>
        </div>
      </div>
    </div>
  );
}
