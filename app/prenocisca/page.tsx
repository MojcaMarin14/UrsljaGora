"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useState, useRef } from "react";
import Footer from "../components/Footer";

const MarzipanoViewer = dynamic(() => import("@/components/MarzipanoViewer"), {
  ssr: false,
});

const DARK = "var(--heading)";
const GRAY = "var(--text-muted)";
const BORDER = "var(--border-light)";

const AMENITY_ICONS: Record<string, string> = {
  "Skupna kopalnica": "🚿",
  "Skupni WC":        "🚽",
  "Posteljnina":      "🛏️",
  "Pogled na naravo": "🌄",
  "Omarica z ključavnico": "🔒",
  "Planinski ambient": "⛰️",
  "Kamin z drvmi":    "🔥",
  "Sedeži in mize":   "🪑",
  "Topla voda":       "💧",
  "Skupna raba":      "👥",
};

/* ── GLOBAL STYLES ── */
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; }

  .hero-mosaic {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 260px 260px;
    gap: 8px;
    border-radius: 16px;
    overflow: hidden;
  }
  .hero-mosaic .cell-main {
    grid-row: 1 / 3;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .hero-mosaic .cell-sm {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .hero-mosaic .cell-main img,
  .hero-mosaic .cell-sm img {
    transition: transform 0.45s ease;
  }
  .hero-mosaic .cell-main:hover img,
  .hero-mosaic .cell-sm:hover img { transform: scale(1.04); }

  .tab-strip {
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
    gap: 0;
  }
  .tab-strip::-webkit-scrollbar { display: none; }

  .tab-btn {
    padding: 14px 0;
    margin-right: 28px;
    border: none;
    border-bottom: 2px solid transparent;
    background: none;
    font-size: 14px;
    font-weight: 500;
    color: #717171;
    cursor: pointer;
    white-space: nowrap;
    transition: color 0.15s, border-color 0.15s;
    flex-shrink: 0;
  }
  .tab-btn.active   { color: #111; border-bottom-color: #111; }
  .tab-btn:hover:not(.active) { color: #333; border-bottom-color: #ccc; }

  .airbnb-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 80px;
    align-items: start;
  }

  .sticky-card {
    position: sticky;
    top: 106px;
  }

  .room-mosaic {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-template-rows: 200px 170px;
    gap: 6px;
    border-radius: 14px;
    overflow: hidden;
  }
  .room-mosaic .rm-main {
    grid-row: 1 / 3;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .room-mosaic .rm-sm {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .room-mosaic .rm-main img,
  .room-mosaic .rm-sm img {
    transition: transform 0.4s ease;
  }
  .room-mosaic .rm-main:hover img,
  .room-mosaic .rm-sm:hover img { transform: scale(1.05); }

  .amenity-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid #f0f0f0;
    font-size: 15px;
    color: #222;
  }
  .amenity-item:last-child { border-bottom: none; }

  @media (max-width: 1024px) {
    .airbnb-layout {
      grid-template-columns: 1fr !important;
      gap: 40px !important;
    }
    .sticky-card { position: static !important; }
  }
  @media (max-width: 680px) {
    .hero-mosaic {
      grid-template-columns: 1fr;
      grid-template-rows: 280px 150px 150px 150px 150px;
    }
    .hero-mosaic .cell-main { grid-row: 1; }
    .room-mosaic {
      grid-template-columns: 1fr;
      grid-template-rows: 220px 160px 160px;
    }
    .room-mosaic .rm-main { grid-row: 1; }
  }
`;

/* ── DATA ── */
const heroImages = [
  "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-1.jpg",
  "/sobe_Sony/samostojne_COMP/Sobe_Sony-5.jpg",
  "/sobe_Sony/6-8_COMP/Sobe_Sony-11.jpg",
  "/sobe_Sony/skupinske_COMP/Sobe_Sony-19.jpg",
  "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-4.jpg",
];

const rooms = [
  {
    id: 1,
    name: "Samostojne sobe",
    type: "Zasebna soba",
    capacity: "1–2 osebi",
    bed: "Zakonska ali dve ločeni postelji",
    desc: "Tihe, skromno opremljene sobe za posameznike ali pare. Leseni detajli, mehka svetloba in pogled na gorski svet ustvarjajo vzdušje pristne planinske domačnosti.",
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Pogled na naravo"],
    images: [
      "/sobe_Sony/samostojne_COMP/Sobe_Sony-5.jpg",
      "/sobe_Sony/samostojne_COMP/Sobe_Sony-7.jpg",
      "/sobe_Sony/samostojne_COMP/Sobe_Sony-8.jpg",
      "/sobe_Sony/samostojne_COMP/Sobe_Sony-25.jpg",
      "/sobe_Sony/samostojne_COMP/Sobe_Sony-29.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/samostojne_COMP/PHOTO_0015.jpg",
      "/sobe_Sony/samostojne_COMP/PHOTO_0031.jpg",
    ],
  },
  {
    id: 2,
    name: "Sobe za 6–8 ljudi",
    type: "Večposteljna soba",
    capacity: "6–8 oseb",
    bed: "Lesene nadstropne postelje",
    desc: "Planinska večposteljna soba z lesenimi posteljami v nadstropju, primerna za manjše skupine, pohodnike in goste, ki iščejo preprost ter topel kotiček po vzponu.",
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Omarica z ključavnico"],
    images: [
      "/sobe_Sony/6-8_COMP/Sobe_Sony-11.jpg",
      "/sobe_Sony/6-8_COMP/Sobe_Sony-13.jpg",
      "/sobe_Sony/6-8_COMP/Sobe_Sony-14.jpg",
      "/sobe_Sony/6-8_COMP/Sobe_Sony-15.jpg",
      "/sobe_Sony/6-8_COMP/Sobe_Sony-17.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/6-8_COMP/PHOTO_0011.jpg",
      "/sobe_Sony/6-8_COMP/PHOTO_0012.jpg",
      "/sobe_Sony/6-8_COMP/PHOTO_0013.jpg",
      "/sobe_Sony/6-8_COMP/PHOTO_0014.jpg",
      "/sobe_Sony/6-8_COMP/PHOTO_0026.jpg",
      "/sobe_Sony/6-8_COMP/PHOTO_0028.jpg",
    ],
  },
  {
    id: 3,
    name: "Skupne sobe",
    type: "Skupno prenočišče",
    capacity: "Večja skupina",
    bed: "Skupne postelje",
    desc: "Skupne sobe ohranjajo pristno planinsko vzdušje koče. Namenjene so gostom, ki jim je pomemben udoben počitek v preprostem gorskem ambientu in družabnem vzdušju.",
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Planinski ambient"],
    images: [
      "/sobe_Sony/skupinske_COMP/Sobe_Sony-18.jpg",
      "/sobe_Sony/skupinske_COMP/Sobe_Sony-19.jpg",
      "/sobe_Sony/skupinske_COMP/Sobe_Sony-21.jpg",
      "/sobe_Sony/skupinske_COMP/Sobe_Sony-22.jpg",
      "/sobe_Sony/skupinske_COMP/Sobe_Sony-30.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/skupinske_COMP/PHOTO_0018.jpg",
      "/sobe_Sony/skupinske_COMP/PHOTO_0020.jpg",
      "/sobe_Sony/skupinske_COMP/PHOTO_0030.jpg",
    ],
  },
  {
    id: 4,
    name: "Skupni prostori",
    type: "Kamin & sanitarije",
    capacity: "Vsi gostje",
    bed: "Skupni dnevni prostor s kaminom",
    desc: "Skupni prostori koče, kjer se po pohodu zbere družba, spočije ob kaminu in uporabi osnovne sanitarije. Vse skupaj ohranja topel in domač planinski značaj.",
    amenities: ["Kamin z drvmi", "Sedeži in mize", "Topla voda", "Skupna raba"],
    images: [
      "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-1.jpg",
      "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-2.jpg",
      "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-4.jpg",
      "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-10.jpg",
      "/sobe_Sony/skupni_prostori_COMP/Sobe_Sony-23.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0004.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0006.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0008.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0022.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0023.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0025.jpg",
      "/sobe_Sony/skupni_prostori_COMP/PHOTO_0029.jpg",
    ],
  },
];

/* ── LIGHTBOX ── */
function Lightbox({
  images,
  initialIndex,
  onClose,
}: {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 2000,
        background: "rgba(0,0,0,0.97)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}
    >
      {/* Top bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0,
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <button
          onClick={onClose}
          style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(255,255,255,0.1)", border: "none",
            color: "white", borderRadius: 8, padding: "8px 14px",
            fontSize: 14, fontWeight: 600, cursor: "pointer",
          }}
        >
          ← Zapri
        </button>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
          {idx + 1} / {images.length}
        </span>
        <div style={{ width: 80 }} />
      </div>

      {/* Image */}
      <motion.div
        onClick={e => e.stopPropagation()}
        style={{ position: "relative", maxWidth: 960, width: "100%", padding: "0 20px" }}
      >
        <img
          src={images[idx]} alt=""
          style={{ width: "100%", maxHeight: "78vh", objectFit: "contain", borderRadius: 10, display: "block" }}
        />
        {idx > 0 && (
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => i - 1); }}
            style={lbNavBtn("left")}
          >‹</button>
        )}
        {idx < images.length - 1 && (
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => i + 1); }}
            style={lbNavBtn("right")}
          >›</button>
        )}
      </motion.div>

      {/* Thumbnails */}
      <div style={{
        display: "flex", gap: 6, marginTop: 16, padding: "0 24px",
        overflowX: "auto", maxWidth: 960, width: "100%",
      }}>
        {images.map((src, i) => (
          <div
            key={i}
            onClick={e => { e.stopPropagation(); setIdx(i); }}
            style={{
              width: 56, height: 40, flexShrink: 0,
              borderRadius: 6, overflow: "hidden", cursor: "pointer",
              opacity: i === idx ? 1 : 0.38,
              outline: i === idx ? "2px solid white" : "2px solid transparent",
              transition: "opacity 0.2s",
            }}
          >
            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function lbNavBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side]: -4, top: "50%", transform: "translateY(-50%)",
    width: 40, height: 40, borderRadius: "50%",
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white", fontSize: 22, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}

/* ── HERO MOSAIC ── */
function HeroMosaic({ images }: { images: string[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shown = images.slice(0, 5);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="hero-mosaic">
          {/* Main large photo */}
          <div className="cell-main" onClick={() => setLightbox(0)}>
            <Image src={shown[0]} alt="Koča na Uršlji gori" fill sizes="50vw" priority style={{ objectFit: "cover" }} />
          </div>
          {/* 4 smaller photos */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {shown.slice(1, 5).map((src, i) => (
              <div key={i} className="cell-sm" onClick={() => setLightbox(i + 1)}>
                <Image src={src} alt="" fill sizes="25vw" loading="lazy" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {/* Show all photos button */}
        <button
          onClick={() => setLightbox(0)}
          style={{
            position: "absolute", bottom: 16, right: 16,
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "white", border: "1.5px solid #222",
            borderRadius: 10, padding: "10px 18px",
            fontSize: 14, fontWeight: 600, color: "#111",
            cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          <span style={{ fontSize: 16 }}>⊞</span> Pokaži vse slike
        </button>
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={images} initialIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── ROOM MOSAIC ── */
function RoomMosaic({ images, roomName }: { images: string[]; roomName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const shown = images.slice(0, 3);

  return (
    <>
      <div style={{ position: "relative" }}>
        <div className="room-mosaic">
          <div className="rm-main" onClick={() => setLightbox(0)}>
            <Image src={shown[0]} alt={roomName} fill sizes="40vw" loading="lazy" style={{ objectFit: "cover" }} />
          </div>
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 6 }}>
            {shown.slice(1, 3).map((src, i) => (
              <div key={i} className="rm-sm" onClick={() => setLightbox(i + 1)}>
                <Image src={src} alt="" fill sizes="20vw" loading="lazy" style={{ objectFit: "cover" }} />
              </div>
            ))}
          </div>
        </div>

        {images.length > 3 && (
          <button
            onClick={() => setLightbox(0)}
            style={{
              position: "absolute", bottom: 12, right: 12,
              background: "white", border: "1.5px solid #222",
              borderRadius: 8, padding: "8px 14px",
              fontSize: 13, fontWeight: 600, color: "#111",
              cursor: "pointer",
            }}
          >
            Vse {images.length} slike
          </button>
        )}
      </div>

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={images} initialIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

/* ── PANORAMA SECTION ── */
function PanoramaSection({ images, roomName }: { images: string[]; roomName: string }) {
  const [selected, setSelected] = useState(0);
  const [active, setActive] = useState<number | null>(null);

  if (!images.length) return null;

  return (
    <>
      <div style={{ position: "relative", borderRadius: 14, overflow: "hidden", background: "#111" }}>
        <div style={{ position: "relative", aspectRatio: "16/9" }}>
          <Image
            src={images[selected]}
            alt={`${roomName} 360°`}
            fill sizes="(max-width: 768px) 100vw, 55vw"
            loading="lazy"
            style={{ objectFit: "cover", opacity: 0.72 }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 90%)",
          }} />

          {/* 360 badge */}
          <span style={{
            position: "absolute", top: 14, left: 14,
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "white", borderRadius: 999,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
            padding: "5px 12px", textTransform: "uppercase",
          }}>360°</span>

          {images.length > 1 && (
            <button onClick={() => setSelected(p => p === 0 ? images.length - 1 : p - 1)} style={panoNavBtn("left")}>‹</button>
          )}
          {images.length > 1 && (
            <button onClick={() => setSelected(p => p === images.length - 1 ? 0 : p + 1)} style={panoNavBtn("right")}>›</button>
          )}

          <button
            onClick={() => setActive(selected)}
            style={{
              position: "absolute", bottom: 14, left: 14,
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "white", border: "none",
              borderRadius: 8, padding: "9px 16px",
              fontSize: 13, fontWeight: 600, color: "#111",
              cursor: "pointer",
            }}
          >
            ⟳ Odpri 360° pogled
          </button>

          {images.length > 1 && (
            <span style={{
              position: "absolute", bottom: 18, right: 14,
              fontSize: 12, color: "rgba(255,255,255,0.5)",
            }}>{selected + 1} / {images.length}</span>
          )}
        </div>
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 1100,
              background: "rgba(5,8,12,0.97)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.96 }} animate={{ scale: 1 }} exit={{ scale: 0.96 }}
              transition={{ duration: 0.22 }}
              onClick={e => e.stopPropagation()}
              style={{
                width: "min(1200px, 100%)", height: "min(78vh, 760px)",
                position: "relative", borderRadius: 18, overflow: "hidden",
                background: "#060809",
                border: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <button onClick={() => setActive(null)} style={{
                position: "absolute", top: 16, right: 16, zIndex: 2,
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                color: "white", borderRadius: 999, padding: "8px 16px",
                fontSize: 12, cursor: "pointer", letterSpacing: "0.08em",
              }}>✕ Zapri</button>

              <div style={{
                position: "absolute", top: 16, left: 16, zIndex: 2,
                background: "rgba(5,8,12,0.6)", border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.75)", borderRadius: 999,
                padding: "8px 14px", fontSize: 11, letterSpacing: "0.08em",
              }}>
                {roomName} · 360° {active + 1}
              </div>

              {images.length > 1 && (
                <button onClick={() => setActive(p => p === null ? 0 : p === 0 ? images.length - 1 : p - 1)} style={panoNavBtn("left", true)}>‹</button>
              )}
              {images.length > 1 && (
                <button onClick={() => setActive(p => p === null ? 0 : p === images.length - 1 ? 0 : p + 1)} style={panoNavBtn("right", true)}>›</button>
              )}

              <MarzipanoViewer imageUrl={images[active]} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function panoNavBtn(side: "left" | "right", large = false): React.CSSProperties {
  return {
    position: "absolute",
    [side]: large ? 18 : 12, top: "50%", transform: "translateY(-50%)",
    zIndex: 2,
    width: large ? 44 : 36, height: large ? 44 : 36,
    borderRadius: "50%",
    background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
    color: "white", fontSize: 22, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  };
}

/* ── INQUIRY CARD ── */
function InquiryCard({ roomName, type }: { roomName: string; type: string }) {
  return (
    <div style={{
      border: `1px solid ${BORDER}`,
      borderRadius: 16,
      padding: "28px 24px",
      boxShadow: "0 6px 20px rgba(0,0,0,0.1), 0 1px 4px rgba(0,0,0,0.06)",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "#f7f7f7", borderRadius: 999,
          padding: "4px 12px", fontSize: 12,
          fontWeight: 600, color: GRAY,
          letterSpacing: "0.06em", textTransform: "uppercase",
          marginBottom: 12,
        }}>
          {type}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: 0, letterSpacing: "-0.01em" }}>
          {roomName}
        </h3>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />

      {/* Key facts */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
        {[
          { icon: "⛰️", text: "1699 m nadmorske višine" },
          { icon: "🛏️", text: "Posteljnina vključena" },
          { icon: "🏔️", text: "Pristno planinsko vzdušje" },
          { icon: "📍", text: "Uršlja gora, Koroška" },
        ].map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#444" }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{f.icon}</span>
            {f.text}
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href="/kontakt"
        style={{
          display: "block", textAlign: "center",
          background: "var(--accent)", color: "white",
          borderRadius: 12, padding: "16px 24px",
          fontSize: 15, fontWeight: 700,
          textDecoration: "none", letterSpacing: "0.01em",
          transition: "background 0.2s",
        }}
      >
        Kontaktirajte nas
      </a>

      <p style={{
        textAlign: "center", marginTop: 14,
        fontSize: 13, color: GRAY,
      }}>
        Brezplačno povpraševanje · Hitro odgovorimo
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: BORDER, margin: "20px 0" }} />

      {/* Rating */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20 }}>★</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: DARK }}>4.9</span>
          <span style={{ fontSize: 14, color: GRAY }}>· Uršlja gora</span>
        </div>
        <span style={{ fontSize: 14, color: GRAY }}>Koroška, Slovenija</span>
      </div>
    </div>
  );
}

/* ── PAGE ── */
export default function PrenociscaPage() {
  const [activeRoom, setActiveRoom] = useState(0);
  const room = rooms[activeRoom];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  return (
    <main style={{ background: "var(--section-bg-white)", overflowX: "hidden" }}>
      <style>{globalStyles}</style>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div
          style={{ y: heroY, position: "absolute", inset: 0 }}
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        >
          <Image
            src="/drone1.jpg"
            alt="Prenočišča na Uršlji gori"
            fill priority sizes="100vw"
            style={{ objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 60%, #1e1e1e 100%)" }} />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", textAlign: "center", padding: "0 24px", paddingTop: 80,
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
            transition={{ duration: 1, delay: 0.35 }}
            style={{ fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: "white", margin: 0 }}
          >
            Prenočišča<br />
            <span style={{ color: "var(--accent)" }}>na vrhu</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ height: 1, background: "rgba(201,169,110,0.6)", marginTop: 32, borderRadius: 999 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.8 }}
            style={{ marginTop: 24, fontSize: 22, color: "rgba(255,255,255,0.65)", maxWidth: 400, lineHeight: 1.7 }}
          >
            Prenoči pod zvezdami Koroške — preprosto, toplo in nepozabno.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
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
      </div>

      {/* ── TITLE SECTION ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px 24px" }}>
        <h1 style={{
          fontSize: "clamp(24px, 3.5vw, 34px)", fontWeight: 700,
          color: DARK, letterSpacing: "-0.02em", margin: "0 0 10px",
        }}>
          Prenočišča na Uršlji gori
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap", fontSize: 15 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontWeight: 600, color: DARK }}>
            ★ 4.9
          </span>
          <span style={{ color: GRAY }}>·</span>
          <span style={{
            color: DARK, fontWeight: 600,
            textDecoration: "underline", textUnderlineOffset: 3,
          }}>12 ocen</span>
          <span style={{ color: GRAY }}>·</span>
          <span style={{
            color: DARK,
            textDecoration: "underline", textUnderlineOffset: 3,
          }}>Uršlja gora, Koroška</span>
          <span style={{ color: GRAY }}>·</span>
          <span style={{ color: GRAY }}>1699 m n.v.</span>
        </div>
      </div>

      {/* ── HERO MOSAIC ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
        <HeroMosaic images={heroImages} />
      </div>

      {/* ── STICKY TAB BAR ── */}
      <div style={{
        borderBottom: `1px solid ${BORDER}`,
        position: "sticky", top: 72, zIndex: 50,
        background: "white",
      }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <div className="tab-strip">
            {rooms.map((r, i) => (
              <button
                key={r.id}
                className={`tab-btn${activeRoom === i ? " active" : ""}`}
                onClick={() => setActiveRoom(i)}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 100px" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={room.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="airbnb-layout">

              {/* ── LEFT COLUMN ── */}
              <div>

                {/* Room photo mosaic */}
                <div style={{ marginBottom: 32 }}>
                  <RoomMosaic images={room.images} roomName={room.name} />
                </div>

                {/* Room header */}
                <div style={{ paddingBottom: 28, borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h2 style={{ fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 700, color: DARK, margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                        {room.name}
                      </h2>
                      <p style={{ fontSize: 16, color: GRAY, margin: 0 }}>
                        {room.type} · {room.capacity}
                      </p>
                    </div>
                  </div>

                  {/* Detail chips */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                    {[
                      { icon: "🛏️", label: room.bed },
                      { icon: "👥", label: room.capacity },
                    ].map((d, i) => (
                      <span key={i} style={{
                        display: "inline-flex", alignItems: "center", gap: 7,
                        background: "#f7f7f7", borderRadius: 999,
                        padding: "8px 16px", fontSize: 14, color: DARK,
                        border: `1px solid #eee`,
                      }}>
                        <span style={{ fontSize: 16 }}>{d.icon}</span>
                        {d.label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Facility highlights */}
                <div style={{ padding: "28px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {[
                      { icon: "🏔️", title: "Planinska koča", sub: "Pristno gorsko vzdušje na 1699 m nadmorske višine" },
                      { icon: "⭐", title: "Ocenjena 4.9", sub: "Gostje radi poudarjajo razglede in vzdušje" },
                      { icon: "🌿", title: "Narava in tišina", sub: "Stran od mestnega vrveža, tik ob gorskih poteh" },
                    ].map((h, i) => (
                      <div key={i} style={{ display: "flex", gap: 16, padding: "16px 0", borderBottom: i < 2 ? `1px solid #f5f5f5` : "none" }}>
                        <span style={{ fontSize: 24, flexShrink: 0, lineHeight: 1.2 }}>{h.icon}</span>
                        <div>
                          <div style={{ fontSize: 15, fontWeight: 600, color: DARK }}>{h.title}</div>
                          <div style={{ fontSize: 14, color: GRAY, marginTop: 2 }}>{h.sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: "28px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <p style={{ fontSize: 16, color: "#333", lineHeight: 1.85, margin: 0 }}>
                    {room.desc}
                  </p>
                </div>

                {/* Amenities */}
                <div style={{ padding: "28px 0", borderBottom: `1px solid ${BORDER}` }}>
                  <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: "0 0 20px", letterSpacing: "-0.01em" }}>
                    Kaj ponuja ta soba
                  </h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 32px" }}>
                    {room.amenities.map(a => (
                      <div key={a} className="amenity-item">
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{AMENITY_ICONS[a] ?? "✓"}</span>
                        <span>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 360° section */}
                {room.panoramaImages.length > 0 && (
                  <div style={{ padding: "28px 0" }}>
                    <h3 style={{ fontSize: 20, fontWeight: 700, color: DARK, margin: "0 0 8px", letterSpacing: "-0.01em" }}>
                      Virtualni 360° ogled
                    </h3>
                    <p style={{ fontSize: 15, color: GRAY, margin: "0 0 20px" }}>
                      Oglejte si sobo v interaktivnem 360° panoramskem pogledu.
                    </p>
                    <PanoramaSection images={room.panoramaImages} roomName={room.name} />
                  </div>
                )}

              </div>

              {/* ── RIGHT COLUMN — sticky card ── */}
              <div>
                <div className="sticky-card">
                  <InquiryCard roomName={room.name} type={room.type} />
                </div>
              </div>

            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── FOOTER ── */}
      <Footer />
    </main>
  );
}
