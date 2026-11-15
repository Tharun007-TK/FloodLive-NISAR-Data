import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from 'recharts';

const COLORS = {
  primary: '#438BFF',
  secondary: '#FFB547',
  grid: 'rgba(255,255,255,0.05)',
  bg: '#141F30',
  text: '#F2F6FC',
  muted: '#8B9AAF',
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{
      background: '#101827',
      border: '1px solid rgba(67,139,255,0.3)',
      borderRadius: '6px',
      padding: '10px 14px',
      fontSize: '12px',
      color: '#F2F6FC',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <div style={{ color: '#8B9AAF', marginBottom: '6px' }}>{formatDate(label)}</div>
      {payload.map((entry) => (
        <div key={entry.dataKey} style={{ color: entry.color, marginBottom: '2px' }}>
          {entry.dataKey === 'floodedArea'
            ? `Flooded Area: ${entry.value.toLocaleString()} km²`
            : `Rainfall: ${entry.value} mm`}
        </div>
      ))}
    </div>
  );
};

const FloodTimelineChart = ({ data = [] }) => {
  return (
    <div style={{ background: COLORS.bg, borderRadius: '8px', padding: '16px 8px 8px 0', height: '280px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
          <defs>
            <linearGradient id="floodGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#438BFF" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#438BFF" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#FFB547" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#FFB547" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke={COLORS.grid} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={{ stroke: 'rgba(255,255,255,0.08)' }}
            tickLine={false}
          />
          <YAxis
            yAxisId="area"
            tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(1)}k`}
            width={48}
          />
          {data[0]?.rainfall !== undefined && (
            <YAxis
              yAxisId="rain"
              orientation="right"
              tick={{ fill: COLORS.muted, fontSize: 11, fontFamily: 'IBM Plex Mono, monospace' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}mm`}
              width={48}
            />
          )}
          <Tooltip content={<CustomTooltip />} />
          <Area
            yAxisId="area"
            type="monotone"
            dataKey="floodedArea"
            stroke={COLORS.primary}
            strokeWidth={2}
            fill="url(#floodGrad)"
            dot={false}
            activeDot={{ r: 4, fill: COLORS.primary }}
            isAnimationActive={true}
            animationDuration={1200}
          />
          {data[0]?.rainfall !== undefined && (
            <Area
              yAxisId="rain"
              type="monotone"
              dataKey="rainfall"
              stroke={COLORS.secondary}
              strokeWidth={1.5}
              fill="url(#rainGrad)"
              dot={false}
              activeDot={{ r: 3, fill: COLORS.secondary }}
              strokeDasharray="4 2"
              isAnimationActive={true}
              animationDuration={1400}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FloodTimelineChart;
