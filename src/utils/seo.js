import { getStationSlug } from './slugify.js';
import { METRO_LINES } from '../data/lines.js';

export function updatePageSeo(fromSt, toSt, primaryRoute, staticPageType = null) {
  if (fromSt && toSt && primaryRoute) {
    const fromSlug = getStationSlug(fromSt);
    const toSlug = getStationSlug(toSt);

    const title = `${fromSt.name} to ${toSt.name} Metro Route, Fare (₹${primaryRoute.fare}) & Time | Kochi Metro`;
    const description = `Kochi Metro route from ${fromSt.name} to ${toSt.name}: distance ${primaryRoute.totalDistanceKm} km, token fare ₹${primaryRoute.fare} (smart card ₹${primaryRoute.smartCardFare}), estimated time ${primaryRoute.totalTimeMins} mins with ${primaryRoute.switches} interchange switch(es).`;
    const keywords = `${fromSt.name} to ${toSt.name} metro route, ${fromSt.name} metro fare, ${toSt.name} metro route, kochi metro ${fromSt.name} to ${toSt.name}, kochi fare calculator, ${fromSt.name} to ${toSt.name} travel time`;
    const canonicalUrl = `https://kochi.metro.org.in/route/${fromSlug}/${toSlug}/`;

    setSeoTags({ title, description, keywords, canonicalUrl });
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonicalUrl);

    let schemaEl = document.getElementById('seo-jsonld');
    if (!schemaEl) {
      schemaEl = document.createElement('script');
      schemaEl.id = 'seo-jsonld';
      schemaEl.type = 'application/ld+json';
      document.head.appendChild(schemaEl);
    }
    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Trip",
          "name": `${fromSt.name} to ${toSt.name} Kochi Metro Route`,
          "description": description,
          "offers": {
            "@type": "Offer",
            "price": primaryRoute.fare.toString(),
            "priceCurrency": "INR"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": `What is the metro fare from ${fromSt.name} to ${toSt.name}?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The standard token fare from ${fromSt.name} to ${toSt.name} is ₹${primaryRoute.fare}. If using a Metro Smart Card, the discounted fare is ₹${primaryRoute.smartCardFare}.`
              }
            },
            {
              "@type": "Question",
              "name": `How long does it take from ${fromSt.name} to ${toSt.name} by metro?`,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": `The journey takes approximately ${primaryRoute.totalTimeMins} minutes covering ${primaryRoute.totalDistanceKm} km with ${primaryRoute.switches} interchange switch(es).`
              }
            }
          ]
        }
      ]
    };
    schemaEl.textContent = JSON.stringify(schemaData);

  } else if (fromSt && !toSt) {
    const fromSlug = getStationSlug(fromSt);
    const stationLine = METRO_LINES[fromSt.line]?.name || fromSt.line;

    const title = `${fromSt.name} Metro Station Timings, Line & Fare | Kochi Metro`;
    const description = `Check ${fromSt.name} Metro Station train timings, connected line (${stationLine}), official token rates, and platform interchange guide.`;
    const keywords = `${fromSt.name} metro station, ${fromSt.name} kochi metro timing, ${fromSt.name} metro line, kochi metro ${fromSt.name}`;
    const canonicalUrl = `https://kochi.metro.org.in/station/${fromSlug}/`;

    setSeoTags({ title, description, keywords, canonicalUrl });
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonicalUrl);

    const schemaEl = document.getElementById('seo-jsonld');
    if (schemaEl) schemaEl.remove();

  } else if (staticPageType) {
    let title = "Kochi Metro Route Finder | Interactive Map, Fares & Timings";
    let description = "Find the fastest and best Metro routes across Kochi Metro operational network (KMRL Blue Line).";
    let keywords = "kochi metro route, kochi metro fare calculator, kochi metro journey planner";
    let canonicalUrl = `https://kochi.metro.org.in/${staticPageType}/`;

    if (staticPageType === 'stations') {
      title = "All Kochi Metro Stations Directory - Timings & Lines";
      description = "Browse complete list of all Kochi Metro stations across KMRL Blue Line.";
      keywords = "kochi metro stations list, kochi station directory, all kochi metro stations";
      canonicalUrl = "https://kochi.metro.org.in/stations/";
    } else if (staticPageType === 'about') {
      title = "About Us | Kochi Metro Route Finder";
      description = "Learn about Kochi Metro Route Finder, our platform designed to simplify transit across Kochi.";
      canonicalUrl = "https://kochi.metro.org.in/about/";
    } else if (staticPageType === 'contact') {
      title = "Contact Us | Kochi Metro Route Finder";
      description = "Get in touch with the Kochi Metro Route Finder team for feedback, support, or inquiries.";
      canonicalUrl = "https://kochi.metro.org.in/contact/";
    } else if (staticPageType === 'privacy') {
      title = "Privacy Policy | Kochi Metro Route Finder";
      description = "Read our Privacy Policy to understand how user privacy and data security are handled.";
      canonicalUrl = "https://kochi.metro.org.in/privacy-policy/";
    } else if (staticPageType === 'terms') {
      title = "Terms of Service | Kochi Metro Route Finder";
      description = "Terms of Service for using Kochi Metro Route Finder.";
      canonicalUrl = "https://kochi.metro.org.in/terms-of-service/";
    } else if (staticPageType === 'disclaimer') {
      title = "Disclaimer | Kochi Metro Route Finder";
      description = "Disclaimer regarding independent routing data and Kochi Metro trademark usage.";
      canonicalUrl = "https://kochi.metro.org.in/disclaimer/";
    } else if (staticPageType === 'sitemap') {
      title = "HTML Sitemap & Navigation Directory | Kochi Metro Route Finder";
      description = "Browse complete directory of all Kochi Metro stations and official XML sitemap files.";
      canonicalUrl = "https://kochi.metro.org.in/sitemap/";
    }

    setSeoTags({ title, description, keywords, canonicalUrl });
    setMetaProperty('og:title', title);
    setMetaProperty('og:description', description);
    setMetaProperty('og:url', canonicalUrl);
    removeJsonLd();

  } else {
    const defaultTitle = "Kochi Metro Route Finder | Interactive Map, Fares & Station Timings";
    const defaultDesc = "Calculate fastest routes, fares, travel time, and line interchange details for Kochi Metro (KMRL Blue Line) with interactive station map.";
    const defaultKeywords = "kochi metro route, kochi metro fare calculator, kochi metro timing, kochi metro map";
    const defaultCanonical = "https://kochi.metro.org.in/";

    setSeoTags({ title: defaultTitle, description: defaultDesc, keywords: defaultKeywords, canonicalUrl: defaultCanonical });
    setMetaProperty('og:title', defaultTitle);
    setMetaProperty('og:description', defaultDesc);
    setMetaProperty('og:url', defaultCanonical);
    removeJsonLd();
  }
}

function setSeoTags({ title, description, keywords, canonicalUrl }) {
  document.title = title;

  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = 'description';
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = description;

  let metaKw = document.querySelector('meta[name="keywords"]');
  if (!metaKw) {
    metaKw = document.createElement('meta');
    metaKw.name = 'keywords';
    document.head.appendChild(metaKw);
  }
  metaKw.content = keywords;

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = canonicalUrl;
}

function setMetaProperty(propName, content) {
  let el = document.querySelector(`meta[property="${propName}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', propName);
    document.head.appendChild(el);
  }
  el.content = content;
}

function removeJsonLd() {
  const schemaEl = document.getElementById('seo-jsonld');
  if (schemaEl) schemaEl.remove();
}
