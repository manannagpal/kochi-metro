import React, { useEffect } from 'react';
import { getStationBySlug } from '../utils/slugify.js';
import { METRO_LINES } from '../data/lines.js';
import { getStationDirectionalTimings } from '../data/stationTimings.js';
import { Train, Clock, Car, ArrowLeft, ShieldCheck, Compass } from 'lucide-react';
import { NotFoundPage } from './NotFoundPage.jsx';
import { AdSenseUnit } from '../components/AdSenseUnit.jsx';

export function StationSeoPage({ stationSlug, onBackToHome, lang = 'en' }) {
  const station = getStationBySlug(stationSlug);
  const directionalTimings = station ? getStationDirectionalTimings(station) : [];

  useEffect(() => {
    if (!station) return;

    const stationLine = METRO_LINES[station.line];
    const lineName = stationLine ? stationLine.name : station.line;

    const timingInfo = directionalTimings && directionalTimings.length > 0 ? directionalTimings[0] : null;
    const firstTrainStr = timingInfo ? timingInfo.directionA.firstTrainWeekdays : '05:30 AM';
    const lastTrainStr = timingInfo ? timingInfo.directionA.lastTrainWeekdays : '11:30 PM';

    const pageTitle = `${station.name} Metro Station Timings, Line & Fare | Kochi Metro`;
    const pageDesc = `Kochi Metro Station (${lineName}): First train at ${firstTrainStr} (weekdays), last train at ${lastTrainStr}. Check platform timetables, fare, and station guide.`;
    const keywords = `${station.name} metro station, ${station.name} metro first train timing, ${station.name} metro last train timing, ${station.name} metro line, mumbai metro ${station.name}`;
    const canonicalUrl = `https://mumbai.metro.org.in/station/${stationSlug}/`;

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
  }, [station, stationSlug, directionalTimings]);

  if (!station) {
    return <NotFoundPage onBackToHome={onBackToHome} />;
  }

  const stationLine = METRO_LINES[station.line];

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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Clock size={20} color="#10B981" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Train Timings & Schedule
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            First train arrives at <strong>05:30 AM</strong> and last train departs at <strong>11:30 PM</strong> on weekdays. Frequency ranges between 3 to 10 minutes depending on peak hours.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <Car size={20} color="#3B82F6" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
              Parking Facilities
            </h3>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            Standard Kochi Metro authorized parking available for 2-wheelers, 4-wheelers, and bicycles with 6h, 12h, full-day, and monthly pass options.
          </p>
        </div>
      </div>
    </div>
  );
}
