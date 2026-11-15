import React from 'react';

const SEVERITY_STYLES = {
  CRITICAL: { background: 'rgba(255, 82, 82, 0.15)', color: '#FF5252', border: '1px solid rgba(255, 82, 82, 0.3)' },
  HIGH: { background: 'rgba(255, 181, 71, 0.15)', color: '#FFB547', border: '1px solid rgba(255, 181, 71, 0.3)' },
  MODERATE: { background: 'rgba(67, 139, 255, 0.15)', color: '#438BFF', border: '1px solid rgba(67, 139, 255, 0.3)' },
  LOW: { background: 'rgba(53, 211, 154, 0.15)', color: '#35D39A', border: '1px solid rgba(53, 211, 154, 0.3)' },
  DEMO: { background: 'rgba(255, 181, 71, 0.1)', color: '#FFB547', border: '1px solid rgba(255, 181, 71, 0.2)' },
};

export default function Badge({ severity = 'LOW', label, style = {} }) {
  const s = SEVERITY_STYLES[severity] || SEVERITY_STYLES.LOW;
  return (
    <span
      style={{
        ...s,
        padding: '2px 8px',
        borderRadius: '4px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.05em',
        fontFamily: "'IBM Plex Mono', monospace",
        display: 'inline-block',
        ...style,
      }}
    >
      {label || severity}
    </span>
  );
}
