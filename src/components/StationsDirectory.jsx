import React, { useState } from 'react';
import { Search, Train, X } from 'lucide-react';
import { STATIONS } from '../data/stations.js';
import { METRO_LINES } from '../data/lines.js';
import { getCleanLineName } from '../utils/stationSearch.js';

export function StationsDirectory({ onClose, onSelectStation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLineFilter, setSelectedLineFilter] = useState('all');

  const filteredStations = STATIONS.filter(st => {
    const matchesSearch = st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.aliases && st.aliases.some(a => a.toLowerCase().includes(searchQuery.toLowerCase())));
    const matchesLine = selectedLineFilter === 'all' || st.line === selectedLineFilter;
    return matchesSearch && matchesLine;
  });

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '800px', height: '88vh',
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
            <div style={{ background: 'var(--accent-primary)', padding: '8px', borderRadius: '10px', color: '#FFF' }}>
              <Train size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Kochi Metro Stations Directory ({STATIONS.length} Stations)
              </h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Browse all stations, lines, timetables, and interchanges
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

        {/* Search & Filter Bar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search station by name or code..."
              style={{
                width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px',
                border: '1px solid var(--border-color)', background: 'var(--bg-surface)',
                color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
              }}
            />
          </div>

          <select
            value={selectedLineFilter}
            onChange={(e) => setSelectedLineFilter(e.target.value)}
            style={{
              padding: '10px 14px', borderRadius: '10px', border: '1px solid var(--border-color)',
              background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none'
            }}
          >
            <option value="all">All Metro Lines ({Object.keys(METRO_LINES).length} Lines)</option>
            {Object.entries(METRO_LINES).map(([key, line]) => (
              <option key={key} value={key}>{line.name}</option>
            ))}
          </select>
        </div>

        {/* Station Cards Grid */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
            {filteredStations.map(st => {
              const lineDef = METRO_LINES[st.line];
              const badgeColor = lineDef ? lineDef.color : 'var(--accent-primary)';
              const badgeText = lineDef ? lineDef.name : getCleanLineName(st.line);

              return (
                <div
                  key={st.id}
                  onClick={() => {
                    if (onSelectStation) onSelectStation(st);
                    onClose();
                  }}
                  style={{
                    padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)', cursor: 'pointer', transition: 'all 0.15s ease',
                    display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px',
                        backgroundColor: badgeColor, color: '#FFFFFF'
                      }}>
                        {badgeText}
                      </span>
                      {st.isInterchange && (
                        <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: '#FEF3C7', color: '#D97706', fontWeight: 700 }}>
                          Interchange
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                      {st.name}
                    </div>
                  </div>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border-color)', paddingTop: '8px', marginTop: '10px' }}>
                    View Timings & Gate Guide →
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
