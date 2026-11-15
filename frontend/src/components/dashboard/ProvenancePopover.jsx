import React, { useState } from 'react';
import { Info, ExternalLink, ShieldAlert, Cpu } from 'lucide-react';

export default function ProvenancePopover({ provenance, title, children }) {
  const [open, setOpen] = useState(false);

  if (!provenance) return <>{children}</>;

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <div style={{ cursor: 'pointer' }} onClick={() => setOpen(prev => !prev)}>
        {children}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: 'var(--space-2)',
            width: '320px',
            backgroundColor: 'var(--surface-panel)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-lg)',
            padding: 'var(--space-3)',
            zIndex: 'var(--z-popover)',
            fontSize: 'var(--text-xs)',
            color: 'var(--text-primary)',
            textAlign: 'left'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-1)' }}>
            <span style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
              Provenance & Data Traceability
            </span>
            <span className="badge-provisional">
              {provenance.data_tier || 'PROVISIONAL'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
            <div>
              <span style={{ color: 'var(--text-muted)' }}>Pre-flood Granule: </span>
              <a
                href={provenance.pre_flood_granule?.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
              >
                {provenance.pre_flood_granule?.id ? `${provenance.pre_flood_granule.id.slice(0, 24)}...` : 'N/A'}
                <ExternalLink size={10} />
              </a>
            </div>

            <div>
              <span style={{ color: 'var(--text-muted)' }}>Post-flood Granule: </span>
              <a
                href={provenance.post_flood_granule?.url}
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{ color: 'var(--accent-blue)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
              >
                {provenance.post_flood_granule?.id ? `${provenance.post_flood_granule.id.slice(0, 24)}...` : 'N/A'}
                <ExternalLink size={10} />
              </a>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Polarization:</span>
              <span className="font-mono">{(provenance.polarizations_used || ['HH', 'HV']).join(', ')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Otsu Cutoff:</span>
              <span className="font-mono">{provenance.otsu_optimal_threshold_db || -19.42} dB</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Change Threshold:</span>
              <span className="font-mono">{provenance.ratio_drop_threshold_db || -4.5} dB</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Min. Mapping Unit:</span>
              <span className="font-mono">{provenance.minimum_mapping_unit_ha || 1.0} ha</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-muted)' }}>Equal-Area CRS:</span>
              <span className="font-mono">{provenance.equal_area_crs || 'EPSG:6933'}</span>
            </div>
          </div>

          <div style={{ padding: 'var(--space-1) var(--space-2)', backgroundColor: 'var(--status-warning-bg)', borderRadius: 'var(--radius-xs)', border: '1px solid rgba(217,119,6,0.2)', color: 'var(--status-warning)' }}>
            <span style={{ fontWeight: 600 }}>Uncertainty Note: </span>
            {provenance.validation?.status || 'Not independently validated'}
          </div>
        </div>
      )}
    </div>
  );
}
