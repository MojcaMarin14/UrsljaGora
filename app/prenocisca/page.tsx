"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import type { Transition } from "framer-motion";
import { useState } from "react";
import MarzipanoViewer from "@/components/MarzipanoViewer";

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
    name: "Samostojne sobe",
    type: "Zasebne sobe",
    desc: "Tihe, skromno opremljene sobe za posameznike ali pare. Leseni detajli, mehka svetloba in pogled na gorski svet ustvarjajo vzdušje pristne planinske domačnosti.",
    details: [
      { icon: "🛏️", label: "Postelja", value: "Zakonska ali dve ločeni" },
      { icon: "👥", label: "Kapaciteta", value: "1–2 osebi" },
    ],
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Pogled na naravo"],
    images: [
      "/sobe_Sony/samostojne/Sobe_Sony-5.jpg",
      "/sobe_Sony/samostojne/Sobe_Sony-7.jpg",
      "/sobe_Sony/samostojne/Sobe_Sony-8.jpg",
      "/sobe_Sony/samostojne/Sobe_Sony-25.jpg",
      "/sobe_Sony/samostojne/Sobe_Sony-29.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/samostojne/PHOTO_0015.jpg",
      "/sobe_Sony/samostojne/PHOTO_0031.jpg",
    ],
  },
  {
    id: 2,
    name: "Sobe za 6 - 8 ljudi",
    type: "Večposteljne sobe",
    desc: "Planinska večposteljna soba z lesenimi posteljami v nadstropju, primerna za manjše skupine, pohodnike in goste, ki iščejo preprost ter topel kotiček po vzponu.",
    details: [
      { icon: "🛏️", label: "Postelje", value: "Lesene nadstropne postelje" },
      { icon: "👥", label: "Kapaciteta", value: "6–8 oseb" },
    ],
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Omarica z ključavnico"],
    images: [
      "/sobe_Sony/6-8/Sobe_Sony-11.jpg",
      "/sobe_Sony/6-8/Sobe_Sony-13.jpg",
      "/sobe_Sony/6-8/Sobe_Sony-14.jpg",
      "/sobe_Sony/6-8/Sobe_Sony-15.jpg",
      "/sobe_Sony/6-8/Sobe_Sony-17.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/6-8/PHOTO_0011.jpg",
      "/sobe_Sony/6-8/PHOTO_0012.jpg",
      "/sobe_Sony/6-8/PHOTO_0013.jpg",
      "/sobe_Sony/6-8/PHOTO_0014.jpg",
      "/sobe_Sony/6-8/PHOTO_0026.jpg",
      "/sobe_Sony/6-8/PHOTO_0028.jpg",
    ],
  },
  {
    id: 3,
    name: "Skupne sobe",
    type: "Skupna prenočišča",
    desc: "Skupne sobe ohranjajo pristno planinsko vzdušje koče. Namenjene so gostom, ki jim je pomemben udoben počitek v preprostem gorskem ambientu in družabnem vzdušju.",
    details: [
      { icon: "🛏️", label: "Ležišča", value: "Skupna postavitev" },
      { icon: "👥", label: "Uporaba", value: "Za več gostov hkrati" },
    ],
    amenities: ["Skupna kopalnica", "Skupni WC", "Posteljnina", "Planinski ambient"],
    images: [
      "/sobe_Sony/skupinske/Sobe_Sony-18.jpg",
      "/sobe_Sony/skupinske/Sobe_Sony-19.jpg",
      "/sobe_Sony/skupinske/Sobe_Sony-21.jpg",
      "/sobe_Sony/skupinske/Sobe_Sony-22.jpg",
      "/sobe_Sony/skupinske/Sobe_Sony-30.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/skupinske/PHOTO_0018.jpg",
      "/sobe_Sony/skupinske/PHOTO_0020.jpg",
      "/sobe_Sony/skupinske/PHOTO_0030.jpg",
    ],
  },
  {
    id: 4,
    name: "Skupni prostori",
    type: "Kamin, kopalnica in WC",
    desc: "Gostom so na voljo skupni prostori koče, kjer se po pohodu zbere družba, spočije ob kaminu in uporabi osnovne sanitarije. Vse skupaj ohranja topel in domač planinski značaj.",
    details: [
      { icon: "🔥", label: "Kamin", value: "Skupni dnevni prostor" },
      { icon: "🚿", label: "Sanitarije", value: "Kopalnica in WC za goste" },
    ],
    amenities: ["Kamin z drvmi", "Sedeži in mize", "Topla voda", "Skupna raba"],
    images: [
      "/sobe_Sony/skupni_prostori/Sobe_Sony-1.jpg",
      "/sobe_Sony/skupni_prostori/Sobe_Sony-2.jpg",
      "/sobe_Sony/skupni_prostori/Sobe_Sony-4.jpg",
      "/sobe_Sony/skupni_prostori/Sobe_Sony-10.jpg",
      "/sobe_Sony/skupni_prostori/Sobe_Sony-23.jpg",
    ],
    panoramaImages: [
      "/sobe_Sony/skupni_prostori/PHOTO_0004.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0006.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0008.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0022.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0023.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0025.jpg",
      "/sobe_Sony/skupni_prostori/PHOTO_0029.jpg",
    ],
  },
];

