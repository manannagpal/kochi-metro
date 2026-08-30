import React, { useEffect } from 'react';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export function DisclaimerPage({ onBackToHome }) {
  useEffect(() => {
    document.title = "Disclaimer | Kochi Metro Route Finder";
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
          <div style={{ background: '#EF4444', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <AlertCircle size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Disclaimer
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Important legal disclaimers regarding website usage and data independence.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            <strong>kolkata.metro.org.in</strong> is an independent digital tool. It is <strong>NOT affiliated with, associated with, authorized by, endorsed by, or in any way officially connected to Kochi Metro Rail (KMRL)</strong>, or any of their subsidiaries.
          </p>

          <p>
            All station names, line designations, and transit trademarks belong to their respective official owners. Route times, fare estimates, and train schedules provided on this application are for informational guidance only.
          </p>
        </div>
      </div>
    </div>
  );
}
