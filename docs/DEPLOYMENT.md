# Optional later plan: move both frontend and backend to Hetzner

The current frontend stays on Vercel. Start with BACKEND-DEPLOYMENT.md and VERCEL-STRAPI-CONNECTION.md. This older full-stack setup is retained only as a future option, requiring a separate decision; do not run it for the backend-only plan.

Local preparation only. No hosting was purchased, no domain records were changed, and nothing was deployed publicly. Read LOCAL-TEST-REPORT.md before deployment. The prepared application remains Next.js and Strapi 5, using local media storage.

## Suggested server

Use one Linux VPS, Docker Engine with Compose >= 2.24.4, Python 3 and Caddy. Start with 8 GB RAM and at least 40 GB disk to leave room for builds, images, media and backups. A 4 GB instance may run this small site, but its build memory headroom has not been tested. The container tests used Linux arm64 on a 6 GB local VM. For an amd64 server, rebuild from the lockfiles on that server and run the same acceptance checks; do not copy macOS node_modules or ARM-only images.

Hetzner CX33 (8 GB) is listed at €8.49/month excluding VAT and IPv4 in the [June 2026 price table](https://docs.hetzner.com/general/infrastructure-and-availability/price-adjustment/). CAX21 (ARM, 8 GB) is listed at €10.49. Both were marked unavailable on [Hetzner's page](https://www.hetzner.com/cloud/cost-optimized/) on 12 October 2026. Recheck stock and the checkout total before choosing. Domain renewal and off-server backup storage cost extra.

## Layout and secrets

- `Dockerfile`: Next.js standalone production image, Node 22.
- `cms/urslja-gora-cms/Dockerfile`: Strapi 5 image, Node 22, compiled admin plus sources required by its CLI.
- `deploy/compose.yaml`: PostgreSQL 16, Strapi, Next.js, Caddy. Only Caddy publishes ports.
- `deploy/compose.local.yaml`: local testing only, binds `127.0.0.1:8443` and uses a private local CA.
- `deploy/compose.ops.yaml`: encrypted restic backup and recovery tools.

Keep the live project in `/opt/urslja-gora`. Copy application source, assets, lockfiles and deployment scripts. Exclude `.local-test`, generated dependencies/caches, the temporary SQLite `.tmp` directory and every local `.env*` file. Preserve the originals and preparation backups separately. Never publish the preparation folder, environment files, database archives, test credentials or backup password in a repository.

Create a **new** production configuration. The helper refuses to overwrite an existing file:

```sh
python3 deploy/scripts/init-env.py --domain YOUR-CONFIRMED-DOMAIN.si
chmod 600 deploy/.env
```

Privately edit `deploy/.env`: confirmed domain, ACME email, SMTP details, Cloudflare Turnstile keys and an off-server restic repository. Store its password separately in the owner's password manager. Keep `ALLOW_PRIVATE_CMS_IMAGES=false` in production. The public website and CMS URLs are build arguments: rebuild both applications whenever these URLs change.

Do not reuse the local test configuration, TLS certificates, test accounts or test database. No real contact email was sent during preparation. Verify SMTP and Turnstile with the final domain before launch. Strapi's default sendmail provider was not configured for admin password-reset delivery; configure an SMTP provider if password resets are needed.

## Deployment sequence — future work, not performed

1. Resolve the CMS dependency advisories listed in LOCAL-TEST-REPORT.md or have a maintainer assess and mitigate the remaining exposure before public launch. No automated Strapi 4 downgrade should be applied.
2. Install Docker using the official OS instructions and Compose >= 2.24.4. Use SSH keys; allow SSH only from maintenance addresses. Allow TCP 80/443 and optionally UDP 443. Do not publish PostgreSQL, port 1337 or port 3000. Apply OS security updates regularly.
3. Upload the source privately to `/opt/urslja-gora`, generate the production configuration, and confirm off-server backup access.
4. Point the chosen `.si` domain, `www` and `cms` records at the server. Add AAAA only if IPv6 is configured and reachable. Caddy obtains public certificates once DNS and ports 80/443 are correct. Public ACME issuance was not tested locally.
5. Validate and build:

```sh
deploy/scripts/compose.sh config --quiet
deploy/scripts/compose.sh build frontend strapi backup
deploy/scripts/compose.sh up -d postgres
deploy/scripts/compose.sh run -T --no-deps --entrypoint node strapi -e "require('@strapi/strapi').createStrapi({distDir:'/app/dist'}).load().then(app=>app.destroy()).catch(e=>{console.error(e.message);process.exitCode=1})"
```

6. Use the protected `strapi-5.57-content-baseline.tar.gz` in the preparation backups. It contains the original published content and images, without local testing fixtures. Verify its SHA256 against `strapi-5.57-before-postgres-verification.json`. Run the guarded importer with that hash:

```sh
python3 deploy/scripts/import-into-empty-db.py /PRIVATE/PATH/content-baseline.tar.gz --sha256 HASH-FROM-VERIFICATION
```

The importer refuses a running CMS and any existing content, media records or administrator. It copies and verifies the source archive, creates and validates an empty-target PostgreSQL dump, then imports content and synchronizes binaries without overwriting uploaded files. It uses a root one-off container only for the migration and fixes upload ownership afterward. The application itself runs as the unprivileged Node user. This is an initial import tool, not an update/restore tool for a live database.

7. Start the CMS and website:

```sh
deploy/scripts/compose.sh up -d --wait strapi frontend caddy
```

Create the owner's new administrator account at `https://cms.YOUR-DOMAIN.si/admin`. Strapi content export excludes administrator accounts/API tokens; the original SQLite admin remains in its backed-up database. The importer must run **before** creating this account. Public permissions are included in the baseline export. `cms/urslja-gora-cms/scripts/configure-public-access.cjs` can reapply the application's intended public access if needed; inspect role permissions after migration.

8. Confirm 3 original published news documents, 2 events, 2 offers, 1 retained Article, 8 Media library records and 23 image binaries. Check frontend details/images, CORS, browser editing, visitor moderation, SMTP and CAPTCHA.
9. Create and verify the first off-server backup, perform recovery into a new database, then install the supplied systemd timer. It schedules backups around 02:30 Europe/Ljubljana; it is not installed by this preparation.

## Backups and recovery

```sh
deploy/scripts/backup.sh
```

The script briefly stops CMS writes, creates a custom-format PostgreSQL dump, validates it, backs up uploads, public assets, source and private deployment configuration using encrypted restic, checks the repository, and restarts the CMS. During this brief pause, CMS-backed pages/submissions may fail; choose a quiet time. Snapshots are retained; no pruning is automatic. Monitor successful jobs, repository capacity, VPS disk space and service health. Arrange an alert on backup failure. The nightly job writes to the configured repository; a local Docker backup volume is suitable only for testing, not disaster recovery.

Recovery always starts by creating and verifying another backup, then restores into a **new** database and a separate recovery-files volume:

```sh
deploy/scripts/restore-to-new-db.sh latest strapi_recovery_YYYYMMDD
```

The helper refuses the live database and any existing target. It verifies repository data, restored files and the dump hash before running `createdb` and `pg_restore`. Recovered uploads, source, public files and configuration are printed under `/restore/TIMESTAMP` in the backup-restores volume. Review them privately. It does not switch the live database or replace live uploads; make a separate, backed-up recovery plan and check the recovered application before a controlled switch.

For complete VPS loss, restore the encrypted repository to a recovery server, recover source/configuration, rebuild the images, import the PostgreSQL dump into a new database and restore uploads to a new volume. Preserve the restic password outside the VPS. Database backup staging uses a 256 MB tmpfs; increase it before the dump grows beyond that size.

## Updates and rollback

Make a verified backup first. Keep a copy of source and lockfiles for each release, build on the target architecture, run the local acceptance checks, then replace application containers. PostgreSQL/Strapi schema migrations can change data: rolling back an image alone may not roll back its schema. Restore the prior database and matching media into separate targets, test them, and switch deliberately. Do not run `compose down -v`, database resets or bulk deletes as routine maintenance.
