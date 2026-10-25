# Vercel Preview — 25. oktober 2026

Uporabnica je odobrila shranitev na GitHub in predogled, glavna javna stran mora ostati nespremenjena. Izhodišče je main pri 25ad495798067f4360568364deed3e62f4af71cd. Veja: preview/local-recovery-20261025. Brez združevanja v main in brez napredovanja v produkcijo.

## Obseg

Ohranjena postavitev, barve, tipografija, animacije in navigacija; obnovljeni panorama naslovi z obstoječimi delujočimi slikami, popravljeni video poster, slika cerkve v galeriji, mobilni meni na mapi, moderirane pohvale/fotografije, orientacija naloženih slik, kontakt in vreme. Naslovna slika O nas je potrjeni Instagram travnik, shranjen lokalno; pozneje pripeta slika ni vključena, ker mesto zamenjave ni bilo potrjeno.

Novice, dogodki in ponudbe so dinamični API podatki brez vzorčnih nadomestil. Strapi koda vsebuje lokalno preverjene združljivostne in varnostne popravke, ni pa namestitve Strapi na Vercel. CMS podatki in mediji ostajajo ločeno v preverjenih lokalnih kopijah/volumnih.

## Nastavitve predogleda

Uporabi obstoječi Vercel projekt urslja-gora v računu mojcamarin14s-projects, ne novega ali podobno imenovanega projekta. Root directory je koren repozitorija. Node 22.x; namestitev npm ci. Privzeta gradnja npm run build (Turbopack) in lokalni način --webpack sta preverjena. Izhodni imenik naj ostane privzeti za Next.js.

- NEXT_PUBLIC_STRAPI_URL: dejanski javni HTTPS CMS origin, brez /api. Ne localhost in ne ime Docker storitve. Za delujoč CMS mora biti dosegljiv iz brskalnika in Vercel funkcij.
- NEXT_PUBLIC_SITE_URL: potrjeni origin spletne strani. Glavni javni origin ostaja https://urslja-gora.vercel.app.
- STRAPI_INTERNAL_URL: na Vercel naj bo izpuščen.
- ALLOW_PRIVATE_CMS_IMAGES: false oziroma izpuščen.
- CONTACT_LOCAL_TEST: false oziroma izpuščen. Mailpit in lokalne nastavitve niso javna pošta.
- SMTP in Turnstile: do ločenega dogovora o pravi dostavi ostanejo nenastavljeni v predogledu. Ne pošiljaj testne pošte lastniku.
- WEATHER_API_KEY: samo strežniška skrivnost, če se dogovori dovoljen ponudnik; za javno komercialno uporabo je odprta licenca vremena.

CMS mora dovoliti točen origin predogleda v CORS, brez splošnega *.vercel.app. Ko se spremeni NEXT_PUBLIC_STRAPI_URL, je potrebna nova gradnja. Ne spreminjaj produkcijskih env, domen, DNS ali veje.

## Znane omejitve in naslednji koraki

Obnovljeni Strapi je lokalni. Predogled brez javnega backend gostovanja ne potrjuje delovanja novic, dogodkov, ponudb ali oddajanja pohval/slik. Ne uporabljaj starega nedelujočega Railway naslova kot dokaz delujočega CMS. Za kontakt potrebujemo prave SMTP in Turnstile nastavitve ter izrecno dovoljenje za zunanje testno sporočilo.

Obstoječa javna .env.example je vsebovala zasebni Turnstile ključ. Nova predloga je prazna. Če je ključ aktiven, ga zamenjaj pri Cloudflare in v ustreznem zasebnem okolju; odstranitev iz novega commita ne odstrani zgodovine. Zgodovina ni bila prepisana.

Odprti ostajajo končni CMS dependency/OS pregled, izbira javnega gostovanja, čista pregledana vsebina brez testnih zapisov, preverjene oddaljene kopije/obnova, CORS in javna dovoljenja, e-pošta in vremenska licenca. Ta veja ni potrdilo produkcijske pripravljenosti. Za javni backend ni bila kupljena ali vključena nobena storitev.

## Povrnitev

Predogled je ločen od produkcije, zato ni treba povračati main ali baze. Za glavno stran ne izberi Promote to Production in veje ne združi, dokler backend in zgornje zahteve niso pripravljeni.

## Nov pregled odvisnosti za to vejo

Sveži npm audit je potrdil nova opozorila po starih lokalnih poročilih. Frontend je posodobljen na Next.js/eslint-config-next 16.4.3 in Nodemailer 10.2.1, brez sprememb zasnove. Po čisti npm ci je produkcijska gradnja uspela, ponovni audit produkcijskih odvisnosti pa vrne 0 opozoril. To ni pregled operacijskega sistema ali varnostno testiranje celotne aplikacije.

Vremenski testi: 6 uspešnih; preverjanje priprave kontakta: 7 uspešnih, brez pošiljanja zunanje pošte. Sveži backend audit lockfila kaže 29 high in 6 moderate, 0 critical; backend ni nameščen ali nadgrajen v tej izdaji. Stara poročila s številkami 31 ali 32 opisujejo prejšnji pregled in jih ne uporabljaj kot trenutno stanje. Reševanje preostalih dosegljivih CMS tveganj ostaja pogoj pred javno namestitvijo zaledja.

Viri opozoril: https://github.com/advisories/GHSA-2464-fhr4-w9xw , https://github.com/advisories/GHSA-673q-mjm6-r5xr in https://github.com/advisories/GHSA-8c8m-p3m8-cjg8 .
