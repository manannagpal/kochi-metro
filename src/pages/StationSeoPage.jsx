import React, { useEffect } from 'react';
import { getStationBySlug } from '../utils/slugify.js';
import { METRO_LINES } from '../data/lines.js';
import { OFFICIAL_TRAIN_TIMINGS } from '../data/trainTimings.js';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';
import { getStationGates } from '../data/stationGates.js';
import { Train, Clock, Car, ArrowLeft, DoorOpen, ShieldCheck } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage.jsx';
import { AdSenseUnit } from '../components/AdSenseUnit.jsx';

export function StationSeoPage({ stationSlug, onBackToHome, lang = 'en' }) {
  const station = getStationBySlug(stationSlug);

  useEffect(() => {
    if (!station) return;

    const stationLine = METRO_LINES[station.line];
    const lineName = stationLine ? stationLine.name : station.line;

    const pageTitle = `${station.name} Metro Station Timings, Line & Fare | Kochi Metro`;
    const pageDesc = `Kochi Metro Station (${lineName}): First & last train timetables, gate directions, parking details, line interchanges, and station guide.`;
    const keywords = `${station.name} metro station, ${station.name} metro timings, ${station.name} metro line, kochi metro ${station.name}`;
    const canonicalUrl = `https://kochi.metro.org.in/station/${stationSlug}/`;

    document.title = pageTitle;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = pageDesc;

    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.name = 'keywords';
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.content = keywords;

    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = canonicalUrl;

    window.scrollTo(0, 0);
  }, [station, stationSlug]);

  if (!station) {
    return <NotFoundPage onBackToHome={onBackToHome} />;
  }

  const stationLine = METRO_LINES[station.line] || METRO_LINES.line1;
  const timingData = Object.values(OFFICIAL_TRAIN_TIMINGS)[0] || {};
  const parkingData = Object.values(OFFICIAL_PARKING_RATES)[0] || {};
  const stationGates = getStationGates(station.id, station.name);

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onBackToHome}
          style={{
            background: 'transparent', border: 'none', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Route Finder</span>
        </button>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Station Guide • {station.name}
        </span>
      </div>

      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: stationLine?.color || 'var(--accent-primary)', padding: '14px', borderRadius: '16px', color: '#FFF' }}>
            <Train size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              {station.name} Metro Station
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: '4px 0 0 0' }}>
              Connected Line: <strong>{stationLine?.name || station.line}</strong> • Station ID: {station.id}
            </p>
          </div>
        </div>
      </div>

      <AdSenseUnit slot="station_seo_top" style={{ marginBottom: '24px' }} />

      {/* Details Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        
        {/* Train Timings Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Clock size={20} color="#10B981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Train Operating Schedule
            </h3>
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <div style={{ marginBottom: '10px', padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
              <strong>Mon – Sat:</strong> First train {timingData.weekdays?.firstTrain || '06:00 AM'} | Last train {timingData.weekdays?.lastTrain || '10:00 PM'}
            </div>
            <div style={{ padding: '10px', background: 'var(--input-bg)', borderRadius: '8px' }}>
              <strong>Sundays:</strong> First train {timingData.sundays?.firstTrain || '06:00 AM'} | Last train {timingData.sundays?.lastTrain || '10:00 PM'}
            </div>
          </div>
        </div>

        {/* Gates & Exits Card */}
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <DoorOpen size={20} color="#F59E0B" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Gates & Landmark Exits
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {stationGates.map((g, idx) => (
              <div key={idx} style={{ padding: '10px 12px', borderRadius: '8px', background: 'var(--input-bg)', fontSize: '0.85rem' }}>
                <strong style={{ color: 'var(--accent-primary)' }}>{g.gate}:</strong> {g.landmark}
              </div>
            ))}
          </div>
        </div>

        {/* Parking Facilities Card */}
        {parkingData && parkingData.rates && (
          <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <Car size={20} color="#3B82F6" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                Authorized Parking Rates
              </h3>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', fontSize: '0.82rem' }}>
              <div style={{ padding: '8px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <strong>Car/SUV:</strong> {parkingData.rates.fourWheeler.fullDay}
              </div>
              <div style={{ padding: '8px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <strong>Bike:</strong> {parkingData.rates.twoWheeler.fullDay}
              </div>
              <div style={{ padding: '8px', background: 'var(--input-bg)', borderRadius: '8px' }}>
                <strong>Cycle:</strong> {parkingData.rates.cycle.fullDay}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
