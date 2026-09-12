import { buildRouteSsrHtml } from '../../../src/utils/ssrHtml.js';
import { getStationBySlug, getStationSlug } from '../../../src/utils/slugify.js';
import { calculateRoutes } from '../../../src/routing/routeEngine.js';

function replaceRootContent(html, newInnerHtml) {
  const match = html.match(/<div\b[^>]*id=["']root["'][^>]*>/i);
  if (!match) return html;

  const rootStart = match.index;
  const openTag = match[0];
  const contentStart = rootStart + openTag.length;

  let depth = 1;
  const tagRegex = /<!--[\s\S]*?-->|<\/?div\b[^>]*>/gi;
  tagRegex.lastIndex = contentStart;
  let m;
  while ((m = tagRegex.exec(html)) !== null) {
    const token = m[0];
    if (token.startsWith('<!--')) continue;
    if (token.startsWith('</')) {
      depth--;
      if (depth === 0) {
        const rootEnd = tagRegex.lastIndex;
        return html.substring(0, rootStart) + `${openTag}${newInnerHtml}</div>` + html.substring(rootEnd);
      }
    } else if (!token.endsWith('/>')) {
      depth++;
    }
  }

  return html.replace(/<div\b[^>]*id=["']root["'][^>]*>[\s\S]*?<\/body>/i, `${openTag}${newInnerHtml}</div>\n</body>`);
}

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


  const ssrBodyHtml = buildRouteSsrHtml(fromSt, toSt, routes, 'Kochi Metro');

  let html = await assetResponse.text();
  html = html.replace(/<title>.*?<\/title>/i, `<title>${title}<\/title>`);
  html = html.replace(/<meta name="description" content=".*?" \/?>/i, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta name="keywords" content=".*?" \/?>/i, `<meta name="keywords" content="${keywords}" />`);
  html = html.replace(/<link rel="canonical" href=".*?" \/?>/i, `<link rel="canonical" href="${canonicalUrl}" />`);

  // Replace existing OG tags
  html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonicalUrl}" />`);

  // Replace existing Twitter tags
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${title.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;')}" />`);
  html = html.replace(/<meta\s+(?:name|property)=["']twitter:url["'][^>]*>/i, `<meta name="twitter:url" content="${canonicalUrl}" />`);

  const schemaTag = `<script type="application/ld+json">${faqSchema}</script>\n`;
  html = html.replace('</head>', `${schemaTag}</head>`);

  if (ssrBodyHtml) {
    html = replaceRootContent(html, ssrBodyHtml);
  }

  const response = new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800'
    }
  });


  return response;
}
