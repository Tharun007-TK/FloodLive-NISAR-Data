import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import TopNav from './components/layout/TopNav';
import LoadingScreen from './components/common/LoadingScreen';
import ErrorBoundary from './components/common/ErrorBoundary';
import { LocationProvider } from './context/LocationContext';

const Dashboard = lazy(() => import('./pages/Dashboard/Dashboard'));
const LiveMap = lazy(() => import('./pages/LiveMap/LiveMap'));
const ImpactAnalysis = lazy(() => import('./pages/ImpactAnalysis/ImpactAnalysis'));
const SatelliteData = lazy(() => import('./pages/SatelliteData/SatelliteData'));
const BeforeAfter = lazy(() => import('./pages/BeforeAfter/BeforeAfter'));
const DataSources = lazy(() => import('./pages/DataSources/DataSources'));
const Reports = lazy(() => import('./pages/Reports/Reports'));
const About = lazy(() => import('./pages/About/About'));

function AppShell({ children }) {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden',
      background: '#080D18',
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
          <Route path="/" element={<AppShell><Dashboard /></AppShell>} />
          <Route path="/map" element={<AppShell><LiveMap /></AppShell>} />
          <Route path="/impact" element={<AppShell><ImpactAnalysis /></AppShell>} />
          <Route path="/satellite" element={<AppShell><SatelliteData /></AppShell>} />
          <Route path="/compare" element={<AppShell><BeforeAfter /></AppShell>} />
          <Route path="/sources" element={<AppShell><DataSources /></AppShell>} />
          <Route path="/reports" element={<AppShell><Reports /></AppShell>} />
          <Route path="/about" element={<AppShell><About /></AppShell>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LocationProvider>
  );
}
