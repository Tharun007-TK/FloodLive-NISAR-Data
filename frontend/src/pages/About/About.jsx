import React from 'react';
import {
  Satellite,
  Compass,
  Layers,
  Radio,
  ShieldCheck,
  AlertTriangle,
  Info,
  ExternalLink,
  Code,
  Globe,
  Database
} from 'lucide-react';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function About() {
  return (
    <div style={{
      padding: '24px 28px 60px',
      background: '#080D18',
      minHeight: '100%',
      color: '#F2F6FC',
      fontFamily: 'Inter, sans-serif',
      maxWidth: 960,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }}>
      <DisclaimerBanner message="NASA SPACE APPS CHALLENGE 2026 • DANCING WITH THE SARS • SCIENTIFIC TRANSPARENCY DOSSIER" />

      {/* Hero Header */}
      <div style={{ borderBottom: '1px solid rgba(0, 213, 255, 0.2)', paddingBottom: 20 }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(0, 213, 255, 0.1)',
          border: '1px solid rgba(0, 213, 255, 0.3)',
          padding: '4px 10px',
          borderRadius: 20,
          fontSize: 11,
          fontFamily: "'IBM Plex Mono', monospace",
          color: '#00D5FF',
          marginBottom: 12
        }}>
          <Compass size={13} />
          NASA SPACE APPS CHALLENGE 2026 — DANCING WITH THE SARS
        </div>

        <h1 style={{
          fontSize: 28,
          fontWeight: 800,
          fontFamily: 'Space Grotesk, sans-serif',
          margin: 0,
          color: '#F2F6FC',
          letterSpacing: '-0.03em'
        }}>
          FLOODMAP LIVE
        </h1>
        <p style={{ fontSize: 15, color: '#8B9AAF', lineHeight: 1.6, marginTop: 8 }}>
          Transforming satellite synthetic aperture radar (SAR) observations into actionable flood extent maps and geospatial exposure analytics for vulnerable populations.
        </p>
      </div>

      {/* Section 1: The Core Scientific Purpose */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#00D5FF', margin: '0 0 10px 0' }}>
          1. The Three Fundamental Geospatial Questions
        </h2>
        <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7, margin: '0 0 14px 0' }}>
          During major monsoon flood disasters, disaster response coordinators, district magistrates, and humanitarian agencies need rapid, credible answers to three critical questions:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(0, 213, 255, 0.15)' }}>
            <div style={{ fontSize: 11, color: '#00D5FF', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>QUESTION 1</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F2F6FC', margin: '4px 0' }}>WHERE has flooding occurred?</div>
            <div style={{ fontSize: 12, color: '#8B9AAF', lineHeight: 1.5 }}>
              Delineating the precise geographical footprint of inundated land while masking out permanent river channels.
            </div>
          </div>

          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(0, 213, 255, 0.15)' }}>
            <div style={{ fontSize: 11, color: '#FFB547', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>QUESTION 2</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F2F6FC', margin: '4px 0' }}>HOW MUCH land is affected?</div>
            <div style={{ fontSize: 12, color: '#8B9AAF', lineHeight: 1.5 }}>
              Calculating total surface water expansion, territory percentage by district, and inundated cropland area.
            </div>
          </div>

          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(0, 213, 255, 0.15)' }}>
            <div style={{ fontSize: 11, color: '#35D39A', fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace" }}>QUESTION 3</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#F2F6FC', margin: '4px 0' }}>WHICH communities are exposed?</div>
            <div style={{ fontSize: 12, color: '#8B9AAF', lineHeight: 1.5 }}>
              Identifying exposed villages, estimated affected population, and agricultural livelihoods requiring relief.
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Why Synthetic Aperture Radar (SAR)? */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.2)',
        borderRadius: 8,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Radio size={20} color="#00D5FF" />
          <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
            2. The Radar Advantage: Dancing with the SARs
          </h2>
        </div>
        <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
          Traditional optical satellites (such as Landsat, Sentinel-2, or MODIS) are completely blinded by the thick monsoon cloud cover, heavy rainbands, and overcast skies that accompany major flooding events.
        </p>
        <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7, margin: 0 }}>
          <strong>Synthetic Aperture Radar (SAR) is an active sensor:</strong> it emits microwave pulses in the GHz spectrum that penetrate clouds, haze, smoke, and torrential rain, operating with identical efficacy in total darkness as in broad daylight.
        </p>
      </div>

      {/* Section 3: The NISAR Mission */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#00D5FF', margin: '0 0 10px 0' }}>
          3. The NASA-ISRO Synthetic Aperture Radar (NISAR)
        </h2>
        <p style={{ fontSize: 13, color: '#CBD5E1', lineHeight: 1.7, margin: '0 0 14px 0' }}>
          NISAR is a collaborative Earth-observing satellite mission jointly developed by NASA and the Indian Space Research Organisation (ISRO). It represents the first dual-frequency synthetic aperture radar satellite in orbit, utilizing advanced SweepSAR technology.
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 10,
          background: '#101827',
          padding: 16,
          borderRadius: 8,
          border: '1px solid rgba(255, 255, 255, 0.05)',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12
        }}>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>L-BAND FREQUENCY (NASA)</div>
            <div style={{ color: '#00D5FF', fontWeight: 600, marginTop: 2 }}>1.25 GHz (24 cm wavelength)</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>S-BAND FREQUENCY (ISRO)</div>
            <div style={{ color: '#35D39A', fontWeight: 600, marginTop: 2 }}>3.2 GHz (9.3 cm wavelength)</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>EXACT REPEAT ORBIT</div>
            <div style={{ color: '#F2F6FC', fontWeight: 600, marginTop: 2 }}>12 Days (Polar Sun-Sync)</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: '#8B9AAF' }}>SPATIAL RESOLUTION</div>
            <div style={{ color: '#FFB547', fontWeight: 600, marginTop: 2 }}>3 to 12 meters</div>
          </div>
        </div>
      </div>

      {/* Section 4: How SAR Flood Extent Mapping Works */}
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#00D5FF', margin: '0 0 12px 0' }}>
          4. Radar Physics: How Floodwater is Detected
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontWeight: 700, color: '#00D5FF', fontSize: 13 }}>
              Step 1: Specular Reflection on Open Water
            </div>
            <p style={{ fontSize: 12, color: '#CBD5E1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              Smooth open standing water acts like a mirror to incoming radar waves. The emitted microwave pulse reflects forward away from the satellite, returning virtually zero backscatter signal to the antenna. In radar imagery, water appears characteristically <strong>dark</strong> (typically &lt; -20 dB).
            </p>
          </div>

          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontWeight: 700, color: '#00D5FF', fontSize: 13 }}>
              Step 2: Diffuse Backscatter on Dry Rough Terrain
            </div>
            <p style={{ fontSize: 12, color: '#CBD5E1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              Dry soil, agricultural crops, and rough terrain scatter the incoming radar pulse in all directions (diffuse scattering). A substantial portion bounces back to the satellite, appearing as a bright signal (typically -10 dB to -15 dB).
            </p>
          </div>

          <div style={{ background: '#141F30', padding: 14, borderRadius: 6, border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontWeight: 700, color: '#00D5FF', fontSize: 13 }}>
              Step 3: Bitemporal Change Detection & Baseline Subtraction
            </div>
            <p style={{ fontSize: 12, color: '#CBD5E1', margin: '4px 0 0 0', lineHeight: 1.5 }}>
              By dividing the peak flood acquisition by a dry pre-monsoon baseline image (ratioing), pixels that experienced an abrupt drop in backscatter are identified as newly flooded. Permanent water bodies (the perennial river channel, beels, wetlands) are subtracted using a pre-calibrated mask.
            </p>
          </div>
        </div>
      </div>

      {/* Section 5: Scientific Integrity & Transparency Statement */}
      <div style={{
        background: 'rgba(255, 82, 82, 0.08)',
        border: '1px solid rgba(255, 82, 82, 0.3)',
        borderRadius: 8,
        padding: '20px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#FF5252' }}>
          <AlertTriangle size={18} />
          <h3 style={{ fontSize: 15, fontWeight: 700, margin: 0 }}>
            Scientific Transparency & Platform Limitations
          </h3>
        </div>
        <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
          <strong>FloodMap Live is an observational flood extent mapping and impact assessment platform. It is NOT a flood forecast or hydrologic prediction model.</strong>
        </p>
        <ul style={{ fontSize: 12, color: '#8B9AAF', lineHeight: 1.6, margin: '6px 0 0 0', paddingLeft: 20 }}>
          <li>Dense emergent vegetation can hide floodwater under forest canopies.</li>
          <li>Urban structures create corner reflectors (double-bounce) that can mask inundated streets.</li>
          <li>Strong winds create capillary waves that reduce specular water reflection.</li>
          <li>Steep terrain creates radar shadows that require digital elevation model masking.</li>
          <li>Satellite observations represent snapshot in time (12-day orbit); short flash floods between passes may not be captured.</li>
        </ul>
      </div>

      {/* Section 6: Architecture & Integration Readiness */}
      <div style={{
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.15)',
        borderRadius: 8,
        padding: '18px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Database size={16} color="#00D5FF" />
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: '#F2F6FC' }}>
            Extensible, Zero-Backend Integration Ready
          </h3>
        </div>
        <p style={{ fontSize: 12, color: '#CBD5E1', lineHeight: 1.6, margin: 0 }}>
          FloodMap Live is built with a decoupled frontend-first architecture. It functions completely independently using the local manifest discovery system, while remaining architecturally prepared to connect to Python/FastAPI processing backends via <code>VITE_API_BASE_URL</code> when live NISAR pipelines go online.
        </p>
      </div>
    </div>
  );
}
