import React, { useState } from 'react';
import { X, Train, ArrowRightLeft, Clock, Car, Info, Calendar, DoorOpen, CheckCircle } from 'lucide-react';
import { METRO_LINES } from '../data/lines.js';
import { INTERCHANGES } from '../data/interchanges.js';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';
import { OFFICIAL_TRAIN_TIMINGS } from '../data/trainTimings.js';
import { getStationGates } from '../data/stationGates.js';
import { TRANSLATIONS } from '../utils/i18n.js';

export function StationDetailModal({ station, onClose, lang = 'en' }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('timings'); // 'timings' | 'gates' | 'parking'

  if (!station) return null;

  const interchangeInfo = INTERCHANGES[station.id];
  const stationGates = getStationGates(station.id, station.name);

  const timingData = Object.values(OFFICIAL_TRAIN_TIMINGS)[0] || {};
  const parkingData = Object.values(OFFICIAL_PARKING_RATES)[0];

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 4000, padding: '16px'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        position: 'relative',
        background: 'var(--bg-surface)'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justify: 'center',
            cursor: 'pointer'
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            background: 'var(--accent-primary)',
            padding: '12px',
            borderRadius: '14px',
            color: '#FFFFFF'
          }}>
            <Train size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {station.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Code: {station.code}</span>
              {station.isInterchange && (
                <span style={{
                  fontSize: '0.72rem',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  background: '#FEF3C7',
                  color: '#D97706',
                  fontWeight: 700
                }}>
                  Interchange Hub
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setActiveTab('timings')}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              background: activeTab === 'timings' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'timings' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Clock size={15} />
            <span>Train Timings</span>
          </button>

          <button
            onClick={() => setActiveTab('gates')}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              background: activeTab === 'gates' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'gates' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <DoorOpen size={15} />
            <span>Gates & Exits</span>
          </button>

          <button
            onClick={() => setActiveTab('parking')}
            style={{
              padding: '8px 14px', borderRadius: '8px', border: 'none',
              background: activeTab === 'parking' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'parking' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
            }}
          >
            <Car size={15} />
            <span>Parking Rates</span>
          </button>
        </div>

        {/* TAB 1: TRAIN TIMINGS */}
        {activeTab === 'timings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', background: 'var(--input-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#10B981', fontWeight: 700, fontSize: '0.9rem' }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <span>Mon – Sat Operating Schedule</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>First Train</div>
                  <div style={{ fontWeight: 800, color: '#10B981' }}>{timingData.weekdays?.firstTrain || '06:50 AM'}</div>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Last Train</div>
                  <div style={{ fontWeight: 800, color: '#EF4444' }}>{timingData.weekdays?.lastTrain || '09:40 PM'}</div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '16px', borderRadius: '12px', background: 'var(--input-bg)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#F59E0B', fontWeight: 700, fontSize: '0.9rem' }}>
                <Calendar size={18} color="#F59E0B" />
                <span>Sunday Operating Schedule</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.88rem' }}>
                <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>First Train</div>
                  <div style={{ fontWeight: 800, color: '#10B981' }}>{timingData.sundays?.firstTrain || '09:00 AM'}</div>
                </div>
                <div style={{ padding: '10px', background: 'var(--bg-surface)', borderRadius: '8px' }}>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Last Train</div>
                  <div style={{ fontWeight: 800, color: '#EF4444' }}>{timingData.sundays?.lastTrain || '09:40 PM'}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '10px' }}>
                Frequency: Every 5 – 7 mins (Peak) / 10 – 15 mins (Off-Peak).
              </div>
            </div>

            {interchangeInfo && (
              <div style={{ padding: '14px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B', fontSize: '0.85rem' }}>
                <strong>Interchange Hub Guide:</strong> {interchangeInfo.description}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: GATES & LANDMARKS */}
        {activeTab === 'gates' && (
          <div>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Official Gates & Landmark Exits:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {stationGates.map((g, idx) => (
                <div key={idx} style={{ padding: '12px 14px', borderRadius: '10px', background: 'var(--input-bg)', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--accent-primary)', marginBottom: '2px' }}>
                    {g.gate}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    Exits to: {g.landmark}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PARKING RATES */}
        {activeTab === 'parking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              {parkingData.operator} - Authorized Parking Rates
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>Car / SUV</div>
                <div>Day: {parkingData.rates.fourWheeler.fullDay}</div>
                <div>Pass: {parkingData.rates.fourWheeler.monthly}</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#F59E0B' }}>Bike</div>
                <div>Day: {parkingData.rates.twoWheeler.fullDay}</div>
                <div>Pass: {parkingData.rates.twoWheeler.monthly}</div>
              </div>
              <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <div style={{ fontWeight: 700, color: '#10B981' }}>Cycle</div>
                <div>Day: {parkingData.rates.cycle.fullDay}</div>
                <div>Pass: {parkingData.rates.cycle.monthly}</div>
              </div>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
              {parkingData.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
