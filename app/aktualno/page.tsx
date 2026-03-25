export default function AktualnoPage() {
  return (
    <main className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Aktualno</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <a
          href="/aktualno/novice"
          className="p-6 border rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">Novice</h2>
          <p className="text-gray-600 mt-2">Zadnje objave in obvestila.</p>
        </a>

        <a
          href="/aktualno/dogodki"
          className="p-6 border rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">Dogodki</h2>
          <p className="text-gray-600 mt-2">Prihajajoči in pretekli dogodki.</p>
        </a>

        <a
          href="/aktualno/ponudbe"
          className="p-6 border rounded-lg hover:bg-gray-50 transition"
        >
          <h2 className="text-xl font-semibold">Ponudbe</h2>
          <p className="text-gray-600 mt-2">Posebne ponudbe in ugodnosti.</p>
        </a>
      </div>
    </main>
  );
}
