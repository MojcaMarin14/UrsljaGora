"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const GOLD = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK = "#111008";

const PER_PAGE = 6;

type Kategorija = "Vse" | "Hrana" | "Prenočišče" | "Paket" | "Akcija";

const KATEGORIJE: { label: Kategorija; icon: string }[] = [
  { label: "Vse",        icon: "✦"  },
  { label: "Hrana",      icon: "🍽️" },
  { label: "Prenočišče", icon: "🛏️" },
  { label: "Paket",      icon: "🎁" },
  { label: "Akcija",     icon: "🏷️" },
];

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 28, height: 1, background: light ? "rgba(201,169,110,0.7)" : GOLD, flexShrink: 0 }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
        color: light ? "rgba(201,169,110,0.85)" : GOLD, fontWeight: 600,
        fontFamily: "sans-serif",
      }}>
        {text}
      </span>
    </div>
  );
}

function SubNav() {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 40 }}>
      {[
        { label: "Novice",  href: "/aktualno/novice",  active: false },
        { label: "Ponudbe", href: "/aktualno/ponudbe", active: true  },
        { label: "Dogodki", href: "/aktualno/dogodki", active: false },
      ].map((item) => (
        <Link
          key={item.href}
          href={item.href}
          style={{
            display: "inline-block",
            padding: "9px 22px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            textDecoration: "none",
            fontFamily: "sans-serif",
            background: item.active ? GOLD : "rgba(17,16,8,0.06)",
            color: item.active ? DARK : "rgba(17,16,8,0.45)",
            border: item.active ? "none" : "1px solid rgba(17,16,8,0.1)",
          }}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}

// ── Kategorija filter pills ──
function KategorijaFilter({ active, onChange }: { active: Kategorija; onChange: (k: Kategorija) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 48 }}>
      {KATEGORIJE.map(({ label, icon }) => {
        const isActive = active === label;
        return (
          <button
            key={label}
            onClick={() => onChange(label)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "8px 18px",
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.05em",
              fontFamily: "sans-serif",
              cursor: "pointer",
              border: isActive ? "none" : "1px solid rgba(17,16,8,0.12)",
              background: isActive ? DARK : "white",
              color: isActive ? "white" : "rgba(17,16,8,0.5)",
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 13 }}>{icon}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

// ── Pagination ──
function Pagination({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (p: number) => void }) {
  if (totalPages <= 1) return null;
  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 56 }}>
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          border: "1px solid rgba(17,16,8,0.12)",
          background: "white", cursor: page === 1 ? "default" : "pointer",
          color: page === 1 ? "rgba(17,16,8,0.2)" : DARK,
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
      >‹</button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button
          key={p}
          onClick={() => onChange(p)}
          style={{
            width: 38, height: 38, borderRadius: "50%",
            border: p === page ? "none" : "1px solid rgba(17,16,8,0.12)",
            background: p === page ? GOLD : "white",
            color: p === page ? DARK : "rgba(17,16,8,0.5)",
            fontWeight: p === page ? 700 : 400,
            fontSize: 13, fontFamily: "sans-serif",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        style={{
          width: 38, height: 38, borderRadius: "50%",
          border: "1px solid rgba(17,16,8,0.12)",
          background: "white", cursor: page === totalPages ? "default" : "pointer",
          color: page === totalPages ? "rgba(17,16,8,0.2)" : DARK,
          fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s",
        }}
      >›</button>
    </div>
  );
}

// ── Kategorija badge na kartici ──
function KategorijaBadge({ kategorija }: { kategorija?: string }) {
  if (!kategorija) return null;
  const cfg = KATEGORIJE.find(k => k.label === kategorija);
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: "rgba(201,169,110,0.12)", border: "1px solid rgba(201,169,110,0.25)",
      color: "#9a7a3a", borderRadius: 999,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.06em",
      padding: "4px 12px", fontFamily: "sans-serif",
      textTransform: "uppercase", marginBottom: 10,
    }}>
      {cfg?.icon} {kategorija}
    </span>
  );
}

// ── Featured ──
function FeaturedCard({ img, title, excerpt, href, veljavnost, kategorija }: {
  img: string; title: string; excerpt: string; href: string; veljavnost?: string; kategorija?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] as Transition["ease"] }}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden", marginBottom: 24 }}
    >
      <Link href={href} style={{ display: "block", textDecoration: "none" }}>
        <motion.img
          src={img} alt={title}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.7 }}
          style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(17,16,8,0.93) 0%, rgba(17,16,8,0.4) 50%, transparent 100%)",
        }} />
        {/* Kategorija badge zgoraj levo */}
        {kategorija && (
          <div style={{ position: "absolute", top: 24, left: 28 }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              color: "white", borderRadius: 999, fontSize: 11, fontWeight: 600,
              letterSpacing: "0.06em", padding: "5px 14px", fontFamily: "sans-serif",
              textTransform: "uppercase",
            }}>
              {KATEGORIJE.find(k => k.label === kategorija)?.icon} {kategorija}
            </span>
          </div>
        )}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 44px 44px" }}>
          {veljavnost && (
            <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(201,169,110,0.7)", letterSpacing: "0.12em", marginBottom: 12, textTransform: "uppercase" }}>
              Velja do: {new Date(veljavnost).toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
          <SectionLabel text="Izpostavljena ponudba" light />
          <h2 style={{
            fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.02em", lineHeight: 1.2, margin: "0 0 14px", maxWidth: 680,
          }}>
            {title}
          </h2>
          <p style={{ fontFamily: "sans-serif", fontSize: 15, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, maxWidth: 560, marginBottom: 24 }}>
            {excerpt}
          </p>
          <motion.span
            whileHover={{ x: 4 }}
            transition={{ duration: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 6, color: GOLD, fontSize: 12, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "sans-serif" }}
          >
            Preberi več <span style={{ fontSize: 15 }}>→</span>
          </motion.span>
        </div>
      </Link>
    </motion.div>
  );
}

// ── Navadna kartica ──
function OfferCard({ img, title, excerpt, href, veljavnost, kategorija, delay = 0 }: {
  img: string; title: string; excerpt: string; href: string; veljavnost?: string; kategorija?: string; delay?: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.65, delay, ease: [0.25, 0.1, 0.25, 1] as Transition["ease"] }}
      whileHover={{ y: -6 }}
      style={{
        background: "white", borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "column",
      }}
    >
      <Link href={href} style={{ display: "block", overflow: "hidden", height: 220, textDecoration: "none" }}>
        <motion.img
          src={img} alt={title}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Link>
      <div style={{ padding: "26px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <KategorijaBadge kategorija={kategorija} />
        {veljavnost && (
          <p style={{ fontFamily: "sans-serif", fontSize: 11, color: "rgba(17,16,8,0.35)", letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
            Velja do: {new Date(veljavnost).toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        )}
        <Link href={href} style={{ textDecoration: "none" }}>
          <h3 style={{ fontSize: 19, fontWeight: 600, color: DARK, letterSpacing: "-0.01em", lineHeight: 1.3, marginBottom: 10 }}>
            {title}
          </h3>
        </Link>
        <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(17,16,8,0.55)", lineHeight: 1.75, flex: 1, marginBottom: 20 }}>
          {excerpt}
        </p>
        <motion.div whileHover={{ x: 4 }} transition={{ duration: 0.2 }}>
          <Link href={href} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            color: GOLD, fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
            textTransform: "uppercase", textDecoration: "none", fontFamily: "sans-serif",
          }}>
            Preberi več <span style={{ fontSize: 13 }}>→</span>
          </Link>
        </motion.div>
      </div>
    </motion.article>
  );
}

export default function PonudbePage() {
  const [ponudbe, setPonudbe] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [kategorija, setKategorija] = useState<Kategorija>("Vse");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleKategorija = useCallback((k: Kategorija) => {
    setKategorija(k);
    setPage(1);
  }, []);

  useEffect(() => {
    setLoading(true);

    const katParam = kategorija !== "Vse"
      ? `&filters[kategorija][$eq]=${encodeURIComponent(kategorija)}`
      : "";

    fetchAPI(
      `ponudbes?populate=*&sort=veljavnost:desc&pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}${katParam}`
    ).then((res) => {
      setPonudbe(res.data ?? []);
      setTotalPages(res.meta?.pagination?.pageCount ?? 1);
      setLoading(false);
    });
  }, [page, kategorija]);

  // Featured samo na prvi strani brez filtra
  const showFeatured = page === 1 && kategorija === "Vse";
  const [featured, ...rest] = ponudbe;
  const gridItems = showFeatured ? rest : ponudbe;

  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── MINI HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "52vh", overflow: "hidden" }}>
        <video
          src="/strudel.mp4"
          autoPlay muted loop playsInline
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(17,16,8,0.5)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(17,16,8,0.55) 100%)" }} />

        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", height: "100%", textAlign: "center", padding: "0 24px",
        }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}
          >
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.6)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 500, fontFamily: "sans-serif" }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.6)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            style={{ fontSize: "clamp(42px, 8vw, 80px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0 }}
          >
            Ponudbe
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{ marginTop: 18, fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.7, fontFamily: "sans-serif" }}
          >
            Aktualne ponudbe in posebne ugodnosti naše koče.
          </motion.p>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(to bottom, transparent, ${CREAM})`,
        }} />
      </section>

      {/* ── VSEBINA ── */}
      <section style={{ backgroundColor: CREAM, padding: "64px 24px 100px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            <SectionLabel text="Vse ponudbe" />
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 500, color: DARK,
              letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 36,
            }}>
              Posebne <span style={{ color: GOLD }}>ugodnosti</span>
            </h2>
          </motion.div>

          <SubNav />
          <KategorijaFilter active={kategorija} onChange={handleKategorija} />

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(17,16,8,0.3)", fontFamily: "sans-serif", fontSize: 14, letterSpacing: "0.08em" }}>
              Nalaganje…
            </div>
          )}

          {/* Prazno */}
          {!loading && ponudbe.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(17,16,8,0.35)", fontFamily: "sans-serif" }}>
              {kategorija !== "Vse"
                ? `Ni ponudb v kategoriji "${kategorija}".`
                : "Trenutno ni aktivnih ponudb."}
            </div>
          )}

          {/* Featured — samo na strani 1 brez filtra */}
          {!loading && showFeatured && featured && (
            <FeaturedCard
              img={featured.slika?.[0]?.url ? getStrapiMedia(featured.slika[0].url) : "/fallback.jpg"}
              title={featured.naslov}
              excerpt={(featured.opis ?? "").slice(0, 200) + "…"}
              href={`/aktualno/ponudbe/${featured.id}`}
              veljavnost={featured.veljavnost}
              kategorija={featured.kategorija}
            />
          )}

          {/* Grid */}
          {!loading && gridItems.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 22,
            }}>
              {gridItems.map((item: any, i: number) => (
                <OfferCard
                  key={item.id}
                  img={item.slika?.[0]?.url ? getStrapiMedia(item.slika[0].url) : "/fallback.jpg"}
                  title={item.naslov}
                  excerpt={(item.opis ?? "").slice(0, 130) + "…"}
                  href={`/aktualno/ponudbe/${item.id}`}
                  veljavnost={item.veljavnost}
                  kategorija={item.kategorija}
                  delay={i * 0.08}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          )}

        </div>
      </section>

      <Footer dark />
    </main>
  );
}
