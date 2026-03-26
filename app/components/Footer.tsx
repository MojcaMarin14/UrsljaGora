"use client";

export default function Footer() {
  return (
    <footer className="w-full bg-[#0f172a] text-grey mt-20">

      {/* Zgornji del */}
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-16">

        {/* Stolpec 1 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Koča na Uršlji gori
          </h3>
          <p className="text-sm text-gray-300 leading-relaxed max-w-xs">
            Uršlja gora (Plešivec) – dom, razgledi in tradicija na 1699 m.
          </p>
        </div>

        {/* Stolpec 2 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Povezave
          </h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li><a href="/" className="hover:text-white transition">Domov</a></li>
            <li><a href="/o-nas" className="hover:text-white transition">O nas</a></li>
            <li><a href="/aktualno" className="hover:text-white transition">Aktualno</a></li>
            <li><a href="/kontakt" className="hover:text-white transition">Kontakt</a></li>
            <li><a href="/politika-zasebnosti" className="hover:text-white transition">Politika zasebnosti</a></li>
          </ul>
        </div>

        {/* Stolpec 3 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Kontakt
          </h3>
          <div className="space-y-1 text-sm text-gray-300 leading-relaxed">
            <p>Dom na Uršlji gori</p>
            <p>02 87 0 48 20</p>
            <p>041 743 442</p>
            <p>info@ursljagora.si</p>
          </div>
        </div>

      </div>

      {/* Spodnja vrstica */}
      <div className="w-full bg-[#0a1120] text-center py-4 text-gray-400 text-xs tracking-wide">
        © {new Date().getFullYear()} Koča na Uršlji gori — Vse pravice pridržane.
      </div>

    </footer>
  );
}
