import React, { useState } from 'react';
import { Car, X, Info } from 'lucide-react';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';

export function ParkingRatesModal({ onClose }) {
  const [selectedNetwork, setSelectedNetwork] = useState('KOCHI');

  const currentParking = OFFICIAL_PARKING_RATES[selectedNetwork] || OFFICIAL_PARKING_RATES.KOCHI;

  const networks = [
    { key: 'KOCHI', name: 'Kochi Metro Rail (KMRL)', badge: 'Official' }
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
              Official Kochi Metro Parking Rates & Info
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

        {/* Parking Tariff Cards */}
        {currentParking && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              ℹ️ {currentParking.notes}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>🚗 4-Wheeler Parking</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>Up to 6 hrs: <strong>{currentParking.rates.fourWheeler.upTo6h}</strong></div>
                  <div>Up to 12 hrs: <strong>{currentParking.rates.fourWheeler.upTo12h}</strong></div>
                  <div>Full Day (24h): <strong>{currentParking.rates.fourWheeler.fullDay}</strong></div>
                  <div>Monthly Pass: <strong>{currentParking.rates.fourWheeler.monthly}</strong></div>
                </div>
              </div>

              <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>🛵 2-Wheeler Parking</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>Up to 6 hrs: <strong>{currentParking.rates.twoWheeler.upTo6h}</strong></div>
                  <div>Up to 12 hrs: <strong>{currentParking.rates.twoWheeler.upTo12h}</strong></div>
                  <div>Full Day (24h): <strong>{currentParking.rates.twoWheeler.fullDay}</strong></div>
                  <div>Monthly Pass: <strong>{currentParking.rates.twoWheeler.monthly}</strong></div>
                </div>
              </div>

              <div style={{ background: 'var(--input-bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>🚲 Bicycle Parking</h4>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div>Up to 6 hrs: <strong>{currentParking.rates.cycle.upTo6h}</strong></div>
                  <div>Up to 12 hrs: <strong>{currentParking.rates.cycle.upTo12h}</strong></div>
                  <div>Full Day (24h): <strong>{currentParking.rates.cycle.fullDay}</strong></div>
                  <div>Monthly Pass: <strong>{currentParking.rates.cycle.monthly}</strong></div>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(59, 130, 246, 0.08)', padding: '12px 14px', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              🌙 <strong>Overnight Parking:</strong> {currentParking.nightParking}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
