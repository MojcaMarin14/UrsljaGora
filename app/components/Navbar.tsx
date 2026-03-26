export default function Navbar() {
  return (
    <nav className="w-full bg-[var(--brand-light)] border-b border-[var(--brand)] fixed top-0 left-0 z-50 shadow-sm">
  <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

    <a
      href="/"
      className="text-2xl font-bold text-[var(--brand-dark)] hover:text-[var(--brand)] transition"
    >
      Koča
    </a>

    <div className="flex items-center gap-8">
      <a href="/" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Domov
      </a>
      <a href="/onas" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        O nas
      </a>
      <a href="/aktualno" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Aktualno
      </a>
      
        <a href="/prenocisca" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Prenočišča
      </a>
        <a href="/mapa" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Mapa
      </a>
      <a href="/vreme" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Vreme
      </a>
      <a href="/kontakt" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Kontakt
      </a>
       <a href="/politikaZasebnosti" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        Politika zasebnosti
      </a>
    
       <a href="/101" className="text-gray-800 hover:text-[var(--brand-dark)] transition text-lg">
        101
      </a>
    </div>

  </div>
</nav>

  );
}
