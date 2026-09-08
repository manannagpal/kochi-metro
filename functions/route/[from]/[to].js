import { getStationBySlug, getStationSlug } from '../../../src/utils/slugify.js';
import { calculateRoutes } from '../../../src/routing/routeEngine.js';

export async function onRequest(context) {
  if (context.passThroughOnException) {
    context.passThroughOnException();
  }
  const { params, env, request } = context;

  // 1. Edge Cache Lookup for instant sub-30ms response
  try {
    const cache = caches.default;
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
  } catch (e) {}

  const fromSlug = params.from;
  const toSlug = params.to;

  const fromSt = getStationBySlug(fromSlug);
  const toSt = getStationBySlug(toSlug);

  const assetResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url).toString()));

  if (!fromSt || !toSt || fromSt.id === toSt.id) return assetResponse;

  let routes = [];
  try {
    routes = calculateRoutes(fromSt.id, toSt.id);
  } catch (err) {}
  if (!routes || routes.length === 0) return assetResponse;

  const primaryRoute = routes[0];
  const canonicalFromSlug = getStationSlug(fromSt);
  const canonicalToSlug = getStationSlug(toSt);

  const title = `${fromSt.name} to ${toSt.name} Metro Route, Fare (&#8377;${primaryRoute.fare}) & Travel Time | Kochi Metro (KMRL)`;
  const description = `Kochi Metro route from ${fromSt.name} to ${toSt.name}: fare &#8377;${primaryRoute.fare} (smart card &#8377;${primaryRoute.smartCardFare}), time ${primaryRoute.totalTimeMins} mins, distance ${primaryRoute.totalDistanceKm} km with ${primaryRoute.switches} interchange(s).`;
  const keywords = `${fromSt.name} to ${toSt.name} metro route, ${fromSt.name} metro fare, Kochi metro fare calculator, ${fromSt.name} to ${toSt.name} distance`;
  const canonicalUrl = `https://kochi.metro.org.in/route/${canonicalFromSlug}/${canonicalToSlug}/`;

  const faqSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What is the metro fare from ${fromSt.name} to ${toSt.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Token fare is &#8377;${primaryRoute.fare}. With a smart card the fare is &#8377;${primaryRoute.smartCardFare}.`
        }
      },
      {
        "@type": "Question",
        "name": `How long does it take to travel from ${fromSt.name} to ${toSt.name} by metro?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The journey takes approximately ${primaryRoute.totalTimeMins} minutes covering ${primaryRoute.totalDistanceKm} km with ${primaryRoute.switches} interchange(s).`
        }
      },
      {
        "@type": "Question",
        "name": `How many interchanges are there from ${fromSt.name} to ${toSt.name}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `There ${primaryRoute.switches === 1 ? "is" : "are"} ${primaryRoute.switches} interchange${primaryRoute.switches === 1 ? "" : "s"} on this route.`
        }
      }
    ]
  });


  const escapeHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const legsHtml = (primaryRoute.legs || []).map((leg, idx) => {
    const lineName = leg.lineDef?.name || leg.lineName || 'Metro Line';
    const lineColor = leg.lineDef?.color || leg.lineColor || '#0072CE';
    return '<div style="margin-bottom:12px;padding:12px;background:#f8fafc;border-left:4px solid ' + lineColor + ';border-radius:6px;">' +
      '<div style="font-weight:700;color:#0f172a;">Leg ' + (idx + 1) + ': ' + escapeHtml(lineName) + ' (Towards ' + escapeHtml(leg.direction || 'Destination') + ')</div>' +
      '<div style="font-size:0.85rem;color:#64748b;">Board at <strong>' + escapeHtml(leg.fromStationName || fromSt.name) + '</strong> &rarr; Alight at <strong>' + escapeHtml(leg.toStationName || toSt.name) + '</strong> (' + (leg.stopsCount || leg.stations?.length || '') + ' stops, ' + (leg.distance || '') + ' km)</div>' +
      '</div>';
  }).join('');

  const ssrBodyHtml = '<div style="max-width:900px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;color:#1e293b;line-height:1.5;">' +
    '<header style="margin-bottom:20px;"><h1 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin:0 0 8px 0;">' + escapeHtml(fromSt.name) + ' to ' + escapeHtml(toSt.name) + ' Metro Route</h1>' +
    '<p style="color:#475569;font-size:0.95rem;margin:0;">Complete travel guide with token fare, travel duration, stops, and line switches.</p></header>' +
    '<section style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px;margin-bottom:20px;">' +
    '<div style="background:#f1f5f9;padding:12px;border-radius:8px;"><div style="font-size:0.75rem;font-weight:700;color:#059669;">TOKEN FARE</div><div style="font-size:1.4rem;font-weight:800;color:#0f172a;">&#8377;' + primaryRoute.fare + '</div><div style="font-size:0.75rem;color:#059669;">Smart Card: &#8377;' + primaryRoute.smartCardFare + '</div></div>' +
    '<div style="background:#f1f5f9;padding:12px;border-radius:8px;"><div style="font-size:0.75rem;font-weight:700;color:#2563eb;">TRAVEL TIME</div><div style="font-size:1.4rem;font-weight:800;color:#0f172a;">' + primaryRoute.totalTimeMins + ' mins</div><div style="font-size:0.75rem;color:#64748b;">Approx duration</div></div>' +
    '<div style="background:#f1f5f9;padding:12px;border-radius:8px;"><div style="font-size:0.75rem;font-weight:700;color:#d97706;">DISTANCE</div><div style="font-size:1.4rem;font-weight:800;color:#0f172a;">' + primaryRoute.totalDistanceKm + ' km</div><div style="font-size:0.75rem;color:#64748b;">' + (primaryRoute.totalStops || (primaryRoute.stations ? primaryRoute.stations.length : 'Multiple')) + ' stops</div></div>' +
    '<div style="background:#f1f5f9;padding:12px;border-radius:8px;"><div style="font-size:0.75rem;font-weight:700;color:#7c3aed;">INTERCHANGE</div><div style="font-size:1.4rem;font-weight:800;color:#0f172a;">' + primaryRoute.switches + ' Switch' + (primaryRoute.switches !== 1 ? 'es' : '') + '</div><div style="font-size:0.75rem;color:#64748b;">' + (primaryRoute.switches === 0 ? 'Direct train' : 'Line change') + '</div></div>' +
    '</section>' +
    (legsHtml ? '<section style="margin-bottom:20px;"><h2 style="font-size:1.2rem;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Route &amp; Interchange Guide</h2>' + legsHtml + '</section>' : '') +
    '<section style="background:#f8fafc;padding:16px;border-radius:10px;border:1px solid #e2e8f0;"><h2 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin:0 0 12px 0;">Frequently Asked Questions</h2>' +
    '<div><h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin:0 0 4px 0;">What is the metro fare from ' + escapeHtml(fromSt.name) + ' to ' + escapeHtml(toSt.name) + '?</h3><p style="font-size:0.85rem;color:#475569;margin:0;">The standard token fare is &#8377;' + primaryRoute.fare + ' (Smart Card: &#8377;' + primaryRoute.smartCardFare + ').</p></div>' +
    '<div style="margin-top:10px;"><h3 style="font-size:0.9rem;font-weight:700;color:#0f172a;margin:0 0 4px 0;">How long does it take by metro?</h3><p style="font-size:0.85rem;color:#475569;margin:0;">The journey takes approximately ' + primaryRoute.totalTimeMins + ' minutes covering ' + primaryRoute.totalDistanceKm + ' km with ' + primaryRoute.switches + ' line switch(es).</p></div>' +
    '</section>' +
    '<section style="margin-top:20px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:0.85rem;color:#64748b;">' +
    '<p><a href="/" style="color:#2563eb;text-decoration:none;font-weight:600;">Plan your journey with ' + 'Kochi Metro' + ' Route Finder &rarr;</a></p>' +
    '</section></div>';

  let html = await assetResponse.text();
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}<\/title>`);
  html = html.replace(/<meta name="description" content=".*?" \/?>/i, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta name="keywords" content=".*?" \/?>/i, `<meta name="keywords" content="${keywords}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  const fullOg = `
  <meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />
  <meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />
  <script type="application/ld+json">${faqSchema}</script>
  `;
  html = html.replace('</head>', `${fullOg}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${ssrBodyHtml}</div>`);

  const response = new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800'
    }
  });

  try {
    context.waitUntil(caches.default.put(request, response.clone()));
  } catch (e) {}

  return response;
}
