export const dynamic = "force-dynamic";

import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";

export default async function NovicaDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const res = await fetchAPI(
    `novicas?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  );

  const novica = res.data?.[0];

  if (!novica) {
    return (
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold">Novica ni bila najdena.</h1>
      </main>
    );
  }

  const a = novica;
  const img = a.slika?.url ?? null;

  return (
    <main className="max-w-4xl mx-auto py-10 space-y-4">
      <div className="pt-40"></div>
    <nav className="text-sm text-[var(--text-main)] mb-6">
  <a href="/" className="hover:text-[var(--text-link)]">Domov</a>
  <span className="mx-2">/</span>
  <a href="/aktualno" className="hover:text-[var(--text-link)]">Aktualno</a>
  <span className="mx-2">/</span>
  <a href="/aktualno/dogodki" className="hover:text-[var(--text-link)]">Dogodki</a>
  <span className="mx-2">/</span>
  <span className="text-[var(--text-heading)]">{a.naslov}</span>
</nav>
      
      <h1 className="text-3xl font-bold">{a.naslov}</h1>

      {a.datum && (
        <p className="text-sm text-gray-500">
          {new Date(a.datum).toLocaleString("sl-SI", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      )}

      {img && (
        <img
          src={getStrapiMedia(img)}
          className="mt-3 rounded-md max-h-96 object-cover"
        />
      )}

      {a.opis && (
        <div className="mt-4 whitespace-pre-line text-lg text-gray-800">
          {a.opis}
        </div>
      )}
       <Footer />
    </main>
  );
}
