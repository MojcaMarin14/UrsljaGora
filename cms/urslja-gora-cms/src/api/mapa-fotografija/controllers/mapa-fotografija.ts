import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::mapa-fotografija.mapa-fotografija', () => ({
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
    const input = ctx.request.body?.data || {};
    const opis = typeof input.opis === 'string' ? input.opis.trim() : '';
    const avtor = typeof input.avtor === 'string' ? input.avtor.trim() : '';
    const kraj = typeof input.kraj === 'string' ? input.kraj.trim() : '';
    const ocena = input.ocena ?? null;
    if (!Number.isFinite(input.lat) || input.lat < -90 || input.lat > 90 ||
        !Number.isFinite(input.lng) || input.lng < -180 || input.lng > 180 ||
        opis.length > 120 || avtor.length > 40 || kraj.length > 80 ||
        !Number.isInteger(input.slika) || input.slika < 1 ||
        (ocena !== null && (!Number.isInteger(ocena) || ocena < 1 || ocena > 5))) {
      return ctx.badRequest('Check the image, coordinates and text lengths.');
    }
    ctx.request.body = { data: { slika: input.slika, lat: input.lat, lng: input.lng, opis, avtor, kraj, ocena, odobrena: false } };
    return super.create(ctx);
  },
}));
