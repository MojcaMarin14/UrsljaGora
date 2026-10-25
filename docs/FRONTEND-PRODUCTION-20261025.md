# Produkcijski frontend — 25. oktober 2026

Uporabnica je zahtevala objavo na glavni strani namesto predogleda. Ta izdaja prenese preverjene spremembe frontenda iz 4da3f361741f5fcbe0a7ef48dbee3b94eae9df8e na main. Ne prenaša sprememb pod cms/ ali deploy/ in ne uvaža podatkov. Prejšnji main: 25ad495798067f4360568364deed3e62f4af71cd.

## Spremembe in preverjanje

Ohranjena postavitev, barve, pisave, animacije in navigacija; popravljen mobilni meni nad mapo, video poster, velikost črke končnice cerkvene slike, naslovna fotografija O nas (potrjeni Instagram travnik), delujoči panorama viri z ohranjenimi naslovi, Strapi 5 povezava, pohvale in izbiranje fotografij, kontakt ter vreme. Pozneje pripeta fotografija ni uporabljena, ker njeno mesto ni bilo potrjeno.

Frontend uporablja Node 22, Next.js in eslint-config-next 16.4.3 ter Nodemailer 10.2.1. Čista npm ci in privzeta gradnja Turbopack sta že preverjeni na izvorni izdaji. Produkcijski npm audit te izdaje je vrnil 0 opozoril. Vremenski testi: 6 uspešnih. Namizni in mobilni brskalniški preizkus iste kode na Vercelu je potrdil naslovno sliko, povezave menija nad mapo in odsotnost napak JavaScript. Starejša lokalna poročila niso novi varnostni pregledi produkcije.

## Delovanje, ki še zahteva storitve

- Popravljeni CMS je trenutno lokalni. Vercel potrebuje javni HTTPS CMS z obnovljeno bazo in mediji. Ta Git push ne prenese podatkov ali lokalnih Docker vsebin.
- Na obstoječem Vercel projektu je za dinamične vsebine potreben NEXT_PUBLIC_STRAPI_URL in nova gradnja; ob javni namestitvi mora CMS dovoliti točen spletni origin. STRAPI_INTERNAL_URL na Vercelu ni nastavljen na Docker ali localhost. ALLOW_PRIVATE_CMS_IMAGES je false oziroma izpuščen.
- Kontakt je brez veljavnih SMTP in Turnstile nastavitev onemogočen. Pri preverjanju te izdaje se uporablja samo GET; nobeno sporočilo se ne pošilja Nejcu ali komu drugemu. Javna konfiguracija ne sme vključiti lokalnega Mailpit načina.
- Stara javna .env.example je vsebovala zasebni Turnstile ključ. Nova predloga ga ne vsebuje. Če je aktiven, je potrebna zamenjava pri Cloudflare in v zasebnih nastavitvah; zgodovina ni prepisana.
- Za javno komercialno uporabo vremena je treba urediti dovoljeni vir/licenco. WEATHER_API_KEY je samo strežniška skrivnost; nobena plačljiva storitev ni vključena s to izdajo.
- Pred prihodnjo javno objavo CMS je potreben pregled preostalih backend advisories, čiste vsebine brez testnih zapisov ter preverjene oddaljene kopije in obnova. Backend audit izvorne priprave: 29 high, 6 moderate in 0 critical. Ta frontend izdaja zaledja ne namešča in ni potrdilo njegove produkcijske pripravljenosti.

## Povrnitev

Prejšnji commit in Vercel deployment ostajata v zgodovini. Ob napaki obnovi prejšnjo Vercel produkcijsko izdajo oziroma ustvari nov Git revert commit za frontend izdajo. Ne uporabljaj force-push, ne prepisuj zgodovine in ne ponastavljaj baz. Vercel runtime/billing, DNS, domena, izvirni lokalni projekt in Cloud računi se s to pripravo ne konfigurirajo ročno.

Ohranjena je tudi izvirna Vercel Analytics integracija iz prejšnje produkcijske kode. V izoliranih lokalnih testih je bila izklopljena; njena odstranitev ni del produkcijske izdaje. Brskalniški preizkusi blokirajo vse POST oddaje, vključno s telemetrijo.

Če NEXT_PUBLIC_SITE_URL ni nastavljen, metapodatki in sitemap uporabijo potrjeni sedanji naslov https://urslja-gora.vercel.app namesto stare nepotrjene domene. Kasnejšo lastno domeno nastavite zasebno v Vercelu in ponovno zgradite frontend.
