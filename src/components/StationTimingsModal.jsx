import React, { useState, useRef, useEffect } from 'react';
import { Clock, Search, X, Navigation } from 'lucide-react';
import { STATIONS } from '../data/stations.js';
import { getStationDirectionalTimings } from '../data/stationTimings.js';
import { getCleanLineName } from '../utils/stationSearch.js';

export function StationTimingsModal({ onClose, defaultStation }) {
  const [selectedStation, setSelectedStation] = useState(defaultStation || STATIONS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef(null);

  const alphabeticalStations = [...STATIONS].sort((a, b) => a.name.localeCompare(b.name));

  const filteredStations = searchQuery.trim().length > 0
    ? STATIONS.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).sort((a, b) => a.name.localeCompare(b.name))
    : alphabeticalStations;

  const directionalTimings = selectedStation ? getStationDirectionalTimings(selectedStation) : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '12px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%', maxWidth: '720px', maxHeight: '88vh', overflowY: 'auto',
        padding: '18px 14px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '14px', right: '14px', background: 'var(--input-bg)',
          border: '1px solid var(--border-color)', color: 'var(--text-primary)',
          width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
        }}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', paddingRight: '40px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '10px', borderRadius: '12px', flexShrink: 0 }}>
            <Clock size={22} color="#10B981" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              Station First & Last Train Timetables
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Direction-wise departure timings per station & line
            </span>
          </div>
        </div>

        {/* Station Search Input */}
        <div ref={containerRef} style={{ position: 'relative', marginBottom: '16px' }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            onClick={() => setShowDropdown(true)}
            placeholder="Select or search station (e.g. Aluva, Edapally, Tripunithura)..."
            style={{
              width: '100%', padding: '12px 14px 12px 38px', borderRadius: '10px',
              border: '1px solid var(--border-color)', background: 'var(--input-bg)',
              color: 'var(--text-primary)', fontSize: '0.92rem', outline: 'none'
            }}
          />
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />

          {/* Alphabetical Autocomplete Dropdown */}
          {showDropdown && filteredStations.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, marginTop: '4px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-color)', borderRadius: '10px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.25)', maxHeight: '240px', overflowY: 'auto'
            }}>
              {filteredStations.map(st => (
                <div
                  key={st.id}
                  onClick={() => {
                    setSelectedStation(st);
                    setSearchQuery('');
                    setShowDropdown(false);
                  }}
                  style={{
                    padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid var(--border-color)',
                    fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--input-bg)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  📍 {st.name}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Station Timetable Display Card */}
        {selectedStation && (
          <div className="glass-panel" style={{ padding: '14px 12px', borderRadius: '14px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  📍 {selectedStation.name} Metro Station
                </h4>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  Station-specific first and last train departure schedule
                </span>
              </div>
            </div>

            {/* Directional Timetables per Line */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {directionalTimings.map((item, idx) => (
                <div key={idx} style={{ background: 'var(--bg-surface)', padding: '14px 12px', borderRadius: '12px', borderLeft: `4px solid ${item.line.color}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.line.color, flexShrink: 0 }} />
                    <span>{getCleanLineName(item.line)}</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>({item.frequency})</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: '10px' }}>
                    {/* Direction A */}
                    <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        <Navigation size={12} style={{ flexShrink: 0 }} /> Towards {item.directionA.terminal}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>First Train:</span>
                          <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{item.directionA.firstTrainWeekdays}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Last Train:</span>
                          <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{item.directionA.lastTrainWeekdays}</div>
                        </div>
                      </div>
                    </div>

                    {/* Direction B */}
                    <div style={{ background: 'var(--input-bg)', padding: '10px 12px', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                        <Navigation size={12} style={{ flexShrink: 0 }} /> Towards {item.directionB.terminal}
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>First Train:</span>
                          <div style={{ fontWeight: 800, color: '#10B981', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{item.directionB.firstTrainWeekdays}</div>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)' }}>Last Train:</span>
                          <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>{item.directionB.lastTrainWeekdays}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    * Sunday First Train starts at {item.directionA.firstTrainSunday}.
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
