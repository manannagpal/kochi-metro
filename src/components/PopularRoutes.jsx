import React from 'react';
import { Compass, Sparkles } from 'lucide-react';
import { getStationById } from '../utils/stationSearch.js';
import { TRANSLATIONS } from '../utils/i18n.js';

export const PRESET_ROUTES = [
  {
    "fromId": "aluva",
    "toId": "tripunithura",
    "label": "Aluva → Tripunithura"
  },
  {
    "fromId": "edapally",
    "toId": "mg-road-kochi",
    "label": "Edapally → M.G. Road"
  },
  {
    "fromId": "jln-stadium",
    "toId": "ernakulam-south",
    "label": "JLN Stadium → Ernakulam South"
  },
  {
    "fromId": "aluva",
    "toId": "vyttila",
    "label": "Aluva → Vyttila"
  },
  {
    "fromId": "cusat",
    "toId": "edapally",
    "label": "CUSAT → Edapally"
  },
  {
    "fromId": "kaloor",
    "toId": "maharajas-college",
    "label": "Kaloor → Maharaja's College"
  },
  {
    "fromId": "ernakulam-south",
    "toId": "tripunithura",
    "label": "Ernakulam South → Tripunithura"
  },
  {
    "fromId": "vyttila",
    "toId": "sn-junction",
    "label": "Vyttila → SN Junction"
  }
];

export function PopularRoutes({ onSelectRoute, lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        <Compass size={18} color="var(--accent-primary)" />
        <span>{t.popularSearches || 'Popular Routes'}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        {PRESET_ROUTES.map((preset, idx) => {
          const fromSt = getStationById(preset.fromId);
          const toSt = getStationById(preset.toId);
          if (!fromSt || !toSt) return null;

          return (
            <button
              key={idx}
              onClick={() => onSelectRoute(fromSt, toSt)}
              style={{
                background: 'var(--glass-bg)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                padding: '12px 16px',
                color: 'var(--text-primary)',
                fontSize: '0.88rem',
                fontWeight: 600,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <span>{preset.label}</span>
              <Sparkles size={14} color="var(--accent-primary)" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
