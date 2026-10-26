# Uršlja gora — Next.js in Strapi

Frontend v korenu repozitorija je za obstoječi Vercel projekt `urslja-gora`: https://urslja-gora.vercel.app. Uporabi Node 22, `npm ci` in `npm run build`. Izvirno oblikovanje, animacije, slike in navigacija so ohranjeni.

CMS je v `cms/urslja-gora-cms`: preverjena priprava Strapi 5.59.0 za Strapi Cloud uporablja Node 24 in svoj obstoječi lockfile. Novice, dogodki in ponudbe prihajajo iz Strapi API, brez nadomestnih vzorčnih objav. Pravi podatki, naloženi mediji, gesla in zasebne kopije niso objavljeni v Git. Stara datoteka CMS `data/data.json` je zgolj demonstracijska in ni vir spletnih novic.

Zasebno kopiraj `.env.example` v `.env.local`. Vercel potrebuje `NEXT_PUBLIC_STRAPI_URL` z delujočim javnim HTTPS originom CMS brez `/api`; `STRAPI_INTERNAL_URL` izpusti. Vercel ne doseže lokalnega Docker CMS. URL spremeni šele po obnovi in preverjanju novega Clouda, nato ponovno zgradi frontend. Potrjena prijava v račun ali Git push sama po sebi ne ustvarita gostovanja, naročnine ali baze.

Ta priprava ne spremeni Vercelovega paketa in ne vključi plačljivih storitev. Povezava z novim javnim CMS še zahteva ustvarjen projekt, pregled zasebnosti medijev in obnovo iz preverjene kopije. Natančno stanje in navodila: [Strapi Cloud](docs/STRAPI-CLOUD-SETUP.md). [Prejšnja izdaja frontenda](docs/FRONTEND-PRODUCTION-20261025.md) ostaja dokumentirana v zgodovini.
