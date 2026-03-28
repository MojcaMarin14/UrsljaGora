export default function KontaktPage() {
  return (
    <main className="w-full">

      {/* HERO */}
      <section className="relative w-full h-[55vh] md:h-[70vh] overflow-hidden bg-[var(--brand-light)]">
        <div className="absolute inset-0 bg-black/20"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
          <h1 className="text-5xl md:text-6xl font-semibold text-white drop-shadow-xl tracking-tight">
            Kontakt
          </h1>
          <p className="mt-4 text-lg md:text-2xl text-white/90 max-w-2xl drop-shadow">
            Informacije o koči, dostopu in turističnih dejavnostih na Uršlji gori.
          </p>
        </div>
      </section>

      {/* CONTENT WRAPPER */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-20">

          {/* DOM NA URŠLJI GORI */}
          <div className="bg-white rounded-3xl shadow-lg border border-black/5 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-heading)] mb-8 tracking-tight">
              Dom na Uršlji gori (Plešivec)
            </h2>

            <div className="space-y-4 text-[var(--text-main)] text-lg">
              <p><strong>Telefon:</strong> 02 87 0 48 20</p>
              <p><strong>Mobilni telefon:</strong> 041 743 442</p>
              <p>
                <strong>E‑pošta:</strong>{" "}
                <a href="mailto:info@ursljagora.si" className="text-[var(--brand)] hover:underline">
                  info@ursljagora.si
                </a>
              </p>
              <p><strong>Naslov:</strong> Jazbina 19, 2393 Črna na Koroškem</p>
            </div>
          </div>

          {/* PZS */}
          <div className="bg-white rounded-3xl shadow-lg border border-black/5 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-heading)] mb-8 tracking-tight">
              Planinska koča – PZS
            </h2>

            <div className="space-y-4 text-[var(--text-main)] text-lg">
              <p><strong>Telefon:</strong> 041 685 555</p>
              <p><strong>Kontaktna oseba:</strong> Sonja</p>
              <p>
                <a
                  href="https://pzs.si/koce/74/"
                  target="_blank"
                  className="text-[var(--brand)] hover:underline"
                >
                  Dom na Uršlji gori – PZS spletna stran →
                </a>
              </p>
            </div>
          </div>

          {/* TIC */}
          <div className="bg-white rounded-3xl shadow-lg border border-black/5 p-10 md:p-14">
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-heading)] mb-8 tracking-tight">
              TIC Črna na Koroškem
            </h2>

            <div className="space-y-4 text-[var(--text-main)] text-lg">
              <p><strong>Delovni čas:</strong></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Ponedeljek–petek: 9.00–16.00</li>
                <li>Vikendi: prilagojeno glede na dejavnosti</li>
              </ul>

              <a
                href="https://www.visit-crna.si/objava/257019"
                target="_blank"
                className="text-[var(--brand)] hover:underline"
              >
                Visit Črna na Koroškem →
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* MAPA */}
      <section className="w-full h-[400px]">
        <iframe
          className="w-full h-full border-0"
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps?q=Jazbina+19,+2393+Črna+na+Koroškem&output=embed"
        ></iframe>
      </section>

    </main>
  );
}
