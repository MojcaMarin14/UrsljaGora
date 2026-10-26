import type { Core } from '@strapi/strapi';

// Cloud replaces the global middleware configuration. Keep the full list here
// so registration, moderation and upload limits also run on managed hosting.
export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => {
  const origins = env.array('CORS_ORIGINS', ['https://urslja-gora.vercel.app']);
  for (const origin of origins) {
    const url = new URL(origin);
    if (url.protocol !== 'https:' || url.origin !== origin || origin.includes('*')) {
      throw new Error('CORS_ORIGINS must contain exact HTTPS origins.');
    }
  }
  if (!origins.length) throw new Error('At least one website origin is required.');
  return [
    'strapi::logger',
    'strapi::errors',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', '*.media.strapiapp.com', '*.strapiapp.com'],
            'media-src': ["'self'", 'data:', 'blob:', '*.media.strapiapp.com', '*.strapiapp.com'],
          },
        },
      },
    },
    {
      name: 'strapi::cors',
      config: { origin: origins, methods: ['GET', 'POST', 'HEAD', 'OPTIONS'], headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'] },
    },
    'strapi::poweredBy',
    'strapi::query',
    'global::cloud-media-safety',
    { name: 'strapi::body', config: { jsonLimit: '256kb', formidable: { maxFileSize: 50 * 1024 * 1024 } } },
    'global::community-limits',
    'strapi::session',
    'global::media-approval',
    'strapi::favicon',
    'strapi::public',
  ];
};
