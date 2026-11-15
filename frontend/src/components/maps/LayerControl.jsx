import React from 'react';
import { Layers, Eye, EyeOff, ShieldCheck } from 'lucide-react';

const LAYER_CONFIG = [
  {
    key: 'floodExtent',
    label: 'Detected Flood Extent',
    description: 'SAR bitemporal water detection',
    color: '#FF5252',
    type: 'polygon'
  },
  {
    key: 'permanentWater',
    label: 'Permanent Water Mask',
    description: 'Baseline perennial river & lake bodies',
    color: '#00D5FF',
    type: 'polygon'
  },
  {
    key: 'districtBoundaries',
    label: 'District Boundaries',
    description: 'Administrative assessment units',
    color: 'rgba(255,255,255,0.5)',
    type: 'line'
  },
  {
    key: 'villagePins',
    label: 'Settlement Locations',
    description: 'Vulnerable village point features',
    color: '#FFB547',
    type: 'point'
  },
  {
    key: 'agriculturalLand',
    label: 'Cropland Overlap',
    description: 'Exposed agricultural land zones',
    color: '#35D39A',
    type: 'polygon'
  },
];

export default function LayerControl({ layers, onLayerToggle, totalFloodedArea }) {
  return (
    <div style={{
      position: 'absolute',
      top: 16,
      left: 16,
      width: 270,
      background: 'rgba(16, 24, 39, 0.94)',
      backdropFilter: 'blur(8px)',
      border: '1px solid rgba(0, 213, 255, 0.2)',
      borderRadius: 8,
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
      zIndex: 1000,
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 14px',
        borderBottom: '1px solid rgba(0, 213, 255, 0.12)',
        background: '#141F30',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Layers size={16} color="#00D5FF" />
          <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', color: '#F2F6FC' }}>
            GEOSPATIAL LAYERS
          </span>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          padding: '2px 6px',
          background: 'rgba(53, 211, 154, 0.15)',
          borderRadius: 4,
          fontSize: 10,
          color: '#35D39A',
          fontFamily: "'IBM Plex Mono', monospace"
        }}>
          <ShieldCheck size={11} />
          ACTIVE
        </div>
      </div>

      {/* Layer Items */}
      <div style={{ padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {LAYER_CONFIG.map(item => {
          const active = Boolean(layers[item.key]);
          return (
            <div
              key={item.key}
              onClick={() => onLayerToggle(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '8px 10px',
                borderRadius: 6,
                background: active ? 'rgba(0, 213, 255, 0.05)' : 'transparent',
                border: active ? '1px solid rgba(0, 213, 255, 0.15)' : '1px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {/* Color swatch */}
                <div style={{
                  width: 12,
                  height: 12,
                  borderRadius: item.type === 'point' ? '50%' : 2,
                  background: item.color,
                  boxShadow: active ? `0 0 8px ${item.color}` : 'none',
                  flexShrink: 0
                }} />
                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: active ? '#F2F6FC' : '#8B9AAF'
                  }}>
                    {item.label}
                  </div>
                  <div style={{
                    fontSize: 10,
                    color: '#65758B',
                    lineHeight: 1.2
                  }}>
                    {item.description}
                  </div>
                </div>
              </div>

              {/* Toggle icon */}
              <div style={{
                color: active ? '#00D5FF' : '#475569',
                display: 'flex',
                alignItems: 'center'
              }}>
                {active ? <Eye size={15} /> : <EyeOff size={15} />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div style={{
        padding: '8px 12px',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        background: 'rgba(8, 13, 24, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 10,
        fontFamily: "'IBM Plex Mono', monospace",
        color: '#8B9AAF',
      }}>
        <span>DATUM: WGS84</span>
        <span style={{ color: '#00D5FF' }}>L-BAND SAR</span>
      </div>
    </div>
  );
}
