import React, { useEffect, useState } from 'react';
import { Satellite } from 'lucide-react';

const loadingBarKeyframes = `
@keyframes loading-bar-sweep {
  0% { transform: translateX(-100%); }
  60% { transform: translateX(0%); }
  100% { transform: translateX(100%); }
}
@keyframes loading-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes loading-logo-glow {
  0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 213, 255, 0.3)); }
  50% { filter: drop-shadow(0 0 20px rgba(0, 213, 255, 0.8)); }
}
`;

export default function LoadingScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '' : d + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{loadingBarKeyframes}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: '#080D18',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}
      >
        {/* Subtle grid background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(0,213,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,213,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            position: 'relative',
          }}
        >
          {/* Icon with glow */}
          <div
            style={{
              width: '72px',
              height: '72px',
              background: 'rgba(0, 213, 255, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 213, 255, 0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'loading-logo-glow 2.5s ease-in-out infinite',
            }}
          >
            <Satellite size={36} color="#00D5FF" />
          </div>

          {/* Title */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '28px',
                fontWeight: 700,
                color: '#F2F6FC',
                letterSpacing: '0.02em',
                lineHeight: 1.2,
              }}
            >
              FloodMap Live
            </div>
            <div
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                color: '#00D5FF',
                letterSpacing: '0.15em',
                marginTop: '6px',
                opacity: 0.8,
              }}
            >
              NASA SPACE APPS 2026
            </div>
          </div>

          {/* Loading text */}
          <div
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '12px',
              color: '#8B9AAF',
              letterSpacing: '0.05em',
              animation: 'loading-pulse 1.2s ease-in-out infinite',
              minWidth: '220px',
              textAlign: 'center',
            }}
          >
            Loading satellite data{dots}
          </div>
        </div>

        {/* Loading bar container */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: 'rgba(0, 213, 255, 0.08)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '40%',
              background: 'linear-gradient(90deg, transparent, #00D5FF, rgba(67,139,255,0.8), transparent)',
              animation: 'loading-bar-sweep 1.6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }}
          />
        </div>
      </div>
    </>
  );
}
