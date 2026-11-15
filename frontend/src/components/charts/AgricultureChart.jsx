import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const d = payload[0].payload;
  return (
    <div style={{
      background: '#101827',
      border: '1px solid rgba(53,211,154,0.25)',
      borderRadius: '6px',
      padding: '8px 12px',
      fontSize: '12px',
      fontFamily: 'IBM Plex Mono, monospace',
      color: '#F2F6FC',
    }}>
      <div style={{ color: '#8B9AAF', marginBottom: '4px', fontSize: '11px' }}>{d.name}</div>
      <div style={{ color: '#35D39A' }}>Agri. Land: {d.agriLand?.toLocaleString()} km²</div>
    </div>
  );
};

const truncateName = (name) => name.length > 12 ? name.slice(0, 11) + '…' : name;

const AgricultureChart = ({ data = [] }) => {
  return (
    <div style={{ background: '#141F30', borderRadius: '8px', padding: '12px 8px 8px 0', height: '240px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data.slice(0, 8)} margin={{ top: 4, right: 12, left: 0, bottom: 24 }}>
          <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis
            dataKey="name"
            tickFormatter={truncateName}
            tick={{ fill: '#8B9AAF', fontSize: 10, fontFamily: 'Inter, sans-serif' }}
            axisLine={false}
            tickLine={false}
            angle={-30}
            textAnchor="end"
            interval={0}
          />
          <YAxis
            tick={{ fill: '#8B9AAF', fontSize: 10, fontFamily: 'IBM Plex Mono, monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar dataKey="agriLand" radius={[3, 3, 0, 0]} isAnimationActive animationDuration={900}>
            {data.slice(0, 8).map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill="#35D39A"
                fillOpacity={0.7 + (index / data.length) * 0.3}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AgricultureChart;
