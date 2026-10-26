import { factories } from '@strapi/strapi';
import sharp from 'sharp';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

export default factories.createCoreController('api::pohvala.pohvala', ({ strapi }) => ({
  async find(ctx) {
    ctx.query.filters = { $and: [ctx.query.filters || {}, { odobrena: { $eq: true } }] };
    return super.find(ctx);
  },
  async findOne(ctx) {
    const result = await super.findOne(ctx);
    if (!result?.data?.odobrena) return ctx.notFound();
    return result;
  },
  async create(ctx) {
    let input = ctx.request.body?.data || {};
    if (typeof input === 'string') {
      try { input = JSON.parse(input); }
      catch { return ctx.badRequest('Invalid submission.'); }
    }
    if (!input || typeof input !== 'object' || Array.isArray(input) || input.slika != null) {
      return ctx.badRequest('Attach a new image with the submission, not an existing media ID.');
    }
    const ime = typeof input.ime === 'string' ? input.ime.trim() : null;
    const sporocilo = typeof input.sporocilo === 'string' ? input.sporocilo.trim() : '';
    const ocena = input.ocena ?? null;
    if (!sporocilo || sporocilo.length > 500 || (ime && ime.length > 60) ||
        (ocena !== null && (!Number.isInteger(ocena) || ocena < 1 || ocena > 5))) {
      return ctx.badRequest('Check the message length and rating.');
    }
    // One multipart request binds this new photo to this pending review. Public
    // callers cannot attach somebody else's existing media by guessing its ID.
    const value = ctx.request.files?.files;
    const files = Array.isArray(value) ? value : value ? [value] : [];
    let slika: number | undefined;
    if (files.length) {
      let temporaryDirectory: string | undefined;
      try {
        const file = files[0];
        const source = file.filepath;
        let image;
        try { image = await sharp(source).metadata(); }
        catch { return ctx.badRequest('Fotografije ni mogoče prebrati. Izberite drugo sliko.'); }
        let uploadFile = file;
        if (image.orientation && image.orientation !== 1) {
          // Apply the phone's EXIF rotation/mirroring to the pixels BEFORE
          // Strapi generates thumbnails. Strip orientation to prevent a second
          // rotation by the browser. Leave already-upright originals untouched.
          temporaryDirectory = await mkdtemp(path.join(tmpdir(), 'urslja-upright-'));
          const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/avif': 'avif' }[file.mimetype];
          const normalizedPath = path.join(temporaryDirectory, `photo.${extension}`);
          const info = await sharp(source).rotate().toFile(normalizedPath);
          uploadFile = { ...file, filepath: normalizedPath, size: info.size };
        }
        const uploaded = await strapi.plugin('upload').service('upload').upload({ data: {}, files: [uploadFile] });
        slika = uploaded[0].id;
      } finally {
        // Only remove our own newly created processing directory, never the
        // visitor's source file or any existing CMS upload.
        if (temporaryDirectory) await rm(temporaryDirectory, { recursive: true, force: true });
      }
    }
    ctx.request.body = { data: { ime, sporocilo, ocena, odobrena: false, ...(slika ? { slika } : {}) } };
    return super.create(ctx);
  },
}));
