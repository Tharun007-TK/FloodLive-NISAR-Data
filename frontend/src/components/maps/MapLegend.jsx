import React from 'react';
import { Info } from 'lucide-react';

export default function MapLegend() {
  return (
    <div style={{
      position: 'absolute',
      bottom: 24,
      right: 16,
      width: 230,
      background: 'rgba(16, 24, 39, 0.94)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(0, 213, 255, 0.2)',
      borderRadius: 8,
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      padding: '12px 14px',
      fontFamily: 'Inter, sans-serif',
    }}>
      <div style={{
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.05em',
        color: '#F2F6FC',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: 6,
      }}>
        <span>MAP LEGEND</span>
        <span style={{ fontSize: 9, color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
          EPSG:4326
        </span>
      </div>

      {/* Flood Severity Classes */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: '#8B9AAF', marginBottom: 4, fontWeight: 600 }}>
          DETECTED FLOOD SEVERITY
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#F2F6FC' }}>
            <span style={{ width: 10, height: 10, background: '#FF5252', borderRadius: 2 }} />
            Critical
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#F2F6FC' }}>
            <span style={{ width: 10, height: 10, background: '#FFB547', borderRadius: 2 }} />
            High
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#F2F6FC' }}>
            <span style={{ width: 10, height: 10, background: '#438BFF', borderRadius: 2 }} />
            Moderate
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#F2F6FC' }}>
            <span style={{ width: 10, height: 10, background: '#35D39A', borderRadius: 2 }} />
            Low
          </div>
        </div>
      </div>

      {/* Surface Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
          <span style={{ width: 14, height: 3, background: '#00D5FF', borderRadius: 1 }} />
          Permanent River / Channel
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
          <span style={{ width: 10, height: 10, background: '#35D39A', opacity: 0.5, borderRadius: 2 }} />
          Agricultural Land Overlap
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: '#CBD5E1' }}>
          <span style={{ width: 8, height: 8, background: '#FFB547', borderRadius: '50%' }} />
          Exposed Settlement Point
        </div>
      </div>

      {/* Scientific Transparency note */}
      <div style={{
        marginTop: 8,
        paddingTop: 6,
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        fontSize: 9,
        color: '#8B9AAF',
        lineHeight: 1.3
      }}>
        <Info size={11} style={{ flexShrink: 0, marginTop: 1, color: '#00D5FF' }} />
        <span>Permanent water masked out via baseline radar subtraction.</span>
      </div>
    </div>
  );
}
