# Mobilni meni na strani z mapo — lokalno preverjanje 25. 10. 2026

Zemljevid je prekrival odprti navigacijski meni in prestrezal dotike. Glava je imela z-index 100, meni 99, plasti zemljevida pa do 1000.

Popravljen je `app/components/Navbar.tsx`. Zaprta glava je na ravni 2000, odprti meni na 10000, odprta glava na 10001. Obstoječa fotografska okna na ravni 9999 ostanejo nad zaprto glavo. CSS zemljevida je ostal nespremenjen. Ohranjen je videz, barve, pisava in vse navigacijske povezave.

Na nizkih zaslonih se meni pomika. Odpiranje ponastavi položaj pomika, skrite povezave niso aktivne, zapiranje in prehod na namizno širino sprostita pomikanje strani. Dodani so upravljanje fokusa, Escape in podatki za bralnike zaslona.

## Preverjeno

- Produkcijska gradnja z Node 22 in preverjanjem TypeScript je uspešna; odvisnosti niso bile spremenjene.
- Chrome/Playwright z mobilnim dotikom: 390 × 844, 320 × 568, 667 × 375 in 768 × 1024. Vseh sedem povezav je dosegljivih nad mapo, tudi ob odprtem panelu Poti. Preverjeni so odpiranje, zapiranje, pomik, fokus, prehod na namizno širino in dejanska navigacija.
- Na najmanjšem zaslonu je preverjeno odpiranje in zapiranje obrazca za fotografijo ob obstoječi točki. Nobena fotografija ali vsebina ni bila oddana.
- Dejanske lokalne API vsebine in slike: 3 novice, 2 pretekla dogodka in 2 ponudbi se ujemajo s prikazom. Ni napak JavaScript ali napak pri nalaganju teh CMS slik.
- Vreme, CSS zemljevida, video poster in popravljena slika O nas so ohranjeni. Testi so emulirani; fizični telefon/Safari še ni bil preverjen.

Dokazi in posnetki: `.local-test/mobile-menu-fix-20261025/`. Lokalna slika: `urslja-gora-frontend-dynamic:20261025-mobile-menu-v3`. Ponovno zagnan je bil samo lokalni frontend. Vercel, Strapi Cloud, izvirnik, baze in mediji niso bili spreminjani.

## Povrnitev

Preverjena varnostna kopija izvornih datotek je v `../backups/mobile-menu-before-fix-20261025-162543/source.tar.gz`; preverjanje je shranjeno poleg nje. Za vrnitev prejšnje lokalne različice obnovi Navbar iz kopije ter v `.local-test/visual-frontend.compose.yaml` in `.local-test/start-local-site.sh` vrni prejšnjo oznako slike iz kopije (različica weather-v2). Nato uporabi isti lokalni Compose ukaz kot v `.local-test/start-local-site.sh`, z `up -d --no-deps --wait frontend-smoke`, da se ponovno ustvari samo frontend. Ne ustavljaj PostgreSQL in ne odstranjuj nosilcev.
