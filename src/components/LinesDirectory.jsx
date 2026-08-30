import React, { useState } from 'react';
import { Layers, X, ChevronRight } from 'lucide-react';
import { METRO_LINES } from '../data/lines.js';
import { LINE_SEQUENCES } from '../data/connections.js';
import { getCleanLineName, getStationById } from '../utils/stationSearch.js';

export function LinesDirectory({ onClose, onSelectStation }) {
  const lineKeys = Object.keys(METRO_LINES);
  const [selectedLineId, setSelectedLineId] = useState(lineKeys[0] || 'line1');

  const selectedLine = METRO_LINES[selectedLineId] || METRO_LINES[lineKeys[0]];
  const lineSequence = LINE_SEQUENCES[selectedLineId] || [];
  const lineStations = lineSequence.map(id => getStationById(id)).filter(Boolean);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '840px', height: '88vh',
        display: 'flex', flexDirection: 'column', position: 'relative',
        background: 'var(--bg-surface)', borderRadius: '16px', overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px', borderBottom: '1px solid var(--border-color)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--input-bg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: '#005DAA', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Kochi Metro Lines
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Explore line colors, terminals, and ordered station lists
              </span>
            </div>
          </div>

          <button type="button" onClick={onClose} style={{
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
            padding: 0,
            margin: 0,
            background: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
            width: '36px', height: '36px', borderRadius: '50%', display: 'grid', placeItems: 'center', 
            padding: 0,
            margin: 0,
            
             cursor: 'pointer'
          }}>
            <X size={18} style={{ display: 'block', margin: 'auto' }} />
          </button>
        </div>

        {/* Main Split Content */}
        <div className="lines-directory-split">
          {/* Left Line Selector List */}
          <div className="lines-directory-sidebar">
            <div className="lines-directory-list">
              {Object.values(METRO_LINES).map(line => {
                const isSelected = selectedLineId === line.id;

                return (
                  <button
                    key={line.id}
                    onClick={() => setSelectedLineId(line.id)}
                    style={{
                      width: '100%', padding: '12px 14px', borderRadius: '10px',
                      border: '1px solid', borderColor: isSelected ? line.color : 'var(--border-color)',
                      background: isSelected ? 'var(--bg-surface)' : 'var(--input-bg)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: line.color, display: 'inline-block' }} />
                      <span style={{ fontSize: '0.88rem', fontWeight: isSelected ? 800 : 600, color: 'var(--text-primary)' }}>
                        {line.name}
                      </span>
                    </div>

                    <ChevronRight size={16} color={isSelected ? line.color : 'var(--text-muted)'} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Station Sequence Details */}
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
            <div style={{
              padding: '16px', borderRadius: '12px', background: selectedLine.color, color: '#FFF',
              marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                {selectedLine.name} ({lineStations.length} Stations)
              </h4>
              <p style={{ fontSize: '0.85rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                Terminals: {selectedLine.terminals[0]} ↔ {selectedLine.terminals[1]}
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lineStations.map((st, idx) => (
                <div
                  key={st.id}
                  onClick={() => {
                    if (onSelectStation) onSelectStation(st);
                    onClose();
                  }}
                  style={{
                    padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    cursor: 'pointer', transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--text-muted)', width: '24px' }}>
                      {idx + 1}.
                    </span>
                    <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {st.name}
                    </span>
                  </div>

                  {st.isInterchange && (
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '6px', background: '#FEF3C7', color: '#D97706', fontWeight: 700 }}>
                      Interchange
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
