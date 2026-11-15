import React, { useState, useEffect } from 'react';
import {
  Database,
  FileCode,
  FolderTree,
  RefreshCw,
  HardDrive,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Layers,
  Terminal,
  Cpu
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import Badge from '../../components/common/Badge';
import { getManifest } from '../../services/dataService';
import { IS_BACKEND_CONFIGURED, API_BASE_URL } from '../../services/apiClient';

export default function DataSources() {
  const [manifest, setManifest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  async function loadManifest(force = false) {
    if (force) setRefreshing(true);
    try {
      const data = await getManifest(force);
      setManifest(data);
    } catch (err) {
      console.error('Failed to load manifest', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadManifest();
  }, []);

  const datasets = manifest?.datasets || [];
  const filteredDatasets = selectedCategory === 'ALL'
    ? datasets
    : datasets.filter(d => d.category === selectedCategory);

  const categories = [
    { id: 'ALL', label: 'All Datasets', count: datasets.length },
    { id: 'nisar', label: 'NISAR / Radar Extent', count: datasets.filter(d => d.category === 'nisar').length },
    { id: 'boundaries', label: 'Boundaries & AOI', count: datasets.filter(d => d.category === 'boundaries').length },
    { id: 'permanentWater', label: 'Permanent Water Mask', count: datasets.filter(d => d.category === 'permanentWater').length },
    { id: 'agriculture', label: 'Cropland & Land Use', count: datasets.filter(d => d.category === 'agriculture').length },
    { id: 'referenceData', label: 'Reference & Rainfall', count: datasets.filter(d => d.category === 'referenceData').length },
  ];

  return (
    <div style={{
      padding: '20px 24px 40px',
      background: '#080D18',
      minHeight: '100%',
      color: '#F2F6FC',
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }}>
      <DisclaimerBanner message="DATA INVENTORY & CATALOG — MANIFEST-DRIVEN AUTOMATIC DISCOVERY SYSTEM • NO HARDCODED PATHS" />

      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div>
          <h1 style={{
            fontSize: 22,
            fontWeight: 700,
            fontFamily: 'Space Grotesk, sans-serif',
            margin: 0,
            letterSpacing: '-0.02em',
          }}>
            DATASET REGISTRY & AUTO-DISCOVERY MANIFEST
          </h1>
          <p style={{ fontSize: 13, color: '#8B9AAF', margin: '4px 0 0 0' }}>
            Local filesystem indexing scanner (<code>scripts/data-indexer.js</code>) dynamically catalogues geospatial and observational datasets.
          </p>
        </div>

        <button
          onClick={() => loadManifest(true)}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: '#141F30',
            border: '1px solid rgba(0, 213, 255, 0.25)',
            color: '#F2F6FC',
            padding: '8px 14px',
            borderRadius: 6,
            cursor: 'pointer',
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} color="#00D5FF" />
          {refreshing ? 'Scanning...' : 'Reload Manifest'}
        </button>
      </div>

      {/* Discovery Architecture Overview Card */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.2)',
        borderRadius: 8,
        padding: '18px 22px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <FolderTree size={18} color="#00D5FF" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
              Automatic Data Discovery Workflow
            </h3>
          </div>
          <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
            FloodMap Live does not require editing React components when new satellite passes arrive. Drop GeoJSON, CSV, or metadata JSON into the corresponding data folder, run the indexer, and the application dynamically reads the new coverage and recalculates all statistics.
          </p>
        </div>

        <div style={{
          background: 'rgba(8, 13, 24, 0.6)',
          padding: 12,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace"
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#00D5FF' }}>
            <Terminal size={14} />
            <span>COMMAND: npm run index-data</span>
          </div>
          <div style={{ color: '#8B9AAF', fontSize: 11 }}>
            MANIFEST: <code>frontend/public/data/manifest.json</code>
          </div>
          <div style={{ color: '#35D39A', fontSize: 11 }}>
            BACKEND HOOK: {IS_BACKEND_CONFIGURED ? `Configured (${API_BASE_URL})` : 'Zero-backend client mode (Local fallback active)'}
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {categories.map(c => {
          const active = selectedCategory === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 14px',
                borderRadius: 6,
                background: active ? '#00D5FF' : '#141F30',
                color: active ? '#080D18' : '#F2F6FC',
                border: active ? '1px solid #00D5FF' : '1px solid rgba(0, 213, 255, 0.15)',
                fontWeight: active ? 700 : 500,
                fontSize: 12,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{c.label}</span>
              <span style={{
                background: active ? 'rgba(8, 13, 24, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: 11,
                fontFamily: "'IBM Plex Mono', monospace"
              }}>
                {c.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Datasets Table */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.15)',
        borderRadius: 8,
        overflow: 'hidden'
      }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: 12
          }}>
            <thead>
              <tr style={{
                background: '#101827',
                borderBottom: '1px solid rgba(0, 213, 255, 0.2)',
                color: '#8B9AAF',
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11
              }}>
                <th style={{ padding: '12px 14px' }}>DATASET FILENAME</th>
                <th style={{ padding: '12px 14px' }}>CATEGORY</th>
                <th style={{ padding: '12px 14px' }}>FORMAT</th>
                <th style={{ padding: '12px 14px' }}>SIZE</th>
                <th style={{ padding: '12px 14px' }}>FEATURES / ROWS</th>
                <th style={{ padding: '12px 14px' }}>OBSERVATION DATE</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDatasets.map(d => (
                <tr
                  key={d.id}
                  style={{
                    borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                    transition: 'background 0.1s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 213, 255, 0.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#F2F6FC' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <FileCode size={14} color="#00D5FF" />
                      <div>
                        <div>{d.filename}</div>
                        <div style={{ fontSize: 10, color: '#65758B', fontFamily: "'IBM Plex Mono', monospace" }}>
                          {d.path}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#CBD5E1' }}>
                    {d.category}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{
                      background: 'rgba(0, 213, 255, 0.1)',
                      color: '#00D5FF',
                      border: '1px solid rgba(0, 213, 255, 0.25)',
                      padding: '2px 6px',
                      borderRadius: 4,
                      fontSize: 10,
                      fontFamily: "'IBM Plex Mono', monospace"
                    }}>
                      {d.format}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {(d.fileSizeBytes / 1024).toFixed(1)} KB
                  </td>
                  <td style={{ padding: '12px 14px', color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {d.featureCount ? `${d.featureCount} features` : d.rowCount ? `${d.rowCount} rows` : d.itemCount ? `${d.itemCount} items` : '1'}
                  </td>
                  <td style={{ padding: '12px 14px', color: '#CBD5E1', fontFamily: "'IBM Plex Mono', monospace" }}>
                    {d.observationDate || 'N/A'}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <Badge severity="LOW" label={d.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Integration Guide Section */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.15)',
        borderRadius: 8,
        padding: '20px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Cpu size={18} color="#00D5FF" />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
            Future Backend Integration Architecture
          </h3>
        </div>
        <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
          The backend directory (<code>backend/</code>) is intentionally architected as an empty foundation. When deploying a real Python/FastAPI geospatial processing microservice, configure the environment variable:
        </p>

        <div style={{
          background: '#080D18',
          padding: 12,
          borderRadius: 6,
          border: '1px solid rgba(0, 213, 255, 0.2)',
          fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace",
          color: '#00D5FF'
        }}>
          VITE_API_BASE_URL=https://api.floodmap-live.org
        </div>

        <p style={{ fontSize: 12, color: '#8B9AAF', lineHeight: 1.5, margin: 0 }}>
          The client data layer (<code>src/services/apiClient.js</code>) will transparently proxy requests to the remote API when configured, or fall back to local indexed GeoJSON files when unconfigured. See <code>docs/API_INTEGRATION.md</code> for full contract schemas.
        </p>
      </div>
    </div>
  );
}
