# Uršlja gora — Next.js frontend

Glavna veja vsebuje posodobljen frontend za obstoječi Vercel projekt `urslja-gora`. Produkcijski naslov je https://urslja-gora.vercel.app. Uporabi Node 22 in `npm ci`; produkcijska gradnja je `npm run build`.

Popravki ohranjajo prvotno oblikovanje, animacije in navigacijo. Vključeni so mobilni meni na mapi, odpravljene manjkajoče slike in video poster, potrjena naslovna slika O nas, dinamične Strapi vsebine, obrazci in vreme. Novice, dogodki in ponudbe potrebujejo delujoč javni Strapi API; kode ali vzorčnih vsebin ne uporabljamo kot nadomestilo za manjkajočo bazo.

Lokalna CMS baza, naloženi mediji, gesla in zasebni testi niso objavljeni v tem repozitoriju. Pripravljena migracija in varnostne spremembe Strapi so ločene na veji `preview/local-recovery-20261025`; frontend izdaja jih ne uvaja v produkcijsko zaledje.

Za razvijanje zasebno kopiraj `.env.example` v `.env.local` in nastavi obstoječi Strapi. Na Vercelu se `NEXT_PUBLIC_STRAPI_URL` nastavi na javni HTTPS origin CMS brez `/api`; `STRAPI_INTERNAL_URL` mora biti izpuščen, zasebni Docker naslovi niso dosegljivi. `.env.example` vsebuje samo prazna polja in lokalne razvojne privzete vrednosti, ne produkcijskih skrivnosti.

[Status izdaje, preverjanje in povrnitev](docs/FRONTEND-PRODUCTION-20261025.md).
