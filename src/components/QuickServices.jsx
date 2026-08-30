import React, { useState } from 'react';
import { Clock, Car, Moon, Sun, Info, X, Train, Map, Layers } from 'lucide-react';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';
import { OFFICIAL_TRAIN_TIMINGS } from '../data/trainTimings.js';
import { STATIONS } from '../data/stations.js';
import { TRANSLATIONS } from '../utils/i18n.js';

export function QuickServices({ lang = 'en', onOpenMap }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeModal, setActiveModal] = useState(null); // 'timings' | 'parking' | null
  const [timingSearch, setTimingSearch] = useState('');
  const [selectedStationTimings, setSelectedStationTimings] = useState(null);

  return (
    <div style={{ marginBottom: '32px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
        <Clock size={18} color="var(--accent-primary)" />
        <span>Station Services & Maps</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
        
        {/* INTERACTIVE METRO MAP BUTTON */}
        <button
          onClick={onOpenMap}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(229, 46, 45, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <Map size={18} color="#E52E2D" />
            </div>
            <div>
              <div>Interactive Metro Map</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Schematic vector map viewer</div>
            </div>
          </div>
          <Layers size={16} color="#E52E2D" />
        </button>

        {/* FIRST & LAST TRAIN TIMINGS BUTTON */}
        <button
          onClick={() => setActiveModal('timings')}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <Clock size={18} color="#10B981" />
            </div>
            <div>
              <div>First & Last Train Times</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>Official DMRC & NMRC timings</div>
            </div>
          </div>
          <Sun size={16} color="#FBBF24" />
        </button>

        {/* PARKING RATES BUTTON */}
        <button
          onClick={() => setActiveModal('parking')}
          style={{
            background: 'var(--glass-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            fontWeight: 600,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '8px', borderRadius: '10px' }}>
              <Car size={18} color="#3B82F6" />
            </div>
            <div>
              <div>Metro Parking Rates</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 400 }}>4-wheeler, 2-wheeler, cycle rates</div>
            </div>
          </div>
          <Car size={16} color="var(--accent-primary)" />
        </button>

      </div>

      {/* TRAIN TIMINGS MODAL */}
      {activeModal === 'timings' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: '640px', maxHeight: '88vh', overflowY: 'auto',
            padding: '24px', position: 'relative', background: 'var(--bg-surface)', borderRadius: '16px'
          }}>
            <button onClick={() => { setActiveModal(null); setTimingSearch(''); setSelectedStationTimings(null); }} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
              border: '1px solid var(--border-color)', color: 'var(--text-primary)',
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock color="var(--accent-primary)" /> First & Last Train Timings
            </h3>

            {/* Station Timetable Lookup */}
            <div style={{ marginBottom: '20px', background: 'var(--input-bg)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '8px' }}>
                🔍 Search Specific Station Timetable:
              </label>
              <input
                type="text"
                value={timingSearch}
                onChange={(e) => {
                  setTimingSearch(e.target.value);
                  if (e.target.value.trim().length > 1) {
                    const match = STATIONS.find(s => s.name.toLowerCase().includes(e.target.value.trim().toLowerCase()));
                    setSelectedStationTimings(match || null);
                  } else {
                    setSelectedStationTimings(null);
                  }
                }}
                placeholder="Type station name (e.g. New Delhi, Rajiv Chowk, Botanical Garden)..."
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid var(--border-color)', background: 'var(--bg-surface)',
                  color: 'var(--text-primary)', fontSize: '0.9rem'
                }}
              />

              {/* Popular Station Quick Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Popular:</span>
                {['new-delhi', 'rajiv-chowk', 'hauz-khas', 'kashmere-gate', 'botanical-garden'].map(stId => {
                  const st = STATIONS.find(s => s.id === stId);
                  if (!st) return null;
                  return (
                    <button
                      key={st.id}
                      onClick={() => { setSelectedStationTimings(st); setTimingSearch(st.name); }}
                      style={{
                        padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border-color)',
                        background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer'
                      }}
                    >
                      {st.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Display Selected Station Specific Timetable Card */}
            {selectedStationTimings ? (
              <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid #10B981', marginBottom: '20px' }}>
                <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10B981', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>📍 {selectedStationTimings.name} Metro Station Timetable</span>
                  <button onClick={() => setSelectedStationTimings(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}>Clear</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                  <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>First Train Departure:</span>
                    <div style={{ fontWeight: 800, color: '#10B981', fontSize: '1.1rem', marginTop: '2px' }}>
                      {selectedStationTimings.lines.includes('orange') ? '04:45 AM' : (selectedStationTimings.lines.includes('aqua') ? '06:00 AM' : '05:30 AM – 06:02 AM')}
                    </div>
                  </div>
                  <div style={{ background: 'var(--bg-surface)', padding: '10px', borderRadius: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Last Train Departure:</span>
                    <div style={{ fontWeight: 800, color: '#EF4444', fontSize: '1.1rem', marginTop: '2px' }}>
                      {selectedStationTimings.lines.includes('aqua') ? '10:00 PM' : '11:30 PM – 11:57 PM'}
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  * Services run continuously between peak frequency (2.5–5 mins). Sunday morning services start at 08:00 AM.
                </div>
              </div>
            ) : null}

            {/* Operator Default Timings Summary */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {Object.values(OFFICIAL_TRAIN_TIMINGS).map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
                    {item.operator}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Weekdays First Train:</span>
                      <div style={{ fontWeight: 700, color: '#10B981' }}>{item.weekdays.firstTrain}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Weekdays Last Train:</span>
                      <div style={{ fontWeight: 700, color: '#EF4444' }}>{item.weekdays.lastTrain}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Sunday First Train:</span>
                      <div style={{ fontWeight: 700, color: '#10B981' }}>{item.sundays.firstTrain}</div>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Sunday Last Train:</span>
                      <div style={{ fontWeight: 700, color: '#EF4444' }}>{item.sundays.lastTrain}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                    {item.notes}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PARKING RATES MODAL */}
      {activeModal === 'parking' && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div className="glass-panel animate-fade-in" style={{
            width: '100%', maxWidth: '640px', maxHeight: '85vh', overflowY: 'auto',
            padding: '24px', position: 'relative', background: 'var(--bg-surface)'
          }}>
            <button onClick={() => setActiveModal(null)} style={{
              position: 'absolute', top: '16px', right: '16px', background: 'var(--input-bg)',
              border: '1px solid var(--border-color)', color: 'var(--text-primary)',
              width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
            }}>
              <X size={18} />
            </button>

            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Car color="var(--accent-primary)" /> Official Metro Parking Rates
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {Object.values(OFFICIAL_PARKING_RATES).map((item, idx) => (
                <div key={idx} style={{
                  padding: '16px', background: 'var(--input-bg)', border: '1px solid var(--border-color)', borderRadius: '12px'
                }}>
                  <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '10px' }}>
                    {item.operator}
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginBottom: '10px' }}>
                    <thead>
                      <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                        <th style={{ padding: '6px 8px' }}>Vehicle</th>
                        <th style={{ padding: '6px 8px' }}>Up to 6h</th>
                        <th style={{ padding: '6px 8px' }}>Up to 12h</th>
                        <th style={{ padding: '6px 8px' }}>Full Day</th>
                        <th style={{ padding: '6px 8px' }}>Monthly Pass</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 600 }}>Car / Taxi</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.fourWheeler.upTo6h}</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.fourWheeler.upTo12h}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700 }}>{item.rates.fourWheeler.fullDay}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--accent-primary)', fontWeight: 600 }}>{item.rates.fourWheeler.monthly}</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                        <td style={{ padding: '6px 8px', fontWeight: 600 }}>Two-Wheeler</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.twoWheeler.upTo6h}</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.twoWheeler.upTo12h}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700 }}>{item.rates.twoWheeler.fullDay}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--accent-primary)', fontWeight: 600 }}>{item.rates.twoWheeler.monthly}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '6px 8px', fontWeight: 600 }}>Cycle</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.cycle.upTo6h}</td>
                        <td style={{ padding: '6px 8px' }}>{item.rates.cycle.upTo12h}</td>
                        <td style={{ padding: '6px 8px', fontWeight: 700 }}>{item.rates.cycle.fullDay}</td>
                        <td style={{ padding: '6px 8px', color: 'var(--accent-primary)', fontWeight: 600 }}>{item.rates.cycle.monthly}</td>
                      </tr>
                    </tbody>
                  </table>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <strong>Night Parking:</strong> {item.nightParking}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
