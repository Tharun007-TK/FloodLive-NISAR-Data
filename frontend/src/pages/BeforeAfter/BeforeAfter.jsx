import React from 'react';
import ComparisonView from '../LiveMap/ComparisonView';
import DisclaimerBanner from '../../components/common/DisclaimerBanner';

export default function BeforeAfter() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#080D18' }}>
      <DisclaimerBanner message="BITEMPORAL RADAR COMPARISON — DRAG SLIDER TO REVEAL SPECULAR BACKSCATTER DIFFERENCE BETWEEN BASELINE & PEAK INUNDATION" />
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <ComparisonView />
      </div>
    </div>
  );
}
