# E-pošta pred namestitvijo — 25. 10. 2026

## Stanje in naslednji korak

Pripravljena je koda kontaktnega obrazca, lokalni testni predal, predloga bodočih nastavitev in avtomatski preverjalnik, ki **privzeto ne uporablja omrežja in nikoli ne pošilja sporočil**. Nejčev potrjeni prihodnji naslov je **juvan.nejc2@gmail.com**. Na ta naslov ni bilo poslano nobeno sporočilo. Sedanja Vercel namestitev in lokalni testni predal ostajata nespremenjena.

Za pravo dostavo manjkajo preverjeni podatki poštnega ponudnika in pravi ključi Turnstile. Najprej zasebno preverimo, ali obstoječe Vercel nastavitve že vsebujejo ustrezno povezavo; nove storitve ni treba kupiti, če je obstoječa primerna. Naslov prejemnika in račun za pošiljanje sta različni vlogi: **za prejemanje na Nejčev Gmail ne potrebujemo njegovega gesla**. Pošiljamo prek dovoljenega računa ponudnika; odgovor se naslovi na obiskovalca prek Reply-To.

## Kratek seznam za lastnico

- [x] Potrjen bodoči prejemnik in obstoječi URL strani.
- [x] Oddaja v lokalni predal preverjena na namizju in mobilnem prikazu; sporočila se ohranijo po restartu.
- [x] Obrazec ohrani vnos ob napaki; javni način zahteva CAPTCHA; prejemnik je določen na strežniku.
- [x] Zasebna predloga ustvarjena z dovoljenji 600. Ne uporablja je nobena tekoča storitev.
- [x] Pripravljeni preverjalnik brez pošiljanja, navodila za Vercel in poznejši Hetzner ter postopek povrnitve.
- [ ] Potrjen ponudnik pošiljanja, dovoljeni pošiljatelj in njegove zasebne SMTP nastavitve.
- [ ] Prava Turnstile ključa za potrjeni javni naslov; po potrebi ponudnikova overitev pošiljatelja/DNS.
- [ ] Preverjena dejanska produkcijska veja/commit in zasebno shranjene prejšnje nastavitve za povrnitev.
- [ ] Odobrena objava pripravljene kode in aktivacija prave pošte. **Sedanja priprava ni odobritev za pošiljanje Nejcu.**
- [ ] Ločeno dogovorjen varen preizkus dejanskega prejema; do takrat ne oddajamo prave pošte.

Gesel in zasebnih ključev ne pošiljajte v klepet, screenshotih ali javni kodi. Vnašajo se neposredno v zaščitene nastavitve gostovanja oziroma zasebno datoteko. Za tehnično izvedbo so spodnja navodila; uporabnik spletne strani teh podatkov nikoli ne vidi.

## Nastavitve za vzdrževalca

| Nastavitev | Pripravljeno / potrebno |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | `https://urslja-gora.vercel.app`, dokler lastnica ne potrdi drugega glavnega naslova |
| `EMAIL_TO` | `juvan.nejc2@gmail.com`, samo bodoči prejemnik |
| `CONTACT_LOCAL_TEST` | `false` v prihodnji javni konfiguraciji; dejanska lokalna storitev ostaja v svojem varnem testnem načinu |
| `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASS` | Zasebni podatki ponudnika pošiljanja; za zdaj prazni |
| `EMAIL_FROM` | Ponudnikov dovoljeni/preverjeni pošiljatelj; ni samodejno naslov obiskovalca ali prejemnika |
| `EMAIL_PORT`, `EMAIL_SECURE` | Predloga 587/false: povezava se nadgradi z obveznim STARTTLS. Alternativa 465/true samo tam, kjer ponudnik in omrežje to dovolita |
| `TURNSTILE_SITE_KEY` | Javni ključ, ki ga runtime GET konfiguracija varno posreduje obrazcu |
| `TURNSTILE_SECRET_KEY` | Zasebni ključ, samo strežnik |
| `TURNSTILE_EXPECTED_HOSTNAME` | `urslja-gora.vercel.app`; mora ustrezati dejanskemu glavnemu spletnemu naslovu |

