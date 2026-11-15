import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Cell,
} from 'recharts';

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#101827',
      border: '1px solid rgba(255,181,71,0.25)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: 'IBM Plex Mono, monospace',
      color: '#F2F6FC',
    }}>
      <div style={{ color: '#8B9AAF', marginBottom: '4px' }}>{formatDate(label)}</div>
      <div style={{ color: '#FFB547' }}>Rainfall: {payload[0].value} mm</div>
    </div>
  );
};

const getBarColor = (value) => {
  if (value >= 80) return '#FF5252';
  if (value >= 50) return '#FFB547';
  return '#438BFF';
};

const RainfallChart = ({ data = [], observationDates = [] }) => {
  return (
    <div style={{ background: '#141F30', borderRadius: '8px', padding: '12px 8px 8px 0', height: '200px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: '#8B9AAF', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#8B9AAF', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}mm`}
            width={44}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          {observationDates.map((od) => (
            <ReferenceLine
              key={od}
              x={od}
              stroke="rgba(0,213,255,0.4)"
              strokeDasharray="3 3"
              label={{ value: 'SAR', fill: '#00D5FF', fontSize: 9 }}
            />
          ))}
          <Bar dataKey="rainfall" radius={[2, 2, 0, 0]} isAnimationActive animationDuration={900}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rainfall)} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainfallChart;
