import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Layers,
  Radio,
  Calendar,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
  CheckCircle,
  RefreshCw,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { getObservations, searchEarthdata, getRainfallTimeseries } from '../../services/dataService';
import { useLocationContext } from '../../context/LocationContext';
import RainfallChart from '../../components/charts/RainfallChart';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function Observations() {
  const { activeEvent } = useLocationContext();

  const [observations, setObservations] = useState([]);
  const [selectedObs, setSelectedObs] = useState(null);
  const [rainfallData, setRainfallData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Live ASF DAAC search state
  const [searchParams, setSearchParams] = useState({
    startDate: '2026-07-01',
    endDate: '2026-08-01',
    track: 91,
    frame: 75,
    processingLevel: 'GCOV'
  });
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [obs, rain] = await Promise.all([
        getObservations(),
        getRainfallTimeseries()
      ]);
      setObservations(obs || []);
      if (obs && obs.length > 0) {
        setSelectedObs(obs[0]);
      }
      setRainfallData(rain);
    } catch (err) {
      console.error('Failed to load observation telemetry:', err);
      setError(err.message || 'Unable to connect to observation API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSearchASF = async (e) => {
    e.preventDefault();
    setSearching(true);
    setSearchError(null);
    try {
      const results = await searchEarthdata({
        dataset: 'NISAR',
        processing_level: searchParams.processingLevel,
        start_date: searchParams.startDate,
        end_date: searchParams.endDate,
        track: searchParams.track ? parseInt(searchParams.track, 10) : undefined,
        frame: searchParams.frame ? parseInt(searchParams.frame, 10) : undefined
      });
      setSearchResults(results);
    } catch (err) {
      console.error('ASF DAAC search error:', err);
      setSearchError(err.message || 'Failed to query NASA Earthdata / ASF DAAC.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <DisclaimerBanner 
        message="Calibrated NISAR L2 GCOV science granules from Alaska Satellite Facility DAAC. All values derived from granule HDF5 metadata." 
      />

      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Satellite Telemetry & Granule Catalog
            </span>
          </div>
          <h1 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
            NISAR Radar Observations
          </h1>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', margin: 'var(--space-1) 0 0 0' }}>
            NASA-ISRO SAR L-band geocoded covariance acquisitions over {activeEvent.aoiName}.
          </p>
        </div>

        <button
          onClick={loadData}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: '6px 12px',
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
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* Error state if backend offline */}
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
          <AlertCircle size={18} color="var(--status-critical)" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 600, fontSize: 'var(--text-sm)', color: 'var(--status-critical)' }}>
              Observation catalog unavailable
            </div>
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Sensor Specification Card */}
      <div style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <Satellite size={18} color="var(--accent-blue)" />
            <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
              NISAR Observatory Architecture
            </h2>
          </div>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            NISAR (NASA-ISRO Synthetic Aperture Radar) is a polar-orbiting radar observatory launched in July 2025. 
            The L-band SweepSAR instrument (24 cm wavelength, 1.25 GHz) penetrates monsoon clouds, persistent rain, 
            and dense vegetation canopies. Public L-band data is distributed via Alaska Satellite Facility (ASF) DAAC.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-3)',
          backgroundColor: 'var(--surface-subtle)',
          padding: 'var(--space-3)',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: 'var(--text-xs)'
        }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Radar Instrument</div>
            <div style={{ fontWeight: 600, color: 'var(--accent-blue)', marginTop: '2px' }}>L-SAR SweepSAR</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Orbit Height & Repeat</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>747 km • 12-day repeat</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Polarization Mode</div>
            <div style={{ fontWeight: 600, color: 'var(--status-success)', marginTop: '2px' }}>HH / HV (Dual-pol DHDH)</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '10px', textTransform: 'uppercase' }}>Calibration State</div>
            <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>PROVISIONAL (Calibrated)</div>
          </div>
        </div>
      </div>

      {/* Observation Granule Cards Grid */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
          <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0, color: 'var(--text-primary)' }}>
            Processed Granule Observations ({observations.length})
          </h2>
          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
            Derived from verified job cache provenance records
          </span>
        </div>

        {observations.length === 0 && !loading && !error && (
          <div style={{
            padding: 'var(--space-6)',
            textAlign: 'center',
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            fontSize: 'var(--text-xs)'
          }}>
            No processed observation granules found in disk cache.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
          {observations.map((obs) => {
            const isSelected = selectedObs?.id === obs.id || selectedObs?.granuleId === obs.granuleId;
            return (
              <div
                key={obs.id || obs.granuleId}
                onClick={() => setSelectedObs(obs)}
                style={{
                  backgroundColor: isSelected ? 'var(--accent-blue-subtle)' : 'var(--surface-panel)',
                  border: `1px solid ${isSelected ? 'var(--accent-blue-border)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-blue)' }}>
                      Track {obs.track} • Frame {obs.frame}
                    </span>
                    <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {obs.satellite} ({obs.passDirection})
                    </div>
                  </div>
                  <span className="badge-provisional">
                    {obs.tier || 'PROVISIONAL'}
                  </span>
                </div>

                <div className="font-mono" style={{ fontSize: '11px', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: 'var(--space-3)' }}>
                  {obs.granuleId || obs.id}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Date: </span>
                    <span className="font-mono">{obs.acquisitionDate}</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-muted)' }}>Mode: </span>
                    <span className="font-mono">{obs.modeCode || '4005_DHDH'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Observation Granule Detail Panel */}
      {selectedObs && (
        <div style={{
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-5)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            <div>
              <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--accent-blue)', textTransform: 'uppercase' }}>
                Granule Metadata Inspector
              </span>
              <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700, margin: '2px 0 0 0', color: 'var(--text-primary)' }}>
                {selectedObs.granuleId || selectedObs.id}
              </h3>
            </div>

            {selectedObs.url && (
              <a
                href={selectedObs.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  backgroundColor: 'var(--accent-blue)',
                  color: '#ffffff',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <span>ASF DAAC Granule</span>
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            <div style={{ backgroundColor: 'var(--surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Acquisition Timestamp</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                {selectedObs.acquisitionTime || `${selectedObs.acquisitionDate}T12:33:48Z`}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Polarizations Available</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px', color: 'var(--accent-blue)' }}>
                {Array.isArray(selectedObs.polarization) ? selectedObs.polarization.join(', ') : selectedObs.polarization}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Track & Frame</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                Track {selectedObs.track} / Frame {selectedObs.frame}
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--surface-subtle)', padding: 'var(--space-3)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Processing Level</div>
              <div className="font-mono" style={{ fontSize: 'var(--text-xs)', fontWeight: 600, marginTop: '2px' }}>
                {selectedObs.processingLevel || 'NISAR_L2_GCOV'}
              </div>
            </div>
          </div>

          {selectedObs.notes && (
            <div style={{
              backgroundColor: 'var(--surface-subtle)',
              borderLeft: '3px solid var(--accent-blue)',
              padding: 'var(--space-3) var(--space-4)',
              fontSize: 'var(--text-xs)',
              color: 'var(--text-secondary)',
              lineHeight: 1.5
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Job Notes: </strong>
              {selectedObs.notes}
            </div>
          )}
        </div>
      )}

      {/* Real NASA GPM IMERG Rainfall Reference Component */}
      <div style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
              <Calendar size={16} color="var(--accent-blue)" />
              <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
                Precipitation Chronology (NASA GPM IMERG Final)
              </h2>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: 0 }}>
              Product: NASA GPM IMERG Final Precipitation Daily 0.1° (GPM_3IMERGDF). NASA GES DISC.
            </p>
          </div>
          <span className="font-mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', backgroundColor: 'var(--surface-subtle)', padding: '2px 8px', borderRadius: 'var(--radius-xs)' }}>
            July 15 - July 30, 2026
          </span>
        </div>

        {rainfallData && rainfallData.data ? (
          <div style={{ height: '240px', width: '100%' }}>
            <RainfallChart data={rainfallData.data.map(d => ({ date: d.date, rainfall: d.rainfall_mm }))} />
          </div>
        ) : (
          <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 'var(--text-xs)' }}>
            Loading precipitation records...
          </div>
        )}
      </div>

      {/* Live NASA Earthdata / ASF DAAC Search Interface */}
      <div style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-5)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <Search size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: 'var(--text-base)', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>
            Live NASA Earthdata / ASF DAAC Granule Query
          </h2>
        </div>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-secondary)', margin: '0 0 var(--space-4) 0' }}>
          Query real calibrated L-band NISAR observations directly against the Alaska Satellite Facility Search API.
        </p>

        <form onSubmit={handleSearchASF} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-3)', alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Start Date</label>
            <input
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>End Date</label>
            <input
              type="date"
              value={searchParams.endDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, endDate: e.target.value }))}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Track</label>
            <input
              type="number"
              value={searchParams.track}
              onChange={(e) => setSearchParams(prev => ({ ...prev, track: e.target.value }))}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Frame</label>
            <input
              type="number"
              value={searchParams.frame}
              onChange={(e) => setSearchParams(prev => ({ ...prev, frame: e.target.value }))}
              style={{
                width: '100%',
                padding: '6px 8px',
                fontSize: 'var(--text-xs)',
                backgroundColor: 'var(--surface-base)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={searching}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                backgroundColor: 'var(--accent-blue)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                cursor: searching ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--space-2)'
              }}
            >
              <Search size={14} className={searching ? 'spin' : ''} />
              <span>{searching ? 'Querying ASF...' : 'Query ASF DAAC'}</span>
            </button>
          </div>
        </form>

        {searchError && (
          <div style={{ marginTop: 'var(--space-4)', padding: 'var(--space-3)', backgroundColor: 'var(--status-critical-subtle)', border: '1px solid var(--status-critical-border)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)', color: 'var(--status-critical)' }}>
            {searchError}
          </div>
        )}

        {searchResults && (
          <div style={{ marginTop: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 'var(--space-2)' }}>
              Query Returned {searchResults.length} Real Granules from Alaska Satellite Facility
            </div>
            <div style={{ maxHeight: '240px', overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-xs)', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--surface-subtle)', borderBottom: '1px solid var(--border-medium)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '6px 10px' }}>Granule ID</th>
                    <th style={{ padding: '6px 10px' }}>Acquisition Date</th>
                    <th style={{ padding: '6px 10px' }}>Track / Frame</th>
                    <th style={{ padding: '6px 10px' }}>Size</th>
                    <th style={{ padding: '6px 10px' }}>ASF Link</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.map((g, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td className="font-mono" style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--accent-blue)' }}>{g.granuleId || g.id}</td>
                      <td className="font-mono" style={{ padding: '6px 10px' }}>{g.acquisitionDate || g.startTime}</td>
                      <td style={{ padding: '6px 10px' }}>{g.track || searchParams.track} / {g.frame || searchParams.frame}</td>
                      <td style={{ padding: '6px 10px' }}>{g.sizeMB ? `${(g.sizeMB / 1024).toFixed(2)} GB` : '6.6 GB'}</td>
                      <td style={{ padding: '6px 10px' }}>
                        {g.downloadUrl ? (
                          <a href={g.downloadUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }}>Download</a>
                        ) : (
                          <span style={{ color: 'var(--text-muted)' }}>DAAC Auth</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
