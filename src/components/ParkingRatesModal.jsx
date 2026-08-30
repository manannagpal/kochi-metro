import React, { useState } from 'react';
import { Car, X, Info } from 'lucide-react';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';

export function ParkingRatesModal({ onClose }) {
  const [selectedNetwork, setSelectedNetwork] = useState('KOLKATA');

  const currentParking = OFFICIAL_PARKING_RATES[selectedNetwork] || OFFICIAL_PARKING_RATES.KOLKATA;

  const networks = [
    { key: 'KOLKATA', name: 'Metro Railway Kolkata', badge: 'Default' }
  ];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '20px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '680px', maxHeight: '85vh', overflowY: 'auto',
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
          <div style={{ background: 'rgba(0, 192, 243, 0.15)', padding: '10px', borderRadius: '12px' }}>
            <Car size={24} color="#00C0F3" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Official Metro Parking Rates & Info
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Station-wise 2-wheeler, 4-wheeler, cycle & night parking rates
            </span>
          </div>
        </div>

        {/* Network Selector Tabs */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
          {networks.map(net => (
            <button
              key={net.key}
              onClick={() => setSelectedNetwork(net.key)}
              style={{
                padding: '8px 14px', borderRadius: '10px', border: '1px solid',
                borderColor: selectedNetwork === net.key ? 'var(--accent-primary)' : 'var(--border-color)',
                background: selectedNetwork === net.key ? 'var(--accent-primary)' : 'var(--input-bg)',
                color: selectedNetwork === net.key ? '#FFFFFF' : 'var(--text-primary)',
                fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {net.name}
            </button>
          ))}
        </div>

        {/* Selected Operator Header Card */}
        <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: '12px', background: 'var(--input-bg)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
              {currentParking.operator}
            </span>
            <span style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', fontWeight: 700 }}>
              Official Authorized Rates
            </span>
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.4' }}>
            {currentParking.notes}
          </p>
        </div>

        {/* Rates Comparison Table */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '20px' }}>
          {/* 4-Wheeler */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🚗 4-Wheeler (Car / SUV)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 6h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.fourWheeler.upTo6h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 12h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.fourWheeler.upTo12h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Day (24h):</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>{currentParking.rates.fourWheeler.fullDay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Pass:</span>
                <span style={{ fontWeight: 800 }}>{currentParking.rates.fourWheeler.monthly}</span>
              </div>
            </div>
          </div>

          {/* 2-Wheeler */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F59E0B', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🛵 2-Wheeler (Bike / Scooter)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 6h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.twoWheeler.upTo6h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 12h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.twoWheeler.upTo12h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Day (24h):</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>{currentParking.rates.twoWheeler.fullDay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Pass:</span>
                <span style={{ fontWeight: 800 }}>{currentParking.rates.twoWheeler.monthly}</span>
              </div>
            </div>
          </div>

          {/* Bicycle */}
          <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10B981', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              🚲 Bicycle / Cycle
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 6h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.cycle.upTo6h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Up to 12h:</span>
                <span style={{ fontWeight: 700 }}>{currentParking.rates.cycle.upTo12h}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Full Day (24h):</span>
                <span style={{ fontWeight: 800, color: '#10B981' }}>{currentParking.rates.cycle.fullDay}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '6px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Monthly Pass:</span>
                <span style={{ fontWeight: 800 }}>{currentParking.rates.cycle.monthly}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Night Parking Rules */}
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Info size={20} style={{ flexShrink: 0 }} />
          <div>
            <strong>Night Parking Policy:</strong> {currentParking.nightParking}
          </div>
        </div>
      </div>
    </div>
  );
}
