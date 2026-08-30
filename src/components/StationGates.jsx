import React from 'react';
import { DoorOpen, CheckCircle } from 'lucide-react';
import { getStationGates } from '../data/stationGates.js';

export function StationGates({ fromStation, toStation }) {
  const fromGates = fromStation ? getStationGates(fromStation.id, fromStation.name) : [];
  const toGates = toStation ? getStationGates(toStation.id, toStation.name) : [];

  if (!fromStation && !toStation) return null;

  const renderGateCard = (gate, idx) => {
    let gateNo = 'Gate No. 1';
    let landmark = 'Main Entrance';
    let divyangFriendly = true;

    if (typeof gate === 'string') {
      if (gate.includes('(') && gate.includes(')')) {
        const parts = gate.split('(');
        gateNo = parts[0].trim();
        landmark = parts.slice(1).join('(').replace(/\)$/, '').trim();
      } else {
        gateNo = `Gate No. ${idx + 1}`;
        landmark = gate;
      }
    } else if (gate && typeof gate === 'object') {
      gateNo = gate.gateNo || gate.gate || `Gate No. ${idx + 1}`;
      landmark = gate.landmark || gate.name || 'Main Entrance';
      divyangFriendly = gate.divyangFriendly !== false;
    }

    return (
      <div
        key={idx}
        style={{
          background: 'var(--input-bg)',
          padding: '16px',
          borderRadius: '14px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <span style={{
            background: 'var(--accent-primary)',
            color: '#FFFFFF',
            padding: '5px 12px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '0.82rem',
            display: 'inline-block'
          }}>
            {gateNo}
          </span>
          {divyangFriendly && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: '#10B981', fontWeight: 700, background: 'rgba(16, 185, 129, 0.15)', padding: '4px 8px', borderRadius: '6px' }}>
              <CheckCircle size={13} /> Wheelchair Accessible
            </span>
          )}
        </div>
        <div style={{ fontWeight: 700, fontSize: '0.94rem', color: 'var(--text-primary)', lineHeight: 1.4, width: '100%' }}>
          {landmark}
        </div>
      </div>
    );
  };

  return (
    <div style={{ marginTop: '28px', marginBottom: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <DoorOpen color="var(--accent-primary)" size={20} />
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          Entry / Exit Gates
        </h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
        View all entry and exit gates at origin and destination stations for convenient access.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Origin Station Gates */}
        {fromStation && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-surface)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
              {fromStation.name} Metro Station Entry / Exit Gates
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {fromGates.map((gate, idx) => renderGateCard(gate, idx))}
            </div>
          </div>
        )}

        {/* Destination Station Gates */}
        {toStation && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px', background: 'var(--bg-surface)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--text-primary)' }}>
              {toStation.name} Metro Station Entry / Exit Gates
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
              {toGates.map((gate, idx) => renderGateCard(gate, idx))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
