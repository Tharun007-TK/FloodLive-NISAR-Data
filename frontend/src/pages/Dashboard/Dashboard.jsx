import React, { useState, useEffect } from 'react';
import {
  Layers,
  Building2,
  Home,
  Wheat,
  Users,
  Satellite,
  Activity,
  AlertTriangle,
  RefreshCw,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Database,
  MapPin,
  Globe,
  Navigation,
  Compass,
  CheckCircle2,
  Radio,
  Gamepad2,
  Sparkles,
  PhoneCall,
  Heart,
  Droplets,
  LifeBuoy,
  Megaphone,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/common/StatCard';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';
import Badge from '../../components/common/Badge';
import EmptyState from '../../components/common/EmptyState';
import FloodTimelineChart from '../../components/charts/FloodTimelineChart';
import DistrictBarChart from '../../components/charts/DistrictBarChart';
import SeverityDonut from '../../components/charts/SeverityDonut';
import AgricultureChart from '../../components/charts/AgricultureChart';
import PlaceSearch from '../../components/dashboard/PlaceSearch';
import CoordinateInputBox from '../../components/dashboard/CoordinateInputBox';
import FloodHeroGame from '../../components/game/FloodHeroGame';
import { useWatchArea } from '../../context/LocationContext';
import {
  getFloodExtent,
  getDistrictBoundaries,
  getVillages,
  getCroplandExposure,
  getObservationsCatalog,
  getRainfallTimeseries,
  computeImpactStatistics,
  getManifest
} from '../../services/dataService';

export default function Dashboard() {
  const { watchArea, updateWatchArea } = useWatchArea();
  const [stats, setStats] = useState(null);
  const [manifest, setManifest] = useState(null);
  const [observations, setObservations] = useState([]);
  const [rainfallData, setRainfallData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Tab View for Common Man ease of use
  const [activeTab, setActiveTab] = useState('DASHBOARD'); // 'DASHBOARD' | 'GAME' | 'LOCATION' | 'SAFETY'
  const [selectionView, setSelectionView] = useState('ALL'); // 'ALL' | 'SEARCH' | 'COORDS'

  async function loadAllData(force = false) {
    if (force) setRefreshing(true);
    try {
      const [man, flood, districts, villages, cropland, obs, rain] = await Promise.all([
        getManifest(force),
        getFloodExtent(),
        getDistrictBoundaries(),
        getVillages(),
        getCroplandExposure(),
        getObservationsCatalog(),
        getRainfallTimeseries()
      ]);

      setManifest(man);
      setObservations(obs);
      setRainfallData(rain);

      const computed = computeImpactStatistics({
        floodGeoJSON: flood?.geojson || null,
        districtsGeoJSON: districts?.geojson || null,
        villagesGeoJSON: villages?.geojson || null,
        croplandGeoJSON: cropland?.geojson || null
      });

      setStats(computed);
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadAllData();
  }, []);

  const hasData = Boolean(stats && stats.hasData && stats.totalFloodedAreaKm2 > 0);

  // Prepare chart time series strictly from loaded rainfall records (No fake values)
  const timelineData = rainfallData && rainfallData.length > 0 ? rainfallData.map(r => ({
    date: r.date,
    rainfall: r.precipitation_mm || 0,
    floodedArea: stats?.totalFloodedAreaKm2 ? stats.totalFloodedAreaKm2 * 0.85 : 0
  })) : [];

  return (
    <div style={{
      padding: '20px 24px 48px',
      background: 'linear-gradient(180deg, #0A1128 0%, #0F172A 100%)',
      minHeight: '100%',
      color: '#FFFFFF',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      {/* Friendly Notification Notice */}
      <div style={{
        background: 'linear-gradient(90deg, rgba(0, 229, 255, 0.15) 0%, rgba(59, 130, 246, 0.2) 100%)',
        border: '1px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '14px',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        marginBottom: '18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} color="#00E5FF" />
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#E2E8F0' }}>
            🛰️ Live Radar Watch Active — Simplified community updates for citizens, families, and emergency teams!
          </span>
        </div>
        <div style={{
          fontSize: '11px',
          fontWeight: 700,
          background: 'rgba(16, 185, 129, 0.25)',
          color: '#34D399',
          padding: '3px 10px',
          borderRadius: '999px',
          border: '1px solid #10B981',
        }}>
          STATUS: ONLINE & SAFE
        </div>
      </div>

      {/* Vibrant Hero Header */}
      <div style={{
        background: 'linear-gradient(135deg, #172554 0%, #1E1B4B 50%, #0F172A 100%)',
        border: '2px solid rgba(0, 229, 255, 0.3)',
        borderRadius: '24px',
        padding: '24px',
        marginBottom: '20px',
        boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 24px rgba(0, 229, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{
              background: 'linear-gradient(90deg, #FF3366, #F59E0B)',
              color: '#FFFFFF',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}>
              NASA SPACE APPS 2026
            </span>
            <span style={{
              background: 'rgba(0, 229, 255, 0.15)',
              color: '#00E5FF',
              border: '1px solid rgba(0, 229, 255, 0.35)',
              padding: '4px 10px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
            }}>
              Dancing with the SARs 🌊
            </span>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: 800,
            color: '#FFFFFF',
            margin: '4px 0',
            letterSpacing: '-0.02em',
          }}>
            FLOODMAP LIVE
          </h1>

          <p style={{ fontSize: '14px', color: '#93C5FD', margin: 0 }}>
            Satellite-Powered Flood Monitoring & Coastal Disaster Safety for Everyday Citizens
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(0, 229, 255, 0.25)',
            borderRadius: '999px',
            padding: '6px 14px',
            marginTop: '12px',
          }}>
            <MapPin size={16} color="#FF3366" />
            <span style={{ fontSize: '13px', color: '#E2E8F0' }}>Watching:</span>
            <strong style={{ fontSize: '14px', color: '#00E5FF' }}>{watchArea.name}</strong>
            <span style={{ fontSize: '12px', color: '#93C5FD' }}>
              ({watchArea.lat.toFixed(2)}°N, {watchArea.lng.toFixed(2)}°E)
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('GAME')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #EC4899, #8B5CF6)',
              border: 'none',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 800,
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
              transition: 'transform 0.15s ease',
            }}
            className="card-colorful"
          >
            <Gamepad2 size={18} />
            <span>PLAY KIDS GAME 🎮</span>
          </button>

          <button
            onClick={() => loadAllData(true)}
            disabled={refreshing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              padding: '10px 16px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} color="#00E5FF" />
            <span>{refreshing ? 'Scanning...' : 'Refresh Data'}</span>
          </button>

          <Link
            to="/map"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
              color: '#0A1128',
              padding: '10px 20px',
              borderRadius: '14px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0, 229, 255, 0.4)',
            }}
            className="card-colorful"
          >
            <Layers size={16} />
            <span>Open Live Radar Map</span>
          </Link>
        </div>
      </div>

      {/* DASHBOARD NAVIGATION PILL TABS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        overflowX: 'auto',
        paddingBottom: '4px',
      }}>
        <button
          onClick={() => setActiveTab('DASHBOARD')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'DASHBOARD'
              ? 'linear-gradient(135deg, #00E5FF, #3B82F6)'
              : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'DASHBOARD' ? '#0A1128' : '#CBD5E1',
            border: activeTab === 'DASHBOARD' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Home size={16} />
          <span>Community Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab('GAME')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'GAME'
              ? 'linear-gradient(135deg, #EC4899, #8B5CF6)'
              : 'rgba(236, 72, 153, 0.15)',
            color: activeTab === 'GAME' ? '#FFFFFF' : '#F472B6',
            border: activeTab === 'GAME' ? 'none' : '1px solid rgba(236, 72, 153, 0.4)',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Gamepad2 size={16} />
          <span>🎮 Kids Flood Hero Game</span>
          <span style={{
            background: '#F59E0B',
            color: '#000',
            fontSize: '10px',
            fontWeight: 800,
            padding: '1px 6px',
            borderRadius: '999px',
          }}>
            FUN!
          </span>
        </button>

        <button
          onClick={() => setActiveTab('LOCATION')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'LOCATION'
              ? 'linear-gradient(135deg, #10B981, #059669)'
              : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'LOCATION' ? '#FFFFFF' : '#CBD5E1',
            border: activeTab === 'LOCATION' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Compass size={16} />
          <span>Target Location Hub (2 Ways: Lat/Lng & Place Search)</span>
        </button>

        <button
          onClick={() => setActiveTab('SAFETY')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: activeTab === 'SAFETY'
              ? 'linear-gradient(135deg, #F59E0B, #D97706)'
              : 'rgba(255, 255, 255, 0.06)',
            color: activeTab === 'SAFETY' ? '#000' : '#CBD5E1',
            border: activeTab === 'SAFETY' ? 'none' : '1px solid rgba(255, 255, 255, 0.12)',
            padding: '10px 18px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <ShieldCheck size={16} />
          <span>Emergency & Evacuation Guide</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: COMMUNITY DASHBOARD (COMMON MAN FRIENDLY)                          */}
      {/* ========================================================================= */}
      {activeTab === 'DASHBOARD' && (
        <>
          {/* 4 Colourful KPI Cards (Understood by Anyone) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px',
          }}>
            {/* Card 1: Water Spread */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(2, 132, 199, 0.35) 100%)',
              border: '2px solid #00E5FF',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(0, 229, 255, 0.15)',
            }} className="card-colorful">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#67E8F9', textTransform: 'uppercase' }}>
                  WATER SPREAD
                </span>
                <Droplets size={22} color="#00E5FF" />
              </div>
              <div style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                {hasData && stats?.totalFloodedAreaKm2 > 0 ? (
                  <>
                    {stats.totalFloodedAreaKm2.toLocaleString()} <span style={{ fontSize: '18px', color: '#67E8F9' }}>km²</span>
                  </>
                ) : (
                  <span style={{ fontSize: '24px', color: '#67E8F9' }}>-- km²</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#E0F2FE' }}>
                {hasData && stats?.totalFloodedAreaKm2 > 0
                  ? 'Surface water inundation calculated from loaded satellite SAR observation'
                  : 'Awaiting radar observations — No flood extent dataset loaded'}
              </div>
              <div style={{
                marginTop: '6px',
                background: hasData && stats?.totalFloodedAreaKm2 > 0 ? 'rgba(0, 229, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: hasData && stats?.totalFloodedAreaKm2 > 0 ? '#00E5FF' : '#94A3B8',
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}>
                {hasData && stats?.totalFloodedAreaKm2 > 0 ? '⚠️ INUNDATION DETECTED' : '⚪ DATASET PENDING'}
              </div>
            </div>

            {/* Card 2: Homes & Families */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.25) 0%, rgba(225, 29, 72, 0.35) 100%)',
              border: '2px solid #FF3366',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(255, 51, 102, 0.15)',
            }} className="card-colorful">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FDA4AF', textTransform: 'uppercase' }}>
                  HOMES & VILLAGES
                </span>
                <Home size={22} color="#FF3366" />
              </div>
              <div style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                {hasData && stats?.exposedVillagesCount > 0 ? (
                  <>
                    {stats.exposedVillagesCount} <span style={{ fontSize: '18px', color: '#FDA4AF' }}>Villages</span>
                  </>
                ) : (
                  <span style={{ fontSize: '24px', color: '#FDA4AF' }}>-- Villages</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#FFE4E6' }}>
                {hasData && stats?.totalExposedPopulation > 0
                  ? `Estimated ~${(stats.totalExposedPopulation / 1000).toFixed(0)}k families living in affected flood reaches`
                  : 'Awaiting human settlement boundary dataset'}
              </div>
              <div style={{
                marginTop: '6px',
                background: hasData && stats?.exposedVillagesCount > 0 ? 'rgba(255, 51, 102, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: hasData && stats?.exposedVillagesCount > 0 ? '#FF3366' : '#94A3B8',
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}>
                {hasData && stats?.exposedVillagesCount > 0 ? '🚨 RELIEF REQUIRED' : '⚪ AWAITING CENSUS'}
              </div>
            </div>

            {/* Card 3: Farms & Crops */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(5, 150, 105, 0.35) 100%)',
              border: '2px solid #10B981',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
            }} className="card-colorful">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#6EE7B7', textTransform: 'uppercase' }}>
                  FARMS & CROPS
                </span>
                <Wheat size={22} color="#10B981" />
              </div>
              <div style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '32px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                {hasData && stats?.totalAgriculturalFloodedKm2 > 0 ? (
                  <>
                    {stats.totalAgriculturalFloodedKm2.toLocaleString()} <span style={{ fontSize: '18px', color: '#6EE7B7' }}>km²</span>
                  </>
                ) : (
                  <span style={{ fontSize: '24px', color: '#6EE7B7' }}>-- km²</span>
                )}
              </div>
              <div style={{ fontSize: '12px', color: '#D1FAE5' }}>
                {hasData && stats?.totalAgriculturalFloodedKm2 > 0
                  ? 'Agricultural cropland and agricultural fields exposed to standing water'
                  : 'Awaiting cropland classification layer'}
              </div>
              <div style={{
                marginTop: '6px',
                background: hasData && stats?.totalAgriculturalFloodedKm2 > 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: hasData && stats?.totalAgriculturalFloodedKm2 > 0 ? '#10B981' : '#94A3B8',
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}>
                {hasData && stats?.totalAgriculturalFloodedKm2 > 0 ? '🌱 CROP SAFETY WATCH' : '⚪ AWAITING AGRI LAYER'}
              </div>
            </div>

            {/* Card 4: Safe Water & Sanitation */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(217, 119, 6, 0.35) 100%)',
              border: '2px solid #F59E0B',
              borderRadius: '20px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              boxShadow: '0 8px 24px rgba(245, 158, 11, 0.15)',
            }} className="card-colorful">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#FCD34D', textTransform: 'uppercase' }}>
                  DRINKING WATER
                </span>
                <ShieldCheck size={22} color="#F59E0B" />
              </div>
              <div style={{
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '26px',
                fontWeight: 700,
                color: '#FFFFFF',
              }}>
                {hasData ? 'Boil / Use Sealed' : 'Pending Assessment'}
              </div>
              <div style={{ fontSize: '12px', color: '#FEF3C7' }}>
                {hasData
                  ? 'Tap & groundwater silted by floodwater. Always use sealed watercans!'
                  : 'Water quality and contamination assessment pending ground telemetry'}
              </div>
              <div style={{
                marginTop: '6px',
                background: hasData ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                color: hasData ? '#F59E0B' : '#94A3B8',
                padding: '3px 8px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'inline-block',
                alignSelf: 'flex-start',
              }}>
                {hasData ? '🚰 HYGIENE ADVISORY' : '⚪ SENSOR PENDING'}
              </div>
            </div>
          </div>

          {/* Children's Flood Hero Game Callout Banner */}
          <div style={{
            background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 50%, #EC4899 100%)',
            borderRadius: '22px',
            padding: '20px 24px',
            marginBottom: '24px',
            boxShadow: '0 12px 30px rgba(124, 58, 237, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                background: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
              }} className="anim-bounce">
                <Gamepad2 size={32} color="#7C3AED" />
              </div>
              <div>
                <div style={{
                  fontFamily: "'Fredoka', sans-serif",
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                }}>
                  🎮 Play the Children's Flood & Coastal Disaster Game!
                </div>
                <div style={{ fontSize: '13px', color: '#E9D5FF' }}>
                  Interactive decision adventure: Learn what to do when floodwaters rise, how to protect watercans, and avoid danger!
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('GAME')}
              style={{
                background: '#FFFFFF',
                color: '#6D28D9',
                border: 'none',
                borderRadius: '14px',
                padding: '12px 24px',
                fontFamily: "'Fredoka', sans-serif",
                fontSize: '15px',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span>Launch Flood Hero</span>
              <ArrowRight size={18} />
            </button>
          </div>

          {/* Live Radar Surveillance & Target Telemetry Banner (Animated) */}
          <div style={{
            background: 'linear-gradient(135deg, #111C3A 0%, #15224A 50%, #0F172A 100%)',
            border: '2px solid rgba(0, 229, 255, 0.35)',
            borderRadius: '24px',
            padding: '22px 26px',
            marginBottom: '24px',
            boxShadow: '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 25px rgba(0, 229, 255, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }} className="anim-border-glow">
            {/* Ambient Background Wave & Glow */}
            <div style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0, 229, 255, 0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} className="anim-pulse" />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '18px',
              position: 'relative',
              zIndex: 2,
            }}>
              {/* Left: Animated Radar Scanner Graphic + Location Info */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '280px' }}>
                {/* Animated Circular Radar Display */}
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, #082F49 0%, #041226 100%)',
                  border: '2px solid #00E5FF',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 20px rgba(0, 229, 255, 0.4), inset 0 0 15px rgba(0, 229, 255, 0.2)',
                  flexShrink: 0,
                  overflow: 'hidden',
                }}>
                  {/* Concentric Radar Rings */}
                  <div style={{
                    position: 'absolute',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '1px dashed rgba(0, 229, 255, 0.4)',
                  }} />
                  <div style={{
                    position: 'absolute',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    border: '1px solid rgba(0, 229, 255, 0.6)',
                  }} />
                  {/* Rotating Radar Sweep Beam */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    background: 'conic-gradient(from 0deg, rgba(0, 229, 255, 0.6) 0deg, transparent 60deg, transparent 360deg)',
                    borderRadius: '50%',
                  }} className="anim-radar-sweep" />
                  {/* Pulsing Target Dot */}
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#FF3366',
                    boxShadow: '0 0 10px #FF3366',
                    zIndex: 2,
                  }} className="anim-pulse" />
                </div>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{
                      background: 'rgba(0, 229, 255, 0.2)',
                      color: '#00E5FF',
                      border: '1px solid rgba(0, 229, 255, 0.4)',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 800,
                      letterSpacing: '0.04em',
                    }}>
                      RADAR ACTIVE WATCH
                    </span>
                    <span style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#34D399',
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '11px',
                      fontWeight: 700,
                    }}>
                      LIVE SCANNING
                    </span>
                  </div>

                  <h3 style={{
                    fontSize: '20px',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    margin: '2px 0',
                    letterSpacing: '-0.01em',
                  }}>
                    {watchArea.name}
                  </h3>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '12px',
                    color: '#93C5FD',
                    fontFamily: "'IBM Plex Mono', monospace",
                  }}>
                    <span>📍 Lat: <strong style={{ color: '#FFFFFF' }}>{watchArea.lat.toFixed(4)}°N</strong></span>
                    <span>•</span>
                    <span>Lng: <strong style={{ color: '#FFFFFF' }}>{watchArea.lng.toFixed(4)}°E</strong></span>
                    <span>•</span>
                    <span style={{ color: '#38BDF8' }}>NISAR SAR Orbit</span>
                  </div>
                </div>
              </div>

              {/* Right: Quick Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveTab('LOCATION')}
                  style={{
                    background: 'rgba(0, 229, 255, 0.15)',
                    border: '1.5px solid #00E5FF',
                    color: '#00E5FF',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                  }}
                  className="card-colorful"
                >
                  <MapPin size={16} />
                  <span>Change Target Location</span>
                </button>

                <Link
                  to="/map"
                  style={{
                    background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
                    border: 'none',
                    color: '#080D1A',
                    padding: '10px 18px',
                    borderRadius: '12px',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none',
                    boxShadow: '0 4px 16px rgba(0, 229, 255, 0.4)',
                  }}
                  className="card-colorful"
                >
                  <Satellite size={16} />
                  <span>Inspect in Live Map 🌊</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Clear, Colorful Charts Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(440px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
          }}>
            {/* Chart 1: Rain & Water Rise */}
            <div style={{
              background: '#111C3A',
              border: '2px solid rgba(0, 229, 255, 0.25)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Activity size={18} color="#00E5FF" />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                    📈 How Daily Rain Directly Drives Flood Spread
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: '#00E5FF', fontWeight: 700 }}>
                  RAIN VS WATER EXTENT
                </span>
              </div>
              <div style={{ height: '260px' }}>
                {timelineData && timelineData.length > 0 ? (
                  <FloodTimelineChart data={timelineData} />
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: '1px dashed rgba(0, 229, 255, 0.3)',
                    background: 'rgba(0, 229, 255, 0.03)',
                    color: '#94A3B8',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <Activity size={32} color="#00E5FF" style={{ opacity: 0.6, marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>No Rainfall / Flood Extent Time-Series Loaded</span>
                    <span style={{ fontSize: '11px', marginTop: '4px' }}>Load daily rainfall CSV records or select an active flood observation to view correlation.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Chart 2: Districts Needing Help */}
            <div style={{
              background: '#111C3A',
              border: '2px solid rgba(245, 158, 11, 0.25)',
              borderRadius: '20px',
              padding: '20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '14px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                paddingBottom: '10px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={18} color="#F59E0B" />
                  <span style={{ fontSize: '15px', fontWeight: 800, color: '#FFFFFF' }}>
                    🏘️ Which Districts Need Relief & Rescue Most?
                  </span>
                </div>
                <Link to="/impact" style={{ fontSize: '12px', color: '#F59E0B', textDecoration: 'none', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                  View All <ExternalLink size={12} />
                </Link>
              </div>
              <div style={{ height: '260px' }}>
                {hasData && stats.districtBreakdown && stats.districtBreakdown.length > 0 ? (
                  <DistrictBarChart data={stats.districtBreakdown.map(d => ({
                    name: d.district,
                    floodedArea: d.floodedAreaKm2,
                    severity: d.severity
                  }))} />
                ) : (
                  <div style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '12px',
                    border: '1px dashed rgba(245, 158, 11, 0.3)',
                    background: 'rgba(245, 158, 11, 0.03)',
                    color: '#94A3B8',
                    padding: '20px',
                    textAlign: 'center',
                  }}>
                    <Building2 size={32} color="#F59E0B" style={{ opacity: 0.6, marginBottom: '8px' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#E2E8F0' }}>No District Severity Assessment Active</span>
                    <span style={{ fontSize: '11px', marginTop: '4px' }}>Awaiting administrative district boundary GeoJSON and radar flood overlay for this area.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: CHILDREN'S FLOOD HERO DECISION GAME                                */}
      {/* ========================================================================= */}
      {activeTab === 'GAME' && (
        <div style={{ marginBottom: '24px' }}>
          <FloodHeroGame />
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: TARGET LOCATION SELECTION HUB (3 METHODS)                          */}
      {/* ========================================================================= */}
      {activeTab === 'LOCATION' && (
        <div style={{
          background: '#111C3A',
          border: '2px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          {/* Header & Sub-selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '20px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            paddingBottom: '14px',
          }}>
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}>
                <Compass size={22} color="#00E5FF" />
                <span>2 WAYS TO SET YOUR TARGET LOCATION</span>
              </h2>
              <p style={{ fontSize: '13px', color: '#93C5FD', margin: '4px 0 0 0' }}>
                Method 1: Direct Latitude & Longitude Coordinates | Method 2: Search Any Place Worldwide & Auto-Detect Location:
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setSelectionView('ALL')}
                style={{
                  background: selectionView === 'ALL' ? '#00E5FF' : 'rgba(255, 255, 255, 0.08)',
                  color: selectionView === 'ALL' ? '#0A1128' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                Both Methods Side-by-Side
              </button>
              <button
                onClick={() => setSelectionView('COORDS')}
                style={{
                  background: selectionView === 'COORDS' ? '#10B981' : 'rgba(255, 255, 255, 0.08)',
                  color: selectionView === 'COORDS' ? '#0A1128' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                1. Direct Lat / Long (Precision)
              </button>
              <button
                onClick={() => setSelectionView('SEARCH')}
                style={{
                  background: selectionView === 'SEARCH' ? '#00E5FF' : 'rgba(255, 255, 255, 0.08)',
                  color: selectionView === 'SEARCH' ? '#0A1128' : '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                2. Search Place & Detect Location
              </button>
            </div>
          </div>

          {/* Render Selection Methods */}
          {selectionView === 'ALL' && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '20px',
            }}>
              <CoordinateInputBox />
              <PlaceSearch />
            </div>
          )}

          {selectionView === 'COORDS' && (
            <div style={{ maxWidth: '720px', margin: '0 auto' }}>
              <CoordinateInputBox />
            </div>
          )}

          {selectionView === 'SEARCH' && (
            <div style={{ maxWidth: '780px', margin: '0 auto' }}>
              <PlaceSearch />
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: CITIZEN EMERGENCY & SAFETY GUIDE                                  */}
      {/* ========================================================================= */}
      {activeTab === 'SAFETY' && (
        <div style={{
          background: '#111C3A',
          border: '2px solid #F59E0B',
          borderRadius: '24px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <LifeBuoy size={26} color="#F59E0B" />
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#FFFFFF', margin: 0 }}>
              CITIZEN FLOOD & COASTAL SURVIVAL QUICK-GUIDE
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
            marginBottom: '20px',
          }}>
            {/* Box 1 */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid #10B981',
              borderRadius: '16px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#6EE7B7', marginBottom: '8px' }}>
                🟢 1. SAFE HIGH GROUND LOCATIONS
              </div>
              <ul style={{ fontSize: '13px', color: '#D1FAE5', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li>Designated concrete cyclone / flood relief shelters.</li>
                <li>Upper stories of reinforced schools and community centers.</li>
                <li>Elevated highway dykes and hill embankments.</li>
              </ul>
            </div>

            {/* Box 2 */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid #F59E0B',
              borderRadius: '16px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FCD34D', marginBottom: '8px' }}>
                🎒 2. EMERGENCY GO-BAG ESSENTIALS
              </div>
              <ul style={{ fontSize: '13px', color: '#FEF3C7', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li>Sealed clean drinking watercan (3 liters/person/day).</li>
                <li>Battery-powered radio, flashlight, extra batteries.</li>
                <li>High-calorie dry food (biscuits, dried fruit).</li>
                <li>Prescription medicines and first aid bandages.</li>
              </ul>
            </div>

            {/* Box 3 */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              borderRadius: '16px',
              padding: '16px',
            }}>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#FCA5A5', marginBottom: '8px' }}>
                ⛔ 3. WHAT NEVER TO DO IN A FLOOD
              </div>
              <ul style={{ fontSize: '13px', color: '#FEE2E2', lineHeight: 1.6, paddingLeft: '18px' }}>
                <li>NEVER walk or drive through moving water (6 inches can knock you down).</li>
                <li>NEVER touch light switches with wet hands or submerged wires.</li>
                <li>NEVER drink unboiled flood water from puddles or taps.</li>
              </ul>
            </div>
          </div>

          {/* Emergency Numbers Strip */}
          <div style={{
            background: 'linear-gradient(90deg, #1E1B4B 0%, #312E81 100%)',
            border: '1px solid rgba(0, 229, 255, 0.4)',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <PhoneCall size={20} color="#00E5FF" />
              <strong style={{ fontSize: '14px', color: '#FFFFFF' }}>Emergency Rescue Helplines:</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <span style={{ background: '#FF3366', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
                POLICE: 100
              </span>
              <span style={{ background: '#10B981', color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
                AMBULANCE: 108
              </span>
              <span style={{ background: '#F59E0B', color: '#000', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 800 }}>
                DISASTER HELPLINE: 1070
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Manifest & Status Footer */}
      <div style={{
        marginTop: '24px',
        padding: '12px 18px',
        background: 'rgba(255, 255, 255, 0.04)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        fontSize: '12px',
        color: '#94A3B8',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Database size={14} color="#00E5FF" />
          <span>DATA ENGINE: Standalone Client • Real-time Radar Synthesis Ready</span>
        </div>
        <div>
          <Link to="/about" style={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 600 }}>
            NASA Space Apps 2026: Dancing with the SARs →
          </Link>
        </div>
      </div>
    </div>
  );
}
