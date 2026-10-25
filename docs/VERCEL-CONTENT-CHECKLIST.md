Security preparation is documented in PRODUCTION-READINESS-CHECKLIST.md. Do not connect production Vercel before its launch gates are signed off; the connection checks below remain the future acceptance procedure.

# Checklist: make existing Vercel pages display recovered Strapi content

Production Vercel remains unchanged during preparation. Perform public deployment, database import and the Vercel switch only with separate approval. This checklist distinguishes the tested local recovery from the future real-domain integration.

## Already verified locally

- [x] SQLite integrity is OK; original source, database and uploads are preserved in verified backups.
- [x] Strapi 5 starts using Node 22 with local dependencies and a local upload provider.
- [x] New empty PostgreSQL test target backed up before import; source export copied and hash-verified.
- [x] Original content fields and document IDs match: 3 news, 2 events, 2 offers; the Article is retained.
- [x] All 8 original media records display in admin; all 23 binaries/variants match their hashes.
- [x] Anonymous content reads work. Approved-only visitor messages/photos, guarded submissions, upload validation and rejection of anonymous updates/deletes were tested.
- [x] Browser CORS/preflight works for the exact Vercel origin in a local simulation; an unrelated origin is blocked.
- [x] Persistent database/uploads, backend-only HTTPS configuration and backup/recovery tested; 62 recovered tables match row for row and all 23 original media hashes match.

The checked public role has no content update/delete actions. It also retains legacy read access to Articles/categories and standard Users & Permissions auth routes. Registration is enabled in the local baseline, although the current website does not require visitor accounts; review/disable unused registration before public launch with approval. No database settings were changed for this review. Admin accounts/permissions are separate from the anonymous Public role.

## Before changing Vercel

- [ ] Confirm the actual deployed Git branch/commit; retain its current deployment and record environment values privately for rollback.
- [ ] Complete backend security/dependency review, unused-registration review, server/domain selection and approved deployment.
- [ ] Verify the clean baseline backup and import only into a new empty target after approval. Keep all previous databases/backups.
- [ ] Confirm trusted public HTTPS, with no certificate warnings, at `https://cms.YOUR-DOMAIN.si/admin`.
- [ ] Sign in as the owner and inspect every recovered document and all eight original media records. Draft changes must be published to appear through public content APIs.
- [ ] Request `/_health` on the CMS: expect HTTP 204. Request the following without an admin token: expect HTTP 200 and the original published counts, unless the owner has deliberately added/changed content:

| CMS request | Expected baseline |
| --- | --- |
| `/api/novicas?populate=*` | 3 news items, with image relations |
| `/api/dogodkis?populate=*` | 2 events, with image relations |
| `/api/ponudbes?populate=*` | 2 offers, with image relations |
| `/api/pohvalas?filters[odobrena][$eq]=true` | Only approved messages; original baseline can be empty |
| `/api/mapa-fotografijas?populate=slika` | Only approved map photos; original baseline can be empty |
| `/api/tocka-na-mapis?populate=fotografija&status=published` | Published CMS-added points; original baseline can be empty |

- [ ] Open each returned `/uploads/...` image URL directly: expect HTTP 200, no authentication and correct image data. Both browsers and Vercel's optimizer must reach these URLs.
- [ ] Confirm read permissions (`find`/`findOne`) for the collections above, `create` only for intended moderated messages/photos, and upload access only with the prepared validation/rate limits. Keep anonymous content update/delete disabled.
- [ ] Confirm `CORS_ORIGINS=https://urslja-gora.vercel.app` plus only actual additional website origins. Check an OPTIONS request with this Origin and the GET/POST Content-Type headers; unrelated origins must not receive usable browser access.
- [ ] Run the first encrypted off-server backup and restore test. Retain backup credentials outside the VPS. Install/monitor the backend backup timer.

An empty result can be correct for visitor submissions or CMS-added map points: these collections had no original content. The retained Article collection is not rendered by the current frontend; keeping it in Strapi does not automatically create a website page.

## After approval for the Vercel connection change

- [ ] Apply only the reviewed API URL/image-domain/necessary Strapi 5 compatibility changes to the actual deployed source. Keep the design, hosting, domains, analytics, email and CAPTCHA configuration.
- [ ] Set `NEXT_PUBLIC_STRAPI_URL` to the new public CMS origin in the intended Vercel deployment environment. Keep `NEXT_PUBLIC_SITE_URL` as the website address. Keep any Docker-only `STRAPI_INTERNAL_URL` out of Vercel.
- [ ] Rebuild/redeploy the same Vercel project after approval. Changing a public variable without a new build does not update the browser bundle.
- [ ] In a fresh browser session, inspect Network: content calls must use the new CMS hostname, not an unavailable old endpoint or localhost. Expect no 401/403/404/5xx, CORS or mixed-content errors.
- [ ] Check `/` and `/aktualno` content previews, all 3 news cards/details, both event details and both offers under the **Vse** filter. Check search and pagination without hiding known records.
- [ ] On events, select **Pretekli**. The two recovered dates are `2025-12-31` and `2026-03-12`; they are past events at the time of this recovery. An empty **Prihajajoči** tab alone does not mean the backend failed.
- [ ] Check every CMS image on desktop/mobile, including `/_next/image` requests: no missing thumbnails or 400 allowlist errors. Retain existing image settings and add the exact CMS hostname.
- [ ] Open news/event/offer detail URLs directly in a new tab and refresh. This checks server-side fetching as well as browser lists. Inspect Vercel Function logs if only detail pages fail.
- [ ] Check the map and guestbook. Existing built-in walking routes/points come from code; only the CMS-managed additions and approved submissions come from Strapi. Review `status=published` and stable `documentId` handling against the deployed source if needed.
- [ ] With explicit permission for production test content, save/publish an owner test entry, confirm it appears on Vercel, and submit a visitor message/photo to confirm moderation. Keep pending content hidden. Do not perform these writes without approval or delete existing records as part of testing.
- [ ] Leave the previous Vercel deployment and all backups available for rollback. An old deployment referencing a suspended backend will not restore that backend's availability by itself.

Public DNS/TLS, the actual Vercel environment and server-to-backend networking remain future checks. The deployed Vercel commit has not been verified, so the local source is not assumed to match it exactly. Newer content that existed only in the suspended Cloud database remains unverified.
