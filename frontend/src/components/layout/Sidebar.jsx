import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, Map, BarChart2, Satellite, BookOpen, Download } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Map', icon: Map, path: '/map' },
  { label: 'Impact', icon: BarChart2, path: '/impact' },
  { label: 'Observations', icon: Satellite, path: '/observations' },
  { label: 'Method', icon: BookOpen, path: '/method' },
  { label: 'Export', icon: Download, path: '/export' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: '56px',
        minWidth: '56px',
        height: '100%',
        backgroundColor: 'var(--surface-panel)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 'var(--space-2) 0',
        zIndex: 'var(--z-rail)',
        userSelect: 'none'
      }}
    >
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', width: '100%', alignItems: 'center' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              title={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                textDecoration: 'none',
                color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)',
                backgroundColor: isActive ? 'var(--accent-blue-subtle)' : 'transparent',
                border: isActive ? '1px solid var(--accent-blue-border)' : '1px solid transparent',
                transition: 'background-color var(--transition-fast), color var(--transition-fast)'
              }}
            >
              <Icon size={18} strokeWidth={isActive ? 2.2 : 1.75} />
              <span style={{ fontSize: '9px', fontWeight: isActive ? 600 : 400, marginTop: '2px' }}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
