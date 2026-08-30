import React, { useEffect } from 'react';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export function ContactPage({ onBackToHome }) {
  useEffect(() => {
    document.title = "Contact Us | Kochi Metro Route Finder";
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
          <div style={{ background: '#10B981', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <Mail size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Contact Us
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              We welcome your feedback, station updates, and routing suggestions.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            Have a question, feedback on fare calculations, or noticed a new station entrance? Reach out to us directly:
          </p>

          <div style={{
            padding: '20px', borderRadius: '16px', background: 'var(--input-bg)',
            border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '14px'
          }}>
            <Send size={24} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Email Support</div>
              <a href="mailto:metro.org.in@gmail.com" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'none' }}>
                metro.org.in@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
