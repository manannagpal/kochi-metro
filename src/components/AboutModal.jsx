import React from 'react';
import { Info, X, Shield, MapPin, Clock, CreditCard } from 'lucide-react';

export function AboutModal({ onClose }) {
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
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Info size={24} color="#2563EB" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              About Kochi Metro Route Finder
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Independent Route & Station Navigation Portal for Mumbai
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p>
            <strong>mumbai.metro.org.in</strong> is an independent web application dedicated to providing fast, reliable, and accessible route planning across the Kochi Metro network (Line 1 Blue Line, Line 2A Yellow Line, Line 7 Red Line, and Line 3 Aqua Line).
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <MapPin size={18} color="#005DAA" style={{ marginBottom: '6px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Full Network Coverage</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Versova, Ghatkopar, Andheri, Dahisar, BKC & Airport stops</div>
            </div>

            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <CreditCard size={18} color="#10B981" style={{ marginBottom: '6px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Official Fares & Discounts</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Token fares & smart card discount comparisons</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
