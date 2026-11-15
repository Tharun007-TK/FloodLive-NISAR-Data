import React, { createContext, useContext, useState, useEffect } from 'react';

export const VERIFIED_EVENTS = [
  {
    id: 'assam-2026-july',
    name: 'Central Assam Flood (July 2026)',
    aoiName: 'Brahmaputra Basin (Morigaon-Nagaon-Kamrup)',
    region: 'Assam, India',
    track: 91,
    frame: 75,
    passDirection: 'DESCENDING',
    tier: 'PROVISIONAL',
    preDate: '2026-07-02',
    postDate: '2026-07-26',
    preGranuleId: 'NISAR_L2_PR_GCOV_024_091_D_075_4005_DHDH_A_20260702T123350_20260702T123424_P05023_N_F_J_001',
    postGranuleId: 'NISAR_L2_PR_GCOV_026_091_D_075_4005_DHDH_A_20260726T123348_20260726T123423_P05023_N_F_J_001',
    center: [26.35, 92.45],
    zoom: 9,
    bbox: [90.25, 25.42, 93.44, 28.15],
    defaultJobId: '3167914d070ff49b'
  }
];

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  // Theme state: defaults to light theme per specification
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('floodmap_theme') || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('floodmap_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Active event & job
  const [activeEvent, setActiveEvent] = useState(VERIFIED_EVENTS[0]);
  const [activeJobId, setActiveJobId] = useState(VERIFIED_EVENTS[0].defaultJobId);
  const [selectedFeature, setSelectedFeature] = useState(null);

  // Map layer controls
  const [layers, setLayers] = useState({
    floodExtent: true,
    floodedVeg: true,
    permanentWater: false,
    settlements: true,
    districts: true,
    baseMap: 'osm' // osm, satellite, topo
  });

  const [opacity, setOpacity] = useState({
    floodExtent: 0.85,
    floodedVeg: 0.75
  });

  const toggleLayer = (key) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const setBaseMap = (baseMapType) => {
    setLayers(prev => ({ ...prev, baseMap: baseMapType }));
  };

  const setLayerOpacity = (key, val) => {
    setOpacity(prev => ({ ...prev, [key]: val }));
  };

  return (
    <LocationContext.Provider
      value={{
        theme,
        toggleTheme,
        activeEvent,
        setActiveEvent,
        activeJobId,
        setActiveJobId,
        selectedFeature,
        setSelectedFeature,
        layers,
        toggleLayer,
        setBaseMap,
        opacity,
        setLayerOpacity,
        verifiedEvents: VERIFIED_EVENTS
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocationContext must be used within LocationProvider');
  return ctx;
}

export const useWatchArea = useLocationContext;
