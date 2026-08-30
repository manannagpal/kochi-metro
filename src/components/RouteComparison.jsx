import React from 'react';
import { Layers, ArrowDownRight } from 'lucide-react';
import { TRANSLATIONS } from '../utils/i18n.js';

export function RouteComparison({ routes, onSelectRoute, lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!routes || routes.length < 2) return null;

  return (
    <div className="glass-panel" style={{ padding: '20px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
          <Layers size={18} color="var(--accent-primary)" />
          <span>{t.routeComparison}</span>
        </div>
        <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
          Click any route row to view full journey ↓
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
              <th style={{ padding: '10px' }}>Option</th>
              <th style={{ padding: '10px' }}>Time</th>
              <th style={{ padding: '10px' }}>Fare</th>
              <th style={{ padding: '10px' }}>Stops</th>
              <th style={{ padding: '10px' }}>Switches</th>
              <th style={{ padding: '10px' }}>Lines & Interchanges</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r, idx) => (
              <tr
                key={r.id}
                onClick={() => onSelectRoute && onSelectRoute(r.id)}
                style={{
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  transition: 'background 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <td style={{ padding: '10px', fontWeight: 700 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Route {idx + 1}</span>
                    <ArrowDownRight size={14} color="var(--accent-primary)" />
                  </div>
                  {r.badges && r.badges[0] && (
                    <span style={{ fontSize: '0.7rem', display: 'block', color: 'var(--accent-primary)' }}>
                      {r.badges[0].label}
                    </span>
                  )}
                </td>
                <td style={{ padding: '10px', fontWeight: 600, color: '#38BDF8' }}>{r.totalTimeMins} mins</td>
                <td style={{ padding: '10px', fontWeight: 600, color: '#4ADE80' }}>₹{r.fare}</td>
                <td style={{ padding: '10px' }}>{r.totalStops} stops</td>
                <td style={{ padding: '10px' }}>{r.switches} {r.switches === 1 ? t.switch : t.switchPlural}</td>
                <td style={{ padding: '10px', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                  {r.interchangeStations.length > 0
                    ? r.interchangeStations.map(i => i.stationName).join(' → ')
                    : 'Direct Line'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
