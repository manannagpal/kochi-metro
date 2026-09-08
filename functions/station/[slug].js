import { stations, lines } from '../../src/data/kochiMetroData.js';
import { getStationBySlug, getStationSlug } from '../../src/utils/slugify.js';

export async function onRequest(context) {
  if (context.passThroughOnException) {
    context.passThroughOnException();
  }
  const { params, env, request } = context;

  try {
    const cache = caches.default;
    const cachedResponse = await cache.match(request);
    if (cachedResponse) return cachedResponse;
  } catch (e) {}

  const slug = params.slug;
  const assetResponse = await env.ASSETS.fetch(new Request(new URL('/', request.url).toString()));

  const st = getStationBySlug(slug);
  if (!st) return assetResponse;

  const lineIds = Array.isArray(st.lines) ? st.lines : (st.line ? [st.line] : []);
  const lineNames = lineIds.map(id => (lines[id] ? lines[id].name : id)).filter(Boolean).join(', ') || 'Metro';

  const canonicalSlug = getStationSlug(st);
  const title = `${st.name} Metro Station Timings, Lines & Fare | Kochi Metro (KMRL)`;
  const description = `${st.name} Metro Station (${lineNames}): Check first and last train timings, ticket fares, connecting lines, and station facilities on Kochi Metro.`;
  const keywords = `${st.name} metro station, ${st.name} metro timing, ${st.name} metro fare, Kochi metro ${st.name}`;
  const canonicalUrl = `https://kochi.metro.org.in/station/${canonicalSlug}/`;


  const escapeHtml = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ssrStationHtml = '<div style="max-width:900px;margin:0 auto;padding:24px 16px;font-family:system-ui,-apple-system,sans-serif;color:#1e293b;line-height:1.5;">' +
    '<header style="margin-bottom:20px;"><h1 style="font-size:1.6rem;font-weight:800;color:#0f172a;margin:0 0 8px 0;">' + escapeHtml(st.name) + ' Metro Station</h1>' +
    '<p style="color:#475569;font-size:0.95rem;margin:0;">Connected lines: <strong>' + escapeHtml(lineNames) + '</strong>. Timetable, line info, and route connections.</p></header>' +
    '<section style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:16px;"><h2 style="font-size:1.1rem;font-weight:700;color:#0f172a;margin:0 0 8px 0;">Station Overview</h2>' +
    '<p style="font-size:0.88rem;color:#334155;margin:0;">Station Code: <strong>' + escapeHtml(st.code || st.id) + '</strong> &bull; Connected Lines: <strong>' + escapeHtml(lineNames) + '</strong></p></section>' +
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
  `;
  html = html.replace('</head>', `${fullOg}\n</head>`);
  html = html.replace('<div id="root"></div>', `<div id="root">${ssrStationHtml}</div>`);

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
