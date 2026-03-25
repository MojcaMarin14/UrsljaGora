import { fetchAPI } from "@/lib/api";

export default async function DogodekDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  // PRAVILEN Strapi v5 dokumentni query
  const res = await fetchAPI(
    `dogodkis?filters[id][$eq]=${id}&populate=*`
  );

  const dogodek = res.data?.[0];

  if (!dogodek) {
    return (
      <main className="max-w-4xl mx-auto py-10">
        <h1 className="text-2xl font-bold">Dogodek ni bil najden.</h1>
      </main>
    );
  }

  const a = dogodek;
  const img = a.slika?.[0]?.url ?? null;

  return (
    <main className="max-w-4xl mx-auto py-10 space-y-4">
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
