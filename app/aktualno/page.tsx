"use client";

import { motion } from "framer-motion";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Link from "next/link";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

const GOLD  = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK  = "#111008";

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
        letterSpacing: "0.06em", padding: "5px 14px", fontFamily: "sans-serif",
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
      letterSpacing: "0.05em", padding: "5px 14px", fontFamily: "sans-serif",
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

function FeaturedCard({ img, category, title, excerpt, href }: {
  img: string; category: string; title: string; excerpt: string; href: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{ position: "relative", borderRadius: 24, overflow: "hidden", gridRow: "span 2" }}
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
          background: "linear-gradient(to top, rgba(17,16,8,0.95) 0%, rgba(17,16,8,0.45) 50%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "36px 36px 42px" }}>
          <CategoryBadge category={category} light />
          <h2 style={{
            fontSize: "clamp(22px, 2.8vw, 34px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.02em", lineHeight: 1.25, margin: "0 0 14px",
          }}>
            {title}
          </h2>
          <p style={{
            fontFamily: "sans-serif", fontSize: 16, color: "rgba(255,255,255,0.72)",
            lineHeight: 1.75, marginBottom: 26, maxWidth: 400,
          }}>
            {excerpt}
          </p>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            color: GOLD, fontSize: 13, fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: "sans-serif",
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
          <p style={{ fontFamily: "sans-serif", fontSize: 14, color: "rgba(17,16,8,0.6)", lineHeight: 1.7, margin: 0 }}>
            {excerpt}
          </p>
        </div>
        <Link href={href} style={{
          display: "inline-flex", alignItems: "center", gap: 6, marginTop: 14,
          color: cfg?.color ?? GOLD, fontSize: 11, fontWeight: 700,
          letterSpacing: "0.06em", textTransform: "uppercase",
          textDecoration: "none", fontFamily: "sans-serif",
        }}>
          Preberi vse →
        </Link>
      </div>
    </motion.div>
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

export default function AktualnoPage() {
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

      {/* ── STATIČNI HERO — brez videa, takojšen ── */}
      <section style={{
        position: "relative", width: "100%", height: "44vh", overflow: "hidden",
        // Elegantno temno ozadje z zlatim gradientom — enako kot homepage dark sekcije
        background: `linear-gradient(135deg, ${DARK} 0%, #1e1c10 60%, #2a2410 100%)`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>

        {/* Dekorativni zlati krog v ozadju */}
        <div style={{
          position: "absolute", width: 600, height: 600, borderRadius: "50%",
          background: `radial-gradient(circle, rgba(201,169,110,0.08) 0%, transparent 70%)`,
          top: "50%", left: "50%", transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }} />

        {/* Subtilna grid tekstura */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        {/* Spodnji prehod */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(to bottom, transparent, ${CREAM})`,
        }} />

        {/* Vsebina */}
        <div style={{ position: "relative", zIndex: 10, textAlign: "center", padding: "0 24px" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 20 }}
          >
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.5)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.8)", fontWeight: 500, fontFamily: "sans-serif" }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.5)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.08, margin: 0 }}
          >
            Aktu<span style={{ color: GOLD }}>alno</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            style={{ marginTop: 16, fontSize: 16, color: "rgba(255,255,255,0.45)", maxWidth: 380, lineHeight: 1.7, fontFamily: "sans-serif", margin: "16px auto 0" }}
          >
            Novice, posebne ponudbe in prihajajoči dogodki na vrhu Koroške.
          </motion.p>
        </div>
      </section>

      {/* ── GRID ── */}
      <section style={{ backgroundColor: CREAM, padding: "56px 24px 100px" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          style={{ maxWidth: 1152, margin: "0 auto 40px", textAlign: "center" }}
        >
          {/* Legenda */}
          <div style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            {Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => (
              <span key={key} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: cfg.bg, border: `1px solid ${cfg.borderColor}`,
                color: cfg.color, borderRadius: 999,
                fontSize: 11, fontWeight: 700, padding: "4px 14px",
                fontFamily: "sans-serif", letterSpacing: "0.04em",
              }}>
                {cfg.icon} {cfg.label}
              </span>
            ))}
          </div>

          <h2 style={{
            fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 500, color: DARK,
            letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0,
          }}>
            Vse na enem <span style={{ color: GOLD }}>mestu</span>
          </h2>
        </motion.div>

        {loading ? (
          <GridSkeleton />
        ) : (
          <div style={{
            maxWidth: 1152, margin: "0 auto",
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "auto auto", gap: 20,
          }}>
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
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}
