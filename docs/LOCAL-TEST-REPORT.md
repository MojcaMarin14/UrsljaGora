# Earlier local preparation and full-stack test report

Updated scope: the current frontend remains on Vercel. This report records the earlier optional full-stack tests; use BACKEND-DEPLOYMENT.md, VERCEL-STRAPI-CONNECTION.md and BACKEND-TEST-REPORT.md for the primary backend-only plan. No Vercel deployment was changed.

Prepared 11–13 October 2026. No hosting was purchased, no public deployment was made, no domain records or Strapi Cloud settings were changed, and no original database or media was overwritten. Original application files are unchanged. Hash checks covered all 1,447 backed-up files; the only recorded differences are refreshed Git index and Codex capture-reference metadata. The original Git working tree is clean.

## Backups and isolated work

All relevant iCloud-managed source, Git history, environment, database and media files were fully downloaded before archival. As approved, rebuildable node_modules, Next/Strapi build outputs and caches were excluded. The original project archive, consistent SQLite backup and uploads archive were verified using SHA256, SQLite integrity checking, archive contents and table counts. They are stored in the private `backups` folder alongside this prepared project.

The isolated preparation ran from `/private/tmp/urslja-gora-selfhost-20261011/project`. The durable prepared source is copied to `project` beside the backups, under `/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011`. Generated dependencies/caches are excluded from this final copy and can be rebuilt from its lockfiles. Private local evidence/credentials remain under `.local-test`; this folder is excluded from application images and source backups. Do not publish the preparation folder.

Before PostgreSQL import, a second consistent SQLite backup and full Strapi 5.57 export were saved and verified in the durable backups. All 23 image binary hashes matched the local source. The guarded importer also created and verified copies of the source archive and empty-target PostgreSQL dump before importing.

## Startup diagnosis and fixes

The original dependency folders contained tens of thousands of iCloud placeholders. Compiler/dependency file reads were observed waiting for downloads. The active Node 25 version was outside Strapi's supported engine range. The frontend still targeted the suspended Cloud backend; the CMS was configured for Cloudinary despite all eight local media records using local storage and no local Cloudinary credentials being configured.

With fully local files, Node 22 and a clean lockfile install, Strapi starts normally. The working copy now uses local uploads, local SQLite for standalone development, PostgreSQL in Docker, explicit API/CORS settings, disabled Cloud plugin/telemetry, and separate server-internal/public frontend CMS addresses. Cloudinary/Cloud packages remain installed but are not active providers.

Existing lockfiles were used for the initial installs. Then verified package/SQLite snapshots were taken before security updates: Next 16.1.6 → 16.3.8, Strapi 5.40.0 → 5.57.0 and Nodemailer 10.1.0. The resulting updated lockfiles are included. Compatible transitive overrides patch Axios, Handlebars, Sharp and Markdown-it; the Strapi email dependency uses Nodemailer 10.1.0. No forced Strapi 4 downgrade was applied.

Host tests used Node 22.22.2. The Linux arm64 Docker images use Node 22.23.3. `npm run develop` for Strapi 5.57 started in about 2.9 seconds. Production `npm start` was verified locally before the upgrade; the final Strapi CLI production start and health check passed in Docker. Both application Docker builds passed compilation and TypeScript checks. Next uses its webpack production build in Docker.

## Preserved local content

| Content | Published documents / media records |
| --- | ---: |
| Novice | 3 |
| Dogodki | 2 |
| Ponudbe | 2 |
| Article (retained, not used by frontend) | 1 |
| Media library | 8 |
| Uploaded original images plus size variants | 23 files |

Draft and published rows coexist in Strapi, so raw SQL row counts are larger than document counts. The original administrator remains in the original and backed-up SQLite database. Strapi export excludes administrator accounts and API tokens; a separate private test administrator was created in PostgreSQL. Any content that existed only in suspended Strapi Cloud could not be verified or recovered from these local files.

## Tests passed

