import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  FileCode,
  CheckCircle2,
  Calendar,
  Building2,
  Home,
  Wheat,
  AlertTriangle,
  Layers
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import Badge from '../../components/common/Badge';
import {
  getFloodExtent,
  getDistrictBoundaries,
  getVillages,
  getCroplandExposure,
  getObservationsCatalog,
  computeImpactStatistics
} from '../../services/dataService';
import { exportToCSV, exportToJSON } from '../../services/reportService';

export default function Reports() {
  const [stats, setStats] = useState(null);
  const [observations, setObservations] = useState([]);
  const [selectedObsId, setSelectedObsId] = useState('NISAR_L2_20240708T053412');
  const [loading, setLoading] = useState(true);

  // Report section checkboxes
  const [sections, setSections] = useState({
    executiveSummary: true,
    districtImpact: true,
    villageExposure: true,
    agriculturalImpact: true,
  });

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getFloodExtent(),
      getDistrictBoundaries(),
      getVillages(),
      getCroplandExposure(),
      getObservationsCatalog()
    ]).then(([flood, districts, villages, cropland, obs]) => {
      if (!isMounted) return;
      setObservations(obs);
      const computed = computeImpactStatistics({
        floodGeoJSON: flood?.geojson || null,
        districtsGeoJSON: districts?.geojson || null,
        villagesGeoJSON: villages?.geojson || null,
        croplandGeoJSON: cropland?.geojson || null
      });
      setStats(computed);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load report data', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  function handlePrint() {
    window.print();
  }

  function handleExportFullJSON() {
    const reportPayload = {
      title: 'FLOODMAP LIVE — SATELLITE IMPACT ANALYSIS REPORT',
      generatedAt: new Date().toISOString(),
      studyArea: 'Brahmaputra Floodplain, Assam, India',
      observationId: selectedObsId,
      disclaimer: 'DEMONSTRATION & SATELLITE DERIVED METRICS — NOT A FORECAST',
      summary: {
        totalFloodedAreaKm2: stats?.totalFloodedAreaKm2,
        affectedDistricts: stats?.affectedDistrictsCount,
        exposedVillages: stats?.exposedVillagesCount,
        exposedPopulation: stats?.totalExposedPopulation,
        agriculturalFloodedKm2: stats?.totalAgriculturalFloodedKm2
      },
      districts: sections.districtImpact ? stats?.districtBreakdown : undefined,
      villages: sections.villageExposure ? stats?.exposedVillages : undefined,
      agriculture: sections.agriculturalImpact ? stats?.agriculturalBreakdown : undefined,
    };
    exportToJSON(reportPayload, `floodmap_report_${selectedObsId}.json`);
  }

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
      <DisclaimerBanner message="OFFICIAL SATELLITE DAMAGE & IMPACT ASSESSMENT REPORT GENERATOR • CLIENT-SIDE PDF/PRINT & EXPORTS" />

      {/* Header bar */}
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
            REPORTS & DATA EXPORT CENTER
          </h1>
          <p style={{ fontSize: 13, color: '#8B9AAF', margin: '4px 0 0 0' }}>
            Generate executive summaries, situational awareness briefings, and tabular datasets for emergency stakeholders.
          </p>
        </div>

        {/* Global Export Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={handlePrint}
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
            <Printer size={14} color="#00D5FF" />
            Print / Save as PDF
          </button>

          <button
            onClick={handleExportFullJSON}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: '#00D5FF',
              border: 'none',
              color: '#080D18',
              padding: '8px 16px',
              borderRadius: 6,
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            <Download size={14} />
            Export Full Dossier (JSON)
          </button>
        </div>
      </div>

      {/* Layout: Left Configuration / Right Report Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 320px) 1fr',
        gap: 20,
        alignItems: 'start'
      }}>
        {/* Left Config Panel */}
        <div style={{
          background: '#141F30',
          border: '1px solid rgba(0, 213, 255, 0.15)',
          borderRadius: 8,
          padding: '16px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
            REPORT CONFIGURATION
          </h3>

          {/* Study Area Selector */}
          <div>
            <label style={{ fontSize: 11, color: '#8B9AAF', display: 'block', marginBottom: 4 }}>
              STUDY AREA / AOI
            </label>
            <select
              disabled
              style={{
                width: '100%',
                background: '#080D18',
                border: '1px solid rgba(0, 213, 255, 0.2)',
                color: '#F2F6FC',
                padding: '8px 10px',
                borderRadius: 6,
                fontSize: 12
              }}
            >
              <option>Brahmaputra Floodplain (Assam, India)</option>
            </select>
          </div>

          {/* Observation Selector */}
          <div>
            <label style={{ fontSize: 11, color: '#8B9AAF', display: 'block', marginBottom: 4 }}>
              RADAR OBSERVATION PASS
            </label>
            <select
              value={selectedObsId}
              onChange={(e) => setSelectedObsId(e.target.value)}
              style={{
                width: '100%',
                background: '#080D18',
                border: '1px solid rgba(0, 213, 255, 0.2)',
                color: '#F2F6FC',
                padding: '8px 10px',
                borderRadius: 6,
                fontSize: 12
              }}
            >
              {observations.map(obs => (
                <option key={obs.id} value={obs.id}>
                  {obs.satellite} — {obs.acquisitionDate} ({obs.id})
                </option>
              ))}
            </select>
          </div>

          {/* Report Sections Toggle */}
          <div>
            <label style={{ fontSize: 11, color: '#8B9AAF', display: 'block', marginBottom: 8 }}>
              INCLUDE REPORT SECTIONS
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sections.executiveSummary}
                  onChange={(e) => setSections(s => ({ ...s, executiveSummary: e.target.checked }))}
                />
                Executive Briefing & Metrics
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sections.districtImpact}
                  onChange={(e) => setSections(s => ({ ...s, districtImpact: e.target.checked }))}
                />
                District Inundation Breakdown
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sections.villageExposure}
                  onChange={(e) => setSections(s => ({ ...s, villageExposure: e.target.checked }))}
                />
                Exposed Settlement Table
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={sections.agriculturalImpact}
                  onChange={(e) => setSections(s => ({ ...s, agriculturalImpact: e.target.checked }))}
                />
                Agricultural Overlap Analysis
              </label>
            </div>
          </div>

          {/* Quick Tabular Exports */}
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: 14 }}>
            <div style={{ fontSize: 11, color: '#8B9AAF', marginBottom: 8 }}>
              DIRECT CSV DOWNLOADS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => exportToCSV(stats?.districtBreakdown || [], 'districts_assessment.csv')}
                style={{
                  background: '#0D1524',
                  border: '1px solid rgba(0, 213, 255, 0.2)',
                  color: '#CBD5E1',
                  padding: '6px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FileSpreadsheet size={13} color="#00D5FF" />
                Download Districts CSV
              </button>
              <button
                onClick={() => exportToCSV(stats?.exposedVillages || [], 'villages_assessment.csv')}
                style={{
                  background: '#0D1524',
                  border: '1px solid rgba(0, 213, 255, 0.2)',
                  color: '#CBD5E1',
                  padding: '6px 10px',
                  borderRadius: 4,
                  fontSize: 11,
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
              >
                <FileSpreadsheet size={13} color="#35D39A" />
                Download Settlements CSV
              </button>
            </div>
          </div>
        </div>

        {/* Right Report Document Preview */}
        <div style={{
          background: '#101827',
          border: '1px solid rgba(0, 213, 255, 0.25)',
          borderRadius: 8,
          padding: '32px 36px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}>
          {/* Official Document Header */}
          <div style={{
            borderBottom: '2px solid #00D5FF',
            paddingBottom: 16,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16
          }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.15em', color: '#00D5FF', fontWeight: 700, textTransform: 'uppercase' }}>
                NASA SPACE APPS CHALLENGE 2026 • DANCING WITH THE SARS
              </div>
              <h2 style={{
                fontSize: 20,
                fontWeight: 700,
                fontFamily: 'Space Grotesk, sans-serif',
                color: '#F2F6FC',
                margin: '6px 0 0 0'
              }}>
                FLOODMAP LIVE — SATELLITE IMPACT ANALYSIS DOSSIER
              </h2>
              <div style={{ fontSize: 12, color: '#8B9AAF', marginTop: 4 }}>
                Target Region: <strong>Brahmaputra Floodplain Basin, Assam</strong> • Satellite: <strong>NISAR (L-band SAR)</strong>
              </div>
            </div>

            <div style={{
              textAlign: 'right',
              fontSize: 11,
              fontFamily: "'IBM Plex Mono', monospace",
              color: '#8B9AAF'
            }}>
              <div>DATE: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</div>
              <div>PASS: {selectedObsId}</div>
              <div style={{ color: '#35D39A', marginTop: 2 }}>STATUS: VALIDATED</div>
            </div>
          </div>

          {/* Section 1: Executive Summary */}
          {sections.executiveSummary && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#00D5FF', margin: '0 0 10px 0', letterSpacing: '0.04em' }}>
                1. EXECUTIVE SUMMARY & KEY FINDINGS
              </h3>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                Bitemporal synthetic aperture radar change detection between the June 10 baseline and the July 8 peak monsoon acquisition reveals widespread inundation across the central and western reaches of the Brahmaputra floodplain. Specular surface water reflections indicate severe riverbank overtopping, with maximum exposure concentrated along Morigaon, Barpeta, and Nagaon.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                gap: 10,
                background: '#141F30',
                padding: 14,
                borderRadius: 6,
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div>
                  <div style={{ fontSize: 10, color: '#8B9AAF' }}>TOTAL FLOOD EXTENT</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FF5252', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
                    {stats?.totalFloodedAreaKm2 || 0} km²
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#8B9AAF' }}>AFFECTED DISTRICTS</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#FFB547', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
                    {stats?.affectedDistrictsCount || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#8B9AAF' }}>SETTLEMENTS EXPOSED</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
                    {stats?.exposedVillagesCount || 0}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#8B9AAF' }}>EXPOSED POPULATION</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
                    {((stats?.totalExposedPopulation || 0) / 1000).toFixed(0)}k
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 10, color: '#8B9AAF' }}>CROPLAND INUNDATED</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#35D39A', fontFamily: "'IBM Plex Mono', monospace", marginTop: 2 }}>
                    {stats?.totalAgriculturalFloodedKm2 || 0} km²
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: District Impact Table */}
          {sections.districtImpact && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#00D5FF', margin: '0 0 10px 0', letterSpacing: '0.04em' }}>
                2. DISTRICT TERRITORIAL IMPACT BREAKDOWN
              </h3>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                textAlign: 'left',
                fontSize: 11
              }}>
                <thead>
                  <tr style={{ background: '#141F30', borderBottom: '1px solid rgba(0, 213, 255, 0.2)', color: '#8B9AAF' }}>
                    <th style={{ padding: '8px 10px' }}>DISTRICT</th>
                    <th style={{ padding: '8px 10px' }}>INUNDATED (KM²)</th>
                    <th style={{ padding: '8px 10px' }}>TOTAL (KM²)</th>
                    <th style={{ padding: '8px 10px' }}>% TERRITORY</th>
                    <th style={{ padding: '8px 10px' }}>POPULATION</th>
                    <th style={{ padding: '8px 10px' }}>TIER</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats?.districtBreakdown || []).map((d, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '8px 10px', fontWeight: 600, color: '#F2F6FC' }}>{d.district}</td>
                      <td style={{ padding: '8px 10px', color: '#FF5252', fontFamily: "'IBM Plex Mono', monospace" }}>{d.floodedAreaKm2}</td>
                      <td style={{ padding: '8px 10px', color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>{d.totalAreaKm2}</td>
                      <td style={{ padding: '8px 10px', color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace" }}>{d.percentAffected}%</td>
                      <td style={{ padding: '8px 10px', color: '#CBD5E1', fontFamily: "'IBM Plex Mono', monospace" }}>{d.population?.toLocaleString()}</td>
                      <td style={{ padding: '8px 10px' }}>
                        <Badge severity={d.severity} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Section 3: Agricultural Exposure */}
          {sections.agriculturalImpact && (
            <div>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#00D5FF', margin: '0 0 10px 0', letterSpacing: '0.04em' }}>
                3. AGRICULTURAL OVERLAP & CROP LOSS RISK
              </h3>
              <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.5, margin: '0 0 10px 0' }}>
                Significant portions of standing summer paddy (Ahu) and transplanting winter rice (Sali) are submerged under 1.0 to 3.0 meters of floodwater. Jute and vegetable belts in Barpeta and Morigaon face widespread siltation damage.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                {(stats?.agriculturalBreakdown || []).slice(0, 4).map((a, i) => (
                  <div key={i} style={{ background: '#141F30', padding: 10, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontWeight: 600, color: '#F2F6FC', fontSize: 12 }}>{a.district}</div>
                    <div style={{ color: '#35D39A', fontSize: 11, margin: '2px 0' }}>{a.primaryCrops.join(', ')}</div>
                    <div style={{ color: '#FF5252', fontFamily: "'IBM Plex Mono', monospace", fontSize: 11 }}>
                      {a.affectedCroplandKm2} km² inundated
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Report Footer / Scientific Disclaimer */}
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: 14,
            fontSize: 10,
            color: '#8B9AAF',
            lineHeight: 1.5
          }}>
            <strong>SCIENTIFIC VALIDATION STATEMENT:</strong> Flood extent figures are derived from Synthetic Aperture Radar (SAR) bitemporal backscatter thresholding using NISAR L-band observations. Permanent water bodies are subtracted via baseline masks. Results require ongoing ground-truth calibration and are intended for situational awareness and disaster response coordination.
          </div>
        </div>
      </div>
    </div>
  );
}
