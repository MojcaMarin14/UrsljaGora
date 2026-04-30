"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";
import Footer from "../components/Footer";
import { useEffect, useState, useRef } from "react";

const GOLD  = "var(--accent)";
const CREAM = "var(--section-bg)";
const DARK  = "var(--heading)";

const CATEGORY_CONFIG: Record<string, { color: string; bg: string; borderColor: string; icon: string; label: string }> = {
  Novice:  { color: "#1a6b3c", bg: "rgba(26,107,60,0.10)",  borderColor: "rgba(26,107,60,0.25)",  icon: "📰", label: "Novice"  },
  Ponudbe: { color: "#9a4e00", bg: "rgba(154,78,0,0.10)",   borderColor: "rgba(154,78,0,0.25)",   icon: "🏷️", label: "Ponudbe" },
  Dogodki: { color: "#1a3d7a", bg: "rgba(26,61,122,0.10)",  borderColor: "rgba(26,61,122,0.25)",  icon: "📅", label: "Dogodki" },
};

function CategoryBadge({ category, light = false }: { category: string; light?: boolean }) {
  const cfg = CATEGORY_CONFIG[category] ?? { color: GOLD, bg: "rgba(201,169,110,0.12)", borderColor: "rgba(201,169,110,0.3)", icon: "•", label: category };
  if (light) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
        color: "white", borderRadius: 999, fontSize: 11, fontWeight: 600,
        letterSpacing: "0.06em", padding: "5px 14px",
        textTransform: "uppercase", marginBottom: 16,
      }}>
        {cfg.icon} {cfg.label}
      </span>
    );
  }
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: cfg.bg, border: `1px solid ${cfg.borderColor}`,
      color: cfg.color, borderRadius: 999, fontSize: 11, fontWeight: 700,
      letterSpacing: "0.05em", padding: "5px 14px",
      textTransform: "uppercase", marginBottom: 14,
    }}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

function Skeleton({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(17,16,8,0.06) 25%, rgba(17,16,8,0.10) 50%, rgba(17,16,8,0.06) 75%)",
      backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite",
      borderRadius: 12, ...style,
    }} />
  );
}

function GridSkeleton() {
  return (
    <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 20 }}>
      <Skeleton style={{ gridRow: "span 2", minHeight: 480, borderRadius: 24 }} />
      <Skeleton style={{ height: 180, borderRadius: 20 }} />
      <Skeleton style={{ height: 180, borderRadius: 20 }} />
    </div>
  );
}

function FeaturedCard({ img, category, title, excerpt, href }: {
  img: string; category: string; title: string; excerpt: string; href: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden", gridRow: "span 2", border: "1px solid rgba(0,0,0,0.08)" }}
    >
      <Link href={href} style={{ display: "block", textDecoration: "none", height: "100%" }}>
        <motion.img
          src={img} alt={title}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.7 }}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 480 }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(17,16,8,0.88) 0%, rgba(17,16,8,0.35) 55%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 36px 42px" }}>
          <CategoryBadge category={category} light />
          <h2 style={{
            fontSize: "clamp(22px, 2.8vw, 34px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.02em", lineHeight: 1.25, margin: "0 0 14px",
          }}>
            {title}
          </h2>
          <p style={{ fontSize: 15, color: "rgba(255,255,255,0.7)", lineHeight: 1.75, marginBottom: 26, maxWidth: 400 }}>
            {excerpt}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: GOLD, fontSize: 13, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Preberi vse →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

function SmallCard({ img, category, title, excerpt, href, delay = 0 }: {
  img: string; category: string; title: string; excerpt: string; href: string; delay?: number;
}) {
  const cfg = CATEGORY_CONFIG[category];
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      style={{
        background: "white", borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.07)", display: "flex", flexDirection: "row",
        borderLeft: `4px solid ${cfg?.color ?? GOLD}`,
      }}
    >
      <div style={{ width: 130, flexShrink: 0, overflow: "hidden" }}>
        <Link href={href} style={{ display: "block", height: "100%", textDecoration: "none" }}>
          <motion.img
            src={img} alt={title}
            whileHover={{ scale: 1.07 }}
            transition={{ duration: 0.6 }}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </Link>
      </div>
      <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <CategoryBadge category={category} />
          <Link href={href} style={{ textDecoration: "none" }}>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: DARK, letterSpacing: "-0.01em", lineHeight: 1.35, margin: "0 0 8px" }}>
              {title}
            </h3>
          </Link>
          <p style={{ fontSize: 14, color: "rgba(17,16,8,0.6)", lineHeight: 1.7, margin: 0 }}>
            {excerpt}
          </p>
        </div>
        <Link href={href} style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
          color: cfg?.color ?? GOLD, fontSize: 11, fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase", textDecoration: "none",
        }}>
          Preberi vse →
        </Link>
      </div>
    </motion.div>
  );
}

