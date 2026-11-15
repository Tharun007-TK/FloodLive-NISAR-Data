import React, { useState, useEffect } from 'react';
import { Radio, Sun, Moon, AlertTriangle, ShieldCheck, RefreshCw } from 'lucide-react';
import { useLocationContext } from '../../context/LocationContext';
import { checkBackendHealth } from '../../services/apiClient';

export default function TopNav() {
  const { theme, toggleTheme, activeEvent, setActiveEvent, verifiedEvents } = useLocationContext();
  const [backendStatus, setBackendStatus] = useState({ connected: false, checking: true });

  const verifyHealth = async () => {
    setBackendStatus(prev => ({ ...prev, checking: true }));
    const health = await checkBackendHealth();
    setBackendStatus({ connected: health.connected, checking: false, error: health.error });
  };

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      style={{
        height: '48px',
        minHeight: '48px',
        backgroundColor: 'var(--surface-panel)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        zIndex: 'var(--z-topbar)',
        userSelect: 'none'
      }}
    >
      {/* Left: Product title & AOI Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: backendStatus.connected ? 'var(--status-success)' : 'var(--status-critical)'
            }}
          />
          <span style={{ fontWeight: 700, fontSize: 'var(--text-base)', letterSpacing: '-0.01em' }}>
            NISAR Flood Observatory
          </span>
        </div>

        <div style={{ height: '16px', width: '1px', backgroundColor: 'var(--border-medium)' }} />

        {/* AOI Event Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label htmlFor="aoi-select" style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Event:
          </label>
          <select
            id="aoi-select"
            value={activeEvent.id}
            onChange={(e) => {
              const selected = verifiedEvents.find(v => v.id === e.target.value);
              if (selected) setActiveEvent(selected);
            }}
            style={{
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              padding: '2px 8px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-medium)',
              backgroundColor: 'var(--surface-base)',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            {verifiedEvents.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.name} — Track {evt.track}, Frame {evt.frame}
              </option>
            ))}
          </select>
        </div>

        {/* Pre / Post observation dates */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-secondary)' }}>
          <span style={{ color: 'var(--text-muted)' }}>Baseline:</span>
          <span className="font-mono" style={{ padding: '1px 4px', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)' }}>
            {activeEvent.preDate}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>Overpass:</span>
          <span className="font-mono" style={{ padding: '1px 4px', backgroundColor: 'var(--surface-subtle)', borderRadius: 'var(--radius-xs)', color: 'var(--accent-blue)', fontWeight: 600 }}>
            {activeEvent.postDate}
          </span>
        </div>
      </div>

      {/* Right: Badges, Connectivity & Theme Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* Tier Badge */}
        <span className="badge-provisional" title="Calibrated post-June 2026 science observation">
          {activeEvent.tier}
        </span>

        {/* Validation State Badge */}
        <span className="badge-unvalidated" title="No simultaneous ground truth radar mask available">
          Not independently validated
        </span>

        {/* Backend Connectivity Status */}
        <button
          onClick={verifyHealth}
          title={backendStatus.connected ? 'Backend service online' : `Backend offline: ${backendStatus.error || 'Connection refused'}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-1)',
            padding: '2px 6px',
            fontSize: 'var(--text-xs)',
            backgroundColor: 'transparent',
            border: 'none',
            color: backendStatus.connected ? 'var(--text-muted)' : 'var(--status-critical)',
            cursor: 'pointer'
          }}
        >
          <RefreshCw size={12} className={backendStatus.checking ? 'spin' : ''} />
          <span>{backendStatus.connected ? 'API Online' : 'API Offline'}</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--surface-subtle)',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          {theme === 'light' ? <Moon size={14} /> : <Sun size={14} />}
        </button>
      </div>
    </header>
  );
}
