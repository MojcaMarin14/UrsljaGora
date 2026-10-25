# Fotografija ob pohvali — lokalna različica, 25. 10. 2026

**Novejša dopolnitev:** [Gumb s plusom in pravilna orientacija](LOCAL-PHOTO-UPRIGHT-20261025.md) vsebuje trenutne oznake slik, Compose projekt in preverjanje EXIF orientacije.

## Za obiskovalca

1. Odprite https://site.localhost:8443/ in stran osvežite s **Command–Shift–R**.
2. Kliknite zlati gumb **Dodaj pohvalo**, napišite sporočilo ter po želji dodajte ime in oceno.
3. Pri **Dodaj fotografijo (neobvezno)** izberite eno fotografijo: **JPG, PNG, WebP ali AVIF, največ 5 MB**. Videli boste predogled; **Odstrani fotografijo** omogoča oddajo brez nje ali izbiro druge.
4. Označite soglasje za objavo in kliknite **Pošlji**. Počakajte na potrditev. Fotografija ni obvezna; oddaja samo besedila še vedno deluje.
5. Skrbnik mora pohvalo in priloženo fotografijo pregledati pred objavo.

## Za skrbnika

1. Prijavite se v https://cms.localhost:8443/admin s svojim **lokalnim** skrbniškim računom.
2. Odprite **Content Manager → Pohvale in pripombe**, izberite novo pohvalo in preglejte sporočilo ter polje **slika**. Neodobreno fotografijo lahko vidite v adminu; obiskovalcem je skrita.
3. Za javni prikaz sporočila **in fotografije** nastavite **odobrena → TRUE → Save**.
4. Na spletni strani odprite **Pohvale**, da osvežite seznam. Za umik nastavite **odobrena → FALSE → Save**.
5. Če želite objaviti samo besedilo, najprej odstranite povezavo do slike v polju **slika**, shranite in šele nato odobrite. Binarne datoteke ni treba brisati iz Media Library.

Dve novi pohvali z oznako **LOKALNI PREIZKUS FOTOGRAFIJE desktop/mobile** in testnima slikama sta ohranjeni **neodobreni**. Nista pravi pohvali. Obstoječi zapisi niso bili spremenjeni ali odstranjeni.

## Preverjanje in tehnične podrobnosti

- Preizkušeno v Chromu na namizju 1440×1000 in mobilnem prikazu 390×844: izbira, validacija, predogled, odstranitev, soglasje, oddaja, trajna potrditev, skrbniški predogled, odobritev in ponovni umik. Mobilno preverjanje simulirane napake je ohranilo besedilo in fotografijo za uspešen ponovni poskus.
- Nova neobvezna enojna medijska lastnost `pohvala.slika`. Fotografija in podatki se pošljejo skupaj v enem multipart POST `/api/pohvalas`; besedilna JSON oddaja ostaja podprta. Strapi vedno nastavi `odobrena=false` in zavrne pripenjanje poljubnih obstoječih ID-jev slik.
- Strežnik preveri število datotek, velikost, MIME in podpis formata. Neveljavne, prevelike, večkratne ali prikrite SVG datoteke so zavrnjene. Strapi preveri/obdela dejansko sliko z obstoječo storitvijo upload.
- Že pripravljeni `media-approval` middleware je zdaj vključen v aktivni lokalni backend ter razširjen za odobrene pohvale. Novi anonimni uploadi so označeni ob nastanku podatkovnega zapisa. Neodobreni izvirniki in vse pomanjšave vrnejo 404 tudi prek neposrednega URL-ja. Skrbniški predogledi uporabljajo podpisane povezave z veljavnostjo 5 minut, ustvarjene samo v avtenticiranih admin odgovorih. Po potrebi osvežite admin za nov predogled. Medijske zahteve imajo `Cache-Control: private, no-store`; frontend uporablja neposreden img brez Next.js slikovnega predpomnilnika.
- Obstoječe skrbniške slike in njihove vsebine ostajajo ohranjene. Public registration je blokiran s pripravljenim middleware in obstoječim bootstrapom; lokalni CMS skrbniki se prijavljajo kot prej.
- Dinamične novice (3), pretekli dogodki (2) in ponudbe (2) so v brskalniku ustrezali dejanskim odgovorom Strapi; vseh 7 pripadajočih CMS slik je bilo dostopnih. Prvotni hero/video, popravljena slika cerkve, panorama in vir CMS vsebin so ohranjeni. Nobenih Vercel ali Cloud sprememb.

Pred spremembo je bila preverjena varnostna kopija:
`/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-guestbook-photo-20261025_122639`.
Vseh 62 tabel in njihove vrstice so se ujemale po obnovi v **novo prazno** verifikacijsko bazo. Preverjeni so bili SHA-256 vseh 29 obstoječih datotek upload mape. Funkcija je bila najprej preverjena na dodatni ločeni obnovljeni bazi in ločenem uploads volumnu. Aktivna lokalna baza ni bila uvožena, ponastavljena ali nadomeščena; Strapi je dodal povezavo za neobvezno sliko. Končno preverjanje potrjuje, da so vse prvotne vrstice vsebinskih tabel in vseh 29 prvotnih datotek nespremenjene. Dodana sta le označena testna zapisa in njune izvirne/pomanjšane slike.

Aktivni lokalni sliki:
- frontend `urslja-gora-frontend-dynamic:20261025-guestbook-photo`
- backend `urslja-gora-backend-test-strapi:20261025-guestbook-photo`

Frontend uporablja `.local-test/visual-frontend.compose.yaml`; ciljni lokalni backend `.local-test/guestbook-photo-backend.compose.yaml`. Obstoječa PostgreSQL baza in trajni uploads volumen sta ponovno uporabljena brez uvoza. Runtime skrivnosti so ohranjene v zasebni lokalni env datoteki (imenik 0700, datoteka 0600), nikoli v Docker sliki ali navodilih. Stari backend container `urslja-gora-backend-test-strapi-before-photo-20261025` je ustavljen in ohranjen za povrnitev; njegova zamenjava nazaj zahteva usklajeno prekinitev novega backend containerja in preverjanje povezav, nikoli brisanja/importa baze. Ne zaganjajte starega in novega backend containerja hkrati.

Zagon že obstoječih storitev: `.local-test/start-local-site.sh` (preverjeno; ne inicializira ali uvaža baze). Ne zaganjajte produkcijskih Compose konfiguracij proti tej lokalni bazi. Dokazi, skripte in zaslonske slike so zasebno shranjeni v `.local-test/guestbook-photo-20261025/`. Dodatni izolirani testni backend je po preverjanju ustavljen, njegove podatkovne kopije pa ohranjene. Lokalna stran in CMS ostajata zagnana. To je lokalno preverjanje funkcije; javna namestitev ni bila izvedena.
