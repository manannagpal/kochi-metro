import React, { useEffect } from "react";
import { getStationBySlug } from "../utils/slugify.js";
import { calculateRoutes } from "../routing/routeEngine.js";
import { StationTimeline } from "../components/StationTimeline.jsx";
import { AdSenseUnit } from "../components/AdSenseUnit.jsx";
import { Clock, Banknote, MapPin, ArrowLeft, Repeat } from "lucide-react";

export function RouteSeoPage({ fromSlug, toSlug, onResetSearch }) {
  const fromStation = getStationBySlug(fromSlug);
  const toStation = getStationBySlug(toSlug);

  const routes = (fromStation && toStation) ? calculateRoutes(fromStation.id, toStation.id) : [];
  const primaryRoute = routes[0];

  useEffect(() => {
    if (!fromStation || !toStation || !primaryRoute) return;

    const pageTitle = `${fromStation.name} to ${toStation.name} Metro Route, Fare (₹${primaryRoute.fare}) & Time - Kochi Metro`;
    const pageDesc = `Kochi Metro route from ${fromStation.name} to ${toStation.name}. Distance: ${primaryRoute.totalDistanceKm} km, Token Fare: ₹${primaryRoute.fare} (Smart Card: ₹${primaryRoute.smartCardFare}), Travel Time: ${primaryRoute.totalTimeMins} mins with ${primaryRoute.switches} line changes.`;
    const canonicalUrl = `https://kochi.metro.org.in/route/${fromSlug}/${toSlug}/`;

    document.title = pageTitle;

    let metaDescEl = document.querySelector("meta[name=\"description\"]");
    if (!metaDescEl) {
      metaDescEl = document.createElement("meta");
      metaDescEl.name = "description";
      document.head.appendChild(metaDescEl);
    }
    metaDescEl.content = pageDesc;

    let canonicalEl = document.querySelector("link[rel=\"canonical\"]");
    if (!canonicalEl) {
      canonicalEl = document.createElement("link");
      canonicalEl.rel = "canonical";
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalUrl;

    let schemaEl = document.getElementById("seo-jsonld");
    if (!schemaEl) {
      schemaEl = document.createElement("script");
      schemaEl.id = "seo-jsonld";
      schemaEl.type = "application/ld+json";
      document.head.appendChild(schemaEl);
    }

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Trip",
          "name": `${fromStation.name} to ${toStation.name} Metro Route`,
          "description": pageDesc,
          "offers": {
            "@type": "Offer",
            "price": primaryRoute.fare.toString(),
            "priceCurrency": "INR"
          }
        }
      ]
    };
    schemaEl.textContent = JSON.stringify(schemaData);

    window.scrollTo(0, 0);
  }, [fromStation, toStation, primaryRoute, fromSlug, toSlug]);

  if (!fromStation || !toStation || !primaryRoute) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <h2>Route Not Found</h2>
        <button onClick={onResetSearch} style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={onResetSearch}
          style={{
            background: 'transparent', border: 'none', color: 'var(--accent-primary)',
            display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer'
          }}
        >
          <ArrowLeft size={18} />
          <span>Back to Home</span>
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
          {fromStation.name} to {toStation.name} Metro Route
        </h1>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: '6px 0 0 0' }}>
          Travel Time: <strong>{primaryRoute.totalTimeMins} mins</strong> • Distance: <strong>{primaryRoute.totalDistanceKm} km</strong> • Fare: <strong>₹{primaryRoute.fare}</strong>
        </p>
      </div>

      <StationTimeline route={primaryRoute} />
    </div>
  );
}