- Upgraded SQLite CMS: published content APIs, every referenced image, browser login, original news list and all eight media previews.
- PostgreSQL migration: original published fields and document IDs match SQLite exactly; every original image binary SHA256 matches.
- PostgreSQL browser admin: content/media display, create, save and publish a clearly marked local-only news item.
- Frontend: 25 routes, original detail pages plus the test news item, server-side CMS access, HTTPS image optimization, map rendering, panorama rendering, theme switching and mobile view. No recorded browser runtime errors or failed website/CMS responses after fixes.
- Contact form: invalid input, CAPTCHA rejection, incorrect origin rejection, HTML escaping and SMTP STARTTLS configuration using mocks. No actual email was sent and no live CAPTCHA credentials were used.
- Public CMS API: visitors cannot approve their own messages/photos; unapproved submissions remain hidden; anonymous update/delete is forbidden; forged images, SVGs, oversized uploads and invalid coordinates are rejected; rate limiting and allowed-origin CORS work.
- Docker: PostgreSQL, Strapi and Next health checks pass. Caddy serves local HTTPS on `127.0.0.1:8443` only. Internal database/CMS/frontend ports have no host publication. Project environment files and the SQLite database are absent from runtime images.
- Encrypted restic backup: PostgreSQL dump validated, database/media/source/configuration snapshot created and repository check passed. Two snapshots were retained; no pruning was performed.
- Restore: repository snapshot restored with full file verification into a separate recovery folder and new `strapi_recovery_test_20261013` database. All 62 table contents match exactly; all 25 current media file hashes match. Restore refuses the live database and an existing target. The migration helper also refuses an already populated database.
- Original source/data preservation: final hashes and SQLite integrity pass; Git working tree is clean.

The test PostgreSQL database intentionally contains one extra published news item, one pending visitor message and one pending photo/media record. These remain in local Docker volumes and the encrypted test backups. The clean `strapi-5.57-content-baseline.tar.gz` contains only the original local content and should be used for initial deployment. Do not deploy the test database or temporary administrator credentials.

Frontend repairs include Promise-based route parameters, stable Strapi document addresses, v5 publication queries, correct CMS image configuration, a real image fallback/video poster, domain-based metadata/sitemap, weather-fetch timeouts/fallback and removal of Vercel-only analytics from rendering. The broken sample panorama filenames now use existing local panoramas; original gallery route addresses were retained.

## Security and remaining launch work

Final `npm audit --omit=dev` on 13 October 2026: frontend **0** findings; CMS **36** affected package entries (**0 critical, 32 high, 3 moderate, 1 low**). Many entries are the dependency chain of the same issue, rather than independent vulnerabilities. Direct advisory sources remain Braces, webpack-dev-middleware, React Router, stream-json and DOMPurify. Braces currently has no published patched version. The full private audit JSON is saved under `.local-test`.

Do not treat the CMS as security-cleared for public launch. A technical maintainer should update or assess/mitigate the remaining dependencies before exposure. Automated audit suggestions to downgrade Strapi 5 to Strapi 4 were deliberately rejected. Docker production mode avoids the development server, but dependencies remain installed and this is not a complete exploitability audit. The build/runtime behavior of breaking dependency replacements was not assumed safe.

Public-domain DNS, real ACME certificate issuance, off-server backup delivery, SMTP delivery and real Turnstile verification remain untested because no public deployment or account changes were authorized. Backups were tested locally with encryption; production must point the repository at separately controlled off-server storage. Backup scheduling files were prepared but no production timer was installed. Rebuild and test on the selected server architecture before launch.

The home page and several informational sections remain hardcoded, as in the existing frontend. News, events, offers, media and community/map collections remain editable through Strapi. See OWNER-GUIDE.md and NAVODILA-LASTNIK.md for simple owner instructions; DEPLOYMENT.md explains the technical handover and current Hetzner availability.

The encrypted test repository was copied to `backups/local-postgres-restic` outside iCloud. A read-only `restic check --read-data` of that durable copy verified all 69 packs. It retains the two verified snapshots, including test data. The local restic password is preserved privately in the prepared `deploy/.env`; never publish or lose it. Application containers were stopped after testing, with all volumes retained.
