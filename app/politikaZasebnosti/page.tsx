import Footer from "@/app/components/Footer";

const GOLD = "#c9a96e";
const DARK = "#111008";

export default function ZasebnostPage() {
  return (
    <main style={{ width: "100%", backgroundColor: "#f7f4ef", minHeight: "100vh" }}>

      {/* HERO */}
      <section style={{
        background: DARK, padding: "120px 24px 80px",
        textAlign: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.5)" }} />
          <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.8)", fontWeight: 500 }}>
            Uršlja gora · Koroška
          </span>
          <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.5)" }} />
        </div>
        <h1 style={{
          fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 500,
          color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
        }}>
          Politika <span style={{ color: GOLD }}>zasebnosti</span>
        </h1>
      </section>

      {/* VSEBINA */}
      <section style={{ padding: "72px 24px 100px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "flex", flexDirection: "column", gap: 40 }}>

          <Block title="1. Upravljavec osebnih podatkov">
            <p>Upravljavec osebnih podatkov je <strong>Planinsko društvo Prevalje</strong>, ki upravlja Dom na Uršlji gori.</p>
            <p>Kontakt: <a href="mailto:info@ursljagora.si" style={{ color: GOLD }}>info@ursljagora.si</a></p>
          </Block>

          <Block title="2. Kateri osebni podatki se zbirajo">
            <p>Na tej spletni strani zbiramo naslednje osebne podatke:</p>
            <ul>
              <li><strong>Kontaktni obrazec:</strong> ime in priimek, e-poštni naslov, vsebina sporočila</li>
              <li><strong>Piškotki:</strong> tehnični piškotki za delovanje strani (seja, preferences)</li>
            </ul>
          </Block>

          <Block title="3. Namen zbiranja podatkov">
            <p>Osebne podatke zbiramo izključno z naslednjimi nameni:</p>
            <ul>
              <li>Odgovor na vaše povpraševanje ali sporočilo prek kontaktnega obrazca</li>
              <li>Zagotavljanje tehničnega delovanja spletne strani</li>
            </ul>
            <p>Vaših podatkov ne posredujemo tretjim osebam in jih ne uporabljamo za trženje.</p>
          </Block>

          <Block title="4. Piškotki">
            <p>Spletna stran uporablja tehnične piškotke, ki so nujno potrebni za delovanje strani. Ob prvem obisku vas o tem obvestimo in pridobimo vaše soglasje.</p>
            <p>Piškotki se shranijo v vaš brskalnik in se samodejno izbrišejo po izteku veljavnosti (največ 12 mesecev).</p>
          </Block>

          <Block title="5. Čas hrambe podatkov">
            <p>Podatke, ki jih prejmemo prek kontaktnega obrazca, hranimo največ <strong>12 mesecev</strong> od prejema sporočila, razen če je potrebno daljše hranjenje iz zakonskih razlogov.</p>
          </Block>

          <Block title="6. Vaše pravice">
            <p>V skladu z Uredbo GDPR imate naslednje pravice:</p>
            <ul>
              <li><strong>Pravica do dostopa</strong> — vpogleda v svoje podatke</li>
              <li><strong>Pravica do popravka</strong> — popravka netočnih podatkov</li>
              <li><strong>Pravica do izbrisa</strong> — izbrisa vaših podatkov</li>
              <li><strong>Pravica do preklica soglasja</strong> — kadarkoli brez posledic</li>
              <li><strong>Pravica do pritožbe</strong> — pri Informacijskem pooblaščencu RS</li>
            </ul>
            <p>
              Za uveljavljanje pravic nas kontaktirajte na{" "}
              <a href="mailto:info@ursljagora.si" style={{ color: GOLD }}>info@ursljagora.si</a>.
            </p>
          </Block>

          <Block title="7. Kontakt Informacijskega pooblaščenca">
            <p>
              Če menite, da vaši podatki niso obdelani v skladu z zakonom, se lahko pritožite pri{" "}
              <a href="https://www.ip-rs.si" target="_blank" rel="noopener noreferrer" style={{ color: GOLD }}>
                Informacijskem pooblaščencu RS (ip-rs.si)
              </a>.
            </p>
          </Block>

          <p style={{ fontSize: 13, color: "rgba(17,16,8,0.4)", marginTop: 8 }}>
            Dokument je bil nazadnje posodobljen: april 2026
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: "white", borderRadius: 16,
      padding: "32px 36px",
      border: "1px solid rgba(17,16,8,0.07)",
    }}>
      <h2 style={{
        fontSize: 20, fontWeight: 600, color: DARK,
        letterSpacing: "-0.01em", marginBottom: 16,
        borderLeft: `3px solid ${GOLD}`, paddingLeft: 14,
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: 15, color: "rgba(17,16,8,0.65)",
        lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 10,
      }}>
        {children}
      </div>
    </div>
  );
}