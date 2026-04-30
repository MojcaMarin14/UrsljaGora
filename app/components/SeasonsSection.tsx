"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const seasons = {
  summer: {
    label: "Poletje",
    emoji: "☀️",
    img: "/pol1.jpg",
    title: "Poletna doživetja",
    items: [
      { icon: "🥾", text: "Pohodništvo po označenih poteh" },
      { icon: "👨‍👩‍👧", text: "Družinske poti primerne za otroke" },
      { icon: "🚵", text: "Gorsko kolesarjenje – single traili, krožne ture" },
      { icon: "📸", text: "Fotografiranje razgledov, sončni vzhodi in zahodi" },
      { icon: "🌸", text: "Flora: zoisova zvončnica, kortuzovka" },
      { icon: "⛪", text: "Obisk cerkve sv. Uršule" },
    ],
  },
  winter: {
    label: "Zima",
    emoji: "❄️",
    img: "/zim1.jpg",
    title: "Zimska doživetja",
    items: [
      { icon: "⛷️", text: "Turno smučanje" },
      { icon: "🥾", text: "Zimsko pohodništvo" },
      { icon: "🏔️", text: "Razgledi na zasneženo Koroško" },
      { icon: "🍵", text: "Topli obroki in čaj v planinskem domu" },
      { icon: "⛪", text: "Cerkev sv. Uršule v zimski idili" },
      { icon: "🎿", text: "Smučišča: Ošven, Kope, Peca" },
    ],
  },
};

type Season = "summer" | "winter";

export default function SeasonsSection() {
  const [season, setSeason] = useState<Season>("summer");
  const data = seasons[season];

  return (
    <section style={{ backgroundColor: "var(--section-bg)", padding: "120px 24px", overflow: "hidden" }}>
      <div style={{ maxWidth: 1152, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
            <span style={{ fontSize: 22, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--accent)", fontWeight: 600 }}>
              Letni časi
            </span>
            <div style={{ width: 28, height: 1, background: "var(--accent)" }} />
          </div>
          <h2 style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 500, color: "var(--heading)", letterSpacing: "-0.025em", margin: "0 0 16px" }}>
            Uršlja gora skozi <span style={{ color: "var(--accent)" }}>vse letne čase</span>
          </h2>
          <p style={{ fontSize: 17, color: "var(--text-muted)", maxWidth: 480, margin: "0 auto" }}>
            Vsaka sezona prinese svojstveno lepoto in doživetja.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 56 }}>
          <div style={{
            display: "flex", background: "var(--section-bg-white)",
            borderRadius: 999, padding: 4,
            border: "1px solid var(--border-light)", gap: 4,
          }}>
            {(["summer", "winter"] as Season[]).map((s) => (
              <button
                key={s}
                onClick={() => setSeason(s)}
                style={{
                  display: "flex", alignItems: "center", gap: 8,
                  padding: "10px 28px", borderRadius: 999, border: "none",
                  cursor: "pointer", fontSize: 14, fontWeight: 600,
                  transition: "all 0.3s",
                  background: season === s ? "var(--heading)" : "transparent",
                  color: season === s ? "var(--section-bg)" : "var(--text-muted)",
                }}
              >
                <span style={{ fontSize: 16 }}>{seasons[s].emoji}</span>
                {seasons[s].label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={season}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 32, alignItems: "stretch",
            }}
          >
            <div style={{ borderRadius: 24, overflow: "hidden", minHeight: 420, position: "relative" }}>
              <motion.img
                src={data.img} alt={data.title}
                initial={{ scale: 1.08 }} animate={{ scale: 1 }}
                transition={{ duration: 0.7 }}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", minHeight: 420 }}
              />
              <div style={{
                position: "absolute", top: 20, left: 20,
                background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)",
                borderRadius: 999, padding: "8px 18px",
                display: "flex", alignItems: "center", gap: 8,
                border: "1px solid rgba(255,255,255,0.15)",
              }}>
                <span style={{ fontSize: 18 }}>{data.emoji}</span>
                <span style={{ color: "white", fontSize: 13, fontWeight: 600, letterSpacing: "0.05em" }}>{data.label}</span>
              </div>
            </div>

            <div style={{
              background: "var(--section-bg-white)", borderRadius: 24,
              padding: "48px 44px",
              border: "1px solid var(--border-light)",
              display: "flex", flexDirection: "column", justifyContent: "center",
            }}>
              <h3 style={{ fontSize: 30, fontWeight: 500, color: "var(--heading)", letterSpacing: "-0.02em", marginBottom: 32 }}>
                {data.title}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {data.items.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: "var(--accent-subtle)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 18, flexShrink: 0,
                      border: "1px solid var(--border-light)",
                    }}>
                      {item.icon}
                    </div>
                    <span style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.5 }}>
                      {item.text}
                    </span>
                  </motion.div>
                ))}
              </div>

              <div style={{ marginTop: 36, paddingTop: 28, borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--accent)" }} />
                <span style={{ fontSize: 13, color: "var(--text-muted-2)", letterSpacing: "0.05em" }}>
                  Uršlja gora · {season === "summer" ? "Poletna sezona" : "Zimska sezona"}
                </span>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
