> Superseded for security/launch status by [PRODUCTION-READINESS-CHECKLIST.md](PRODUCTION-READINESS-CHECKLIST.md), 15 October 2026. New controls and dependency fixes have been locally tested; 31 inherited high and 3 moderate npm entries remain, off-server delivery is still unconfigured, and Cloud completeness is unknown. The functional evidence below is historical and remains useful.

# Deployment readiness — 15 October 2026

**Local backend restoration and frontend content retrieval pass. Public production launch is not yet cleared or performed.** The existing production Vercel deployment remains unchanged. No hosting was purchased, no DNS/environment changes were made, and this verification performed no database import or content editing.

## What works

- The verified original-project backup contains the SQLite database, environment/configuration files, source, Git history and frontend public assets. Uploads and SQLite also have separate verified backups. Rebuildable node_modules/build caches are excluded. The archive covers 1,447 files / 2,761,087,392 source bytes, including Git objects, both lockfiles and the local media. Existing dependencies/images were reused for this check; no node_modules backup or dependency reinstall was needed.
- Original SQLite, uploads and original frontend API helper hashes still match the initial backup. SQLite integrity is OK. Earlier full preservation checks and the archive verification cover the remaining source/assets/history. The original Git working tree is clean; earlier Git index/Codex bookkeeping changes are documented separately.
- Strapi 5.57 on Node 22 starts locally. The recovered PostgreSQL backend retains 3 published news items, 2 events, 2 offers, 1 generic Article and 8 media records with 23 binary originals/size variants. Its published content/document IDs and all 23 file hashes match the SQLite working copy.
- The unmodified original `lib/api.ts` was transpiled for a browser check and given only a local `NEXT_PUBLIC_STRAPI_URL` value. It successfully fetched all four content collections: 3 news, 2 events, 2 offers and 1 Article. Every referenced image request passed. No original source file was changed.
- The prepared local frontend, connected to the clean recovered backend over local HTTPS, rendered all 3 news cards and both past-event cards. All 7 news/event/offer detail pages returned HTTP 200 with the expected titles, and their Next.js image-optimization requests passed. There were no browser runtime errors or failed local website/CMS responses. The news cards use native images, which also displayed correctly.
- The exact Vercel-origin CORS/preflight simulation passed earlier. PostgreSQL/admin/media access, guarded public submissions and persistence also passed. The original frontend code and the prepared frontend are distinct; the exact production Vercel commit and environment have not been inspected or changed.
- Backend-only Docker Compose, PostgreSQL persistence, an uploads volume, Caddy HTTPS configuration, encrypted backup and guarded restore scripts are prepared. Backup recovery was verified across all 62 database tables and all 23 original media files. The durable encrypted backend-test repository passed a full read of all 66 packs. Production off-server delivery still needs verification.

## What remains unavailable, incomplete or unverified

1. **Production CMS-backed content remains unavailable.** No connection change has been made on Vercel. Once the new public backend is approved and healthy, change the CMS URL/image hostname and rebuild the existing Vercel project after separate approval. Keep frontend hosting, appearance, website domain, SMTP, Turnstile and analytics in Vercel.
2. **The separate generic Article is not a frontend page.** `/api/articles?populate=cover` returns the retained published Article. Existing website news pages use `/api/novicas` and display all three news posts. Rendering the generic Article collection would require an additional deliberate frontend feature, not a backend repair. No such feature was added.
3. **Older events are past events.** The recovered dates are 2025-12-31 and 2026-03-12; they display under Pretekli. An empty Prihajajoči filter is expected and is not failed retrieval.
4. **CMS dependencies need a launch review.** Fresh `npm audit --omit=dev` reports 36 affected CMS package entries: 0 critical, 32 high, 3 moderate and 1 low. The root advisory packages are Braces, webpack-dev-middleware, React Router, stream-json and DOMPurify; many reported entries are their dependency chains. The prepared frontend audit reports zero findings. No forced framework downgrade or breaking dependency replacement was applied. Production mode avoids the dev server, but exploitability has not been fully assessed and the remaining entries must not be silently dismissed.
5. **Unused public registration remains enabled in the baseline.** The current site does not need visitor accounts. Review/disable registration with approval before public exposure. There are no anonymous content update/delete actions. Visitor message/photo records are moderated; local upload URLs are public media URLs, not private-file storage.
6. **Public infrastructure has not been tested.** A confirmed CMS domain/VPS, actual DNS, a publicly trusted certificate, target-server architecture/build, off-server backup storage and Vercel Functions/browser reachability still require future setup and acceptance checks. Local HTTPS used a private CA. No original database should be overwritten, and any future import requires approval plus verified backups and a new empty target.
7. **Cloud-only newer data is unverified.** This restoration proves recovery of the content found in the local database/media. It does not prove recovery of content that existed only in the suspended Cloud project. No remote service was changed or relied on as a recovery source.

## Readiness decision

The application and recovery artifacts are ready for review and a controlled backend installation on a selected VPS. **I do not recommend an unattended public launch yet.** Complete the CMS dependency/registration review, select/configure the host and domain, verify real HTTPS and off-server restore, then separately approve the Vercel reconnection. Do not move the frontend off Vercel for this restoration.

The prepared frontend used for testing is only a local acceptance tool. The test overlay and local CA are private under `.local-test`; they are not part of the backend production deployment files. All local services were stopped after verification, preserving their containers and volumes.

## Short handover path

1. Read BACKEND-QUICKSTART.md for the minimal backend-only installation sequence.
2. Keep the verified clean baseline export and all original backups before any approved import.
3. Follow VERCEL-CONTENT-CHECKLIST.md to check content/API/media and exact future Vercel variables/Next image settings.
4. Obtain approval before buying/deploying infrastructure, importing to any new target, changing DNS or rebuilding production Vercel. The optional full-stack Hetzner plan remains available for a later separate decision.

Private test evidence: `.local-test/content-retrieval-verification-20261015.json`, screenshots `content-news-list.png` / `content-past-events.png`, the current audit JSON, backend migration/admin/CORS/backup/recovery reports and original-file manifests. Do not publish private test artifacts, environment files or backup passwords.
