import React from 'react';
import { Satellite, Calendar, CheckCircle2, Clock } from 'lucide-react';
import Badge from '../common/Badge';

export default function ObservationCard({ observation, selected, onClick }) {
  if (!observation) return null;

  return (
    <div
      onClick={onClick}
      style={{
        background: selected ? 'rgba(0, 213, 255, 0.08)' : '#141F30',
        border: selected ? '1px solid #00D5FF' : '1px solid rgba(0, 213, 255, 0.15)',
        boxShadow: selected ? '0 0 16px rgba(0, 213, 255, 0.2)' : 'none',
        borderRadius: 8,
        padding: '14px 16px',
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'rgba(0, 213, 255, 0.35)';
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.borderColor = 'rgba(0, 213, 255, 0.15)';
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Satellite size={16} color={selected ? '#00D5FF' : '#8B9AAF'} />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#F2F6FC' }}>
            {observation.satellite}
          </span>
        </div>
        <Badge
          severity={observation.status === 'PROCESSED' || observation.status === 'VALIDATED' ? 'LOW' : 'HIGH'}
          label={observation.status}
        />
      </div>

      {/* ID */}
      <div style={{
        fontSize: 11,
        fontFamily: "'IBM Plex Mono', monospace",
        color: selected ? '#00D5FF' : '#8B9AAF',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }}>
        {observation.id}
      </div>

      {/* Details */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 4,
        fontSize: 11,
        color: '#CBD5E1',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: 8,
        marginTop: 2
      }}>
        <div>
          <span style={{ color: '#8B9AAF' }}>Date: </span>
          {observation.acquisitionDate}
        </div>
        <div>
          <span style={{ color: '#8B9AAF' }}>Pol: </span>
          {Array.isArray(observation.polarization) ? observation.polarization.join('/') : observation.polarization}
        </div>
        <div>
          <span style={{ color: '#8B9AAF' }}>Pass: </span>
          {observation.passDirection || 'Ascending'}
        </div>
        <div>
          <span style={{ color: '#8B9AAF' }}>Level: </span>
          {observation.processingLevel?.split('-')[0] || 'L2'}
        </div>
      </div>
    </div>
  );
}
