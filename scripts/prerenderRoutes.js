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

// Helper for home SSR
// Helper for home SSR - Visual Shell matching React App to eliminate layout shift
function buildHomeSsrHtml(appName, stationsList = [], hubList = []) {
  const defaultFrom = (hubList && hubList.length > 0) ? hubList[0] : (stationsList[0] || { name: 'Start Station' });
  const defaultTo = (hubList && hubList.length > 1) ? hubList[1] : (stationsList[1] || defaultFrom);
  const fromName = defaultFrom.name || 'Start Station';
  const toName = defaultTo.name || 'Destination Station';

  const hubs = (hubList && hubList.length >= 2) ? hubList : stationsList.slice(0, 10);
  const routeLinks = [];
  for (let i = 0; i < hubs.length && routeLinks.length < 16; i++) {
    for (let j = 0; j < hubs.length && routeLinks.length < 16; j++) {
      if (i !== j) {
        const fromSt = hubs[i];
        const toSt = hubs[j];
        const fromSlug = (typeof getStationSlug === 'function' ? getStationSlug(fromSt) : fromSt.id);
        const toSlug = (typeof getStationSlug === 'function' ? getStationSlug(toSt) : toSt.id);
        routeLinks.push(
          `<a href="/route/${fromSlug}/${toSlug}/" style="padding:12px 14px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:12px;text-decoration:none;color:var(--text-primary);font-size:0.86rem;font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:8px;">` +
          `<span>${fromSt.name || ''} &rarr; ${toSt.name || ''}</span>` +
          `<span style="font-size:0.75rem;color:var(--accent-primary);font-weight:700;">Route &rarr;</span>` +
          `</a>`
        );
      }
    }
  }

  const sampleStations = hubs.slice(0, 16);
  const stationLinks = sampleStations.map(st => {
    const sSlug = (typeof getStationSlug === 'function' ? getStationSlug(st) : st.id);
    return `<a href="/station/${sSlug}/" style="padding:8px 12px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:8px;text-decoration:none;color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-block;">🚉 ${st.name || ''}</a>`;
  }).join('\n');

  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
      <!-- Exact App Top Navbar Matching App UI -->
      <header class="glass-panel" style="margin:0 0 24px 0;border-radius:16px;overflow:hidden;background:var(--bg-surface);border:1px solid var(--border-color);">
        <div class="navbar-top" style="padding:16px 20px;display:flex;align-items:center;justify-content:space-between;gap:16px;">
          <a href="/" class="navbar-logo" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;cursor:pointer;">
            <img src="/logo.svg?v=2" alt="${appName} Logo" class="navbar-logo-img" style="width:42px;height:42px;border-radius:10px;object-fit:contain;background:#FFFFFF;padding:2px;" />
            <div style="text-align:left;">
              <div class="navbar-title" style="font-size:1.2rem;font-weight:800;color:var(--text-primary);line-height:1.2;">
                ${appName} Route Finder
              </div>
              <p class="navbar-subtitle" style="font-size:0.8rem;color:var(--text-muted);margin:2px 0 0 0;font-weight:500;">
                Interactive Route &amp; Station Guide
              </p>
            </div>
          </a>
        </div>

        <!-- Header Action Ribbon Matching App UI -->
        <div class="nav-ribbon" style="padding:10px 16px;display:flex;gap:8px;overflow-x:auto;border-top:1px solid var(--border-color);">
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🕒 First / Last Train</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🧭 Nearest Metro</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🗺️ Metro Map</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🚗 Parking Rates</span>
          <a href="/stations/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🚉 Stations Directory</a>
        </div>
      </header>

      <!-- Main Search Card Matching App UI -->
      <main style="max-width:900px;margin:0 auto;">
        <div class="glass-panel" style="padding:24px;border-radius:20px;margin-bottom:24px;background:var(--bg-surface);border:1px solid var(--border-color);box-shadow:var(--shadow-sm);">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <div>
              <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">
                <span style="color:#10B981;margin-right:4px;">📍</span> From Station
              </label>
              <div style="position:relative;">
                <div style="width:100%;padding:14px 16px 14px 42px;border-radius:12px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:1rem;font-weight:500;">
                  ${fromName}
                </div>
                <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1rem;">🔍</span>
              </div>
            </div>

            <div style="display:flex;justify-content:center;margin:-4px 0;">
              <div style="width:40px;height:40px;border-radius:50%;background:var(--input-bg);border:1px solid var(--border-accent);display:grid;place-items:center;color:var(--accent-primary);font-size:1.1rem;box-shadow:var(--shadow-sm);">
                ⇅
              </div>
            </div>

            <div>
              <label style="display:block;font-size:0.85rem;font-weight:600;color:var(--text-secondary);margin-bottom:8px;">
                <span style="color:#EF4444;margin-right:4px;">📍</span> To Station
              </label>
              <div style="position:relative;">
                <div style="width:100%;padding:14px 16px 14px 42px;border-radius:12px;border:1px solid var(--border-color);background:var(--input-bg);color:var(--text-primary);font-size:1rem;font-weight:500;">
                  ${toName}
                </div>
                <span style="position:absolute;left:14px;top:50%;transform:translateY(-50%);color:var(--text-muted);font-size:1rem;">🔍</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Popular Metro Routes (Semantic internal links for search crawlers) -->
        <div class="glass-panel" style="padding:24px;border-radius:20px;margin-bottom:24px;background:var(--bg-surface);border:1px solid var(--border-color);">
          <h2 style="font-size:1.15rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
            Popular Metro Routes
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(240px, 1fr));gap:10px;">
            ${routeLinks.join('\n')}
          </div>
        </div>

        <!-- Key Stations -->
        <div class="glass-panel" style="padding:24px;border-radius:20px;margin-bottom:24px;background:var(--bg-surface);border:1px solid var(--border-color);">
          <h2 style="font-size:1.15rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
            Key Metro Stations &amp; Interchanges
          </h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:8px;">
            ${stationLinks}
          </div>
        </div>

        <!-- Directory & Legal Guides -->
        <div class="glass-panel" style="padding:20px 24px;border-radius:18px;margin-bottom:24px;background:var(--bg-surface);border:1px solid var(--border-color);">
          <h3 style="font-size:0.98rem;font-weight:700;margin:0 0 12px 0;color:var(--text-primary);">
            Transit Navigation &amp; Directories
          </h3>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            <a href="/stations/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">🚉 All Stations</a>
            <a href="/about/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">ℹ️ About Us</a>
            <a href="/contact/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">📞 Contact Us</a>
            <a href="/privacy-policy/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">🔒 Privacy Policy</a>
            <a href="/terms-of-service/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">📜 Terms of Service</a>
            <a href="/disclaimer/" style="padding:7px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;">⚠️ Disclaimer</a>
          </div>
        </div>
      </main>

      <footer style="margin-top:16px;padding:24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;">
        <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-bottom:10px;">
          <a href="https://metro.org.in/" style="color:var(--accent-primary);text-decoration:none;font-weight:600;">All India Metros</a>
          <a href="/stations/" style="color:var(--text-secondary);text-decoration:none;">All Stations</a>
          <a href="/about/" style="color:var(--text-secondary);text-decoration:none;">About</a>
          <a href="/privacy-policy/" style="color:var(--text-secondary);text-decoration:none;">Privacy</a>
          <a href="/terms-of-service/" style="color:var(--text-secondary);text-decoration:none;">Terms</a>
          <a href="/contact/" style="color:var(--text-secondary);text-decoration:none;">Contact</a>
        </div>
        <p style="margin:0;">&copy; 2026 ${appName} Route Finder</p>
      </footer>
    </div>
  `;
}


// Pre-render Homepage Semantic Body with Outgoing Links into dist/index.html
const homeBodyHtml = buildHomeSsrHtml("Kochi Metro", stations, hubStations);
const homeHtml = templateHtml.replace('<div id="root"></div>', () => '<div id="root">' + homeBodyHtml + '</div>');
fs.writeFileSync(distIndexHtmlPath, homeHtml, "utf8");
console.log("Successfully pre-rendered semantic body with outgoing links into dist/index.html");
