"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ThemeToggle from "./ThemeToggle";

const links = [
  { label: "O nas",       href: "/onas" },
  { label: "Jedilnik",    href: "/onas/jedilnik" },
  { label: "Aktualno",    href: "/aktualno" },
  { label: "Prenočišča",  href: "/prenocisca" },
  { label: "Mapa",        href: "/mapa" },
  { label: "Vreme",       href: "/vreme" },
  { label: "Kontakt",     href: "/kontakt" },
];

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
  </svg>
);

const PhoneIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.57a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);

export default function Navbar() {
  const [open, setOpen]       = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme]     = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  const forceDark = pathname === "/mapa";

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark";
    setTheme(t);
    const obs = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme") as "dark" | "light" || "dark");
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const isLight = theme === "light";
  const isScrolledOrForced = scrolled || forceDark;

  // Nav background
  const navBg = isScrolledOrForced
    ? (isLight ? "rgba(245,247,245,0.9)" : "rgb(17,16,8)")
    : "rgba(0,0,0,0.22)";

  // Nav border bottom
  const navBorder = isScrolledOrForced
    ? (isLight ? "1px solid rgba(201,168,106,0.16)" : "1px solid rgba(201,169,110,0.12)")
    : "none";

  // Box shadow for light scrolled
  const navShadow = isScrolledOrForced && isLight ? "0 2px 16px rgba(0,0,0,0.06)" : "none";

  // Text color: always white when NOT scrolled (hero image), theme-aware when scrolled
  const navText   = isScrolledOrForced && isLight ? "#1A1A1A" : "white";
  const accentCol = isLight ? "#8C6B32" : "#c9a96e";

  // Mobile menu
  const menuBg   = isLight ? "rgba(250,250,250,0.95)" : "rgba(17,16,8,0.97)";
  const menuText  = isLight ? "#1A1A1A" : "white";
  const menuMuted = isLight ? "rgba(26,26,26,0.5)" : "rgba(255,255,255,0.5)";

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 100,
          background: navBg,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          transition: "background 0.3s, box-shadow 0.3s, border 0.3s",
          borderBottom: navBorder,
          boxShadow: navShadow,
        }}
      >
        <div style={{
          maxWidth: 1152, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: 16,
        }}>
          {/* Logo */}
          <a
            href="/"
            style={{
              fontSize: 20, fontWeight: 700,
              color: navText, textDecoration: "none",
              letterSpacing: "-0.02em", transition: "color 0.2s", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
            onMouseLeave={e => (e.currentTarget.style.color = navText)}
          >
            Uršlja gora
          </a>

          {/* Desktop links */}
          <div
            style={{ display: "flex", alignItems: "center", gap: 24, flex: 1, justifyContent: "center" }}
            className="navbar-desktop"
          >
            {links.map((l) => {
              const isActive = pathname === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  style={{
                    color: isActive ? accentCol : navText,
                    textDecoration: "none", fontSize: 15,
                    fontWeight: isActive ? 600 : 400,
                    letterSpacing: "0.01em", transition: "color 0.2s",
                    borderBottom: isActive ? `1px solid ${accentCol}` : "1px solid transparent",
                    paddingBottom: 2, whiteSpace: "nowrap",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
                  onMouseLeave={e => (e.currentTarget.style.color = isActive ? accentCol : navText)}
                >
                  {l.label}
                </a>
              );
            })}
          </div>

          {/* Desna stran */}
          <div
            className="navbar-desktop"
            style={{ display: "flex", alignItems: "center", gap: 14, flexShrink: 0 }}
          >
            <a
              href="tel:+386641323851"
              style={{
                display: "flex", alignItems: "center", gap: 5,
                color: navText, textDecoration: "none",
                fontSize: 13, whiteSpace: "nowrap",
                transition: "color 0.2s", opacity: 0.85,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
              onMouseLeave={e => (e.currentTarget.style.color = navText)}
            >
              <PhoneIcon />
              064 132 385
            </a>

            <span style={{ width: 1, height: 16, background: navText === "white" ? "rgba(255,255,255,0.2)" : "rgba(201,168,106,0.2)" }} />

            <a
              href="https://www.instagram.com/dom_na_urslji_gori/"
              target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              style={{
                color: navText, textDecoration: "none",
                display: "flex", alignItems: "center",
                transition: "color 0.2s", opacity: 0.85,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
              onMouseLeave={e => (e.currentTarget.style.color = navText)}
            >
              <InstagramIcon />
            </a>

            <ThemeToggle navText={navText} />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(o => !o)}
            className="navbar-hamburger"
            aria-label="Meni"
            style={{
              background: "none", border: "none",
              cursor: "pointer", padding: 8,
              display: "none", flexDirection: "column",
              gap: 5, alignItems: "flex-end",
            }}
          >
            {[
              { width: 24, transform: open ? "translateY(7px) rotate(45deg)" : "none" },
              { width: 18, opacity: open ? 0 : 1 },
              { width: 24, transform: open ? "translateY(-7px) rotate(-45deg)" : "none" },
            ].map((s, i) => (
              <span key={i} style={{
                display: "block", height: 2,
                width: s.width, background: navText,
                borderRadius: 2, transition: "transform 0.25s, opacity 0.25s",
                transform: (s as any).transform,
                opacity: (s as any).opacity ?? 1,
              }} />
            ))}
          </button>
        </div>
      </nav>

      {/* Mobile overlay meni */}
      <div
        className="navbar-mobile-menu"
        style={{
          position: "fixed", inset: 0, zIndex: 99,
          background: menuBg,
          backdropFilter: "blur(16px)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 8, transition: "opacity 0.3s, transform 0.3s",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0)" : "translateY(-12px)",
          pointerEvents: open ? "all" : "none",
        }}
      >
        <a
          href="/"
          style={{
            fontSize: 13, letterSpacing: "0.2em", textTransform: "uppercase",
            color: menuMuted, textDecoration: "none",
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
                color: isActive ? accentCol : menuText,
                textDecoration: "none",
                letterSpacing: "-0.02em", lineHeight: 1.3,
                transition: "color 0.2s, transform 0.2s",
                transitionDelay: open ? `${i * 0.04}s` : "0s",
                transform: open ? "translateX(0)" : "translateX(-16px)",
                opacity: open ? 1 : 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
              onMouseLeave={e => (e.currentTarget.style.color = isActive ? accentCol : menuText)}
            >
              {l.label}
            </a>
          );
        })}

        <div style={{
          display: "flex", alignItems: "center", gap: 20, marginTop: 32,
          opacity: open ? 1 : 0, transition: "opacity 0.3s",
          transitionDelay: open ? `${links.length * 0.04}s` : "0s",
        }}>
          <a
            href="tel:+38641323851"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              color: menuMuted, textDecoration: "none", fontSize: 14,
              transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
            onMouseLeave={e => (e.currentTarget.style.color = menuMuted)}
          >
            <PhoneIcon />
            064 132 385
          </a>
          <a
            href="https://www.instagram.com/dom_na_urslji_gori/"
            target="_blank" rel="noopener noreferrer"
            style={{
              color: menuMuted, textDecoration: "none",
              display: "flex", alignItems: "center", transition: "color 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = accentCol)}
            onMouseLeave={e => (e.currentTarget.style.color = menuMuted)}
          >
            <InstagramIcon />
          </a>
          <ThemeToggle navText={menuText} />
        </div>
      </div>

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
