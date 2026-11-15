import React, { useState } from 'react';
import { ArrowUpDown, Building2 } from 'lucide-react';
import Badge from '../common/Badge';

const COLUMNS = [
  { key: 'district', label: 'District' },
  { key: 'floodedAreaKm2', label: 'Flooded Area (km²)' },
  { key: 'percentAffected', label: '% Territory' },
  { key: 'severity', label: 'Severity' },
  { key: 'population', label: 'Population' },
  { key: 'vulnerabilityTier', label: 'Vulnerability' },
];

export default function DistrictTable({ data = [], onExport }) {
  const [sortKey, setSortKey] = useState('floodedAreaKm2');
  const [sortDir, setSortDir] = useState('desc');

  // Normalize data keys if passed as name or floodedArea
  const normalizedData = data.map(d => ({
    district: d.district || d.name || 'Unnamed District',
    floodedAreaKm2: d.floodedAreaKm2 !== undefined ? d.floodedAreaKm2 : (d.floodedArea || 0),
    totalAreaKm2: d.totalAreaKm2 || d.totalArea || 2500,
    percentAffected: d.percentAffected !== undefined ? d.percentAffected : Number(((d.floodedArea || 0) / 2500 * 100).toFixed(1)),
    severity: d.severity || 'MODERATE',
    population: d.population || 500000,
    vulnerabilityTier: d.vulnerabilityTier || (d.severity === 'CRITICAL' ? 'Very High' : d.severity === 'HIGH' ? 'High' : 'Moderate'),
  }));

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sortedData = [...normalizedData].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  return (
    <div style={{
      overflowX: 'auto',
      borderRadius: 8,
      border: '1px solid rgba(0, 213, 255, 0.15)',
      background: '#141F30'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      }}>
        <thead>
          <tr style={{
            background: '#101827',
            borderBottom: '1px solid rgba(0, 213, 255, 0.2)',
            color: '#8B9AAF',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11
          }}>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                style={{
                  padding: '10px 14px',
                  cursor: 'pointer',
                  userSelect: 'none',
                  color: sortKey === col.key ? '#00D5FF' : '#8B9AAF',
                  whiteSpace: 'nowrap'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  {col.label}
                  <ArrowUpDown size={12} color={sortKey === col.key ? '#00D5FF' : '#475569'} />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.length > 0 ? (
            sortedData.map((row, i) => (
              <tr
                key={`${row.district}-${i}`}
                style={{
                  borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                  transition: 'background 0.1s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 213, 255, 0.05)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#F2F6FC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Building2 size={14} color="#00D5FF" />
                    {row.district}
                  </div>
                </td>
                <td style={{ padding: '10px 14px', color: '#FF5252', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {row.floodedAreaKm2.toLocaleString()} km²
                </td>
                <td style={{ padding: '10px 14px', color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {row.percentAffected}%
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <Badge severity={row.severity} />
                </td>
                <td style={{ padding: '10px 14px', color: '#CBD5E1', fontFamily: "'IBM Plex Mono', monospace" }}>
                  {row.population.toLocaleString()}
                </td>
                <td style={{ padding: '10px 14px', color: '#8B9AAF' }}>
                  {row.vulnerabilityTier}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#8B9AAF' }}>
                No district records available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
