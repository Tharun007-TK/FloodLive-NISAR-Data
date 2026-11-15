import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const SEVERITY_COLORS = {
  CRITICAL: '#FF5252',
  HIGH: '#FFB547',
  MODERATE: '#438BFF',
  LOW: '#35D39A',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#101827',
      border: '1px solid rgba(67,139,255,0.25)',
      borderRadius: '6px',
      padding: '10px 14px',
      fontSize: '12px',
      color: '#F2F6FC',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <div style={{ color: '#8B9AAF', marginBottom: '4px', fontSize: '11px' }}>{d.name}</div>
      <div style={{ color: SEVERITY_COLORS[d.severity] || '#438BFF' }}>
        {d.floodedArea?.toLocaleString()} km²
      </div>
      {d.severity && (
        <div style={{ color: '#8B9AAF', fontSize: '10px', marginTop: '2px' }}>
          Severity: {d.severity}
        </div>
      )}
    </div>
  );
};

const truncateName = (name, maxLen = 18) =>
  name.length > maxLen ? name.slice(0, maxLen - 1) + '…' : name;

const DistrictBarChart = ({ data = [] }) => {
  const sorted = [...data].sort((a, b) => b.floodedArea - a.floodedArea).slice(0, 10);

  return (
    <div style={{ background: '#141F30', borderRadius: '8px', padding: '12px 8px 8px 0', height: '280px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={sorted}
          margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.05)" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fill: '#8B9AAF', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
          />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fill: '#F2F6FC', fontSize: 11, fontFamily: 'Inter, sans-serif' }}
            axisLine={false}
            tickLine={false}
            width={130}
            tickFormatter={truncateName}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="floodedArea" radius={[0, 3, 3, 0]} isAnimationActive animationDuration={1000}>
            {sorted.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SEVERITY_COLORS[entry.severity] || '#438BFF'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistrictBarChart;
