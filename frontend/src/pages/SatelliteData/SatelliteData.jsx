import React, { useState, useEffect } from 'react';
import {
  Satellite,
  Layers,
  Radio,
  Clock,
  Calendar,
  AlertTriangle,
  Info,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import ObservationCard from '../../components/analytics/ObservationCard';
import ObservationDetail from '../../components/analytics/ObservationDetail';
import LimitationsPanel from '../../components/analytics/LimitationsPanel';
import RainfallChart from '../../components/charts/RainfallChart';
import { getObservationsCatalog, getRainfallTimeseries } from '../../services/dataService';

export default function SatelliteData() {
  const [catalog, setCatalog] = useState([]);
  const [selectedObs, setSelectedObs] = useState(null);
  const [rainfall, setRainfall] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      getObservationsCatalog(),
      getRainfallTimeseries()
    ]).then(([obs, rain]) => {
      if (!isMounted) return;
      setCatalog(obs);
      if (obs.length > 0) setSelectedObs(obs[0]);
      setRainfall(rain);
      setLoading(false);
    }).catch(err => {
      console.error('Failed to load observations', err);
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

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
      <DisclaimerBanner message="SATELLITE OBSERVATIONS REPOSITORY — INDEXED NISAR & SUPPORTING SAR PASSES • DEMONSTRATION & CALIBRATION DATASETS" />

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
            NISAR RADAR OBSERVATIONS & MISSION TELEMETRY
          </h1>
          <p style={{ fontSize: 13, color: '#8B9AAF', margin: '4px 0 0 0' }}>
            NASA-ISRO Synthetic Aperture Radar (NISAR) L-band and S-band orbital passes over Brahmaputra Floodplain.
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          background: 'rgba(0, 213, 255, 0.08)',
          border: '1px solid rgba(0, 213, 255, 0.25)',
          padding: '6px 14px',
          borderRadius: 6,
          fontSize: 12,
          fontFamily: "'IBM Plex Mono', monospace"
        }}>
          <Radio size={14} color="#00D5FF" />
          <span>ORBIT: POLAR SUN-SYNCHRONOUS (747 KM)</span>
        </div>
      </div>

      {/* NISAR Mission Overview Card */}
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
            <Satellite size={18} color="#00D5FF" />
            <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
              NISAR Mission Profile
            </h3>
          </div>
          <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
            NISAR is a groundbreaking joint Earth-observing mission between NASA and ISRO. Utilizing dual-frequency synthetic aperture radar (L-band from NASA at 24 cm wavelength and S-band from ISRO at 9 cm wavelength), the observatory measures changes in Earth’s ecosystems, ice mass, and land deformation day and night through cloud cover.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 10,
          fontSize: 12,
          background: 'rgba(8, 13, 24, 0.6)',
          padding: 12,
          borderRadius: 6,
          border: '1px solid rgba(255, 255, 255, 0.05)'
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>PRIMARY SENSOR</div>
            <div style={{ fontWeight: 600, color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace" }}>L-band SweepSAR</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>REPEAT CYCLE</div>
            <div style={{ fontWeight: 600, color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace" }}>12 Days</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>SPATIAL RESOLUTION</div>
            <div style={{ fontWeight: 600, color: '#35D39A', fontFamily: "'IBM Plex Mono', monospace" }}>3 - 12 Meters</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>SWATH WIDTH</div>
            <div style={{ fontWeight: 600, color: '#F2F6FC', fontFamily: "'IBM Plex Mono', monospace" }}>&gt; 240 Kilometers</div>
          </div>
        </div>
      </div>

      {/* Observation Selection Grid */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 10
        }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
            AVAILABLE SATELLITE ACQUISITIONS ({catalog.length})
          </h3>
          <span style={{ fontSize: 11, color: '#8B9AAF' }}>
            Click an observation card to inspect radar telemetry
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 12
        }}>
          {catalog.map(obs => (
            <ObservationCard
              key={obs.id}
              observation={obs}
              selected={selectedObs?.id === obs.id}
              onClick={() => setSelectedObs(obs)}
            />
          ))}
        </div>
      </div>

      {/* Selected Observation Telemetry Details */}
      <ObservationDetail observation={selectedObs} />

      {/* Rainfall Context Component */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.15)',
        borderRadius: 8,
        padding: '18px 20px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          paddingBottom: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={16} color="#00D5FF" />
            <span style={{ fontSize: 14, fontWeight: 700, color: '#F2F6FC' }}>
              PRECIPITATION CONTEXT (IMD REFERENCE STATIONS)
            </span>
          </div>
          <span style={{ fontSize: 10, color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
            MONSOON CHRONOLOGY
          </span>
        </div>

        <p style={{ fontSize: 12, color: '#8B9AAF', margin: '0 0 14px 0' }}>
          Daily precipitation records highlighting the monsoon storm events preceding the July 8, 2024 peak flood satellite acquisition.
        </p>

        <div style={{ height: 220 }}>
          <RainfallChart data={rainfall.map(r => ({ date: r.date, rainfall: r.precipitation_mm }))} />
        </div>
      </div>

      {/* Scientific Constraints & Physics Panel */}
      <LimitationsPanel />
    </div>
  );
}
