import { StationDetailModal } from '../components/StationDetailModal.jsx';
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

  return <StationDetailModal station={station} onClose={onBackToHome} lang={lang} />;
}
