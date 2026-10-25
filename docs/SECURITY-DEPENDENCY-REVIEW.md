# Production dependency security review — 15 October 2026

The baseline 32 high-severity package entries represented **two underlying advisories**, not 32 independent exploits. The prepared CMS remains Strapi 5.57.0. The original project and production Vercel have not been changed.

## Fixes applied and checked

- `webpack-dev-middleware`: pinned compatible API override **7.4.6**, replacing 6.1.3. This crosses a package major, so it was checked explicitly: production/admin build, compiler callback, memory output filesystem and close APIs used by Strapi passed. This is development middleware and is not initialized by the new direct production entrypoint. A complete webpack hot-reload workflow was not tested; Vite is Strapi's default. [Maintainer advisory](https://github.com/advisories/GHSA-g84c-rxfj-3j2c).
- `dompurify`: patch override **3.4.17**, removing the low-severity sanitizer entries; admin build/browser checked.
- No forced Strapi downgrade or React Router major substitution. Strapi 5.58.0 release metadata was checked, but it still pins development middleware 6.1.3 and does not provide a solution for the unpatched braces advisory; an unrelated framework upgrade was not applied.
- Fresh production audit: frontend **0**; CMS **34 entries: 31 high, 3 moderate, 0 low, 0 critical**. Counts describe package dependency chains, not confirmed remote vulnerabilities.

## Unpatched high advisory

`braces <=3.0.3` has a nested-pattern stack-exhaustion advisory. The latest published version is 3.0.3 and the advisory lists **no patched version**. Many Strapi packages inherit the warning through `utils -> preferred-pm -> find-yarn-workspace-root2 -> micromatch -> braces`, plus watcher/generator paths. [Primary advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm).

The production container now starts `scripts/start-production.cjs` directly instead of initializing all CLI development/generator commands. Test-only module instrumentation found **no load of braces, micromatch, preferred-pm or webpack-dev-middleware** during startup, published API reads, registration rejection, uploads, moderation and administrator requests. The admin builder's filename matching uses fixed patterns rather than attacker-supplied patterns. Development, migration and package-manager commands still contain these packages; run them on trusted source/archives only.

The preload probe observes CommonJS package loads/calls; it is not a full trace of native ESM dynamic imports or every possible browser path. Static call-site review also informed this assessment. This is evidence of reduced production reachability, **not proof that every possible production path is safe**. The image still includes the affected package. Public launch requires a maintainer's explicit acceptance of this bounded residual risk or a tested upstream fix. Do not run `npm audit fix --force`: the suggested Strapi 4 versions are an incompatible downgrade.

## Every original high entry

| Package | Where it is used | Assessment |
| --- | --- | --- |
| `@strapi/admin` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/cloud-cli` | Cloud CLI | Inherited package-manager warning. Production starts the built app directly; Cloud CLI is not initialized. |
| `@strapi/content-manager` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/content-releases` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/content-type-builder` | Development builder/admin module | Inherited toolchain warning. Production editing uses Content Manager; builder should not accept production schema changes. AI filename matching uses fixed patterns. |
| `@strapi/core` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/data-transfer` | Production-installed transfer services + CLI | Inherited high warning from utils; separate stream-json moderate issue. Remote transfer explicitly disabled in server config; imports accept only trusted verified archives offline. |
| `@strapi/database` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/email` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/generators` | Code-generation CLI | Inherited tooling warning; no independent advisory. |
| `@strapi/i18n` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/permissions` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/plugin-cloud` | Installed but disabled plugin | Cloud plugin disabled in config. Inherited warning; no independent advisory. |
| `@strapi/plugin-users-permissions` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/provider-upload-cloudinary` | Installed but unselected provider | Only the local provider is configured. Inherited warning; no independent advisory. |
| `@strapi/provider-upload-local` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/review-workflows` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/strapi` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/types` | Shared types/runtime exports | Inherited utility/database/permission warning; no independent advisory. |
| `@strapi/upload` | Production Strapi module | Inherited warning through shared utilities/admin/database packages; no independent high advisory and no observed request-to-glob path. Do not mistake this for a development-only package. |
| `@strapi/utils` | Production shared utilities | Inherited via lazy package-manager detection. Contains production functions, but the vulnerable glob dependency was not loaded in observed web flows. |
| `braces` | Pattern processing dependency | No upstream patch (3.0.3 latest). Present in image; not loaded in observed production start/API/admin/moderation flows. Block arbitrary attacker-controlled glob patterns. Residual risk needs documented acceptance or an upstream fix. |
| `chokidar` | Development file watcher | Inherited braces warning; develop watcher, not production start. |
| `find-yarn-workspace-root2` | CLI/package-manager detection | Inherited braces via micromatch. Workspace/package files are trusted operator input. |
| `findup-sync` | Code-generation CLI | Inherited braces via micromatch. |
| `fork-ts-checker-webpack-plugin` | Build/development compiler tooling | Inherited braces via chokidar. Not a production HTTP route. |
| `jscodeshift` | Migration/code-generation CLI | Inherited braces via micromatch. Run on trusted source only. |
| `liftoff` | Code-generation CLI | Inherited braces via findup-sync. |
| `micromatch` | Tooling; also admin code with fixed patterns | Inherited braces warning. Content-type-builder AI upload uses fixed glob patterns, not user-supplied patterns; no server runtime load observed. |
| `plop` | Code-generation CLI | Inherited braces via liftoff. |
| `preferred-pm` | CLI/package-manager detection | Inherited chain. Strapi utils dynamically imports this only when package-manager detection is called; not loaded in observed production flows. |
| `webpack-dev-middleware` | Development HTTP middleware | Fixed: override 6.1.3 to 7.4.6. Build and compiler/middleware API smoke test passed. Not used by production start. |

## Remaining moderate entries

- `react-router` and `react-router-dom`: admin/browser runtime. Advisory includes link/navigation open redirects and SSR hydration constructor injection. This CMS admin is a client-side SPA, so the cited SSR hydration scenario is not its architecture; unsafe destinations still need review. Available patched line is 7.18+, while this Strapi release uses React Router 6. Do not force the major upgrade without upstream compatibility work. This is a residual admin-client risk, not classified development-only.
- `stream-json`: production-installed data-transfer service and CLI import/export. Includes pathological nested-filter processing and assembler prototype pollution. A 3.6+ fix would cross major versions from the installed 1.x API; no safe drop-in override was applied. Remote transfer is disabled in the actual server configuration, and its authenticated route was tested disabled. Only trusted checksum-verified offline imports are permitted.

## Limits and launch gate

This review covers the project npm dependency graph and exercised application paths. It is not an independent penetration test or a container OS/package vulnerability scan. Re-audit and scan the exact release image (including base OS) before launch; maintain supported Node 22, PostgreSQL 16 and Caddy 2 updates. Never expose `strapi develop` or Docker/database ports. Review this record after framework/plugin changes. A production launch is not security-cleared solely because functional tests pass.
