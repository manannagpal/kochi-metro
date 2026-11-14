// Cloudflare Pages Edge Middleware for Kochi Metro
// Enforces host canonicalization (301 redirect www to apex), HTTPS, lowercase URLs, and trailing slashes.

const CANONICAL_HOST = 'kochi.metro.org.in';
const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

export async function onRequest(context) {
  const { request, next } = context;
  const url = new URL(request.url);

  const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
  let shouldRedirect = false;
  const targetUrl = new URL(request.url);

  // 1. Hostname Canonicalization: Redirect www.kochi.metro.org.in -> kochi.metro.org.in
  if (!isLocal) {
    if (url.hostname.startsWith('www.') || (url.hostname.endsWith('metro.org.in') && url.hostname !== CANONICAL_HOST)) {
      targetUrl.hostname = CANONICAL_HOST;
      shouldRedirect = true;
    }

    // 2. Protocol Normalization: Force HTTPS
    if (url.protocol === 'http:') {
      targetUrl.protocol = 'https:';
      shouldRedirect = true;
    }
  }

  // 3. Path Normalization: Case sensitivity (e.g. /Route/... -> /route/...)
  const pathname = targetUrl.pathname;
  const isStaticFile = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (!isStaticFile && /[A-Z]/.test(pathname)) {
    targetUrl.pathname = pathname.toLowerCase();
    shouldRedirect = true;
  }

  // 4. Trailing Slash Normalization for dynamic directory paths (e.g. /route/from/to -> /route/from/to/)
  if (!isStaticFile && !targetUrl.pathname.endsWith('/')) {
    targetUrl.pathname = targetUrl.pathname + '/';
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    return Response.redirect(targetUrl.toString(), 301);
  }

  // Execute downstream functions or fetch static assets
  const response = await next();

  // Inject security & indexing headers
  const headers = new Headers(response.headers);
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}
