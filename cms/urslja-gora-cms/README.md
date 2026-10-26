# Uršlja gora CMS

Strapi 5.59.0 za novice, dogodke, ponudbe in moderirane prispevke obiskovalcev. Frontend ostaja v korenu repozitorija na Vercelu. Izbrano gostovanje CMS je Strapi Cloud; Docker oziroma VPS nista potrebna za to možnost.

Uporabi Node 24 in obstoječi `package-lock.json`: `npm ci`, nato `npm run build` in `npm start`. Razvojni ukaz je `npm run develop`. Produkcijski zagon neposredno odpre zgrajeno aplikacijo. Ne zaganjaj `seed:example` nad obnovljeno vsebino: `data/` vsebuje stare demonstracijske podatke, ne dejanskih novic koče.

Cloud uporabi podmapo `cms/urslja-gora-cms`, vejo `main` in Node 24. Zasebne spremenljivke pripravi iz `cloud.env.example`; to je predloga brez gesel. Prazna produkcijska namestitev zahteva zasebno nastavljenega prvega administratorja pred odprtjem strežnika. Obstoječih administratorjev koda ne spreminja. Lokalni razvoj uporablja svojo zasebno konfiguracijo in obstoječo bazo; prazna nova baza ni nadomestilo za obnovo.

Datoteke `config/env/production/` so obvezne za Cloud: platforma prepiše globalno konfiguracijo middleware. Ohranijo CORS, izključeno javno registracijo, moderacijo ter omejitve nalaganja. Oddaljeni prenos in anonimno nalaganje slik sta privzeto izključena do preverjanja dejanskega ciljnega projekta. Uredniške slike in besedilne pohvale ostanejo ločene od teh omejitev.

Lokalne baze, mediji, izvozi, prijavni podatki in varnostne kopije niso del repozitorija. Git push ne obnovi podatkov. Izvoz se uvozi šele po preverjeni kopiji in potrditvi novega praznega cilja. Navodila, preverjeno stanje in odprte omejitve so v [navodilih za Cloud](../../docs/STRAPI-CLOUD-SETUP.md).

Konfiguracijski in varnostni testi: `node --test tests/cloud-config.test.cjs` na Node 24. Gradnja ter obnova iz izvoza sta bili preizkušeni v ločeni lokalni PostgreSQL bazi, ne na javnem Cloudu.
