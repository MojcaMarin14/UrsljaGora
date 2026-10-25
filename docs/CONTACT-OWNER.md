# Kontaktni obrazec

Za prihodnji vklop prave pošte glejte [Priprava pred namestitvijo](CONTACT-BEFORE-DEPLOYMENT.md). Pošiljanje Nejcu ostaja odloženo; lokalni predal še naprej zajema preizkuse.

## Preizkus na tem računalniku

1. Odprite [Kontakt](https://site.localhost:8443/kontakt) in po potrebi osvežite s **Command–Shift–R**.
2. Vpišite ime, svoj e-poštni naslov in sporočilo, označite soglasje ter kliknite **Pošlji sporočilo**.
3. Po potrditvi kliknite **Odpri testni predal** ali odprite https://site.localhost:8443/testna-posta/.
4. Sporočilo poiščite po svojem imenu in ga odprite. To je samo lokalni preizkus: **nič ni poslano na pravi e-poštni naslov**. Prejemnik `local-inbox@example.invalid` je testna oznaka, ne prava pošta.
5. **Novo sporočilo** odpre prazen obrazec. Ob napaki podatki ostanejo v obrazcu, da lahko poskusite znova.

Predal in sporočila ostanejo shranjeni tudi po ponovnem zagonu. Za ponovni zagon obstoječega okolja tehnični skrbnik uporablja `.local-test/start-local-site.sh`. Ne brišite Docker volumnov ali podatkovnih baz.

## Poznejši pravi prejemnik

Potrjeni prihodnji prejemnik je **juvan.nejc2@gmail.com** (Nejčev naslov, ki je že naveden na strani Kontakt). V pripravljeni predlogi `deploy/contact.env.example` je nastavljen kot `EMAIL_TO`. Za pravo dostavo je še vedno potrebna povezava z e-poštnim ponudnikom za pošiljanje; trenutni lokalni predal in produkcijski Vercel ostajata nespremenjena. Gesla oziroma zasebni ključi sodijo v zaščitene nastavitve gostovanja; ne pošiljajte jih v klepet in ne dodajajte v javno kodo.

Skrbnik nastavi poštni strežnik, dovoljeni naslov pošiljatelja in prejemnika. Ko zamenjate prejemnika, spremeni samo nastavitev **EMAIL_TO** in ponovno zažene oziroma osveži namestitev frontenda. Besedil ali sestavnih delov spletne strani ni treba spreminjati; nova gradnja odjemalca za zamenjavo prejemnika ni potrebna. Odgovor na prejeto povpraševanje bo namenjen e-poštnemu naslovu obiskovalca, ki je izpolnil obrazec.

Pred javno uporabo je treba preizkusiti pravo pošto in preveriti, da je sporočilo res prispelo v izbrani predal, tudi v mapo z neželeno pošto. Sedanja Vercel namestitev ni spremenjena. Ker frontend za zdaj ostaja na Vercelu, se njegove prihodnje poštne nastavitve urejajo tam; selitev samo Strapi ne seli kontaktnega obrazca. Za zdaj ni bil povezan noben pravi poštni strežnik ali poslana prava e-pošta.

## Za tehničnega skrbnika

- API: GET `/api/kontakt` vrne samo `available`, `localTest` in javni `siteKey`, brez SMTP podatkov ali skrivnosti. Pošiljanje je POST na isti poti. Prejemnik je izključno strežniški `EMAIL_TO`; obiskovalec ga ne more spremeniti.
- Produkcija: `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_SECURE`, `EMAIL_USER`, `EMAIL_PASS`, opcijski `EMAIL_FROM` (privzeto `EMAIL_USER`) in `EMAIL_TO`. Enostavni posamični naslovi brez prikaznega imena. SMTP prijavni uporabnik ni nujno e-poštni naslov, zato v tem primeru obvezno nastavite `EMAIL_FROM`. Za port 587 uporabite `EMAIL_SECURE=false` (STARTTLS je zahtevan); za implicitni TLS na 465 `EMAIL_SECURE=true`. Uporabite nastavitve ponudnika in veljaven certifikat. `EMAIL_FROM` mora biti pri ponudniku dovoljen/preverjen.
- Zaščita: `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAME` in pravilen `NEXT_PUBLIC_SITE_URL`. Za obstoječe nastavitve je podprt tudi `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, ki ga pripravljeni produkcijski Compose posreduje strežniku kot `TURNSTILE_SITE_KEY`. CAPTCHA se naloži šele iz strežniške konfiguracije; preverjanje se izvaja na strežniku in zahteva pravilna action ter hostname. Zasebni ključ nikoli ne gre v brskalnik.
- Referenčna predloga je `deploy/contact.env.example`; je **nepopolna predloga pošte**, ne nadomestilo za obstoječi zasebni deploy env z bazo in drugimi skrivnostmi. Produkcijski `deploy/compose.yaml` izrecno nastavi `CONTACT_LOCAL_TEST=false`. Te konfiguracije ne zaganjajte proti lokalni obnovljeni bazi.
- Lokalni način je dovoljen samo ob izrecnem `CONTACT_LOCAL_TEST=true`, lokalnem konfiguriranem in zahtevanem hostu ter točno `mailpit:1025` brez SMTP prijavnih podatkov/TLS. Če se zastavica pomotoma prenese na javno domeno ali drug poštni strežnik, se pošiljanje izključi. Javna namestitev zahteva CAPTCHA; prejemniku določene v telesu zahteve strežnik ne zaupa.
- Lokalni [Mailpit](https://mailpit.axllent.org/docs/install/docker/) v1.32.0 je pripet na SHA-256 slike. Njegova HTTP/SMTP vrata niso objavljena na gostitelju, container je samo v internem omrežju brez zunanje poti. Dostop do UI/API gre skozi obstoječi lokalni HTTPS proxy na `/testna-posta/`. Posredovanje/relay ni nastavljeno. UI ima dovoljen samo pričakovani host.
- Podatki predala so v ločenem volumnu `urslja-gora-visual_mailpit-data`. Nastavljen je `MP_MAX_MESSAGES=0`, zato ni samodejnega brisanja po številu sporočil; to vedenje opisujejo [uradna navodila za hrambo](https://mailpit.axllent.org/docs/usage/deleting-messages/). Lokalni predal ni del Strapi baze in ne nadomešča pravih ponudnikov pošte.

## Preverjeno 25. 10. 2026

Na namizju 1440×1000 in mobilnem prikazu 390×844 je dejanska oddaja prek obrazca dosegla lokalni SMTP predal. V njegovem brskalniškem UI sta bila preverjena vsebina in Reply-To. Preverjeni so soglasje, veljavnost e-poštnega naslova, prikaz napake z ohranjenimi podatki, nov prazen obrazec, popravljena zasebnost in tri telefonske povezave, ki sedaj ustrezajo izpisani številki 064 132 385.

Ločeni testi brez omrežja so preverili omejitev lokalnega načina, zahtevan CAPTCHA v produkciji, zamenjavo prejemnika brez gradnje ter neuspehe SMTP in neprevzetega naslovnika. Brskalniški preizkus javnega načina je uporabil simulirana CAPTCHA in dostavo: widget se po napaki ne izgubi, sporočilo o napaki ostane vidno po osvežitvi CAPTCHA in nov obrazec dobi nov widget. **Prava Cloudflare preveritev in prava zunanja dostava ostajata za poznejšo, odobreno konfiguracijo.**

Vse tri zajete preizkusne pošte so ohranjene po restartu Mailpit, brez brisanja. Preverjene so tudi novice, pretekli dogodki, ponudbe in slike iz Strapi; hero/poster in popravljena slika cerkve ostajata dostopna. Ni bilo sprememb Strapi baze, slik, Cloud računa ali produkcijskega Vercela. Izvorna kopija projekta je nedotaknjena.

Pred spremembo je bil preverjen arhiv prizadetih izvornih datotek in lokalnih konfiguracij: `/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-contact-working-20261025_132327/`. Dokazi, skripte in zaslonske slike so v `.local-test/contact-working-20261025/`. Aktivni frontend: `urslja-gora-frontend-dynamic:20261025-contact-working-final`. Storitev predala, frontend, CMS, PostgreSQL in HTTPS proxy ostajajo zagnani.
