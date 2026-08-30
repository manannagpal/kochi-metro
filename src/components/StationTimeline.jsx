import React from 'react';
import { getStationById } from '../utils/stationSearch.js';
import { TRANSLATIONS } from '../utils/i18n.js';
import { MetroOperatorLogo } from './MetroOperatorLogo.jsx';
import { ArrowRight } from 'lucide-react';

export function StationTimeline({ route, onStationClick, lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  if (!route || !route.legs || route.legs.length === 0) return null;

  const timelineItems = [];

  route.legs.forEach((leg, legIdx) => {
    const lineDef = leg.lineDef || { color: '#3B82F6', name: leg.lineId };
    const stationIds = leg.stations || [];

    stationIds.forEach((stId, stIdx) => {
      if (legIdx > 0 && stIdx === 0) return;

      const isOrigin = (legIdx === 0 && stIdx === 0);
      const isDestination = (legIdx === route.legs.length - 1 && stIdx === stationIds.length - 1);
      const isInterchange = (!isDestination && stIdx === stationIds.length - 1);
      
      const stObj = typeof stId === 'object' && stId !== null ? stId : getStationById(stId);
      const realStId = typeof stId === 'object' && stId !== null ? stId.id : stId;
      const stationName = stObj ? stObj.name : (stIdx === 0 ? leg.fromStationName : leg.toStationName);

      timelineItems.push({
        stationId: realStId,
        stationName: stationName || stId,
        lineDef,
        direction: leg.direction,
        isOrigin,
        isDestination,
        isInterchange,
        legIndex: legIdx,
        nextLeg: isInterchange ? route.legs[legIdx + 1] : null
      });
    });
  });

  return (
    <div style={{
      padding: '4px 6px',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
        {timelineItems.map((item, idx) => {
          const lineColor = item.lineDef.color || '#3B82F6';
          const isLast = idx === timelineItems.length - 1;
          const activeSegmentColor = item.isInterchange && item.nextLeg?.lineDef ? item.nextLeg.lineDef.color : lineColor;

          return (
            <div
              key={idx}
              onClick={() => onStationClick && onStationClick(item.stationId)}
              style={{
                display: 'flex',
                alignItems: 'stretch',
                gap: '14px',
                position: 'relative',
                minHeight: item.isOrigin || item.isDestination || item.isInterchange ? '44px' : '30px',
                cursor: 'pointer'
              }}
            >
              {/* Minimal Line Connector & Operator Logos */}
              <div style={{
                width: '24px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                position: 'relative',
                flexShrink: 0
              }}>
                {/* 3px Minimal Line Thread */}
                {!isLast && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      bottom: '-14px',
                      width: '3px',
                      backgroundColor: activeSegmentColor,
                      borderRadius: '1.5px',
                      zIndex: 1
                    }}
                  />
                )}

                {/* Node Marker */}
                <div style={{
                  position: 'relative',
                  zIndex: 2,
                  marginTop: '2px'
                }}>
                  {item.isOrigin ? (
                    <MetroOperatorLogo lineDef={item.lineDef} size={20} />
                  ) : item.isDestination ? (
                    <MetroOperatorLogo lineDef={item.lineDef} size={20} />
                  ) : item.isInterchange ? (
                    <MetroOperatorLogo lineDef={item.nextLeg?.lineDef || item.lineDef} size={20} />
                  ) : (
                    <div style={{
                      width: '9px',
                      height: '9px',
                      borderRadius: '50%',
                      background: 'var(--bg-surface)',
                      border: `2px solid ${lineColor}`,
                      marginTop: '4px'
                    }} />
                  )}
                </div>
              </div>

              {/* Station Info Column */}
              <div style={{
                flex: 1,
                paddingBottom: isLast ? '0' : '6px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 0,
            boxSizing: 'border-box'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap'
                }}>
                  <span style={{
                    fontSize: item.isOrigin || item.isDestination || item.isInterchange ? '0.96rem' : '0.88rem',
                    fontWeight: item.isOrigin || item.isDestination || item.isInterchange ? 700 : 500,
                    color: item.isOrigin
                      ? item.lineDef.color || '#059669'
                      : item.isDestination
                      ? item.lineDef.color || '#DC2626'
                      : 'var(--text-primary)'
                  }}>
                    {item.stationName}
                  </span>

                  {/* Clean Line Micro Pill */}
                  {item.isOrigin && (
                    <span style={{
                      fontSize: '0.66rem',
                      background: lineColor,
                      color: '#FFFFFF',
                      padding: '1px 7px',
                      borderRadius: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase'
                    }}>
                      {item.lineDef.name}
                    </span>
                  )}
                </div>

                {/* Direction pill */}
                {item.isOrigin && item.direction && (
                  <div style={{
                    fontSize: '0.76rem',
                    color: 'var(--text-muted)',
                    marginTop: '2px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span>{t.towards} <strong>{item.direction}</strong></span>
                  </div>
                )}

                {/* Interchange Box */}
                {item.isInterchange && item.nextLeg && (
                  <div style={{
                    marginTop: '4px',
                    padding: '6px 10px',
                    background: 'var(--input-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)'
                  }}>
                    <span style={{
                      fontSize: '0.66rem',
                      background: item.nextLeg.lineDef?.color || '#3B82F6',
                      color: '#FFF',
                      padding: '1px 6px',
                      borderRadius: '8px',
                      fontWeight: 700
                    }}>
                      {item.nextLeg.lineDef?.name}
                    </span>
                    <ArrowRight size={11} color="var(--text-muted)" />
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {t.towards} <strong>{item.nextLeg.direction}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


