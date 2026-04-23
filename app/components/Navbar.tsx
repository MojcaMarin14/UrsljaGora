"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const GOLD = "#c9a96e";

const links = [
  { label: "O nas",       href: "/onas" },
  { label: "Jedilnik",    href: "/onas/jedilnik" },
  { label: "Aktualno",    href: "/aktualno" },
  { label: "Prenočišča",  href: "/prenocisca" },
  { label: "Mapa",        href: "/mapa" },
  { label: "Vreme",       href: "/vreme" },
  { label: "Kontakt",     href: "/kontakt" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: scrolled ? "rgba(17,16,8,0.85)" : "rgba(0,0,0,0.2)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.3s",
          borderBottom: scrolled ? "1px solid rgba(201,169,110,0.12)" : "none",
        }}
      >
        <div style={{
          maxWidth: 1152,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}>
          {/* Logo */}
          <a
            href="/"
            style={{
              fontSize: 20,
              fontWeight: 700,
              color: "white",
              textDecoration: "none",
              letterSpacing: "-0.02em",
              transition: "color 0.2s",
              flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
            onMouseLeave={e => (e.currentTarget.style.color = "white")}
          >
            Uršlja gora
          </a>

          {/* Desktop links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 28 }}
            className="navbar-desktop"
          >
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    color: isActive ? GOLD : "white",
                    textDecoration: "none",
                    fontSize: 16,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em",
                    transition: "color 0.2s",
                    borderBottom: isActive ? `1px solid ${GOLD}` : "1px solid transparent",
                    paddingBottom: 2,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? GOLD : "white")}
                >
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setOpen(o => !o)}
            className="navbar-hamburger"
            aria-label="Meni"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              display: "none",
              flexDirection: "column",
              gap: 5,
              alignItems: "flex-end",
            }}
          >
            <span style={{
              display: "block",
              width: 24, height: 2,
              background: "white",
              borderRadius: 2,
              transition: "transform 0.25s, opacity 0.25s",
              transform: open ? "translateY(7px) rotate(45deg)" : "none",
            }} />
            <span style={{
              display: "block",
              width: 18, height: 2,
              background: "white",
              borderRadius: 2,
              transition: "opacity 0.25s",
              opacity: open ? 0 : 1,
            }} />
            <span style={{
              display: "block",
              width: 24, height: 2,
              background: "white",
              borderRadius: 2,
              transition: "transform 0.25s, opacity 0.25s",
              transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
            }} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay meni */}
      <div
        className="navbar-mobile-menu"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(17,16,8,0.97)",
          backdropFilter: "blur(16px)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          transition: "opacity 0.3s, transform 0.3s",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: open ? "all" : "none",
        }}
      >
        {/* Zlata dekoracija */}
        <div style={{
          position: "absolute",
          width: 400, height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(201,169,110,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <a
          href="/"
          style={{
            fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase",
            color: "rgba(201,169,110,0.6)", textDecoration: "none",
            marginBottom: 32, fontFamily: "sans-serif",
          }}
        >
          Uršlja gora
        </a>

        {links.map((l, i) => {
          const isActive = pathname === l.href;
          return (
            <a
              key={l.href}
              href={l.href}
              style={{
                fontSize: "clamp(28px, 7vw, 42px)",
                fontWeight: 500,
                color: isActive ? GOLD : "white",
                textDecoration: "none",
                letterSpacing: "-0.02em",
                lineHeight: 1.3,
                transition: "color 0.2s, transform 0.2s",
                transitionDelay: open ? `${i * 0.04}s` : "0s",
                transform: open ? "translateX(0)" : "translateX(-16px)",
                opacity: open ? 1 : 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
              onMouseLeave={e => (e.currentTarget.style.color = isActive ? GOLD : "white")}
            >
              {l.label}
            </a>
          );
        })}
      </div>

      {/* CSS za responsive */}
      <style>{`
        @media (max-width: 768px) {
          .navbar-desktop { display: none !important; }
          .navbar-hamburger { display: flex !important; }
        }
        @media (min-width: 769px) {
          .navbar-mobile-menu { display: none !important; }
        }
      `}</style>
    </>
  );
}