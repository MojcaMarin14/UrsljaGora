import { fetchAPI } from "@/lib/api";

export default async function PonudbaDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // PRAVILEN Strapi v5 dokumentni query
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

  const a = ponudba;
  const img = a.slika?.[0]?.url ?? null;

  return (
    <main className="max-w-4xl mx-auto py-10 space-y-4">
      <h1 className="text-3xl font-bold">{a.naslov}</h1>

      {img && (
        <img
          src={`http://localhost:1337${img}`}
          className="mt-3 rounded-md max-h-96 object-cover"
        />
      )}

      {a.opis && (
        <div className="mt-4 whitespace-pre-line text-lg text-gray-800">
          {a.opis}
        </div>
      )}
    </main>
  );
}
