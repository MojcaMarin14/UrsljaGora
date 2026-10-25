import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Middlewares => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: env.array('CORS_ORIGINS', ['http://127.0.0.1:3000', 'http://localhost:3000']),
      methods: ['GET', 'POST', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
    },
  },
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '256kb',
      formidable: { maxFileSize: 50 * 1024 * 1024 },
    },
  },
  'global::community-limits',
  'strapi::session',
  'global::media-approval',
  'strapi::favicon',
  'strapi::public',
];
