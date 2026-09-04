import React from 'react';
import { Clock, Car, Navigation, Map, Train, Layers, ArrowRight } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { TRANSLATIONS } from '../utils/i18n.js';

export function QuickActions({
  lang = 'en',
  onOpenMap,
  onOpenNearest,
  onOpenStations,
  onOpenLines,
  onOpenParking,
  onOpenTimings
}) {
  if (Capacitor.isNativePlatform()) {
    return null;
  }

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const actions = [
    {
      id: 'first_last_train',
      title: 'First & Last Train',
      sub: 'First and last train timings for all stations',
      cta: 'Check time',
      icon: <Clock size={24} color="#E52E2D" />,
      bg: 'rgba(229, 46, 45, 0.12)',
      onClick: () => onOpenTimings('timings')
    },
    {
      id: 'nearest_metro',
      title: 'Nearest Metro',
      sub: 'Locate nearby stations with GPS search',
      cta: 'Find nearest',
      icon: <Navigation size={24} color="#10B981" />,
      bg: 'rgba(16, 185, 129, 0.12)',
      onClick: onOpenNearest
    },
    {
      id: 'metro_maps',
      title: 'Metro Maps',
      sub: 'Downloadable official system network maps',
      cta: 'View maps',
      icon: <Map size={24} color="#0072CE" />,
      bg: 'rgba(0, 114, 206, 0.12)',
      onClick: onOpenMap
    },
    {
      id: 'stations',
      title: 'Stations',
      sub: 'Browse all stations with line info, parking & gates',
      cta: 'Browse',
      icon: <Train size={24} color="#990066" />,
      bg: 'rgba(153, 0, 102, 0.12)',
      onClick: onOpenStations
    },
    {
      id: 'lines',
      title: 'Lines',
      sub: 'All metro lines with colors and station lists',
      cta: 'View lines',
      icon: <Layers size={24} color="#FF6600" />,
      bg: 'rgba(255, 102, 0, 0.12)',
      onClick: onOpenLines
    },
    {
      id: 'parking',
      title: 'Parking',
      sub: 'Station-wise parking availability & rates',
      cta: 'View info',
      icon: <Car size={24} color="#00C0F3" />,
      bg: 'rgba(0, 192, 243, 0.12)',
      onClick: onOpenParking
    }
  ];

  return (
    <div style={{ marginBottom: '36px' }}>
      <div style={{ fontSize: '0.88rem', fontWeight: 800, letterSpacing: '0.06em', color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase' }}>
        Quick Actions
      </div>

      <div className="quick-actions-grid">
        {actions.map((act) => (
          <div
            key={act.id}
            className="glass-panel"
            onClick={act.onClick}
            style={{
              padding: '24px', borderRadius: '16px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-color)', cursor: 'pointer',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              gap: '16px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(0, 0, 0, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: act.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                {act.icon}
              </div>

              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: '0 0 6px 0', color: 'var(--text-primary)', lineHeight: '1.25' }}>
                {act.title}
              </h4>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.45' }}>
                {act.sub}
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '4px' }}>
              <span>{act.cta}</span>
              <ArrowRight size={16} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
