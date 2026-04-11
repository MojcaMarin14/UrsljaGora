import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";

export default async function PonudbePage() {
  const res = await fetchAPI("ponudbes?populate=*&sort=veljavnost:desc");
  const ponudbe = res.data;

  return (
    <main className="w-full">

      {/* HERO VIDEO BLOK */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/strudel.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Ponudbe
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
            Aktualne ponudbe in posebne ugodnosti naše koče.
          </p>
        </div>
      </section>

      {/* NAVIGACIJA */}
      <nav className="max-w-6xl mx-auto px-4 text-sm text-[var(--text-main)] mt-10 mb-6">
        <a href="/aktualno/novice" className="hover:text-[var(--text-link)]">Novice</a>
        <span className="mx-2">/</span>
        <a href="/aktualno/dogodki" className="hover:text-[var(--text-link)]">Dogodki</a>
      </nav>

      {/* VSEBINA */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {ponudbe.map((item: any) => {
            const img = item.slika?.[0]?.url;

            return (
              <article
                key={item.id}
                className="rounded-xl overflow-hidden shadow bg-white border"
              >
                {img && (
                  <Link href={`/aktualno/ponudbe/${item.id}`}>
                    <img
                      src={getStrapiMedia(img)}
                      className="w-full h-56 object-cover"
                      alt={item.naslov}
                    />
                  </Link>
                )}

                <div className="p-6 space-y-3">
                  <Link href={`/aktualno/ponudbe/${item.id}`}>
                    <h2 className="text-2xl font-semibold">
                      {item.naslov}
                    </h2>
                  </Link>

                  <p className="text-gray-700 text-sm">
                    {item.opis?.substring(0, 140)}…
                  </p>

                  <Link
                    href={`/aktualno/ponudbe/${item.id}`}
                    className="text-blue-600 font-medium"
                  >
                    Preberi več →
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
}
