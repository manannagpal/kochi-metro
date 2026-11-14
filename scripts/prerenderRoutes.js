import { buildRouteSsrHtml, buildStationSsrHtml, getStationSlug } from "../src/utils/ssrHtml.js";
import fs from "fs";
import path from "path";
import { stations, lines } from "../src/data/kochiMetroData.js";
import { calculateRoutes } from '../src/routing/routeEngine.js';
import { KOCHI_HUB_IDS } from "../src/data/popularHubs.js";

const BASE_URL = "https://kochi.metro.org.in";
const hubStations = stations.filter(s => KOCHI_HUB_IDS.includes(s.id));
const distIndexHtmlPath = path.resolve("dist/index.html");

if (!fs.existsSync(distIndexHtmlPath)) {
  console.log("dist/index.html not found, skipping prerender step.");
  process.exit(0);
}

const templateHtml = fs.readFileSync(distIndexHtmlPath, "utf8");

function replaceRootContent(html, newInnerHtml) {
  const match = html.match(/<div\b[^>]*id=["']root["'][^>]*>/i);
  if (!match) return html;

  const rootStart = match.index;
  const openTag = match[0];
  const contentStart = rootStart + openTag.length;

  let depth = 1;
  const tagRegex = /<!--[\s\S]*?-->|<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = contentStart;
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    const token = m[0];
    if (token.startsWith('<!--')) continue;
    if (token.startsWith('</')) {
      depth--;
      if (depth === 0) {
        const rootEnd = tagRegex.lastIndex;
        return html.substring(0, rootStart) + `${openTag}${newInnerHtml}</div>` + html.substring(rootEnd);
      }
    } else if (!token.endsWith('/>')) {
      depth++;
    }
  }

  return html.replace(/<div\b[^>]*id=["']root["'][^>]*>[\s\S]*?<\/body>/i, `${openTag}${newInnerHtml}</div>\n</body>`);
}

function renderRouteSeoHtml(fromSt, toSt) {
  if (fromSt.id === toSt.id) return null;
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

  if (!primaryRoute) return null;
  const pageTitle = _fare !== null
    ? `${fromName} to ${toName} Metro Route, Fare (₹${_fare}) & Travel Time | Kochi Metro`
    : `${fromName} to ${toName} Metro Route, Fare & Travel Time | Kochi Metro`;
  const pageDesc = `Fastest metro route from ${fromName} to ${toName}: Calculate fare, travel time, line stations, and platform guide for Kochi Metro (KMRL).`;
  const canonicalUrl = `${BASE_URL}/route/${fromSlug}/${toSlug}/`;

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${pageDesc}" />`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

  const bodyHtml = buildRouteSsrHtml(fromSt, toSt, routes, 'Kochi Metro');
  html = replaceRootContent(html, bodyHtml);
  return html;
}

function renderStationSeoHtml(st) {
  const stName = st.name;
  const stSlug = getStationSlug(st);
  const pageTitle = `${stName} Metro Station Guide, Timings, Gates & Lines | Kochi Metro`;
  const pageDesc = `${stName} Metro Station on Kochi Metro: First and last train timings, gate directions, parking details, and station guide.`;
  const canonicalUrl = `${BASE_URL}/station/${stSlug}/`;

  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${pageTitle}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${pageDesc}" />`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  const lineIds = Array.isArray(st.lines) ? st.lines : (st.line ? [st.line] : []);
  const lineName = lineIds.map(id => (lines && lines[id] ? lines[id].name : id)).filter(Boolean).join(', ') || 'Blue Line';
  const bodyHtml = buildStationSsrHtml(st, lineName, 'Kochi Metro');

  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${pageDesc.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${canonicalUrl}" />`);

  html = replaceRootContent(html, bodyHtml);
  return html;
}

let routeCount = 0;
const prerenderedRouteUrls = [];

// 1. Pre-render All Routable Station Pairs (100% Coverage)
stations.forEach(fromSt => {
  const fromSlug = getStationSlug(fromSt);
  stations.forEach(toSt => {
    if (fromSt.id !== toSt.id) {
      const toSlug = getStationSlug(toSt);
      const routeHtml = renderRouteSeoHtml(fromSt, toSt);
      if (routeHtml) {
        const routeDir = path.resolve(`dist/route/${fromSlug}/${toSlug}`);
        fs.mkdirSync(routeDir, { recursive: true });
        fs.writeFileSync(path.join(routeDir, "index.html"), routeHtml, "utf8");
        routeCount++;
        prerenderedRouteUrls.push(`${BASE_URL}/route/${fromSlug}/${toSlug}/`);
      }
    }
  });
});

// Guarantee 100% Parity: Update sitemap-routes.xml with exact routes rendered on disk
const today = new Date().toISOString().split("T")[0];
const exactRoutesXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${prerenderedRouteUrls.map(url => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join("\n")}
</urlset>`;

fs.writeFileSync(path.resolve("dist/sitemap-routes.xml"), exactRoutesXml, "utf8");
fs.writeFileSync(path.resolve("public/sitemap-routes.xml"), exactRoutesXml, "utf8");
console.log(`Synced exact 100% parity sitemap-routes.xml (${routeCount} pre-rendered routes) to dist/ and public/`);

// 2. Pre-render All Station Pages
let stationCount = 0;
stations.forEach(st => {
  const stSlug = getStationSlug(st);
  const stDir = path.resolve(`dist/station/${stSlug}`);
  fs.mkdirSync(stDir, { recursive: true });
  fs.writeFileSync(path.join(stDir, "index.html"), renderStationSeoHtml(st), "utf8");
  stationCount++;
});

// 3. Pre-render Static Info Pages
const staticPages = [
  { path: "about", title: "About Us | Kochi Metro Route Finder", desc: "Learn about Kochi Metro Route Finder (kochi.metro.org.in) - your trusted independent guide for KMRL transit." },
  { path: "contact", title: "Contact Us | Kochi Metro Route Finder", desc: "Get in touch with Kochi Metro Route Finder team for queries, feedback, or transit data corrections." },
  { path: "privacy-policy", title: "Privacy Policy | Kochi Metro Route Finder", desc: "Privacy Policy for Kochi Metro Route Finder detailing our data handling practices." },
  { path: "privacy", title: "Privacy Policy | Kochi Metro Route Finder", desc: "Privacy Policy for Kochi Metro Route Finder detailing our data handling practices." },
  { path: "terms-of-service", title: "Terms of Service | Kochi Metro Route Finder", desc: "Terms of Service and terms of use for Kochi Metro Route Finder website." },
  { path: "terms", title: "Terms of Service | Kochi Metro Route Finder", desc: "Terms of Service and terms of use for Kochi Metro Route Finder website." },
  { path: "disclaimer", title: "Disclaimer | Kochi Metro Route Finder", desc: "Disclaimer regarding independent nature of Kochi Metro Route Finder website." },
  { path: "stations", title: "All Kochi Metro Stations Directory | KMRL Lines & Routes", desc: "Explore all 25 operational Kochi Metro stations along the Aluva to Tripunithura corridor." },
  { path: "sitemap", title: "Sitemap | Kochi Metro Route Finder", desc: "Complete sitemap and navigation directory for Kochi Metro Route Finder." }
];

staticPages.forEach(p => {
  const pDir = path.resolve(`dist/${p.path}`);
  fs.mkdirSync(pDir, { recursive: true });
  let html = templateHtml;
  html = html.replace(/<title>.*?<\/title>/i, `<title>${p.title}</title>`);
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${p.desc}" />`);
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${BASE_URL}/${p.path}/" />`);
  fs.writeFileSync(path.join(pDir, "index.html"), html, "utf8");
});

// 4. Pre-render Homepage Semantic Body with Outgoing Links into dist/index.html
function buildHomeSsrHtml(appName, stationsList = [], hubList = []) {
  const hubs = (hubList && hubList.length >= 2) ? hubList : stationsList.slice(0, 10);
  const routeLinks = [];
  for (let i = 0; i < hubs.length && routeLinks.length < 16; i++) {
    for (let j = 0; j < hubs.length && routeLinks.length < 16; j++) {
      if (i !== j) {
        const fromSt = hubs[i];
        const toSt = hubs[j];
        const fromSlug = getStationSlug(fromSt);
        const toSlug = getStationSlug(toSt);
        routeLinks.push(
          `<a href="/route/${fromSlug}/${toSlug}/" style="padding:12px 14px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:12px;text-decoration:none;color:var(--text-primary);font-size:0.86rem;font-weight:600;display:flex;align-items:center;justify-content:space-between;gap:8px;">` +
          `<span>${fromSt.name} &rarr; ${toSt.name}</span>` +
          `<span style="font-size:0.75rem;color:var(--accent-primary);font-weight:700;">Route &rarr;</span>` +
          `</a>`
        );
      }
    }
  }

  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
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

        <div class="nav-ribbon" style="padding:10px 16px;display:flex;gap:8px;overflow-x:auto;border-top:1px solid var(--border-color);">
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🕒 First / Last Train</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🧭 Nearest Metro</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🗺️ Metro Map</span>
          <span style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🚗 Parking Rates</span>
          <a href="/stations/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;">🚉 Stations Directory</a>
        </div>
      </header>

      <main style="width:100%;margin:0 auto;">
        <div class="glass-panel" style="padding:24px;border-radius:20px;margin-bottom:24px;background:var(--bg-surface);border:1px solid var(--border-color);box-shadow:var(--shadow-sm);">
          <h2 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:0 0 16px 0;">Popular Kochi Metro Routes</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fill, minmax(260px, 1fr));gap:10px;">
            ${routeLinks.join('')}
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

const homeBodyHtml = buildHomeSsrHtml("Kochi Metro", stations, hubStations);
const homeHtml = replaceRootContent(templateHtml, homeBodyHtml);
fs.writeFileSync(distIndexHtmlPath, homeHtml, "utf8");
console.log("Successfully pre-rendered semantic body with outgoing links into dist/index.html");

// 5. Static 404 Page Generation
const notFoundBody = `
  <div style="max-width:700px;margin:80px auto;padding:24px;text-align:center;color:var(--text-primary);font-family:system-ui,-apple-system,sans-serif;">
    <h1 style="font-size:2rem;font-weight:800;color:#EF4444;margin-bottom:12px;">404 - Page Not Found</h1>
    <p style="color:var(--text-secondary);font-size:1rem;margin-bottom:24px;">The requested metro station, route, or transit guide could not be found.</p>
    <a href="/" style="display:inline-block;padding:10px 20px;background:var(--accent-primary, #2563EB);color:#fff;text-decoration:none;border-radius:8px;font-weight:600;">Back to Route Finder &rarr;</a>
  </div>
`;
let notFoundHtml = templateHtml;
notFoundHtml = notFoundHtml.replace(/<title>.*?<\/title>/i, `<title>404 - Page Not Found | Kochi Metro</title>`);
notFoundHtml = notFoundHtml.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="The requested station or route could not be found." />`);
notFoundHtml = notFoundHtml.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${BASE_URL}/404.html" />`);
notFoundHtml = replaceRootContent(notFoundHtml, notFoundBody);
notFoundHtml = notFoundHtml.replace("</head>", '<meta name="robots" content="noindex, follow" />\n</head>');
fs.writeFileSync(path.resolve("dist/404.html"), notFoundHtml, "utf8");

console.log(`Successfully pre-rendered static HTML for ${stationCount} stations, ${routeCount} routes, and static pages into dist/`);
