# Uršlja gora — Next.js in Strapi 5

Ta veja vsebuje pregledane popravke iz izolirane lokalne kopije in je namenjena **Vercel Preview**, ne zamenjavi produkcije. Glavna veja `main`, obstoječa javna stran in lokalni CMS ostajajo nespremenjeni. Baze, CMS naložene fotografije, varnostne kopije, skrivnosti in zasebni testni dokazi niso del te objave.

Novice, dogodki in ponudbe se nalagajo iz Strapi API. Git in Vercel ne vsebujeta baze CMS. Lokalni Strapi ni dosegljiv iz Vercela; predogled potrebuje javni HTTPS naslov CMS. Manjkajočih vsebin ne nadomeščamo z vzorčnimi podatki.

## Lokalno razvijanje

Uporabi Node 22 in zaklenjene odvisnosti:

```sh
npm ci
cp .env.example .env.local
npm run dev
```

CMS je v `cms/urslja-gora-cms`; namesti njegove odvisnosti z `npm ci` in ga zaženi z `npm run develop` šele po zasebni nastavitvi baze in ključev. Obstoječih baz ne ponastavljaj in ne uvažaj brez preverjene kopije. V repozitoriju ni obnovljenih vsebin ali administratorskih prijavnih podatkov.

## Predogled in prihodnja objava

- [Nastavitve in omejitve tega predogleda](docs/VERCEL-PREVIEW-20261025.md)
- [Povezava Vercel in Strapi](docs/VERCEL-STRAPI-CONNECTION.md)
- [Preverjanje vsebin](docs/VERCEL-CONTENT-CHECKLIST.md)
- [Priprava kontakta](docs/CONTACT-BEFORE-DEPLOYMENT.md)
- [Produkcijska pripravljenost](docs/PRODUCTION-READINESS-CHECKLIST.md)
- [Backend, domena in HTTPS](docs/HETZNER-SI-STEP-BY-STEP.md)
- [Šifrirane kopije in obnova](docs/OFFSERVER-BACKUP-RESTORE.md)
- [Navodila lastniku](docs/NAVODILA-LASTNIK.md)

Starejša poročila v `docs/` opisujejo lokalne preizkuse, niso dokaz javne namestitve ali novega varnostnega pregleda. Ne uporabljaj starih lokalnih testnih uporabnikov ali podatkov za produkcijo. Podrobnosti in status te izdaje so v dokumentu predogleda.
