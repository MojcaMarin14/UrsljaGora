"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const MarzipanoViewer = dynamic(() => import("@/components/MarzipanoViewer"), {
  ssr: false,
});

const GOLD = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK = "#111008";

/* ─────────────────────────────────────────
   GLOBAL STYLES  (injected once)
───────────────────────────────────────── */
const globalStyles = `
  .pren-room-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    align-items: start;
  }
  .pren-room-row .col-img  { order: 1; }
  .pren-room-row .col-info { order: 2; }
  .pren-room-row.flip .col-img  { order: 2; }
  .pren-room-row.flip .col-info { order: 1; }

  .pren-gallery {
    display: grid;
    gap: 3px;
    border-radius: 18px;
    overflow: hidden;
  }
  .pren-gallery.g1 { grid-template-columns: 1fr; grid-template-rows: 360px; }
  .pren-gallery.g2 { grid-template-columns: 1fr 1fr; grid-template-rows: 310px; }
  .pren-gallery.g3 { grid-template-columns: 1fr 1fr; grid-template-rows: 210px 160px; }

  .pren-gallery.g3 .cell-a { grid-column: 1; grid-row: 1 / 3; }
  .pren-gallery.g3 .cell-b { grid-column: 2; grid-row: 1; }
  .pren-gallery.g3 .cell-c { grid-column: 2; grid-row: 2; }

  .pren-cell {
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }
  .pren-cell img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.5s ease;
  }
  .pren-cell:hover img { transform: scale(1.05); }

  .pren-thumbs {
    display: flex;
    gap: 6px;
    margin-top: 8px;
    flex-wrap: wrap;
  }
  .pren-thumbs img {
    width: 52px;
    height: 36px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
    opacity: 0.5;
    transition: opacity 0.2s;
  }
  .pren-thumbs img:hover { opacity: 1; }

  .pren-amenity-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px 12px;
  }

  /* ── MOBILE ── */
  @media (max-width: 740px) {
    .pren-room-row {
      grid-template-columns: 1fr;
      gap: 24px;
    }
    .pren-room-row .col-img,
    .pren-room-row .col-info,
    .pren-room-row.flip .col-img,
    .pren-room-row.flip .col-info {
      order: unset;
    }

    .pren-gallery.g1 { grid-template-rows: 220px; }
    .pren-gallery.g2 {
      grid-template-columns: 1fr;
      grid-template-rows: 200px 200px;
    }
    .pren-gallery.g3 {
      grid-template-columns: 1fr;
      grid-template-rows: 200px 200px 200px;
    }
    .pren-gallery.g3 .cell-a { grid-column: 1; grid-row: 1; }
    .pren-gallery.g3 .cell-b { grid-column: 1; grid-row: 2; }
    .pren-gallery.g3 .cell-c { grid-column: 1; grid-row: 3; }
  }
`;

/* ─────────────────────────────────────────
   SECTION LABEL
───────────────────────────────────────── */
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  const gold = light ? "rgba(201,169,110,0.8)" : GOLD;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 28, height: 1, background: gold, flexShrink: 0 }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
        color: gold, fontWeight: 600,
      }}>
        {text}
      </span>
    </div>
  );
}

