import { open } from 'node:fs/promises';

// The site's anonymous submissions use these three routes. Admin uploads retain
// the normal CMS limits and content type choices.
const routes = new Set(['/api/pohvalas', '/api/mapa-fotografijas', '/api/upload']);
const windowMs = 10 * 60 * 1000;
const requests = new Map<string, { count: number; expires: number }>();

export default () => async (ctx, next) => {
  const route = ctx.path.replace(/\/+$/, '').toLowerCase();
  if (ctx.method !== 'POST' || !routes.has(route)) return next();
  const now = Date.now();
  for (const [key, value] of requests) if (value.expires <= now) requests.delete(key);
  const key = `${ctx.ip}:${route}`;
  const record = requests.get(key) ?? { count: 0, expires: now + windowMs };
  record.count += 1;
  requests.set(key, record);
  if (record.count > 20) {
    ctx.status = 429;
    ctx.body = { error: { message: 'Too many submissions. Please try again later.' } };
    ctx.set('Retry-After', String(Math.ceil((record.expires - now) / 1000)));
    return;
  }
  const hasFiles = Object.keys(ctx.request.files || {}).length > 0;
  if (route === '/api/upload' || (route === '/api/pohvalas' && hasFiles)) {
    if (Object.keys(ctx.query).length) return ctx.badRequest('Upload replacement and query options are disabled.');
    // Public uploads cannot attach themselves to another content record or set metadata.
    if (route === '/api/upload') ctx.request.body = {};
    if (Object.keys(ctx.request.files || {}).some((key) => key !== 'files')) {
      return ctx.badRequest('Attach one image using the files field.');
    }

    const value = ctx.request.files?.files;
    const files = Array.isArray(value) ? value : value ? [value] : [];
    if (files.length !== 1 || files[0].size > 5 * 1024 * 1024) {
      return ctx.badRequest('Upload one image, no larger than 5 MB.');
    }
    const file = files[0];
    const handle = await open(file.filepath ?? file.path, 'r');
    const bytes = Buffer.alloc(16);
    try { await handle.read(bytes, 0, bytes.length, 0); } finally { await handle.close(); }
    const jpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const png = bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
    const webp = bytes.toString('ascii', 0, 4) === 'RIFF' && bytes.toString('ascii', 8, 12) === 'WEBP';
    const avif = bytes.toString('ascii', 4, 8) === 'ftyp' && ['avif', 'avis'].includes(bytes.toString('ascii', 8, 12));
    const allowed = { 'image/jpeg': jpeg, 'image/png': png, 'image/webp': webp, 'image/avif': avif };
    if (!allowed[file.mimetype ?? file.type]) return ctx.badRequest('Only JPEG, PNG, WebP and AVIF images are accepted.');
  }
  await next();
};
