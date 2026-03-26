export default function ONasPage() {
  return (
    <main className="w-full">

      {/* HERO */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
           src="/onas-hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="O nas"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-6xl font-bold drop-shadow-lg">O nas</h1>
          <p className="mt-4 text-2xl max-w-2xl drop-shadow-lg">
            Spoznajte zgodbo, tradicijo in posebnosti Uršlje gore.
          </p>
        </div>
      </section>

      {/* SEKCIJA 1 — PREDSTAVITEV */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* BACKGROUND IMAGE */}
        <img
          src="/onas1.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Predstavitev"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        {/* FLOATING PANEL */}
        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="bg-[#e8f7e1]/90 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
            <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
              Predstavitev
            </h2>
            <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
              Uršlja gora je ena najbolj prepoznavnih gora Koroške. Naša koča
              sprejema pohodnike, družine in ljubitelje narave že desetletja.
            </p>
            <a
              href="#zgodovina"
              className="text-[var(--text-link)] text-xl font-semibold hover:underline"
            >
              Preberi več →
            </a>
          </div>
        </div>
      </section>

      {/* SEKCIJA 2 — ZGODOVINA */}
      <section id="zgodovina" className="relative w-full h-screen overflow-hidden">
        <img
          src="/onas2.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Zgodovina"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="bg-[#ffe9d6]/90 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
            <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
              Zgodovina & zanimivosti
            </h2>
            <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
              Uršlja gora skriva številne zgodbe, kulturne posebnosti in naravne zanimivosti.
            </p>

            <ul className="space-y-4 text-xl text-[var(--text-link)] font-medium">
              <li><a href="/o-nas/cebelnjak" className="hover:text-[var(--text-heading)]">• Čebelnjak</a></li>
              <li><a href="/o-nas/knjiznjica" className="hover:text-[var(--text-heading)]">• Knjižnjica</a></li>
              <li><a href="/o-nas/cerkvica" className="hover:text-[var(--text-heading)]">• Cerkvica sv. Uršule</a></li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEKCIJA 3 — JEDILNIK */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src="/onas3.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Jedilnik"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="bg-[#d9eaff]/90 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
            <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
              Jedilnik koče
            </h2>
            <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
              Oglejte si ponudbo domačih jedi, toplih obrokov in pijač.
            </p>
            <a href="/jedilnik" className="text-[var(--text-link)] text-xl font-semibold hover:underline">
              Odpri jedilnik →
            </a>
          </div>
        </div>
      </section>

      {/* SEKCIJA 4 — KONTAKT */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src="/onas4.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="Kontakt"
        />
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="relative z-10 flex items-center justify-center h-full px-6">
          <div className="bg-[#ffe9d6]/90 backdrop-blur-md border border-[var(--brand)] rounded-2xl p-10 max-w-3xl shadow-xl">
            <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
              Kontakt
            </h2>
            <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
              Vsi kontaktni podatki, lokacija in informacije na enem mestu.
            </p>
            <a href="/kontakt" className="text-[var(--text-link)] text-xl font-semibold hover:underline">
              Odpri kontakt →
            </a>
          </div>
        </div>
      </section>

    </main>
  );
}
