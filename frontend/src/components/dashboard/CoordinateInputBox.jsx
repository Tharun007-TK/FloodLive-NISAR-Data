import React, { useState, useEffect } from 'react';
import { Navigation, Compass, CheckCircle2, AlertCircle, Copy, Check, Crosshair, Sparkles, MapPin } from 'lucide-react';
import { useWatchArea } from '../../context/LocationContext';

// Helper: Convert decimal degrees to Degrees, Minutes, Seconds (DMS) string
function toDMS(deg, isLat) {
  const absolute = Math.abs(deg);
  const degrees = Math.floor(absolute);
  const minutesNotTruncated = (absolute - degrees) * 60;
  const minutes = Math.floor(minutesNotTruncated);
  const seconds = Math.floor((minutesNotTruncated - minutes) * 60);

  const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
  return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
}

export default function CoordinateInputBox() {
  const { watchArea, updateWatchArea } = useWatchArea();

  const [latInput, setLatInput] = useState(watchArea.lat.toString());
  const [lngInput, setLngInput] = useState(watchArea.lng.toString());
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [success, setSuccess] = useState(false);

  // Sync inputs when watchArea changes from other methods
  useEffect(() => {
    setLatInput(watchArea.lat.toFixed(4));
    setLngInput(watchArea.lng.toFixed(4));
    setError(null);
  }, [watchArea.lat, watchArea.lng]);

  function validateAndApply() {
    const lat = parseFloat(latInput);
    const lng = parseFloat(lngInput);

    if (isNaN(lat) || isNaN(lng)) {
      setError('Please enter valid numeric latitude and longitude numbers.');
      return;
    }

    if (lat < -90 || lat > 90) {
      setError('Latitude must be between -90.0° and +90.0°');
      return;
    }

    if (lng < -180 || lng > 180) {
      setError('Longitude must be between -180.0° and +180.0°');
      return;
    }

    setError(null);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);

    updateWatchArea({
      name: `Target Coordinates (${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
      lat: lat,
      lng: lng,
      source: 'coordinates',
      details: `Direct numerical coordinates: ${toDMS(lat, true)}, ${toDMS(lng, false)}`,
    });
  }

  function handleCopy() {
    const text = `${parseFloat(latInput).toFixed(4)}, ${parseFloat(lngInput).toFixed(4)}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const parsedLat = parseFloat(latInput);
  const parsedLng = parseFloat(lngInput);
  const isValid =
    !isNaN(parsedLat) &&
    !isNaN(parsedLng) &&
    parsedLat >= -90 &&
    parsedLat <= 90 &&
    parsedLng >= -180 &&
    parsedLng <= 180;

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0E223D 0%, #0F172A 100%)',
      border: '2px solid rgba(16, 185, 129, 0.45)',
      borderRadius: '20px',
      padding: '22px',
      position: 'relative',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35), 0 0 20px rgba(16, 185, 129, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }} className="card-colorful">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10B981, #06B6D4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
          }}>
            <Navigation size={22} color="#080D1A" />
          </div>
          <div>
            <h3 style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>Method 1: Direct Latitude & Longitude</span>
              <Sparkles size={16} color="#10B981" />
            </h3>
            <span style={{ fontSize: '12px', color: '#6EE7B7' }}>
              Precision decimal coordinate input for satellite radar targeting
            </span>
          </div>
        </div>

        {/* Copy Coordinates Button */}
        <button
          onClick={handleCopy}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#6EE7B7',
            padding: '7px 12px',
            borderRadius: '10px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
        >
          {copied ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Numbers'}</span>
        </button>
      </div>

      {/* Two Text Inputs Parent Container Optimized for Lat and Lng */}
      <div style={{
        background: 'rgba(7, 13, 29, 0.85)',
        border: '2px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '16px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '14px',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
      }}>
        {/* Latitude Input */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <label style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#6EE7B7',
              letterSpacing: '0.04em',
            }}>
              LATITUDE (°N / °S)
            </label>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>-90° to +90°</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#0D152D',
            border: '1.5px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '12px',
            padding: '4px 12px',
            gap: '8px',
          }}>
            <span style={{ color: '#10B981', fontWeight: 800, fontSize: '13px' }}>LAT</span>
            <input
              type="text"
              value={latInput}
              onChange={(e) => { setLatInput(e.target.value); setError(null); }}
              placeholder="e.g. 26.2006"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                padding: '8px 0',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>°</span>
          </div>
        </div>

        {/* Longitude Input */}
        <div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}>
            <label style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#38BDF8',
              letterSpacing: '0.04em',
            }}>
              LONGITUDE (°E / °W)
            </label>
            <span style={{ fontSize: '10px', color: '#94A3B8' }}>-180° to +180°</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: '#0D152D',
            border: '1.5px solid rgba(56, 189, 248, 0.4)',
            borderRadius: '12px',
            padding: '4px 12px',
            gap: '8px',
          }}>
            <span style={{ color: '#38BDF8', fontWeight: 800, fontSize: '13px' }}>LNG</span>
            <input
              type="text"
              value={lngInput}
              onChange={(e) => { setLngInput(e.target.value); setError(null); }}
              placeholder="e.g. 92.9376"
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: 700,
                padding: '8px 0',
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
            <span style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700 }}>°</span>
          </div>
        </div>
      </div>

      {/* Apply Button & DMS Feedback */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '12px', color: '#94A3B8', fontFamily: "'IBM Plex Mono', monospace" }}>
          {isValid && (
            <span>
              🧭 {toDMS(parsedLat, true)}, {toDMS(parsedLng, false)}
            </span>
          )}
        </div>

        <button
          onClick={validateAndApply}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '12px',
            fontSize: '13px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)',
            transition: 'transform 0.15s ease',
          }}
          className="anim-glow-pulse"
        >
          <Compass size={16} />
          <span>Apply Coordinates to Radar</span>
        </button>
      </div>

      {/* Error / Success Feedback */}
      {error && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          background: 'rgba(239, 68, 68, 0.2)',
          border: '1px solid #EF4444',
          color: '#FCA5A5',
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid #10B981',
          color: '#6EE7B7',
        }}>
          <CheckCircle2 size={16} />
          <span>Target coordinates updated and locked on satellite tracking grid!</span>
        </div>
      )}

      {/* Quick Coordinate Presets */}
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#6EE7B7',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <MapPin size={13} color="#10B981" />
          <span>Quick Precision Presets:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { label: 'Assam / Brahmaputra', lat: 26.2006, lng: 92.9376 },
            { label: 'Jakarta Bay', lat: -6.2088, lng: 106.8456 },
            { label: 'Venice Lagoon', lat: 45.4408, lng: 12.3155 },
            { label: 'New Orleans Levees', lat: 29.9511, lng: -90.0715 },
          ].map((preset) => (
            <button
              key={preset.label}
              onClick={() => {
                setLatInput(preset.lat.toFixed(4));
                setLngInput(preset.lng.toFixed(4));
                updateWatchArea({
                  name: `${preset.label} (${preset.lat}°, ${preset.lng}°)`,
                  lat: preset.lat,
                  lng: preset.lng,
                  source: 'coordinates',
                  details: `Preset coordinates applied`,
                });
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#E2E8F0',
                cursor: 'pointer',
              }}
            >
              {preset.label} ({preset.lat}°, {preset.lng}°)
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
