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
      backgroundColor: 'var(--surface-panel)',
      border: '1px solid var(--border-medium)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-2) var(--space-3)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-md)'
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '2px' }}>{formatDate(label)}</div>
      <div className="font-mono" style={{ fontWeight: 600, color: 'var(--accent-blue)' }}>
        Rainfall: {payload[0].value} mm
      </div>
    </div>
  );
};

const getBarColor = (value) => {
  if (value >= 80) return 'var(--status-critical)';
  if (value >= 50) return 'var(--status-warning)';
  return 'var(--accent-blue)';
};

const RainfallChart = ({ data = [], observationDates = [] }) => {
  return (
    <div style={{
      backgroundColor: 'var(--surface-base)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 'var(--radius-sm)',
      padding: 'var(--space-3) var(--space-2) var(--space-1) 0',
      height: '100%'
    }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: -10, bottom: 0 }}>
          <CartesianGrid stroke="var(--border-subtle)" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'monospace' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}mm`}
            width={48}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--surface-subtle)' }} />
          {observationDates.map((od) => (
            <ReferenceLine
              key={od}
              x={od}
              stroke="var(--accent-blue)"
              strokeDasharray="3 3"
              label={{ value: 'NISAR Overpass', fill: 'var(--accent-blue)', fontSize: 9 }}
            />
          ))}
          <Bar dataKey="rainfall" radius={[2, 2, 0, 0]} isAnimationActive={false}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.rainfall)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RainfallChart;
