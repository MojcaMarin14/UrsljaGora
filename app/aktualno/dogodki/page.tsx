"use client";

import { motion } from "framer-motion";
import type { Transition } from "framer-motion";
import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const GOLD = "var(--accent)";
const CREAM = "var(--section-bg)";
const DARK = "var(--heading)";

const PER_PAGE = 6;

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 36, height: 2, background: "var(--accent)", flexShrink: 0 }} />
      <span style={{
        fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase",
        color: light ? "var(--label-inv)" : "var(--label)", fontWeight: 700,
      }}>
        {text}
      </span>
    </div>
  );
}

function SubNav() {
  return (
    <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 56 }}>
      {[
        { label: "Novice",  href: "/aktualno/novice",  active: false },
        { label: "Ponudbe", href: "/aktualno/ponudbe", active: false },
        { label: "Dogodki", href: "/aktualno/dogodki", active: true  },
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

// ── Filter prihajajoči / pretekli ──
type TimeFilter = "prihajajoči" | "pretekli";

function TimeFilterPills({ active, onChange }: { active: TimeFilter; onChange: (v: TimeFilter) => void }) {
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 40 }}>
      {(["prihajajoči", "pretekli"] as TimeFilter[]).map((f) => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: "8px 20px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            fontFamily: "sans-serif",
            cursor: "pointer",
            border: active === f ? "none" : "1px solid rgba(17,16,8,0.12)",
            background: active === f ? DARK : "white",
            color: active === f ? "white" : "rgba(17,16,8,0.45)",
            transition: "all 0.2s",
          }}
        >
          {f === "prihajajoči" ? "🗓 Prihajajoči" : "📁 Pretekli"}
        </button>
      ))}
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

function EventMeta({ datum, lokacija, light = false }: { datum?: string; lokacija?: string; light?: boolean }) {
  const color = light ? "rgba(246, 244, 241, 1)" : "rgba(17,16,8,0.35)";
  if (!datum && !lokacija) return null;
  return (
    <p style={{ fontFamily: "sans-serif", fontSize: 15, color, letterSpacing: "0.1em", marginBottom: 10, textTransform: "uppercase" }}>
      {datum && new Date(datum).toLocaleString("sl-SI", { dateStyle: "medium", timeStyle: "short" })}
      {datum && lokacija && <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span>}
      {lokacija && <span style={{ color: light ? "rgba(252, 248, 239, 0.9)" : GOLD }}>{lokacija}</span>}
    </p>
  );
}

