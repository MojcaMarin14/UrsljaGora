# Restore Strapi; keep the existing Vercel frontend

The frontend at https://urslja-gora.vercel.app loads, but its CMS content is unavailable while the backend is suspended. The frontend stays on Vercel. Local repair and recovery tests are complete; nothing has been deployed publicly or changed in Vercel. The original database and uploads remain intact.

Verified recovery: 3 published news items, 2 events, 2 offers, 1 retained Article, 8 media records and 23 image binaries. SQLite integrity, PostgreSQL migration, browser admin, API access, content permissions and exact-origin CORS passed. Encrypted backup recovery matched every row in 62 tables and every image hash. See BACKEND-TEST-REPORT.md for evidence and test limits. Cloud-only changes newer than these local files cannot be confirmed recovered.

## Security update — 15 October 2026

Public registration is now disabled/enforced, pending visitor binaries are private until approval, and the backend has a separate non-superuser database account. Dependency review reduced the CMS audit to 31 high inherited entries and 3 moderate entries; no public clearance is implied. Start with [PRODUCTION-READINESS-CHECKLIST.md](PRODUCTION-READINESS-CHECKLIST.md), then use the complete purchase/server/domain instructions in [HETZNER-SI-STEP-BY-STEP.md](HETZNER-SI-STEP-BY-STEP.md). Off-server storage still needs a real account and a successful remote recovery drill.

## Simplest future deployment — requires separate approval

Use one Hetzner Linux VPS running only PostgreSQL, Strapi and Caddy with Docker Compose. Next.js stays on Vercel. Docker/Compose >= 2.24.4 and Python 3 must be installed. The tested configuration uses persistent PostgreSQL and upload volumes and an encrypted restic backup job. Only Caddy exposes public ports.

1. Select the VPS and CMS hostname, for example `cms.YOUR-DOMAIN.si`. Copy the prepared project privately to `/opt/urslja-gora`, excluding dependencies/caches, `.local-test`, local environment files and the CMS `.tmp` folder. Keep existing backups separately. Do not copy temporary test credentials or deploy a test database. See BACKEND-DEPLOYMENT.md for server sizing, firewall and source-copy details.
2. Point only the CMS DNS record at the VPS. Keep website/apex/www records and the existing Vercel project unchanged. Allow TCP 80/443; keep PostgreSQL and port 1337 private.
3. From `/opt/urslja-gora`, create new backend secrets:

```sh
python3 deploy/scripts/init-env.py --backend \
  --cms-domain cms.YOUR-DOMAIN.si \
  --frontend-url https://urslja-gora.vercel.app
```

Privately configure the ACME email and off-server restic repository in `deploy/.env.backend`. Keep the recovery password outside the VPS. This file does not change Vercel. Review and accept or resolve the remaining dependency risks before public exposure; registration is already disabled. Run `python3 deploy/scripts/preflight-backend.py` before using production configuration.

4. Build the backend and initialize the new database:

```sh
deploy/scripts/backend.sh config --quiet
deploy/scripts/backend.sh build strapi backup
deploy/scripts/backend.sh up -d postgres
deploy/scripts/backend.sh run -T --no-deps --entrypoint node strapi -e "require('@strapi/strapi').createStrapi({distDir:'/app/dist'}).load().then(app=>app.destroy()).catch(e=>{console.error(e.message);process.exitCode=1})"
```

5. After approval for the import, copy the clean `strapi-5.57-content-baseline.tar.gz` privately to the server. Take its SHA256 from `strapi-5.57-before-postgres-verification.json` in the verified backups, then run:

```sh
deploy/scripts/backend.sh import /PRIVATE/PATH/strapi-5.57-content-baseline.tar.gz \
  --sha256 HASH-FROM-VERIFICATION
```

The helper verifies an archive copy and empty-target database backup first. It refuses a running CMS, existing content/media/admin users or an occupied upload volume. Never use it to overwrite a populated database. The original SQLite database is not replaced.

6. Before exposing it publicly, create the owner's first administrator privately (the helper refuses an existing administrator):

```sh
python3 deploy/scripts/admin-credentials.py | \
  deploy/scripts/backend.sh run -T --no-deps --entrypoint node strapi scripts/create-first-admin.cjs
```

Then, only after launch approval, start the backend:

```sh
deploy/scripts/backend.sh up -d --wait strapi caddy
```

Caddy handles HTTPS for the CMS hostname once public DNS and ports are correct. The owner signs into `/admin` with the privately created account; Strapi content exports do not include admin accounts. Verify the content, media and public APIs before touching Vercel.

7. Verify off-server backup and a separate recovery database:

```sh
deploy/scripts/backend.sh init-backup  # once, with the real private bucket configured
deploy/scripts/backend.sh backup
deploy/scripts/backend.sh check-backup
deploy/scripts/backend.sh restore-to-new-db latest strapi_recovery_YYYYMMDD
```

Use a unique new recovery name. This does not replace the running database or uploads. Install the supplied backend backup timer only after the first off-server backup/restore succeeds; monitor failures. Do not use the local test backup volume as the only production copy.

## Exact future Vercel changes

These names are confirmed in local source; the actual deployed commit and Vercel dashboard settings have not been inspected. Review that deployed version before editing. No changes below have been applied to production.

| Vercel variable | Future action |
| --- | --- |
| `NEXT_PUBLIC_STRAPI_URL` | Change to `https://cms.YOUR-DOMAIN.si`, without `/api`. This is the CMS connection variable used by the existing API helper. |
| `NEXT_PUBLIC_SITE_URL` | Keep the existing website origin, normally `https://urslja-gora.vercel.app`. If absent, set the confirmed website origin rather than inheriting the historical fallback in local source. Do not set it to the CMS URL. |
| `STRAPI_INTERNAL_URL` | Leave unset on Vercel. If the prepared helper is adopted and this override exists, it must use the public CMS HTTPS URL; Docker's `http://strapi:1337` and localhost will not work from Vercel. |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, optional `EMAIL_SECURE` | Retain existing values; unrelated to the CMS connection. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAME` | Retain existing values while the website origin stays unchanged. |

In the deployed frontend's `next.config.ts`, append the following object to its existing `images.remotePatterns`. Retain the rest of its configuration:

```ts
{
  protocol: 'https',
  hostname: 'cms.YOUR-DOMAIN.si',
  port: '',
  pathname: '/uploads/**',
}
```

Do not add Docker standalone settings, enable private-IP image access, remove Vercel Analytics or move contact/email settings as part of this connection change. The current public content reads do not require a Strapi admin/API token.

A future approved rebuild/redeploy of the same Vercel project is required: `NEXT_PUBLIC_` values are baked into browser bundles, and Vercel environment changes affect new deployments. [Next.js environment variables](https://nextjs.org/docs/app/guides/environment-variables), [Vercel environment changes](https://vercel.com/docs/environment-variables/managing-environment-variables). The CMS image allowlist is needed for Next image optimization. [Next.js image configuration](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns).

Backend settings are separate: `PUBLIC_URL` must be the public CMS HTTPS origin and `CORS_ORIGINS` must include the exact website origin. The prepared backend Compose file maps those from its own private environment. Do not use a wildcard for all Vercel projects.

After the backend is ready, use VERCEL-CONTENT-CHECKLIST.md before and after the separately approved Vercel connection change. Further compatibility notes are in VERCEL-STRAPI-CONNECTION.md. The full frontend/backend Hetzner stack remains an optional later plan; it is not used here.
