import path from 'node:path';

// A managed CDN may bypass application middleware. Never expose visitors'
// pending images until the real Cloud originals/thumbnails have been checked.
// Normal editor uploads and text-only moderated praise continue to work.
export default (_config, { strapi }) => async (ctx, next) => {
  let route: string;
  try { route = path.posix.normalize(decodeURIComponent(ctx.path)).replace(/\/+$/, '').toLowerCase(); }
  catch { return ctx.badRequest('Invalid URL encoding.'); }
  if (route === '/api/auth/local/register') return ctx.forbidden('Public registration is disabled.');
  const multipart = /^multipart\//i.test(ctx.get?.('content-type') || ctx.request.headers?.['content-type'] || '');
  const visitorImage = ctx.method === 'POST' && (
    route === '/api/upload' || route === '/api/mapa-fotografijas' ||
    (route === '/api/pohvalas' && (multipart || Object.keys(ctx.request.files || {}).length > 0))
  );
  if (visitorImage && strapi.config.get('custom.cloudCommunityMediaVerified', false) !== true) {
    ctx.status = 503;
    ctx.set('Cache-Control', 'no-store');
    ctx.body = { error: { message: 'Dodajanje fotografij trenutno ni na voljo. Poskusite znova pozneje.' } };
    return;
  }
  return next();
};
