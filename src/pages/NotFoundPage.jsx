import React, { useEffect } from 'react';
import { TRANSLATIONS } from '../utils/i18n.js';
import { MapPinOff, ArrowLeft } from 'lucide-react';

export function NotFoundPage({ lang = 'en', onNavigate }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  useEffect(() => {
    document.title = '404 - Page Not Found | Delhi Metro Route Finder';

    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.name = 'robots';
      document.head.appendChild(metaRobots);
    }
    metaRobots.content = 'noindex, follow';

    return () => {
      if (metaRobots) metaRobots.content = 'index, follow';
    };
  }, []);

  const handleGoHome = () => {
    if (onNavigate) {
      onNavigate('/');
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '40px 20px', maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div className="glass-panel" style={{
        padding: '40px 28px',
        borderRadius: '20px',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-surface)',
        width: '100%'
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          color: '#EF4444'
        }}>
          <MapPinOff size={36} />
        </div>

        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '10px' }}>
          404 - Page Not Found
        </h1>

        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '440px', margin: '0 auto 28px auto' }}>
          The station, route, or page address you entered does not exist or has been updated. Please verify the URL or plan a route using the button below.
        </p>

        <button
          onClick={handleGoHome}
          style={{
            background: 'var(--accent-primary)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)',
            transition: 'transform 0.2s ease'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Route Finder</span>
        </button>
      </div>
    </div>
  );
}
