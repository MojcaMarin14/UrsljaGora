> Security update 15 October 2026: use PRODUCTION-READINESS-CHECKLIST.md and HETZNER-SI-STEP-BY-STEP.md as the current launch instructions. Registration is disabled, pending media is gated, and new backend databases use separate app/admin roles. Before the first backup, explicitly run `backend.sh init-backup`; create the first administrator privately with the supplied stdin helper before public exposure. Do not apply new-role initialization to existing volumes or replace their data. This file retains earlier architectural background.

# Primary plan: keep Vercel and self-host only Strapi

The current frontend at **https://urslja-gora.vercel.app** stays on Vercel. This handover prepares only Strapi 5, PostgreSQL 16, Caddy HTTPS, persistent media and encrypted backups for a future VPS. No public deployment, DNS change, Vercel environment change or Git push is authorized or performed.

Read VERCEL-STRAPI-CONNECTION.md for the later frontend connection changes. The previous DEPLOYMENT.md is the optional full-stack Hetzner plan; it is not the current deployment instruction.

## What is already recovered

The local SQLite content and media are protected by verified backups. The clean `strapi-5.57-content-baseline.tar.gz` contains 3 original published news items, 2 events, 2 offers, 1 retained Article and 8 media records / 23 image binaries. The original SQLite administrator remains backed up; a new administrator must be created after PostgreSQL migration because Strapi content export does not include admin accounts.

Use the clean baseline export, not either local test database. Content that existed only in unavailable remote services is not proven recovered. The user's recollection does not establish Railway use; stale Railway API URLs were observed in the published frontend, and the checked public endpoints returned 404. Railway access is not a prerequisite for using the verified local content.

## Files and resource sizing

- `deploy/compose.backend.yaml`: only PostgreSQL, Strapi and Caddy.
- `deploy/compose.backend.local.yaml`: local-only HTTPS on `127.0.0.1:8443`.
- `deploy/Caddyfile.backend`: only the CMS hostname, with no frontend/apex/www routing.
- `deploy/scripts/backend.sh`: selects the backend configuration for Compose and backup/import/restore operations.
- `deploy/scripts/init-env.py --backend`: creates new CMS/database/backup secrets in `.env.backend`; never overwrites a file.
- `deploy/systemd/urslja-gora-backend-backup.*`: optional future nightly backup timer.

A single Linux VPS with Docker Compose >= 2.24.4 and Python 3 is sufficient for this architecture. A 4 GB server is a reasonable starting budget for a small backend, but that memory limit has not been load-tested; 8 GB gives more build headroom. Local container tests used arm64 and a 6 GB VM. Check current Hetzner price/availability, target CPU architecture and disk headroom before ordering; no purchase has been made. Only Caddy publishes public ports. PostgreSQL and Strapi remain on Docker networks with no host ports.

## Future setup sequence — do not execute publicly without later approval

1. Review the remaining CMS dependency advisories in LOCAL-TEST-REPORT.md before exposing the CMS. The earlier audit still contains upstream issues; the preparation is not a security clearance.
2. Keep the Vercel project, production deployment and website DNS unchanged. Use a CMS subdomain such as `cms.YOUR-CONFIRMED-DOMAIN.si`. Only that subdomain will later point to the VPS. Keep the domain and hosting accounts under the owner's control.
3. Copy the prepared source privately to `/opt/urslja-gora`, excluding `.local-test`, existing `.env*` files, caches/dependencies and `cms/urslja-gora-cms/.tmp`. Preserve all existing backups elsewhere. The backend image does not build or run Next.js. Keep the source tree available for the backup job; its public-assets mount is retained for complete source/media recovery.
4. Generate fresh production configuration:

```sh
python3 deploy/scripts/init-env.py --backend \
  --cms-domain cms.YOUR-CONFIRMED-DOMAIN.si \
  --frontend-url https://urslja-gora.vercel.app
```