`deploy/contact.env.example` je referenčna predloga. Pripravljena zasebna datoteka je `.local-test/contact-production.env`: vsebuje potrjeni izvor/prejemnika in prazna polja, **ni vključena v lokalni Compose ali Vercel in je ne smemo naložiti v delujočo storitev med pripravo**. Datoteka je ignorirana za Git in `.local-test` je izključen iz Docker konteksta. Predloga pošte ne nadomesti celotnega zasebnega `.env` za bazo/Strapi/backup.

Če je treba ustvariti novo zasebno kopijo drugje, preverjalnik uporablja izključno ustvarjanje nove datoteke in zavrne prepis:

```sh
python3 deploy/scripts/preflight-contact.py --init /PRIVATE/PATH/.env.contact
```

Obstoječo predlogo preverimo **brez omrežja in pošiljanja**:

```sh
python3 deploy/scripts/preflight-contact.py --env .local-test/contact-production.env
```

Dokler zasebna polja niso dopolnjena, pričakovano vrne `NI PRIPRAVLJENO` in izhodno kodo 2. Preveri zasebna dovoljenja, HTTPS izvor in host, pravilni par vrat/TLS, kontaktne naslove, potrjenega prejemnika, manjkajoče/testne ključe in uhajanje gesel v `NEXT_PUBLIC_*`. Vrednosti ne izpisuje, datoteke ne izvaja kot shell skript in ne spreminja omrežja ali storitev. Lastnikovo prihodnjo spremembo prejemnika je treba izrecno uskladiti; na voljo je `--expected-recipient` za nov potrjeni naslov.

Po dopolnitvi pravih nastavitev lahko vzdrževalec posebej izvede preverjanje povezave:

```sh
python3 deploy/scripts/preflight-contact.py --env /PRIVATE/PATH/.env.contact --check-smtp
```

