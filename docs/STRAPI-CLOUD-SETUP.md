# Povezava Vercel + Strapi Cloud

Stanje priprave: 26. oktober 2026. Izbrana možnost je obstoječi Vercel frontend in nov Strapi Cloud CMS. Nobena nova naročnina ni vključena in nov javni CMS še ni ustvarjen. Izbrisani Cloud ni dosegljiv; koda sama ne more obnoviti podatkov, ki so obstajali samo tam. Lokalna obnovljena vsebina ostaja ohranjena.

## Preverjeno lokalno

- Sveža kopija PostgreSQL je bila obnovljena v novo ločeno bazo: vseh 62 tabel in vrstice so se ujemale. Preverjene so tudi izvorne datoteke, SQLite in mediji. Izvirnega projekta in baze priprava ne spreminja.
- Čisti zasebni izvoz ohranja 3 objavljene novice, 2 dogodka, 2 ponudbi, članek, pravo pohvalo, odobreno fotografijo na mapi in lastničine neobjavljene slike. Vse prave objave so ohranjene. Izločeni so samo jasno označeni agentovi preizkusi in izključno z njimi povezane testne slike; polna kopija jih ohranja.
- Uvoz v novo prazno testno bazo je uspel; prvi zasebni administrator se je ohranil. Vseh 38 slikovnih datotek se po hashih ujema z izvozom. API in vsebina se ujemata, prijava in objava nove novice v brskalniku delujeta, objavi dogodka in ponudbe prek avtenticiranega uredniškega API prav tako.
- Javna registracija je izključena. Neodobrene fotografije in različice lokalno vrnejo 404. To še ni dokaz zasebnosti na pravem Cloud CDN.
- Node 24: čista namestitev iz lockfile, Strapi/admin gradnja in 10 varnostnih/konfiguracijskih testov so uspešni. Popravki odvisnosti so preverjeni s temi testi in delujočim CMS. Audit ni brez opozoril: 11 high, 9 moderate, 0 critical. Številke vključujejo podedovane vnose, ne 11 ločenih napak.

## Kaj je še odprto

Preostala Zod 3 izvoda v koa-body in koa-session preverjata razvojne konfiguracijske možnosti ob zagonu; ne gre za Zod 3 na HTTP podatkih aplikacije. Strapi uporablja popravljeni Zod 4. React Router 6 in stream-json ostajata označena: administrator deluje kot SPA, uvoz pa je dovoljen samo za zaupanja vredno pregledano kopijo. Vsiljen večji semantično nezdružljiv popravek ni uporabljen. Po prihodnjih posodobitvah je potreben ponoven pregled.

Cloudov CDN lahko obide aplikacijsko zaščito slik. `CLOUD_COMMUNITY_MEDIA_VERIFIED=false` zato privzeto blokira novo anonimno nalaganje slik in foto prispevke, vključno z multipart pohvalami, pred branjem datoteke. Besedilne pohvale in uredniške slike niso s tem izključene. Ne uvažaj neodobrenih lastničinih slik v javni Cloud, dokler ni preverjeno, da ne bodo postale javno dostopne. Polni preverjeni izvoz je zaseben. Ob potrebi uporabi ločen pregledan začetni izvoz samo z javnimi slikami, ne spreminjaj polne kopije in ne izgubi neobjavljenih fotografij.

Kontakt za pravo pošiljanje še potrebuje preverjeno SMTP nastavitev in nova veljavna Turnstile ključa. Stari zasebni ključ, ki je bil v Git zgodovini, je treba zamenjati. Ne vklopi lokalnega Mailpit načina v produkciji. Med preverjanjem ne pošiljaj sporočil resničnemu prejemniku. Pred komercialno uporabo vremenskih podatkov uredi tudi dovoljeni vir oziroma licenco.

## Ustvarjanje projekta po potrditvi naročnine

