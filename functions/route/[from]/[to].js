import { buildRouteSsrHtml } from '../../../src/utils/ssrHtml.js';
import { getStationBySlug, getStationSlug } from '../../../src/utils/slugify.js';
import { calculateRoutes } from '../../../src/routing/routeEngine.js';

export async function onRequest(context) {
  if (context.passThroughOnException) {
    context.passThroughOnException();
  }
  const { params, env, request } = context;

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

  const title = `${fromSt.name} to ${toSt.name} Metro Route, Fare (₹${primaryRoute.fare}) & Travel Time | Kochi Metro (KMRL)`;
  const description = `Kochi Metro route from ${fromSt.name} to ${toSt.name}: fare ₹${primaryRoute.fare} (smart card ₹${primaryRoute.smartCardFare}), time ${primaryRoute.totalTimeMins} mins, distance ${primaryRoute.totalDistanceKm} km with ${primaryRoute.switches} interchange(s).`;
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
          "text": `Token fare is ₹${primaryRoute.fare}. With a smart card the fare is ₹${primaryRoute.smartCardFare}.`
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


  const ssrBodyHtml = buildRouteSsrHtml(fromSt, toSt, primaryRoute, 'Kochi Metro');

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


  return response;
}
