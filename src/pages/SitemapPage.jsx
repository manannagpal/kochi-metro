import React, { useEffect } from 'react';
import { ArrowLeft, MapPin, FileCode, Route, Compass } from 'lucide-react';
import { Capacitor } from '@capacitor/core';
import { STATIONS } from '../data/stations.js';
import { getStationSlug } from '../utils/slugify.js';

export function SitemapPage({ onBackToHome, onSelectStation }) {
  const isNativeApp = Capacitor.isNativePlatform();

  useEffect(() => {
    document.title = "Sitemap | Kolkata Metro Route Finder";
    window.scrollTo(0, 0);
  }, []);

  const groupedStations = React.useMemo(() => {
    const groups = {};
    STATIONS.forEach(st => {
      const letter = st.name.charAt(0).toUpperCase();
      if (!groups[letter]) groups[letter] = [];
      groups[letter].push(st);
    });
    return groups;
  }, []);

  const xmlSitemaps = [
    { title: "Master Sitemap Index", url: "https://kolkata.metro.org.in/sitemap.xml" },
    { title: "Sitemap Chunk 1", url: "https://kolkata.metro.org.in/sitemap-1.xml" },
    { title: "Core Pages & Stations Sitemap", url: "https://kolkata.metro.org.in/sitemap-home.xml" },
  ];

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '16px 0' }}>
      <button
        onClick={onBackToHome}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--accent-primary)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer',
          fontWeight: 600,
          fontSize: '0.9rem',
          marginBottom: '16px',
          padding: 0
        }}
      >
        <ArrowLeft size={16} />
        <span>Back to Home</span>
      </button>

      <div className="glass-panel" style={{ padding: 'clamp(16px, 4vw, 32px)', borderRadius: '16px', background: 'var(--bg-surface)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '10px', borderRadius: '12px', color: '#FFF' }}>
            <Compass size={26} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Sitemap
            </h1>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Complete index of all stations and core pages for Kolkata Metro
            </span>
          </div>
        </div>

        {!isNativeApp && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', items: 'center', gap: '8px' }}>
              <Compass size={18} color="var(--accent-primary)" />
              Core Navigation Pages
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
              <a href="/" style={linkStyle}>🏠 Home Page</a>
              <a href="/stations/" style={linkStyle}>🚉 Stations Directory</a>
              <a href="/about/" style={linkStyle}>ℹ️ About Us</a>
              <a href="/contact/" style={linkStyle}>📞 Contact Us</a>
              <a href="/privacy-policy/" style={linkStyle}>🔒 Privacy Policy</a>
              <a href="/terms-of-service/" style={linkStyle}>📜 Terms of Service</a>
              <a href="/disclaimer/" style={linkStyle}>⚠️ Disclaimer</a>
            </div>
          </div>
        )}

        {!isNativeApp && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', items: 'center', gap: '8px' }}>
              <FileCode size={18} color="var(--accent-primary)" />
              Official XML Sitemaps
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
              {xmlSitemaps.map((item, idx) => (
                <a key={idx} href={item.url} target="_blank" rel="noopener noreferrer" style={linkStyle}>
                  📄 {item.title}
                </a>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px', display: 'flex', items: 'center', gap: '8px' }}>
            <MapPin size={18} color="var(--accent-primary)" />
            All {STATIONS.length} Kolkata Metro Stations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {Object.keys(groupedStations).sort().map(letter => (
              <div key={letter}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--accent-primary)', marginBottom: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                  {letter}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '8px' }}>
                  {groupedStations[letter].map(st => (
                    <a
                      key={st.id}
                      href={`/station/${getStationSlug(st)}/`}
                      onClick={(e) => {
                        if (onSelectStation) {
                          e.preventDefault();
                          onSelectStation(st);
                        }
                      }}
                      style={linkStyle}
                    >
                      🚉 {st.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const linkStyle = {
  display: 'block',
  padding: '10px 14px',
  borderRadius: '8px',
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  color: 'var(--text-primary)',
  textDecoration: 'none',
  fontSize: '0.88rem',
  fontWeight: 500,
  transition: 'all 0.2s ease',
};
