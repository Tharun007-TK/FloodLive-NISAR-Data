import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LocationProvider } from './context/LocationContext';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const MapPage = lazy(() => import('./pages/Map/MapPage'));
const ImpactAnalysis = lazy(() => import('./pages/ImpactAnalysis/ImpactAnalysis'));
const Observations = lazy(() => import('./pages/Observations/Observations'));
const Method = lazy(() => import('./pages/Method/Method'));
const Export = lazy(() => import('./pages/Export/Export'));

function AppShell({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      backgroundColor: 'var(--surface-bg)',
      color: 'var(--text-primary)'
    }}>
      <Sidebar />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopNav />
        <main style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
          <ErrorBoundary>
            <Suspense fallback={<LoadingScreen />}>
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LocationProvider>
      <BrowserRouter>
        <Routes>
          {/* Core Analyst Views */}
          <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/map" element={<AppShell><MapPage /></AppShell>} />
          <Route path="/impact" element={<AppShell><ImpactAnalysis /></AppShell>} />
          <Route path="/observations" element={<AppShell><Observations /></AppShell>} />
          <Route path="/method" element={<AppShell><Method /></AppShell>} />
          <Route path="/export" element={<AppShell><Export /></AppShell>} />

          {/* Clean Aliases & Backward Compatibility Redirects */}
          <Route path="/compare" element={<Navigate to="/map" replace />} />
          <Route path="/satellite" element={<Navigate to="/observations" replace />} />
          <Route path="/about" element={<Navigate to="/method" replace />} />
          <Route path="/sources" element={<Navigate to="/method" replace />} />
          <Route path="/reports" element={<Navigate to="/export" replace />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LocationProvider>
  );
}
