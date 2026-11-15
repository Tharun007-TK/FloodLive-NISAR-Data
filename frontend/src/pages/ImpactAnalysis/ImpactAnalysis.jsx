import React, { useState, useEffect } from 'react';
import {
  Building2,
  Home,
  Wheat,
  Download,
  AlertTriangle,
  RefreshCw,
  FileSpreadsheet,
  FileCode,
  Info
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useLocationContext } from '../../context/LocationContext';
import { getJobImpact, getJobFloodExtent } from '../../services/dataService';

export default function ImpactAnalysis() {
  const { activeEvent, activeJobId } = useLocationContext();
  const [impactData, setImpactData] = useState(null);
  const [floodGeoJSON, setFloodGeoJSON] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('districts');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [impact, flood] = await Promise.all([
        getJobImpact(activeJobId),
        getJobFloodExtent(activeJobId)
      ]);
      setImpactData(impact);
      setFloodGeoJSON(flood);
    } catch (err) {
      setError(err.message || 'Failed to fetch impact analytics from backend.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeJobId]);

  // Export handlers
  const exportCSV = () => {
    if (!impactData) return;
    const rows = [
      ['District', 'Flooded Area (km²)', 'Total Area (km²)', 'Percent Affected (%)', 'Severity', 'Modelled Population', 'Vulnerability Tier'],
      ...impactData.districtBreakdown.map(d => [
        d.district,
        d.floodedAreaKm2,
        d.totalAreaKm2,
        d.percentAffected,
        d.severity,
        d.population,
        d.vulnerabilityTier
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NISAR_Assam_Flood_Impact_${activeJobId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportGeoJSON = () => {
    if (!floodGeoJSON) return;
    const blob = new Blob([JSON.stringify(floodGeoJSON, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NISAR_Assam_Flood_Extent_${activeJobId}.geojson`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div style={{ padding: 'var(--space-6)', maxWidth: '800px', margin: '40px auto' }}>
        <div style={{ padding: 'var(--space-4)', backgroundColor: 'var(--status-critical-bg)', border: '1px solid var(--status-critical)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
          <AlertTriangle color="var(--status-critical)" size={20} />
          <div>
            <div style={{ fontWeight: 600, color: 'var(--status-critical)' }}>Failed to load impact analytics</div>
            <div style={{ fontSize: 'var(--text-xs)', marginTop: '4px', color: 'var(--text-primary)' }}>{error}</div>
            <button
              onClick={loadData}
              style={{ marginTop: 'var(--space-3)', display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', cursor: 'pointer' }}
            >
              <RefreshCw size={12} /> Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const chartData = impactData?.districtBreakdown.map(d => ({
    name: d.district.replace(' (Guwahati)', '').replace(' (Tezpur)', ''),
    floodedKm2: d.floodedAreaKm2,
    percent: d.percentAffected
  })) || [];

  return (
    <div style={{ padding: 'var(--space-4)', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, color: 'var(--text-primary)' }}>
            Multi-Sector Impact Analytics
          </h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
            Zonal statistics derived from NISAR L2 GCOV Track 91, Frame 75 over Central Assam.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <button
            onClick={exportCSV}
            disabled={!impactData}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '5px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xs)', color: 'var(--text-primary)', cursor: 'pointer' }}
          >
            <FileSpreadsheet size={13} /> Export CSV
          </button>
          <button
            onClick={exportGeoJSON}
            disabled={!floodGeoJSON}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: '5px 10px', fontSize: 'var(--text-xs)', fontWeight: 600, backgroundColor: 'var(--accent-blue-subtle)', border: '1px solid var(--accent-blue-border)', borderRadius: 'var(--radius-xs)', color: 'var(--accent-blue)', cursor: 'pointer' }}
          >
            <FileCode size={13} /> Export GeoJSON
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Inundated Area</div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--accent-blue)', marginTop: '2px' }}>
            {impactData ? `${impactData.totalFloodedAreaKm2.toLocaleString()} km²` : '...'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>Measured in EPSG:6933 Equal-Area</div>
        </div>

        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Flooded Vegetation</div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--status-success)', marginTop: '2px' }}>
            {impactData ? `${impactData.floodedVegetationAreaKm2.toLocaleString()} km²` : '...'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>L-band Double-Bounce Reflection</div>
        </div>

        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exposed Population</div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--status-warning)', marginTop: '2px' }}>
            {impactData ? impactData.totalModelledExposedPopulation.toLocaleString() : '...'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--status-warning)', marginTop: '2px', fontWeight: 500 }}>Modelled estimate</div>
        </div>

        <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inundated Cropland</div>
          <div className="tabular-nums font-mono" style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2px' }}>
            {impactData ? `${impactData.totalAgriculturalFloodedKm2.toLocaleString()} km²` : '...'}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>ESA WorldCover Class 40</div>
        </div>
      </div>

      {/* Chart: District Flooded Area */}
      <div style={{ padding: 'var(--space-3)', backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
        <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 'var(--space-2)' }}>
          Flooded Area by District (km²)
        </div>
        <div style={{ width: '100%', height: 180 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
              <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} unit=" km²" />
              <Tooltip
                contentStyle={{ backgroundColor: 'var(--surface-panel)', borderColor: 'var(--border-medium)', fontSize: '12px', borderRadius: '4px' }}
                formatter={(value) => [`${value} km²`, 'Flooded Area']}
              />
              <Bar dataKey="floodedKm2" fill="var(--accent-blue)" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs & Table */}
      <div style={{ backgroundColor: 'var(--surface-panel)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-subtle)' }}>
          <button
            onClick={() => setActiveTab('districts')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, border: 'none', borderBottom: activeTab === 'districts' ? '2px solid var(--accent-blue)' : '2px solid transparent', backgroundColor: 'transparent', color: activeTab === 'districts' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            District Inundation Breakdown
          </button>
          <button
            onClick={() => setActiveTab('settlements')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, border: 'none', borderBottom: activeTab === 'settlements' ? '2px solid var(--accent-blue)' : '2px solid transparent', backgroundColor: 'transparent', color: activeTab === 'settlements' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            Exposed Settlement Points
          </button>
          <button
            onClick={() => setActiveTab('agriculture')}
            style={{ padding: 'var(--space-2) var(--space-4)', fontSize: 'var(--text-xs)', fontWeight: 600, border: 'none', borderBottom: activeTab === 'agriculture' ? '2px solid var(--accent-blue)' : '2px solid transparent', backgroundColor: 'transparent', color: activeTab === 'agriculture' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer' }}
          >
            Agricultural Cropland Exposure
          </button>
        </div>

        {/* Tab 1: Districts Table */}
        {activeTab === 'districts' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>District</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Flooded Area (km²)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>District Total (km²)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Percent Inundated</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Modelled Exposed Pop.</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Vulnerability Tier</th>
                </tr>
              </thead>
              <tbody>
                {impactData?.districtBreakdown.map((row) => (
                  <tr key={row.district} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600, color: 'var(--text-primary)' }}>{row.district}</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--accent-blue)', fontWeight: 600 }}>{row.floodedAreaKm2.toFixed(2)} km²</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-secondary)' }}>{row.totalAreaKm2.toFixed(1)} km²</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-primary)' }}>{row.percentAffected.toFixed(2)}%</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)' }}>
                      {row.population.toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(modelled estimate)</span>
                    </td>
                    <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                      <span className={row.vulnerabilityTier === 'CRITICAL' ? 'badge-status-critical' : row.vulnerabilityTier === 'HIGH' ? 'badge-status-high' : 'badge-status-moderate'}>
                        {row.vulnerabilityTier}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Settlements Table */}
        {activeTab === 'settlements' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Settlement Name</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>District</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Coordinates (WGS84)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Modelled Population</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Exposure Severity</th>
                </tr>
              </thead>
              <tbody>
                {impactData?.exposedSettlements.map((s) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600 }}>{s.name}</td>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-secondary)' }}>{s.district}</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-muted)' }}>{s.lat.toFixed(4)}° N, {s.lng.toFixed(4)}° E</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)' }}>
                      {s.estimatedPopulation.toLocaleString()} <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>(modelled estimate)</span>
                    </td>
                    <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                      <span className={s.severity === 'CRITICAL' ? 'badge-status-critical' : 'badge-status-high'}>
                        {s.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 3: Agriculture Table */}
        {activeTab === 'agriculture' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 'var(--text-xs)' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>District / Agro Zone</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Total Cropland (km²)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Affected Cropland (km²)</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Primary Monsoon Crops</th>
                  <th style={{ padding: 'var(--space-2) var(--space-3)' }}>Growth Phase</th>
                </tr>
              </thead>
              <tbody>
                {impactData?.agriculturalBreakdown.map((a) => (
                  <tr key={a.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', fontWeight: 600 }}>{a.district}</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)' }}>{a.totalCroplandKm2.toFixed(1)} km²</td>
                    <td className="tabular-nums font-mono" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--status-critical)', fontWeight: 600 }}>{a.affectedCroplandKm2.toFixed(2)} km²</td>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-secondary)' }}>{a.primaryCrops.join(', ')}</td>
                    <td style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--text-muted)' }}>{a.growthStage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
