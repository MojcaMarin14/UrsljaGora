"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

/* ── TOKENS ── */
const C = {
  cream:   "#f5f0e8",
  parch:   "#ede5d0",
  warm:    "#faf7f2",
  ink:     "#1c1a15",
  brown:   "#3d2f1e",
  wood:    "#8b6340",
  forest:  "#2d4a35",
  moss:    "#4a6741",
  gold:    "#c9893a",
  mist:    "#9aaa9d",
  white:   "#fefcf8",
};

/* ── GLOBAL STYLES ── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400;1,500&family=Lora:ital,wght@0,300;0,400;1,300&display=swap');

  .knj-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .knj-page {
    font-family: 'Lora', Georgia, serif;
    background: ${C.cream};
    color: ${C.ink};
    overflow-x: hidden;
  }

  /* HERO */
  .knj-hero {
    position: relative;
    height: 100svh;
    min-height: 540px;
    overflow: hidden;
  }
  .knj-hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transform-origin: center bottom;
  }
  .knj-hero-veil {
    position: absolute; inset: 0;
    background: linear-gradient(
      160deg,
      rgba(28,26,21,0.08) 0%,
      rgba(28,26,21,0.0) 35%,
      rgba(28,26,21,0.5) 72%,
      rgba(28,26,21,0.88) 100%
    );
  }
  .knj-hero-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 0 6vw 8vh; z-index: 10;
  }
  .knj-tag {
    display: inline-flex; align-items: center; gap: 10px;
    background: rgba(45,74,53,0.75);
    border: 1px solid rgba(74,103,65,0.6);
    border-radius: 2px;
    padding: 7px 14px; margin-bottom: 22px;
  }
  .knj-tag-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: ${C.gold};
    animation: knjPulse 2s ease-in-out infinite;
  }
  @keyframes knjPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.3); }
  }
  .knj-tag-text {
    font-family: 'Lora', serif; font-size: 11px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: rgba(245,240,232,0.9); font-weight: 400;
  }
  .knj-hero-h1 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(44px, 8.5vw, 100px);
    font-weight: 400; line-height: 1.0;
    letter-spacing: -0.02em; color: ${C.white};
  }
  .knj-hero-h1 em {
    font-style: italic; color: ${C.gold};
    display: block;
  }
  .knj-hero-sub {
    margin-top: 20px;
    font-size: clamp(15px, 1.8vw, 18px);
    color: rgba(245,240,232,0.52);
    font-weight: 300; line-height: 1.75;
    max-width: 440px; font-style: italic;
  }
  .knj-hero-badges {
    margin-top: 32px;
    display: flex; gap: 10px; flex-wrap: wrap;
  }
  .knj-badge {
    background: rgba(245,240,232,0.1);
    border: 1px solid rgba(245,240,232,0.2);
    border-radius: 2px; padding: 6px 14px;
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(245,240,232,0.65);
    font-family: 'Lora', serif;
  }

  /* STRIP BANNER */
  .knj-strip {
    background: ${C.forest};
    padding: 18px 6vw;
    display: flex; align-items: center;
    justify-content: center; gap: 40px;
    flex-wrap: wrap;
  }
  .knj-strip-item {
    display: flex; align-items: center; gap: 10px;
  }
  .knj-strip-line {
    width: 1px; height: 28px;
    background: rgba(154,170,157,0.3);
  }
  .knj-strip-val {
    font-family: 'Playfair Display', serif;
    font-size: 20px; font-weight: 400; color: ${C.cream};
  }
  .knj-strip-lbl {
    font-size: 10px; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(154,170,157,0.7);
    font-family: 'Lora', serif;
  }

  /* UVOD */
  .knj-intro-wrap {
    background: ${C.white};
    padding: 88px 6vw 80px;
  }
  .knj-intro {
    max-width: 1160px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 80px; align-items: center;
  }
  .knj-intro-img-wrap {
    position: relative;
  }
  .knj-intro-img {
    width: 100%; aspect-ratio: 4/3;
    object-fit: cover; border-radius: 3px;
    display: block;
  }
  .knj-intro-img-badge {
    position: absolute; bottom: -18px; right: -18px;
    background: ${C.forest};
    padding: 18px 22px; border-radius: 2px;
    border: 3px solid ${C.white};
  }
  .knj-intro-img-badge-num {
    font-family: 'Playfair Display', serif;
    font-size: 32px; color: ${C.gold};
    font-weight: 400; line-height: 1;
  }
  .knj-intro-img-badge-lbl {
    font-size: 9px; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(154,170,157,0.8);
    margin-top: 4px; font-family: 'Lora', serif;
  }
  .knj-label {
    font-size: 10px; letter-spacing: 0.26em;
    text-transform: uppercase; color: ${C.moss};
    font-weight: 400; margin-bottom: 18px;
    display: flex; align-items: center; gap: 10px;
    font-family: 'Lora', serif;
  }
  .knj-label::before {
    content: ''; display: block;
    width: 24px; height: 1px; background: ${C.moss};
  }
  .knj-intro-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(28px, 3.5vw, 44px);
    font-weight: 400; line-height: 1.18;
    color: ${C.brown}; margin-bottom: 24px;
  }
  .knj-intro-h2 em { font-style: italic; color: ${C.forest}; }
  .knj-intro-body {
    font-size: clamp(15px, 1.5vw, 16.5px);
    color: rgba(28,26,21,0.6);
    line-height: 1.9; font-weight: 300;
  }
  .knj-intro-body p + p { margin-top: 16px; }

  /* GALERIJA */
  .knj-gallery-wrap {
    background: ${C.parch};
    padding: 72px 6vw;
  }
  .knj-gallery-head {
    max-width: 1160px; margin: 0 auto 36px;
    display: flex; align-items: baseline;
    justify-content: space-between;
  }
  .knj-gallery-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 400; color: ${C.brown};
  }
  .knj-gallery-h2 em { font-style: italic; color: ${C.forest}; }
  .knj-gallery-grid {
    max-width: 1160px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-rows: 300px 260px;
    gap: 4px;
  }
  .knj-gallery-grid .gc-main {
    grid-column: 1; grid-row: 1 / 3;
  }
  .knj-gallery-grid .gc-tr { grid-column: 2; grid-row: 1; }
  .knj-gallery-grid .gc-mr { grid-column: 3; grid-row: 1; }
  .knj-gallery-grid .gc-bl { grid-column: 2; grid-row: 2; }
  .knj-gallery-grid .gc-br { grid-column: 3; grid-row: 2; }
  .knj-gitem {
    overflow: hidden; cursor: zoom-in;
    border-radius: 2px; position: relative;
  }
  .knj-gitem img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.65s cubic-bezier(0.25,0.1,0.25,1);
  }
  .knj-gitem:hover img { transform: scale(1.07); }

  /* FEATURES */
  .knj-features-wrap {
    background: ${C.white};
    padding: 80px 6vw;
  }
  .knj-features-inner {
    max-width: 1160px; margin: 0 auto;
  }
  .knj-features-title {
    text-align: center; margin-bottom: 52px;
  }
  .knj-features-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 3.5vw, 40px);
    font-weight: 400; color: ${C.brown};
  }
  .knj-features-h2 em { font-style: italic; color: ${C.forest}; }
  .knj-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .knj-feature {
    background: ${C.cream};
    padding: 36px 28px;
    border-top: 3px solid transparent;
    transition: border-color 0.3s, background 0.3s;
  }
  .knj-feature:hover {
    border-color: ${C.forest};
    background: ${C.parch};
  }
  .knj-feature-icon {
    font-size: 28px; margin-bottom: 16px; display: block;
  }
  .knj-feature-h3 {
    font-family: 'Playfair Display', serif;
    font-size: 18px; font-weight: 400;
    color: ${C.brown}; margin-bottom: 12px;
  }
  .knj-feature-body {
    font-size: 14px; color: rgba(28,26,21,0.58);
    line-height: 1.82; font-weight: 300;
    font-style: italic;
  }

  /* QUOTE */
  .knj-quote-wrap {
    background: ${C.forest};
    padding: 80px 6vw;
    text-align: center;
  }
  .knj-quote-inner { max-width: 680px; margin: 0 auto; }
  .knj-quote-text {
    font-family: 'Playfair Display', serif;
    font-size: clamp(20px, 3vw, 34px);
    font-weight: 400; font-style: italic;
    color: ${C.cream}; line-height: 1.55;
  }
  .knj-quote-line {
    width: 40px; height: 1px;
    background: ${C.gold}; opacity: 0.6;
    margin: 28px auto;
  }
  .knj-quote-attr {
    font-size: 11px; letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(154,170,157,0.65);
    font-family: 'Lora', serif;
  }

  /* INFO */
  .knj-info-wrap {
    background: ${C.parch};
    padding: 80px 6vw;
  }
  .knj-info-inner {
    max-width: 1160px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px; align-items: start;
  }
  .knj-info-h2 {
    font-family: 'Playfair Display', serif;
    font-size: clamp(26px, 3.5vw, 42px);
    font-weight: 400; color: ${C.brown};
    margin-bottom: 20px; line-height: 1.2;
  }
  .knj-info-h2 em { font-style: italic; color: ${C.forest}; }
  .knj-info-desc {
    font-size: clamp(14px, 1.4vw, 16px);
    color: rgba(28,26,21,0.58); line-height: 1.88;
    font-weight: 300; font-style: italic;
  }
  .knj-info-link {
    display: inline-flex; align-items: center; gap: 10px;
    margin-top: 28px;
    background: ${C.forest}; color: ${C.cream};
    padding: 14px 24px; border-radius: 2px;
    font-size: 12px; letter-spacing: 0.16em;
    text-transform: uppercase; text-decoration: none;
    font-family: 'Lora', serif; transition: background 0.2s;
  }
  .knj-info-link:hover { background: ${C.moss}; }
  .knj-info-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px;
  }
  .knj-info-item {
    background: ${C.white}; padding: 22px 20px;
    border-left: 3px solid ${C.gold};
  }
  .knj-info-lbl {
    font-size: 9px; letter-spacing: 0.22em;
    text-transform: uppercase; color: ${C.moss};
    margin-bottom: 8px; font-family: 'Lora', serif;
  }
  .knj-info-val {
    font-family: 'Playfair Display', serif;
    font-size: clamp(13px, 1.3vw, 15px);
    color: ${C.brown}; line-height: 1.5;
  }

  /* LIGHTBOX */
  .knj-lb {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(20,18,13,0.97);
    display: flex; align-items: center; justify-content: center;
    padding: 20px; cursor: zoom-out;
  }
  .knj-lb-box { position: relative; max-width: 960px; width: 100%; }
  .knj-lb-img {
    width: 100%; display: block;
    max-height: 85vh; object-fit: contain;
    border-radius: 2px; cursor: default;
  }
  .knj-lb-close {
    position: absolute; top: -38px; right: 0;
    background: none; border: none; cursor: pointer;
    font-size: 11px; letter-spacing: 0.14em;
    text-transform: uppercase; color: rgba(245,240,232,0.45);
    font-family: 'Lora', serif;
  }
  .knj-lb-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(245,240,232,0.08);
    border: 1px solid rgba(245,240,232,0.18);
    color: rgba(245,240,232,0.8); width: 42px; height: 42px;
    border-radius: 50%; cursor: pointer; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .knj-lb-btn:hover { background: rgba(245,240,232,0.18); }
  .knj-lb-btn.prev { left: -54px; }
  .knj-lb-btn.next { right: -54px; }

  /* MOBILE */
  @media (max-width: 780px) {
    .knj-intro { grid-template-columns: 1fr; gap: 48px; }
    .knj-intro-img-badge { bottom: -14px; right: 12px; }
    .knj-features-grid { grid-template-columns: 1fr; gap: 2px; }
    .knj-gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 200px 180px 180px;
    }
    .knj-gallery-grid .gc-main {
      grid-column: 1 / 3; grid-row: 1;
    }
    .knj-gallery-grid .gc-tr { grid-column: 1; grid-row: 2; }
    .knj-gallery-grid .gc-mr { grid-column: 2; grid-row: 2; }
    .knj-gallery-grid .gc-bl { grid-column: 1; grid-row: 3; }
    .knj-gallery-grid .gc-br { grid-column: 2; grid-row: 3; }
    .knj-info-inner { grid-template-columns: 1fr; gap: 40px; }
    .knj-strip { gap: 20px; }
    .knj-strip-line { display: none; }
    .knj-lb-btn.prev { left: 4px; }
    .knj-lb-btn.next { right: 4px; }
  }

  @media (max-width: 480px) {
    .knj-gallery-grid {
      grid-template-columns: 1fr;
      grid-template-rows: 220px 200px 200px 200px 200px;
    }
    .knj-gallery-grid .gc-main { grid-column:1; grid-row:1; }
    .knj-gallery-grid .gc-tr   { grid-column:1; grid-row:2; }
    .knj-gallery-grid .gc-mr   { grid-column:1; grid-row:3; }
    .knj-gallery-grid .gc-bl   { grid-column:1; grid-row:4; }
    .knj-gallery-grid .gc-br   { grid-column:1; grid-row:5; }
    .knj-info-grid { grid-template-columns: 1fr; }
    .knj-hero-badges { display: none; }
  }
