import React from 'react';
import { Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export function Footer({ onInstallPWA, deferredPrompt, onNavigate, theme }) {
  if (Capacitor.isNativePlatform()) {
    return (
      <footer style={{
        marginTop: '8px',
        padding: '6px 12px 12px 12px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.75rem',
        fontWeight: 500,
        background: 'transparent',
        border: 'none'
      }}>
        <p style={{ margin: 0 }}>
          © 2026 Kochi Metro Route Finder
        </p>
      </footer>
    );
  }
  return (
    <footer style={{
      marginTop: '16px',
      padding: '28px 24px',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      background: 'var(--bg-surface)'
    }}>
      <nav className="footer-links-container" aria-label="Footer Navigation">
        <a href="https://metro.org.in/" className="footer-link-item"
        >
          All India Metros
        </a>
        <a
          href="/about/"
          onClick={(e) => { e.preventDefault(); onNavigate('/about/'); }}
          className="footer-link-item"
        >
          About Us
        </a>
        <a
          href="/contact/"
          onClick={(e) => { e.preventDefault(); onNavigate('/contact/'); }}
          className="footer-link-item"
        >
          Contact Us
        </a>
        <a
          href="/privacy-policy/"
          onClick={(e) => { e.preventDefault(); onNavigate('/privacy-policy/'); }}
          className="footer-link-item"
        >
          Privacy Policy
        </a>
        <a
          href="/terms-of-service/"
          onClick={(e) => { e.preventDefault(); onNavigate('/terms-of-service/'); }}
          className="footer-link-item"
        >
          Terms of Service
        </a>
        <a
          href="/disclaimer/"
          onClick={(e) => { e.preventDefault(); onNavigate('/disclaimer/'); }}
          className="footer-link-item"
        >
          Disclaimer
        </a>
      </nav>

            {/* Official Transit Portals */}
      <div style={{
        margin: '14px auto',
        maxWidth: '850px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '8px 16px',
        fontSize: '0.8rem',
        color: 'var(--text-muted)'
      }}>
        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Official Portal:</span>
        <a
          href="https://kochimetro.org/"
          target="_blank"
          rel="noopener noreferrer nofollow"
          style={{ color: 'var(--accent-primary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
        >
          Kochi Metro Rail (KMRL) ↗
        </a>
      </div>

<p style={{
        margin: '14px auto',
        maxWidth: '850px',
        fontSize: '0.78rem',
        lineHeight: '1.5',
        color: 'var(--text-muted)',
        textAlign: 'center'
      }}>
        <strong>Disclaimer:</strong> Independent transit tool based on published Kochi Metro Rail Limited (KMRL) schedules & fare tariffs. Route metrics are estimates; not affiliated with or endorsed by Kochi Metro Rail Limited (KMRL).
      </p>

      <p style={{ marginTop: '16px', fontSize: '0.78rem', opacity: 0.8, textAlign: 'center' }}>
        © 2026 Kochi Metro Route Finder
      </p>
    </footer>
  );
}
