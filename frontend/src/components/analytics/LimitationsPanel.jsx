import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, ShieldAlert, Check } from 'lucide-react';

const LIMITATIONS = [
  {
    title: 'Vegetation Canopy Masking (Sub-Canopy Flooding)',
    description: 'Dense forest canopies and tall emergent vegetation attenuate radar pulses. While L-band (24 cm wavelength) penetrates deeper into vegetation than C-band, dense closed-canopy swamps can obscure underlying standing floodwater.',
    mitigation: 'L-band cross-polarization (VH/HV) double-bounce enhancement.'
  },
  {
    title: 'Urban Multi-Path Radar Scatter (Double-Bounce)',
    description: 'Man-made vertical walls and flat pavement create corner-reflector effects that dramatically increase backscatter, mimicking dry land or bright targets even when streets are inundated with water.',
    mitigation: 'Integration of high-resolution building footprints and elevation contours.'
  },
  {
    title: 'Wind-Roughened Water Surfaces',
    description: 'Strong monsoon winds create surface capillary waves on open water bodies. This eliminates specular reflection and scatters radar energy back to the antenna, appearing as higher backscatter similar to wet soil.',
    mitigation: 'Multi-temporal ratioing against calm baseline acquisitions and incidence angle correction.'
  },
  {
    title: 'Radar Shadow and Layover in Steep Terrain',
    description: 'Side-looking synthetic aperture radar creates geometric distortions in hilly or mountainous terrain (such as the Karbi Anglong and Meghalaya foothills bordering Assam), causing radar shadows that mimic dark water.',
    mitigation: 'SRTM / Copernicus DEM terrain mask filtering and slope thresholding.'
  },
  {
    title: 'Satellite Revisit Latency',
    description: 'NISAR has a 12-day exact repeat orbital cycle. Flash floods that crest and recede within 2 to 3 days between orbital passes will not be captured in the observation record.',
    mitigation: 'Multi-constellation integration combining NISAR, Sentinel-1, and future radar swarms.'
  },
  {
    title: 'Extent Mapping vs. Forecasting',
    description: 'FloodMap Live is an observational geospatial impact and flood extent platform. It reflects physical surface inundation captured by sensors and is NOT a hydrologic rainfall-runoff forecast model.',
    mitigation: 'Ground-truth field surveys and hydrological station calibration required.'
  }
];

export default function LimitationsPanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{
      background: '#141F30',
      border: '1px solid rgba(255, 181, 71, 0.25)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'rgba(255, 181, 71, 0.08)',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertTriangle size={18} color="#FFB547" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F2F6FC' }}>
              SCIENTIFIC LIMITATIONS & SAR RADAR PHYSICS
            </div>
            <div style={{ fontSize: 11, color: '#8B9AAF' }}>
              Essential constraints on synthetic aperture radar flood extent classification
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#FFB547', fontSize: 12 }}>
          <span>{expanded ? 'Collapse' : 'Expand 6 Constraints'}</span>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {expanded && (
        <div style={{
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 14,
          borderTop: '1px solid rgba(255, 181, 71, 0.15)',
        }}>
          {LIMITATIONS.map((lim, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(8, 13, 24, 0.7)',
                padding: '12px 14px',
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 700, color: '#FFB547' }}>
                {idx + 1}. {lim.title}
              </div>
              <div style={{ fontSize: 11, color: '#CBD5E1', lineHeight: 1.5 }}>
                {lim.description}
              </div>
              <div style={{
                fontSize: 10,
                color: '#35D39A',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: 6,
                marginTop: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 4
              }}>
                <Check size={12} color="#35D39A" />
                <span><strong>Mitigation:</strong> {lim.mitigation}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
