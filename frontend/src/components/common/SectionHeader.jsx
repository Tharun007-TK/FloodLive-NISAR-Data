import React from 'react';

export default function SectionHeader({ title, subtitle, actions, style = {} }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '20px',
        paddingLeft: '12px',
        borderLeft: '3px solid #00D5FF',
        ...style,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <h2
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: '#F2F6FC',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '0.01em',
          }}
        >
          {title}
        </h2>
        {subtitle && (
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '13px',
              color: '#8B9AAF',
              margin: '4px 0 0 0',
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actions && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexShrink: 0,
          }}
        >
          {actions}
        </div>
      )}
    </div>
  );
}
