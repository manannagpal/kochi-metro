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
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <span style="background:${isPrimary ? 'var(--accent-primary)' : 'rgba(255, 255, 255, 0.08)'};color:#FFFFFF;padding:4px 10px;border-radius:12px;font-size:0.78rem;font-weight:700;">
              ${isPrimary ? 'Option 1: Fastest Route (Recommended)' : `Option ${rIdx + 1}: Alternative Route`}
            </span>
          </div>
          <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
            ${(route.linesUsed || []).map(lName => `<span style="font-size:0.75rem;font-weight:600;padding:2px 8px;border-radius:6px;background:rgba(255, 255, 255, 0.06);color:var(--text-secondary);border:1px solid var(--border-color);">${escapeHtml(lName)}</span>`).join('')}
          </div>
        </div>

        <div style="display:grid;grid-template-columns:repeat(4, 1fr);gap:8px;margin-bottom:16px;">
          <div style="background:var(--bg-card);padding:10px 4px;border-radius:10px;border:1px solid var(--border-color);text-align:center;">
            <div style="color:#10B981;font-size:0.72rem;font-weight:700;">Token</div>
            <div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin:4px 0 2px 0;line-height:1;">₹${fare ?? '—'}</div>
            <div style="font-size:0.68rem;color:#10B981;font-weight:600;white-space:nowrap;">Card: ₹${smartCardFare ?? '—'}</div>
          </div>
          <div style="background:var(--bg-card);padding:10px 4px;border-radius:10px;border:1px solid var(--border-color);text-align:center;">
            <div style="color:var(--accent-primary);font-size:0.72rem;font-weight:700;">Time</div>
            <div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin:4px 0 2px 0;line-height:1;white-space:nowrap;">${time ? time + ' <span style="font-size:0.75rem;font-weight:600;">min</span>' : '—'}</div>
            <div style="font-size:0.68rem;color:var(--text-muted);white-space:nowrap;">Duration</div>
          </div>
          <div style="background:var(--bg-card);padding:10px 4px;border-radius:10px;border:1px solid var(--border-color);text-align:center;">
            <div style="color:var(--text-muted);font-size:0.72rem;font-weight:700;">Distance</div>
            <div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin:4px 0 2px 0;line-height:1;white-space:nowrap;">${distance ? distance + ' <span style="font-size:0.75rem;font-weight:600;">km</span>' : '—'}</div>
            <div style="font-size:0.68rem;color:var(--text-muted);white-space:nowrap;">${stops} stops</div>
          </div>
          <div style="background:var(--bg-card);padding:10px 4px;border-radius:10px;border:1px solid var(--border-color);text-align:center;">
            <div style="color:var(--text-muted);font-size:0.72rem;font-weight:700;">Switch</div>
            <div style="font-size:1.25rem;font-weight:800;color:var(--text-primary);margin:4px 0 2px 0;line-height:1;white-space:nowrap;">${switches !== undefined ? switches : '—'}</div>
            <div style="font-size:0.68rem;color:${switches === 0 ? '#10B981' : 'var(--text-muted)'};white-space:nowrap;">${switches === 0 ? 'Direct' : switches + ' Switch'}</div>
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
    <header style="background:var(--bg-surface);border-bottom:1px solid var(--border-color);position:sticky;top:0;z-index:100;">
      <div style="max-width:1100px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;">
        <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary);">
          <img src="/icon-192.png" alt="${escapeAttr(appName)}" style="width:36px;height:36px;border-radius:50%;" />
          <div>
            <div style="font-weight:800;font-size:1.05rem;line-height:1.2;color:var(--text-primary);">${escapeHtml(appName)}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">Interactive Map &amp; Route Planner</div>
          </div>
        </a>
        <a href="/" style="background:var(--accent-primary);color:#FFFFFF;padding:8px 14px;border-radius:10px;text-decoration:none;font-size:0.85rem;font-weight:600;">Open App</a>
      </div>
    </header>

    <main style="max-width:900px;margin:0 auto;padding:24px 16px 0 16px;">
      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:12px;">
          <span style="background:rgba(16, 185, 129, 0.12);color:#10B981;padding:4px 10px;border-radius:20px;font-size:0.75rem;font-weight:700;letter-spacing:0.5px;">
            ${routesCount > 1 ? `${routesCount} ROUTE OPTIONS AVAILABLE` : 'DIRECT & FASTEST ROUTE'}
          </span>
        </div>
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 10px 0;color:var(--text-primary);line-height:1.3;">
          ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} Metro Route
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

    <footer style="margin-top:16px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}

// ─── Station SSR HTML Builder ─────────────────────────────────────────────────
export function buildStationSsrHtml(station, lineNames, appName = "Kochi Metro") {
  return `
    <header style="background:var(--bg-surface);border-bottom:1px solid var(--border-color);position:sticky;top:0;z-index:100;">
      <div style="max-width:1100px;margin:0 auto;padding:12px 20px;display:flex;align-items:center;justify-content:space-between;">
        <a href="/" style="display:flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-primary);">
          <img src="/icon-192.png" alt="${escapeAttr(appName)}" style="width:36px;height:36px;border-radius:50%;" />
          <div>
            <div style="font-weight:800;font-size:1.05rem;line-height:1.2;color:var(--text-primary);">${escapeHtml(appName)}</div>
            <div style="font-size:0.72rem;color:var(--text-muted);">Station Directory &amp; Guide</div>
          </div>
        </a>
        <a href="/" style="background:var(--accent-primary);color:#FFFFFF;padding:8px 14px;border-radius:10px;text-decoration:none;font-size:0.85rem;font-weight:600;">Plan Route</a>
      </div>
    </header>

    <main style="max-width:900px;margin:0 auto;padding:24px 16px 40px 16px;">
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

    <footer style="margin-top:16px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}
