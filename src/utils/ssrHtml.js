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

export function buildRouteSsrHtml(fromStation, toStation, primaryRoute, appName = "Kochi Metro") {
  const fare = primaryRoute.fare;
  const smartCardFare = primaryRoute.smartCardFare;
  const time = primaryRoute.totalTimeMins;
  const distance = formatKm(primaryRoute.totalDistanceKm);
  const stops = primaryRoute.totalStops || (primaryRoute.stations ? primaryRoute.stations.length : 'Multiple');
  const switches = primaryRoute.switches;

  const legsHtml = (primaryRoute.legs || []).map((leg, idx) => {
    const lineName = leg.lineDef?.name || leg.lineName || 'Metro Line';
    const lineColor = leg.lineDef?.color || leg.lineColor || '#0072CE';
    const legDistance = formatKm(leg.distance);
    const stopsCount = leg.stopsCount || (leg.stations ? leg.stations.length : '');

    return `
      <div style="margin-bottom:12px;padding:12px 14px;background:#f8fafc;border-left:4px solid ${lineColor};border-radius:8px;">
        <div style="font-weight:700;color:#0f172a;font-size:0.95rem;">
          Leg ${idx + 1}: ${escapeHtml(lineName)} (Towards ${escapeHtml(leg.direction || 'Destination')})
        </div>
        <div style="font-size:0.85rem;color:#64748b;margin-top:4px;">
          Board at <strong>${escapeHtml(leg.fromStationName || fromStation.name)}</strong> &rarr; Alight at <strong>${escapeHtml(leg.toStationName || toStation.name)}</strong> (${stopsCount} stops, ${legDistance} km)
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="max-width:900px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.5;">
      <header style="margin-bottom:20px;">
        <h1 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin:0 0 8px 0;">
          ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)} Metro Route
        </h1>
        <p style="color:#475569;font-size:0.95rem;margin:0;">
          Complete travel guide with token fare, travel duration, stops, and line switches.
        </p>
      </header>

      <section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px;">
        <div style="background:#f1f5f9;padding:12px;border-radius:8px;">
          <div style="font-size:0.75rem;font-weight:700;color:#059669;">TOKEN FARE</div>
          <div style="font-size:1.4rem;font-weight:800;color:#0f172a;">₹${fare}</div>
          <div style="font-size:0.75rem;color:#059669;">Smart Card: ₹${smartCardFare}</div>
        </div>
        <div style="background:#f1f5f9;padding:12px;border-radius:8px;">
          <div style="font-size:0.75rem;font-weight:700;color:#2563eb;">TRAVEL TIME</div>
          <div style="font-size:1.4rem;font-weight:800;color:#0f172a;">${time} mins</div>
          <div style="font-size:0.75rem;color:#64748b;">Approx duration</div>
        </div>
        <div style="background:#f1f5f9;padding:12px;border-radius:8px;">
          <div style="font-size:0.75rem;font-weight:700;color:#d97706;">DISTANCE</div>
          <div style="font-size:1.4rem;font-weight:800;color:#0f172a;">${distance} km</div>
          <div style="font-size:0.75rem;color:#64748b;">${stops} stops</div>
        </div>
        <div style="background:#f1f5f9;padding:12px;border-radius:8px;">
          <div style="font-size:0.75rem;font-weight:700;color:#7c3aed;">INTERCHANGE</div>
          <div style="font-size:1.4rem;font-weight:800;color:#0f172a;">${switches} Switch${switches !== 1 ? 'es' : ''}</div>
          <div style="font-size:0.75rem;color:#64748b;">${switches === 0 ? 'Direct train' : 'Line change'}</div>
        </div>
      </section>

      ${legsHtml ? `
        <section style="margin-bottom:20px;">
          <h2 style="font-size:1.2rem;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Route &amp; Interchange Guide</h2>
          ${legsHtml}
        </section>
      ` : ''}

      <section style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid #e2e8f0;margin-bottom:20px;">
        <h2 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Frequently Asked Questions</h2>
        <div>
          <h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin:0 0 4px 0;">What is the metro fare from ${escapeHtml(fromStation.name)} to ${escapeHtml(toStation.name)}?</h3>
          <p style="font-size:0.85rem;color:#475569;margin:0;">The standard token fare is ₹${fare} (Smart Card: ₹${smartCardFare}).</p>
        </div>
        <div style="margin-top:10px;">
          <h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin:0 0 4px 0;">How long does it take by metro?</h3>
          <p style="font-size:0.85rem;color:#475569;margin:0;">The journey takes approximately ${time} minutes covering ${distance} km with ${switches} line switch(es).</p>
        </div>
      </section>

      <section style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:0.85rem;color:#64748b;">
        <p><a href="/" style="color:#2563eb;text-decoration:none;font-weight:600;">Plan your journey with ${escapeHtml(appName)} Route Finder &rarr;</a></p>
      </section>
    </div>
  `;
}

export function buildStationSsrHtml(station, lineNames, appName = "Kochi Metro") {
  return `
    <div style="max-width:900px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b;line-height:1.5;">
      <header style="margin-bottom:20px;">
        <h1 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin:0 0 8px 0;">
          ${escapeHtml(station.name)} Metro Station
        </h1>
        <p style="color:#475569;font-size:0.95rem;margin:0;">
          Connected lines: <strong>${escapeHtml(lineNames)}</strong>. Timetable, line info, and route connections.
        </p>
      </header>
      <section style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;">
        <h2 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin:0 0 8px 0;">Station Overview</h2>
        <p style="font-size:0.88rem;color:#334155;margin:0;">
          Station Code: <strong>${escapeHtml(station.code || station.id)}</strong> &bull; Connected Lines: <strong>${escapeHtml(lineNames)}</strong>
        </p>
      </section>
      <section style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:0.85rem;color:#64748b;">
        <p><a href="/" style="color:#2563eb;text-decoration:none;font-weight:600;">Plan your journey with ${escapeHtml(appName)} Route Finder &rarr;</a></p>
      </section>
    </div>
  `;
}
