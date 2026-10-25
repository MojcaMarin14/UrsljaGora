# Local dynamic-content investigation — 15 October 2026

The website already read its news, events and offers from Strapi. Browser responses prove this. The active backend is the recovered local PostgreSQL database populated from the preserved local SQLite snapshot, **not the suspended Strapi Cloud database**. Repointing the frontend at this backend does not download Cloud-only records.

No Cloud login, account change, production Vercel modification, original-project edit, existing-content overwrite, database reset or public deployment took place. Three explicitly labelled local test entries were added through the browser admin and are now unpublished drafts; none was presented as recovered Cloud content.

## Exact data flow

| Frontend | Strapi API and fields | Rendering |
| --- | --- | --- |
| `/` and `/aktualno` | `/api/novicas`, `/api/dogodkis`, `/api/ponudbes`; `naslov`, `opis`, `slika` | Client requests. Featured cards now select the latest published item in each collection independently. |
| `/aktualno/novice` | `/api/novicas?populate=*&status=published&sort=datum:desc…`; title search and pagination | Client request; news title, excerpt, date and single `slika`. |
| `/aktualno/dogodki` | `/api/dogodkis?populate=*&status=published&sort=datum:asc/desc…`; date filter and pagination | Client request; title, description, location, date and first image from multiple `slika`. |
| `/aktualno/ponudbe` | `/api/ponudbes?populate=*&status=published&sort=veljavnost:desc…`; category filter and pagination | Client request; title, description, price, validity, category and first image. |
| News details | `/api/novicas?filters[slug][$eq]=…&populate=*&status=published` | Server-rendered dynamically. |
| Event/offer details | `/api/dogodkis` or `/api/ponudbes`, filtered by `documentId` (legacy numeric IDs supported) | Server-rendered dynamically. |

`lib/api.ts` resolves browser requests and media to the build-time `NEXT_PUBLIC_STRAPI_URL=https://cms.localhost:8443`. Server requests use runtime `STRAPI_INTERNAL_URL=http://strapi:1337`. Requests now default to `cache: "no-store"`. The active image is `urslja-gora-frontend-dynamic:20261015`; `.local-test/start-local-site.sh` and the localhost-only Compose file reference it. There is no Strapi API token embedded in these frontend requests.

These pages do **not** import static JSON, hardcoded content arrays or CMS seed files. Strapi's seed script is a separate manual utility; it is not a source for the frontend. Existing content IDs/text/fields match the original SQLite published records.

Hardcoded category names, navigation, promotional text, hero/background photographs and original missing-image illustrations remain part of the original design. Before this change, homepage/Aktualno also used fallback headings `Novosti s koče`, `Posebne ponudbe`, `Prihajajoči dogodki` plus static images when a CMS document was absent. Those placeholders could look like actual entries. They have been replaced by explicit loading/unavailable/empty status messages; no replacement content is generated. When a real CMS document has media, its actual `/uploads/…` URL is used. Existing decorative missing-image behavior for real entries without media is retained.

## Observed issue and local fixes

1. Original featured queries were unsorted and selected the first database result: the browser showed **Spomladansko čiščenje in priprava koče na sezono**, **Novoletna zabava** and **Domači planinski zajtrk**, each exactly present in its API response. This was real recovered CMS content, not hardcoded text. Featured queries now explicitly request `status=published&sort=publishedAt:desc&pagination[pageSize]=1`.
2. A single failed request in `Promise.all` prevented all three featured sections from updating; errors were unhandled, and generic cards or an endless skeleton could remain. New `lib/use-featured-content.ts` loads categories independently and handles errors. `CmsContentStatus.tsx` clearly labels loading, empty and unavailable states without posing as a CMS article.
3. List requests had no failure handling. All three now stop loading and show an explicit error; stale responses are ignored after effect cleanup. Published-only queries are explicit in list and detail pages.
4. Events store a date without time. The previous filter compared it with a full current timestamp, which could exclude an event happening today. The filter now uses the current calendar date in `Europe/Ljubljana`; the same-day event publication test passed.
5. The local dataset contains only the old local snapshot. Frontend fixes cannot recreate unknown Cloud-only records.

The normal populated card components, layout/color/style/animation declarations, global CSS, navigation and source images were preserved. Hash checks confirm the existing UI function definitions in all five affected pages are unchanged, all 182 frontend public files match the preserved assets, and all 23 served upload binaries match the original files. Computed navigation, hero, heading and footer styles still match the saved exact Vercel reference in desktop/mobile dark/light profiles. Featured images/titles can change because the query now selects the newest actual CMS document; no source images were replaced.

## Recovered content versus Cloud

