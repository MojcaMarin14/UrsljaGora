import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default async function AktualnoPage() {
  const resNovice = await fetchAPI("novicas?populate=*");
  const resDogodki = await fetchAPI("dogodkis?populate=*");
  const resPonudbe = await fetchAPI("ponudbes?populate=*");

  const zadnjaNovica = resNovice.data?.[0];
  const zadnjiDogodek = resDogodki.data?.[0];
  const zadnjaPonudba = resPonudbe.data?.[0];

  return (
    <main className="w-full">

     <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">

  {/* VIDEO */}
  <video
    className="absolute inset-0 w-full h-full object-cover"
    src="/aktualno.mp4"
    autoPlay
    muted
    loop
    playsInline
  />

  {/* TEMNI GRADIENT ZA BOLJŠO BERLJIVOST */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* TEKST NA VRHU VIDEA */}
  <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
    <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
      Aktualno
    </h1>

    <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
      Izberite kategorijo aktualnih vsebin naše koče.
    </p>
  </div>
</section>


      {/* BLOK 1 — NOVICE */}
      <section className="w-full bg-[#e8f7e1] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <img
            src={
              zadnjaNovica?.slika?.url
                ? `http://localhost:1337${zadnjaNovica.slika.url}`
                : "/fallback.jpg"
            }
            className="w-full h-72 object-cover rounded-xl shadow"
            alt={zadnjaNovica?.naslov}
          />

          <div>
            <h2 className="text-3xl font-bold text-[var(--text-heading)] mb-3">
              Novice
            </h2>

            <p className="text-[var(--text-main)] mb-6 text-lg leading-relaxed">
              {zadnjaNovica?.opis?.slice(0, 160)}…
            </p>

            <Link
              href="/aktualno/novice"
              className="text-[var(--text-link)] font-semibold text-lg hover:underline"
            >
              Preberi vse →
            </Link>
          </div>
        </div>
      </section>

      {/* BLOK 2 — PONUDBE */}
      <section className="w-full bg-[#ffe9d6] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <img
            src={
              zadnjaPonudba?.slika?.[0]?.url
                ? `http://localhost:1337${zadnjaPonudba.slika[0].url}`
                : "/fallback.jpg"
            }
            className="w-full h-72 object-cover rounded-xl shadow"
            alt={zadnjaPonudba?.naslov}
          />

          <div>
            <h2 className="text-3xl font-bold text-[var(--text-heading)] mb-3">
              Ponudbe
            </h2>

            <p className="text-[var(--text-main)] mb-6 text-lg leading-relaxed">
              {zadnjaPonudba?.opis?.slice(0, 160)}…
            </p>

            <Link
              href="/aktualno/ponudbe"
              className="text-[var(--text-link)] font-semibold text-lg hover:underline"
            >
              Preberi vse →
            </Link>
          </div>
        </div>
      </section>

      {/* BLOK 3 — DOGODKI */}
      <section className="w-full bg-[#d9eaff] py-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 items-center">

          <img
            src={
              zadnjiDogodek?.slika?.[0]?.url
                ? `http://localhost:1337${zadnjiDogodek.slika[0].url}`
                : "/fallback.jpg"
            }
            className="w-full h-72 object-cover rounded-xl shadow"
            alt={zadnjiDogodek?.naslov}
          />

          <div>
            <h2 className="text-3xl font-bold text-[var(--text-heading)] mb-3">
              Dogodki
            </h2>

            <p className="text-[var(--text-main)] mb-6 text-lg leading-relaxed">
              {zadnjiDogodek?.opis?.slice(0, 160)}…
            </p>

            <Link
              href="/aktualno/dogodki"
              className="text-[var(--text-link)] font-semibold text-lg hover:underline"
            >
              Preberi vse →
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
