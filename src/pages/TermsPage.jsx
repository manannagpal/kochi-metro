import React, { useEffect } from 'react';
import { FileText, ArrowLeft } from 'lucide-react';

export function TermsPage({ onBackToHome }) {
  useEffect(() => {
    document.title = "Terms of Service | Kochi Metro Route Finder";
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
          <div style={{ background: '#F59E0B', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <FileText size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Terms of Service
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Terms governing the use of Kochi Metro Route Finder.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            By accessing and using <strong>kolkata.metro.org.in</strong>, you agree to these Terms of Service.
          </p>

          <p>
            This website is provided as a free public utility. While every effort is made to maintain accurate routing information, actual travel times and fares may vary based on transit operations and operational updates.
          </p>
        </div>
      </div>
    </div>
  );
}
