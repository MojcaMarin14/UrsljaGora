# Preizkus kontakta — 25. 10. 2026

**Poznejša sprememba:** Lokalna oddaja in testni poštni predal sta zdaj vključena, povezave popravljene. Trenutna navodila in omejitve prave zunanje dostave so v [Kontaktni obrazec](CONTACT-OWNER.md). Spodaj je ohranjen prvotni pregled pred popravilom.

**Lokalna stran Kontakt se naloži, vendar obrazec trenutno ne more poslati prave e-pošte.** Na namizju (1440×1000) in telefonu (390×844) so polja in soglasje uporabni, slika se naloži, ni vodoravnega prelivanja ali JavaScript izjem. Po pravilni izpolnitvi ostane gumb Pošlji sporočilo onemogočen.

## Blokade in ugotovljene napake

1. Aktivni lokalni frontend container nima SMTP nastavitev (`EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_TO`, po potrebi `EMAIL_SECURE`) niti Turnstile nastavitev (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`, `TURNSTILE_EXPECTED_HOSTNAME`). Tudi odjemalčev paket nima site key: Turnstile skripta/widget nista vključena. Javni ključ mora biti dodan ob gradnji frontenda; ostale zasebne nastavitve sodijo v njegovo strežniško okolje, ne v javni paket. To so nastavitve Next.js, ne povezave s Strapi. Vrednosti niso bile izpisane ali spreminjane. Ob manjkajočem ključu UI ne pojasni vzroka, ker je opozorilni odstavek prazen.
2. Povezava »obdelavo osebnih podatkov« v obrazcu vodi na `/zasebnost` (HTTP 404). Obstoječa pravilna stran `/politikaZasebnosti` vrne 200.
3. Povezave ob prikazani številki **064 132 385** se ne ujemajo z besedilom: v kontaktni kartici `tel:041743442`, v namiznem meniju `tel:+386641323851`, v mobilnem meniju `tel:+38641323851`. Številke nismo spreminjali ali klicali. Druga kartica 041 685 555 in njen tel href sta skladna. Mailto povezave se ujemajo z izpisanim naslovom; dostava na ta naslov ni bila preizkušena.

## Kaj je bilo preverjeno

- Dejanski lokalni API varno zavrne neveljaven JSON, manjkajoča polja/token, napačen e-poštni naslov in predolg vnos (HTTP 400), preden bi poskusil CAPTCHA/SMTP.
- Neodvisen preizkus iste izvorne kontaktne poti: dejanska nameščena knjižnica Nodemailer je poslala eno testno sporočilo izključno lokalnemu SMTP sprejemniku v Docker containerju z **--network none**. Uporabljeni so bili izmišljeni `.invalid` naslovi, nobene prave poverilnice, Turnstile preverjanje pa simulirano. Pot je vrnila 200; preverjeni so Reply-To, HTML escaping in preprečevanje vrivanja e-poštnih glav. Ob simulirani SMTP napaki vrne 500 in ne lažnega uspeha. Zavrne tudi napačen CAPTCHA rezultat, action, hostname in manjkajoči secret (403).
- Zgornji preizkus potrjuje lokalno logiko in SMTP sestavo, **ne prave Cloudflare zaščite, prijave na poštni strežnik ali dejanskega prejema sporočila**. Za celoten preizkus je treba povezati pravilne nastavitve in dobiti izrecno dovoljenje za testno sporočilo na dogovorjeni naslov. Nastavitev zaščite se ne sme obiti za pravo okolje.
- V prvem brskalniškem preizkusu so bile preventivno blokirane vse POST zahteve, tudi nekaj običajnih Google Maps POST zahtev. Te zabeležene blokade zemljevida izvirajo iz preizkusne zaščite; niso dokaz napake samega zemljevida. Na kontaktni endpoint iz obrazca ni bil poslan noben POST. Dodatni API preizkusi so uporabljali izključno neveljavne vnose brez možnosti pošiljanja e-pošte.

Ni sprememb izvornih datotek obrazca, konfiguracije, okolijskih vrednosti, baze ali produkcije. Dokazi in zaslonske slike: `.local-test/contact-review-20261025/`. Lokalna stran in Strapi ostajata zagnana. Vercel ter originalni projekt ostajata nespremenjena; njune e-poštne nastavitve niso bile pregledovane ali testirane.
