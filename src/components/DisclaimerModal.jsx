import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export function DisclaimerModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto',
        padding: '24px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 0,
            margin: 0,
            lineHeight: 0,
            boxSizing: 'border-box', cursor: 'pointer'
        }}>
          <X size={18} style={{ display: 'block' }} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <AlertCircle size={24} color="#EF4444" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Disclaimer & Legal Notice
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Independent Transit Information Statement
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p>
            <strong>mumbai.metro.org.in</strong> is an independent commuter guide and is not affiliated with, endorsed by, or connected to MMOPL, MMMOCL, MMRC, or any government agency.
          </p>
        </div>
      </div>
    </div>
  );
}
