import React from 'react';
import { Search, Route, Sliders, CheckCircle } from 'lucide-react';

export function HowItWorks() {
  return (
    <div id="how-it-works-section" className="glass-panel" style={{ padding: '24px', marginBottom: '32px' }}>
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '16px', textAlign: 'center' }}>
        How It Works
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{
            background: 'rgba(59, 130, 246, 0.15)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Search size={22} color="#3B82F6" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>1. Select Stations</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Choose your starting station and destination using instant autocomplete.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{
            background: 'rgba(245, 158, 11, 0.15)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Route size={22} color="#F59E0B" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>2. Graph Path Engine</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Our routing engine calculates all practical alternate routes across DMRC network.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{
            background: 'rgba(139, 92, 246, 0.15)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <Sliders size={22} color="#8B5CF6" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>3. Compare Routes</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Filter options by fastest, fewest switches, lowest fare, or best overall.
          </p>
        </div>

        <div style={{ textAlign: 'center', padding: '12px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <CheckCircle size={22} color="#10B981" />
          </div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '6px' }}>4. Step-by-Step Guide</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
            Follow line colors, direction terminals, and precise transfer alerts.
          </p>
        </div>
      </div>
    </div>
  );
}