function FeaturedCard({ img, title, excerpt, href, datum, lokacija }: {
  img: string; title: string; excerpt: string; href: string; datum?: string; lokacija?: string;
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
        <div className="novice-featured-body" style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 44px 44px" }}>
          <EventMeta datum={datum} lokacija={lokacija} light />
          <SectionLabel text="Izpostavljeni dogodek" light />
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

function EventCard({ img, title, excerpt, href, datum, lokacija, delay = 0, pretekli = false }: {
  img: string; title: string; excerpt: string; href: string; datum?: string; lokacija?: string; delay?: number; pretekli?: boolean;
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
        opacity: pretekli ? 0.75 : 1,
      }}
    >
      <Link href={href} style={{ display: "block", overflow: "hidden", height: 220, textDecoration: "none", position: "relative" }}>
        <motion.img
          src={img} alt={title}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", filter: pretekli ? "grayscale(30%)" : "none" }}
        />
        {pretekli && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "rgba(17,16,8,0.6)", borderRadius: 999,
            padding: "4px 12px", fontSize: 10, fontFamily: "sans-serif",
            color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase",
          }}>
            Preteklo
          </div>
        )}
      </Link>
      <div style={{ padding: "26px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <EventMeta datum={datum} lokacija={lokacija} />
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

export default function DogodkiPage() {
  const [dogodki, setDogodki] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("prihajajoči");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleTimeFilter = useCallback((v: TimeFilter) => {
    setTimeFilter(v);
    setPage(1);
  }, []);

  useEffect(() => {
    setLoading(true);

    const now = new Date().toISOString();

    // Prihajajoči: datum >= danes, sort ASC (najbližji prvi)
    // Pretekli:    datum < danes,  sort DESC (najnovejši prvi)
    const isPrihajajoči = timeFilter === "prihajajoči";
    const dateFilter = isPrihajajoči
      ? `&filters[datum][$gte]=${now}`
      : `&filters[datum][$lt]=${now}`;
    const sortDir = isPrihajajoči ? "asc" : "desc";

    fetchAPI(
      `dogodkis?populate=*&sort=datum:${sortDir}&pagination[page]=${page}&pagination[pageSize]=${PER_PAGE}${dateFilter}`
    ).then((res) => {
      setDogodki(res.data ?? []);
      setTotalPages(res.meta?.pagination?.pageCount ?? 1);
      setLoading(false);
    });
  }, [page, timeFilter]);

  const showFeatured = page === 1 && timeFilter === "prihajajoči";
  const [featured, ...rest] = dogodki;
  const gridItems = showFeatured ? rest : dogodki;

  return (
    <main style={{ width: "100%", backgroundColor: "var(--section-bg)", overflowX: "hidden" }}>

      {/* ── MINI HERO ── */}
      <section style={{ position: "relative", width: "100%", height: "52vh", overflow: "hidden" }}>
        <video
          src="/dogodek.mp4"
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
            Dogodki
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            style={{ marginTop: 18, fontSize: 17, color: "rgba(255,255,255,0.5)", maxWidth: 400, lineHeight: 1.7, fontFamily: "sans-serif" }}
          >
            Prihajajoči in pretekli dogodki naše koče.
          </motion.p>
        </div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(to bottom, transparent, ${CREAM})`,
        }} />
      </section>

      {/* ── VSEBINA ── */}
      <section style={{ backgroundColor: "var(--section-bg)", padding: "64px 24px 100px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ textAlign: "center", marginBottom: 16 }}
          >
            <SectionLabel text="Vse aktivnosti" />
            <h2 style={{
              fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 500, color: DARK,
              letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 36,
            }}>
              {timeFilter === "prihajajoči" ? "Prihajajoči" : "Pretekli"}{" "}
              <span style={{ color: GOLD }}>dogodki</span>
            </h2>
          </motion.div>

          <SubNav />
          <TimeFilterPills active={timeFilter} onChange={handleTimeFilter} />

          {/* Loading */}
          {loading && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(17,16,8,0.3)", fontFamily: "sans-serif", fontSize: 14, letterSpacing: "0.08em" }}>
              Nalaganje…
            </div>
          )}

          {/* Prazno */}
          {!loading && dogodki.length === 0 && (
            <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(17,16,8,0.35)", fontFamily: "sans-serif" }}>
              {timeFilter === "prihajajoči"
                ? "Trenutno ni načrtovanih dogodkov."
                : "Ni preteklih dogodkov."}
            </div>
          )}

          {/* Featured — samo prihajajoči, stran 1 */}
          {!loading && showFeatured && featured && (
            <FeaturedCard
              img={featured.slika?.[0]?.url ? getStrapiMedia(featured.slika[0].url) : "/fallback.jpg"}
              title={featured.naslov}
              excerpt={(featured.opis ?? "").slice(0, 200) + "…"}
              href={`/aktualno/dogodki/${featured.id}`}
              datum={featured.datum}
              lokacija={featured.lokacija}
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
                <EventCard
                  key={item.id}
                  img={item.slika?.[0]?.url ? getStrapiMedia(item.slika[0].url) : "/fallback.jpg"}
                  title={item.naslov}
                  excerpt={(item.opis ?? "").slice(0, 130) + "…"}
                  href={`/aktualno/dogodki/${item.id}`}
                  datum={item.datum}
                  lokacija={item.lokacija}
                  delay={i * 0.08}
                  pretekli={timeFilter === "pretekli"}
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

      <Footer />
    </main>
  );
}
