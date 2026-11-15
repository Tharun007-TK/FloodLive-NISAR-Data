import React, { useState } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Home, Users } from 'lucide-react';
import Badge from '../common/Badge';

export default function VillageTable({ data = [], onExport }) {
  const [sortKey, setSortKey] = useState('population');
  const [sortDir, setSortDir] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  function handleSort(key) {
    if (sortKey === key) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  const sortedData = [...data].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Table Container */}
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
              <th onClick={() => handleSort('name')} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  SETTLEMENT NAME <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('district')} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  DISTRICT <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('population')} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  POPULATION <ArrowUpDown size={12} />
                </div>
              </th>
              <th onClick={() => handleSort('elevationM')} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  ELEVATION (M) <ArrowUpDown size={12} />
                </div>
              </th>
              <th style={{ padding: '10px 14px' }}>PRIMARY LIVELIHOOD</th>
              <th onClick={() => handleSort('severity')} style={{ padding: '10px 14px', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  EXPOSURE TIER <ArrowUpDown size={12} />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((v, i) => (
                <tr
                  key={v.id || `${v.name}-${i}`}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 213, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#F2F6FC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Home size={14} color="#00D5FF" />
                      {v.name}
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', color: '#CBD5E1' }}>
                    {v.district}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {v.population ? v.population.toLocaleString() : 'N/A'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {v.elevationM ? `${v.elevationM} m` : '—'}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#8B9AAF' }}>
                    {v.primaryLivelihood || 'Agriculture'}
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <Badge severity={v.severity || 'MODERATE'} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} style={{ padding: 24, textAlign: 'center', color: '#8B9AAF' }}>
                  No settlement records match the current filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: 12,
        color: '#8B9AAF',
        padding: '0 4px'
      }}>
        <div>
          Showing {data.length === 0 ? 0 : (currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length} settlements
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            style={{
              background: '#141F30',
              border: '1px solid rgba(0, 213, 255, 0.2)',
              color: currentPage === 1 ? '#475569' : '#F2F6FC',
              padding: '4px 8px',
              borderRadius: 4,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            style={{
              background: '#141F30',
              border: '1px solid rgba(0, 213, 255, 0.2)',
              color: currentPage === totalPages ? '#475569' : '#F2F6FC',
              padding: '4px 8px',
              borderRadius: 4,
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