`;

/* ── PODATKI ── */
const galleryItems = [
  { src: "/knji3.jpg", cls: "gc-main", alt: "Bralni kotiček s kaminom" },
  { src: "/knji1.jpg", cls: "gc-tr",   alt: "Knjige na polici — Uršlja gora" },
  { src: "/knji2.jpg", cls: "gc-mr",   alt: "Izposojevališče z laptopom" },
  { src: "/knji5.jpg", cls: "gc-bl",   alt: "Rumeni stoli ob kaminu" },
  { src: "/knji4.jpg", cls: "gc-br",   alt: "Knjiga Uršlja gora — Koroška lepotica" },
];

const features = [
  {
    icon: "📚",
    title: "Prava knjižnica na vrhu",
    body: "Deveta enota Koroške osrednje knjižnice dr. Franca Sušnika. Uradno evidentirano izposojevališče z možnostjo izposoje in vračanja knjig.",
  },
  {
    icon: "🌲",
    title: "Zbiranje znanja in narave",
    body: "Bralni kotiček z razgledom na Karavanke — med deskarsko mizo, rumenimi stoli in kaminom. Za telo in duha hkrati.",
  },
  {
    icon: "👦",
    title: "Za vse generacije",
    body: "Posebni otroški kotiček s knjigami Primoža Suhodolčana, planinska literatura, Koroška in Slovenija — vsebine za vsakega pohodnika.",
  },
  {
    icon: "📅",
    title: "Odprto skozi vse leto",
    body: "Izposojevališče deluje najmanj 4 ure na teden, sicer pa v času odprtosti Doma na Uršlji gori — tudi pozimi.",
  },
  {
    icon: "🌿",
    title: "Zelena knjižica",
    body: "Nov projekt Koroške osrednje knjižnice: trajnostna pot do knjižnice peš, s kolesom ali javnim prevozom. Bralna kultura + okoljska zavest.",
  },
  {
    icon: "🗺️",
    title: "1699 m — Slovenska rekordna točka",
    body: "Skupaj z najvišje ležečo cerkvijo in čebelnjakom Uršlja gora postaja trikratni rekorder — to je edinstven kraj v Sloveniji.",
  },
];

const infoItems = [
  { lbl: "Lokacija",       val: "Dom na Uršlji gori, 1699 m n. m." },
  { lbl: "Enota",          val: "9. enota KOK dr. Franca Sušnika" },
  { lbl: "Odprtost",       val: "Min. 4 ure / teden, v sezoni dnevno" },
  { lbl: "Odprtje",        val: "21. junij 2025 — poletni solsticij" },
  { lbl: "Izposoja knjig", val: "Da — s člansko izkaznico KOK" },
  { lbl: "Dostop",         val: "Peš od Koprivne, Mežice, Prevalj" },
];

/* ── PAGE ── */
export default function KnjiznicaPage() {
  const [lb, setLb] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef, offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroO = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  const fadUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
  });

  return (
    <div className="knj-page">
      <style>{G}</style>

      {/* ── HERO ── */}
      <section className="knj-hero" ref={heroRef}>
        <motion.img
          src="/knj77.jpg"
          alt="Izposojevališče Uršlja gora"
          className="knj-hero-img"
          style={{ y: heroY }}
        />
        <div className="knj-hero-veil" />
        <motion.div className="knj-hero-content" style={{ opacity: heroO }}>
          <motion.div
            className="knj-tag"
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="knj-tag-dot" />
            <span className="knj-tag-text">Odprto od junija 2025</span>
          </motion.div>

          <motion.h1
            className="knj-hero-h1"
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          >
            Knjižnica<em>na vrhu gore</em>
          </motion.h1>

          <motion.p
            className="knj-hero-sub"
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.68 }}
          >
            Izposojevališče Uršlja gora — kjer se znanje sreča z naravo na 1699 metrih nad morjem.
          </motion.p>

          <motion.div
            className="knj-hero-badges"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <span className="knj-badge">Najvišje v Sloveniji</span>
            <span className="knj-badge">KOK Ravne na Koroškem</span>
            <span className="knj-badge">9. enota knjižnice</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── STRIP ── */}
      <div className="knj-strip">
        {[
          { val: "1699 m", lbl: "nadmorska višina" },
          { val: "#1",     lbl: "najvišje v Sloveniji" },
          { val: "9.",     lbl: "enota KOK" },
          { val: "2025",   lbl: "leto odprtja" },
        ].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 28 }}>
            {i > 0 && <div className="knj-strip-line" />}
            <div className="knj-strip-item">
              <div>
                <div className="knj-strip-val">{s.val}</div>
                <div className="knj-strip-lbl">{s.lbl}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── UVOD ── */}
      <section className="knj-intro-wrap">
        <div className="knj-intro">
          <motion.div className="knj-intro-img-wrap" {...fadUp(0)}>
            <img src="/knji2.jpg" alt="Izposojevališče — pogled na polico" className="knj-intro-img" />
            <div className="knj-intro-img-badge">
              <div className="knj-intro-img-badge-num">9.</div>
              <div className="knj-intro-img-badge-lbl">enota knjižnice</div>
            </div>
          </motion.div>

          <motion.div {...fadUp(0.15)}>
            <p className="knj-label">O izposojevališču</p>
            <h2 className="knj-intro-h2">
              Kjer se <em>knjiga in gora</em> srečata
            </h2>
            <div className="knj-intro-body">
              <p>V soboto, 21. junija 2025 — na poletni solsticij, najdaljši dan v letu — je Koroška osrednja knjižnica dr. Franca Sušnika slovesno odprla deveto knjižnično enoto: izposojevališče Uršlja gora.</p>
              <p>S tem je Uršlja gora postala najvišje ležeče izposojevališče knjig v Sloveniji. Skupaj z že obstoječima rekordoma — najvišje ležečo cerkvijo sv. Ursula in najvišje ležečim čebelnjakom — gora sedi na vrhu tudi kulturno.</p>
              <p>Knjige so nastanjene v prenovljenih skupnih prostorih Doma na Uršlji gori, ki ga upravlja Planinsko društvo Prevalje. Med police so zašle planinska literatura, knjige o Koroški, otroški kotiček in domači avtorji.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── GALERIJA ── */}
      <section className="knj-gallery-wrap">
        <div className="knj-gallery-head">
          <h2 className="knj-gallery-h2">
            <em>Prostori</em> izposojevališča
          </h2>
          <p className="knj-label" style={{ marginBottom: 0 }}>Fotografije</p>
        </div>
        <motion.div
          className="knj-gallery-grid"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          {galleryItems.map((g, i) => (
            <div key={i} className={`knj-gitem ${g.cls}`} onClick={() => setLb(i)}>
              <img src={g.src} alt={g.alt} />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── FEATURES ── */}
      <section className="knj-features-wrap">
        <div className="knj-features-inner">
          <motion.div className="knj-features-title" {...fadUp(0)}>
            <p className="knj-label" style={{ justifyContent: "center" }}>Kaj ponujamo</p>
            <h2 className="knj-features-h2">
              Knjižnica <em>za dušo in telo</em>
            </h2>
          </motion.div>
          <div className="knj-features-grid">
            {features.map((f, i) => (
              <motion.div
                key={i} className="knj-feature"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
              >
                <span className="knj-feature-icon" style={{ fontSize: 24 }}>{f.icon}</span>
                <h3 className="knj-feature-h3">{f.title}</h3>
                <p className="knj-feature-body">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITAT ── */}
      <section className="knj-quote-wrap">
        <motion.div className="knj-quote-inner" {...fadUp(0)}>
          <p className="knj-quote-text">
            "Knjižnica se je povzpela do pohodnikov — da ni treba izbirati med knjigo in goro."
          </p>
          <div className="knj-quote-line" />
          <p className="knj-quote-attr">
            Aljaž Verhovnik · Direktor Koroške osrednje knjižnice dr. Franca Sušnika
          </p>
        </motion.div>
      </section>

      {/* ── INFO ── */}
      <section className="knj-info-wrap">
        <div className="knj-info-inner">
          <motion.div {...fadUp(0)}>
            <p className="knj-label">Praktično</p>
            <h2 className="knj-info-h2">
              Načrtuj <em>obisk</em>
            </h2>
            <p className="knj-info-desc">
              Izposojevališče je del Doma na Uršlji gori in deluje v skladu z urnikom koče. Za izposojo knjig potrebuješ člansko izkaznico Koroške osrednje knjižnice — več informacij na spletni strani knjižnice.
            </p>
            <a
              href="https://www.knjiznica-ravne.si"
              target="_blank"
              rel="noopener noreferrer"
              className="knj-info-link"
            >
              <span>Spletna stran knjižnice</span>
              <span style={{ fontSize: 14 }}>↗</span>
            </a>
          </motion.div>

          <motion.div className="knj-info-grid" {...fadUp(0.15)}>
            {infoItems.map((it, i) => (
              <div key={i} className="knj-info-item">
                <p className="knj-info-lbl">{it.lbl}</p>
                <p className="knj-info-val">{it.val}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lb !== null && (
        <motion.div
          className="knj-lb"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setLb(null)}
        >
          <motion.div
            className="knj-lb-box"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.24 }}
            onClick={e => e.stopPropagation()}
          >
            <img src={galleryItems[lb].src} alt={galleryItems[lb].alt} className="knj-lb-img" />
            <button className="knj-lb-close" onClick={() => setLb(null)}>✕ Zapri</button>
            {lb > 0 && (
              <button className="knj-lb-btn prev" onClick={() => setLb(l => l! - 1)}>‹</button>
            )}
            {lb < galleryItems.length - 1 && (
              <button className="knj-lb-btn next" onClick={() => setLb(l => l! + 1)}>›</button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
