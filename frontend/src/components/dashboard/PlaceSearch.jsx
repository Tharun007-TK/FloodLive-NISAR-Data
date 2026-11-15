import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Compass, CheckCircle2, AlertCircle, X, Sparkles, Loader2, Globe, Crosshair } from 'lucide-react';
import { useWatchArea } from '../../context/LocationContext';

// Rich pre-indexed flood & coastal surveillance hotspots for instant, zero-latency selection
const INSTANT_LOCATIONS = [
  { name: 'Brahmaputra Basin (Assam, India)', lat: 26.2006, lng: 92.9376, region: 'Asia / South Asia', type: 'River Basin' },
  { name: 'Nagaon District (Assam, India)', lat: 26.3456, lng: 92.6842, region: 'Assam, India', type: 'High Risk' },
  { name: 'Morigaon District (Assam, India)', lat: 26.2573, lng: 92.3432, region: 'Assam, India', type: 'High Risk' },
  { name: 'Dhemaji District (Assam, India)', lat: 27.4812, lng: 94.5772, region: 'Assam, India', type: 'Flood Prone' },
  { name: 'Barpeta District (Assam, India)', lat: 26.3218, lng: 91.0065, region: 'Assam, India', type: 'Flood Prone' },
  { name: 'Sylhet Division (Bangladesh)', lat: 24.8949, lng: 91.8687, region: 'Bangladesh', type: 'River Flood' },
  { name: 'Dhaka Megacity (Bangladesh)', lat: 23.8103, lng: 90.4125, region: 'Bangladesh', type: 'Monsoon Flood' },
  { name: 'Jakarta Coastal Lowlands (Indonesia)', lat: -6.2088, lng: 106.8456, region: 'Southeast Asia', type: 'Coastal Sinking' },
  { name: 'Manila Bay & Pasig River (Philippines)', lat: 14.5995, lng: 120.9842, region: 'Southeast Asia', type: 'Typhoon Surge' },
  { name: 'Bangkok Chao Phraya Delta (Thailand)', lat: 13.7563, lng: 100.5018, region: 'Southeast Asia', type: 'Delta Flood' },
  { name: 'Venice Lagoon & MOSE (Italy)', lat: 45.4408, lng: 12.3155, region: 'Southern Europe', type: 'Aqua Alta Tidal' },
  { name: 'London Thames Barrier (United Kingdom)', lat: 51.4977, lng: 0.0366, region: 'Western Europe', type: 'Estuary Surge' },
  { name: 'Rhine-Meuse Delta (Rotterdam, Netherlands)', lat: 51.9244, lng: 4.4777, region: 'North Sea Coast', type: 'Storm Barrier' },
  { name: 'New Orleans & Pontchartrain (Louisiana, USA)', lat: 29.9511, lng: -90.0715, region: 'Gulf Coast USA', type: 'Hurricane Levee' },
  { name: 'Miami Beach Coastal Shelf (Florida, USA)', lat: 25.7617, lng: -80.1918, region: 'Atlantic Coast USA', type: 'King Tide Surge' },
  { name: 'Houston Buffalo Bayou (Texas, USA)', lat: 29.7604, lng: -95.3698, region: 'Gulf Coast USA', type: 'Flash Inundation' },
  { name: 'Tokyo Bay Underground Cisterns (Japan)', lat: 35.6762, lng: 139.6503, region: 'East Asia', type: 'Tsunami & Rain' },
  { name: 'Kerala Backwaters & Periyar (India)', lat: 9.9312, lng: 76.2673, region: 'South India', type: 'Dam Inundation' },
  { name: 'Mumbai Mithi River Basin (India)', lat: 19.0760, lng: 72.8777, region: 'West Coast India', type: 'Monsoon High Tide' },
  { name: 'Chennai Adyar & Cooum Rivers (India)', lat: 13.0827, lng: 80.2707, region: 'East Coast India', type: 'Cyclone Surge' },
  { name: 'Brisbane River Catchment (Australia)', lat: -27.4705, lng: 153.0260, region: 'Queensland, Australia', type: 'River Inundation' },
];

