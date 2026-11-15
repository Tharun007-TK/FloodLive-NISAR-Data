import React, { useEffect, useRef } from 'react';

const statCardKeyframes = `
@keyframes stat-card-enter {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes stat-value-count {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

export default function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  subtitle,
  trend,
  color = '#00D5FF',
  style = {},
}) {
  const trendIsPositive = trend && (typeof trend === 'string' ? trend.startsWith('+') : trend > 0);
  const trendIsNegative = trend && (typeof trend === 'string' ? trend.startsWith('-') : trend < 0);

  return (
    <>
      <style>{statCardKeyframes}</style>
      <div
        style={{
          background: '#141F30',
          borderLeft: `3px solid ${color}`,
          borderRadius: '8px',
          border: '1px solid rgba(0, 213, 255, 0.08)',
          borderLeftWidth: '3px',
          borderLeftColor: color,
          padding: '18px 20px',
          position: 'relative',
          overflow: 'hidden',
          animation: 'stat-card-enter 0.35s ease both',
          boxShadow: `0 2px 16px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.03)`,
          ...style,
        }}
      >
        {/* Subtle color wash in top-right */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '80px',
            height: '80px',
            background: `radial-gradient(circle at top right, ${color}10, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />

        {/* Icon top-right */}
        {Icon && (
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '36px',
              height: '36px',
              background: `${color}15`,
              borderRadius: '8px',
              border: `1px solid ${color}30`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={18} color={color} />
          </div>
        )}

        {/* Label */}
        <div
          style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '11px',
            fontWeight: 500,
            color: '#8B9AAF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            marginBottom: '10px',
          }}
        >
          {label}
        </div>

        {/* Value */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '6px',
            marginBottom: '6px',
          }}
        >
          <span
            style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: '32px',
              fontWeight: 500,
              color: '#F2F6FC',
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            {value ?? '—'}
          </span>
          {unit && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '14px',
                color: '#8B9AAF',
                fontWeight: 400,
              }}
            >
              {unit}
            </span>
          )}
        </div>

        {/* Subtitle + Trend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {subtitle && (
            <span
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: '12px',
                color: '#8B9AAF',
              }}
            >
              {subtitle}
            </span>
          )}
          {trend !== undefined && trend !== null && (
            <span
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: trendIsNegative ? '#FF5252' : trendIsPositive ? '#35D39A' : '#8B9AAF',
                background: trendIsNegative
                  ? 'rgba(255,82,82,0.1)'
                  : trendIsPositive
                  ? 'rgba(53,211,154,0.1)'
                  : 'rgba(139,154,175,0.1)',
                borderRadius: '3px',
                padding: '1px 5px',
              }}
            >
              {typeof trend === 'number'
                ? (trend > 0 ? `+${trend}` : `${trend}`)
                : trend}
            </span>
          )}
        </div>
      </div>
    </>
  );
}
