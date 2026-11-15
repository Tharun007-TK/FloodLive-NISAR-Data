import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { getVillages } from '../../services/dataService';

export default function LocationSearch({ searchQuery, onSearchChange, onLocationSelect }) {
  const [suggestions, setSuggestions] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    getVillages().then(data => {
      if (!isMounted || !data || !data.geojson || !data.geojson.features) return;
      const list = data.geojson.features.map(f => ({
        id: f.properties.id,
        name: f.properties.name,
        district: f.properties.district,
        population: f.properties.population,
        lat: f.geometry.coordinates[1],
        lng: f.geometry.coordinates[0],
      }));
      setAllLocations(list);
    }).catch(err => console.warn('Could not load locations for search', err));

    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const q = searchQuery.toLowerCase().trim();
    const matches = allLocations.filter(loc =>
      loc.name.toLowerCase().includes(q) ||
      loc.district.toLowerCase().includes(q)
    ).slice(0, 6);

    setSuggestions(matches);
    setIsOpen(matches.length > 0);
  }, [searchQuery, allLocations]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: 260 }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: '#141F30',
        border: '1px solid rgba(0, 213, 255, 0.25)',
        borderRadius: 6,
        padding: '6px 10px',
      }}>
        <Search size={14} color="#00D5FF" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder="Search settlement or district..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: '#F2F6FC',
            fontSize: 12,
            fontFamily: 'Inter, sans-serif',
            width: '100%',
          }}
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8B9AAF',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: 4,
          background: '#101827',
          border: '1px solid rgba(0, 213, 255, 0.25)',
          borderRadius: 6,
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
          zIndex: 2000,
          overflow: 'hidden',
        }}>
          {suggestions.map((loc) => (
            <div
              key={loc.id}
              onClick={() => {
                onLocationSelect(loc);
                setIsOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                transition: 'background 0.15s ease',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0, 213, 255, 0.08)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <MapPin size={13} color="#00D5FF" />
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: '#F2F6FC' }}>
                  {loc.name}
                </div>
                <div style={{ fontSize: 10, color: '#8B9AAF' }}>
                  District: {loc.district} {loc.population ? `• Pop: ${loc.population.toLocaleString()}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
