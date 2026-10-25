# Backend-only preparation and tests — 15 October 2026

The current frontend remains https://urslja-gora.vercel.app. No Vercel deployment, environment, domain, Git integration or analytics setting was changed. No public backend was deployed. The original iCloud-managed project, SQLite database and uploads were not modified.

## Verified backend result

A separate Compose project, `urslja-gora-backend-test`, ran only PostgreSQL, Strapi 5.57 and Caddy. No frontend service is present in the backend Compose file. It reuses the already built/tested Node 22 CMS and backup image content under separate local image tags; the Strapi build-time CMS URL matches the local HTTPS test URL. Production needs a rebuild with the real CMS URL.

- A new PostgreSQL volume/database was verified empty before schema initialization. The guarded importer then copied/verified the clean baseline export and backed up/validated the empty target before import.
- Published news/events/offers, stable document identifiers and all 23 original image binary hashes match the SQLite working copy.
- Browser admin login, 3 original news entries, the 2 events/2 offers via API, referenced image URLs and 8 media previews passed. A separate private test admin was created; no original admin was overwritten.
- PostgreSQL, Strapi and Caddy are healthy. Only `127.0.0.1:8443` was published for the test. No Vercel or public-network frontend service was started.
- Exact-origin browser reads and JSON preflight/validation passed for `https://urslja-gora.vercel.app`; an unrelated origin was blocked. The frontend pages were intercepted and served by the local browser test, so the test did not change or submit data to Vercel. Browser local-network protection was disabled only for this simulation; it is not a production frontend setting.
- Production Caddy CMS-only configuration validated inside an isolated container with networking disabled. Public ACME issuance was not attempted.
- Backend environment generation, HTTPS-origin validation, secret-file permissions, overwrite refusal and shell syntax passed. Frontend SMTP/CAPTCHA secrets are not requested by backend mode.
- Both backend-only and optional full-stack Compose configurations validate.
- The backend wrapper created an encrypted restic snapshot, validated its PostgreSQL dump and checked the repository, then restored into the new `strapi_backend_recovery_test_20261015` database and separate recovery-files volume. All 62 tables match row for row and all 23 original media files match their hashes. Restic also verified all 447 restored files. No live or original data was overwritten.

The backend-only test contains the original content plus its own local test administrator; it has none of the previous full-stack test news/message/photo fixtures. Use the clean verified baseline archive for future deployment, never either test database. Existing full-stack test containers/volumes and backups were retained.

## Observed current frontend connection

A read-only browser inspection on 13 October returned HTTP 200 from the Vercel homepage and recorded API GET requests to `https://ursljagora-production.up.railway.app`. On 15 October all three checked public collection endpoints returned HTTP 404. The user recalls not using Railway. These can be stale URL references; they do not establish Railway usage, an active service or the presence/absence of private data. No Railway access is required for the verified local recovery, and no remote data or settings were modified.

The exact deployed Git branch/commit and Vercel environment values have not been inspected. A fallback URL in the local source is not treated as the current production setting. See VERCEL-STRAPI-CONNECTION.md for the minimum future changes and rollback considerations.

## Remaining work before public launch

The earlier CMS audit still contains unresolved upstream advisory entries; read LOCAL-TEST-REPORT.md and perform a current review before public exposure. The backend-only tests do not replace a security/exploitability audit. Current versions/settings of the deployed Vercel frontend were not changed or assumed equivalent to the local source.

No public DNS, real HTTPS certificate issuance, off-server backup delivery or Vercel Functions-to-backend connection was tested. These remain future integration checks after a CMS domain/server is selected and separately authorized. The existing frontend's SMTP, Turnstile and analytics stay on Vercel. The full-stack Hetzner option remains in DEPLOYMENT.md for a later decision.

Backend tests and generated credentials are private under `.local-test`; do not publish them. The prepared backend does not require a new Next.js deployment until a later approved CMS connection switch.

The backend-only encrypted repository is also preserved outside iCloud in `backups/backend-only-restic-test-20261015`. A read-only full data check of that durable copy passed all 66 packs. Its test recovery password remains private in `.local-test/backend.env`. The earlier original backups and full-stack encrypted backup were retained. All backend services were stopped after testing; their volumes remain available.
