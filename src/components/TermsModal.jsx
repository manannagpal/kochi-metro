import React from 'react';
import { X, FileText, CheckSquare, AlertCircle } from 'lucide-react';

export function TermsModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '720px', maxHeight: '88vh',
        display: 'flex', flexDirection: 'column', position: 'relative',
        background: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--header-summary-bg)', color: '#FFFFFF'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <FileText size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                Terms & Conditions
              </h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                Terms of Use for delhi.metro.org.in
              </span>
            </div>
          </div>

          <button onClick={onClose} style={{
            background: 'rgba(255, 255, 255, 0.15)', border: 'none', color: '#FFFFFF',
            width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}>
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', lineHeight: '1.7', color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          
          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginBottom: '8px' }}>
            1. Acceptance of Terms
          </h4>
          <p>
            By accessing and using <strong>Kochi Metro Route Finder</strong> (<a href="https://delhi.metro.org.in" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>delhi.metro.org.in</a>), you accept and agree to be bound by the terms and provision of this agreement.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            2. Use License & Intellectual Property
          </h4>
          <p>
            Permission is granted to temporarily view and use the route calculator, maps, timetable guides, and fare tools for personal, non-commercial transit planning. All branding, graph calculation algorithms, and UI assets are protected under applicable copyright laws.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            3. Operational Data Disclaimer
          </h4>
          <p>
            While we strive for 100% accuracy in route calculations, travel times, and fare estimates based on baseline published metrics, transit schedules, token fares, and operational maintenance may change without notice. Users are encouraged to verify critical journey timings at station entrances during early morning or late night travel.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            4. External Links & OpenStreetMap Credits
          </h4>
          <p>
            Interactive GIS maps rely on OpenStreetMap tiles under Open Database License (ODbL). We do not control or assume responsibility for third-party map tiles or external hyperlinks.
          </p>

          <h4 style={{ fontSize: '1.05rem', color: 'var(--text-primary)', fontWeight: 700, marginTop: '20px', marginBottom: '8px' }}>
            5. Modifications & Inquiries
          </h4>
          <p>
            We reserve the right to modify these terms at any time. For questions regarding terms, reach out via our Contact Us page.
          </p>

        </div>
      </div>
    </div>
  );
}
