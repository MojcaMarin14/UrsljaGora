export default function Navbar() {
  return (
    <nav className="absolute top-0 left-0 w-full z-50 bg-black/20 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">

        <a
          href="/"
          className="text-2xl font-bold text-white hover:text-[var(--brand)] transition"
        >
          Uršlja gora
        </a>

        <div className="flex items-center gap-8">

          <a href="/onas" className="text-white hover:text-[var(--brand)] transition text-lg">
            O nas
          </a>
           <a href="/onas/jedilnik" className="text-white hover:text-[var(--brand)] transition text-lg">
            Jedilnik
          </a>

          <a href="/aktualno" className="text-white hover:text-[var(--brand)] transition text-lg">
            Aktualno
          </a>

          <a href="/prenocisca" className="text-white hover:text-[var(--brand)] transition text-lg">
            Prenočišča
          </a>

          <a href="/mapa" className="text-white hover:text-[var(--brand)] transition text-lg">
            Mapa
          </a>

          <a href="/vreme" className="text-white hover:text-[var(--brand)] transition text-lg">
            Vreme
          </a>

          <a href="/kontakt" className="text-white hover:text-[var(--brand)] transition text-lg">
            Kontakt
          </a>

      

        </div>
      </div>
    </nav>
  );
}
