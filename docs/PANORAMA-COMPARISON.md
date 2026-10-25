# Panorama comparison and homepage verification — 25 October 2026

Open the [private side-by-side comparison](../.local-test/panorama-comparison-20261025/index.html). Each original photograph appears beside its current cabin image, under the preserved original gallery label, with exact dimensions and suitability notes. Click a source photograph for the original JPEG; use “360° viewer previews” for recorded output from the unchanged viewer.

No active gallery files, source images, application code, database content, Vercel deployment or other production files were changed. Only new private comparison artifacts and this report were created. The eight image hashes and `lib/panoramas.ts` hash match their pre-comparison values.

| Original gallery label | Recovered original dimensions | Original suitability for the existing viewer | Current working image | Current dimensions |
| --- | --- | --- | --- | --- |
| Bryan Goff Panorama | 6000 × 3000 | Suitable 2:1 equirectangular image; rendered and dragging worked. | `PHOTO_0037.jpg` | 5760 × 2880 |
| Jessica Anderson Panorama | 10800 × 13500 | Unsuitable as-is: portrait forest/cabin photograph, not equirectangular. Also exceeds the test renderer’s texture limit; preview was blank. | `PHOTO_0004.jpg` | 5760 × 2880 |
| One Zen Panorama | 2160 × 3840 | Unsuitable as-is: portrait tiny-planet projection. It renders, but projection mapping is incorrect for this viewer. | `PHOTO_0030.jpg` | 5760 × 2880 |
| Tomas Cocacola Panorama | 12000 × 6000 | Correct 2:1 equirectangular projection, but not ready as-is on the tested renderer: size exceeds its texture limit and preview was blank. | `Hodnik_Low.jpg` | 5760 × 2880 |

All four current images have a 2:1 format, rendered correctly and responded to dragging. The recovered originals remain byte-identical to the previously verified Git copies. They were not resized, cropped or stretched; flat previews preserve the complete source photograph. A correct aspect ratio alone does not prove spherical projection, which is why the source image content and actual viewer behavior were also inspected.

The site uses `Marzipano.EquirectGeometry`. Its [official documentation](https://www.marzipano.net/reference/EquirectGeometry.html) specifies equirectangular images with a 2:1 aspect ratio. The automated Chrome/SwiftShader renderer reported `MAX_TEXTURE_SIZE=8192`. Jessica Anderson and Tomas Cocacola exceed that tested limit. Other browser/hardware combinations can have different limits; this is not a universal claim that the files cannot display anywhere. Rendering successfully also does not make the portrait/tiny-planet projection correct. No conversion or restored-image deployment was performed.

For the recorded original-image tests, only the isolated browser response to the existing panorama image request was fulfilled from the recovered JPEG. The actual website continued serving the approved cabin photographs to other browsers. This avoids any gallery or source/configuration change. Saved viewer screenshots and the visible-image/drag checks are in `viewer-verification.json` beside the comparison.

## Homepage design

[Open the fresh Vercel-versus-local homepage comparison](../.local-test/panorama-comparison-20261025/homepage/index.html).

The original reference was https://urslja-gora-3dh8kqzra-mojcamarin14s-projects.vercel.app. Fresh browser captures checked desktop 1440×1000 and mobile 390×844, each in dark/light themes. Navigation links, tested layout/typography/color/spacing properties, footer geometry, loaded fonts, mobile menu behavior and lack of horizontal overflow matched. The local homepage had zero browser runtime errors and zero failed requests in these checks.

Controlled first-viewport pixel matches:

- desktop-dark: 99.9969%
- mobile-dark: 99.9872%
- desktop-light: 99.9970%
- mobile-light: 99.9866%

These figures describe the first viewport at a fixed video frame, not complete-document pixel equality. The overall checked homepage design matches the original Vercel reference. Its original components and animation definitions remain; CMS-specific title/text/images and resulting document height intentionally differ. The reference still has failed CMS requests and a missing poster request, while local CMS content loads. The existing local missing-poster fallback remains as documented previously; no new asset or design substitutions were made. Timed guestbook tooltip behavior was preserved and allowed to settle before capture.

News, events and offers still come from local Strapi; no sample arrays or static content JSON were introduced. Existing integration/publishing proof is in [DYNAMIC-CONTENT-DIAGNOSIS.md](DYNAMIC-CONTENT-DIAGNOSIS.md). Cloud-only completeness and the previously recorded draft-API deployment blocker are unchanged by this visual review.

Detailed fresh results and screenshots are under `.local-test/panorama-comparison-20261025/`. The working gallery is kept exactly as requested, and the local services remain running.

Individual source-pair screenshots: [Bryan Goff](../.local-test/panorama-comparison-20261025/bryan-goff-source-pair.png), [Jessica Anderson](../.local-test/panorama-comparison-20261025/jessica-anderson-source-pair.png), [One Zen](../.local-test/panorama-comparison-20261025/one-zen-source-pair.png), [Tomas Cocacola](../.local-test/panorama-comparison-20261025/tomas-cocacola-source-pair.png). Browser checks verified all comparison controls, image files, desktop/mobile layout and homepage screenshot selections.
