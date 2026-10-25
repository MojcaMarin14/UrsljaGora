# Lokalni ogled spletne strani

Spletna stran: https://site.localhost:8443/

Urejanje vsebin v Strapi: https://cms.localhost:8443/admin

1. Odprite spletno stran v brskalniku. Če vidite star videz, pritisnite Command + Shift + R.
2. Preverite novice, dogodke in ponudbe pod »Aktualno«. Oba obnovljena dogodka sta pretekla: izberite »Pretekli dogodki«.
3. Preverite fotografije, meni na telefonu ter svetlo in temno temo. V panoramski galeriji so prvotna imena in delujoče fotografije koče, po vaši izbiri.
4. Za urejanje vsebin odprite Strapi in uporabite že pripravljeno lokalno skrbniško prijavo. Gesla niso vključena v to poročilo.
5. Če lokalna storitev po ponovnem zagonu računalnika ne deluje, v Terminalu zaženite:

```sh
/Users/mojcamarin/Developer/urslja-gora-selfhost-20261011/project/.local-test/start-local-site.sh
```

Naslova delujeta samo na tem računalniku. Lokalno potrdilo HTTPS je samopodpisano; če brskalnik pokaže opozorilo, preverite točen naslov. Ta postopek ne namesti sistemskega zaupanja potrdilu.

Primerjava s posnetki Vercel je v `visual-comparison-20261015/index.html`. Tehnične ugotovitve in popis sprememb so v `VISUAL-RECOVERY-REPORT.md`.

Vercel, Strapi Cloud in izvorna mapa projekta niso spremenjeni. Lokalno urejanje vsebin ne posodobi strani Vercel. Javni prenos na Hetzner še ni izveden.
