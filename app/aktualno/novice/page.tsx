import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default async function NovicePage() {
  const res = await fetchAPI("novicas?populate=*");
  const novice = res.data;

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero naslov */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white">Novice</h1>
        <p className="text-gray-300 mt-3 text-lg">
          Zadnje objave in obvestila iz naše koče.
        </p>
      </section>

      {novice.length === 0 && (
        <p className="text-center text-gray-400">Ni novic.</p>
      )}

      {/* Pinterest-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {novice.map((item: any) => {
          const a = item;
          const img = a.slika?.url ?? null;

          return (
            <article
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-xl transition"
            >
              {/* Slika */}
              {img && (
                <Link href={`/aktualno/novice/${a.slug}`}>
                  <img
                    src={`http://localhost:1337${img}`}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}

              {/* Vsebina */}
              <div className="p-6 space-y-3">
                <Link href={`/aktualno/novice/${a.slug}`}>
                  <h2 className="text-2xl font-semibold text-white hover:text-green-300 transition">
                    {a.naslov}
                  </h2>
                </Link>

                {a.opis && (
                  <p className="text-gray-300 text-sm">
                    {a.opis.substring(0, 140)}…
                  </p>
                )}

                <Link
                  href={`/aktualno/novice/${a.slug}`}
                  className="inline-block text-green-400 hover:text-green-300 font-medium"
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
