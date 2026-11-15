import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Map as MapIcon,
  BarChart2,
  Satellite,
  BookOpen,
  Download,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  Calendar,
  Building2,
  Wheat,
  Users,
  Radio,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import {
  getJobFloodExtent,
  getJobFloodedVegetation,
  getJobImpact,
  getJobProvenance,
  getRainfallTimeseries
} from '../../services/dataService';
import FloodMap from '../../components/maps/FloodMap';
import ProvenancePopover from '../../components/dashboard/ProvenancePopover';
import StatCard from '../../components/common/StatCard';
import Badge from '../../components/common/Badge';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import RainfallChart from '../../components/charts/RainfallChart';

export default function Dashboard() {
  const { activeEvent, activeJobId, selectedFeature, setSelectedFeature, layers, toggleLayer, opacity, setLayerOpacity } = useLocationContext();

  const [floodGeoJSON, setFloodGeoJSON] = useState(null);
  const [floodedVegGeoJSON, setFloodedVegGeoJSON] = useState(null);
  const [impactData, setImpactData] = useState(null);
  const [provenance, setProvenance] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [flood, veg, impact, prov, rain] = await Promise.all([
        getJobFloodExtent(activeJobId),
        getJobFloodedVegetation(activeJobId),
        getJobImpact(activeJobId),
        getJobProvenance(activeJobId),
        getRainfallTimeseries()
      ]);

      setFloodGeoJSON(flood);
      setFloodedVegGeoJSON(veg);
      setImpactData(impact);
      setProvenance(prov);
      setRainfallData(rain);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message || 'Failed to load geospatial data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [activeJobId]);

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Disclaimer Banner */}
      <DisclaimerBanner
        message="NISAR L2 GCOV (PROVISIONAL) • Science data calibrated from ASF DAAC • All metrics derived from verified 2026 satellite overpass"
      />

      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Disaster Situation Dashboard
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            NISAR Flood Observatory Overview
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0 0' }}>
            {activeEvent.name} — Bitemporal L-band SAR backscatter change detection and multi-sector exposure analysis.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Link
            to="/map"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '8px 14px',
              backgroundColor: 'var(--accent-blue)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: 600,
              textDecoration: 'none'
            }}
          >
            <MapIcon size={14} />
            <span>Open Fullscreen Map</span>
          </Link>

          <button
            onClick={loadDashboardData}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: '7px 12px',
              backgroundColor: 'var(--surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--text-xs)',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={13} className={loading ? 'spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          backgroundColor: 'var(--status-critical-subtle)',
          border: '1px solid var(--status-critical-border)',
          borderRadius: 'var(--radius-sm)',
          padding: 'var(--space-4)',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 'var(--space-3)'
        }}>
          <AlertTriangle size={18} color="var(--status-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--status-critical)' }}>
              Data loading error
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* 5 Primary Executive KPI StatCards */}
      <section aria-label="Executive KPIs" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-4)' }}>
        <ProvenancePopover provenance={provenance} title="Episodic Flood Inundation">
          <StatCard
            icon={Layers}
            label="Total Flood Inundation"
            value={impactData ? impactData.totalFloodedAreaKm2.toLocaleString() : '—'}
            unit="km²"
            subtitle="EPSG:6933 Equal-Area"
            provenance={true}
          />
        </ProvenancePopover>

        <ProvenancePopover provenance={provenance} title="Flooded Vegetation Double-Bounce">
          <StatCard
            icon={Wheat}
            label="Flooded Vegetation"
            value={impactData ? impactData.floodedVegetationAreaKm2.toLocaleString() : '—'}
            unit="km²"
            subtitle="Dihedral Double-Bounce"
            provenance={true}
          />
        </ProvenancePopover>

        <StatCard
          icon={Users}
          label="Exposed Population"
          value={impactData ? impactData.totalModelledExposedPopulation.toLocaleString() : '—'}
          subtitle="Modelled Estimate (WorldPop)"
        />

        <StatCard
          icon={Building2}
          label="Affected Districts"
          value={impactData ? impactData.affectedDistrictsCount : '—'}
          unit="Districts"
          subtitle="3 Critical • 1 High • 1 Low"
        />

        <StatCard
          icon={Calendar}
          label="Inundated Cropland"
          value={impactData ? impactData.totalAgriculturalFloodedKm2.toLocaleString() : '—'}
          unit="km²"
          subtitle="ESA WorldCover Class 40"
        />
      </section>

      {/* Main Dashboard Grid: Map Viewport (Left) & Analytical Panels (Right) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(360px, 1fr)', gap: 'var(--space-6)', alignItems: 'start' }}>
        {/* Left Column: Interactive Map Widget */}
        <div style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Map Header */}
          <div style={{
            padding: 'var(--space-3) var(--space-4)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--surface-subtle)'
          }}>
            <div>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                NISAR Flood Extent & Settlement Exposure Map
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Track {activeEvent.track} / Frame {activeEvent.frame} • {activeEvent.aoiName}
              </div>
            </div>

            <Link
              to="/map"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: 'var(--text-xs)',
                color: 'var(--accent-blue)',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              <span>Expand Map</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {/* Leaflet Map Container */}
          <div style={{ height: '440px', width: '100%', position: 'relative' }}>
            <FloodMap
              floodGeoJSON={floodGeoJSON}
              floodedVegGeoJSON={floodedVegGeoJSON}
              settlements={impactData?.exposedSettlements || []}
              selectedFeature={selectedFeature}
              onSelectFeature={setSelectedFeature}
              layers={layers}
              opacity={opacity}
              center={activeEvent.center}
              zoom={activeEvent.zoom}
            />
          </div>

          {/* Map Layer Controls Bar */}
          <div style={{
            padding: 'var(--space-2) var(--space-4)',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 'var(--text-xs)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.floodExtent}
                  onChange={() => toggleLayer('floodExtent')}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Open Water Flood</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.floodedVeg}
                  onChange={() => toggleLayer('floodedVeg')}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Flooded Veg</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={layers.settlements}
                  onChange={() => toggleLayer('settlements')}
                />
                <span style={{ color: 'var(--text-secondary)' }}>Settlements</span>
              </label>
            </div>

            <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
              Base: <span style={{ textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-primary)' }}>{layers.baseMap || 'OSM'}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Analytical Overview Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Panel 1: District Territorial Impact */}
          <div style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                District Territorial Impact
              </div>
              <Link to="/impact" style={{ fontSize: 'var(--text-xs)', color: 'var(--accent-blue)', textDecoration: 'none', fontWeight: 500 }}>
                Full Breakdown &rarr;
              </Link>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {impactData?.districtBreakdown?.map((dist) => (
                <div
                  key={dist.district}
                  style={{
                    padding: 'var(--space-2) var(--space-3)',
                    backgroundColor: 'var(--surface-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>
                      {dist.district}
                    </span>
                    <Badge severity={dist.severity} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                    <span>Inundated: <strong className="font-mono">{dist.floodedAreaKm2} km²</strong></span>
                    <span className="font-mono" style={{ color: 'var(--accent-blue)', fontWeight: 600 }}>{dist.percentAffected}%</span>
                  </div>

                  {/* Visual Inundation Bar */}
                  <div style={{ width: '100%', height: '4px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${Math.min(dist.percentAffected * 2.5, 100)}%`,
                      backgroundColor: dist.severity === 'CRITICAL' ? 'var(--status-critical)' : 'var(--accent-blue)',
                      borderRadius: '2px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Panel 2: Precipitation Chronology (NASA GPM IMERG) */}
          <div style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Precipitation Chronology
              </div>
              <span className="font-mono" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>NASA GPM IMERG</span>
            </div>

            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 var(--space-2) 0' }}>
              Monsoon storm deluge preceding the July 26 NISAR overpass.
            </p>

            {rainfallData && rainfallData.data ? (
              <div style={{ height: '140px', width: '100%' }}>
                <RainfallChart
                  data={rainfallData.data.map(d => ({ date: d.date, rainfall: d.rainfall_mm }))}
                  observationDates={['2026-07-26']}
                />
              </div>
            ) : (
              <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
                Loading precipitation...
              </div>
            )}
          </div>

          {/* Panel 3: Radar Overpass Telemetry Card */}
          <div style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Satellite size={16} color="var(--accent-blue)" />
              <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-primary)' }}>
                NISAR L-band Radar Observation Pass
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: '11px', color: 'var(--text-secondary)' }}>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Baseline: </span>
                <span className="font-mono">{activeEvent.preDate}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Overpass: </span>
                <span className="font-mono">{activeEvent.postDate}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Track/Frame: </span>
                <span className="font-mono">T{activeEvent.track}/F{activeEvent.frame}</span>
              </div>
              <div>
                <span style={{ color: 'var(--text-muted)' }}>Calibration: </span>
                <span className="font-mono">{activeEvent.tier}</span>
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-1)' }}>
              <Link
                to="/observations"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '11px',
                  color: 'var(--accent-blue)',
                  textDecoration: 'none',
                  fontWeight: 600
                }}
              >
                <span>Inspect Granule Metadata & DAAC Query</span>
                <ChevronRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Quick Navigation Cards */}
      <section aria-label="Analyst Navigation" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
        <Link
          to="/map"
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapIcon size={16} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Full Map Workspace</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Layer sliders & feature inspector</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </Link>

        <Link
          to="/impact"
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-warning-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChart2 size={16} color="var(--status-warning)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Impact & Vulnerability</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Zonal tables & settlements</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </Link>

        <Link
          to="/method"
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-blue-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={16} color="var(--accent-blue)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Scientific Method</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Otsu math & L-band physics</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </Link>

        <Link
          to="/export"
          style={{
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transition: 'border-color var(--transition-fast)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--status-success-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Download size={16} color="var(--status-success)" />
            </div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 'var(--text-xs)', color: 'var(--text-primary)' }}>Data Export</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>GeoJSON & provenance downloads</div>
            </div>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </Link>
      </section>
    </div>
  );
}