| Local published collection | Recovered titles |
| --- | --- |
| Novice — 3 | Spomladansko čiščenje in priprava koče na sezono; Nova ponudba toplih napitkov v koči; Otvoritev nove razgledne točke na Uršlji gori |
| Dogodki — 2 | Novoletna zabava (2025-12-31); Otvoritev nove poti (2026-03-12) |
| Ponudbe — 2 | Domači planinski zajtrk; Koktelji in spomladanski prigrizki |
| Article — 1 | Otvoritev nove razgledne poti na Uršlji gori |

Both recovered events are past, so the initial “Prihajajoči” list is correctly empty; choose “Pretekli”. The original content/media updates are mainly 24–26 March 2026. SQLite contains separate draft/published rows for the same Strapi document; these are versions, not additional distinct articles. The field-by-field API/SQLite comparison and every original current-database content row were verified.

**Important collection distinction:** the generic **Article** type is separate from **Novice**. The original frontend never requested `/api/articles`. Creating something in Article will not create a news item on this design. Use **Novice** for news. The existing Article record has been preserved, and was not silently copied or converted.

**Exact Cloud gap is unknown.** The owner has no Cloud backup, and this task did not access the suspended Cloud account. We cannot prove that any specific title is missing, identify the number of missing records, or claim complete Cloud recovery. Potential gaps include newer/Cloud-only news, events, offers, drafts, media originals/variants and their relationships. A Cloud database/export and matching media archive, or a trustworthy Cloud-side inventory, are needed for comparison. If obtainable, preserve and checksum them, inspect in a separate new empty database, and compare document IDs/slugs/text/dates/media before any approved merge. Do not import them over the local baseline. No missing content has been invented.

## Create/publish proof through the local admin

A verified pre-test database dump was restored into a new empty verification database; all rows of **62 tables** matched, and **24 upload-folder files** (23 media binaries plus `.gitkeep`) were hash-verified. Source files were archived and verified before replacement. Backup details are in `.local-test/data-source-review-20261015/backup-verification.json`.

For each of **Novice, Dogodki and Ponudbe**, the test logged in through the browser admin, created a uniquely labelled `LOKALNI PREIZKUS … (ni Cloud vsebina)` draft, filled text/date, selected an existing image, saved and published. Separate anonymous browser/API checks proved:

- The new draft was absent from the normal public API and website before publishing.
- Publishing returned the exact title, text, date and selected media through the local API.
- The entry appeared on the homepage, Aktualno, its collection list and detail page without another frontend build.
- The same-day event appeared under upcoming events.
- Unpublishing through the admin removed it from those pages on reload.

All three test entries remain unpublished drafts, clearly labelled for testing. Existing documents were not edited or deleted, and existing media were not uploaded over or replaced. Published counts are again **3 news / 2 events / 2 offers / 1 generic Article**. Use the pre-existing clean baseline export for future deployment preparation; do not accidentally use this test database with its extra test drafts as the clean import source.

Ten additional browser-only empty/unavailable-response tests passed; the backend was never stopped or changed to simulate an outage. No uncaught frontend errors occurred. The final original-content check passed all seven detail pages and 23 media hashes; image optimization and the admin login page work. The ordinary frontend refresh/navigation loads current content; already-open pages do not have live push updates.

## Confirmed security blocker before public deployment

The **currently running local integration backend** allows anonymous explicit `?status=draft` queries. This was confirmed for all three newly created test entries: `status=published` returns zero after unpublishing, while `status=draft` returns the draft. Normal website requests explicitly use published status, but frontend filtering does not secure the API. The server must enforce published-only reads on the public content API (including list, detail and filter variants), while keeping authenticated admin editing intact, and this needs its own negative regression tests before public deployment. This task did not alter backend permissions/controllers or switch to the separate security-test stack. The services remain bound to localhost and were not deployed publicly.

## Evidence and operation

Detailed evidence is private and Git-ignored under `.local-test/data-source-review-20261015/`:

- `browser-source-trace-before.json`, `browser-source-trace-after.json`: actual API URLs/bodies and rendered text/images.
- `api-before.json`, `sqlite-original-content.json`, `preservation-verification.json`: source inventory and original-row/asset verification.
- `publish-verification.json`, `publish-fixtures.json`, `published-*-admin.png`, `published-*-website.png`: all three browser publishing tests and fixture identifiers.
- `failure-state-verification.json`, `design-verification.json`, `final-content-verification.json`, `draft-access-verification.json`: final behavior, design, media and draft-access results.
- `integration-source.patch`: the exact changes against the prepared frontend before this task.

Backup directory: /Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-dynamic-content-test-20261015_140056

The website remains at https://site.localhost:8443/ and admin at https://cms.localhost:8443/admin. The repaired frontend, Strapi, PostgreSQL and localhost HTTPS proxy remain running. No production environment variables were changed. See `UREJANJE-NOVIC-DOGODKOV-PONUDB.md` for simple owner instructions. This report supersedes the earlier visual report's active-image name; the restored styling and owner-approved panorama choice remain intact.