Ta dodatna možnost se poveže samo s podanim SMTP strežnikom, zahteva veljaven TLS certifikat in preveri prijavo; uporablja samo EHLO, TLS, AUTH in QUIT. **Ne uporablja MAIL FROM, RCPT TO, DATA ali pošiljanja sporočila.** Med to pripravo ni bila zagnana s pravim ponudnikom. Uspešna prijava še ne dokaže, da ponudnik dovoli izbrani From, ali da sporočilo prispe prejemniku. Enako omejitev ima Nodemailerjev [verify](https://nodemailer.com/smtp#verifying-the-configuration).

## Vercel ostaja glavna možnost

1. Pred spremembami zasebno zabeležimo obstoječi produkcijski deployment, dejanski Git commit/vejo in nastavitve, ne da bi jih izpisovali v poročilo. Trenutna koda je v izolirani kopiji; objavljena veja še ni potrjena.
2. Proti potrjeni produkcijski kodi pregledamo spremembe kontaktne poti/obrazca, soglasja in povezav. Ohranimo obstoječi videz in vse CMS popravke. Ne zamenjamo Vercela z Docker postavitvijo in ne potiskamo celotne testne kopije.
3. Po odobritvi se private nastavitve vnesejo v **isti Vercel projekt → Settings → Environment Variables**, za pravi environment. `EMAIL_PASS` in `TURNSTILE_SECRET_KEY` nimata predpone `NEXT_PUBLIC_`. [Vercel navodila](https://vercel.com/docs/environment-variables) pojasnjujejo, da spremembe veljajo za nove deploymente.
4. Pri ločenem Preview testu uporabimo njegov dejanski hostname in ločene ključe; prejemnik je dogovorjeni testni naslov, ne Nejčev. Tak Preview je javna/spremenjena zunanja namestitev in še ni bil ustvarjen ali odobren.
5. Po odobrenem deploymentu **najprej samo GET** `/api/kontakt`: vrniti mora `available=true`, `localTest=false` in pravi javni siteKey, brez skrivnosti. V brskalniku se mora naložiti Turnstile; ponareditev/izpuščen token ne sme omogočiti pošiljanja. [Cloudflare zahteva strežniško validacijo](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) in pravilni hostname/action; [testni ključi](https://developers.cloudflare.com/turnstile/troubleshooting/testing/) niso produkcijski ključi.
6. Pravo oddajo na dogovorjeni testni naslov izvedemo samo po ločenem dogovoru; preverimo tudi prejem, Reply-To, mapo neželene pošte, ponovno oddajo in sporočilo ob napaki. Nejčev naslov se vključi šele, ko lastnica dovoli pravo dostavo. Zdaj tega ne izvajamo.

Selitev samo Strapi na Hetzner ne prestavi e-poštne poti iz Next.js/Vercela. Poštnih skrivnosti zato ne kopiramo v CMS. Za povezavo CMS sledimo obstoječim [Vercel–Strapi navodilom](VERCEL-STRAPI-CONNECTION.md).

## Možnost poznejšega frontenda na Hetznerju

Pripravljeni `deploy/compose.yaml` zdaj podpira obe imeni javnega ključa: prednost ima `TURNSTILE_SITE_KEY`, nato `NEXT_PUBLIC_TURNSTILE_SITE_KEY`; ohrani tudi izrecni pričakovani hostname. To je preverjeno s sintetičnimi nastavitvami brez zagona containerjev. V javni konfiguraciji ni Mailpit, lokalni način je izrecno false.

Za VPS je privzeta možnost **587 z STARTTLS**. Hetzner po [uradnem FAQ](https://docs.hetzner.com/cloud/servers/faq/#why-can-i-not-send-any-mails-from-my-server) privzeto blokira odhodna vrata 25 in 465, 587 pa dopušča; omejitve so vezane na račun in jih je treba preveriti tudi ob prenosu lastništva. To se nanaša na bodoči frontend na Hetznerju, ne na sedanji frontend na Vercelu. Ne odpiramo javnega SMTP strežnika in ne nameščamo lastnega poštnega sistema.

Celotna frontend+backend Compose postavitev ostaja osnutek: pred uporabo je treba uskladiti pravice PostgreSQL z utrjeno backend-only postavitvijo. Ne zaganjajte je proti obstoječim lokalnim volumnom ali bazi. Dokler Next.js ostaja na Vercelu, je načrtovana produkcijska pot backend-only.

## Povrnitev in končna odobritev

- Če je prihodnji preizkus neuspešen, ohranimo podatke in povrnemo zabeleženi Vercel deployment ter njegove zasebne nastavitve. Povrnitev okolijskih vrednosti prav tako zahteva nov ustrezni deployment; sprememba v dashboardu sama ne spremeni že objavljenega paketa.
- SMTP prijava ni dokaz dostave, lokalni test pa ni dokaz javnih DNS/certifikatov ali prave Turnstile integracije. Celotna produkcijska pripravljenost se vodi v [glavnem seznamu](PRODUCTION-READINESS-CHECKLIST.md).
- Vklop javne pošte in katerakoli prava oddaja Nejcu ostajata odložena do izrecnega dovoljenja lastnice. Ta priprava ne spreminja Vercela, Cloud računa, DNS, originalnega projekta, obstoječih baz ali lokalnega testnega načina.

## Dokazi priprave

Sedem lokalnih testov je preverilo ustvarjanje brez prepisovanja, način 600, zavrnitev nevarnih/testnih nastavitev, odsotnost omrežja pri privzetem preverjanju, redakcijo skrivnosti in SMTP zaporedje brez pošiljanja. SMTP prijava je bila v testih simulirana, noben pravi ponudnik ni bil kontaktiran. Preverjena sta oba načina mapiranja javnega ključa v prihodnjem Compose. Pripravljena zasebna datoteka pravilno ostane `configuration_ready=false`, dokler je ne dopolnimo. Dokazi so v `.local-test/contact-predeploy-20261025/`.
