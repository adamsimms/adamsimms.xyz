const REALM = 'Portfolio Archive';

// Single CSP for archive HTML — must allow WASM for Ruffle.
const ARCHIVE_CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' https://analytics.adamsimms.xyz; style-src 'self' 'unsafe-inline'; font-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self' https://analytics.adamsimms.xyz; worker-src 'self' blob:; object-src 'self'";

function isProtectedPath(pathname) {
  return (
    pathname === '/archive' ||
    pathname.startsWith('/archive/') ||
    pathname === '/2009' ||
    pathname.startsWith('/2009/')
  );
}

function unauthorized() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': `Basic realm="${REALM}", charset="UTF-8"`,
      'Cache-Control': 'no-store',
    },
  });
}

function notConfigured() {
  return new Response('Archive access is not configured.', {
    status: 503,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function expectedAuthHeader(user, password) {
  return `Basic ${btoa(`${user}:${password}`)}`;
}

function archiveObjectKey(pathname) {
  // /2009/* redirects to /archive/2009/*, but serve either shape from R2.
  const normalized = pathname.startsWith('/2009/')
    ? `/archive${pathname}`
    : pathname;
  return normalized.replace(/^\/+/, '');
}

function isArchiveAssetPath(pathname) {
  return (
    pathname.startsWith('/archive/2009/') || pathname.startsWith('/2009/')
  );
}

function responseFromR2Object(object) {
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  // Auth-gated; keep private so shared caches don't store archive media.
  if (!headers.has('Cache-Control')) {
    headers.set('Cache-Control', 'private, max-age=86400');
  }

  if (object.range) {
    const { offset, length } = object.range;
    const end = offset + length - 1;
    headers.set('Content-Range', `bytes ${offset}-${end}/${object.size}`);
    headers.set('Content-Length', String(length));
    return new Response(object.body, { status: 206, headers });
  }

  return new Response(object.body, { status: 200, headers });
}

async function serveArchiveAsset(request, env, pathname) {
  const bucket = env.ARCHIVE_BUCKET;
  if (!bucket) {
    return null;
  }

  const key = archiveObjectKey(pathname);
  if (!key || key.endsWith('/')) {
    return null;
  }

  if (request.method === 'HEAD') {
    const object = await bucket.head(key);
    if (object === null) {
      return null;
    }
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Length', String(object.size));
    if (!headers.has('Cache-Control')) {
      headers.set('Cache-Control', 'private, max-age=86400');
    }
    return new Response(null, { status: 200, headers });
  }

  if (request.method !== 'GET') {
    return null;
  }

  const object = await bucket.get(key, {
    range: request.headers,
    onlyIf: request.headers,
  });

  if (object === null) {
    return null;
  }

  // Conditional request failed (e.g. If-None-Match).
  if (!('body' in object) || object.body === null) {
    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set('etag', object.httpEtag);
    return new Response(null, { status: 304, headers });
  }

  return responseFromR2Object(object);
}

export async function onRequest(context) {
  const { request, env, next } = context;
  const { pathname } = new URL(request.url);

  if (!isProtectedPath(pathname)) {
    return next();
  }

  const user = env.ARCHIVE_AUTH_USER;
  const password = env.ARCHIVE_AUTH_PASSWORD;

  if (!user || !password) {
    return notConfigured();
  }

  const auth = request.headers.get('Authorization');
  if (auth !== expectedAuthHeader(user, password)) {
    return unauthorized();
  }

  if (isArchiveAssetPath(pathname)) {
    const fromR2 = await serveArchiveAsset(request, env, pathname);
    if (fromR2) {
      return fromR2;
    }
  }

  const response = await next();
  // Ensure one archive CSP (Pages _headers can stack with /* and AND in browsers).
  const headers = new Headers(response.headers);
  headers.delete('Content-Security-Policy');
  headers.set('Content-Security-Policy', ARCHIVE_CSP);
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
