"use client";

export default function Footer() {
  return (
    <footer style={{ width: "100%", background: "var(--footer-bg)", color: "var(--footer-text)" }}>
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Koča na Uršlji gori</h3>
          <p className="text-sm leading-relaxed" style={{ opacity: 0.65 }}>
            Uršlja gora (Plešivec) – dom, razgledi in tradicija na 1699 m.
          </p>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Koča</h3>
          <ul className="space-y-2 text-sm" style={{ opacity: 0.65 }}>
            <li><a href="/" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Domov</a></li>
            <li><a href="/onas" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>O nas</a></li>
            <li><a href="/onas/jedilnik" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Jedilnik</a></li>
            <li><a href="/prenocisca" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Prenočišča</a></li>
            <li><a href="/kontakt" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Kontakt</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Odkrivaj</h3>
          <ul className="space-y-2 text-sm" style={{ opacity: 0.65 }}>
            <li><a href="/mapa" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Pohodniška mapa</a></li>
            <li><a href="/vreme" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Vreme</a></li>
            <li><a href="/aktualno" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Aktualno</a></li>
            <li><a href="/politikaZasebnosti" className="hover:opacity-100 transition" style={{ color: "var(--footer-link)", textDecoration: "none" }}>Politika zasebnosti</a></li>
          </ul>
        </div>

        <div className="space-y-3">
          <h3 className="text-lg font-semibold tracking-wide">Kontakt</h3>
          <div className="space-y-1 text-sm leading-relaxed" style={{ opacity: 0.65 }}>
            <p>Dom na Uršlji gori</p>
            <p>064 132 385</p>
            <p>juvan.nejc2@gmail.com</p>
          </div>
        </div>
      </div>

      <div
        className="text-center py-4 text-xs tracking-wide"
        style={{ borderTop: "1px solid var(--border)", opacity: 0.55 }}
      >
        © {new Date().getFullYear()} Koča na Uršlji gori — Vse pravice pridržane.
      </div>
    </footer>
  );
}
