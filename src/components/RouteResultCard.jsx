import React from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import { StationTimeline } from './StationTimeline.jsx';
import { MetroOperatorLogo } from './MetroOperatorLogo.jsx';
import { TRANSLATIONS } from '../utils/i18n.js';

export function RouteResultCard({
  route,
  isOpen = false,
  onToggleOpen,
  onStationClick,
  lang = 'en'
}) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!route) return null;

  return (
    <div
      id={`route-card-${route.id}`}
      className="glass-panel animate-fade-in"
      style={{
        marginBottom: '20px',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        borderRadius: '14px',
        scrollMarginTop: '80px',
        background: 'var(--bg-card)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s ease'
      }}
    >
      {/* 1. TOP STATS BAR */}
      <div style={{
        background: 'var(--header-summary-bg)',
        padding: '14px 8px',
        color: '#FFFFFF',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        textAlign: 'center',
        alignItems: 'center'
      }}>
        <div style={{ padding: '0 4px' }}>
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#38BDF8', lineHeight: 1 }}>
            {route.totalTimeMins}
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94A3B8', marginTop: '4px', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {t.mins || 'MINS'}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', padding: '0 4px' }}>
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#4ADE80', lineHeight: 1 }}>
            ₹{route.fare}
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94A3B8', marginTop: '4px', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {t.fare || 'FARE'}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', padding: '0 4px' }}>
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#FACC15', lineHeight: 1 }}>
            {route.totalStops}
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94A3B8', marginTop: '4px', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {t.stops || t.stations || 'STATIONS'}
          </div>
        </div>

        <div style={{ borderLeft: '1px solid rgba(255,255,255,0.12)', padding: '0 4px' }}>
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', fontWeight: 800, color: '#F472B6', lineHeight: 1 }}>
            {route.switches}
          </div>
          <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94A3B8', marginTop: '4px', fontWeight: 600, letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
            {route.switches === 1 ? (t.switch || 'INTERCHANGE') : (t.switchPlural || t.interchanges || 'INTERCHANGES')}
          </div>
        </div>
      </div>

      {/* 2. CARD SUMMARY VIEW */}
      <div style={{ padding: '18px 20px', background: 'var(--bg-card)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative' }}>
          
          {/* Origin Station Node */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}>
            <div style={{
              width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0
            }}>
              <MetroOperatorLogo lineDef={route.legs[0]?.lineDef} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                onClick={() => onStationClick && onStationClick(route.legs[0]?.fromStationId)}
                style={{ fontWeight: 800, fontSize: '1.05rem', color: route.legs[0]?.lineDef?.color || 'var(--text-primary)', lineHeight: 1.2, cursor: 'pointer' }}
              >
                {route.legs[0]?.fromStationName}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: '0.68rem', background: `${route.legs[0]?.lineDef?.color || '#3B82F6'}22`,
                  color: route.legs[0]?.lineDef?.color || '#3B82F6', border: `1px solid ${route.legs[0]?.lineDef?.color || '#3B82F6'}44`,
                  padding: '1px 6px', borderRadius: '10px', fontWeight: 700
                }}>
                  {route.legs[0]?.lineDef?.name}
                </span>
                <span>{t.towards} <strong>{route.legs[0]?.direction}</strong></span>
              </div>
            </div>
          </div>

          {/* Interchange Station Nodes (if any) */}
          {route.legs.slice(0, -1).map((leg, idx) => {
            const nextLeg = route.legs[idx + 1];
            const nextLegColor = nextLeg.lineDef?.color || '#FACC15';

            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}>
                <div style={{
                  width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0
                }}>
                  <MetroOperatorLogo lineDef={nextLeg.lineDef} size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    onClick={() => onStationClick && onStationClick(leg.toStationId)}
                    style={{ fontWeight: 800, fontSize: '1.02rem', color: 'var(--text-primary)', lineHeight: 1.2, cursor: 'pointer' }}
                  >
                    {leg.toStationName}
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{
                      fontSize: '0.74rem', background: 'var(--input-bg)', color: nextLegColor,
                      border: `1px solid ${nextLegColor}44`, padding: '3px 8px', borderRadius: '8px',
                      fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap'
                    }}>
                      Switch to {nextLeg.lineDef?.name} ({t.towards} {nextLeg.direction})
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Destination Station Node */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative' }}>
            <div style={{
              width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0
            }}>
              <MetroOperatorLogo lineDef={route.legs[route.legs.length - 1]?.lineDef} size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div
                onClick={() => onStationClick && onStationClick(route.legs[route.legs.length - 1]?.toStationId)}
                style={{ fontWeight: 800, fontSize: '1.05rem', color: route.legs[route.legs.length - 1]?.lineDef?.color || 'var(--text-primary)', lineHeight: 1.2, cursor: 'pointer' }}
              >
                {route.legs[route.legs.length - 1]?.toStationName}
              </div>
            </div>
          </div>
        </div>

        {/* Action Toggle Bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Smart Card Fare: <strong style={{ color: '#10B981' }}>₹{route.smartCardFare}</strong>
          </div>

          <button type="button"
            onClick={onToggleOpen}
            style={{
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              color: 'var(--accent-primary)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{isOpen ? 'Hide Journey' : 'View Full Journey'}</span>
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* EXPANDABLE DETAILED TIMELINE (Matches Image 2 & Image 3) */}
        {isOpen && (
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <StationTimeline route={route} onStationClick={onStationClick} lang={lang} />
          </div>
        )}

        
      </div>
    </div>
  );
}
