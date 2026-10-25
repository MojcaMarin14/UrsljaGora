# About-page third image — 25 October 2026

Fixed the isolated local `app/onas/page.tsx` carousel URL from `/cerk.jpg` to `/cerk.JPG`, matching the preserved original file. The Linux Docker filesystem distinguishes filename case; the previous lowercase URL returned 404. No photo was replaced, renamed or edited; the original SHA-256 remains `27d8ac9226b125fe0df1dff6eed3ffc60a1c578782dfab43a5b06867115f5e6d`. This is the only application source change; all style/layout declarations are unchanged.

A verified pre-change archive of the page, local startup configuration and original photo is at `/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-about-image-fix-20261025-111805.tar.gz`. The existing verified builder dependencies were reused; production compilation and TypeScript passed. The corrected local image is `urslja-gora-frontend-dynamic:20261025-about-image`. The private local Compose/start helper reference that image; the prior image remains available. Existing backend/database/proxy configuration is preserved.

Desktop and mobile browser checks passed all three carousel photographs, dot buttons, previous/next arrows, optimized images and original church-photo byte verification with no failed local requests or runtime errors. The frontend, Strapi, news/events/offers APIs are healthy. The working panorama gallery hash is unchanged. No database content, original project, Vercel or Strapi Cloud was changed.

Evidence and screenshots: `.local-test/about-image-fix-20261025/`. Open https://site.localhost:8443/onas and refresh with Command–Shift–R to discard an older cached page.
