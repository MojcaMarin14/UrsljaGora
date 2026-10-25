# Keep the current Vercel frontend; connect a self-hosted Strapi backend later

The current frontend at **https://urslja-gora.vercel.app** loads correctly. Its CMS-backed content is unavailable while the backend is suspended. It remains on Vercel. See BACKEND-QUICKSTART.md and VERCEL-CONTENT-CHECKLIST.md for the concise restoration steps and acceptance checks. Nothing in this preparation changes its deployment, domains, environment variables, Git integration or analytics. Its deployed branch/commit has not been confirmed. Local source observations should be checked against that deployed commit before any frontend changes.

The primary plan is: browser → existing Vercel Next.js website; browser and Vercel server functions → public HTTPS CMS; Caddy → Strapi 5 → private PostgreSQL, with persistent uploads and encrypted off-server backups. The optional complete Hetzner stack is retained for a separate future decision.

## Minimum connection changes — future changes, not applied to Vercel

| Where | Setting/change | Value or purpose |
| --- | --- | --- |
| Vercel frontend | `NEXT_PUBLIC_STRAPI_URL` | `https://cms.YOUR-CONFIRMED-DOMAIN.si`, with no `/api` suffix |
| Frontend source | `images.remotePatterns` | Allow the exact HTTPS CMS hostname and `/uploads/**`; the local original only allows older provider domains |
| Strapi | `PUBLIC_URL` | Same public CMS HTTPS origin; rebuild the CMS admin with this URL |
| Strapi | `CORS_ORIGINS` | `https://urslja-gora.vercel.app`; add only confirmed custom/preview origins as needed |
| DNS | CMS hostname only | Point `cms.YOUR-DOMAIN.si` at the VPS; leave website/apex/www records on Vercel |
| Caddy | CMS-only host | Public trusted HTTPS for API, admin and uploads |
| Strapi | Public role | Existing read permissions for news/events/offers and the intended moderated community endpoints |

Changing a `NEXT_PUBLIC_` value requires a newly built frontend deployment: the public CMS URL is compiled into the browser bundle. An environment edit alone cannot retarget the current browser bundle. This can be a future redeploy of the **same Vercel project**; it does not require moving hosting. No redeploy is authorized or performed now. [Next.js public environment variables](https://nextjs.org/docs/app/guides/environment-variables), [Vercel environment variables](https://vercel.com/docs/environment-variables).

The checked-in original `next.config.ts` does not permit a new `.si` CMS host. Review `deploy/vercel/next.config.example.ts` and add only its new CMS remote pattern to the actual deployed configuration; retain existing settings. [Next.js image allowlists](https://nextjs.org/docs/app/api-reference/components/image#remotepatterns).

`STRAPI_INTERNAL_URL=http://strapi:1337` is for the later Docker-hosted frontend only. Vercel cannot resolve that Docker service name or your Mac's localhost. Leave this variable unset on Vercel, or use the same public HTTPS CMS URL if a server override is genuinely needed. The prepared API helper already falls back to the public URL for server fetches when the internal override is absent.

Keep the website's `NEXT_PUBLIC_SITE_URL` as its existing Vercel/custom public URL. Existing Vercel SMTP, Turnstile, analytics, routes, domain mapping and build settings stay in that project. There is no reason to copy its email or CAPTCHA secrets into the CMS. Never put Strapi admin credentials, database passwords, API tokens with broad permissions, or backup passwords in `NEXT_PUBLIC_*` variables. Current public CMS reads do not need an admin token.

Browser requests and Vercel server-side requests must both reach the public backend. Public upload URLs must remain accessible to Vercel's image optimizer. CORS matters for browser API requests, including JSON submission preflights; it is not a substitute for Strapi role permissions. Production uses exact trusted origins, not `*` or all `*.vercel.app` projects. Add selected preview URLs explicitly only when needed. [Strapi CORS configuration](https://docs.strapi.io/cms/configurations/middlewares#cors).

## Compatibility review of the local source

The frontend and recovered backend both use Strapi 5 data shapes, and local news/events/offers/images have already passed browser tests. Before a future Vercel redeploy, compare the actual deployed source with these local findings:

- Event/offer list links use integer row IDs. The prepared copy uses stable `documentId` links and supports both numeric and document identifiers in detail filters. Old bookmarked numeric IDs can become unreliable after migration or publishing; retain compatible detail routes and test original links before switching.
- The local event detail route types `params` as a plain object; the prepared copy uses the Next.js Promise form. Apply if that issue exists in the deployed source.
- The local map-points query uses Strapi 4's `publicationState=live`. Use `status=published` for Strapi 5.
- The local image fallback points to an absent `/fallback.jpg`; use an existing asset if that reference is present on the deployed branch.

These are targeted compatibility checks. Do not replace the working Vercel frontend with the whole prepared Hetzner frontend, remove Vercel Analytics, add Docker-only private URLs, or change the design as part of the backend switch. Prior frontend migration experiments exist only in the isolated prepared copy. Security updates should also be reviewed against the actual deployed versions separately; no dependency update was pushed to Vercel.

## Future connection procedure

1. Finish the backend-only setup in BACKEND-DEPLOYMENT.md, verify recovered content/images, and address the remaining CMS dependency advisories before public exposure.
2. Record the current Vercel production deployment, deployed Git commit and environment configuration privately so it can be retained as a rollback reference.
3. Prepare the small API URL/image-domain/compatibility change against the actual deployed branch. Keep production unchanged while testing locally or, only with later approval, in a Vercel Preview.
4. Check all original news/events/offers, images, guestbook and map reads. Verify approved-only visibility, upload validation and exact-origin CORS. Test contact email/CAPTCHA only if their settings changed; they stay in Vercel.
5. Only after separate approval, rebuild/redeploy the existing Vercel project with the new backend URL. Preserve the existing public website address and DNS mapping. Verify fresh client-side and server-side requests and image optimization against the real trusted certificate.
6. If rollback is needed, restore the previously recorded Vercel configuration/deployment deliberately. Returning to a suspended Cloud API may restore frontend code but will not make that unavailable backend work; retain the recovered CMS backups independently.

The supplied backend-only configuration and local cross-origin simulation cannot prove Vercel Functions networking, a real CMS certificate, the unknown deployed commit or live environment settings. Those require a future controlled integration check; no public changes are made now.

## Historical read-only observation

A read-only browser inspection on 13 October 2026 returned HTTP 200 for the Vercel homepage. Its browser requested news, events and offers from **https://ursljagora-production.up.railway.app**, which differs from the local environment configuration inspected earlier. GET checks of those three public endpoints on 15 October returned HTTP 404. The user recalls not using Railway; these can be stale configuration references. The requests do not establish an active Railway service or prove that any remote database contains data. No remote service, account, database or deployment was changed, and no unavailable remote content was imported. Preserve the existing Vercel configuration and treat the deployed branch and remote CMS state as separate checks before a future switch.

This historical URL observation is not used as proof of Railway usage or as a prerequisite for restoring the local Strapi content.
