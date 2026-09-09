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
export function buildRouteSsrHtml(fromStation, toStation, primaryRoute, appName = "Kochi Metro") {
  const fare = primaryRoute.fare;
  const smartCardFare = primaryRoute.smartCardFare || primaryRoute.fare;
  const time = primaryRoute.totalTimeMins;
  const distance = formatKm(primaryRoute.totalDistanceKm);
  const stops = primaryRoute.totalStops || (primaryRoute.stations ? primaryRoute.stations.length : 'Multiple');
  const switches = primaryRoute.switches;
  const interchangeText = switches === 0 ? 'Direct Train' : (primaryRoute.interchangeStations ? primaryRoute.interchangeStations.map(i => i.stationName || i.name || i).join(', ') : `${switches} Switch(es)`);

  const legsHtml = (primaryRoute.legs || []).map((leg, idx) => {
    const lineName = leg.lineDef?.name || leg.lineName || 'Metro Line';
    const lineColor = leg.lineDef?.color || leg.lineColor || '#0072CE';
    const legDistance = formatKm(leg.distance);
    const stopsCount = leg.stopsCount || (leg.stations ? leg.stations.length : '');

    return `
      <div style="margin-bottom:14px;padding:16px;background:var(--input-bg);border-left:4px solid ${lineColor};border-radius:12px;">
        <div style="font-weight:700;font-size:0.98rem;color:var(--text-primary);margin-bottom:4px;">
          Leg ${idx + 1}: ${escapeHtml(lineName)} (Towards ${escapeHtml(leg.direction || 'Destination')})
        </div>
        <div style="font-size:0.86rem;color:var(--text-secondary);margin-bottom:8px;">
          Board at <strong>${escapeHtml(leg.fromStationName || fromStation.name)}</strong> &rarr; Alight at <strong>${escapeHtml(leg.toStationName || toStation.name)}</strong> (${stopsCount} stops, ${legDistance} km)
        </div>
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
            <div style="font-size:0.72rem;color:var(--text-muted);">Route Finder &amp; Guide</div>
          </div>
        </a>
        <a href="/" style="background:var(--accent-primary);color:#FFFFFF;padding:8px 14px;border-radius:10px;text-decoration:none;font-size:0.85rem;font-weight:600;">Plan Route</a>
      </div>
    </header>

    <main style="max-width:900px;margin:0 auto;padding:24px 16px 40px 16px;">
      <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:20px;">
        <a href="/" style="color:var(--accent-primary);text-decoration:none;font-size:0.92rem;font-weight:600;display:flex;align-items:center;gap:6px;">
          &larr; <span>Search Other Routes</span>
        </a>
        <a href="/" style="background:var(--accent-primary);color:#FFF;padding:8px 14px;border-radius:10px;text-decoration:none;font-size:0.85rem;font-weight:600;">
          Open in Interactive Route Planner
        </a>
      </div>

      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <h1 style="font-size:1.6rem;font-weight:800;margin:0 0 10px 0;color:var(--text-primary);line-height:1.3;">
          ${escapeHtml(fromStation.name)} <span style="color:var(--accent-primary);">&rarr;</span> ${escapeHtml(toStation.name)} Metro Route
        </h1>
        <p style="color:var(--text-secondary);font-size:0.95rem;margin:0;">
          Complete travel guide with token fare, smart card discount, total travel time, stops, and line interchanges.
        </p>

        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-top:20px;">
          <div style="background:var(--input-bg);padding:14px;border-radius:12px;">
            <div style="color:var(--accent-success);font-size:0.85rem;font-weight:600;">Token Fare</div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin-top:4px;">₹${fare}</div>
            <div style="font-size:0.75rem;color:var(--accent-success);font-weight:500;">Smart Card: ₹${smartCardFare}</div>
          </div>
          <div style="background:var(--input-bg);padding:14px;border-radius:12px;">
            <div style="color:var(--accent-primary);font-size:0.85rem;font-weight:600;">Travel Time</div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin-top:4px;">${time} mins</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">Approx journey duration</div>
          </div>
          <div style="background:var(--input-bg);padding:14px;border-radius:12px;">
            <div style="color:var(--accent-warning);font-size:0.85rem;font-weight:600;">Total Distance</div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin-top:4px;">${distance} km</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${stops} metro stops</div>
          </div>
          <div style="background:var(--input-bg);padding:14px;border-radius:12px;">
            <div style="color:var(--accent-secondary);font-size:0.85rem;font-weight:600;">Line Changes</div>
            <div style="font-size:1.4rem;font-weight:800;color:var(--text-primary);margin-top:4px;">${switches} Switch${switches !== 1 ? 'es' : ''}</div>
            <div style="font-size:0.75rem;color:var(--text-muted);">${escapeHtml(interchangeText)}</div>
          </div>
        </div>
      </div>

      ${legsHtml ? `
        <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
          <h2 style="font-size:1.2rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
            Step-by-Step Route &amp; Station Stops
          </h2>
          ${legsHtml}
        </div>
      ` : ''}

      <div class="glass-panel" style="padding:24px;margin-bottom:24px;border-radius:20px;">
        <h3 style="font-size:1.1rem;font-weight:700;margin:0 0 16px 0;color:var(--text-primary);">
          Frequently Asked Questions (${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)})
        </h3>
        <div style="display:flex;flex-direction:column;gap:14px;">
          <div>
            <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
              What is the metro fare from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)}?
            </h4>
            <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
              The standard token fare is ₹${fare}. Passengers using a Metro Smart Card receive a discount (₹${smartCardFare}).
            </p>
          </div>
          <div>
            <h4 style="font-size:0.92rem;font-weight:700;color:var(--text-primary);margin:0 0 4px 0;">
              How long does it take from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} by metro?
            </h4>
            <p style="font-size:0.88rem;color:var(--text-secondary);margin:0;line-height:1.5;">
              The journey takes approximately ${time} minutes covering ${distance} km with ${switches} line switch(es).
            </p>
          </div>
        </div>
      </div>
    </main>

    <footer style="margin-top:48px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
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

    <footer style="margin-top:48px;padding:28px 24px;border-top:1px solid var(--border-color);text-align:center;color:var(--text-muted);font-size:0.85rem;background:var(--bg-surface);">
      <p style="margin:0;">&copy; 2026 ${escapeHtml(appName)} Route Finder</p>
    </footer>
  `;
}
