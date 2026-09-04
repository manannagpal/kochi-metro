import React, { useEffect } from 'react';
import { getStationBySlug } from '../utils/slugify.js';
import { METRO_LINES } from '../data/lines.js';
import { INTERCHANGES } from '../data/interchanges.js';
import { OFFICIAL_PARKING_RATES } from '../data/parkingInfo.js';
import { OFFICIAL_TRAIN_TIMINGS } from '../data/trainTimings.js';
import { getStationGates } from '../data/stationGates.js';
import { getStationDirectionalTimings } from '../data/stationTimings.js';
import { TRANSLATIONS } from '../utils/i18n.js';
import { Train, Clock, Car, Info, ArrowLeft, ArrowRightLeft, ShieldCheck, Phone, CheckCircle2, Compass } from 'lucide-react';

import { NotFoundPage } from './NotFoundPage.jsx';
import { AdSenseUnit } from '../components/AdSenseUnit.jsx';
import { StationDetailModal } from '../components/StationDetailModal.jsx';

export function StationSeoPage({ stationSlug, onBackToHome, lang = 'en' }) {
  const station = getStationBySlug(stationSlug);
  const gates = station ? getStationGates(station.id, station.name) : [];
  const directionalTimings = station ? getStationDirectionalTimings(station) : [];

  useEffect(() => {
    if (!station) return;

    const stationLines = (station.lines || []).map(lineId => METRO_LINES[lineId]).filter(Boolean);
    const lineNames = stationLines.map(l => l.name).join(', ');

    const timingInfo = directionalTimings && directionalTimings.length > 0 ? directionalTimings[0] : null;
    const firstTrainStr = timingInfo ? timingInfo.directionA.firstTrainWeekdays : '05:30 AM';
    const lastTrainStr = timingInfo ? timingInfo.directionA.lastTrainWeekdays : '11:30 PM';

    const pageTitle = `${station.name} Metro Station Timings, Lines, Fare & Parking | Kochi Metro`;
    const pageDesc = `${station.name} Metro Station (${lineNames}): First train at ${firstTrainStr} (weekdays) / 08:00 AM (Sundays), last train at ${lastTrainStr}. Check platform timetables, fare, parking rates & gate guide.`;
    const keywords = `${station.name} metro station, ${station.name} metro first train timing, ${station.name} metro last train timing, ${station.name} metro parking charges, ${station.name} metro lines, kochi metro ${station.name}`;
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

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Scroll window to top on station page mount or slug change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [station, stationSlug]);

  if (!station) {
    return <NotFoundPage lang={lang} onNavigate={onBackToHome} />;
  }

  return <StationDetailModal station={station} onClose={onBackToHome} lang={lang} isFullPage={true} />;
}
