import React from 'react';
import { Satellite, Calendar, ShieldCheck, Layers, Radio, Globe2, AlertCircle } from 'lucide-react';
import Badge from '../common/Badge';

export default function ObservationDetail({ observation }) {
  if (!observation) {
    return (
      <div style={{
        padding: 32,
        textAlign: 'center',
        background: '#141F30',
        borderRadius: 8,
        border: '1px solid rgba(0, 213, 255, 0.15)',
        color: '#8B9AAF'
      }}>
        Select a satellite observation from the catalog above to view detailed orbital and radar parameters.
      </div>
    );
  }

  const fields = [
    { label: 'Mission / Platform', value: observation.mission || 'NISAR' },
    { label: 'Operating Agency', value: observation.agency || 'NASA / ISRO' },
    { label: 'Observation ID', value: observation.id, mono: true, highlight: true },
    { label: 'Acquisition Timestamp', value: `${observation.acquisitionDate} ${observation.acquisitionTime || '05:34:00 UTC'}`, mono: true },
    { label: 'Orbit Pass Direction', value: observation.passDirection || 'Ascending' },
    { label: 'Polarization Channels', value: Array.isArray(observation.polarization) ? observation.polarization.join(', ') : observation.polarization, mono: true },
    { label: 'Incidence Angle', value: observation.incidenceAngle ? `${observation.incidenceAngle}°` : '37.4°', mono: true },
    { label: 'Spatial Resolution', value: observation.resolution || '12 meters', mono: true },
    { label: 'Swath Width', value: observation.swathWidth || '240 km' },
    { label: 'Radar Frequency Band', value: observation.frequency || 'L-band (1.25 GHz, 24 cm)' },
    { label: 'Processing Level', value: observation.processingLevel || 'Level-2 Classified Extent' },
    { label: 'Geographic Coverage', value: observation.coverage || 'Brahmaputra Floodplain (Assam)' },
    { label: 'Data Availability', value: observation.dataAvailability || 'Indexed Local GeoJSON', mono: true },
    { label: 'Cloud Penetration', value: observation.cloudCover || 'Full Penetration (Radar)' },
  ];

  return (
    <div style={{
      background: '#141F30',
      border: '1px solid rgba(0, 213, 255, 0.2)',
      borderRadius: 8,
      padding: '20px 22px',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: 12,
        flexWrap: 'wrap',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(0, 213, 255, 0.1)',
            border: '1px solid rgba(0, 213, 255, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Satellite size={18} color="#00D5FF" />
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
              {observation.satellite} — {observation.mission}
            </h3>
            <div style={{ fontSize: 11, color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
              {observation.id}
            </div>
          </div>
        </div>

        <Badge
          severity={observation.status === 'PROCESSED' || observation.status === 'VALIDATED' ? 'LOW' : 'HIGH'}
          label={observation.status}
        />
      </div>

      {/* Grid of parameters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 12
      }}>
        {fields.map((f, i) => (
          <div
            key={i}
            style={{
              background: 'rgba(8, 13, 24, 0.6)',
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.04)'
            }}
          >
            <div style={{ fontSize: 10, color: '#8B9AAF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {f.label}
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 600,
              color: f.highlight ? '#00D5FF' : '#F2F6FC',
              fontFamily: f.mono ? "'IBM Plex Mono', monospace" : 'inherit',
              marginTop: 3
            }}>
              {f.value}
            </div>
          </div>
        ))}
      </div>

      {/* Notes / Assessment */}
      {observation.notes && (
        <div style={{
          background: 'rgba(0, 213, 255, 0.04)',
          border: '1px solid rgba(0, 213, 255, 0.15)',
          borderRadius: 6,
          padding: '12px 14px',
          fontSize: 12,
          color: '#CBD5E1',
          lineHeight: 1.5
        }}>
          <strong style={{ color: '#00D5FF' }}>Observation Notes: </strong>
          {observation.notes}
        </div>
      )}
    </div>
  );
}
