import React, { useState } from 'react';
import { X, Train, ArrowRightLeft, Clock, Car, Info, Calendar, DoorOpen, CheckCircle } from 'lucide-react';
import { METRO_LINES } from '../data/lines.js';
import { INTERCHANGES } from '../data/interchanges.js';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';
import { OFFICIAL_TRAIN_TIMINGS } from '../data/trainTimings.js';
import { getStationGates } from '../data/stationGates.js';
import { TRANSLATIONS } from '../utils/i18n.js';

export function StationDetailModal({ station, onClose, lang = 'en', isFullPage = false }) {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;
  const [activeTab, setActiveTab] = useState('timings'); // 'timings' | 'gates' | 'parking'

  if (!station) return null;

  const interchangeInfo = INTERCHANGES[station.id];
  const stationGates = getStationGates(station.id, station.name);

  // Determine operator key
  const stationLines = (station.lines || []).map(lineId => METRO_LINES[lineId]).filter(Boolean);
  const operators = stationLines.map(l => l.operator);
  const isAirportExpress = (station.lines || []).includes('orange');
  const operatorKey = isAirportExpress
    ? 'AIRPORT_EXPRESS'
    : (operators.includes('NMRC') ? 'NMRC' : (operators.includes('RMGL') ? 'RMGL' : 'DMRC'));

  const timingData = OFFICIAL_TRAIN_TIMINGS[operatorKey] || OFFICIAL_TRAIN_TIMINGS.DMRC;
  const parkingData = OFFICIAL_PARKING_RATES[operatorKey] || OFFICIAL_PARKING_RATES.DMRC;

  const cardContent = (
      <div
        className="glass-panel animate-fade-in"
        onClick={(e) => !isFullPage && e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: isFullPage ? '850px' : '560px',
          maxHeight: isFullPage ? 'none' : '90vh',
          overflowY: isFullPage ? 'visible' : 'auto',
          padding: isFullPage ? '28px' : '24px',
          position: 'relative',
          background: 'var(--bg-surface)',
          borderRadius: '24px',
          boxShadow: isFullPage ? 'var(--shadow-md)' : 'var(--shadow-xl)',
          border: '1px solid var(--border-color)',
          margin: isFullPage ? '0 auto' : '0'
        }}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close station modal"
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--input-bg)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'grid',
            placeItems: 'center',
            padding: 0,
            margin: 0,
            cursor: 'pointer',
            WebkitAppearance: 'none',
            appearance: 'none',
            outline: 'none',
            transition: 'all 0.2s ease'
          }}
        >
          <X size={18} style={{ display: 'block', margin: 'auto' }} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', paddingRight: '44px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              background: 'var(--accent-primary)',
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Train size={26} color="#FFF" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                {station.name}
              </h3>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {timingData.operator || 'Delhi Metro (DMRC)'} • Station ID: {station.id}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Bar */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          borderBottom: '1px solid var(--border-color)',
          paddingBottom: '12px'
        }}>
          <button type="button"
            onClick={() => setActiveTab('timings')}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'timings' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'timings' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Clock size={15} />
            <span>Train Timings</span>
          </button>
          <button type="button"
            onClick={() => setActiveTab('gates')}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'gates' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'gates' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <DoorOpen size={15} />
            <span>Gates & Facilities</span>
          </button>
          <button type="button"
            onClick={() => setActiveTab('parking')}
            style={{
              padding: '9px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === 'parking' ? 'var(--accent-primary)' : 'transparent',
              color: activeTab === 'parking' ? '#FFF' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <Car size={15} />
            <span>Parking Rates</span>
          </button>
        </div>

        {/* GATES & FACILITIES TAB */}
        {activeTab === 'gates' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Metro Lines Section */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 600 }}>
                {t.linesAvailable}
              </h4>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {stationLines.map(lineDef => (
                  <div key={lineDef.id} style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    backgroundColor: `${lineDef.color}25`,
                    border: `1px solid ${lineDef.color}`,
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: lineDef.color }} />
                    <span>{lineDef.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interchange Section */}
            {station.interchange && (
              <div style={{
                padding: '14px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: 'var(--accent-primary)', fontSize: '0.9rem', marginBottom: '4px' }}>
                  <ArrowRightLeft size={16} />
                  <span>{t.interchangeInfo}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                  {interchangeInfo ? interchangeInfo.description : 'Interchange station with line transfer connections.'}
                </p>
              </div>
            )}

            {/* Entry / Exit Gates Section */}
            <div>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '10px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DoorOpen size={16} color="var(--accent-primary)" />
                <span>Entry / Exit Gate Directory</span>
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {stationGates.map((gate, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--input-bg)',
                      padding: '12px 14px',
                      borderRadius: '10px',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <span style={{
                        background: 'var(--accent-primary)',
                        color: '#FFFFFF',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        marginRight: '8px',
                        display: 'inline-block'
                      }}>
                        {gate.gateNo}
                      </span>
                      <span style={{ fontSize: '0.86rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                        {gate.landmark}
                      </span>
                    </div>
                    {gate.divyangFriendly && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        fontSize: '0.72rem',
                        color: '#10B981',
                        fontWeight: 700,
                        background: 'rgba(16, 185, 129, 0.15)',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        whiteSpace: 'nowrap',
                        flexShrink: 0
                      }}>
                        <CheckCircle size={12} /> Accessible
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TIMINGS TAB */}
        {activeTab === 'timings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Mon - Sat Schedule */}
            <div style={{
              padding: '16px 18px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Calendar size={18} color="var(--accent-primary)" />
                <span>Mon – Sat Operating Schedule</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>FIRST TRAIN</div>
                  <div style={{ fontWeight: 800, color: '#10B981', marginTop: '4px', fontSize: '1rem' }}>{timingData.weekdays.firstTrain}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>LAST TRAIN</div>
                  <div style={{ fontWeight: 800, color: '#EF4444', marginTop: '4px', fontSize: '1rem' }}>{timingData.weekdays.lastTrain}</div>
                </div>
              </div>
            </div>

            {/* Sunday Schedule */}
            <div style={{
              padding: '16px 18px',
              background: 'var(--input-bg)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '14px', marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)' }}>
                <Calendar size={18} color="#F59E0B" />
                <span>Sunday & National Holiday Schedule</span>
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', fontSize: '0.9rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>SUNDAY FIRST TRAIN</div>
                  <div style={{ fontWeight: 800, color: '#10B981', marginTop: '4px', fontSize: '1rem' }}>{timingData.sundays.firstTrain}</div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>SUNDAY LAST TRAIN</div>
                  <div style={{ fontWeight: 800, color: '#EF4444', marginTop: '4px', fontSize: '1rem' }}>{timingData.sundays.lastTrain}</div>
                </div>
              </div>
            </div>

            {/* Frequency Banner */}
            <div style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              background: 'rgba(59, 130, 246, 0.08)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              padding: '14px 16px',
              borderRadius: '14px'
            }}>
              <strong style={{ color: 'var(--text-primary)' }}>Peak Frequency:</strong> {timingData.frequency}<br />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px', display: 'inline-block' }}>
                {timingData.notes}
              </span>
            </div>
          </div>
        )}

        {/* PARKING TAB */}
        {activeTab === 'parking' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Car size={18} color="var(--accent-primary)" />
              <span>Official Parking Rates & Tariffs ({parkingData.operator})</span>
            </h4>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--input-bg)', textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Vehicle</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Up to 6h</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Up to 12h</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Full Day</th>
                  <th style={{ padding: '8px 10px', fontWeight: 700 }}>Monthly</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Car / Taxi</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.fourWheeler.upTo6h}</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.fourWheeler.upTo12h}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>{parkingData.rates.fourWheeler.fullDay}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--accent-primary)', fontWeight: 600 }}>{parkingData.rates.fourWheeler.monthly}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>2-Wheeler</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.twoWheeler.upTo6h}</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.twoWheeler.upTo12h}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>{parkingData.rates.twoWheeler.fullDay}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--accent-primary)', fontWeight: 600 }}>{parkingData.rates.twoWheeler.monthly}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>Bicycle</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.cycle.upTo6h}</td>
                  <td style={{ padding: '8px 10px' }}>{parkingData.rates.cycle.upTo12h}</td>
                  <td style={{ padding: '8px 10px', fontWeight: 700 }}>{parkingData.rates.cycle.fullDay}</td>
                  <td style={{ padding: '8px 10px', color: 'var(--accent-primary)', fontWeight: 600 }}>{parkingData.rates.cycle.monthly}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', background: 'var(--input-bg)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Night Parking Policy:</div>
              <div>{parkingData.nightParking}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {parkingData.notes}
              </div>
            </div>
          </div>
        )}

      </div>
    );

    if (isFullPage) {
      return (
        <div style={{ padding: '24px 16px 40px 16px', maxWidth: '850px', margin: '0 auto' }}>
          {cardContent}
        </div>
      );
    }

    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 4000, padding: '16px'
        }}
      >
        {cardContent}
      </div>
    );
  }