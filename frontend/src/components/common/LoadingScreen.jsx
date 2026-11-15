import React from 'react';
import { Satellite } from 'lucide-react';

export default function LoadingScreen({ message = 'Loading NISAR radar observation...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        padding: 'var(--space-8)',
        backgroundColor: 'var(--surface-bg)',
        color: 'var(--text-primary)',
        gap: 'var(--space-3)'
      }}
    >
      <div
        style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius-sm)',
          backgroundColor: 'var(--surface-panel)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Satellite size={20} color="var(--accent-blue)" className="spin" />
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
          {message}
        </div>
        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: '2px' }}>
          Querying local cache and processing microservice
        </div>
      </div>
    </div>
  );
}