export default function AktualnoPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const [novica,  setNovica]  = useState<any>(null);
  const [ponudba, setPonudba] = useState<any>(null);
  const [dogodek, setDogodek] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchAPI("novicas?populate=*&pagination[limit]=1"),
      fetchAPI("dogodkis?populate=*&pagination[limit]=1"),
      fetchAPI("ponudbes?populate=*&pagination[limit]=1"),
    ]).then(([resN, resD, resP]) => {
      setNovica(resN.data?.[0]  ?? null);
      setDogodek(resD.data?.[0] ?? null);
      setPonudba(resP.data?.[0] ?? null);
      setLoading(false);
    });
  }, []);

  const novinaImg  = novica?.slika?.url       ? getStrapiMedia(novica.slika.url)      : "/fallback.jpg";
  const ponudbaImg = ponudba?.slika?.[0]?.url ? getStrapiMedia(ponudba.slika[0].url)  : "/fallback.jpg";
  const dogodekImg = dogodek?.slika?.[0]?.url ? getStrapiMedia(dogodek.slika[0].url)  : "/fallback.jpg";

  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
{/* ── HERO ── */}
<section ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
  <motion.div
    style={{ y: heroY, position: "absolute", inset: 0 }}
    initial={{ scale: 1.1 }}
    animate={{ scale: 1 }}
    transition={{ duration: 1.5, ease: "easeOut" }}
  >
    <img
      src="/Drone-April-4.jpg"
      alt="Aktualno — Uršlja gora"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
    />
    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 60%, #1e1e1e 100%)" }} />
  </motion.div>

  <motion.div
    style={{
      opacity: heroOpacity,
      position: "relative", zIndex: 10,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      height: "100%", textAlign: "center", padding: "0 24px", paddingTop: 96,
    }}
  >
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
    >
      <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.7)" }} />
      <span style={{ fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 500 }}>
        Uršlja gora · Koroška
      </span>
      <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.7)" }} />
    </motion.div>

    <motion.h1
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
      style={{ fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: "white", margin: 0 }}
    >
      Aktu<span style={{ color: GOLD }}>alno</span>
    </motion.h1>

    <motion.div
      initial={{ width: 0 }}
      animate={{ width: 80 }}
      transition={{ duration: 0.8, delay: 0.6 }}
      style={{ height: 1, background: "rgba(201,169,110,0.6)", marginTop: 32, borderRadius: 999 }}
    />

    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.7 }}
      style={{ marginTop: 24, fontSize: 22, color: "rgba(255,255,255,0.65)", maxWidth: 400, lineHeight: 1.7 }}
    >
      Novice, posebne ponudbe in prihajajoči dogodki na vrhu Koroške.
    </motion.p>

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
    >
      <span style={{ fontSize: 16, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
        Pomakni navzdol
      </span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }}
      />
    </motion.div>
  </motion.div>
</section>

{/* ── TEMNA SEKCIJA ── */}
<section style={{ backgroundColor: "var(--section-bg-dark)", padding: "100px 24px 120px" }}>
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.7 }}
    style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, justifyContent: "center" }}>
      <div style={{ width: 32, height: 1, background: GOLD }} />
      <span style={{ fontSize: 13, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 700 }}>
        Vse novosti
      </span>
    </div>
    <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 500, color: "var(--heading-inv)", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 20 }}>
      Vse na enem <span style={{ color: GOLD }}>mestu</span>
    </h2>
    <p style={{ fontSize: 17, color: "var(--text-muted-inv)", lineHeight: 1.8, maxWidth: 560, margin: "0 auto 40px" }}>
      Spremljajte dogajanje na Uršlji gori — od svežih novic in sezonskih ponudb do prihajajočih dogodkov, ki jih ne smete zamuditi.
    </p>
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
        <span key={key} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: cfg.bg, border: `1px solid ${cfg.borderColor}`,
          color: cfg.color, borderRadius: 999,
          fontSize: 11, fontWeight: 700, padding: "5px 14px",
          letterSpacing: "0.04em", textTransform: "uppercase",
        }}>
          {cfg.icon} {cfg.label}
        </span>
      ))}
    </div>
  </motion.div>
</section>

{/* ── GRID — svetlo ── */}
<section style={{ backgroundColor: CREAM, padding: "80px 24px 100px" }}>
  {loading ? <GridSkeleton /> : (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="aktualno-2col" style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "auto auto", gap: 20 }}
    >
      <FeaturedCard
        img={novinaImg}
        category="Novice"
        title={novica?.naslov ?? "Novosti s koče"}
        excerpt={(novica?.opis ?? "").slice(0, 160) + "…"}
        href="/aktualno/novice"
      />
      <SmallCard
        img={ponudbaImg}
        category="Ponudbe"
        title={ponudba?.naslov ?? "Posebne ponudbe"}
        excerpt={(ponudba?.opis ?? "").slice(0, 120) + "…"}
        href="/aktualno/ponudbe"
        delay={0.08}
      />
      <SmallCard
        img={dogodekImg}
        category="Dogodki"
        title={dogodek?.naslov ?? "Prihajajoči dogodki"}
        excerpt={(dogodek?.opis ?? "").slice(0, 120) + "…"}
        href="/aktualno/dogodki"
        delay={0.16}
      />
    </motion.div>
  )}
</section>

      <Footer />
    </main>
  );
}