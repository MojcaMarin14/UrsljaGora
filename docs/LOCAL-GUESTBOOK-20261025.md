# Local guestbook — 25 October 2026

**Later update:** Optional moderated photo attachments are now active. See [Fotografije ob pohvali](LOCAL-GUESTBOOK-PHOTOS-20261025.md) for the current images, backend schema, privacy checks and owner instructions. The text below records the earlier text-only fix.

“Dodaj pohvalo” previously opened the empty list, requiring another click on “+ Napiši”. The bubble and floating book button now open the existing form directly. Existing classes and global CSS are unchanged. The bubble is a keyboard-accessible button, rating stars have accessible labels, the modal has dialog semantics, and the native form handles submission. Consent and a nonempty message are required; submissions are disabled while sending. Success confirmation remains visible until the visitor closes it or changes tabs. The list refreshes on opening/selecting its tab, and request failures are displayed explicitly rather than as a false empty list.

No backend controller, schema or permission changes were needed. The running local controller forces `odobrena=false` and blocks anonymous reads of pending entries. Both normal and forged approval submissions were tested. Anonymous update attempts were denied.

Desktop and mobile browser submissions succeeded. Each test entry was stored pending, had the exact text/rating, returned a persistent confirmation, and stayed absent from public lists, detail reads and a forged pending filter. One existing test entry was then approved through the admin browser using `odobrena → TRUE → Save`; it appeared in the anonymous website. Revoking approval in admin and reselecting the list hid it again without a page reload. Both new test entries were returned to pending and retained, clearly labelled “LOKALNI PREIZKUS …”; no original entries were edited or deleted. Browser-only simulated read/submit failures also passed, preserving typed messages and avoiding false success or false empty-state messages.

Before submissions, a fresh database/uploads/source backup was verified by full restore into a new empty test database: `/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-guestbook-test-20261025_120539`. All rows of 62 tables matched on restore. The final check preserved every original content row and all 29 pre-test upload-folder files, including the owner’s recent uploads. No existing database was reset or overwritten. The hero video/poster fix, About image fix, panorama gallery and CMS helper hashes are preserved.

Active local image: `urslja-gora-frontend-dynamic:20261025-guestbook`. Only the guestbook component and private local startup image references changed. Compilation/TypeScript and local frontend/Strapi/content endpoint health checks passed. Vercel, Cloud and the original project are unchanged. Evidence: `.local-test/guestbook-fix-20261025/`.

## Navodila za uporabo

1. Osvežite https://site.localhost:8443/ s Command–Shift–R. Kliknite zlati gumb ali »Dodaj pohvalo«.
2. Vpišite sporočilo, po želji ime in oceno, označite soglasje ter kliknite »Pošlji«.
3. Nova pohvala počaka na pregled. V https://cms.localhost:8443/admin odprite **Content Manager → Pohvale in pripombe**, izberite zapis, nastavite **odobrena → TRUE** in kliknite **Save**.
4. Na strani izberite zavihek **Pohvale**, da se seznam osveži. Za umik odobritve nastavite **FALSE → Save**.

Preizkusna zapisa sta jasno označena in ostajata neodobrena; nista pristni pohvali. Pred prihodnjo produkcijsko pripravo ju izločite po izrecni odobritvi, pri čemer ohranite vse prave nove vsebine in slike lastnika.
