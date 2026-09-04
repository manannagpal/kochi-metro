import React from 'react';

export function MetroOperatorLogo({ lineDef, size = 20, className = '' }) {
  const lineColor = lineDef?.color || '#0072CE';

  return (
    <img
      src="/favicon.svg"
      alt={`${lineDef?.name || 'Metro'} Logo`}
      title={lineDef?.name || 'Metro'}
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
