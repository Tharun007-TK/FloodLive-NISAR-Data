import React, { useState, useEffect } from 'react';
import {
  Building2,
  Home,
  Wheat,
  Building,
  Download,
  Search,
  Filter,
  AlertTriangle,
  FileSpreadsheet,
  FileCode,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import StatCard from '../../components/common/StatCard';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import VillageTable from '../../components/analytics/VillageTable';
import DistrictTable from '../../components/analytics/DistrictTable';
import FilterBar from '../../components/analytics/FilterBar';
import {
  getFloodExtent,
  getDistrictBoundaries,
  getVillages,
  getCroplandExposure,
  computeImpactStatistics
} from '../../services/dataService';
import { exportToCSV, exportToJSON } from '../../services/reportService';

const TABS = [
  { id: 'districts', label: 'District Inundation', icon: Building2 },
  { id: 'villages', label: 'Settlement Exposure', icon: Home },
  { id: 'agriculture', label: 'Agricultural Overlap', icon: Wheat },
  { id: 'buildings', label: 'Building Footprints', icon: Building },
];

export default function ImpactAnalysis() {
  const [activeTab, setActiveTab] = useState('districts');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters for villages
  const [villageSearch, setVillageSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [districtFilter, setDistrictFilter] = useState('ALL');

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getFloodExtent(),
      getDistrictBoundaries(),
      getVillages(),
      getCroplandExposure()
    ]).then(([flood, districts, villages, cropland]) => {
      if (!isMounted) return;
      const computed = computeImpactStatistics({
        floodGeoJSON: flood?.geojson || null,
        districtsGeoJSON: districts?.geojson || null,
        villagesGeoJSON: villages?.geojson || null,
        croplandGeoJSON: cropland?.geojson || null
      });
      setStats(computed);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load impact analytics data', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const hasData = stats && stats.hasData;

  // Filtered villages
  const filteredVillages = (stats?.exposedVillages || []).filter(v => {
    if (severityFilter !== 'ALL' && (v.severity || '').toUpperCase() !== severityFilter) return false;
    if (districtFilter !== 'ALL' && v.district !== districtFilter) return false;
    if (villageSearch.trim().length > 0) {
      const q = villageSearch.toLowerCase().trim();
      return v.name.toLowerCase().includes(q) || v.district.toLowerCase().includes(q);
    }
    return true;
  });

  // Extract unique district names for dropdown
  const uniqueDistricts = Array.from(new Set((stats?.exposedVillages || []).map(v => v.district))).sort();

  return (
    <div style={{
      padding: '20px 24px 40px',
      background: '#080D18',
      minHeight: '100%',
      color: '#F2F6FC',
      fontFamily: 'Inter, sans-serif'
    }}>
      <DisclaimerBanner message="GEOSPATIAL IMPACT ANALYSIS — ASSESSING ADMINISTRATIVE, HUMAN SETTLEMENT & AGRICULTURAL EXPOSURE BASED ON LOADED NISAR OBSERVATIONS" />

      {/* Page Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: '16px 0 20px',
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
            GEOSPATIAL IMPACT & EXPOSURE ASSESSMENT
          </h1>
          <p style={{ fontSize: 13, color: '#8B9AAF', margin: '4px 0 0 0' }}>
            Multi-sector exposure metrics derived from classified radar inundation masks overlaid on territorial assets.
          </p>
        </div>

        {/* Global Export Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => exportToCSV(stats?.districtBreakdown || [], 'floodmap_district_impact.csv')}
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
            <FileSpreadsheet size={14} color="#00D5FF" />
            Export Districts (CSV)
          </button>

          <button
            onClick={() => exportToJSON(stats || {}, 'floodmap_full_impact_analysis.json')}
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
            <FileCode size={14} color="#35D39A" />
            Export Full Model (JSON)
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 14,
        marginBottom: 20
      }}>
        <StatCard
          icon={Building2}
          label="Inundated Districts"
          value={hasData ? stats.affectedDistrictsCount : 0}
          unit="districts"
          subtitle="Administrative territories"
          color="#FF5252"
        />
        <StatCard
          icon={Home}
          label="Exposed Settlements"
          value={hasData ? stats.exposedVillagesCount : 0}
          unit="villages"
          subtitle="Directly in flood zone"
          color="#FFB547"
        />
        <StatCard
          icon={Wheat}
          label="Inundated Cropland"
          value={hasData ? stats.totalAgriculturalFloodedKm2.toLocaleString() : 0}
          unit="km²"
          subtitle="High crop loss vulnerability"
          color="#35D39A"
        />
        <StatCard
          icon={Building}
          label="Building Exposure Data"
          value="Pending"
          unit="layer"
          subtitle="Footprint data unindexed"
          color="#8B9AAF"
        />
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        borderBottom: '1px solid rgba(0, 213, 255, 0.15)',
        marginBottom: 16
      }}>
        {TABS.map(tab => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 18px',
                background: active ? '#141F30' : 'transparent',
                border: 'none',
                borderBottom: active ? '2px solid #00D5FF' : '2px solid transparent',
                color: active ? '#00D5FF' : '#8B9AAF',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: District Inundation */}
      {activeTab === 'districts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#8B9AAF'
          }}>
            <span>Districts sorted by total inundated area descending. Click column headers to reorder.</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
              TOTAL INUNDATED: {stats?.totalFloodedAreaKm2 || 0} km²
            </span>
          </div>

          <DistrictTable data={stats?.districtBreakdown || []} />
        </div>
      )}

      {/* TAB 2: Settlement Exposure */}
      {activeTab === 'villages' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#141F30',
            padding: '12px 14px',
            borderRadius: 8,
            border: '1px solid rgba(0, 213, 255, 0.15)',
            flexWrap: 'wrap',
            gap: 12
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 240 }}>
              <Search size={15} color="#00D5FF" />
              <input
                type="text"
                placeholder="Search village or district name..."
                value={villageSearch}
                onChange={(e) => setVillageSearch(e.target.value)}
                style={{
                  background: '#0D1524',
                  border: '1px solid rgba(0, 213, 255, 0.2)',
                  borderRadius: 6,
                  padding: '6px 12px',
                  color: '#F2F6FC',
                  fontSize: 12,
                  outline: 'none',
                  width: '100%',
                  maxWidth: 320
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {/* Severity filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8B9AAF' }}>
                <Filter size={13} />
                <span>Severity:</span>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  style={{
                    background: '#0D1524',
                    border: '1px solid rgba(0, 213, 255, 0.2)',
                    color: '#F2F6FC',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Severities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              {/* District filter */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#8B9AAF' }}>
                <span>District:</span>
                <select
                  value={districtFilter}
                  onChange={(e) => setDistrictFilter(e.target.value)}
                  style={{
                    background: '#0D1524',
                    border: '1px solid rgba(0, 213, 255, 0.2)',
                    color: '#F2F6FC',
                    padding: '6px 10px',
                    borderRadius: 6,
                    fontSize: 12,
                    outline: 'none'
                  }}
                >
                  <option value="ALL">All Districts ({uniqueDistricts.length})</option>
                  {uniqueDistricts.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => exportToCSV(filteredVillages, 'floodmap_villages_exposure.csv')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#00D5FF',
                  border: 'none',
                  color: '#080D18',
                  padding: '6px 12px',
                  borderRadius: 6,
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                <Download size={13} /> Export CSV
              </button>
            </div>
          </div>

          <VillageTable data={filteredVillages} />
        </div>
      )}

      {/* TAB 3: Agricultural Overlap */}
      {activeTab === 'agriculture' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: '#141F30',
            border: '1px solid rgba(0, 213, 255, 0.15)',
            borderRadius: 8,
            padding: 16
          }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 8px 0', color: '#F2F6FC' }}>
              Cropland Inundation Overlap by Agricultural Zone
            </h3>
            <p style={{ fontSize: 12, color: '#8B9AAF', margin: '0 0 16px 0' }}>
              Calculated by intersecting classified SAR surface water polygons with ICAR / Copernicus agricultural land-use layers.
            </p>

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
                    <th style={{ padding: '10px 14px' }}>ZONE ID</th>
                    <th style={{ padding: '10px 14px' }}>DISTRICT</th>
                    <th style={{ padding: '10px 14px' }}>AGRICULTURAL BASIN</th>
                    <th style={{ padding: '10px 14px' }}>TOTAL CROPLAND (KM²)</th>
                    <th style={{ padding: '10px 14px' }}>INUNDATED CROPLAND (KM²)</th>
                    <th style={{ padding: '10px 14px' }}>PRIMARY CROPS</th>
                    <th style={{ padding: '10px 14px' }}>GROWTH STAGE</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.agriculturalBreakdown || []).map(a => (
                    <tr
                      key={a.id}
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.1s ease',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 213, 255, 0.05)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <td style={{ padding: '10px 14px', fontFamily: "'IBM Plex Mono', monospace", color: '#00D5FF' }}>
                        {a.id}
                      </td>
                      <td style={{ padding: '10px 14px', fontWeight: 600, color: '#F2F6FC' }}>
                        {a.district}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#CBD5E1' }}>
                        {a.zone}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
                        {a.totalCroplandKm2} km²
                      </td>
                      <td style={{ padding: '10px 14px', color: '#FF5252', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>
                        {a.affectedCroplandKm2} km²
                      </td>
                      <td style={{ padding: '10px 14px', color: '#35D39A' }}>
                        {a.primaryCrops.join(', ')}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#8B9AAF' }}>
                        {a.growthStage}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Building Footprints (Scientific Empty State) */}
      {activeTab === 'buildings' && (
        <div style={{
          background: '#141F30',
          border: '1px solid rgba(255, 181, 71, 0.3)',
          borderRadius: 8,
          padding: '32px 24px',
          textAlign: 'center',
          maxWidth: 720,
          margin: '20px auto'
        }}>
          <AlertTriangle size={36} color="#FFB547" style={{ marginBottom: 12 }} />
          <h2 style={{ fontSize: 18, fontWeight: 700, color: '#F2F6FC', margin: '0 0 8px 0' }}>
            Building Footprint Dataset Not Indexed
          </h2>
          <p style={{ fontSize: 13, color: '#8B9AAF', lineHeight: 1.6, margin: '0 0 20px 0' }}>
            Building exposure analysis requires high-resolution structural vector footprints (such as OpenStreetMap building polygons or Microsoft Global ML Building Footprints) intersecting with detected flood extents. In accordance with our scientific transparency principles, no artificial building count is generated.
          </p>

          <div style={{
            background: '#0D1524',
            border: '1px solid rgba(0, 213, 255, 0.15)',
            borderRadius: 6,
            padding: 16,
            textAlign: 'left',
            fontSize: 12,
            fontFamily: "'IBM Plex Mono', monospace",
            color: '#CBD5E1',
            lineHeight: 1.7
          }}>
            <div style={{ color: '#00D5FF', fontWeight: 700, marginBottom: 4 }}>
              To enable building structural exposure:
            </div>
            <div>1. Place GeoJSON building polygons into: <code>frontend/public/data/boundaries/buildings.geojson</code></div>
            <div>2. Ensure properties contain <code>type</code>, <code>levels</code>, and <code>district</code></div>
            <div>3. Execute dataset re-indexing: <code>npm run index-data</code></div>
            <div>4. Refresh application to view building exposure breakdown</div>
          </div>
        </div>
      )}
    </div>
  );
}
