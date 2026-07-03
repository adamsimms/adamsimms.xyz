const REALM = 'Portfolio Archive';

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

  return next();
}
