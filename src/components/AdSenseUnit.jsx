import React, { useEffect, useRef } from 'react';

// Web AdSense flag (kept false until AdSense site is ready)
const ENABLE_WEB_ADS = false;

export function AdSenseUnit({
  slot = '7152802483',
  format = 'auto',
  responsive = 'true',
  style = { display: 'block', minHeight: '90px' },
  label = 'ADVERTISEMENT'
}) {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!ENABLE_WEB_ADS) return;
    if (!pushedRef.current && adRef.current) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushedRef.current = true;
      } catch (err) {
        console.debug('AdSense push notice:', err);
      }
    }
  }, [slot]);

  if (!ENABLE_WEB_ADS) return null;

  return (
    <div
      className="adsense-container"
      style={{
        margin: '20px 0',
        padding: '12px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {label && (
        <span
          style={{
            display: 'block',
            fontSize: '0.68rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'var(--text-muted)',
            marginBottom: '8px'
          }}
        >
          {label}
        </span>
      )}
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-3598421466906011"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive}
        ref={adRef}
      />
    </div>
  );
}
