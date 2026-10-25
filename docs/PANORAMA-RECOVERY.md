# Original panorama recovery — 15 October 2026

Option 2 remains active: the original gallery labels/descriptions and existing working cabin panoramas. No active photographs, gallery code, layout, CSS, navigation, content or production settings were changed during this investigation.

**All four missing historical original JPEGs have been recovered and reverified.** They were already preserved during the earlier visual investigation; this follow-up independently checked their Git object IDs, SHA-256 hashes and valid JPEG metadata. Each copy is byte-for-byte identical to its original Git blob in commit `e925257` (25 March 2026, “added marzipano and demo”).

| Original label | Exact recovered file | Dimensions |
| --- | --- | --- |
| Bryan Goff Panorama | [bryan-goff-IuyhXAia8EA-unsplash.jpg](../.local-test/visual-review-20261015/recovered-historical-panorama-originals/bryan-goff-IuyhXAia8EA-unsplash.jpg) | 6000 × 3000 |
| Jessica Anderson Panorama | [jessica-anderson-yFPJdy_R8LA-unsplash.jpg](../.local-test/visual-review-20261015/recovered-historical-panorama-originals/jessica-anderson-yFPJdy_R8LA-unsplash.jpg) | 10800 × 13500 |
| One Zen Panorama | [one-zen-48kE4A9dMKc-unsplash.jpg](../.local-test/visual-review-20261015/recovered-historical-panorama-originals/one-zen-48kE4A9dMKc-unsplash.jpg) | 2160 × 3840 |
| Tomas Cocacola Panorama | [tomas-cocacola-1MCdcbJxViE-unsplash.jpg](../.local-test/visual-review-20261015/recovered-historical-panorama-originals/tomas-cocacola-1MCdcbJxViE-unsplash.jpg) | 12000 × 6000 |

Open the [private original-photo viewer](../.local-test/visual-review-20261015/recovered-historical-panorama-originals/index.html) to inspect one original at a time. These files are outside `public/`, Git-ignored and excluded from frontend Docker builds. The current local website has not been switched to them.

## Why the original paths were missing

Original Git HEAD `lib/panoramas.ts` references these four names. Commit `d6fcdd3` (13 April 2026) removed the Bryan Goff and One Zen filenames and changed the Jessica Anderson/Tomas Cocacola assets in changes Git displays as renames to `PHOTO_0011.jpg` and `PHOTO_0012.jpg`. These renamed files are not byte-identical to the old originals. The old gallery definitions still reference the missing names.

A hash search of all 182 active frontend public files found no exact copy of any of the four originals under another filename. The original project backup also lacks them in its plain public-assets snapshot, both by filename and by recorded content hash. The preserved Git history from that backup contains the older exact blobs, which are the successful recovery source. All currently working cabin and other original website files were retained unchanged.

Historical identity does not guarantee that every asset is a correctly projected 360° panorama. Jessica Anderson is a portrait forest/cabin photograph; One Zen is a portrait tiny-planet-style image. Their aspect ratios are not 2:1. The unchanged site viewer uses Marzipano `EquirectGeometry`, so compatibility needs a separate visual decision/test before replacing the working cabin panoramas. No originals were stretched, cropped or converted.

## Dynamic CMS content remains intact

A fresh read-only browser check matched the actual localhost Strapi API titles to the homepage and all three collection pages: 3 news, 2 past events, 2 offers. Featured requests explicitly use `status=published`, sort by publication time and render the returned CMS document. No hardcoded sample content arrays or static content JSON were substituted. The active gallery still shows the original four labels with the approved cabin filenames, and all four images load. No browser runtime errors occurred.

The earlier create/publish/unpublish tests remain documented in [the dynamic-content diagnosis](DYNAMIC-CONTENT-DIAGNOSIS.md); no additional test entries or database changes were made for this follow-up. The Cloud-only content gap and explicit-draft API-access deployment blocker remain as described there.

Verification files: `.local-test/visual-review-20261015/original-panorama-recovery-recheck.json`, `active-public-hash-search.json`, and `cms-and-gallery-recheck.json`. The original archived image manifest with full Git blob IDs and SHA-256 checksums remains at `docs/visual-comparison-20261015/restored-original-panorama-assets.json`.

Vercel, Strapi Cloud, the original project, working images, existing database and local source configuration were not modified. The local services remain running.
