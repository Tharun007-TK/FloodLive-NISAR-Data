import React from 'react';
import { Satellite, Clock, Radio } from 'lucide-react';

const statusStyle = {
  DEMO: {
    background: 'rgba(255,181,71,0.12)',
    color: '#FFB547',
    border: '1px solid rgba(255,181,71,0.3)',
  },
  LIVE: {
    background: 'rgba(53,211,154,0.12)',
    color: '#35D39A',
    border: '1px solid rgba(53,211,154,0.3)',
  },
};

const ObservationFeed = ({ observations = [] }) => {
  return (
    <div style={{
      background: '#141F30',
      borderRadius: '8px',
      overflow: 'hidden',
      height: '100%',
    }}>
      {observations.map((obs, i) => (
        <div
          key={obs.id}
          style={{
            padding: '12px 14px',
            borderBottom: i < observations.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start',
            transition: 'background 0.15s',
            cursor: 'default',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(67,139,255,0.05)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
        >
          {/* Icon */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '6px',
            background: 'rgba(0,213,255,0.08)',
            border: '1px solid rgba(0,213,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Satellite size={16} color="#00D5FF" />
          </div>

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{
                fontFamily: 'IBM Plex Mono, monospace',
                fontSize: '13px',
                color: '#F2F6FC',
                fontWeight: 500,
              }}>
                {obs.satellite}
              </span>
              <span style={{
                ...statusStyle[obs.status] || statusStyle.DEMO,
                borderRadius: '3px',
                padding: '1px 6px',
                fontSize: '9px',
                fontFamily: 'IBM Plex Mono, monospace',
                fontWeight: 700,
                letterSpacing: '0.05em',
              }}>
                {obs.status}
              </span>
            </div>

            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '10px',
              color: '#8B9AAF',
              marginBottom: '6px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {obs.id}
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8B9AAF' }}>
                <Clock size={11} />
                {obs.acquisitionDate} · {obs.acquisitionTime}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8B9AAF' }}>
                <Radio size={11} />
                {obs.polarization} · {obs.resolution}
              </span>
            </div>
          </div>

          {/* Coverage */}
          <div style={{ textAlign: 'right', flexShrink: 0 }}>
            <div style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '14px',
              fontWeight: 700,
              color: '#00D5FF',
            }}>
              {obs.coveragePct}%
            </div>
            <div style={{ fontSize: '9px', color: '#8B9AAF', fontFamily: 'Inter, sans-serif' }}>
              coverage
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ObservationFeed;
