import type { Core } from '@strapi/strapi';
import { ensureCloudOwner } from './utils/cloud-first-admin';

export default {
  register() {},
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    if (strapi.config.get('custom.requireFirstCloudAdmin', false)) {
      await ensureCloudOwner(strapi, process.env);
    }
    // This site uses CMS administrators, not public user accounts. Retain all
    // other plugin settings and enforce this after every import/restart.
    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const advanced = (await store.get({ key: 'advanced' })) as Record<string, unknown> | null;
    if (advanced?.allow_register !== false) {
      await store.set({ key: 'advanced', value: { ...advanced, allow_register: false } });
    }
    // Mark public uploads in the same database insert that creates the media
    // record. Unknown files are denied by media-approval, including the interval
    // between writing a binary and creating its database record.
    strapi.db.lifecycles.subscribe({
      models: ['plugin::upload.file'],
      beforeCreate(event) {
        const ctx = strapi.requestContext.get();
        if (ctx?.method === 'POST' && ['/api/upload', '/api/pohvalas'].includes(ctx.path.replace(/\/+$/, '').toLowerCase())) {
          event.params.data.provider_metadata = {
            ...event.params.data.provider_metadata, communitySubmission: true,
          };
        }
      },
    });
  },
};
