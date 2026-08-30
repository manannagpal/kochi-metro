import React from 'react';

/**
 * Verified Operator Logos for Delhi NCR Transit Systems:
 * - DMRC (Kochi Metro): Official Red Circle Emblem (#E52E2D)
 * - NMRC (Noida Metro Aqua Line): Eco-Friendly Aqua Circle (#00C0F3) with 'N' Transit Mark
 * - RMGL (Gurugram Rapid Metro): Light-Metro Green Badge (#50B848) with 'R' Rapid Transit Symbol
 * - RRTS (NaMo Bharat NCRTC): Deep Blue Badge (#00529B) with Forward Speed Arrow
 */
export function MetroOperatorLogo({ lineDef, size = 20, className = '' }) {
  const operator = lineDef?.operator || 'DMRC';
  const lineColor = lineDef?.color || '#E52E2D';

  // 1. NMRC - Noida Metro (Aqua Line)
  if (operator === 'NMRC' || lineDef?.id === 'aqua') {
    return (
      <span
        title="Noida Metro (Aqua Line - NMRC)"
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#00C0F3',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0, 192, 243, 0.4)',
          border: '1.5px solid #FFFFFF',
          flexShrink: 0
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 18V6l12 12V6" />
        </svg>
      </span>
    );
  }

  // 2. RMGL - Gurugram Rapid Metro
  if (operator === 'RMGL' || lineDef?.id === 'rapid') {
    return (
      <span
        title="Gurugram Rapid Metro (RMGL)"
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#50B848',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(80, 184, 72, 0.4)',
          border: '1.5px solid #FFFFFF',
          flexShrink: 0
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 20V4h6a4 4 0 0 1 0 8H7m6 0l5 8" />
        </svg>
      </span>
    );
  }

  // 3. RRTS - NaMo Bharat (NCRTC High-Speed Rapid Rail)
  if (operator === 'RRTS' || lineDef?.id === 'rrts') {
    return (
      <span
        title="NaMo Bharat RRTS (NCRTC)"
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: '#00529B',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 2px 6px rgba(0, 82, 155, 0.4)',
          border: '1.5px solid #FFFFFF',
          flexShrink: 0
        }}
      >
        <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </span>
    );
  }

  // 4. DMRC - Official Kochi Metro Rail Corporation Emblem
  return (
    <img
      src="/favicon.svg"
      alt={`${lineDef?.name || 'Kochi Metro'} Official Logo`}
      title={`${lineDef?.name || 'Kochi Metro'} (DMRC)`}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        objectFit: 'contain',
        background: '#FFFFFF',
        padding: '1px',
        border: `1.5px solid ${lineColor}`,
        boxShadow: `0 2px 6px ${lineColor}44`,
        flexShrink: 0
      }}
    />
  );
}
