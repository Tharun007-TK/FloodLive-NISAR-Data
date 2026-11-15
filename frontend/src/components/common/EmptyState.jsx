import React from 'react';

export default function EmptyState({
  icon: Icon,
  title = 'No data available',
  description = 'There is nothing to display here yet.',
  action,
  style = {},
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-8) var(--space-4)',
        textAlign: 'center',
        gap: 'var(--space-3)',
        ...style,
      }}
    >
      {Icon && (
        <div
          style={{
            width: '48px',
            height: '48px',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--surface-subtle)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={22} color="var(--text-muted)" />
        </div>
      )}
      <div>
        <div
          style={{
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 'var(--text-xs)',
            color: 'var(--text-muted)',
            maxWidth: '340px',
            lineHeight: 1.5,
          }}
        >
          {description}
        </div>
      </div>
      {action && (
        <div style={{ marginTop: 'var(--space-2)' }}>
          {action}
        </div>
      )}
    </div>
  );
}
