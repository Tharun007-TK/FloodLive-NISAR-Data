import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function DisclaimerBanner({ style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        background: 'rgba(255, 181, 71, 0.06)',
        borderBottom: '1px solid rgba(255, 181, 71, 0.15)',
        borderTop: '1px solid rgba(255, 181, 71, 0.15)',
        padding: '7px 20px',
        ...style,
      }}
    >
      <AlertTriangle
        size={13}
        color="#FFB547"
        style={{ flexShrink: 0 }}
      />
      <span
        style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: '11px',
          fontWeight: 500,
          color: '#FFB547',
          letterSpacing: '0.08em',
          opacity: 0.85,
        }}
      >
        DEMONSTRATION DATA — NOT VERIFIED SATELLITE ANALYSIS
      </span>
    </div>
  );
}
