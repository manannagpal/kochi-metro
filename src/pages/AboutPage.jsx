import React, { useEffect } from 'react';
import { Info, MapPin, Clock, CreditCard, Shield, ArrowLeft } from 'lucide-react';

export function AboutPage({ onBackToHome }) {
  useEffect(() => {
    document.title = "About Us | Kochi Metro Route Finder";
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'transparent', border: 'none', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '32px', borderRadius: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
          <div style={{ background: 'var(--accent-primary)', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <Info size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              About Kochi Metro Route Finder
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Empowering daily commuters with fast, accurate transit navigation.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            <strong>kolkata.metro.org.in</strong> is an independent web application dedicated to providing fast, reliable, and accessible route planning across the Kochi Metro network (Line 1 Blue Line, Line 2 Green Line, Line 3 Purple Line, and Line 6 Orange Line).
          </p>

          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '16px 0 8px 0', color: 'var(--text-primary)' }}>
            Key Features
          </h2>

          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
            <li><strong>Full Network Routing:</strong> Calculate optimal routes across Dakshineswar, Howrah Maidan, Salt Lake Sector V, Sealdah, and Kavi Subhash.</li>
            <li><strong>Accurate Fares & Timings:</strong> Official token rates, smart card discount options, and first/last train timetables.</li>
            <li><strong>Interactive GIS Map:</strong> Visual Leaflet station map for clear line navigation.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
