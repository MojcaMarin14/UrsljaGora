import { fetchAPI } from "@/lib/api";
import Link from "next/link";

export default async function PonudbePage() {
  const res = await fetchAPI("ponudbes?populate=*");
  const ponudbe = res.data;

  return (
    <main className="max-w-6xl mx-auto py-16 px-4">
      {/* Hero naslov */}
      <section className="text-center mb-12">
        <h1 className="text-5xl font-bold text-white">Ponudbe</h1>
        <p className="text-gray-300 mt-3 text-lg">
          Posebne ugodnosti in ponudbe naše koče.
        </p>
      </section>

      {ponudbe.length === 0 && (
        <p className="text-center text-gray-400">Ni ponudb.</p>
      )}

      {/* Pinterest-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {ponudbe.map((item: any) => {
          const a = item;
          const img = a.slika?.[0]?.url ?? null;

          return (
            <article
              key={item.id}
              className="rounded-2xl overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:shadow-xl transition"
            >
              {/* Slika */}
              {img && (
                <Link href={`/aktualno/ponudbe/${item.id}`}>
                  <img
                    src={`http://localhost:1337${img}`}
                    className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
                  />
                </Link>
              )}

              {/* Vsebina */}
              <div className="p-6 space-y-3">
                <Link href={`/aktualno/ponudbe/${item.id}`}>
                  <h2 className="text-2xl font-semibold text-white hover:text-green-300 transition">
                    {a.naslov}
                  </h2>
                </Link>

                {/* Cena + veljavnost */}
                <p className="text-gray-300 text-sm">
                  Cena: <span className="text-green-300 font-semibold">{a.cena} €</span>
                  {a.veljavnost && (
                    <>
                      {" "}
                      · velja do{" "}
                      {new Date(a.veljavnost).toLocaleDateString("sl-SI")}
                    </>
                  )}
                </p>

                {/* Opis */}
                {a.opis && (
                  <p className="text-gray-300 text-sm">
                    {a.opis.substring(0, 140)}…
                  </p>
                )}

                {/* Gumb */}
                <Link
                  href={`/aktualno/ponudbe/${item.id}`}
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
