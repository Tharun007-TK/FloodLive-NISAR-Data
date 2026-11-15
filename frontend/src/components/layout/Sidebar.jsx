import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Map,
  BarChart2,
  Satellite,
  FileText,
  Info,
  Radio,
  ArrowLeftRight,
  Database,
  ShieldCheck,
  Gamepad2,
  Sparkles
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Overview', icon: LayoutDashboard, path: '/' },
  { label: 'Live Flood Map', icon: Map, path: '/map' },
  { label: 'Impact Analysis', icon: BarChart2, path: '/impact' },
  { label: 'Satellite Obs.', icon: Satellite, path: '/satellite' },
  { label: 'Before / After', icon: ArrowLeftRight, path: '/compare' },
  { label: 'Data Sources', icon: Database, path: '/sources' },
  { label: 'Reports & Export', icon: FileText, path: '/reports' },
  { label: 'About Project', icon: Info, path: '/about' },
];

function NavItem({ item, isActive }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <Link
      to={item.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 16px',
        textDecoration: 'none',
        borderRadius: '12px',
        margin: '4px 10px',
        position: 'relative',
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        background: isActive
          ? 'linear-gradient(90deg, rgba(0, 229, 255, 0.18) 0%, rgba(59, 130, 246, 0.12) 100%)'
          : hovered
          ? 'rgba(0, 229, 255, 0.08)'
          : 'transparent',
        border: isActive
          ? '1px solid rgba(0, 229, 255, 0.35)'
          : hovered
          ? '1px solid rgba(0, 229, 255, 0.15)'
          : '1px solid transparent',
        color: isActive ? '#00E5FF' : hovered ? '#FFFFFF' : '#94A3B8',
        boxShadow: isActive ? '0 4px 14px rgba(0, 229, 255, 0.2)' : 'none',
        transform: hovered ? 'translateX(4px)' : 'none',
      }}
    >
      <Icon
        size={18}
        style={{
          flexShrink: 0,
          color: isActive ? '#00E5FF' : hovered ? '#FFFFFF' : '#94A3B8',
          filter: isActive ? 'drop-shadow(0 0 8px rgba(0,229,255,0.7))' : 'none',
          transition: 'all 0.2s ease',
        }}
      />
      <span
        style={{
          fontSize: '13px',
          fontWeight: isActive ? 700 : 600,
          whiteSpace: 'nowrap',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          letterSpacing: '-0.01em',
        }}
      >
        {item.label}
      </span>

      {isActive && (
        <span
          style={{
            position: 'absolute',
            right: '12px',
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: '#00E5FF',
            boxShadow: '0 0 8px #00E5FF',
          }}
        />
      )}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside
      style={{
        width: '240px',
        minWidth: '240px',
        height: '100vh',
        background: 'linear-gradient(180deg, #0A1128 0%, #080D1A 100%)',
        borderRight: '1px solid rgba(0, 229, 255, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 100,
        flexShrink: 0,
        boxShadow: '4px 0 24px rgba(0, 0, 0, 0.5)',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '20px 16px',
          borderBottom: '1px solid rgba(0, 229, 255, 0.12)',
          minHeight: '70px',
          background: 'rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Animated Satellite Brand Icon */}
        <div
          style={{
            width: '38px',
            height: '38px',
            background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.25) 0%, rgba(59, 130, 246, 0.25) 100%)',
            borderRadius: '12px',
            border: '1.5px solid rgba(0, 229, 255, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 16px rgba(0, 229, 255, 0.35)',
          }}
          className="anim-float"
        >
          <Satellite size={20} color="#00E5FF" />
        </div>

        <div style={{ overflow: 'hidden' }}>
          <div
            style={{
              fontSize: '15px',
              fontWeight: 800,
              color: '#FFFFFF',
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: '-0.02em',
              lineHeight: 1.2,
            }}
          >
            FloodMap Live
          </div>
          <div
            style={{
              fontSize: '10px',
              fontWeight: 700,
              color: '#38BDF8',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              marginTop: '2px',
            }}
          >
            <span>NASA 2026</span>
            <span style={{ color: '#FF3366' }}>•</span>
            <span style={{ color: '#34D399' }}>SARs</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <div style={{ flex: 1, padding: '14px 0', overflowY: 'auto' }}>
        <div
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#64748B',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 20px 8px',
          }}
        >
          NAVIGATION
        </div>

        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.path}
            item={item}
            isActive={location.pathname === item.path}
          />
        ))}

        {/* Fun Children Game Quick Nav Banner */}
        <div style={{ padding: '12px 10px' }}>
          <Link
            to="/?tab=GAME"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(139, 92, 246, 0.25) 100%)',
              border: '1.5px solid rgba(236, 72, 153, 0.4)',
              borderRadius: '14px',
              textDecoration: 'none',
              boxShadow: '0 6px 16px rgba(236, 72, 153, 0.2)',
              transition: 'all 0.2s ease',
            }}
            className="card-colorful"
          >
            <div
              style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: '#EC4899',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <Gamepad2 size={18} />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', fontFamily: "'Fredoka', sans-serif" }}>
                Kids Flood Game
              </div>
              <div style={{ fontSize: '10px', color: '#F472B6', fontWeight: 600 }}>
                20 Survival Levels 🏆
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* System Status Footer */}
      <div
        style={{
          padding: '14px 16px',
          borderTop: '1px solid rgba(0, 229, 255, 0.12)',
          background: 'rgba(0, 0, 0, 0.3)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '6px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#10B981',
                boxShadow: '0 0 10px #10B981',
              }}
              className="anim-pulse"
            />
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#34D399' }}>
              NISAR SATELLITE
            </span>
          </div>
          <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 700 }}>
            2026
          </span>
        </div>

        <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: 1.3 }}>
          Radar Constellation Online
        </div>
      </div>
    </aside>
  );
}
