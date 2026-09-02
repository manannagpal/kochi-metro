import { stations, lines } from '../../src/data/kochiMetroData.js';
import { getStationBySlug, getStationSlug } from '../../src/utils/slugify.js';

export async function onRequest(context) {
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

  const response = new HTMLRewriter()
    .on('title', { element(el) { el.setInnerContent(title, { html: true }); } })
    .on('meta[name="description"]', { element(el) { el.setAttribute('content', description); } })
    .on('meta[name="keywords"]', { element(el) { el.setAttribute('content', keywords); } })
    .on('link[rel="canonical"]', { element(el) { el.setAttribute('href', canonicalUrl); } })
    .on('head', {
      element(el) {
        el.append('<meta property="og:title" content="' + title.replace(/"/g, '&quot;') + '" />', { html: true });
        el.append('<meta property="og:description" content="' + description.replace(/"/g, '&quot;') + '" />', { html: true });
        el.append('<meta property="og:url" content="' + canonicalUrl + '" />', { html: true });
        el.append('<meta name="twitter:card" content="summary" />', { html: true });
        el.append('<meta name="twitter:title" content="' + title.replace(/"/g, '&quot;') + '" />', { html: true });
        el.append('<meta name="twitter:description" content="' + description.replace(/"/g, '&quot;') + '" />', { html: true });
      }
    })
    .transform(new Response(assetResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/html;charset=UTF-8',
        'Cache-Control': 'public, max-age=604800, s-maxage=604800'
      }
    }));

  try {
    context.waitUntil(caches.default.put(request, response.clone()));
  } catch (e) {}

  return response;
}
