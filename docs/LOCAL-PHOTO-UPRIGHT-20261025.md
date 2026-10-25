# Gumb za fotografijo in orientacija — 25. 10. 2026

Pri »Dodaj pohvalo« kliknite **+ Dodaj fotografijo**. Odpre se običajna izbira fotografije. Ob izbrani sliki se gumb preimenuje v **Zamenjaj fotografijo**; **Odstrani fotografijo** omogoča oddajo brez slike. Omejitve ostajajo ena slika do 5 MB, JPG/PNG/WebP/AVIF; objava zahteva skrbniško odobritev. Osvežite https://site.localhost:8443/ s Command–Shift–R.

Nove fotografije z EXIF orientacijo se pred shranjevanjem fizično obrnejo/zrcalijo v pravilno smer. Orientacijska oznaka se nato odstrani, da je brskalnik ne uporabi drugič. Popravek se izvede pred izdelavo Strapi pomanjšav, neodvisno od nastavitev optimizacije v Media Library. Fotografije z orientacijo 1 ali brez orientacijske oznake ostanejo v tem koraku nespremenjene. Uporabljena je že nameščena knjižnica Sharp; ni novih odvisnosti ali sprememb sheme. Obstoječe naložene datoteke se ne obdelujejo ponovno. Iz podatkov brez orientacijske oznake ni mogoče zanesljivo ugotoviti, ali je fotografija že fizično posneta obrnjeno.

Preverjeno:
- Prevajanje frontend in backend TypeScript je uspešno.
- Na novi, ločeni bazi, obnovljeni iz sveže preverjene kopije, so bili preverjeni vsi EXIF položaji 1–8, vključno z zrcaljenjem in zasukom za 180°. Shranjeni izvirniki in vse pomanjšave se po dimenzijah in primerjavi pikslov ujemajo s pravilno orientacijo. Vsi testni zapisi ostajajo neodobreni.
- Chrome 1440×1000 in 390×844: viden plus, odpiranje dejanske izbire datoteke, upravljanje s tipkovnico, zamenjava/odstranitev ter predogledi za vseh osem orientacij, ki se ujemajo s shranjenimi datotekami.
- Ena nova jasno označena pohvala »LOKALNI PREIZKUS ORIENTACIJE« je bila oddana prek aktivne lokalne strani, ostaja neodobrena. Slika je pravilno obrnjena in dostopna samo prek skrbniškega predogleda; javna pohvala in neposredna slika vrneta 404. Test ni pristna pohvala.
- Novice, pretekli dogodki, ponudbe in pripadajoče slike se še naprej ujemajo z dejanskimi CMS odgovori. Preverjeni hero/poster, slika cerkve in panorama so ohranjeni.
- Vse prvotne vrstice tabel novicas/dogodkis/ponudbes/articles/pohvalas in vseh 44 obstoječih upload datotek so nespremenjene. Ni uvoza, ponastavitve ali nadomestitve aktivne lokalne baze.

Sveža varnostna kopija pred spremembo:
`/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/backups/before-photo-upright-20261025_125658`.
Vseh 62 tabel in njihove vrstice so se po obnovi v novo prazno verifikacijsko bazo ujemale; preverjeni so tudi SHA-256 upload datotek in arhiv izvornih datotek. Nadaljnji preizkus je uporabil še eno novo prazno obnovljeno bazo in ločen uploads volumen; ta testni backend je po preverjanju ustavljen, njegove kopije so ohranjene.

Aktivni sliki: `urslja-gora-frontend-dynamic:20261025-photo-upright` in `urslja-gora-backend-test-strapi:20261025-photo-upright`. Backend uporablja obstoječi `.local-test/guestbook-photo-backend.compose.yaml`, zdaj s Compose projektom **urslja-gora-photo-upright**; frontend ostaja v projektu urslja-gora-visual. Predhodni backend container `urslja-gora-backend-test-strapi-before-upright-20261025` je ustavljen in ohranjen za povrnitev, prav tako prejšnje slike. Ne zaganjajte prejšnjega in sedanjega backend containerja hkrati. Lokalni `.local-test/start-local-site.sh` uporablja novo sliko frontenda in ohranja obstoječi CMS/bazo. Zasebne runtime skrivnosti ostajajo v obstoječi zaščiteni env datoteki.

Dokazi in zaslonske slike: `.local-test/photo-upright-20261025/`. Lokalna stran in CMS ostajata zagnana. Vercel, Strapi Cloud in originalni projekt so nespremenjeni.