Privately edit `deploy/.env.backend` to set the ACME email and off-server restic storage credentials. Preserve the backup password in the owner's password manager. The file is created with mode 600. No frontend SMTP or Turnstile secrets are required by this backend-only configuration. Configure Strapi's own SMTP provider separately if admin password-reset emails are required.

The resulting public values are:

```dotenv
NEXT_PUBLIC_STRAPI_URL=https://cms.YOUR-CONFIRMED-DOMAIN.si
NEXT_PUBLIC_SITE_URL=https://urslja-gora.vercel.app
CORS_ORIGINS=https://urslja-gora.vercel.app
```

These variables in `.env.backend` are Compose inputs only; they do not modify Vercel. Add a confirmed custom website domain to `CORS_ORIGINS` if visitors use one. No broad wildcard is needed. Production must use a publicly trusted certificate; the local private CA is only for testing.

5. After the server and CMS DNS have separately been approved, validate/build/start the database:

```sh
deploy/scripts/backend.sh config --quiet
deploy/scripts/backend.sh build strapi backup
deploy/scripts/backend.sh up -d postgres
deploy/scripts/backend.sh run -T --no-deps --entrypoint node strapi -e "require('@strapi/strapi').createStrapi({distDir:'/app/dist'}).load().then(app=>app.destroy()).catch(e=>{console.error(e.message);process.exitCode=1})"
```

6. Verify the baseline archive's SHA256 against the protected `strapi-5.57-before-postgres-verification.json`. Import only into the new empty target:

```sh
deploy/scripts/backend.sh import /PRIVATE/PATH/strapi-5.57-content-baseline.tar.gz \
  --sha256 HASH-FROM-VERIFICATION
```

The guarded importer refuses a running CMS, existing content/media/admin users and a nonempty upload volume. Before import it verifies a copy of the archive and creates/validates an empty-target PostgreSQL dump. It does not overwrite the original SQLite database or the previous test database.

7. Start only the backend services:

```sh
deploy/scripts/backend.sh up -d --wait strapi caddy
```

Create the owner's new administrator account at the CMS `/admin` address. Verify all original content and images, exact-origin CORS and public permissions. No Vercel change is needed to test the CMS itself. Keep the old Vercel production deployment while planning the later API connection change.

8. Test encrypted off-server backup and recovery, then optionally install the supplied backend backup timer on the VPS. Use the backend timer rather than the older full-stack timer. Ensure the maintainer receives failure alerts and checks available disk/repository space. Public ACME, off-server delivery and the real Vercel integration remain future acceptance checks.

## Backup and recovery

```sh
deploy/scripts/backend.sh backup
deploy/scripts/backend.sh restore-to-new-db latest strapi_recovery_YYYYMMDD
```

These commands select the backend environment and services automatically. The backup briefly pauses Strapi writes, creates/validates a PostgreSQL dump, encrypts database/uploads/source/configuration with restic and restarts Strapi. Recovery first verifies a fresh backup, then restores into a new database and separate recovery-files volume. It refuses the live or any existing target and does not switch live database settings or replace live uploads. No pruning or data deletion is automatic.

The original full-stack backup/restore was tested by comparing every row in 62 tables and all current media hashes. Backend-only integration is checked separately in BACKEND-TEST-REPORT.md. Keep the recovery password outside the VPS. Do not use local Docker backup storage as the only production copy.

## Later option: move the frontend too

`Dockerfile`, `deploy/compose.yaml`, `deploy/compose.local.yaml` and the original full-stack Caddy configuration are retained as an optional later plan in DEPLOYMENT.md. They are not included by `backend.sh`. A future full migration would need its own approval, frontend build against the public CMS hostname, DNS cutover plan, unchanged persistent backend data and a verified backup/rollback plan. Do not run full-stack and backend-only stacks as competing services on the same public ports or accidentally create a different empty database volume during a switch.
