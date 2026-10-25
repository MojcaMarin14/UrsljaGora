# Production readiness and launch gates — 15 October 2026

**Decision: local hardening and integration pass; public deployment is not yet approved or fully ready.** The original project/data, Vercel production and Strapi Cloud remain unchanged. No hosting/domain was purchased or publicly exposed. Use HETZNER-SI-STEP-BY-STEP.md for future actions; this checklist supersedes earlier functional-only readiness notes.

## Dopolnitev 25. oktobra 2026

Kontaktni obrazec ima preverjeno lokalno SMTP oddajo v trajni testni predal, popravljene kontaktne povezave ter pripravljeno zasebno predlogo in preverjalnik brez pošiljanja. [Priprava e-pošte](CONTACT-BEFORE-DEPLOYMENT.md) navaja potrebne nastavitve in postopek za Vercel. Prava SMTP prijava, dejanska Turnstile integracija na javni domeni in zunanja dostava niso preverjene; Nejcu se nič ne pošilja. Ta dopolnitev ni produkcijska odobritev.

Lokalno okolje od prvotnega pregleda vsebuje tudi nove lastničine vsebine/slike ter jasno označene preizkusne zapise. Pred prihodnjim izvozom naredite in preverite svežo kopijo, popišite prave dodatke ter pripravite pregledan izvoz brez preizkusnih zapisov za **novo prazno** ciljno bazo. Ne nadomestite novih pravih podatkov z marčevskim arhivom in ne objavite celotne testne baze brez pregleda. Spodnje številke in audit opisujejo prvotni pregled z dne 15. oktobra; niso nov popis današnje baze ali audit današnje končne slike. Preostale spodnje varnostne, backup in javne omrežne zahteve ostajajo odprte, dokler niso preverjene na končni produkcijski izdaji.

## Dopolnitev vremena 25. oktobra 2026

Lokalni vremenski popravek je funkcionalno preverjen: prava višina koče, trenutna napoved, veter/sunki, posebne vremenske oznake, datumi, odziven prikaz in varen cache. [Poročilo vremena](WEATHER-LOCAL-VERIFICATION.md) vsebuje dokazila. Pred javno komercialno uporabo ostaja odprta izbira dovoljenega vremenskega vira/licence; plačljiva storitev ni bila aktivirana. Morebitni strošek vremena ni vključen v okvirni infrastrukturni proračun. Lokalni Docker disk je skoraj poln; podatkov nismo brisali.

## Verified in isolated local stacks

- [x] Original SQLite/project/uploads/Git history backups preserved and verified; regenerated dependencies/caches excluded. Prepared changes live outside iCloud.
- [x] Existing content: 3 published news, 2 events, 2 offers, 1 generic Article, 8 media records and 23 original image files. Earlier Next/API integration passed; original image/API reads and browser CMS retested after hardening.
- [x] All original 32 high npm entries classified. Development-middleware and DOMPurify overrides tested; fresh audit is frontend 0, CMS 31 high/3 moderate/0 critical/0 low. See SECURITY-DEPENDENCY-REVIEW.md; this does not mean all 31 high entries are production vulnerabilities or all are development-only.
- [x] Public registration disabled in stored plugin settings on startup and blocked at the HTTP route, including case/trailing-slash variants. Admin accounts remain independent.
- [x] Guestbook/photo create ignores forged approval, hidden entries remain absent from public lists/details, and anonymous update/delete is rejected. Administrator approval displays records; revocation hides the photo at the CMS again.
- [x] New visitor upload originals and thumbnails are blocked until photo approval; signed five-minute admin previews work. Encoded/dot-segment path aliases tested and blocked after fixing a discovered bypass. No-store caching enforced at the origin.
- [x] Forged forwarding addresses and route aliases cannot bypass the tested per-IP submission limit. Upload replacement, arbitrary relation attachment, invalid MIME/magic bytes and oversized visitor images are guarded. Anonymous upload volume exhaustion/distributed spam remains an operational concern: monitor volume/traffic and review orphan uploads manually; no automated deletion is configured.
- [x] Normal CMS container uses the non-root Node account, no added Linux capabilities and no-new-privileges. Production starts the built app directly; development/generator CLI is not initialized in the web process.
- [x] Strapi's PostgreSQL account has no superuser/role-create/database-create privileges. Separate admin role used for initialization/recovery and not passed to Strapi.
- [x] PostgreSQL and uploads persist across container recreation; no public DB/CMS/Docker socket ports. Caddy-only HTTPS routing validated without network; its `/data` certificates volume persists.
- [x] Secrets generated separately, environment mode 600, no runtime secrets baked into the image. Production preflight refuses missing/reused/placeholders, local-only backup repositories and wildcard CORS. Exact Vercel origin accepted in tests.
- [x] Remote data-transfer service explicitly disabled; verified authenticated transfer endpoint unavailable. Trusted checksum-verified CLI imports remain usable offline.
- [x] S3 integration backup/recovery passed locally, matching all 62 tables/rows and all 25 current test media files. Full read checks, wrong-password refusal and no-overwrite restore guards passed. Test fixtures stay in test databases.
- [x] Empty-database importer and stdin-only first-owner-admin procedure tested, including refusal of existing data/accounts.

