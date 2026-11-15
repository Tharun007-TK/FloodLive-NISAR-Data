import React from 'react';

export default function EmptyState({
  icon: Icon,
  title = 'No data available',
  description = 'There is nothing to display here yet.',
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 24px',
        textAlign: 'center',
        gap: '16px',
        ...style,
      }}
    >
      {Icon && (
        <div
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '14px',
            background: 'rgba(0, 213, 255, 0.05)',
            border: '1px solid rgba(0, 213, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '4px',
          }}
        >
          <Icon size={28} color="#8B9AAF" />
        </div>
      )}
      <div>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: '16px',
            fontWeight: 600,
            color: '#8B9AAF',
            marginBottom: '8px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px',
            color: '#8B9AAF',
            opacity: 0.6,
            maxWidth: '320px',
            lineHeight: 1.6,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
}
