import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";

export default async function DogodkiPage() {
  const res = await fetchAPI("dogodkis?populate=*&sort=datum:desc");
  const dogodki = res.data;

  return (
    <main className="w-full">

      {/* HERO VIDEO BLOK */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/dogodek.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Dogodki
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
            Prihajajoči in pretekli dogodki naše koče.
          </p>
        </div>
      </section>

      {/* NAVIGACIJA */}
      <nav className="max-w-6xl mx-auto px-4 text-sm text-[var(--text-main)] mt-10 mb-6">
        <a href="/aktualno/novice" className="hover:text-[var(--text-link)]">Novice</a>
        <span className="mx-2">/</span>
        <a href="/aktualno/ponudbe" className="hover:text-[var(--text-link)]">Ponudbe</a>
      </nav>

      {/* GRID DOGODKOV */}
      <div className="max-w-6xl mx-auto px-4 pb-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {dogodki.length === 0 && (
          <p className="text-center text-[var(--text-main)]">Ni dogodkov.</p>
        )}

        {dogodki.map((item: any) => {
          const img = item.slika?.[0]?.url;

          return (
            <article
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-sm bg-[var(--brand-light)] border border-[var(--brand)] hover:shadow-md transition"
            >
              {img && (
                <Link href={`/aktualno/dogodki/${item.id}`}>
                  <img
                    src={getStrapiMedia(img)}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}

              <div className="p-6 space-y-3">
                <p className="text-[var(--text-main)] text-sm">
                  {item.datum &&
                    new Date(item.datum).toLocaleString("sl-SI", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  {item.lokacija && (
                    <> · <span className="text-[var(--text-link)]">{item.lokacija}</span></>
                  )}
                </p>

                <Link href={`/aktualno/dogodki/${item.id}`}>
                  <h2 className="text-2xl font-semibold text-[var(--text-heading)] hover:text-[var(--text-link)] transition">
                    {item.naslov}
                  </h2>
                </Link>

                {item.opis && (
                  <p className="text-[var(--text-main)] text-sm">
                    {item.opis.substring(0, 140)}…
                  </p>
                )}

                <Link
                  href={`/aktualno/dogodki/${item.id}`}
                  className="inline-block text-[var(--text-link)] hover:text-[var(--text-heading)] font-medium"
                >
                  Preberi več →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
       <Footer />
    </main>

  );
}
