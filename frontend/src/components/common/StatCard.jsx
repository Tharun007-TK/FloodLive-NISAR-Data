import React from 'react';

export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  subtitle,
  provenance,
  onClick,
  style = {},
}) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface-panel)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        padding: 'var(--space-4)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        boxShadow: 'var(--shadow-sm)',
        transition: 'border-color var(--transition-fast)',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
        <div
          style={{
            fontSize: '11px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        {Icon && (
          <div
            style={{
              width: '28px',
              height: '28px',
              backgroundColor: 'var(--surface-subtle)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <Icon size={14} color="var(--accent-blue)" />
          </div>
        )}
      </div>

      <div style={{ margin: 'var(--space-2) 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 'var(--space-1)' }}>
          <span
            className="font-mono tabular-nums"
            style={{
              fontSize: 'var(--text-2xl)',
              fontWeight: 700,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {value ?? '—'}
          </span>
          {unit && (
            <span
              style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                fontWeight: 500,
              }}
            >
              {unit}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 'var(--text-xs)' }}>
        {subtitle && (
          <span style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </span>
        )}
        {provenance && (
          <span
            style={{
              fontSize: '10px',
              color: 'var(--accent-blue)',
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Provenance
          </span>
        )}
      </div>
    </div>
  );
}
