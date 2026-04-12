import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";

export default async function PonudbaDetailPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;

  const res = await fetchAPI(
    `ponudbes?filters[id][$eq]=${id}&populate=*`
  );

  const ponudba = res.data?.[0];

  if (!ponudba) {
    return (
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold">Ponudba ni bila najdena.</h1>
      </main>
    );
  }

  const img = ponudba.slika?.[0]?.url ?? null;

  return (
    <main className="max-w-4xl mx-auto py-10 space-y-4">
      <div className="pt-32"></div>
          <nav className="text-sm text-[var(--text-main)] mb-6">
  <a href="/" className="hover:text-[var(--text-link)]">Domov</a>
  <span className="mx-2">/</span>
  <a href="/aktualno" className="hover:text-[var(--text-link)]">Aktualno</a>
  <span className="mx-2">/</span>
  <a href="/aktualno/dogodki" className="hover:text-[var(--text-link)]">Dogodki</a>
  <span className="mx-2">/</span>
  <span className="text-[var(--text-heading)]">{ponudba.naslov}</span>
</nav>

      <h1 className="text-3xl font-bold">{ponudba.naslov}</h1>

      {img && (
        <img
          src={getStrapiMedia(img)}
          className="mt-3 rounded-md max-h-96 object-cover"
        />
      )}

      {ponudba.opis && (
        <div className="mt-4 whitespace-pre-line text-lg text-gray-800">
          {ponudba.opis}
        </div>
      )}
       <Footer />
    </main>
  );
}