## Blocking security decisions

- [ ] **Unpatched dependency risk:** `braces` has no upstream patch. Its 31 inherited high entries remain installed. No vulnerable glob package was loaded in observed production flows, but that does not prove every future route safe. Obtain a tested upstream fix or an explicit maintainer/owner acceptance of the documented reduced-reachability risk before public launch. Do not force a Strapi 4 downgrade.
- [ ] **Residual admin/import advisories:** review/accept React Router 6 navigation risk and `stream-json` import risk. No unsupported major override was applied. Keep remote transfer disabled, use trusted offline archives, and keep admin access/accounts controlled.
- [ ] **Exact release/base-image scan:** scan the final native release image and its base OS packages on the chosen server/build platform; this work does not claim an OS vulnerability scan or penetration test. Resolve reachable high/critical findings or record bounded acceptance. Re-run npm audit at release time; advisories change.

## Required production acceptance before exposing the CMS

- [ ] Chosen .si hostname, owner account/billing, SSH-key access, restricted SSH firewall and provider recovery access confirmed. Purchase only when the owner chooses.
- [ ] New production volume/database explicitly confirmed empty; import source approved and verified backups taken. Use the clean baseline, never a test database containing fixtures.
- [ ] First owner administrator created **privately before public exposure** using the stdin helper; strong unique password saved. No default/test account deployed; routine editors use named limited accounts. Decide CMS SMTP/password-reset support.
- [ ] **Real off-server encrypted backup** account configured over HTTPS; password independently held; full read and new-database recovery on real storage pass. Configure failure/missed-backup alerts and a named responder; enable the timer only after the drill succeeds.
- [ ] Resolve Cloud content completeness: obtain a separate export/media inventory or explicitly accept the March local baseline. Unknown Cloud-only changes are not confirmed recovered. Historical pending photos, if later imported, require private-media reconciliation before exposure.
- [ ] Actual DNS A/AAAA, real public certificate and renewal persistence, private ports, request limits, resource/disk monitoring and restart behaviour checked on Hetzner. Local internal TLS does not verify public ACME.
- [ ] Recheck moderation at public URLs, original/thumbnail access, encoded aliases, no anonymous approval/edit/delete, exact CORS and registration rejection. Unapproving stops future origin access; a once-approved image may already be copied or cached by browsers/Next/CDNs and cannot be recalled universally.

## Separate Vercel connection acceptance

- [ ] Confirm Vercel's actual deployed Git branch/commit and obtain approval for the connection change.
- [ ] Change only its CMS public URL and exact Next image-host allowlist; retain current design, hosting, SMTP/Turnstile and analytics. Public environment changes require an approved rebuild of the same project.
- [ ] Use VERCEL-CONTENT-CHECKLIST.md to confirm all news, past events, offers, details, images, map/photo and guestbook paths. Generic Article still has no existing frontend page; this is a product limitation, not failed recovery.
- [ ] Record rollback to the previous Vercel release/settings and keep previous source, DB and uploads intact. No automatic data replacement or deletion.

## Owner handover

- [ ] Domain/Hetzner/backup ownership and recovery email documented; transfer resources through providers rather than sharing account passwords.
- [ ] Owner can log in, edit and publish a supported content type, preview a pending visitor photo and approve/reject a submission. NAVODILA-LASTNIK.md and OWNER-GUIDE.md supplied.
- [ ] Owner controls the independent recovery password/backup inventory and knows the technical maintainer, update schedule, renewal dates and restore-test schedule.

The optional all-Hetzner frontend stack remains a later draft. These backend privilege/security changes have been validated with `compose.backend.yaml`; do not assume the old full-stack Compose file has equivalent database-role initialization. A later full migration should reuse the hardened backend and its existing volumes, not start a competing stack.
