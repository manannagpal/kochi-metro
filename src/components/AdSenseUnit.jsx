import React, { useEffect, useRef } from 'react';
import { Capacitor } from '@capacitor/core';

// Web AdSense flag (kept false for web unless AdSense is ready)
const ENABLE_WEB_ADS = false;

// Native AdMob flag for Android APK/AAB
const ENABLE_NATIVE_ADS = true;

// Safe dynamic AdMob loader with @vite-ignore to prevent build errors when admob is omitted
let AdMob = null;
let BannerAdSize = null;
let BannerAdPosition = null;

if (Capacitor.isNativePlatform()) {
  const admobPkg = '@capacitor-community/admob';
  import(/* @vite-ignore */ admobPkg).then(m => {
    AdMob = m.AdMob;
    BannerAdSize = m.BannerAdSize;
    BannerAdPosition = m.BannerAdPosition;
    if (AdMob) {
      AdMob.initialize({ initializeForTesting: false }).catch(() => {});
    }
  }).catch(() => {});
}

export function AdSenseUnit({
  slot = '7152802483',
  format = 'auto',
  responsive = 'true',
  style = { display: 'block', minHeight: '90px' },
  label = ''
}) {
  const adRef = useRef(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      if (!ENABLE_NATIVE_ADS) return;
      const fullAdUnitId = slot.includes('/')
        ? slot
        : `ca-app-pub-3598421466906011/${slot}`;

      if (AdMob && BannerAdSize && BannerAdPosition) {
        AdMob.showBanner({
          adId: fullAdUnitId,
          adSize: BannerAdSize.ADAPTIVE_BANNER,
          position: BannerAdPosition.BOTTOM_CENTER,
          margin: 0
        }).catch(err => console.debug('AdMob banner show debug:', err));
      }
      return;
    }

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

  const isNative = Capacitor.isNativePlatform();
  if (isNative && !ENABLE_NATIVE_ADS) return null;
  if (!isNative && !ENABLE_WEB_ADS) return null;

  return (
    <div
      className="adsense-container"
      style={{
        margin: '16px 0',
        padding: label ? '12px' : '0',
        background: label ? 'var(--bg-surface)' : 'transparent',
        border: label ? '1px solid var(--border-color)' : 'none',
        borderRadius: '12px',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {label ? (
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
      ) : null}
      {!isNative && (
        <ins
          className="adsbygoogle"
          style={style}
          data-ad-client="ca-pub-3598421466906011"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive}
          ref={adRef}
        />
      )}
    </div>
  );
}
