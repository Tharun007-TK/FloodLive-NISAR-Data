import React, { useState, useEffect } from 'react';
import { MapPin, Satellite, Bell, Search, Compass, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWatchArea } from '../../context/LocationContext';

function LiveClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        lineHeight: 1.2,
      }}
    >
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '13px',
          fontWeight: 600,
          color: '#F2F6FC',
          letterSpacing: '0.06em',
        }}
      >
        {timeStr}
      </span>
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '10px',
          color: '#8B9AAF',
          letterSpacing: '0.04em',
        }}
      >
        {dateStr} UTC
      </span>
    </div>
  );
}

export default function TopNav() {
  const { watchArea } = useWatchArea();
  const [bellHovered, setBellHovered] = useState(false);

  return (
    <header
      style={{
        height: '56px',
        minHeight: '56px',
        background: '#101827',
        borderBottom: '1px solid rgba(0, 213, 255, 0.12)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: '16px',
        zIndex: 50,
      }}
    >
      {/* Active Watch Area Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          flexShrink: 0,
        }}
      >
        <div style={{
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: 'rgba(0, 213, 255, 0.15)',
          border: '1px solid rgba(0, 213, 255, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MapPin
            size={13}
            color="#00D5FF"
          />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 10, color: '#8B9AAF', fontFamily: "'IBM Plex Mono', monospace" }}>
              ACTIVE WATCH AREA:
            </span>
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                color: '#F2F6FC',
                whiteSpace: 'nowrap',
              }}
            >
              {watchArea.name}
            </span>
          </div>
          <div style={{ fontSize: 10, color: '#00D5FF', fontFamily: "'IBM Plex Mono', monospace" }}>
            {watchArea.lat.toFixed(4)}°N, {watchArea.lng.toFixed(4)}°E • Source: {watchArea.source?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Center Link to Map */}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link
          to="/map"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            background: 'rgba(0, 213, 255, 0.08)',
            border: '1px solid rgba(0, 213, 255, 0.25)',
            color: '#00D5FF',
            padding: '5px 12px',
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 600,
            textDecoration: 'none',
            fontFamily: "'IBM Plex Mono', monospace"
          }}
        >
          <Compass size={13} />
          <span>VIEW IN LIVE MAP</span>
          <ExternalLink size={11} />
        </Link>
      </div>

      {/* Right Section */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flexShrink: 0,
        }}
      >
        {/* SATELLITE STATUS badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(53, 211, 154, 0.1)',
            border: '1px solid rgba(53, 211, 154, 0.25)',
            borderRadius: '4px',
            padding: '4px 8px',
          }}
        >
          <Satellite size={12} color="#35D39A" />
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              color: '#35D39A',
              letterSpacing: '0.05em',
            }}
          >
            NISAR ACTIVE
          </span>
        </div>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            background: 'rgba(0, 213, 255, 0.08)',
          }}
        />

        {/* Live Clock */}
        <LiveClock />
      </div>
    </header>
  );
}
