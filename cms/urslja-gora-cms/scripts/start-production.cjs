'use strict';
// Use the built application directly. Do not initialize development/generator
// CLI commands in the production web process.
const path = require('node:path');
const { createStrapi } = require('@strapi/strapi');
createStrapi({ appDir: process.cwd(), distDir: path.resolve('dist') }).start()
  .catch(() => { console.error('CMS startup failed; inspect the private server logs.'); process.exitCode = 1; });
