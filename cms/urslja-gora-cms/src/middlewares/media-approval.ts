import { createHmac, timingSafeEqual } from 'node:crypto';
import path from 'node:path';

// Short-lived bearer URLs let authenticated CMS editors preview pending images.
// They are generated only in authenticated admin responses, never public APIs.
export default (_config, { strapi }) => {
  const secret = strapi.config.get('admin.auth.secret');
  const signature = (url: string, until: string) => createHmac('sha256', secret)
    .update(`community-preview:${url}:${until}`).digest('hex');
  const sign = (url: string) => {
    const until = String(Math.floor(Date.now() / 1000) + 300);
    return `${url}?preview_until=${until}&preview_signature=${signature(url, until)}`;
  };
  const validPreview = (ctx, mediaPath: string) => {
    const until = ctx.query.preview_until;
    const value = ctx.query.preview_signature;
    if (typeof until !== 'string' || !/^\d+$/.test(until) ||
        typeof value !== 'string' || !/^[a-f0-9]{64}$/.test(value)) return false;
    const remaining = Number(until) - Math.floor(Date.now() / 1000);
    return remaining >= 0 && remaining <= 300 &&
      timingSafeEqual(Buffer.from(value, 'hex'), Buffer.from(signature(mediaPath, until), 'hex'));
  };
  const signAdminMedia = async (value) => {
    if (!value || typeof value !== 'object') return;
    if (typeof value.url === 'string' && value.url.startsWith('/uploads/') && value.id) {
      const file = await strapi.db.query('plugin::upload.file').findOne({ where: { id: value.id } });
      if (file?.provider_metadata?.communitySubmission) {
        value.url = sign(value.url);
        for (const format of Object.values(value.formats || {}) as any[]) {
          if (typeof format.url === 'string') format.url = sign(format.url);
        }
      }
    }
    for (const [key, child] of Object.entries(value)) {
      if (key !== 'formats') await signAdminMedia(child);
    }
  };
  return async (ctx, next) => {
    const route = ctx.path.replace(/\/+$/, '').toLowerCase();
    if (route === '/api/auth/local/register') return ctx.forbidden('Public registration is disabled.');
    let mediaPath: string;
    try { mediaPath = path.posix.normalize(decodeURIComponent(ctx.path)); }
    catch { return ctx.badRequest('Invalid URL encoding.'); }
    // koa-static decodes and normalizes paths. Apply the same canonicalization
    // before its handler, including encoded slashes and dot-segment aliases.
    if (mediaPath.startsWith('/uploads/')) {
      ctx.set('Cache-Control', 'private, no-store');
      const stem = path.basename(mediaPath, path.extname(mediaPath));
      const hash = stem.replace(/^(thumbnail|small|medium|large)_/, '');
      const files = await strapi.db.query('plugin::upload.file').findMany({ where: { hash: { $in: [stem, hash] } } });
      const file = files.find((f) => [f.url, ...Object.values(f.formats || {}).map((v: any) => v.url)].includes(mediaPath));
      if (!file) return ctx.notFound();
      if (file.provider_metadata?.communitySubmission && !validPreview(ctx, mediaPath)) {
        const approved = await strapi.db.query('api::mapa-fotografija.mapa-fotografija')
          .findOne({ where: { odobrena: true, slika: { id: file.id } }, select: ['id'] });
        const approvedPraise = approved ? null : await strapi.db.query('api::pohvala.pohvala')
          .findOne({ where: { odobrena: true, slika: { id: file.id } }, select: ['id'] });
        if (!approved && !approvedPraise) return ctx.notFound();
      }
      await next();
      // Override static middleware caching so unapproving takes effect at origin.
      ctx.set('Cache-Control', 'private, no-store');
      return;
    }
    await next();
    if (ctx.state.user && (ctx.path.startsWith('/upload/') || ctx.path.startsWith('/content-manager/'))) {
      await signAdminMedia(ctx.body);
      ctx.set('Cache-Control', 'private, no-store');
    }
  };
};
