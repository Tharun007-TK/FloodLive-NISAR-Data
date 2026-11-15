import React from 'react';

const SEVERITY_TOKENS = {
  CRITICAL: {
    bg: 'var(--status-critical-subtle)',
    color: 'var(--status-critical)',
    border: 'var(--status-critical-border)'
  },
  HIGH: {
    bg: 'var(--status-warning-subtle)',
    color: 'var(--status-warning)',
    border: 'var(--status-warning-border)'
  },
  MODERATE: {
    bg: 'var(--accent-blue-subtle)',
    color: 'var(--accent-blue)',
    border: 'var(--accent-blue-border)'
  },
  LOW: {
    bg: 'var(--status-success-subtle)',
    color: 'var(--status-success)',
    border: 'var(--status-success-border)'
  }
};

export default function Badge({ severity = 'LOW', label, style = {} }) {
  const norm = (severity || 'LOW').toUpperCase();
  const token = SEVERITY_TOKENS[norm] || SEVERITY_TOKENS.LOW;

  return (
    <span
      className="font-mono"
      style={{
        backgroundColor: token.bg,
        color: token.color,
        border: `1px solid ${token.border}`,
        padding: '1px 6px',
        borderRadius: 'var(--radius-xs)',
        fontSize: '10px',
        fontWeight: 600,
        letterSpacing: '0.04em',
        display: 'inline-block',
        textTransform: 'uppercase',
        ...style,
      }}
    >
      {label || severity}
    </span>
  );
}
