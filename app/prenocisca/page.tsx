"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const GOLD = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK = "#111008";

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 28, height: 1, background: light ? "rgba(201,169,110,0.7)" : GOLD, flexShrink: 0 }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
        color: light ? "rgba(201,169,110,0.85)" : GOLD, fontWeight: 600
      }}>
        {text}
      </span>
    </div>
  );
}

const rooms = [
  {
    id: 1,
    name: "Skupna soba",
    type: "Dormitorij · Bunk beds",
    desc: "Planinska skupna soba z lesenimi posteljami v nadstropju — v pravem duhu gorskih koč. Primerna za pohodniške skupine in posameznike, ki iščejo preprost in topel kotiček po vzponu.",
    details: [
      { icon: "🛏️", label: "Postelje", value: "Bunk beds (lesene nadstropne postelje)" },
      { icon: "👥", label: "Kapaciteta", value: "Do 8 oseb" },
    ],
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Omarica z ključavnico"],
    images: ["/soba-skupna1.jpg", "/soba-skupna2.jpg"],
  },
  {
    id: 2,
    name: "Samostojne sobe",
    type: "Zasebne sobe",
    desc: "Tihe, skromno opremljene sobe za posameznike ali pare. Leseni detajli, mehka svetloba in pogled na gorski svet ustvarjajo vzdušje pristne planinske domačnosti.",
    details: [
      { icon: "🛏️", label: "Postelja", value: "Zakonska ali dve ločeni" },
      { icon: "👥", label: "Kapaciteta", value: "1–2 osebi" },
    ],
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Pogled na naravo"],
    images: ["/soba-zas1.jpg", "/soba-zas2.jpg", "/soba-zas3.jpg"],
  },
  {
    id: 3,
    name: "Kopalnica & WC",
    type: "Skupne sanitarije",
    desc: "Skupni sanitarni prostori so vzdrževano čisti in funkcionalni — na voljo vsem gostom koče. Kopalnica s prho in ločen WC zagotavljata udobje po napornem pohodu.",
    details: [
      { icon: "🚿", label: "Kopalnica", value: "Prha, umivalnik, ogledalo" },
      { icon: "🚽", label: "WC", value: "Ločen od kopalnice" },
    ],
    amenities: ["Topla voda", "Brisače na voljo", "Čistila in higiena", "Skupna raba"],
    images: ["/kopalnica1.jpg"],
  },
  {
    id: 4,
    name: "Soba s kaminom",
    type: "Dnevna soba · Skupni prostor",
    desc: "Srce koče — topla dnevna soba s kaminom, kjer se po pohodu zbere vsa družba. Les, ogenj in vonj po smreki. Tukaj se pripovedujejo zgodbe, pijejo čaji in kujejo načrti za jutri.",
    details: [
      { icon: "🔥", label: "Kamin", value: "Drva, pravi gorski ambient" },
      { icon: "🛋️", label: "Prostor", value: "Skupni, za vse goste" },
    ],
    amenities: ["Kamin z drvmi", "Sedeži in mize", "Pogled na pokrajino", "Topli napitki"],
    images: ["/kamin1.jpg", "/kamin2.jpg", "/kamin3.jpg"],
  },
];