export default function PlaceSearch() {
  const { watchArea, updateWatchArea } = useWatchArea();
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectionMessage, setDetectionMessage] = useState(null);
  const [recentPicks, setRecentPicks] = useState([]);
  const debounceTimerRef = useRef(null);
  const justSelectedRef = useRef(false);

  // Live place geocoding search using Nominatim + local hotspot matcher
  useEffect(() => {
    if (justSelectedRef.current) {
      justSelectedRef.current = false;
      return;
    }

    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const trimmed = query.trim().toLowerCase();

    // 1. Instant local matches first
    const localMatches = INSTANT_LOCATIONS.filter(loc =>
      loc.name.toLowerCase().includes(trimmed) ||
      loc.region.toLowerCase().includes(trimmed) ||
      loc.type.toLowerCase().includes(trimmed)
    ).map(loc => ({
      name: loc.name,
      displayName: `${loc.name} • ${loc.region}`,
      lat: loc.lat,
      lng: loc.lng,
      source: 'local_catalog',
      type: loc.type,
      badge: '⚡ INSTANT MATCH',
    }));

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set instant local matches immediately
    if (localMatches.length > 0) {
      setSuggestions(localMatches);
    }

    // 2. Fetch live global geocoding from OpenStreetMap Nominatim for any place on Earth
    debounceTimerRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`
        );
        if (res.ok) {
          const remoteResults = await res.json();
          const formattedRemote = remoteResults.map(r => ({
            name: r.name || r.display_name.split(',')[0],
            displayName: r.display_name,
            lat: parseFloat(r.lat),
            lng: parseFloat(r.lon),
            source: 'live_geocoding',
            type: r.type || 'Location',
            badge: '🌐 GLOBAL GEODATA',
          }));

          // Merge without exact duplicates
          const seen = new Set();
          const combined = [];
          for (const item of [...localMatches, ...formattedRemote]) {
            const key = `${item.lat.toFixed(3)},${item.lng.toFixed(3)}`;
            if (!seen.has(key)) {
              seen.add(key);
              combined.push(item);
            }
          }
          setSuggestions(combined.slice(0, 8));
        }
      } catch (err) {
        console.warn('Geocoding search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Select place handler
  function handleSelectPlace(place) {
    justSelectedRef.current = true;
    updateWatchArea({
      name: place.name,
      lat: place.lat,
      lng: place.lng,
      source: 'place_search',
      details: place.displayName || `Detected coordinates: ${place.lat.toFixed(4)}°N, ${place.lng.toFixed(4)}°E`,
    });

    setQuery(place.name);
    setSuggestions([]);
    setDetectionMessage({
      type: 'success',
      text: `Target watch area locked to ${place.name} (${place.lat.toFixed(2)}°, ${place.lng.toFixed(2)}°)`,
    });

    // Save to recents
    setRecentPicks(prev => {
      const filtered = prev.filter(p => p.name !== place.name);
      return [place, ...filtered].slice(0, 4);
    });

    setTimeout(() => setDetectionMessage(null), 4000);
  }

  // 1-Click Browser Geolocation detection
  function handleDetectCurrentLocation() {
    if (!navigator.geolocation) {
      setDetectionMessage({ type: 'error', text: 'Geolocation is not supported by your browser.' });
      return;
    }

    setIsDetecting(true);
    setDetectionMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        let detectedName = `Current Location (${lat.toFixed(3)}°, ${lng.toFixed(3)}°)`;
        let detectedAddress = 'Detected via GPS';

        // Try reverse geocoding to get human friendly place name
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          if (revRes.ok) {
            const revData = await revRes.json();
            if (revData && revData.display_name) {
              const parts = revData.display_name.split(',');
              detectedName = parts.slice(0, 2).join(',').trim();
              detectedAddress = revData.display_name;
            }
          }
        } catch (e) {
          console.warn('Reverse geocoding error', e);
        }

        const detectedPlace = {
          name: detectedName,
          lat: lat,
          lng: lng,
          displayName: detectedAddress,
          source: 'gps_device',
          badge: '📍 DEVICE GPS',
        };

        handleSelectPlace(detectedPlace);
        setIsDetecting(false);
      },
      (err) => {
        setIsDetecting(false);
        setDetectionMessage({
          type: 'error',
          text: `Location detection error: ${err.message || 'Permission denied or timed out'}. You can still search by city name above!`,
        });
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(145deg, #101B37 0%, #0F172A 100%)',
      border: '2px solid rgba(0, 229, 255, 0.4)',
      borderRadius: '20px',
      padding: '22px',
      position: 'relative',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.35), 0 0 20px rgba(0, 229, 255, 0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }} className="card-colorful">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00E5FF, #3B82F6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0, 229, 255, 0.35)',
          }}>
            <Search size={22} color="#080D1A" />
          </div>
          <div>
            <h3 style={{
              fontSize: '17px',
              fontWeight: 800,
              color: '#FFFFFF',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <span>Method 2: Search Place & Detect Location</span>
              <Sparkles size={16} color="#00E5FF" />
            </h3>
            <span style={{ fontSize: '12px', color: '#93C5FD' }}>
              Type any city, river basin, district, or coastal area worldwide
            </span>
          </div>
        </div>

        {/* 1-Click Detect My Current Location Button */}
        <button
          onClick={handleDetectCurrentLocation}
          disabled={isDetecting}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, #10B981, #059669)',
            border: 'none',
            color: '#FFFFFF',
            padding: '9px 16px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 800,
            cursor: isDetecting ? 'wait' : 'pointer',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
            transition: 'transform 0.15s ease',
          }}
          className="anim-glow-pulse"
        >
          {isDetecting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Detecting GPS...</span>
            </>
          ) : (
            <>
              <Crosshair size={16} />
              <span>📍 Detect My Location</span>
            </>
          )}
        </button>
      </div>

      {/* Search Input Box */}
      <div style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'rgba(7, 13, 29, 0.85)',
          border: '2px solid rgba(0, 229, 255, 0.3)',
          borderRadius: '14px',
          padding: '4px 14px',
          gap: '10px',
          boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.5)',
        }}>
          <Search size={18} color="#00E5FF" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type city or region (e.g. Nagaon, Jakarta, Sylhet, Venice, Miami)..."
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FFFFFF',
              fontSize: '14px',
              padding: '10px 0',
              fontWeight: 600,
            }}
          />
          {isSearching && <Loader2 size={16} color="#00E5FF" className="animate-spin" />}
          {query && !isSearching && (
            <button
              onClick={() => { setQuery(''); setSuggestions([]); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#94A3B8',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dynamic Search Suggestions Dropdown */}
        {suggestions.length > 0 && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: 0,
            right: 0,
            background: '#0D152D',
            border: '2px solid rgba(0, 229, 255, 0.5)',
            borderRadius: '16px',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.7), 0 0 24px rgba(0, 229, 255, 0.2)',
            zIndex: 60,
            overflow: 'hidden',
            maxHeight: '320px',
            overflowY: 'auto',
          }}>
            <div style={{
              padding: '8px 14px',
              background: 'rgba(0, 229, 255, 0.1)',
              borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
              fontSize: '11px',
              fontWeight: 800,
              color: '#00E5FF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span>CLICK TO LOCK SURVEILLANCE RADAR</span>
              <span>{suggestions.length} PLACES FOUND</span>
            </div>

            {suggestions.map((item, idx) => (
              <div
                key={idx}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelectPlace(item);
                }}
                onClick={() => handleSelectPlace(item)}
                style={{
                  padding: '12px 14px',
                  borderBottom: idx < suggestions.length - 1 ? '1px solid rgba(255, 255, 255, 0.06)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  transition: 'background 0.15s ease',
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 229, 255, 0.15)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MapPin size={18} color="#FF3366" style={{ flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                      {item.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#94A3B8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '380px',
                    }}>
                      {item.displayName}
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 700,
                    background: item.badge?.includes('INSTANT') ? 'rgba(0, 229, 255, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: item.badge?.includes('INSTANT') ? '#00E5FF' : '#93C5FD',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'block',
                    marginBottom: '2px',
                  }}>
                    {item.badge}
                  </span>
                  <span style={{ fontSize: '11px', color: '#6EE7B7', fontWeight: 700 }}>
                    {item.lat.toFixed(2)}°, {item.lng.toFixed(2)}°
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Detection Feedback Alert */}
      {detectionMessage && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 14px',
          borderRadius: '12px',
          fontSize: '12px',
          fontWeight: 700,
          background: detectionMessage.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
          border: detectionMessage.type === 'success' ? '1px solid #10B981' : '1px solid #EF4444',
          color: detectionMessage.type === 'success' ? '#6EE7B7' : '#FCA5A5',
        }}>
          {detectionMessage.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{detectionMessage.text}</span>
        </div>
      )}

      {/* Quick-Pick Popular Flood Basins Chips */}
      <div>
        <div style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#67E8F9',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <Globe size={13} color="#00E5FF" />
          <span>Quick 1-Click Surveillance Presets:</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            { name: 'Nagaon, Assam', lat: 26.3456, lng: 92.6842, color: '#FF3366' },
            { name: 'Sylhet, Bangladesh', lat: 24.8949, lng: 91.8687, color: '#38BDF8' },
            { name: 'Jakarta Delta', lat: -6.2088, lng: 106.8456, color: '#F59E0B' },
            { name: 'Venice Lagoon', lat: 45.4408, lng: 12.3155, color: '#10B981' },
            { name: 'New Orleans', lat: 29.9511, lng: -90.0715, color: '#A855F7' },
            { name: 'Miami Beach', lat: 25.7617, lng: -80.1918, color: '#EC4899' },
          ].map((preset) => (
            <button
              key={preset.name}
              onMouseDown={(e) => {
                e.preventDefault();
                handleSelectPlace({
                  name: preset.name,
                  displayName: `${preset.name} • Monitored Basin`,
                  lat: preset.lat,
                  lng: preset.lng,
                  badge: '🎯 PRESET',
                });
              }}
              onClick={() => handleSelectPlace({
                name: preset.name,
                displayName: `${preset.name} • Monitored Basin`,
                lat: preset.lat,
                lng: preset.lng,
                badge: '🎯 PRESET',
              })}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: `1px solid ${preset.color}`,
                borderRadius: '10px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = preset.color;
                e.currentTarget.style.color = '#000000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                e.currentTarget.style.color = '#FFFFFF';
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: preset.color }} />
              <span>{preset.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Selection Readout */}
      <div style={{
        marginTop: 'auto',
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '12px',
        padding: '10px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Compass size={16} color="#00E5FF" />
          <span style={{ fontSize: '12px', color: '#94A3B8' }}>Active Target:</span>
          <strong style={{ fontSize: '13px', color: '#FFFFFF' }}>{watchArea.name}</strong>
        </div>
        <span style={{
          fontSize: '11px',
          fontWeight: 800,
          color: '#00E5FF',
          background: 'rgba(0, 229, 255, 0.15)',
          padding: '2px 8px',
          borderRadius: '6px',
        }}>
          {watchArea.lat.toFixed(4)}°N, {watchArea.lng.toFixed(4)}°E
        </span>
      </div>
    </div>
  );
}
