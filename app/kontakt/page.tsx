export default function KontaktPage() {
  return (
    <main className="w-full">

    {/* HERO BLOK – svetlo modra barva */}
<section className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden 
  bg-gradient-to-br from-blue-200 via-blue-300 to-blue-400">

  <div className="absolute inset-0 bg-black/10"></div>

  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
    <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
      Kontakt
    </h1>
    <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
      Vse informacije o koči, dostopu in turističnih dejavnostih.
    </p>
  </div>
</section>


      {/* SEKCIJA 1 — DOM NA URŠLJI GORI */}
      <section className="relative w-full h-screen bg-[#e8f7e1] flex items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
            Dom na Uršlji gori (Plešivec)
          </h2>

          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>Telefon:</strong> 02 87 0 48 20
          </p>
          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>Mobilni telefon:</strong> 041 743 442
          </p>
          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>E‑pošta:</strong>{" "}
            <a href="mailto:info@ursljagora.si" className="text-[var(--text-link)] hover:underline">
              info@ursljagora.si
            </a>
          </p>
          <p className="text-[var(--text-main)] text-xl">
            <strong>Naslov:</strong> Jazbina 19, 2393 Črna na Koroškem
          </p>
        </div>
      </section>

      {/* SEKCIJA 2 — PZS */}
      <section className="relative w-full h-screen bg-[#ffe9d6] flex items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
            Planinska koča – PZS
          </h2>

          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>Telefon:</strong> 041 685 555
          </p>
          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>Kontaktna oseba:</strong> Sonja
          </p>
          <p className="text-[var(--text-main)] text-xl">
            <a
              href="https://pzs.si/koce/74/"
              target="_blank"
              className="text-[var(--text-link)] hover:underline"
            >
              Dom na Uršlji gori – PZS spletna stran →
            </a>
          </p>
        </div>
      </section>

      {/* SEKCIJA 3 — TIC */}
      <section className="relative w-full h-screen bg-[#d9eaff] flex items-center justify-center px-6">
        <div className="bg-white/80 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
          <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
            TIC Črna na Koroškem
          </h2>

          <p className="text-[var(--text-main)] text-xl mb-3">
            <strong>Delovni čas:</strong>
          </p>
          <ul className="text-[var(--text-main)] text-xl ml-4 mb-6 list-disc">
            <li>Ponedeljek–petek: 9.00–16.00</li>
            <li>Vikendi: prilagojeno glede na dejavnosti</li>
          </ul>

          <a
            href="https://www.visit-crna.si/objava/257019"
            target="_blank"
            className="text-[var(--text-link)] text-xl hover:underline"
          >
            Visit Črna na Koroškem →
          </a>
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
