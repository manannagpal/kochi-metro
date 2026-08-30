import React from 'react';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n.js';

export function RouteFilters({
  sortBy,
  setSortBy,
  maxSwitchesFilter,
  setMaxSwitchesFilter,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div className="glass-panel" style={{ padding: '14px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
      
      {/* Sort By Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <ArrowUpDown size={16} color="var(--accent-primary)" />
          <span>{t.sortBy || 'Sort By'}:</span>
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '6px 12px',
            borderRadius: '8px',
            fontSize: '0.85rem',
            fontWeight: 600,
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          <option value="fewestSwitches">{t.fewestSwitches || 'Fewest Line Changes'} (Default)</option>
          <option value="fewestStops">{t.fewestStops || 'Fewest Stops'}</option>
          <option value="fastest">{t.fastest || 'Fastest Route'}</option>
        </select>
      </div>

      {/* Max Switches Filter */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <SlidersHorizontal size={16} color="var(--accent-primary)" />
          <span>{t.maxSwitches || 'Max Changes'}:</span>
        </div>

        <div style={{ display: 'flex', gap: '4px' }}>
          {['any', '0', '1', '2', '3'].map((val) => (
            <button
              key={val}
              onClick={() => setMaxSwitchesFilter(val)}
              style={{
                background: maxSwitchesFilter === val ? 'var(--accent-primary)' : 'var(--input-bg)',
                color: maxSwitchesFilter === val ? '#FFFFFF' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {val === 'any' ? (t.any || 'All') : val}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
