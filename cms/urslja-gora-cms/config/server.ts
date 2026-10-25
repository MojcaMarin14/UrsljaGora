import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '127.0.0.1'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  proxy: { koa: env.bool('TRUST_PROXY', false) },
  logger: { updates: { enabled: false } },
  transfer: { remote: { enabled: false } },
  app: { keys: env.array('APP_KEYS') },
});
