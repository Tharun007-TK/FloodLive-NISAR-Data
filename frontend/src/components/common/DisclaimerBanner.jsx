import React from 'react';
import { AlertCircle, Info } from 'lucide-react';

export default function DisclaimerBanner({ 
  message = 'NISAR L2 GCOV (PROVISIONAL) • Calibrated science product • Not independently validated against ground truth or simultaneous radar',
  severity = 'info',
  style = {} 
}) {
  const isWarning = severity === 'warning';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        backgroundColor: isWarning ? 'var(--status-warning-subtle)' : 'var(--accent-blue-subtle)',
        borderBottom: `1px solid ${isWarning ? 'var(--status-warning)' : 'var(--accent-blue-border)'}`,
        padding: '6px var(--space-4)',
        fontSize: 'var(--text-xs)',
        color: isWarning ? 'var(--status-warning)' : 'var(--accent-blue)',
        userSelect: 'none',
        ...style,
      }}
    >
      {isWarning ? (
        <AlertCircle size={14} style={{ flexShrink: 0 }} />
      ) : (
        <Info size={14} style={{ flexShrink: 0 }} />
      )}
      <span style={{ fontWeight: 500, letterSpacing: '0.01em' }}>
        {message}
      </span>
    </div>
  );
}
