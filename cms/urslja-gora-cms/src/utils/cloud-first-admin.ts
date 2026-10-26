// Provision only the first owner, before the HTTP server starts. Never deploy a
// public first-admin registration window or overwrite an existing administrator.
export async function ensureCloudOwner(strapi: any, credentials: Record<string, string | undefined>) {
  if (await strapi.db.query('admin::user').count()) return false;
  const email = credentials.CLOUD_BOOTSTRAP_ADMIN_EMAIL?.trim();
  const password = credentials.CLOUD_BOOTSTRAP_ADMIN_PASSWORD;
  if (!email || !/^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/.test(email) ||
      !password || password.length < 20 || password.length > 128) {
    throw new Error('New Cloud project requires private first-owner credentials before starting.');
  }
  const role = await strapi.db.query('admin::role').findOne({ where: { code: 'strapi-super-admin' } });
  if (!role) throw new Error('First administrator role is not ready.');
  await strapi.admin.services.user.create({
    email, password,
    firstname: credentials.CLOUD_BOOTSTRAP_ADMIN_FIRSTNAME || 'Website',
    lastname: credentials.CLOUD_BOOTSTRAP_ADMIN_LASTNAME || 'Owner',
    isActive: true, roles: [role.id],
  });
  return true;
}
