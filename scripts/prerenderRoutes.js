import { buildRouteSsrHtml, buildStationSsrHtml } from "../src/utils/ssrHtml.js";
import fs from "fs";
import path from "path";
import { stations, lines } from "../src/data/kochiMetroData.js";
import { calculateRoutes } from '../src/routing/routeEngine.js';

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function getStationSlug(station) {
  return slugify(station.name);
}

export const KOCHI_HUB_IDS = [
  "aluva", "edapally", "jln-stadium", "mg-road-kochi", "ernakulam-south",
  "vyttila", "tripunithura", "cusat", "palarivattom", "kaloor"
];

const hubStations = stations.filter(s => KOCHI_HUB_IDS.includes(s.id));
const distIndexHtmlPath = path.resolve("dist/index.html");

if (!fs.existsSync(distIndexHtmlPath)) {
  console.log("dist/index.html not found, skipping prerender step.");
  process.exit(0);
}

const templateHtml = fs.readFileSync(distIndexHtmlPath, "utf8");

function renderRouteSeoHtml(fromSt, toSt) {
  const fromName = fromSt.name;
  const toName = toSt.name;
  const fromSlug = getStationSlug(fromSt);
  const toSlug = getStationSlug(toSt);
  let _fare = null;
  let primaryRoute = null;
  let routes = [];
  try {
    routes = calculateRoutes(fromSt.id, toSt.id) || [];
    if (routes && routes.length > 0) {
      primaryRoute = routes[0];
      _fare = primaryRoute.fare;
    }
  } catch(_e) {}
  const pageTitle = _fare !== null
    ? `${fromName} to ${toName} Metro Route, Fare (₹${_fare}) & Travel Time | Kochi Metro (KMRL)`
    : `${fromName} to ${toName} Metro Route, Fare & Travel Time | Kochi Metro (KMRL)`;
  const pageDesc = `Fastest metro route from ${fromName} to ${toName}: Calculate fare, travel time, line interchanges, and platform guide for Kochi Metro (Blue Line).`;
  const canonicalUrl = `https://kochi.metro.org.in/route/${fromSlug}/${toSlug}/`;

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${pageDesc}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    // In-place OG and Twitter replacements
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

  if (primaryRoute) {
    const bodyHtml = buildRouteSsrHtml(fromSt, toSt, routes, 'Kochi Metro');
    html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  }
  return html;
}

function renderStationSeoHtml(st) {
  const stName = st.name;
  const stSlug = getStationSlug(st);
  const pageTitle = `${stName} Metro Station Guide, Timings, Gates & Lines | Kochi Metro`;
  const pageDesc = `${stName} Metro Station on Kochi Metro (KMRL): First and last train timings, gate directions, parking details, line interchanges, and station guide.`;
  const canonicalUrl = `https://kochi.metro.org.in/station/${stSlug}/`;

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${pageDesc}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    const lineIds = Array.isArray(st.lines) ? st.lines : (st.line ? [st.line] : []);
  const lineName = lineIds.map(id => (lines[id] ? lines[id].name : id)).filter(Boolean).join(', ') || 'Metro';
  const bodyHtml = buildStationSsrHtml(st, lineName, 'Kochi Metro');

  // In-place OG and Twitter replacements
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

  html = html.replace('<div id="root"></div>', `<div id="root">${bodyHtml}</div>`);
  return html;
}

let count = 0;

// 1. Pre-render Hub Route Pages
hubStations.forEach(fromSt => {
  stations.forEach(toSt => {
    if (fromSt.id !== toSt.id) {
      const fromSlug = getStationSlug(fromSt);
      const toSlug = getStationSlug(toSt);
      const routeDir = path.resolve(`dist/route/${fromSlug}/${toSlug}`);
      fs.mkdirSync(routeDir, { recursive: true });
      fs.writeFileSync(path.join(routeDir, "index.html"), renderRouteSeoHtml(fromSt, toSt), "utf8");
      count++;
    }
  });
});

// 2. Pre-render Station Pages
stations.forEach(st => {
  const stSlug = getStationSlug(st);
  const stDir = path.resolve(`dist/station/${stSlug}`);
  fs.mkdirSync(stDir, { recursive: true });
  fs.writeFileSync(path.join(stDir, "index.html"), renderStationSeoHtml(st), "utf8");
});

// 3. Pre-render Static Info Pages
const staticPages = [
  { path: "about", title: "About Us | Kochi Metro Route Finder", desc: "Learn about Kochi Metro Route Finder (kochi.metro.org.in) - your trusted independent guide for KMRL transit." },
  { path: "contact", title: "Contact Us | Kochi Metro Route Finder", desc: "Get in touch with Kochi Metro Route Finder team for queries, feedback, or transit data corrections." },
  { path: "privacy-policy", title: "Privacy Policy | Kochi Metro Route Finder", desc: "Privacy Policy for Kochi Metro Route Finder detailing our data handling practices." },
  { path: "terms-of-service", title: "Terms of Service | Kochi Metro Route Finder", desc: "Terms of Service and terms of use for Kochi Metro Route Finder website." },
  { path: "disclaimer", title: "Disclaimer | Kochi Metro Route Finder", desc: "Official disclaimer regarding independent nature of Kochi Metro Route Finder website." },
  { path: "stations", title: "All Kochi Metro Stations Directory | KMRL Lines & Routes", desc: "Explore all 25 operational Kochi Metro stations across Blue Line." }
];

staticPages.forEach(p => {
  const pDir = path.resolve(`dist/${p.path}`);
  fs.mkdirSync(pDir, { recursive: true });
  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/, `<title>${p.title}</title>`);
  html = html.replace(/<meta name="description" content=".*?"\s*\/?>/, `<meta name="description" content="${p.desc}" />`);
  html = html.replace(/<link rel="canonical" href=".*?"\s*\/?>/, `<link rel="canonical" href="https://kochi.metro.org.in/${p.path}/" />`);
  fs.writeFileSync(path.join(pDir, "index.html"), html, "utf8");
});

// Copy 404
fs.copyFileSync(distIndexHtmlPath, path.resolve("dist/404.html"));

console.log(`Successfully pre-rendered static HTML for ${stations.length} stations, ${count} hub routes, and static pages into dist/`);
