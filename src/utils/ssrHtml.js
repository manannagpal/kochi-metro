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

// ─── App Header SSR HTML Builder ───────────────────────────────────────────────
export function buildAppHeaderHtml(appName = "Kochi Metro") {
  return `
    <!-- Top Navbar Matching App UI -->
    <header data-nosnippet class="glass-panel" style="margin:0 0 20px 0;border-radius:16px;overflow:hidden;background:var(--bg-surface);border:1px solid var(--border-color);">
      <div style="padding:14px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;">
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
        <div class="navbar-controls" style="display:flex;align-items:center;gap:8px;">
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

  const routesHtml = routesList.map((route, rIdx) => {
    const fare = route.fare;
    const smartCardFare = route.smartCardFare || route.fare;
    const time = route.totalTimeMins;
    const distance = formatKm(route.totalDistanceKm);
    const stops = route.totalStops || (route.stations ? route.stations.length : 'Multiple');
    const switches = route.switches;
    const isPrimary = rIdx === 0;

    let legsHtml = '';
    if (Array.isArray(route.legs) && route.legs.length > 0) {
      legsHtml = route.legs.map((leg, lIdx) => {
        const lineName = leg.lineName || leg.line || 'Metro Line';
        const lineColor = leg.lineColor || '#3B82F6';
        const legStops = leg.stops ? leg.stops.length : 0;
        const stationList = Array.isArray(leg.stops)
          ? leg.stops.map(s => `<li style="padding:3px 0;font-size:0.85rem;color:var(--text-secondary);list-style:disc inside;">${escapeHtml(typeof s === 'string' ? s : (s.name || ''))}</li>`).join('')
          : '';

        return `
          <div style="margin-bottom:14px;border-left:3px solid ${escapeAttr(lineColor)};padding-left:12px;">
            <div style="font-weight:700;font-size:0.92rem;color:var(--text-primary);margin-bottom:2px;">
              Leg ${lIdx + 1}: ${escapeHtml(lineName)} (${escapeHtml(leg.fromStation?.name || leg.from || '')} &rarr; ${escapeHtml(leg.toStation?.name || leg.to || '')})
            </div>
            <div style="font-size:0.78rem;color:var(--text-muted);margin-bottom:6px;">
              ${legStops} stops &bull; ${leg.timeMins ? leg.timeMins + ' mins' : ''} ${leg.direction ? '&bull; Towards ' + escapeHtml(leg.direction) : ''}
            </div>
            ${stationList ? `<ul style="margin:4px 0 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:2px;">${stationList}</ul>` : ''}
          </div>
        `;
      }).join('');
    } else if (Array.isArray(route.stations) && route.stations.length > 0) {
      const sItems = route.stations.map(st =>
        `<li style="padding:2px 0;font-size:0.85rem;color:var(--text-secondary);list-style:disc inside;">${escapeHtml(typeof st === 'string' ? st : (st.name || ''))}</li>`
      ).join('');
      legsHtml = `<ul style="margin:6px 0 0 0;padding:0;display:grid;grid-template-columns:repeat(auto-fill, minmax(180px, 1fr));gap:2px;">${sItems}</ul>`;
    }

    return `
      <div class="glass-panel" style="padding:20px;margin-bottom:20px;border-radius:18px;${isPrimary ? 'border:1px solid rgba(16, 185, 129, 0.3);' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;gap:8px;">
          <span style="background:${isPrimary ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)'};color:#FFFFFF;padding:5px 12px;border-radius:8px;font-size:0.82rem;font-weight:700;white-space:nowrap;">
            ${isPrimary ? 'Option 1: Fastest Route' : `Option ${rIdx + 1}: Alternative Route`}
          </span>
          <span style="background:var(--bg-surface);color:var(--text-secondary);border:1px solid var(--border-color);padding:4px 10px;border-radius:6px;font-size:0.8rem;font-weight:600;display:inline-flex;align-items:center;gap:4px;">
            ${isPrimary ? 'Hide Journey &#9652;' : 'View Journey &#9662;'}
          </span>
        </div>

        <!-- Signature Stats Summary Bar (Matching RouteResultCard) -->
        <div style="background:var(--header-summary-bg, #1E293B);padding:14px 8px;color:#FFFFFF;display:grid;grid-template-columns:repeat(4, 1fr);text-align:center;align-items:center;border-radius:12px;margin-bottom:16px;">
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
            <div style="font-size:clamp(1.2rem, 4vw, 1.5rem);font-weight:800;color:#F472B6;line-height:1;">${switches ?? 0}</div>
            <div style="font-size:0.7rem;text-transform:uppercase;color:#94A3B8;margin-top:4px;font-weight:600;letter-spacing:0.02em;white-space:nowrap;">${switches === 1 ? 'SWITCH' : 'SWITCHES'}</div>
          </div>
        </div>

        ${legsHtml ? `
          <div style="margin-top:14px;padding-top:14px;border-top:1px dashed var(--border-color);">
            <div style="font-weight:700;font-size:0.9rem;margin-bottom:10px;color:var(--text-primary);">Route Station Timetable &amp; Interchange Guide</div>
            ${legsHtml}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
      ${buildAppHeaderHtml(appName)}

      <main style="max-width:900px;width:100%;margin:0 auto;">
        <!-- Sub-header Controls matching RouteSeoPage -->
        <div data-nosnippet style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px;flex-wrap:wrap;">
          <a href="/" style="color:var(--accent-primary);text-decoration:none;font-size:0.9rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;padding:6px 0;">
            &larr; Back to Planner
          </a>
          <a href="/" style="background:var(--accent-primary);color:#FFFFFF;padding:8px 16px;border-radius:10px;text-decoration:none;font-size:0.85rem;font-weight:600;display:inline-flex;align-items:center;gap:6px;">
            Open Interactive Map
          </a>
        </div>
      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="background:rgba(16, 185, 129, 0.12);color:#10B981;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;letter-spacing:0.5px;">
            ${routesCount > 1 ? `${routesCount} ROUTE OPTIONS AVAILABLE` : 'DIRECT & FASTEST ROUTE'}
          </span>
        </div>
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 10px 0;color:var(--text-primary);line-height:1.3;">
          ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} Metro Route &amp; Fare ${primaryRoute.fare ? `(&#8377;${primaryRoute.fare})` : ''}
        </h1>
        <p style="color:var(--text-secondary);font-size:0.92rem;line-height:1.5;margin:0;">
          ${routesCount > 1
            ? `Compare all ${routesCount} available route options from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)}. Check fares, travel times, station stops, and platform transfers.`
            : 'Complete travel guide with token fare, smart card discount, total travel time, stops, and line interchanges.'}
        </p>
      </div>

      ${routesHtml}

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
              The standard token fare is ₹${primaryRoute.fare || 0}. Passengers using a Metro Smart Card receive a discount (₹${primaryRoute.smartCardFare || primaryRoute.fare || 0}).
            </p>
          </div>
          <div>
            <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
              How long does it take from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} by metro?
            </h4>
            <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
              The fastest route takes approximately ${primaryRoute.totalTimeMins || 0} minutes covering ${primaryRoute.totalDistanceKm || ''} km with ${primaryRoute.switches || 0} line switch(es).
              ${routesCount > 1 ? ` Alternative routes take up to ${Math.max(...routesList.map(r => r.totalTimeMins || 0))} minutes.` : ''}
            </p>
          </div>
          ${routesCount > 1 ? `
          <div>
            <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
              Are there alternative metro routes between ${escapeHtml(fromStation.name)} and ${escapeHtml(toStation.name)}?
            </h4>
            <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
              Yes, there are ${routesCount} route options available. You can compare the fastest route and alternative options above based on your preference for fewer transfers or lower fare.
            </p>
          </div>
          ` : ''}
        </div>
      </div>
    </main>
    </div>

    <footer data-nosnippet style="margin-top:16px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}

// ─── Station SSR HTML Builder ─────────────────────────────────────────────────
export function buildStationSsrHtml(station, lineNames, appName = "Kochi Metro") {
  return `
    <div class="app-container" style="max-width:1200px;margin:0 auto;padding:16px;">
      ${buildAppHeaderHtml(appName)}

      <main style="max-width:900px;width:100%;margin:0 auto;padding:8px 0 40px 0;">
      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 8px 0;color:var(--text-primary);line-height:1.3;">
          ${escapeHtml(station.name)} Metro Station
        </h1>
        <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">
          Connected lines: <strong>${escapeHtml(lineNames)}</strong>. First and last train timetable, gate guide, and route directions.
        </p>
      </div>

      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <h2 style="font-size:1.15rem;font-weight:700;color:var(--text-primary);margin:0 0 8px 0;">Station Overview</h2>
        <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;">
          Station Code: <strong>${escapeHtml(station.code || station.id)}</strong> &bull; Connected Lines: <strong>${escapeHtml(lineNames)}</strong>
        </p>
      </div>
    </main>
    </div>

    <footer data-nosnippet style="margin-top:16px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}
