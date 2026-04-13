"use client";

export default function Footer({ dark = false }) {
  return (
    <footer className={`w-full mt-20 ${dark ? "bg-black text-white" : "bg-[var(--background)] text-[var(--foreground)]"}`}>

      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-16">

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Koča na Uršlji gori
          </h3>
          <p className="text-sm opacity-80 leading-relaxed max-w-xs">
            Uršlja gora (Plešivec) – dom, razgledi in tradicija na 1699 m.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Povezave
          </h3>
          <ul className="space-y-2 text-sm opacity-80">
            <li><a href="/" className="hover:opacity-100 transition">Domov</a></li>
            <li><a href="/onas" className="hover:opacity-100 transition">O nas</a></li>
            <li><a href="/aktualno" className="hover:opacity-100 transition">Aktualno</a></li>
            <li><a href="/kontakt" className="hover:opacity-100 transition">Kontakt</a></li>
            <li><a href="/politikaZasebnosti" className="hover:opacity-100 transition">Politika zasebnosti</a></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold tracking-wide">
            Kontakt
          </h3>
          <div className="space-y-1 text-sm opacity-80 leading-relaxed">
            <p>Dom na Uršlji gori</p>
            <p>02 87 0 48 20</p>
            <p>041 743 442</p>
            <p>info@ursljagora.si</p>
          </div>
        </div>

      </div>

      <div className={`${dark ? "bg-black text-gray-400" : "bg-[var(--background)] text-[var(--foreground)] opacity-70"} text-center py-4 text-xs tracking-wide`}>
        © {new Date().getFullYear()} Koča na Uršlji gori — Vse pravice pridržane.
      </div>

    </footer>
  );
}
