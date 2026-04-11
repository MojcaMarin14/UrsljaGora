import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";

export default async function NovicePage() {
  const res = await fetchAPI("novicas?populate=*");
  const novice = res.data;

  const sorted = [...novice].sort(
    (a, b) => new Date(b.datum).getTime() - new Date(a.datum).getTime()
  );

  return (
    <main className="w-full">

      {/* HERO VIDEO BLOK */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/news.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Novice
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
            Zadnje objave in obvestila iz naše koče.
          </p>
        </div>
      </section>

      {/* NAVIGACIJA */}
      <nav className="max-w-6xl mx-auto px-4 text-sm text-[var(--text-main)] mt-10 mb-6">
        <a href="/aktualno/ponudbe" className="hover:text-[var(--text-link)]">Ponudbe</a>
        <span className="mx-2">/</span>
        <a href="/aktualno/dogodki" className="hover:text-[var(--text-link)]">Dogodki</a>
      </nav>

      {/* GRID NOVIC */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {sorted.length === 0 && (
          <p className="text-center text-[var(--text-main)]">Ni novic.</p>
        )}

        {sorted.map((a: any) => {
          const img = a.slika?.url
            ? getStrapiMedia(a.slika.url)
            : "/fallback.jpg";

          const excerpt = a.opis
            ? a.opis.slice(0, 140) + "…"
            : "";

          return (
            <article
              key={a.id}
              className="rounded-2xl overflow-hidden shadow-sm bg-[var(--brand-light)] border border-[var(--brand)] hover:shadow-md transition"
            >
              <Link href={`/aktualno/novice/${a.slug}`}>
                <img
                  src={img}
                  alt={a.naslov}
                  className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="p-6 space-y-3">
                <Link href={`/aktualno/novice/${a.slug}`}>
                  <h2 className="text-2xl font-semibold text-[var(--text-heading)] hover:text-[var(--text-link)] transition">
                    {a.naslov}
                  </h2>
                </Link>

                <p className="text-[var(--text-main)] text-sm leading-relaxed">
                  {excerpt}
                </p>

                <Link
                  href={`/aktualno/novice/${a.slug}`}
                  className="inline-block text-[var(--text-link)] hover:text-[var(--text-heading)] font-medium"
                >
                  Preberi več →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
