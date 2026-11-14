import { getStationBySlug, getStationSlug } from '../../src/utils/slugify.js';

export async function onRequest(context) {
  const { params } = context;
  const slug = params.from;
  // URL object removed in favor of locked canonical host https://kochi.metro.org.in

  const st = getStationBySlug(slug);
  if (st) {
    const canonicalSlug = getStationSlug(st);
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `https://kochi.metro.org.in/station/${canonicalSlug}/`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  return new Response(null, {
    status: 301,
    headers: {
      'Location': `https://kochi.metro.org.in/stations/`,
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
