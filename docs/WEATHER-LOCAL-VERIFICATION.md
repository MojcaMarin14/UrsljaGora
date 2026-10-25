# Vreme — lokalni popravek, 25. 10. 2026

Delujoči lokalni prikaz: https://site.localhost:8443/vreme. Vercel, Cloud, originalni projekt, baza in mediji niso bili spreminjani. Nove vremenske funkcije ne uporabljajo Strapi in ne dodajajo CMS zahtevkov. Lokalna pošta ostaja izključno v obstoječem testnem predalu; nobenega sporočila nismo oddali.

## Popravljeno

- Napoved uporablja koordinate PZS za Dom na Uršlji gori: 46.48471873, 14.96506219 in izrecno višino 1680 m. Vrh 1699 m je druga referenca; oznake drugod na strani ostajajo nespremenjene. API ne uporablja več napačne samodejne višine 1448 m.
- Velika temperatura je trenutna modelska napoved z uro, ne dnevni maksimum ali meritev na postaji. Če trenutnega podatka ni, se dnevni maksimum jasno označi z »Danes največ«. Ponoči se pri jasnem vremenu prikaže luna.
- Dnevne statistike: minimum, maksimum, skupne padavine v mm, nov sneg v cm, največji veter in sunki v km/h. Nov sneg ni višina obstoječe snežne odeje. Dnevni simbol predstavlja najizrazitejše stanje dneva, ne stalnega vremena skozi cel dan.
- Posebne oznake za nevihte, točo, rosenje/dež, ki zmrzuje, in snežna zrna. Animacije ostajajo v obstoječem videzu in so deterministične, brez Math.random ob renderiranju.
- Datumi se ne pretvarjajo v obiskovalčev časovni pas; ure so iz slovenske napovedi. Ni več potrjene napake React pri obiskovalcu iz Amerike.
- Povezani so obstoječi razredi za vreme; pod 769 px se panela zložita navpično. Dnevi in urni graf se pomikajo vodoravno znotraj svojih območij. Stran se pomika navpično in ne odreže podatkov.
- Validacija odziva prepreči lažne ničle, NaN in neskončne vrednosti ob manjkajočih podatkih. Ob neveljavnem odzivu se prikaže obstoječe sporočilo o nedosegljivi napovedi.
- Veljavna napoved je predpomnjena za 1800 sekund tudi ob dinamični strani. Preklop dneva ne zahteva novega klica ponudnika. Nov koledarski dan uporablja svoj ključ. Napake se ne shranijo kot prazna napoved; podatki, pridobljeni pred več kot eno uro, se ob daljšem izpadu ne prikazujejo kot trenutni.

## Preverjeno

Šest testov v Node 22 je preverilo lokacijo, višino, enote, izbiro ponudnikovega naslova, odsotnost ključa v javnih podatkih, neveljavne/manjkajoče podatke, WMO oznake in datume v petih časovnih pasovih. Produkcijska gradnja in TypeScript sta uspešna.

Končna delujoča lokalna izdaja je bila v brskalniku preverjena pri 1440, 390, 320 in 768 px ter v časovnem pasu America/Los_Angeles. Preverjenih je vseh sedem dni, trenutna napoved, veter, sunki, vidnost grafa in odsotnost vodoravnega prelivanja cele strani ter JavaScript napak.

Ločeni testni vsebniki so preverili nevihte, ledeni dež, nočno ikono, manjkajoče meritve, prazni graf in ponudnikov odziv 503. Vzorčni podatki niso bili zapisani v CMS ali uporabljeni na delujoči strani. Ponavljajoče odpiranje testnih strani je povzročilo en ponudnikov klic; neuspešna klica sta se ponovila, kar potrdi, da napaka ni predpomnjena. V ločenem končnem kandidatu je bil umetno postaran samo začasni cache: po ponovnem nalaganju cache je stran zavrnila dve uri stare podatke.

Preverjene so še 3 novice, 2 pretekla dogodka, 2 ponudbi in njihove slike iz dejanskega CMS, ohranjena naslovna slika videa in popravljena slika O nas. Frontend vrne 200, Strapi zdravje 204, kontaktni GET pa available=true in localTest=true.

Dokazila: ../.local-test/weather-fix-20261025/. Posnetki: active-mobile.png, active-desktop.png. Source testi: tests/weather.test.cjs. Ponovni zagon uporablja obstoječi .local-test/start-local-site.sh, posodobljen na vremensko izdajo. Ne inicializira ali uvaža baze.

## Pred javno objavo ostaja odprt vir podatkov

Lokalna priprava uporablja brezplačni Open-Meteo za razvoj in preizkus. Ponudnik brezplačni API omejuje na nekomercialno uporabo; naročnina ni bila kupljena ali aktivirana. Za javno komercialno stran moramo posebej potrditi ustrezen vir oziroma licenco. Morebitna naročnina ni vključena v okvirni infrastrukturni proračun 20 EUR/mesec.

Pripravljen je neobvezen strežniški WEATHER_API_KEY: ob nastavitvi uporablja customer-api.open-meteo.com. Ključ se ne vnaša v NEXT_PUBLIC_ spremenljivko, ne izpisuje in ne posreduje brskalniku. deploy/compose.yaml ga posreduje samo frontendu; sedanja lokalna nastavitev ga nima. To ni odobritev za naročnino ali javno objavo. Alternativen ponudnik zahteva ločeno preverjanje podatkov in pogojev.

## Lokalni prostor in povrnitev

Polna gradnja je naletela na skoraj poln 40 GB Docker disk (okoli 485 MB prostega ob preverjanju). Nobenih baz, medijev, prejšnjih slik ali kopij nismo brisali. Gradnja je nato uporabila obstoječi Node 22 in odvisnosti, izhod pa nov začasni prostor računalnika. Predhodne in nove sledenje odvisnosti so bile primerjane: spremenjenih datotek odvisnosti je 0. Končna lokalna slika ponovno uporabi originalne medije in doda približno 5,4 MB novega runtime izhoda. Pred nadaljnjimi večjimi gradnjami je treba urediti prostor; čiščenje podatkov ni bilo izvedeno ali odobreno.

Prejšnja delujoča slika 20261025-contact-working-final ostaja shranjena. Za povrnitev lokalnega prikaza vzdrževalec povrne njen tag v .local-test/visual-frontend.compose.yaml in start-local-site.sh ter ponovno zažene samo frontend-smoke z --no-deps; CMS in volumenov ne spreminja. Preverjena varnostna kopija spremenjenih datotek je zapisana v applied-backup.json; dodatno je shranjena prejšnja zagonska skripta. To ni nadomestilo za podatkovne kopije pred bodočo selitvijo.

Viri: https://pzs.si/koce/74/ in https://mail.pzs.si/koce.php?pid=74 ; https://open-meteo.com/en/docs ; https://open-meteo.com/en/pricing .
