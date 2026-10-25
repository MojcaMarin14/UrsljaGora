# What is and is not recovered from Strapi Cloud

The recovery is a verified copy of the **local SQLite database and local uploads**, not an export of the suspended Cloud database. No Cloud project was changed, reactivated or accessed during this security review. Searching the original source tree (excluding dependencies/caches) found the local SQLite file and no Strapi Cloud export/database dump archive.

| Recovered locally | Verified baseline |
| --- | --- |
| Published Novice/news | 3 documents |
| Published Dogodki/events | 2 documents |
| Published Ponudbe/offers | 2 documents |
| Generic Article | 1 document; retained API, no existing frontend page |
| Media | 8 records, all local provider, 23 original binaries/variants verified |
| CMS-managed map points, guestbook and visitor map photos | 0 in the clean recovered baseline; these community tables are absent from the original SQLite backup and initialized empty on recovery |
| Frontend static assets/source | Preserved separately from SQLite and excluded from generated dependency/cache folders |

The original content/media timestamps are mainly **24–26 March 2026**. The item-by-item local document IDs, titles and UTC update times are recorded privately in `.local-test/security-review-20261015/local-content-inventory.json`. Newer Cloud changes, Cloud-only drafts, deleted/extra records, uploaded originals/variants, visitor submissions, moderation state, plugin settings, administrators and API tokens cannot be compared from this local snapshot. A missing local collection does not prove Cloud ever contained entries.

**Confirmed missing compared with Cloud: unknown.** There is no trustworthy Cloud-side inventory available, so claiming full recovery or naming an exact number of lost Cloud items would be misleading. The broken public API does not reveal the suspended database's contents. A historical Railway hostname is not proof of another deployed database or a recoverable data source.

Before approving the initial production content, choose one:

1. Obtain a read-only Cloud export/backup and media archive through the owner's account or Strapi support. Keep it separate, verify its checksum and schema/version, inventory IDs/slugs/dates/media, and compare in another empty test database. Do not import over the recovered baseline or production database.
2. If no Cloud backup is obtainable, have the owner review the recovered titles, text and images against their records/screenshots and explicitly accept the March local baseline. Record which content will be recreated manually and keep the original recovery archives.

No local security-test guestbook/photo fixture belongs in production. The production import source remains the checksum-verified **clean** `strapi-5.57-content-baseline.tar.gz`, not an export or database from a test stack. If a future Cloud export has historical pending photo uploads, reconcile their private-media markers before any public exposure; the clean local baseline contains none.
