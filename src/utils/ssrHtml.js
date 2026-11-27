import { stations } from '../data/kochiMetroData.js';
import { KOCHI_HUB_IDS } from '../data/popularHubs.js';

export function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function escapeAttr(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function formatKm(val) {
  if (val === null || val === undefined) return '';
  const n = parseFloat(val);
  return isNaN(n) ? String(val) : (n % 1 === 0 ? n.toFixed(0) : n.toFixed(1));
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getStationSlug(station) {
  if (!station) return '';
  return slugify(station.name);
}

// Helper to get popular destinations for lateral linking
export function getPopularDestsForStation(station, count = 8) {
  const hubs = stations.filter(s => KOCHI_HUB_IDS.includes(s.id) && s.id !== station.id);
  return hubs.slice(0, count);
}

// ─── App Header SSR HTML Builder ───────────────────────────────────────────────
export function buildAppHeaderHtml(appName = "Kochi Metro") {
  return `
    <!-- Top Navbar Matching App UI -->
    <header data-nosnippet class="glass-panel" style="margin:0 0 20px 0;border-radius:16px;overflow:hidden;background:var(--bg-surface);border:1px solid var(--border-color);">
      <div class="navbar-top" style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
        <a href="/" class="navbar-logo" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit;cursor:pointer;">
          <img src="/logo.svg?v=2" alt="${escapeAttr(appName)} Logo" class="navbar-logo-img" style="width:42px;height:42px;border-radius:10px;object-fit:contain;background:#FFFFFF;padding:2px;" />
          <div style="text-align:left;">
            <div class="navbar-title" style="font-size:1.2rem;font-weight:800;color:var(--text-primary);line-height:1.2;">
              ${escapeHtml(appName)} Route Finder
            </div>
            <p class="navbar-subtitle" style="font-size:0.8rem;color:var(--text-muted);margin:2px 0 0 0;font-weight:500;">
              Interactive Route &amp; Station Guide
            </p>
          </div>
        </a>
        <div class="navbar-controls" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
          <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">🔗 Share</a>
          <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">🌙 Dark Mode</a>
        </div>
      </div>

      <!-- Header Action Ribbon Matching App UI -->
      <div class="nav-ribbon" style="padding:10px 16px;display:flex;gap:8px;overflow-x:auto;border-top:1px solid var(--border-color);">
        <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;">🕒 First / Last Train</a>
        <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;">🧭 Nearest Metro</a>
        <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;">🗺️ Metro Map</a>
        <a href="/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;">🚗 Parking Rates</a>
        <a href="/stations/" style="padding:6px 12px;border-radius:8px;border:1px solid var(--border-color);background:var(--bg-surface);color:var(--text-primary);font-size:0.82rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;white-space:nowrap;flex-shrink:0;">🚉 Stations Directory</a>
      </div>
    </header>
  `;
}

// ─── Route SSR HTML Builder ───────────────────────────────────────────────────
export function buildRouteSsrHtml(fromStation, toStation, routesInput, appName = "Kochi Metro") {
  const routesList = Array.isArray(routesInput) ? routesInput : (routesInput ? [routesInput] : []);
  const primaryRoute = routesList[0] || {};
  const routesCount = routesList.length;
  const fromSlug = getStationSlug(fromStation);
  const toSlug = getStationSlug(toStation);

  const routesHtml = routesList.map((route, rIdx) => {
    const fare = route.fare;
    const time = route.totalTimeMins;
    const distance = formatKm(route.totalDistanceKm);
    const stops = route.totalStops || (route.stations ? route.stations.length : 'Multiple');
    const switches = route.switches ?? 0;
    const isPrimary = rIdx === 0;

    let legsHtml = '';
    if (Array.isArray(route.legs) && route.legs.length > 0) {
      legsHtml = route.legs.map((leg, lIdx) => {
        const lineName = leg.lineName || leg.line || 'Blue Line';
        const lineColor = leg.lineColor || '#00A3E0';
        const legStops = leg.stations ? leg.stations.length : '';
        const stationList = Array.isArray(leg.stations)
          ? leg.stations.map(st => `<li style="padding:2px 0;font-size:0.84rem;color:var(--text-secondary);list-style:disc inside;">${escapeHtml(typeof st === 'string' ? st : (st.name || ''))}</li>`).join('')
          : '';

        return `
          <div style="margin-bottom:12px;padding:12px;border-left:4px solid ${lineColor};background:var(--input-bg);border-radius:0 8px 8px 0;">
            <div style="font-weight:700;font-size:0.9rem;color:var(--text-primary);margin-bottom:4px;">
              ${escapeHtml(lineName)} (${escapeHtml(leg.fromStation?.name || leg.from || '')} &rarr; ${escapeHtml(leg.toStation?.name || leg.to || '')})
            </div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">
              ${legStops} stops &bull; ${leg.timeMins ? leg.timeMins + ' mins' : ''} ${leg.direction ? '&bull; Towards ' + escapeHtml(leg.direction) : ''}
            </div>
            ${stationList ? `<ul style="margin:4px 0 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(min(180px, 100%), 1fr));gap:2px;">${stationList}</ul>` : ''}
          </div>
        `;
      }).join('');
    } else if (Array.isArray(route.stations) && route.stations.length > 0) {
      const sItems = route.stations.map(st =>
        `<li style="padding:2px 0;font-size:0.85rem;color:var(--text-secondary);list-style:disc inside;">${escapeHtml(typeof st === 'string' ? st : (st.name || ''))}</li>`
      ).join('');
      legsHtml = `<ul style="margin:6px 0 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(min(180px, 100%), 1fr));gap:2px;">${sItems}</ul>`;
    }

    return `
      <div class="glass-panel route-seo-card" style="margin-bottom:20px;border-radius:18px;overflow:hidden;${isPrimary ? 'border:1px solid rgba(16, 185, 129, 0.3);' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;margin-bottom:14px;gap:8px 10px;">
          <span style="background:${isPrimary ? 'var(--accent-primary)' : 'var(--header-summary-bg, #1E293B)'};color:#FFFFFF;padding:5px 12px;border-radius:8px;font-size:0.82rem;font-weight:700;max-width:100%;">
            ${isPrimary ? 'Option 1: Direct Route' : `Option ${rIdx + 1}: Alternative Route`}
          </span>
          <span style="background:var(--bg-surface);color:var(--text-secondary);border:1px solid var(--border-color);padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
            ${isPrimary ? 'Hide Journey &#9652;' : 'View Journey &#9662;'}
          </span>
        </div>

        <!-- Signature Stats Summary Bar -->
        <div style="background:var(--header-summary-bg, #1E293B);padding:14px 8px;color:#FFFFFF;display:grid;grid-template-columns:repeat(4, minmax(0, 1fr));text-align:center;align-items:center;border-radius:12px;margin-bottom:16px;">
          <div style="padding:0 4px;">
            <div style="font-size:clamp(1.2rem, 4vw, 1.5rem);font-weight:800;color:#38BDF8;line-height:1;">${time ?? '—'}</div>
            <div style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-top:4px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;">MINS</div>
          </div>
          <div style="border-left:1px solid rgba(255,255,255,0.12);padding:0 4px;">
            <div style="font-size:clamp(1.2rem, 4vw, 1.5rem);font-weight:800;color:#4ADE80;line-height:1;">₹${fare ?? '—'}</div>
            <div style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-top:4px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;">FARE</div>
          </div>
          <div style="border-left:1px solid rgba(255,255,255,0.12);padding:0 4px;">
            <div style="font-size:clamp(1.2rem, 4vw, 1.5rem);font-weight:800;color:#FACC15;line-height:1;">${stops ?? '—'}</div>
            <div style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-top:4px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;">STOPS</div>
          </div>
          <div style="border-left:1px solid rgba(255,255,255,0.12);padding:0 4px;">
            <div style="font-size:clamp(1.2rem, 4vw, 1.5rem);font-weight:800;color:#F472B6;line-height:1;">${switches}</div>
            <div style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-top:4px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;">${switches === 1 ? 'SWITCH' : 'SWITCHES'}</div>
          </div>
        </div>

        ${legsHtml ? `
          <div style="margin-top:14px;padding-top:14px;border-top:1px dashed var(--border-color);">
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;color:var(--text-primary);">Route Station Timetable &amp; Halts</div>
            ${legsHtml}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  // Station detail links
  const journeyStationLinks = [
    `<a href="/station/${fromSlug}/" style="padding:10px 14px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:10px;color:var(--text-primary);text-decoration:none;font-size:0.86rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;"><span>📍 Origin: <strong>${escapeHtml(fromStation.name)}</strong> Station Guide &rarr;</span></a>`,
    `<a href="/station/${toSlug}/" style="padding:10px 14px;background:var(--input-bg);border:1px solid var(--border-color);border-radius:10px;color:var(--text-primary);text-decoration:none;font-size:0.86rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;"><span>🏁 Destination: <strong>${escapeHtml(toStation.name)}</strong> Station Guide &rarr;</span></a>`
  ];

  // Lateral outbound links
  const originHubs = getPopularDestsForStation(fromStation, 6);
  const destHubs = getPopularDestsForStation(toStation, 6);

  const lateralOriginLinks = originHubs.map(h => {
    const hSlug = getStationSlug(h);
    return `<a href="/route/${fromSlug}/${hSlug}/" style="padding:6px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:4px;"><span>${escapeHtml(fromStation.name)} &rarr; <strong>${escapeHtml(h.name)}</strong></span></a>`;
  }).join('');

  const lateralDestLinks = destHubs.map(h => {
    const hSlug = getStationSlug(h);
    return `<a href="/route/${hSlug}/${toSlug}/" style="padding:6px 12px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:8px;font-size:0.82rem;font-weight:600;display:inline-flex;align-items:center;gap:4px;"><span>${escapeHtml(h.name)} &rarr; <strong>${escapeHtml(toStation.name)}</strong></span></a>`;
  }).join('');

  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
      ${buildAppHeaderHtml(appName)}

      <main style="max-width:900px;width:100%;margin:0 auto;padding:8px 0 40px 0;">
        <!-- Hierarchical Breadcrumb Navigation -->
        <nav data-nosnippet style="margin-bottom:14px;font-size:0.85rem;color:var(--text-muted,#64748b);">
          <a href="/" style="color:var(--accent-primary,#2563eb);text-decoration:none;">Home</a> &rsaquo;
          <a href="/stations/" style="color:var(--accent-primary,#2563eb);text-decoration:none;">Stations</a> &rsaquo;
          <a href="/station/${fromSlug}/" style="color:var(--accent-primary,#2563eb);text-decoration:none;">${escapeHtml(fromStation.name)}</a> &rsaquo;
          <span style="color:var(--text-secondary,#475569);">to ${escapeHtml(toStation.name)}</span>
        </nav>

        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 8px 0;color:var(--text-primary);line-height:1.3;">
            ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} Metro Route
          </h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0 0 16px 0;">
            ${primaryRoute.totalTimeMins
              ? `Fastest travel time is <strong>${primaryRoute.totalTimeMins} mins</strong> covering <strong>${formatKm(primaryRoute.totalDistanceKm)} km</strong> with <strong>${primaryRoute.switches || 0} line interchange(s)</strong>.`
              : 'Complete travel guide with token fare, total travel time, stops, and schedule.'}
          </p>
          <!-- Reciprocal Return Journey Link -->
          <div style="margin-top:16px;padding-top:14px;border-top:1px solid var(--border-color);display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;">
            <div style="font-size:0.86rem;color:var(--text-secondary);">
              Traveling in the opposite direction?
            </div>
            <a href="/route/${toSlug}/${fromSlug}/" style="display:inline-flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:6px 10px;max-width:100%;background:var(--bg-surface,#f8fafc);color:var(--accent-primary,#2563eb);border:1px solid var(--border-color,#cbd5e1);padding:8px 12px;border-radius:10px;font-size:0.85rem;font-weight:700;text-decoration:none;transition:all 0.15s ease;">
              <span>&#8646; Return: ${escapeHtml(toStation.name)} to ${escapeHtml(fromStation.name)}</span>
              <span style="font-size:0.8rem;color:var(--text-muted,#64748b);white-space:nowrap;flex-shrink:0;margin-left:auto;">${primaryRoute.fare ? `(₹${primaryRoute.fare}) ` : ''}&rarr;</span>
            </a>
          </div>
        </div>

        ${routesHtml}

        <!-- Station Guides for This Journey -->
        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 12px 0;color:var(--text-primary);">
            Station Guides for This Journey
          </h3>
          <p style="font-size:0.86rem;color:var(--text-secondary);margin:0 0 14px 0;">
            View first/last train timetables, exit gates, feeder connections, and parking facilities:
          </p>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${journeyStationLinks.join('')}
          </div>
        </div>

        <!-- Lateral Connecting Routes Architecture -->
        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
            Explore Connecting Metro Routes
          </h3>
          ${lateralOriginLinks ? `
            <div style="margin-bottom:16px;">
              <h4 style="font-size:0.88rem;font-weight:700;color:var(--text-secondary);margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">
                Other Popular Routes from ${escapeHtml(fromStation.name)}
              </h4>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${lateralOriginLinks}
              </div>
            </div>
          ` : ''}
          ${lateralDestLinks ? `
            <div>
              <h4 style="font-size:0.88rem;font-weight:700;color:var(--text-secondary);margin:0 0 8px 0;text-transform:uppercase;letter-spacing:0.5px;">
                Other Routes Arriving at ${escapeHtml(toStation.name)}
              </h4>
              <div style="display:flex;flex-wrap:wrap;gap:8px;">
                ${lateralDestLinks}
              </div>
            </div>
          ` : ''}
        </div>

        <div class="glass-panel" style="padding:24px;margin-bottom:0px;border-radius:20px;">
          <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
            Frequently Asked Questions (${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)})
          </h3>
          <div style="display:flex;flex-direction:column;gap:14px;">
            <div>
              <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
                What is the metro fare from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)}?
              </h4>
              <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
                The standard token fare is ₹${primaryRoute.fare || 0}. Passengers using a Kochi 1 Card receive an additional discount.
              </p>
            </div>
            <div>
              <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
                How long does it take from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} by metro?
              </h4>
              <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
                The direct journey takes approximately ${primaryRoute.totalTimeMins || 0} minutes covering ${formatKm(primaryRoute.totalDistanceKm)} km across ${primaryRoute.totalStops || (primaryRoute.stations ? primaryRoute.stations.length : 'all intermediate')} stations.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>

    <footer data-nosnippet style="margin-top:16px;padding:20px 16px 8px 16px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-bottom:10px;">
        <a href="https://metro.org.in/" style="color:var(--accent-primary);text-decoration:none;font-weight:600;">All India Metros</a>
        <a href="/stations/" style="color:var(--text-secondary);text-decoration:none;">All Stations</a>
        <a href="/about/" style="color:var(--text-secondary);text-decoration:none;">About</a>
        <a href="/privacy-policy/" style="color:var(--text-secondary);text-decoration:none;">Privacy</a>
        <a href="/terms-of-service/" style="color:var(--text-secondary);text-decoration:none;">Terms</a>
        <a href="/contact/" style="color:var(--text-secondary);text-decoration:none;">Contact</a>
      </div>
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}

