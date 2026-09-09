import { getStationBySlug, getStationSlug } from '../../src/utils/slugify.js';

export async function onRequest(context) {
  const { params, request } = context;
  const slug = params.from;
  const url = new URL(request.url);

  const st = getStationBySlug(slug);
  if (st) {
    const canonicalSlug = getStationSlug(st);
    return new Response(null, {
      status: 301,
      headers: {
        'Location': `${url.origin}/station/${canonicalSlug}/`,
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  }

  return new Response(null, {
    status: 301,
    headers: {
      'Location': `${url.origin}/stations/`,
      'Cache-Control': 'public, max-age=86400'
    }
  });
}
