import React, { useEffect } from 'react';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export function PrivacyPage({ onBackToHome }) {
  useEffect(() => {
    document.title = "Privacy Policy | Kolkata Metro Route Finder";
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
          <div style={{ background: '#8B5CF6', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              How we protect your data and handle local storage.
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: '1.7', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <p>
            Your privacy is extremely important to us. <strong>kolkata.metro.org.in</strong> is built with privacy-first principles:
          </p>

          <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' }}>
            <li><strong>No Account Required:</strong> You do not need to register or provide personal credentials.</li>
            <li><strong>Local Storage Only:</strong> Favorite stations and recent search history are saved strictly inside your browser's local storage (`km_*`).</li>
            <li><strong>GPS Privacy:</strong> Nearby station location lookups process coordinates locally in your browser.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