function PanoramaGallery({
  images,
  roomName,
}: {
  images: string[];
  roomName: string;
}) {
  const [selectedPanorama, setSelectedPanorama] = useState(0);
  const [activePanorama, setActivePanorama] = useState<number | null>(null);

  if (!images.length) return null;

  const goToPrevious = () => {
    setSelectedPanorama((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const goToNext = () => {
    setSelectedPanorama((current) => (current === images.length - 1 ? 0 : current + 1));
  };

  return (
    <>
      <div style={{ marginTop: 28 }}>
        <p
          style={{
            fontSize: 11,
            color: GOLD,
            fontWeight: 600,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            margin: "0 0 14px",
          }}
        >
          360 Pogledi
        </p>

        <div
          style={{
            border: "1px solid rgba(17,16,8,0.1)",
            borderRadius: 18,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden" }}>
            <img
              src={images[selectedPanorama]}
              alt={`${roomName} 360 ${selectedPanorama + 1}`}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(17,16,8,0.72), rgba(17,16,8,0.08))",
              }}
            />

            <button
              type="button"
              onClick={goToPrevious}
              style={{
                position: "absolute",
                top: "50%",
                left: 14,
                transform: "translateY(-50%)",
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(17,16,8,0.4)",
                color: "white",
                cursor: "pointer",
                fontSize: 22,
              }}
            >
              ‹
            </button>

            <button
              type="button"
              onClick={goToNext}
              style={{
                position: "absolute",
                top: "50%",
                right: 14,
                transform: "translateY(-50%)",
                width: 42,
                height: 42,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(17,16,8,0.4)",
                color: "white",
                cursor: "pointer",
                fontSize: 22,
              }}
            >
              ›
            </button>

            <div
              style={{
                position: "absolute",
                left: 14,
                bottom: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              360 pogled {selectedPanorama + 1} / {images.length}
            </div>
          </div>

          <div style={{ padding: "14px 16px 16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p style={{ margin: 0, fontSize: 14, color: DARK, fontWeight: 500 }}>
                  Panorama {selectedPanorama + 1}
                </p>
                <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "rgba(17,16,8,0.58)", lineHeight: 1.5 }}>
                  Interaktivni pogled prostora, ki ga lahko zavrtiš v vse smeri.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActivePanorama(selectedPanorama)}
                style={{
                  border: "1px solid rgba(17,16,8,0.1)",
                  background: DARK,
                  color: "white",
                  borderRadius: 999,
                  padding: "12px 16px",
                  cursor: "pointer",
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Odpri 360
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activePanorama !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePanorama(null)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 1100,
              background: "rgba(7,10,14,0.96)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 24,
            }}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(1200px, 100%)",
                height: "min(78vh, 760px)",
                position: "relative",
                borderRadius: 20,
                overflow: "hidden",
                background: "#05080c",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setActivePanorama(null)}
                style={{
                  position: "absolute",
                  top: 18,
                  right: 18,
                  zIndex: 2,
                  border: "1px solid rgba(255,255,255,0.18)",
                  background: "rgba(255,255,255,0.08)",
                  color: "white",
                  borderRadius: 999,
                  padding: "10px 14px",
                  cursor: "pointer",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                Zapri
              </button>

              <div
                style={{
                  position: "absolute",
                  top: 18,
                  left: 18,
                  zIndex: 2,
                  padding: "10px 14px",
                  borderRadius: 999,
                  background: "rgba(5,8,12,0.62)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.84)",
                  fontSize: 12,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                {roomName} · 360 pogled {activePanorama + 1}
              </div>

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActivePanorama((current) =>
                      current === null
                        ? 0
                        : current === 0
                          ? images.length - 1
                          : current - 1
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: 18,
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 24,
                  }}
                >
                  ‹
                </button>
              )}

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() =>
                    setActivePanorama((current) =>
                      current === null
                        ? 0
                        : current === images.length - 1
                          ? 0
                          : current + 1
                    )
                  }
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: 18,
                    transform: "translateY(-50%)",
                    zIndex: 2,
                    width: 46,
                    height: 46,
                    borderRadius: "50%",
                    border: "1px solid rgba(255,255,255,0.18)",
                    background: "rgba(255,255,255,0.08)",
                    color: "white",
                    cursor: "pointer",
                    fontSize: 24,
                  }}
                >
                  ›
                </button>
              )}

              <MarzipanoViewer imageUrl={images[activePanorama]} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function RoomGallery({ images, roomName }: { images: string[]; roomName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;

  const getGridStyle = (): React.CSSProperties => {
    if (count === 1) return { display: "grid", gridTemplateColumns: "1fr", gridTemplateRows: "360px", gap: 3, borderRadius: 18, overflow: "hidden" };
    if (count === 2) return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "330px", gap: 3, borderRadius: 18, overflow: "hidden" };
    if (count === 3) return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 160px", gap: 3, borderRadius: 18, overflow: "hidden" };
    return { display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "220px 110px", gap: 3, borderRadius: 18, overflow: "hidden" };
  };

  const imgStyle: React.CSSProperties = { width: "100%", height: "100%", objectFit: "cover", display: "block" };

  const renderCell = (index: number, style?: React.CSSProperties) => (
    <motion.div key={`${roomName}-${index}`} onClick={() => setLightbox(index)} style={{ overflow: "hidden", cursor: "pointer", ...style }}>
      <motion.img
        src={images[index]}
        alt={`${roomName} ${index + 1}`}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
        style={imgStyle}
      />
    </motion.div>
  );

  return (
    <>
      <div style={getGridStyle()}>
        {count === 1 && renderCell(0)}

        {count === 2 && (
          <>
            {renderCell(0)}
            {renderCell(1)}
          </>
        )}

        {count === 3 && (
          <>
            {renderCell(0, { gridColumn: "1", gridRow: "1 / 3" })}
            {renderCell(1, { gridColumn: "2", gridRow: "1" })}
            {renderCell(2, { gridColumn: "2", gridRow: "2" })}
          </>
        )}

        {count >= 4 && (
          <>
            {renderCell(0, { gridColumn: "1", gridRow: "1 / 3" })}
            <div style={{ gridColumn: "2", gridRow: "1", display: "grid", gridTemplateColumns: count >= 3 ? "1fr 1fr" : "1fr", gap: 3 }}>
              {renderCell(1)}
              {count >= 3 && renderCell(2)}
            </div>
            <div style={{ gridColumn: "2", gridRow: "2", display: "grid", gridTemplateColumns: `repeat(${Math.min(count - 3, 3)}, 1fr)`, gap: 3 }}>
              {images.slice(3, 6).map((_, i) => (
                renderCell(i + 3)
              ))}
            </div>
          </>
        )}
      </div>

      {count > 1 && (
        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          {images.map((img, i) => (
            <motion.img
              key={i}
              src={img}
              alt=""
              onClick={() => setLightbox(i)}
              whileHover={{ opacity: 1 }}
              style={{ width: 52, height: 36, objectFit: "cover", borderRadius: 6, cursor: "pointer", opacity: 0.55, transition: "opacity 0.2s" }}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(17,16,8,0.95)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={e => e.stopPropagation()}
              style={{ position: "relative", maxWidth: 900, width: "100%" }}
            >
              <img
                src={images[lightbox]} alt={roomName}
                style={{ width: "100%", borderRadius: 12, display: "block", maxHeight: "78vh", objectFit: "contain" }}
              />
              {lightbox > 0 && (
                <button
                  onClick={() => setLightbox(l => l !== null ? l - 1 : null)}
                  style={{ position: "absolute", left: -48, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}
                >‹</button>
              )}
              {lightbox < images.length - 1 && (
                <button
                  onClick={() => setLightbox(l => l !== null ? l + 1 : null)}
                  style={{ position: "absolute", right: -48, top: "50%", transform: "translateY(-50%)", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", fontSize: 18 }}
                >›</button>
              )}
              <button
                onClick={() => setLightbox(null)}
                style={{ position: "absolute", top: -40, right: 0, background: "none", border: "none", color: "rgba(255,255,255,0.55)", fontSize: 13, cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase" }}
              >✕ zapri</button>
              <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <motion.img
                    key={i} src={img} alt="" onClick={() => setLightbox(i)}
                    whileHover={{ opacity: 1 }}
                    style={{ width: 56, height: 40, objectFit: "cover", borderRadius: 6, cursor: "pointer", opacity: i === lightbox ? 1 : 0.38, outline: i === lightbox ? `2px solid ${GOLD}` : "none", transition: "opacity 0.2s" }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ── Fixed: use cubic-bezier array instead of string "easeOut" to satisfy framer-motion's Easing type ──
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1] as Transition["ease"],
    },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

export default function PrenociscaPage() {
  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", overflow: "hidden" }}>
        <img src="/Drone-April-1.jpg" alt="Prenočišča"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(17,16,8,0.3) 0%, rgba(17,16,8,0.72) 100%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{ position: "relative", zIndex: 10, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 24px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "rgba(221, 204, 171, 0.91)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(221, 204, 171, 0.91)", fontWeight: 500 }}>Uršlja gora · Koroška</span>
            <div style={{ width: 32, height: 1, background: "rgba(221, 204, 171, 0.91)" }} />
          </div>
          <h1 style={{ fontSize: "clamp(40px, 8vw, 80px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
            Prenočišča<br /><span style={{ color: GOLD }}>na vrhu</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 16, color: "rgba(255, 255, 255, 0.75)", maxWidth: 400, lineHeight: 1.75 }}>
            Prenoči pod zvezdami Koroške — preprosto, toplo in nepozabno.
          </p>
        </motion.div>
      </section>

      {/* ── SOBE ── */}
      <section style={{ backgroundColor: "white", padding: "80px 24px 100px" }}>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 88 }}
        >
          {rooms.map((room, idx) => (
            <motion.div
              key={room.id} variants={fadeUp}
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}
            >
              <div style={{ order: idx % 2 === 1 ? 2 : 1 }}>
                <RoomGallery images={room.images} roomName={room.name} />
                {"panoramaImages" in room && Array.isArray(room.panoramaImages) && (
                  <PanoramaGallery
                    images={room.panoramaImages}
                    roomName={room.name}
                  />
                )}
              </div>

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
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
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
