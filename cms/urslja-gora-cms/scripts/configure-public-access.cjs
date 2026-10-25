'use strict';
const path = require('node:path');
const { createStrapi } = require('@strapi/strapi');

async function main() {
  const app = await createStrapi({ distDir: path.resolve(__dirname, '../dist') }).load();
  try {
    const role = await app.db.query('plugin::users-permissions.role').findOne({ where: { type: 'public' } });
    if (!role) throw new Error('Public role is not initialized');
    const actions = [];
    for (const type of ['novica', 'dogodki', 'ponudbe', 'tocka-na-mapi', 'pohvala', 'mapa-fotografija']) {
      for (const action of ['find', 'findOne']) actions.push(`api::${type}.${type}.${action}`);
    }
    actions.push('api::pohvala.pohvala.create', 'api::mapa-fotografija.mapa-fotografija.create', 'plugin::upload.content-api.upload');
    for (const action of actions) {
      const existing = await app.db.query('plugin::users-permissions.permission').findOne({ where: { action, role: role.id } });
      if (!existing) await app.db.query('plugin::users-permissions.permission').create({ data: { action, role: role.id } });
    }
    console.log('Public reads and guarded community submissions configured. No update/delete permissions added.');
  } finally { await app.destroy(); }
}
main().catch(() => { console.error('Public access configuration failed; inspect the private CMS logs.'); process.exitCode = 1; });