// ─── Station SSR HTML Builder ─────────────────────────────────────────────────
export function buildStationSsrHtml(station, lineNames, appName = "Kochi Metro") {
  const slug = getStationSlug(station);
  const popularDests = getPopularDestsForStation(station, 10);
  const routeLinks = popularDests.map(dest => {
    const destSlug = getStationSlug(dest);
    return `<a href="/route/${slug}/${destSlug}/" style="padding:10px 14px;background:var(--input-bg);border:1px solid var(--border-color);color:var(--text-primary);text-decoration:none;border-radius:10px;font-size:0.86rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;"><span>&rarr; to <strong>${escapeHtml(dest.name)}</strong></span><span style="font-size:0.75rem;color:var(--accent-primary);font-weight:700;">Route</span></a>`;
  }).join('');

  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
      ${buildAppHeaderHtml(appName)}

      <main style="max-width:900px;width:100%;margin:0 auto;padding:8px 0 40px 0;">
        <!-- Hierarchical Breadcrumb Navigation -->
        <nav data-nosnippet style="margin-bottom:14px;font-size:0.85rem;color:var(--text-muted,#64748b);">
          <a href="/" style="color:var(--accent-primary,#2563eb);text-decoration:none;">Home</a> &rsaquo;
          <a href="/stations/" style="color:var(--accent-primary,#2563eb);text-decoration:none;">Stations Directory</a> &rsaquo;
          <span style="color:var(--text-secondary,#475569);">${escapeHtml(station.name)}</span>
        </nav>

        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 8px 0;color:var(--text-primary);line-height:1.3;">
            ${escapeHtml(station.name)} Metro Station
          </h1>
          <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">
            Connected line: <strong>${escapeHtml(lineNames)}</strong>. First and last train timetable, terminal information, and route directions.
          </p>
        </div>

        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h2 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:0 0 8px 0;">Station Overview &amp; Code</h2>
          <p style="font-size:0.9rem;color:var(--text-secondary);margin:0;">
            Station Code: <strong>${escapeHtml(station.code || station.id)}</strong> &bull; Line: <strong>${escapeHtml(lineNames)}</strong>
          </p>
        </div>

        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h2 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:0 0 12px 0;">Popular Metro Routes from ${escapeHtml(station.name)}</h2>
          <div style="display:flex;flex-wrap:wrap;gap:8px;">
            ${routeLinks}
          </div>
          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border-color);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;">
            <span style="font-size:0.84rem;color:var(--text-muted);">Looking for routes across all Kochi metro stations?</span>
            <a href="/stations/" style="font-size:0.86rem;color:var(--accent-primary);font-weight:700;text-decoration:none;">Browse All Stations &rarr;</a>
          </div>
        </div>
      </main>
    </div>

    <footer data-nosnippet style="margin-top:16px;padding:20px 16px 8px 16px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <div style="display:flex;justify-content:center;flex-wrap:wrap;gap:16px;margin-bottom:10px;">
        <a href="https://metro.org.in/" style="color:var(--accent-primary);text-decoration:none;font-weight:600;">All India Metros</a>
        <a href="/stations/" style="color:var(--text-secondary);text-decoration:none;">All Stations</a>
        <a href="/about/" style="color:var(--text-secondary);text-decoration:none;">About</a>
        <a href="/privacy-policy/" style="color:var(--text-secondary);text-decoration:none;">Privacy</a>
        <a href="/terms-of-service/" style="color:var(--text-secondary);text-decoration:none;">Terms</a>
        <a href="/contact/" style="color:var(--text-secondary);text-decoration:none;">Contact</a>
      </div>
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}
