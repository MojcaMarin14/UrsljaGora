
import { fetchAPI, getStrapiMedia } from "@/lib/api";

export default async function DogodekDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await fetchAPI(
    `dogodkis?filters[id][$eq]=${id}&populate=*`
  );

  const dogodek = res.data?.[0];

  if (!dogodek) {
    return (
      <main className="max-w-4xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-semibold text-[var(--text-heading)]">
          Dogodek ni bil najden.
        </h1>
      </main>
    );
  }

  const a = dogodek;
  const img = a.slika?.[0]?.url ?? null;

  return (
    <main className="max-w-4xl mx-auto py-16 px-4 space-y-10">
      <nav className="text-sm text-[var(--text-main)] mb-6">
  <a href="/" className="hover:text-[var(--text-link)]">Domov</a>
  <span className="mx-2">/</span>
  <a href="/aktualno" className="hover:text-[var(--text-link)]">Aktualno</a>
  <span className="mx-2">/</span>
  <a href="/aktualno/dogodki" className="hover:text-[var(--text-link)]">Dogodki</a>
  <span className="mx-2">/</span>
  <span className="text-[var(--text-heading)]">{a.naslov}</span>
</nav>


      {/* Naslov – ISTI kot pri Novicah */}
      <h1 className="text-2xl font-semibold text-[var(--text-heading)]">
        {a.naslov}
      </h1>

      {/* Datum */}
      {a.datum && (
        <p className="text-[var(--text-main)] text-sm">
          {new Date(a.datum).toLocaleString("sl-SI", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}

      {/* Slika – lepo razmerje, brez raztegovanja */}
      {img && (
        <div className="w-full rounded-xl overflow-hidden">
          <img
            src={getStrapiMedia(img)}
            className="w-full h-auto max-h-[450px] object-cover"
          />
        </div>
      )}

      {/* Opis – čist, brez borderjev */}
      {a.opis && (
        <div className="text-[var(--text-main)] text-lg leading-relaxed whitespace-pre-line">
          {a.opis}
        </div>
      )}
    </main>
  );
}
