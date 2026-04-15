"use client";

export default function Footer({ dark = false }) {
  return (
    <footer className={`w-full mt-20 ${dark ? "bg-black text-white" : "bg-[var(--background)] text-[var(--foreground)]"}`}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Koča na Uršlji gori</h3>
          <p className="text-sm opacity-70 leading-relaxed">
            Uršlja gora (Plešivec) – dom, razgledi in tradicija na 1699 m.
          </p>
        </div>

        {/* Notranje povezave – SEO: pomaga iskalnikom odkriti vse podstrani */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Koča</h3>
          <ul className="space-y-2 text-sm opacity-70">
            <li><a href="/" className="hover:opacity-100 transition">Domov</a></li>
            <li><a href="/onas" className="hover:opacity-100 transition">O nas</a></li>
            <li><a href="/onas/jedilnik" className="hover:opacity-100 transition">Jedilnik</a></li>
            <li><a href="/prenocisca" className="hover:opacity-100 transition">Prenočišča</a></li>
            <li><a href="/kontakt" className="hover:opacity-100 transition">Kontakt</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Odkrivaj</h3>
          <ul className="space-y-2 text-sm opacity-70">
            <li><a href="/mapa" className="hover:opacity-100 transition">Pohodniška mapa</a></li>
            <li><a href="/vreme" className="hover:opacity-100 transition">Vreme</a></li>
            <li><a href="/aktualno" className="hover:opacity-100 transition">Aktualno</a></li>
            <li><a href="/politikaZasebnosti" className="hover:opacity-100 transition">Politika zasebnosti</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Kontakt</h3>
          <div className="space-y-1 text-sm opacity-70 leading-relaxed">
            <p>Dom na Uršlji gori</p>
            <p>02 87 0 48 20</p>
            <p>041 743 442</p>
            <p>info@ursljagora.si</p>
          </div>
        </div>
      </div>

      <div className={`${dark ? "border-t border-white/10 text-gray-400" : "border-t border-black/10 opacity-60"} text-center py-4 text-xs tracking-wide`}>
        © {new Date().getFullYear()} Koča na Uršlji gori — Vse pravice pridržane.
      </div>
    </footer>
  );
}
