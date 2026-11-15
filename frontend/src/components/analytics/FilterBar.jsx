import React from 'react';

const inputStyle = {
  background: '#0D1826',
  border: '1px solid rgba(139,154,175,0.25)',
  borderRadius: '6px',
  color: '#F2F6FC',
  fontSize: '13px',
  padding: '7px 12px',
  fontFamily: 'Inter, sans-serif',
  outline: 'none',
  transition: 'border-color 0.2s',
  minWidth: '160px',
};

const labelStyle = {
  fontSize: '11px',
  color: '#8B9AAF',
  marginBottom: '4px',
  display: 'block',
  fontFamily: 'Inter, sans-serif',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
};

const FilterBar = ({ filters = {}, districts = [], onChange }) => {
  const handleChange = (key, value) => {
    onChange && onChange({ ...filters, [key]: value });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '16px',
        alignItems: 'flex-end',
        background: '#141F30',
        border: '1px solid rgba(139,154,175,0.12)',
        borderRadius: '8px',
        padding: '14px 18px',
        marginBottom: '16px',
      }}
    >
      {/* Search */}
      <div style={{ flex: '1 1 200px' }}>
        <label style={labelStyle}>Search Village</label>
        <input
          type="text"
          placeholder="Type village name…"
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.target.style.borderColor = '#00D5FF')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(139,154,175,0.25)')}
        />
      </div>

      {/* Severity filter */}
      <div>
        <label style={labelStyle}>Severity</label>
        <select
          value={filters.severity || 'ALL'}
          onChange={(e) => handleChange('severity', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={(e) => (e.target.style.borderColor = '#00D5FF')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(139,154,175,0.25)')}
        >
          <option value="ALL">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MODERATE">Moderate</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* District filter */}
      <div>
        <label style={labelStyle}>District</label>
        <select
          value={filters.district || 'ALL'}
          onChange={(e) => handleChange('district', e.target.value)}
          style={{ ...inputStyle, cursor: 'pointer' }}
          onFocus={(e) => (e.target.style.borderColor = '#00D5FF')}
          onBlur={(e) => (e.target.style.borderColor = 'rgba(139,154,175,0.25)')}
        >
          <option value="ALL">All Districts</option>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {(filters.search || (filters.severity && filters.severity !== 'ALL') || (filters.district && filters.district !== 'ALL')) && (
        <button
          onClick={() => onChange({ search: '', severity: 'ALL', district: 'ALL' })}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255,82,82,0.4)',
            borderRadius: '6px',
            color: '#FF5252',
            fontSize: '12px',
            padding: '7px 14px',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => (e.target.style.background = 'rgba(255,82,82,0.08)')}
          onMouseLeave={(e) => (e.target.style.background = 'transparent')}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterBar;
