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
        <button type="button" onClick={onClose} style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
          position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'grid', placeItems: 'center', 
            padding: 0,
            margin: 0,
            
             cursor: 'pointer'
        }}>
          <X size={18} style={{ display: 'block', margin: 'auto' }} />
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
              Independent Route & Station Navigation Portal for Kochi
            </span>
          </div>
        </div>

        <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p>
            <strong>kochi.metro.org.in</strong> is an independent web application dedicated to providing fast, reliable, and accessible route planning across the Kochi Metro network.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '6px' }}>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
              <MapPin size={18} color="#005DAA" style={{ marginBottom: '6px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Full Network Coverage</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Aluva, Edapally, JLN Stadium, M.G. Road, Ernakulam South, Tripunithura & operational stops</div>
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