// Adaptive gallery: shows only as many slots as there are images, no empty cells, no "+X" button
function RoomGallery({ images, roomName }: { images: string[]; roomName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;

  // Layout configs based on image count
  const getGridStyle = (): React.CSSProperties => {
    if (count === 1) return { display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "360px", gap: 3, borderRadius: 18, overflow: "hidden" };
    if (count === 2) return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "330px", gap: 3, borderRadius: 18, overflow: "hidden" };
    if (count === 3) return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 160px", gap: 3, borderRadius: 18, overflow: "hidden" };
    // 4+
    return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 110px", gap: 3, borderRadius: 18, overflow: "hidden" };
  };

  const imgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

  const Cell = ({ index, style }: { index: number; style?: React.CSSProperties }) => (
    <motion.div onClick={() => setLightbox(index)} style={{ overflow: "hidden", cursor: "pointer", ...style }}>
      <motion.img src={images[index]} alt={`${roomName} ${index + 1}`}
        whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }}
        style={imgStyle} />
    </motion.div>
  );

  return (
    <>
      <div style={getGridStyle()}>
        {count === 1 && <Cell index={0} />}

        {count === 2 && (
          <>
            <Cell index={0} />
            <Cell index={1} />
          </>
        )}

        {count === 3 && (
          <>
            {/* Big left spanning both rows */}
            <Cell index={0} style={{ gridColumn: "1", gridRow: "1 / 3" }} />
            {/* Two stacked right */}
            <Cell index={1} style={{ gridColumn: "2", gridRow: "1" }} />
            <Cell index={2} style={{ gridColumn: "2", gridRow: "2" }} />
          </>
        )}

        {count >= 4 && (
          <>
            {/* Big left */}
            <Cell index={0} style={{ gridColumn: "1", gridRow: "1 / 3" }} />
            {/* Top-right: up to 2 */}
            <div style={{ gridColumn: "2", gridRow: "1", display: "grid", gridTemplateColumns: count >= 3 ? "1fr 1fr" : "1fr", gap: 3 }}>
              <Cell index={1} />
              {count >= 3 && <Cell index={2} />}
            </div>
            {/* Bottom-right: remaining, max 3 */}
            <div style={{ gridColumn: "2", gridRow: "2", display: "grid", gridTemplateColumns: `repeat(${Math.min(count - 3, 3)}, 1fr)`, gap: 3 }}>
              {images.slice(3, 6).map((_, i) => (
                <Cell key={i} index={i + 3} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails strip below gallery (only if 2+ images) */}
      {count > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <motion.img key={i} src={img} alt="" onClick={() => setLightbox(i)}
              whileHover={{ opacity: 1 }}
              style={{ width: 52, height: 36, objectFit: "cover", borderRadius: 6, cursor: "pointer", opacity: 0.55, transition: "opacity 0.2s" }} />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(17,16,8,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
            <motion.div initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.28 }} onClick={e => e.stopPropagation()}
              style={{ position: "relative", maxWidth: 900, width: "100%" }}>
              <img src={images[lightbox]} alt={roomName}
                style={{ width: "100%", borderRadius: 12, display: "block", maxHeight: "78vh", objectFit: "contain" }} />
              {lightbox > 0 && (
                <button onClick={() => setLightbox(l => l !== null ? l - 1 : null)}
                  style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>‹</button>
              )}
              {lightbox < images.length - 1 && (
                <button onClick={() => setLightbox(l => l !== null ? l + 1 : null)}
                  style={{ position: "absolute", right: -48, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}>›</button>
              )}
              <button onClick={() => setLightbox(null)}
                style={{ position: "absolute", top: -40, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                ✕ zapri
              </button>
              <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <motion.img key={i} src={img} alt="" onClick={() => setLightbox(i)} whileHover={{ opacity: 1 }}
                    style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6, cursor: "pointer", opacity: i === lightbox ? 1 : 0.38, outline: i === lightbox ? `2px solid ${GOLD}` : "none", transition: "opacity 0.2s" }} />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
};
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export default function PrenociscaPage() {
  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <img src="/drone1.jpg" alt="Prenočišča"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,16,8,0.3) 0%, rgba(17,16,8,0.72) 100%)" }} />
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
          style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.6)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.85)", fontWeight: 500 }}>Uršlja gora · Koroška</span>
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.6)" }} />
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Prenočišča<br /><span style={{ color: GOLD }}>na vrhu</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 16, color: "rgba(255,255,255,0.52)", maxWidth: 400, lineHeight: 1.75 }}>
            Prenoči pod zvezdami Koroške — preprosto, toplo in nepozabno.
          </p>
        </motion.div>
      </section>

      {/* ── SOBE ── */}
      <section style={{ backgroundColor: "white", padding: "80px 24px 100px" }}>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}
          style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 88 }}>
          {rooms.map((room, idx) => (
            <motion.div key={room.id} variants={fadeUp}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>

              {/* Gallery */}
              <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
                <RoomGallery images={room.images} roomName={room.name} />
              </div>

              {/* Info */}
              <div style={{ order: idx % 2 === 1 ? 1 : 2, paddingTop: 6 }}>
                <SectionLabel text={room.type} />
                <h2 style={{ fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 14, marginTop: 0 }}>
                  {room.name}
                </h2>
                <p style={{ fontSize: 15.5, color: "rgba(17,16,8,0.6)", lineHeight: 1.82, marginBottom: 28 }}>
                  {room.desc}
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28 }}>
                  {room.details.map((d, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <span style={{ fontSize: 15 }}>{d.icon}</span>
                      <span style={{ fontSize: 11, color: GOLD, fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", minWidth: 86 }}>{d.label}</span>
                      <span style={{ fontSize: 14, color: "rgba(17,16,8,0.62)" }}>{d.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ width: "100%", height: 1, background: "rgba(17,16,8,0.08)", marginBottom: 22 }} />

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px 12px" }}>
                  {room.amenities.map((a, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: "rgba(17,16,8,0.62)" }}>{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── INFO BANNER ── */}
      <section style={{ backgroundColor: DARK, padding: "72px 24px" }}>
        <motion.div initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 860, margin: "0 auto" }}>
          <SectionLabel text="Informacije" light />
          <h2 style={{ fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 500, color: "white", letterSpacing: "-0.025em", marginBottom: 40 }}>
            Praktične <span style={{ color: GOLD }}>informacije</span>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 32, marginBottom: 40 }}>
            {[
              { label: "Prijava / odjava", value: "od 14:00 / do 10:00" },
              { label: "Rezervacije", value: "telefon ali e-pošta" },
              { label: "Kopalnica & WC", value: "skupna raba" },
            ].map((info, i) => (
              <div key={i}>
                <p style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, marginBottom: 8, fontWeight: 600 }}>{info.label}</p>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", fontWeight: 400, margin: 0 }}>{info.value}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "22px 26px", border: "1px solid rgba(201,169,110,0.2)", borderRadius: 14 }}>
            <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.48)", lineHeight: 1.82, margin: 0 }}>
              <span style={{ color: GOLD, fontWeight: 600 }}>Opomba: </span>
              Koča ima omejeno število ležišč. Priporočamo zgodnjo rezervacijo, zlasti ob vikendih in v poletnih mesecih. Za skupinske rezervacije nas kontaktirajte neposredno.
            </p>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
