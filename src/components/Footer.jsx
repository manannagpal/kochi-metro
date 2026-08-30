import React from 'react';
import { Info } from 'lucide-react';
import { Capacitor } from '@capacitor/core';

export function Footer({ onInstallPWA, deferredPrompt, onNavigate }) {
  if (Capacitor.isNativePlatform()) {
    return (
      <footer style={{
        marginTop: '32px',
        padding: '20px 16px 36px 16px',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.82rem',
        borderTop: '1px solid var(--border-color)'
      }}>
        <p style={{ margin: 0, fontWeight: 500 }}>
          © 2026 Kolkata Metro Route Finder
        </p>
      </footer>
    );
  }
  return (
    <footer style={{
      marginTop: '48px',
      padding: '28px 24px',
      borderTop: '1px solid var(--border-color)',
      textAlign: 'center',
      color: 'var(--text-muted)',
      fontSize: '0.85rem',
      background: 'var(--bg-surface)'
    }}>
      <div style={{ maxWidth: '640px', margin: '0 auto 14px auto', fontSize: '0.82rem', lineHeight: '1.5', color: 'var(--text-muted)', textAlign: 'center' }}>
        <Info size={15} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '6px', color: 'var(--text-muted)' }} />
        <span>Based on official Kolkata Metro Operational Network Baseline. All route metrics are estimated.</span>
      </div>

      <nav className="footer-links-container">
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

      <div style={{
        margin: '16px auto',
        padding: '12px 16px',
        maxWidth: '720px',
        borderRadius: '10px',
        background: 'var(--input-bg)',
        border: '1px solid var(--border-color)',
        fontSize: '0.8rem',
        lineHeight: '1.4',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        <strong>Disclaimer:</strong> This is an independent route finder tool. It is not affiliated with, authorized, or endorsed by Metro Railway Kolkata.
      </div>

      <p style={{ marginTop: '16px', fontSize: '0.78rem', opacity: 0.8, textAlign: 'center' }}>
        © 2026 Kolkata Metro Route Finder
      </p>
    </footer>
  );
}
