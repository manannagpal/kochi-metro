import { getStationBySlug, getStationSlug } from '../../../src/utils/slugify.js';
import { calculateRoutes } from '../../../src/routing/routeEngine.js';

export async function onRequest(context) {
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

  const routes = calculateRoutes(fromSt.id, toSt.id);
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
        el.append('<script type="application/ld+json">' + faqSchema + '</script>', { html: true });
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
