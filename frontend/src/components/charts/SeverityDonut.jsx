import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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
      padding: '8px 12px',
      fontSize: '12px',
      color: '#F2F6FC',
      fontFamily: 'IBM Plex Mono, monospace',
    }}>
      <span style={{ color: SEVERITY_COLORS[d.name] }}>{d.name}</span>
      {': '}{d.value} districts
    </div>
  );
};

const CenterLabel = ({ viewBox, total }) => {
  const { cx, cy } = viewBox;
  return (
    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle">
      <tspan
        x={cx} y={cy - 8}
        style={{ fontSize: '22px', fontFamily: 'IBM Plex Mono, monospace', fill: '#F2F6FC', fontWeight: 700 }}
      >
        {total}
      </tspan>
      <tspan
        x={cx} y={cy + 12}
        style={{ fontSize: '10px', fill: '#8B9AAF', fontFamily: 'Inter, sans-serif' }}
      >
        districts
      </tspan>
    </text>
  );
};

const SeverityDonut = ({ data = [] }) => {
  const chartData = Array.isArray(data)
    ? data
    : data && typeof data === 'object'
      ? Object.entries(data).map(([name, value]) => ({ name, value: Number(value) || 0 }))
      : [];

  const total = chartData.reduce((sum, d) => sum + (d.value || 0), 0);

  return (
    <div style={{ background: '#141F30', borderRadius: '8px', padding: '12px', height: '100%', minHeight: '240px' }}>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
            isAnimationActive
            animationDuration={1000}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={SEVERITY_COLORS[entry.name] || '#438BFF'}
                stroke="transparent"
              />
            ))}
            <CenterLabel total={total} />
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 16px',
        justifyContent: 'center',
        marginTop: '8px',
      }}>
        {chartData.map((entry) => (
          <div key={entry.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              width: '10px', height: '10px', borderRadius: '2px',
              background: SEVERITY_COLORS[entry.name] || '#438BFF',
            }} />
            <span style={{ fontSize: '11px', color: '#8B9AAF', fontFamily: 'Inter, sans-serif' }}>
              {entry.name} ({entry.value})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SeverityDonut;
