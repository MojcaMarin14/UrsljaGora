"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

/* ── DESIGN TOKENS ── */
const C = {
  ink:     "#0e0c09",
  warm:    "#1a1510",
  parch:   "#f2ead8",
  stone:   "#c8bfaa",
  gold:    "#c9893a",
  copper:  "#a8622a",
  mist:    "#7a8a8f",
  white:   "#faf8f3",
};

/* ── GLOBAL STYLES ── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Crimson+Pro:wght@300;400&display=swap');

  .cer-page * { box-sizing: border-box; margin: 0; padding: 0; }

  .cer-page {
    font-family: 'Crimson Pro', Georgia, serif;
    background: ${C.ink};
    color: ${C.parch};
    overflow-x: hidden;
  }

  /* ── HERO ── */
  .cer-hero {
    position: relative;
    height: 100svh;
    min-height: 560px;
    overflow: hidden;
  }
  .cer-hero-img {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover;
    transform-origin: center;
  }
  .cer-hero-veil {
    position: absolute; inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(14,12,9,0.15) 0%,
      rgba(14,12,9,0.05) 30%,
      rgba(14,12,9,0.55) 70%,
      rgba(14,12,9,0.95) 100%
    );
  }
  .cer-hero-content {
    position: absolute; bottom: 0; left: 0; right: 0;
    padding: 0 6vw 7vh;
    z-index: 10;
  }
  .cer-eyebrow {
    display: flex; align-items: center; gap: 14px;
    margin-bottom: 18px;
  }
  .cer-eyebrow-line { width: 36px; height: 1px; background: ${C.gold}; opacity: 0.7; }
  .cer-eyebrow-text {
    font-family: 'Crimson Pro', serif;
    font-size: 12px; letter-spacing: 0.3em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300;
  }
  .cer-hero-h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(48px, 9vw, 108px);
    font-weight: 300; line-height: 0.95;
    letter-spacing: -0.02em;
    color: ${C.white};
  }
  .cer-hero-h1 em {
    font-style: italic; color: ${C.gold};
  }
  .cer-hero-sub {
    margin-top: 22px;
    font-size: clamp(16px, 2vw, 19px);
    color: rgba(242,234,216,0.55);
    font-weight: 300; line-height: 1.7;
    max-width: 480px;
  }
  .cer-scroll-hint {
    margin-top: 40px;
    display: flex; align-items: center; gap: 12px;
  }
  .cer-scroll-hint-line {
    width: 1px; height: 48px;
    background: linear-gradient(to bottom, ${C.gold}, transparent);
    animation: cerPulse 2.4s ease-in-out infinite;
  }
  @keyframes cerPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }
  .cer-scroll-hint-text {
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: rgba(201,137,58,0.55);
    writing-mode: vertical-rl; transform: rotate(180deg);
  }

  /* ── UVOD ── */
  .cer-intro {
    background: ${C.ink};
    padding: 100px 6vw 80px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  .cer-intro-label {
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300; margin-bottom: 20px;
  }
  .cer-intro-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(30px, 4vw, 52px);
    font-weight: 300; line-height: 1.15;
    color: ${C.white}; margin-bottom: 28px;
  }
  .cer-intro-h2 em { font-style: italic; color: ${C.gold}; }
  .cer-intro-body {
    font-size: clamp(15px, 1.6vw, 17px);
    color: rgba(242,234,216,0.62);
    line-height: 1.88; font-weight: 300;
  }
  .cer-intro-body p + p { margin-top: 18px; }
  .cer-intro-stats {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px;
  }
  .cer-stat {
    background: ${C.warm};
    padding: 28px 24px;
    border: 1px solid rgba(201,137,58,0.1);
    transition: border-color 0.3s;
  }
  .cer-stat:hover { border-color: rgba(201,137,58,0.35); }
  .cer-stat-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(36px, 4vw, 52px);
    font-weight: 300; color: ${C.gold};
    line-height: 1;
  }
  .cer-stat-label {
    font-size: 11px; letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(200,191,170,0.55);
    margin-top: 8px; font-weight: 300;
  }

  /* ── GALERIJA ── */
  .cer-gallery-section {
    padding: 0 0 100px;
    background: ${C.ink};
  }
  .cer-gallery-label {
    text-align: center; padding: 60px 0 40px;
    font-size: 10px; letter-spacing: 0.32em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300;
  }
  .cer-gallery-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-template-rows: 340px 280px;
    gap: 3px;
    padding: 0 3px;
  }
  .cer-gallery-grid .g-main {
    grid-column: 1; grid-row: 1 / 3;
  }
  .cer-gallery-grid .g-tr { grid-column: 2; grid-row: 1; }
  .cer-gallery-grid .g-mr { grid-column: 3; grid-row: 1; }
  .cer-gallery-grid .g-bl { grid-column: 2; grid-row: 2; }
  .cer-gallery-grid .g-br { grid-column: 3; grid-row: 2; }

  .cer-gitem {
    overflow: hidden; cursor: pointer; position: relative;
    background: ${C.warm};
  }
  .cer-gitem img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.25,0.1,0.25,1);
  }
  .cer-gitem:hover img { transform: scale(1.06); }
  .cer-gitem-veil {
    position: absolute; inset: 0;
    background: rgba(14,12,9,0);
    transition: background 0.4s;
  }
  .cer-gitem:hover .cer-gitem-veil {
    background: rgba(14,12,9,0.18);
  }

  /* ── VSEBINA ── */
  .cer-content-section {
    background: ${C.warm};
    padding: 90px 6vw;
  }
  .cer-content-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: 80px; align-items: start;
  }
  .cer-content-nav { position: sticky; top: 100px; }
  .cer-content-nav-title {
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300; margin-bottom: 24px;
  }
  .cer-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0;
    border-bottom: 1px solid rgba(201,137,58,0.1);
    cursor: default;
  }
  .cer-nav-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: ${C.copper}; flex-shrink: 0;
  }
  .cer-nav-text {
    font-size: 13px; letter-spacing: 0.08em;
    color: rgba(200,191,170,0.6);
    text-transform: uppercase; font-weight: 300;
  }

  .cer-article { display: flex; flex-direction: column; gap: 60px; }
  .cer-block-label {
    font-size: 10px; letter-spacing: 0.28em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300; margin-bottom: 16px;
    display: flex; align-items: center; gap: 12px;
  }
  .cer-block-label::before {
    content: ''; display: block;
    width: 28px; height: 1px; background: ${C.gold}; opacity: 0.6;
  }
  .cer-block-h3 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(26px, 3vw, 38px);
    font-weight: 300; color: ${C.white};
    line-height: 1.2; margin-bottom: 20px;
  }
  .cer-block-h3 em { font-style: italic; color: ${C.gold}; }
  .cer-block-body {
    font-size: clamp(15px, 1.5vw, 17px);
    color: rgba(242,234,216,0.58);
    line-height: 1.9; font-weight: 300;
  }
  .cer-block-body p + p { margin-top: 16px; }
  .cer-divider {
    width: 48px; height: 1px;
    background: linear-gradient(to right, ${C.gold}, transparent);
    margin: 8px 0 0;
  }

  /* ── QUOTE ── */
  .cer-quote {
    background: ${C.ink};
    padding: 80px 6vw;
    text-align: center;
  }
  .cer-quote-inner {
    max-width: 720px; margin: 0 auto;
    position: relative;
  }
  .cer-quote-mark {
    font-family: 'Cormorant Garamond', serif;
    font-size: 120px; line-height: 0.6;
    color: ${C.gold}; opacity: 0.18;
    position: absolute; top: -20px; left: -10px;
    font-style: italic;
    pointer-events: none;
  }
  .cer-quote-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(22px, 3.5vw, 38px);
    font-weight: 300; font-style: italic;
    color: ${C.white}; line-height: 1.55;
    position: relative;
  }
  .cer-quote-author {
    margin-top: 28px;
    font-size: 11px; letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(201,137,58,0.6);
    font-weight: 300;
  }

  /* ── OBISK BANNER ── */
  .cer-visit {
    background: ${C.warm};
    padding: 80px 6vw;
    border-top: 1px solid rgba(201,137,58,0.12);
  }
  .cer-visit-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px; align-items: start;
  }
  .cer-visit-h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 300; color: ${C.white};
    line-height: 1.15; margin-bottom: 20px;
  }
  .cer-visit-h2 em { font-style: italic; color: ${C.gold}; }
  .cer-visit-desc {
    font-size: clamp(15px, 1.5vw, 16px);
    color: rgba(242,234,216,0.52);
    line-height: 1.85; font-weight: 300;
  }
  .cer-visit-grid {
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 2px;
  }
  .cer-visit-item {
    background: ${C.ink};
    padding: 24px 22px;
    border: 1px solid rgba(201,137,58,0.08);
  }
  .cer-visit-item-label {
    font-size: 10px; letter-spacing: 0.22em;
    text-transform: uppercase; color: ${C.gold};
    font-weight: 300; margin-bottom: 10px;
  }
  .cer-visit-item-val {
    font-size: clamp(14px, 1.4vw, 16px);
    color: rgba(242,234,216,0.72);
    line-height: 1.65; font-weight: 300;
  }

  /* ── LIGHTBOX ── */
  .cer-lb-overlay {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(10,8,5,0.97);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .cer-lb-img {
    max-width: 1000px; width: 100%;
    border-radius: 2px; display: block;
    max-height: 85vh; object-fit: contain;
  }
  .cer-lb-close {
    position: absolute; top: 24px; right: 28px;
    background: none; border: none;
    color: rgba(242,234,216,0.45);
    font-size: 13px; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer;
    font-family: 'Crimson Pro', serif;
  }
  .cer-lb-arr {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(201,137,58,0.12);
    border: 1px solid rgba(201,137,58,0.25);
    color: ${C.gold}; width: 44px; height: 44px;
    border-radius: 50%; cursor: pointer; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .cer-lb-arr:hover { background: rgba(201,137,58,0.22); }
  .cer-lb-arr.prev { left: 20px; }
  .cer-lb-arr.next { right: 20px; }

  /* ── MOBILE ── */
  @media (max-width: 760px) {
    .cer-intro {
      grid-template-columns: 1fr;
      gap: 48px; padding: 72px 5vw 60px;
    }
    .cer-intro-stats { grid-template-columns: 1fr 1fr; }
    .cer-gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 220px 180px 180px;
    }
    .cer-gallery-grid .g-main {
      grid-column: 1 / 3; grid-row: 1;
    }
    .cer-gallery-grid .g-tr { grid-column: 1; grid-row: 2; }
    .cer-gallery-grid .g-mr { grid-column: 2; grid-row: 2; }
    .cer-gallery-grid .g-bl { grid-column: 1; grid-row: 3; }
    .cer-gallery-grid .g-br { grid-column: 2; grid-row: 3; }
    .cer-content-inner {
      grid-template-columns: 1fr;
      gap: 40px;
    }
    .cer-content-nav { position: static; }
    .cer-visit-inner { grid-template-columns: 1fr; gap: 40px; }
    .cer-hero-h1 { font-size: clamp(42px, 12vw, 72px); }
    .cer-lb-arr.prev { left: 8px; }
    .cer-lb-arr.next { right: 8px; }
  }

  @media (max-width: 480px) {
    .cer-gallery-grid {
      grid-template-columns: 1fr;
      grid-template-rows: 240px 200px 200px 200px 200px;
    }
    .cer-gallery-grid .g-main { grid-column: 1; grid-row: 1; }
    .cer-gallery-grid .g-tr   { grid-column: 1; grid-row: 2; }
    .cer-gallery-grid .g-mr   { grid-column: 1; grid-row: 3; }
    .cer-gallery-grid .g-bl   { grid-column: 1; grid-row: 4; }
    .cer-gallery-grid .g-br   { grid-column: 1; grid-row: 5; }
    .cer-visit-grid { grid-template-columns: 1fr; }
    .cer-intro-stats { grid-template-columns: 1fr 1fr; }
  }
`;

/* ── SLIKE ── */
const images = [
  { src: "/cer4.jpg",  alt: "Cerkev sv. Ursula — zlati sončni zahod pozimi" },
  { src: "/cer2.jpg",  alt: "Drone pogled na cerkev v mraku" },
  { src: "/cer3.jpg",  alt: "Cerkev poleti z gorskim ozadjem" },
  { src: "/cer1.jpg",  alt: "Zimska cerkev z lesenimi figurami" },
];

/* ── VSEBINSKI BLOKI ── */
const blocks = [
  {
    label: "Zgodovina",
    title: <>Romarska cerkev <em>tisočletne tradicije</em></>,
    body: (
      <>
        <p>Cerkev sv. Ursula na vrhu Uršlje gore je ena najstarejših gorskih cerkvá na Slovenskem. Njeni začetki segajo v zgodnjesrednjeveško dobo, ko so romarji hodili na to sveto mesto z vseh koncev Koroške in Štajerske.</p>
        <p>Posvečena je sveti Uršuli — rimski mučenki, katere godovni dan obeležujemo 21. oktobra. Po njej je dobila ime celotna gora, ki danes sodi med najprepoznavnejše vrhove slovenskega severovzhoda.</p>
      </>
    ),
  },
  {
    label: "Arhitektura",
    title: <>Gotska <em>eleganca</em> na gorski skali</>,
    body: (
      <>
        <p>Stavba združuje romansko jedro z gotskimi dodatki iz 15. in 16. stoletja. Značilni šilasti zvonik, polkrožna apsida in masivni zidovi iz lokalnega kamna pričajo o slogovnem razvoju skozi stoletja.</p>
        <p>Streha iz lesenih skodel, karakteristična za koroške gorske cerkvice, daje stavbi edinstveno silueto — prepoznavno iz kilometrske razdalje. Notranjost krasi baročni oltar s podobo zavetnice.</p>
      </>
    ),
  },
  {
    label: "Romanje",
    title: <>Živo <em>romanje</em> do danes</>,
    body: (
      <>
        <p>Vsako leto na god sv. Ursula, 21. oktobra, se na vrhu Uršlje gore zbere množica romarjev in pohodnikov. Sveta maša pod odprtim nebom — ob jasnem dnevu z razgledom na Alpe in Panonsko nižino — je doživetje, ki se vtisne v spomin.</p>
        <p>Poleg letnega romanja je cerkev priljubljena ciljna točka pohodnikov skozi celo leto. Ključ za ogled notranjosti je dostopen v bližnji planinarski koči Uršlja gora.</p>
      </>
    ),
  },
];

/* ── COMPONENT ── */
export default function CerkevPage() {
  const [lb, setLb] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroO = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.85, delay, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  });

  return (
    <div className="cer-page">
      <style>{G}</style>

      {/* ── HERO ── */}
      <section className="cer-hero" ref={heroRef}>
        <motion.img
          src="/cer4.jpg"
          alt="Cerkev sv. Ursula na Uršlji gori"
          className="cer-hero-img"
          style={{ y: heroY }}
        />
        <div className="cer-hero-veil" />
        <motion.div className="cer-hero-content" style={{ opacity: heroO }}>
          <motion.div
            className="cer-eyebrow"
            initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
          >
            <div className="cer-eyebrow-line" />
            <span className="cer-eyebrow-text">Uršlja gora · 1699 m · Koroška</span>
          </motion.div>

          <motion.h1
            className="cer-hero-h1"
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            Sv. Ursula<br /><em>nad oblaki</em>
          </motion.h1>

          <motion.p
            className="cer-hero-sub"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.75 }}
          >
            Romarska cerkev na vrhu Uršlje gore — tiha priča tisočletij, zakopana v snegu pozimi in ovita v zlato svetlobo poletnih sončnih zahodov.
          </motion.p>

          <motion.div
            className="cer-scroll-hint"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <div className="cer-scroll-hint-line" />
            <span className="cer-scroll-hint-text">Spoznaj</span>
          </motion.div>
        </motion.div>
      </section>

      {/* ── UVOD + STATISTIKE ── */}
      <section style={{ background: C.ink, paddingTop: 0 }}>
        <div className="cer-intro">
          <motion.div {...fadUp(0)}>
            <p className="cer-intro-label">O cerkvi</p>
            <h2 className="cer-intro-h2">
              Kjer se<br /><em>nebo dotakne</em><br />gore
            </h2>
            <div className="cer-intro-body">
              <p>Na nadmorski višini 1699 metrov stoji ena redkih gorskih sakralnih stavb v Evropi, ki je bila ohranjena in aktivna brez prekinitve že skoraj tisočletje.</p>
              <p>Njena bela fasada sijé v pokrajino, ki se razteza od Karavank do Pohorja — kot svetilnik za vse, ki hodijo po gorah Koroške.</p>
            </div>
          </motion.div>

          <motion.div className="cer-intro-stats" {...fadUp(0.18)}>
            {[
              { num: "1699", label: "metrov nad morjem" },
              { num: "12.–13.", label: "stoletje — začetki" },
              { num: "21. okt.", label: "god sv. Ursula · romanje" },
              { num: "360°", label: "razgled na Alpe" },
            ].map((s, i) => (
              <motion.div
                key={i} className="cer-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <div className="cer-stat-num">{s.num}</div>
                <div className="cer-stat-label">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GALERIJA ── */}
      <section className="cer-gallery-section">
        <motion.p className="cer-gallery-label" {...fadUp(0)}>Fotografije</motion.p>
        <motion.div
          className="cer-gallery-grid"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          {[
            { src: "/cer2.jpg", cls: "g-main" },
            { src: "/cer4.jpg", cls: "g-tr" },
            { src: "/cer3.jpg", cls: "g-mr" },
            { src: "/cer1.jpg", cls: "g-bl" },
            { src: "/cer5.jpg", cls: "g-br" },
          ].map((img, i) => (
            <div key={i} className={`cer-gitem ${img.cls}`} onClick={() => setLb(i)}>
              <img src={img.src} alt={images[i % images.length]?.alt ?? ""} />
              <div className="cer-gitem-veil" />
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── VSEBINSKI BLOKI ── */}
      <section className="cer-content-section">
        <div className="cer-content-inner">
          {/* Nav sidebar */}
          <motion.div className="cer-content-nav" {...fadUp(0)}>
            <p className="cer-content-nav-title">Vsebina</p>
            {blocks.map((b, i) => (
              <div key={i} className="cer-nav-item">
                <div className="cer-nav-dot" />
                <span className="cer-nav-text">{b.label}</span>
              </div>
            ))}
          </motion.div>

          {/* Artikel */}
          <div className="cer-article">
            {blocks.map((b, i) => (
              <motion.div key={i} {...fadUp(i * 0.1)}>
                <p className="cer-block-label">{b.label}</p>
                <h3 className="cer-block-h3">{b.title}</h3>
                <div className="cer-block-body">{b.body}</div>
                <div className="cer-divider" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CITAT ── */}
      <section className="cer-quote">
        <motion.div className="cer-quote-inner" {...fadUp(0)}>
          <div className="cer-quote-mark">"</div>
          <p className="cer-quote-text">
            Kdor stopi na Uršljo goro, ne pride le na vrh gore — pride na kraj, kjer čas teče drugače.
          </p>
          <p className="cer-quote-author">— Gorski izrek, Koroška</p>
        </motion.div>
      </section>

      {/* ── OBISK ── */}
      <section className="cer-visit">
        <div className="cer-visit-inner">
          <motion.div {...fadUp(0)}>
            <p className="cer-intro-label" style={{ marginBottom: 18 }}>Načrtuj obisk</p>
            <h2 className="cer-visit-h2">
              Pot do<br /><em>vrha</em>
            </h2>
            <p className="cer-visit-desc">
              Na Uršljo goro vodijo markirane poti iz več strani — iz Koprivne, Mežice in Slovenj Gradca. Pohod traja od 2 do 4 ure, odvisno od izhodiščne točke. Pozimi je pot dostopna s krpljami ali smučmi.
            </p>
          </motion.div>
          <motion.div className="cer-visit-grid" {...fadUp(0.15)}>
            {[
              { label: "Višina",         val: "1699 m n. m." },
              { label: "Dostop",         val: "Peš, poleti tudi s kolesom" },
              { label: "Ključ za ogled", val: "Planinska koča Uršlja gora" },
              { label: "Romanje",        val: "21. oktober — god sv. Ursula" },
              { label: "Razgled",        val: "Karavanke, Alpe, Pohorje" },
              { label: "Priporočeno",    val: "Vse leto, pozimi z opremo" },
            ].map((it, i) => (
              <div key={i} className="cer-visit-item">
                <p className="cer-visit-item-label">{it.label}</p>
                <p className="cer-visit-item-val">{it.val}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lb !== null && (
        <motion.div
          className="cer-lb-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={() => setLb(null)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.26 }}
            onClick={e => e.stopPropagation()}
            style={{ position: "relative", maxWidth: 1000, width: "100%" }}
          >
            <img
              src={["/cer2.jpg", "/cer4.jpg", "/cer3.jpg", "/cer1.jpg", "/cer5.jpg"][lb]}
              alt="Galerija"
              className="cer-lb-img"
            />
            <button className="cer-lb-close" onClick={() => setLb(null)}>✕ Zapri</button>
            {lb > 0 && (
              <button className="cer-lb-arr prev" onClick={() => setLb(l => l! - 1)}>‹</button>
            )}
            {lb < 4 && (
              <button className="cer-lb-arr next" onClick={() => setLb(l => l! + 1)}>›</button>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
