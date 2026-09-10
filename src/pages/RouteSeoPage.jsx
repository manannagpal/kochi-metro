import React, { useEffect, useState, useMemo } from "react";
import { getStationBySlug } from "../utils/slugify.js";
import { calculateRoutes } from "../routing/routeEngine.js";
import { StationTimeline } from "../components/StationTimeline.jsx";
import { StationGates } from "../components/StationGates.jsx";
import { AdSenseUnit } from "../components/AdSenseUnit.jsx";
import { Clock, Banknote, MapPin, ArrowLeft, Repeat, Navigation, ChevronDown, ChevronUp } from "lucide-react";

export function RouteSeoPage({ fromSlug, toSlug, onResetSearch, onOpenPlanner }) {
  const fromStation = getStationBySlug(fromSlug);
  const toStation = getStationBySlug(toSlug);

  const routes = useMemo(() => {
    return (fromStation && toStation) ? calculateRoutes(fromStation.id, toStation.id) : [];
  }, [fromStation?.id, toStation?.id]);

  const primaryRoute = routes[0];

  // Option 1 (index 0) expanded by default!
  const [expandedIndices, setExpandedIndices] = useState(() => new Set([0]));

  const toggleRouteExpand = (idx) => {
    setExpandedIndices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  useEffect(() => {
    if (!fromStation || !toStation || !primaryRoute) return;

    const pageTitle = `${fromStation.name} to ${toStation.name} Metro Route, Fare (₹${primaryRoute.fare}) & Travel Time | Kochi Metro`;
    const pageDesc = routes.length > 1
      ? `Kochi Metro route from ${fromStation.name} to ${toStation.name}. Compare ${routes.length} available route options: Fastest takes ${primaryRoute.totalTimeMins} mins (₹${primaryRoute.fare}, ${primaryRoute.switches} switches). Full station list, fares & platform interchange guide.`
      : `Kochi Metro route from ${fromStation.name} to ${toStation.name}. Distance: ${primaryRoute.totalDistanceKm} km, Token Fare: ₹${primaryRoute.fare} (Smart Card: ₹${primaryRoute.smartCardFare || primaryRoute.fare}), Travel Time: ${primaryRoute.totalTimeMins} mins with ${primaryRoute.switches} line changes.`;
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
          "offers": routes.map(r => ({
            "@type": "Offer",
            "price": r.fare.toString(),
            "priceCurrency": "INR"
          }))
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": `What is the metro fare from ${fromStation.name} to ${toStation.name}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The standard token fare from ${fromStation.name} to ${toStation.name} is ₹${primaryRoute.fare}. If using a Metro Smart Card, the discounted fare is ₹${primaryRoute.smartCardFare || primaryRoute.fare}.`
              }
            },
            {
              "@type": "Question",
              "name": `How long does it take from ${fromStation.name} to ${toStation.name} by metro?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The fastest journey takes approximately ${primaryRoute.totalTimeMins} minutes covering ${primaryRoute.totalDistanceKm} km with ${primaryRoute.switches} interchange switch(es).`
              }
            },
            {
              "@type": "Question",
              "name": `How many routes are available from ${fromStation.name} to ${toStation.name}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `There ${routes.length === 1 ? 'is 1 direct or optimal route' : `are ${routes.length} route options`} available between ${fromStation.name} and ${toStation.name}.`
              }
            }
          ]
        }
      ]
    };
    schemaEl.textContent = JSON.stringify(schemaData);
  }, [fromStation, toStation, primaryRoute, routes]);

  if (!fromStation || !toStation || !primaryRoute) {
    return (
      <div style={{ padding: "40px 20px", textAlign: "center", maxWidth: "600px", margin: "0 auto" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "12px" }}>Route Not Found</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "24px" }}>
          We could not find active route details between the selected stations.
        </p>
        <button
          onClick={onResetSearch}
          style={{
            background: "var(--accent-primary)",
            color: "#FFF",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontWeight: 600
          }}
        >
          Open Route Planner
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px 16px 0 16px" }}>
      {/* Top Breadcrumb / Nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <button
          onClick={onResetSearch}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            color: "var(--accent-primary)",
            fontWeight: 600,
            fontSize: "0.9rem",
            cursor: "pointer",
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          Back to Planner
        </button>

        <button
          onClick={() => onOpenPlanner && onOpenPlanner(fromStation, toStation)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "var(--accent-primary)",
            border: "none",
            color: "#FFFFFF",
            fontWeight: 600,
            fontSize: "0.85rem",
            padding: "6px 14px",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          <Navigation size={14} />
          Open Interactive Map
        </button>
      </div>

      {/* Main Header */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "24px", borderRadius: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
          <span style={{
            background: "rgba(16, 185, 129, 0.12)",
            color: "#10B981",
            padding: "4px 10px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.5px"
          }}>
            {routes.length > 1 ? `${routes.length} ROUTES AVAILABLE` : 'DIRECT & FASTEST ROUTE'}
          </span>
        </div>

        <h1 style={{
          fontSize: "1.65rem",
          fontWeight: 800,
          margin: "0 0 10px 0",
          color: "var(--text-primary)",
          lineHeight: 1.3
        }}>
          {fromStation.name} <span style={{ color: "var(--text-muted)" }}>to</span> {toStation.name}
        </h1>

        <p style={{
          fontSize: "0.92rem",
          color: "var(--text-secondary)",
          margin: 0,
          lineHeight: 1.5
        }}>
          Compare all available Kochi Metro routes from <strong>{fromStation.name}</strong> to <strong>{toStation.name}</strong>.
          Check token fare, smart card discount rates, total travel time, passing stations, and platform interchange instructions.
        </p>
      </div>

      {/* All Available Route Options */}
      {routes.map((route, idx) => {
        const isFastest = idx === 0;
        const isExpanded = expandedIndices.has(idx);
        const optionLabel = isFastest ? "Option 1: Fastest Route (Recommended)" : `Option ${idx + 1}: Alternative Route`;

        return (
          <div
            key={route.id || idx}
            className="glass-panel"
            style={{
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "18px",
              border: isFastest ? "1px solid rgba(16, 185, 129, 0.3)" : "1px solid var(--border-color)"
            }}
          >
            {/* Option Header Bar with Toggle Button */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{
                  background: isFastest ? "var(--accent-primary)" : "rgba(255, 255, 255, 0.08)",
                  color: "#FFFFFF",
                  padding: "5px 12px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 700
                }}>
                  {optionLabel}
                </span>
              </div>

              {/* View Full Journey / Hide Journey Button */}
              <button
                type="button"
                onClick={() => toggleRouteExpand(idx)}
                style={{
                  background: "var(--input-bg, rgba(255, 255, 255, 0.08))",
                  border: "1px solid var(--border-color)",
                  color: "var(--text-primary)",
                  padding: "6px 14px",
                  borderRadius: "8px",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                {isExpanded ? (
                  <>
                    <span>Hide Journey</span>
                    <ChevronUp size={16} />
                  </>
                ) : (
                  <>
                    <span>View Full Journey</span>
                    <ChevronDown size={16} />
                  </>
                )}
              </button>
            </div>

            {/* 4 Stats Grid in a single compact row */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "8px",
              marginBottom: "16px"
            }}>
              <div style={{
                background: "var(--bg-card)",
                padding: "10px 4px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "#10B981", fontSize: "0.72rem", fontWeight: 700 }}>
                  <Banknote size={13} /> Token
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 2px 0", lineHeight: 1 }}>
                  ₹{route.fare}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Card: ₹{route.smartCardFare || route.fare}
                </div>
              </div>

              <div style={{
                background: "var(--bg-card)",
                padding: "10px 4px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--accent-primary)", fontSize: "0.72rem", fontWeight: 700 }}>
                  <Clock size={13} /> Time
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 2px 0", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {route.totalTimeMins} <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>min</span>
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  Duration
                </div>
              </div>

              <div style={{
                background: "var(--bg-card)",
                padding: "10px 4px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700 }}>
                  <MapPin size={13} /> Distance
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 2px 0", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {route.totalDistanceKm} <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>km</span>
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {route.totalStops} stops
                </div>
              </div>

              <div style={{
                background: "var(--bg-card)",
                padding: "10px 4px",
                borderRadius: "12px",
                border: "1px solid var(--border-color)",
                textAlign: "center"
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 700 }}>
                  <Repeat size={13} /> Switch
                </div>
                <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--text-primary)", margin: "4px 0 2px 0", lineHeight: 1, whiteSpace: "nowrap" }}>
                  {route.switches}
                </div>
                <div style={{ fontSize: "0.68rem", color: route.switches === 0 ? "#10B981" : "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {route.switches === 0 ? "Direct" : `${route.switches} Switch`}
                </div>
              </div>
            </div>

            {/* Station Timeline (Visible by default for Option 1, or when toggled) */}
            {isExpanded && (
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px dashed var(--border-color)" }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 700, margin: "0 0 12px 0", color: "var(--text-primary)" }}>
                  Step-by-Step Route &amp; Station Stops ({optionLabel})
                </h4>
                <StationTimeline route={route} />
              </div>
            )}
          </div>
        );
      })}

      {/* Entry / Exit Gates Directory */}
      <div style={{ marginBottom: "24px" }}>
        <StationGates fromStation={fromStation} toStation={toStation} />
      </div>

      {/* FAQs */}
      <div className="glass-panel" style={{ padding: "24px", marginBottom: "0px", borderRadius: "20px" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, margin: "0 0 16px 0", color: "var(--text-primary)" }}>
          Frequently Asked Questions ({fromStation.name} to {toStation.name})
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
              What is the metro fare from {fromStation.name} to {toStation.name}?
            </h4>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              The standard token fare is ₹{primaryRoute.fare}. Passengers using a Metro Smart Card receive a discount (₹{primaryRoute.smartCardFare || primaryRoute.fare}).
            </p>
          </div>
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
              What is the travel time from {fromStation.name} to {toStation.name}?
            </h4>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              The fastest route takes approximately {primaryRoute.totalTimeMins} minutes across {primaryRoute.totalStops} stops and {primaryRoute.switches} line change(s).
              {routes.length > 1 && ` Alternative routes take up to ${Math.max(...routes.map(r => r.totalTimeMins))} minutes.`}
            </p>
          </div>
          {routes.length > 1 && (
            <div>
              <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
                Are there alternative metro routes between {fromStation.name} and {toStation.name}?
              </h4>
              <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
                Yes, there are {routes.length} route options available. You can choose between the fastest route ({primaryRoute.totalTimeMins} mins, ₹{primaryRoute.fare}) or alternative routes depending on your preference for fewer transfers or lower fare.
              </p>
            </div>
          )}
          <div>
            <h4 style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px 0" }}>
              What are the first and last train timings?
            </h4>
            <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", margin: 0, lineHeight: 1.5 }}>
              First metro trains generally start around 05:45 AM, and last trains depart around 11:00 PM. (Times may vary slightly on Sundays).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
