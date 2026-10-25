# Kako urejati novice, dogodke in ponudbe lokalno

1. Odprite https://cms.localhost:8443/admin in se prijavite z lokalnim skrbniškim računom. Gesla niso vključena v navodila.
2. V **Content Manager** izberite pravo zbirko:
   - **Novice** za nov članek na strani Novice. Zbirka **Article** je druga zbirka in je ta spletna stran ne prikazuje.
   - **Dogodki** za dogodek. Vnesite datum; današnji in prihodnji datumi se prikažejo pod »Prihajajoči«, starejši pod »Pretekli«.
   - **Ponudbe** za ponudbo. Vnesite tudi kategorijo, ceno in datum veljavnosti, kadar ustreza.
3. Kliknite **Create new entry**, vpišite naslov in opis, izberite datum ter dodajte ali izberite sliko. Pri novici preverite tudi polje **slug** (naslov v povezavi).
4. **Save** shrani osnutek. Za prikaz na spletni strani kliknite **Publish**. Obe dejanji sta potrebni, kadar urejevalnik tako zahteva.
5. Odprite https://site.localhost:8443/ in osvežite stran. Vsebino preverite tudi pod **Aktualno → Novice / Dogodki / Ponudbe**. Ponovna gradnja aplikacije ni potrebna. Novice in ponudbe v seznamih sledijo svojemu datumu, izpostavljene kartice na začetnih straneh pa zadnji objavi.
6. Za umik objave v urejevalniku odprite **More document actions → Unpublish**. To ohrani osnutek; vsebina po osvežitvi izgine z običajne spletne strani.

V vsaki od treh zbirk je po preverjanju ostal en jasno označen osnutek **LOKALNI PREIZKUS … (ni Cloud vsebina)**. To niso obnovljene objave iz Cloud in jih ne objavljajte kot pravo vsebino. Prvotnih objav in slik nismo spreminjali ali brisali.

Obnovljene objave so iz lokalne zbirke iz marca, ne iz aktualne Strapi Cloud zbirke. Poznejše objave in slike, ki so bile samo v Cloud, potrebujemo iz ločene varnostne kopije ali izvoza; manjkajočih vsebin nismo nadomestili z izmišljenimi.

Naslova delujeta na tem računalniku. Urejanje lokalne zbirke ne posodobi produkcijske strani Vercel. Pred javnim gostovanjem je treba odpraviti v tehničnem poročilu opisani dostop API do osnutkov.

Če storitve po ponovnem zagonu računalnika ne delujejo, v Terminalu zaženite:

```sh
/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/project/.local-test/start-local-site.sh
```

Tehnično poročilo: `DYNAMIC-CONTENT-DIAGNOSIS.md`.
