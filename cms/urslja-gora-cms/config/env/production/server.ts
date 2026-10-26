import type { Core } from '@strapi/strapi';

export default ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Server => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('PUBLIC_URL', ''),
  proxy: { koa: env.bool('TRUST_PROXY', true) },
  logger: { updates: { enabled: false } },
  // Enable only during a reviewed transfer into a confirmed empty project.
  // Disable again before connecting the public website.
  transfer: { remote: { enabled: env.bool('CLOUD_TRANSFER_ENABLED', false) } },
  app: { keys: env.array('APP_KEYS') },
});
