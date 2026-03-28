export const metadata = {
  title: "Politika zasebnosti – Uršlja Gora",
  description: "Politika zasebnosti spletne strani Uršlja Gora."
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-6 pt-32 pb-20 space-y-10 text-[var(--foreground)]">

      <h1 className="text-4xl font-bold">Politika zasebnosti</h1>

      <p>
        Ta politika zasebnosti opisuje, kako spletna stran <strong>Uršlja Gora</strong> 
        zbira, uporablja in varuje osebne podatke obiskovalcev. Z uporabo spletne strani 
        se strinjate s pogoji te politike.
      </p>

      <section>
        <h2 className="text-2xl font-semibold mb-2">1. Upravljavec osebnih podatkov</h2>
        <p>
          Upravljavec osebnih podatkov je:
          <br />
          <strong>Dom na Uršlji gori</strong>
          <br />
          Uršlja gora (Plešivec), Slovenija
          <br />
          Telefon: 02 87 0 48 20
          <br />
          E‑pošta: info@ursljagora.si
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">2. Katere podatke zbiramo</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>tehnične podatke (IP naslov, brskalnik, čas obiska, ogledane strani),</li>
          <li>kontaktne podatke, če uporabnik izpolni obrazec (ime, e‑pošta, telefon),</li>
          <li>piškotke, ki so potrebni za delovanje strani in analitiko.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">3. Namen obdelave podatkov</h2>
        <ul className="list-disc ml-6 space-y-1">
          <li>zagotavljanje pravilnega delovanja spletne strani,</li>
          <li>izboljšanje uporabniške izkušnje,</li>
          <li>odgovarjanje na povpraševanja,</li>
          <li>statistična analiza obiska (če je omogočena).</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">4. Pravna podlaga</h2>
        <p>
          Podatke obdelujemo na podlagi zakonitega interesa, privolitve uporabnika 
          (piškotki, obrazci) ali pogodbenega razmerja v primeru povpraševanj.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">5. Hramba podatkov</h2>
        <p>
          Podatki se hranijo le toliko časa, kot je potrebno za izpolnitev namena:
        </p>
        <ul className="list-disc ml-6 space-y-1">
          <li>kontaktni podatki: do zaključka komunikacije,</li>
          <li>analitični podatki: skladno s politiko ponudnika,</li>
          <li>tehnični podatki: kratkotrajno za varnost in delovanje strežnika.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">6. Posredovanje podatkov</h2>
        <p>
          Podatki se lahko posredujejo ponudnikom gostovanja, analitike ali drugim 
          pogodbenim partnerjem, ki zagotavljajo delovanje strani. Podatkov ne 
          posredujemo nepooblaščenim osebam in jih ne prodajamo.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">7. Pravice uporabnikov</h2>
        <p>Uporabniki imajo pravico do:</p>
        <ul className="list-disc ml-6 space-y-1">
          <li>dostopa do svojih podatkov,</li>
          <li>popravka ali izbrisa,</li>
          <li>omejitve obdelave,</li>
          <li>ugovora,</li>
          <li>prenosa podatkov,</li>
          <li>preklica privolitve.</li>
        </ul>
        <p>
          Zahtevo lahko pošljete na e‑poštni naslov upravljavca.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">8. Piškotki</h2>
        <p>
          Spletna stran uporablja osnovne piškotke za delovanje. Če je omogočena 
          analitika, se uporabljajo tudi analitični piškotki (npr. Google Analytics). 
          Uporabnik lahko piškotke upravlja ali izbriše v nastavitvah brskalnika.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">9. Varnost podatkov</h2>
        <p>
          Podatki so zaščiteni z ustreznimi tehničnimi in organizacijskimi ukrepi, 
          ki preprečujejo izgubo, zlorabo ali nepooblaščen dostop.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">10. Spremembe politike zasebnosti</h2>
        <p>
          Politika zasebnosti se lahko občasno posodobi. Zadnja posodobitev: 
          <strong> marec 2026</strong>.
        </p>
      </section>
<section>
  <h2 className="text-2xl font-semibold mb-2">10.1 Dodatne informacije</h2>
  <p>
    Za vsa dodatna vprašanja v zvezi z varstvom osebnih podatkov, uporabo spletne
    strani ali uveljavljanjem vaših pravic se lahko obrnete na upravljavca preko
    e‑pošte ali telefona. Odgovor boste prejeli v najkrajšem možnem času, najkasneje
    pa v roku 30 dni od prejema zahteve.
  </p>
  <p className="mt-2">
    Če menite, da je prišlo do kršitve varstva osebnih podatkov, lahko vložite
    pritožbo pri:
    <br />
    <strong>Informacijskem pooblaščencu Republike Slovenije</strong>
    <br />
    Dunajska cesta 22, 1000 Ljubljana
    <br />
    www.ip-rs.si
  </p>
</section>

    </main>
  );
}
