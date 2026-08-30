import React from 'react';
import { Mail, X, Send, Globe } from 'lucide-react';

export function ContactModal({ onClose }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '540px', maxHeight: '85vh', overflowY: 'auto',
        padding: '24px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
      }}>
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Mail size={24} color="#10B981" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Contact & Feedback
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Kolkata Metro Portal Helpdesk
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.88rem' }}>
          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Globe size={20} color="var(--accent-primary)" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Official Portal URL</div>
              <div style={{ fontWeight: 700 }}>kolkata.metro.org.in</div>
            </div>
          </div>

          <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'var(--input-bg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Send size={20} color="#10B981" />
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email Support</div>
              <a href="mailto:metro.org.in@gmail.com" style={{ fontWeight: 700, color: 'var(--accent-primary)', textDecoration: 'none' }}>
                metro.org.in@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