1. Na https://cloud.strapi.io odpri **Create project**. Uporabi obstoječo aplikacijo iz GitHuba, ne vzorčnega CMS. Strapi Cloud Starter je po ceniku 35 USD na projekt mesečno brez davkov; obseg in končni znesek preveri pri plačilu. Brez izrecne potrditve ne potrjuj nakupa. Paket nima vključenih samodejnih kopij in se ob neaktivnosti uspava.
2. Repozitorij: `MojcaMarin14/UrsljaGora`; veja: `main`; **Base directory: `cms/urslja-gora-cms`**. Regija: **AMS**, če je na voljo. Node: **24**. Namestitev: `npm ci`; gradnja: `npm run build`; zagon: `npm start`. Frontend v korenu še naprej uporablja Node 22.
3. Pred prvim zagonom v zasebnih Cloud variables nastavi `CLOUD_BOOTSTRAP_ADMIN_EMAIL` in močno novo `CLOUD_BOOTSTRAP_ADMIN_PASSWORD` (20–128 znakov), po želji ime in priimek. Nikoli ne uporabi testnih prijavnih podatkov. Aplikacija za novo prazno bazo brez zasebnega prvega administratorja zavrne zagon; obstoječih računov ne prepiše. Po uspešnem prvem zagonu iz zasebnih nastavitev odstrani bootstrap geslo in preveri ponovni zagon.
4. `CORS_ORIGINS=https://urslja-gora.vercel.app`, `TRUST_PROXY=true`, `CLOUD_TRANSFER_ENABLED=false`, `CLOUD_COMMUNITY_MEDIA_VERIFIED=false`. `PUBLIC_URL` izpusti, dokler ne poznaš dejanskega novega HTTPS URL, nato ga po potrebi nastavi točno nanj. Bazo in aplikacijske skrivnosti prepusti novemu Cloudu; ne prekopiraj lokalnih ključev, SMTP ali Docker naslovov.
5. Preveri zasebno prijavo in `/_health`; potrdi, da vsebinske zbirke novega projekta vsebujejo 0 zapisov. Pred vsakim uvozom naredi in preveri kopijo cilja. Nikoli ne uvažaj prek obstoječe vsebine brez nove izrecne odobritve.
6. Preveri CDN zasebnost na izključno umetni testni sliki brez osebnih podatkov: original, vse različice, neodobreno stanje, odobritev, ponovna zavrnitev in predpomnilnik. Test ne sme javno razkriti obstoječih zasebnih slik. Dokler ta pogoj ni izpolnjen, foto prispevki ostanejo izključeni in zasebne slike se ne prenesejo na javno shrambo.
7. Za obnovo uporabi pregledani zasebni izvoz, ne datoteke `data/data.json` ali seed ukaza. Oddaljeni transfer omogoči samo začasno za potrjeni prenos v preverjen prazen cilj ter ga po koncu izključi in prekliči prenosni žeton. Ohranitev prvega administratorja in izvoz/uvoz sta lokalno preverjena; pravi Cloud prenos se preveri na dejanskem novem projektu.
8. Preveri 3/2/2 prave objave, povezave/slike, osnutke, javne read pravice, prepoved javnega update/delete in registracije, moderacijo pohval ter upravljanje medijev. Ne prenašaj testnih objav iz baze za testiranje uvoza.

## Povezava obstoječega Vercela

Šele ko novi CMS deluje in je vsebina preverjena, shrani prejšnjo konfiguracijo za povrnitev in spremeni **samo** `NEXT_PUBLIC_STRAPI_URL` na dejanski HTTPS origin novega CMS, brez `/api` in brez `/admin`. Ne uporabljaj starega izbrisanega Clouda, Railway naslova ali localhost. `STRAPI_INTERNAL_URL` izpusti; `ALLOW_PRIVATE_CMS_IMAGES` naj bo false oziroma izpuščen. Za poznejšo lastno domeno nastavi `NEXT_PUBLIC_SITE_URL` na njen pravi HTTPS origin in ga dodaj v Cloud CORS.

Ponovno zgradi obstoječi Vercel projekt `urslja-gora` iz iste veje main. Ne ustvarjaj nadomestnega dizajna ali vzorčnih novic. Vercelov paket ostane nespremenjen po odločitvi lastnice; povezava s CMS ne zahteva nadgradnje paketa. To ne spreminja Vercelovih pogojev komercialne uporabe.

Po objavi v brskalniku preveri domačo stran, novice, dogodke, ponudbe in slike na računalniku in telefonu. Ustvari resnično želen osnutek v CMS; preveri, da ni javen, nato ga objavi in preveri njegov pojav na strani. Za test ne pošiljaj resnične e-pošte in ne spreminjaj obstoječih objav. Če povezava ne uspe, povrni prejšnjo Vercel konfiguracijo in izdajo; ne posegaj v baze.

## Kopije in predaja lastniku

Starter nima vključenih samodejnih Cloud kopij. Pred objavo določi odgovorno osebo ter redno izvažanje celotne vsebine in medijev v šifrirano kopijo zunaj ponudnika. Geslo oziroma ključ hrani ločeno in varno. Git vsebuje kodo, ne objav in slik iz CMS. Kopija, ki obstaja samo na istem računalniku ali v isti Cloud storitvi, ni zadostna zaščita.

Preizkušena lokalna obnova iz zasebnega izvoza ni nadomestilo za še nenastavljen redni oddaljeni backup novega Clouda. Najprej preveri avtomatizacijo, obvestilo ob neuspehu, ohranjanje različic ter obnovo na praznem ločenem cilju. Gesel, ključev ali obnovitvenih kod ne objavljaj v Git ali navadnem dokumentu.

Za vsakdanjo uporabo bo lastnik odprl **novi Cloud URL + `/admin`**, se prijavil s svojim osebnim računom, v Content Manager izbral Novice, Dogodki ali Ponudbe, uredil vsebino in kliknil Save ter Publish. Za to ne potrebuje GitHuba ali Vercelovega računa. Pri predaji ločeno uredi lastništvo gostovanja, plačil, domene in kopij; ne deli glavnega osebnega administratorskega računa. Geslo spremeni ob predaji in shrani obnovitvene možnosti.

## Uradni viri

- [Cloud objava in podmapa repozitorija](https://docs.strapi.io/cloud/getting-started/deployment)
- [Obvezna produkcijska konfiguracija middleware](https://docs.strapi.io/cloud/advanced/middlewares)
- [Cloud mediji in provider](https://docs.strapi.io/cloud/advanced/upload)
- [Strapi Cloud cene, omejitve in kopije](https://strapi.io/pricing-cloud)
