import React from 'react';
import { History, ArrowRight } from 'lucide-react';
import { getStationById } from '../utils/stationSearch.js';
import { TRANSLATIONS } from '../utils/i18n.js';

export function RecentSearches({ searches, onSelectRoute, lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!searches || searches.length === 0) return null;

  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
        <History size={16} />
        <span>{t.recentSearches}</span>
      </div>

      <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
        {searches.map((item, idx) => {
          const fromSt = getStationById(item.from.id);
          const toSt = getStationById(item.to.id);
          if (!fromSt || !toSt) return null;

          return (
            <button
              key={idx}
              onClick={() => onSelectRoute(fromSt, toSt)}
              style={{
                background: 'var(--input-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '20px',
                padding: '8px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                whiteSpace: 'nowrap',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.background = 'var(--bg-card-hover)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.background = 'var(--input-bg)';
              }}
            >
              <span>{item.from.name}</span>
              <ArrowRight size={14} color="var(--accent-primary)" />
              <span>{item.to.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
