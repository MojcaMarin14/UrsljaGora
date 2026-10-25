# Original-design recovery and visual verification — 15 October 2026

Reference: https://urslja-gora-3dh8kqzra-mojcamarin14s-projects.vercel.app
Local: https://site.localhost:8443/

The local visual regression was caused by **Tailwind not being processed in the Docker webpack build**. The original PostCSS configuration was located only at `app/postcss.config.mjs`. The migrated Dockerfile explicitly selected webpack, whose installed Next.js loader searches for PostCSS configuration from the project root. Global custom CSS loaded, while Tailwind utilities and its base reset did not. This produced a mixed styled/unstyled page, especially in the footer and gallery. The earlier content/route checks missed the CSS regression.

Evidence before repair: the footer had its original `grid`, `max-w-6xl`, padding and responsive column classes in the DOM, but computed `display:block`, no max-width, zero padding and no grid columns. The Vercel reference computed `display:grid`, max-width 1152px, padding 48px 24px and four 246px columns at 1440px. After the root PostCSS fix those computed values match exactly. Root/body reset and typography now match too. CSS rule count changed from 116 locally to 197 after processing; the reference has 196. Rule counts/minification can differ between bundlers; actual checked styles match.

The misplaced configuration was inherited from the original Git version; the migration's changed build path exposed it. Vercel serves Turbopack-style CSS chunk paths; its actual build logs and deployed Git commit were not accessed. The local cause is established by installed loader code, missing computed utility styles, and successful root-config correction. [Tailwind's Next.js setup](https://tailwindcss.com/docs/installation/framework-guides/nextjs) places the PostCSS config at the project root.

## Changes in this repair

1. Added a root `postcss.config.mjs` containing the same original Tailwind PostCSS plugin configuration; the original app-level file remains.
2. Restored Next's original image-quality default (`qualities: [75]`) instead of the expanded migration allowlist. The reference coerces requested qualities to 75; the repaired local image URLs do likewise. No component dimensions or source photographs were redesigned.
3. Restored the original Git HEAD gallery labels/descriptions in `lib/panoramas.ts` while retaining the four working cabin image paths, as explicitly selected by the owner. All existing cabin image files remain unchanged. Four historical stock JPEGs were also recovered and verified against Git blob IDs during diagnosis; they are retained privately outside the active public gallery and are not used by this build. This owner-approved gallery image choice is an intentional difference from the reference.
4. Added a durable, localhost-only frontend/proxy Compose configuration and local start helper. It reuses the same existing Strapi/PostgreSQL containers and certificate/upload/data volumes; no database import, reset or content edit occurred. The saved older frontend/proxy remain available stopped for rollback.

No edits were made to `app/globals.css`, Navbar, Footer, CookieConsent, GuestBook, SeasonsSection, ThemeToggle, WeatherClient, map components, page layout/style declarations or animation definitions. The original source tree and live Vercel/Strapi Cloud projects were not modified.

## Visual results and screenshots

Open [the interactive screenshot comparison](visual-comparison-20261015/index.html). It includes matching before/reference/fixed desktop and mobile views, both dark/light themes, full pages, footers and mobile menus. Video was paused at the same two-second frame for comparison. Browser contexts used the same dimensions, loaded fonts and consent/theme state; pages were scrolled so entrance animations and lazy images could load. No product CSS was injected to make the fixed images match.

- Four profiles: desktop 1440×1000 and mobile 390×844, each in dark and light themes.
- All checked computed style properties for navigation, hero, headings, footer, menu and hamburger matched the reference; navigation links and mobile menu state/links matched too.
- Static homepage viewport pixel matches: desktop dark 99.9967%, desktop light 99.9969%, mobile dark 99.9854%, mobile light 99.9857%. These percentages describe the controlled **first viewport**, not every page or the full document.
- Footer geometry/styles match; screenshot rasters have small offsets/font antialiasing differences because the restored CMS section changes document height and fractional clipping. Full-page pixel equality is not claimed.
- Original scroll/hover/menu animation source and Framer Motion version are unchanged. Normal scrolling revealed the entrance sections and mobile menu open/close was exercised before capture.
- Font checks passed in all profiles. No missing local CSS/font requests, local runtime errors, horizontal overflow or failed local frontend/media requests occurred in these controlled homepage profiles.
- Additional desktop/mobile route checks passed on 16 routes per device, including the map, all four owner-approved cabin panorama thumbnails and the original weather component (live weather available; fallback not used).
- All four cabin 360-viewer pages also loaded their original labels, WebGL canvas and source image on desktop and mobile with no runtime errors or failed local responses.
- Read-only CMS checks passed: 3 news, 2 past events, 2 offers, 1 retained Article API, all seven news/event/offer details, all 23 original upload hashes and optimized images. No forms were submitted or admin account/content changed.

Before screenshots replay the saved pre-fix image through browser routing on a separate loopback port to preserve matching viewport/origin. Replay-origin CMS request failures are diagnostic artifacts and are not used as evidence of a backend regression. The working fixed site was checked directly, independently of that replay.

## Reference differences that remain real

The reference itself fails three requests to its configured historical backend URL and requests a missing `hero-poster.jpg`; its original panorama paths also return missing images. This does not prove the owner used that hosting service. The local site uses recovered CMS content and working cabin panoramas selected by the owner, so CMS-filled sections and successful gallery thumbnails cannot be pixel-identical to broken reference sections. We preserved the visual components and original gallery text; working content remains visible. Hero video, fonts and ordinary static photos are preserved. The existing local poster/fallback-photo compatibility change remains documented below because the original poster/fallback files are absent from Git history.

## Every prior tracked frontend migration change

Compared with the preserved original Git HEAD `25ad495798067f4360568364deed3e62f4af71cd`. Global CSS and 40 frontend source/config files were unchanged before this repair. The pre-repair audit found 28 changed tracked frontend files:

| File | Change category |
| --- | --- |
| `app/aktualno/dogodki/[id]/page.tsx` | Local/backend API compatibility |
| `app/aktualno/dogodki/page.tsx` | Local/backend API compatibility |
| `app/aktualno/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/aktualno/novice/page.tsx` | Local/backend API compatibility |
| `app/aktualno/page.tsx` | Local/backend API compatibility |
| `app/aktualno/ponudbe/[id]/page.tsx` | Local/backend API compatibility |
| `app/aktualno/ponudbe/page.tsx` | Local/backend API compatibility |
| `app/api/kontakt/route.ts` | SMTP transport and timeout handling |
| `app/kontakt/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/mapa/data/photoStore.ts` | Local/backend API compatibility |
| `app/mapa/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/onas/cebelnjak/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/onas/cerkvica/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/onas/jedilnik/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/onas/knjiznjica/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/onas/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/page.tsx` | Existing hero video poster fallback |
| `app/prenocisca/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/robots.ts` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/sitemap.ts` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/vreme/layout.tsx` | Metadata/site URL; local-only Analytics removal in root layout |
| `app/vreme/page.tsx` | SSR weather timeout/fallback |
| `lib/api.ts` | Local/backend API compatibility |
| `lib/panoramas.ts` | Original labels/descriptions restored; working cabin image paths retained by owner choice |
| `next.config.ts` | Image/backend configuration |
| `package-lock.json` | Dependencies/lockfile |
| `package.json` | Dependencies/lockfile |

The pre-repair textual patch is in `visual-comparison-20261015/frontend-source-vs-git.patch`; the final repaired comparison is `frontend-final-vs-git.patch`. every changed lockfile package version (79 additions/changes/removals) is in `frontend-lockfile-version-diff.json`. Direct dependency changes were Next/eslint-config-next 16.1.6 → 16.3.8 and Nodemailer 8.x → 10.1.0; React, Framer Motion and Tailwind versions did not change. The direct package/lock changes were earlier security preparation, not new changes in this visual repair.

Earlier behavior changes also include stable Strapi documentId links, async route params, dynamic CMS details, internal/public API URLs and timeouts, map Strapi 5 query/type compatibility, metadata/sitemap/robots origins, SMTP timeout/transport handling, the weather request timeout/fallback and local-only Vercel Analytics removal. The homepage source differed only in its missing-poster fallback. No layout, palette, typography, spacing or animation source was deliberately replaced.

Added earlier frontend support files were Dockerfile, .dockerignore, .nvmrc, lib/site.ts, app/api/health/route.ts and generated next-env.d.ts. New deployment/backup documentation and local-test infrastructure are separate from product components. `.env` contents were not printed or included in the public comparison report. All 182 existing frontend public assets and 24 upload-folder files remain hash-matched between prepared and build copies; this repair adds no active public image files and deletes no existing data.

## Local operation and rollback

Run `.local-test/start-local-site.sh` from the durable prepared project to restart the existing local site. It refuses to initialize a missing database or create an unknown CMS container. The active frontend image is `urslja-gora-frontend-visual:20261015-owner-gallery`. The local-only frontend/proxy config is `.local-test/visual-frontend.compose.yaml`; it binds only 127.0.0.1:8443 and uses the existing backend network and certificate volumes.

A full duplicate rebuild hit local disk capacity. The final image was compiled from the verified build-stage dependencies with host-bound output, then packaged as small compiled-code/static layers over the first verified corrected image. The normal source Dockerfile still builds the same updated source from scratch when sufficient disk is available; there was no dependency downgrade, database change, cache pruning or removal of prior images/data. Keep disk capacity in mind before another complete duplicate build.

For rollback, stop the visual frontend/proxy project (do not use `down -v`), then start the saved `urslja-gora-backend-test-frontend-smoke-1` and `urslja-gora-backend-test-caddy-1` containers. Strapi/PostgreSQL stay the same. Rollback restores the older visual bug, so use it only for diagnosis. The separate hardened security-test backend remains separate; this task preserved the current content-integration backend.

The repaired services are left running. Future production deployment still requires the existing security/backup checklist and approval.

Final saved-configuration check: `.local-test/start-local-site.sh` completed successfully. The durable proxy reuses the existing local certificate (hash-verified); frontend HTTPS returned 200, Strapi health 204 and news API 200. The read-only CMS/media suite passed again after this proxy change. See `visual-comparison-20261015/final-local-service-verification.json` and `content-verification.json`. Only the temporary before-capture mirror is stopped afterward; the repaired site, CMS and database remain running.
