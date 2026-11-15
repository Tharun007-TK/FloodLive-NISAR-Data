import React, { createContext, useContext, useState, useEffect } from 'react';

export const PRESET_BASINS = [
  {
    id: 'brahmaputra',
    name: 'Brahmaputra Basin, Assam',
    country: 'India',
    lat: 26.2487,
    lng: 92.3367,
    zoom: 8,
    description: 'High monsoon flood vulnerability corridor along lower Brahmaputra reaches.',
    river: 'Brahmaputra River',
  },
  {
    id: 'indus',
    name: 'Indus River Basin, Sindh',
    country: 'Pakistan',
    lat: 27.5000,
    lng: 68.5000,
    zoom: 8,
    description: 'Critical downstream flood basin subject to mega-monsoon inundation.',
    river: 'Indus River',
  },
  {
    id: 'ganges',
    name: 'Ganges-Padma Delta',
    country: 'Bangladesh',
    lat: 23.8103,
    lng: 90.4125,
    zoom: 8,
    description: 'Low-lying delta confluence prone to tidal and riverine flooding.',
    river: 'Padma / Meghna',
  },
  {
    id: 'mekong',
    name: 'Mekong River Delta',
    country: 'Vietnam',
    lat: 10.0333,
    lng: 105.7833,
    zoom: 9,
    description: 'Vast agricultural rice basket impacted by seasonal wet-season pulses.',
    river: 'Mekong River',
  },
  {
    id: 'mississippi',
    name: 'Lower Mississippi Delta',
    country: 'United States',
    lat: 29.9511,
    lng: -90.0715,
    zoom: 8,
    description: 'Gulf coast alluvial outlet susceptible to storm surge and basin runoff.',
    river: 'Mississippi River',
  },
  {
    id: 'amazon',
    name: 'Amazon Floodplain (Manaus)',
    country: 'Brazil',
    lat: -3.1190,
    lng: -60.0217,
    zoom: 8,
    description: 'Extensive seasonal várzea inundation of the central Amazon basin.',
    river: 'Amazon River',
  },
];

const LocationContext = createContext(null);

export function LocationProvider({ children }) {
  // Load initial watch area from localStorage or fallback to Brahmaputra default
  const [watchArea, setWatchArea] = useState(() => {
    try {
      const saved = localStorage.getItem('floodmap_watch_area');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse saved watch area', e);
    }
    return {
      name: 'Brahmaputra Floodplain, Assam',
      country: 'India',
      lat: 26.2487,
      lng: 92.3367,
      zoom: 8,
      source: 'preset',
      details: 'Default study area for NASA Space Apps 2026 challenge',
    };
  });

  // Google Maps API Key state (saved in localStorage or from VITE_GOOGLE_MAPS_API_KEY)
  const [googleApiKey, setGoogleApiKeyState] = useState(() => {
    return (
      localStorage.getItem('floodmap_google_maps_api_key') ||
      import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
      ''
    );
  });

  // Save to localStorage when updated
  useEffect(() => {
    try {
      localStorage.setItem('floodmap_watch_area', JSON.stringify(watchArea));
    } catch (e) {
      console.warn('Could not save watch area to localStorage', e);
    }
  }, [watchArea]);

  const updateWatchArea = (newArea) => {
    setWatchArea((prev) => ({
      ...prev,
      ...newArea,
      lat: Number(Number(newArea.lat).toFixed(4)),
      lng: Number(Number(newArea.lng).toFixed(4)),
      updatedAt: new Date().toISOString(),
    }));
  };

  const setGoogleApiKey = (key) => {
    const cleanKey = (key || '').trim();
    setGoogleApiKeyState(cleanKey);
    if (cleanKey) {
      localStorage.setItem('floodmap_google_maps_api_key', cleanKey);
    } else {
      localStorage.removeItem('floodmap_google_maps_api_key');
    }
  };

  return (
    <LocationContext.Provider
      value={{
        watchArea,
        updateWatchArea,
        googleApiKey,
        setGoogleApiKey,
        presetBasins: PRESET_BASINS,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useWatchArea() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useWatchArea must be used within a LocationProvider');
  }
  return context;
}