/* ─────────────────────────────────────────
   GALLERY
───────────────────────────────────────── */
function RoomGallery({ images, roomName }: { images: string[]; roomName: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const count = images.length;

  const gridClass =
    count === 1 ? "pren-gallery g1" :
    count === 2 ? "pren-gallery g2" :
                  "pren-gallery g3";

  const cellClass = (i: number) =>
    count >= 3 ? ["cell-a", "cell-b", "cell-c"][i] ?? "" : "";

  return (
    <>
      {/* Gallery grid */}
      <div className={gridClass}>
        {images.slice(0, 3).map((src, i) => (
          <div
            key={i}
            className={`pren-cell ${cellClass(i)}`}
            onClick={() => setLightbox(i)}
          >
            <Image
              src={src}
              alt={`${roomName} ${i + 1}`}
              fill
              sizes="(max-width: 740px) 100vw, 50vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        ))}
      </div>

      {/* Thumbnails (samo če >1 slika) */}
      {count > 1 && (
        <div className="pren-thumbs">
          {images.map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              width={52}
              height={36}
              sizes="52px"
              loading="lazy"
              onClick={() => setLightbox(i)}
              style={{ opacity: i === lightbox ? 1 : undefined }}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            style={{
              position: "fixed", inset: 0, zIndex: 1000,
              background: "rgba(17,16,8,0.95)",
              display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
            }}
          >
            <motion.div
              initial={{ scale: 0.93, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.93, opacity: 0 }}
              transition={{ duration: 0.26 }}
              onClick={e => e.stopPropagation()}
              style={{ position: "relative", maxWidth: 900, width: "100%" }}
            >
              <img
                src={images[lightbox]}
                alt={roomName}
                loading="eager"
                decoding="async"
                style={{ width: "100%", borderRadius: 12, display: "block", maxHeight: "78vh", objectFit: "contain" }}
              />

              {/* Zapri */}
              <button
                onClick={() => setLightbox(null)}
                style={{
                  position: "absolute", top: -40, right: 0,
                  background: "none", border: "none",
                  color: "rgba(255,255,255,0.55)", fontSize: 13,
                  cursor: "pointer", letterSpacing: "0.08em", textTransform: "uppercase",
                }}
              >✕ zapri</button>

              {/* Puščice */}
              {lightbox > 0 && (
                <button
                  onClick={() => setLightbox(l => (l !== null ? l - 1 : null))}
                  style={arrowBtn("left")}
                >‹</button>
              )}
              {lightbox < images.length - 1 && (
                <button
                  onClick={() => setLightbox(l => (l !== null ? l + 1 : null))}
                  style={arrowBtn("right")}
                >›</button>
              )}

              {/* Thumbnail strip v lightboxu */}
              <div style={{ display: "flex", gap: 6, marginTop: 14, justifyContent: "center", flexWrap: "wrap" }}>
                {images.map((src, i) => (
                  <Image
                    key={i}
                    src={src}
                    alt=""
                    width={48}
                    height={34}
                    sizes="48px"
                    loading="lazy"
                    onClick={() => setLightbox(i)}
                    style={{
                      width: 48, height: 34, objectFit: "cover", borderRadius: 6,
                      cursor: "pointer",
                      opacity: i === lightbox ? 1 : 0.38,
                      outline: i === lightbox ? `2px solid ${GOLD}` : "none",
                      transition: "opacity 0.2s",
                    }}
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

function arrowBtn(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    [side === "left" ? "left" : "right"]: -48,
    top: "50%", transform: "translateY(-50%)",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.2)",
    color: "white", width: 36, height: 36,
    borderRadius: "50%", cursor: "pointer",
    fontSize: 20, display: "flex",
    alignItems: "center", justifyContent: "center",
  };
}

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const rooms = [

  {
    id: 1,
    name: "Samostojne sobe",
    type: "Zasebne sobe",
    desc: "Tihe, skromno opremljene sobe za posameznike ali pare. Leseni detajli, mehka svetloba in pogled na gorski svet ustvarjajo vzdušje pristne planinske domačnosti.",
    details: [
      { icon: "🛏️", label: "Postelja",   value: "Zakonska ali dve ločeni" },
      { icon: "👥", label: "Kapaciteta", value: "1–2 osebi" },
    ],
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
    name: "Sobe za 6 - 8 ljudi",
    type: "Večposteljne sobe",
    desc: "Planinska večposteljna soba z lesenimi posteljami v nadstropju, primerna za manjše skupine, pohodnike in goste, ki iščejo preprost ter topel kotiček po vzponu.",
    details: [
      { icon: "🛏️", label: "Postelje", value: "Lesene nadstropne postelje" },
      { icon: "👥", label: "Kapaciteta", value: "6–8 oseb" },
    ],
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
    type: "Skupna prenočišča",
    desc: "Skupne sobe ohranjajo pristno planinsko vzdušje koče. Namenjene so gostom, ki jim je pomemben udoben počitek v preprostem gorskem ambientu in družabnem vzdušju.",
    details: [
      { icon: "🚿", label: "Kopalnica", value: "Prha, umivalnik, ogledalo" },
      { icon: "🚽", label: "WC",        value: "Ločen od kopalnice" },
    ],
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
    type: "Kamin, kopalnica in WC",
    desc: "Gostom so na voljo skupni prostori koče, kjer se po pohodu zbere družba, spočije ob kaminu in uporabi osnovne sanitarije. Vse skupaj ohranja topel in domač planinski značaj.",
    details: [
      { icon: "🔥", label: "Kamin",   value: "Skupni dnevni prostor" },
      { icon: "🚿", label: "Sanitarije", value: "Kopalnica in WC za goste" },
    ],
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
        <div
          style={{
            border: "1px solid rgba(17,16,8,0.1)",
            borderRadius: 18,
            overflow: "hidden",
            background: "#fff",
          }}
        >
          <div style={{ position: "relative", aspectRatio: "16 / 9", overflow: "hidden" }}>
            <Image
              src={images[selectedPanorama]}
              alt={`${roomName} 360 ${selectedPanorama + 1}`}
              fill
              sizes="(max-width: 740px) 100vw, 50vw"
              loading="lazy"
              style={{ objectFit: "cover", display: "block" }}
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

            <button
              type="button"
              onClick={() => setActivePanorama(selectedPanorama)}
              style={{
                position: "absolute",
                bottom: 14,
                left: 14,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px 16px",
                borderRadius: 999,
                border: "1px solid rgba(255,255,255,0.24)",
                background: "rgba(17,16,8,0.68)",
                color: "white",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: "pointer",
              }}
            >
              Odpri 360
            </button>
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

/* ─────────────────────────────────────────
   PAGE
───────────────────────────────────────── */
export default function PrenociscaPage() {
  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* Inject global responsive styles */}
      <style>{globalStyles}</style>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "52vh", minHeight: 320, overflow: "hidden" }}>
        <Image
          src="/drone1.jpg"
          alt="Prenočišča"
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(17,16,8,0.3) 0%, rgba(17,16,8,0.72) 100%)",
        }} />
        <motion.div
          initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: "relative", zIndex: 10, height: "100%",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            textAlign: "center", padding: "0 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.6)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.85)", fontWeight: 500 }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.6)" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(38px, 8vw, 80px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
          }}>
            Prenočišča<br /><span style={{ color: GOLD }}>na vrhu</span>
          </h1>
          <p style={{ marginTop: 20, fontSize: 16, color: "rgba(255, 255, 255, 0.75)", maxWidth: 400, lineHeight: 1.75 }}>
            Prenoči pod zvezdami Koroške — preprosto, toplo in nepozabno.
          </p>
        </motion.div>
      </section>

      {/* ── SOBE ── */}
      <section style={{ backgroundColor: "white", padding: "64px 20px 100px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", display: "flex", flexDirection: "column", gap: 80 }}>

          {rooms.map((room, idx) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-48px" }}
              transition={{ duration: 0.75, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {/* Divider med sobami */}
              {idx > 0 && (
                <div style={{ width: "100%", height: 1, background: "rgba(17,16,8,0.07)", marginBottom: 80 }} />
              )}

              <div className={`pren-room-row${idx % 2 === 1 ? " flip" : ""}`}>

                {/* Galerija */}
                <div className="col-img">
                  <RoomGallery images={room.images} roomName={room.name} />
                  {"panoramaImages" in room && Array.isArray(room.panoramaImages) && (
                  <PanoramaGallery
                    images={room.panoramaImages}
                    roomName={room.name}
                  />
                )}
              </div>

                {/* Info */}
                <div className="col-info" style={{ paddingTop: 6 }}>
                  <SectionLabel text={room.type} />

                  <h2 style={{
                    fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 500, color: DARK,
                    letterSpacing: "-0.025em", lineHeight: 1.2, margin: "0 0 14px",
                  }}>
                    {room.name}
                  </h2>

                  <p style={{ fontSize: 15, color: "rgba(17,16,8,0.6)", lineHeight: 1.82, marginBottom: 28 }}>
                    {room.desc}
                  </p>

                  {/* Details */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 11, marginBottom: 28 }}>
                    {room.details.map((d, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 15 }}>{d.icon}</span>
                        <span style={{
                          fontSize: 11, color: GOLD, fontWeight: 600,
                          letterSpacing: "0.12em", textTransform: "uppercase", minWidth: 88,
                        }}>{d.label}</span>
                        <span style={{ fontSize: 14, color: "rgba(17,16,8,0.62)" }}>{d.value}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ width: "100%", height: 1, background: "rgba(17,16,8,0.08)", marginBottom: 22 }} />

                  {/* Amenities */}
                  <div className="pren-amenity-grid">
                    {room.amenities.map((a, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                        <div style={{ width: 5, height: 5, borderRadius: "50%", background: GOLD, flexShrink: 0 }} />
                        <span style={{ fontSize: 13, color: "rgba(17,16,8,0.62)" }}>{a}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          ))}

        </div>
      </section>

      {/* ── INFO BANNER ── */}
      <section style={{ backgroundColor: DARK, padding: "72px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          <SectionLabel text="Informacije" light />
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.025em", marginBottom: 40,
          }}>
            Praktične <span style={{ color: GOLD }}>informacije</span>
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 28, marginBottom: 40,
          }}>
            {[
              { label: "Prijava / odjava", value: "od 14:00 / do 10:00" },
              { label: "Rezervacije",      value: "telefon ali e-pošta"  },
              { label: "Kopalnica & WC",   value: "skupna raba"          },
            ].map((info, i) => (
              <div key={i}>
                <p style={{
                  fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
                  color: GOLD, marginBottom: 8, fontWeight: 600,
                }}>{info.label}</p>
                <p style={{ fontSize: 17, color: "rgba(255,255,255,0.78)", fontWeight: 400, margin: 0 }}>
                  {info.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            padding: "22px 26px",
            border: "1px solid rgba(201,169,110,0.2)",
            borderRadius: 14,
          }}>
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
