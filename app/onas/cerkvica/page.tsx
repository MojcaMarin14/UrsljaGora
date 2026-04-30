"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

/* ── TOKENS — enako kot homepage ── */
const GOLD = "var(--accent)";
const CREAM = "var(--section-bg)";
const DARK = "var(--heading)";
const WARM      = "#1a1812";

/* ── GLOBAL STYLES ── */
const G = `
  .cer-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .cer-page { background: ${DARK}; color: ${CREAM}; overflow-x: hidden; }

  /* GALLERY */
  .cer-gallery-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-template-rows: 340px 280px;
    gap: 3px; padding: 0 3px;
  }
  .cer-gallery-grid .g-main { grid-column: 1; grid-row: 1 / 3; }
  .cer-gallery-grid .g-tr   { grid-column: 2; grid-row: 1; }
  .cer-gallery-grid .g-mr   { grid-column: 3; grid-row: 1; }
  .cer-gallery-grid .g-bl   { grid-column: 2; grid-row: 2; }
  .cer-gallery-grid .g-br   { grid-column: 3; grid-row: 2; }

  .cer-gitem {
    overflow: hidden; cursor: pointer; position: relative;
    background: ${WARM};
  }
  .cer-gitem img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.7s cubic-bezier(0.25,0.1,0.25,1);
  }
  .cer-gitem:hover img { transform: scale(1.06); }
  .cer-gitem-veil {
    position: absolute; inset: 0;
    background: rgba(17,16,8,0);
    transition: background 0.4s;
  }
  .cer-gitem:hover .cer-gitem-veil { background: rgba(17,16,8,0.18); }

  /* CONTENT */
  .cer-content-inner {
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 2fr;
    gap: 80px; align-items: start;
  }
  .cer-content-nav { position: sticky; top: 100px; }
  .cer-nav-item {
    display: flex; align-items: center; gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(201,169,110,0.1);
  }
  .cer-nav-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: ${GOLD}; flex-shrink: 0;
  }
  .cer-nav-text {
    font-size: 12px; letter-spacing: 0.1em;
    color: rgba(247,244,239,0.45);
    text-transform: uppercase;
  }
  .cer-article { display: flex; flex-direction: column; gap: 60px; }
  .cer-divider {
    width: 48px; height: 1px;
    background: linear-gradient(to right, ${GOLD}, transparent);
    margin-top: 8px; opacity: 0.6;
  }

  /* STATS */
  .cer-stats-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  }
  .cer-stat {
    background: ${WARM};
    padding: 28px 24px;
    border: 1px solid rgba(201,169,110,0.08);
    transition: border-color 0.3s;
  }
  .cer-stat:hover { border-color: rgba(201,169,110,0.3); }

  /* VISIT GRID */
  .cer-visit-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  }
  .cer-visit-item {
    background: ${DARK};
    padding: 24px 22px;
    border: 1px solid rgba(201,169,110,0.08);
  }

  /* LIGHTBOX */
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
    color: rgba(247,244,239,0.45);
    font-size: 12px; letter-spacing: 0.1em;
    text-transform: uppercase; cursor: pointer;
  }
  .cer-lb-arr {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(201,169,110,0.1);
    border: 1px solid rgba(201,169,110,0.25);
    color: ${GOLD}; width: 44px; height: 44px;
    border-radius: 50%; cursor: pointer; font-size: 22px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .cer-lb-arr:hover { background: rgba(201,169,110,0.22); }
  .cer-lb-arr.prev { left: 20px; }
  .cer-lb-arr.next { right: 20px; }

  /* MOBILE */
  @media (max-width: 760px) {
    .cer-content-inner { grid-template-columns: 1fr; gap: 40px; }
    .cer-content-nav { position: static; }
    .cer-gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 220px 180px 180px;
    }
    .cer-gallery-grid .g-main { grid-column: 1 / 3; grid-row: 1; }
    .cer-gallery-grid .g-tr   { grid-column: 1; grid-row: 2; }
    .cer-gallery-grid .g-mr   { grid-column: 2; grid-row: 2; }
    .cer-gallery-grid .g-bl   { grid-column: 1; grid-row: 3; }
    .cer-gallery-grid .g-br   { grid-column: 2; grid-row: 3; }
    .cer-visit-grid { grid-template-columns: 1fr; }
    .cer-stats-grid { grid-template-columns: 1fr 1fr; }
    .cer-lb-arr.prev { left: 8px; }
    .cer-lb-arr.next { right: 8px; }
  }
  @media (max-width: 480px) {
    .cer-gallery-grid {
      grid-template-columns: 1fr;
      grid-template-rows: 240px 200px 200px 200px 200px;
    }
    .cer-gallery-grid .g-main { grid-column:1; grid-row:1; }
    .cer-gallery-grid .g-tr   { grid-column:1; grid-row:2; }
    .cer-gallery-grid .g-mr   { grid-column:1; grid-row:3; }
    .cer-gallery-grid .g-bl   { grid-column:1; grid-row:4; }
    .cer-gallery-grid .g-br   { grid-column:1; grid-row:5; }
  }
`;

/* ── ENAKA KOT HOMEPAGE ── */
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

const blocks = [
  {
    label: "Zgodovina",
    title: <>Romarska cerkev tisočletne <span style={{ color: GOLD }}>tradicije</span></>,
    body: (
      <>
        <p>Cerkev sv. Ursula na vrhu Uršlje gore je ena najstarejših gorskih cerkvá na Slovenskem. Njeni začetki segajo v zgodnjesrednjeveško dobo, ko so romarji hodili na to sveto mesto z vseh koncev Koroške in Štajerske.</p>
        <p>Posvečena je sveti Uršuli — rimski mučenki, katere godovni dan obeležujemo 21. oktobra. Po njej je dobila ime celotna gora, ki danes sodi med najprepoznavnejše vrhove slovenskega severovzhoda.</p>
      </>
    ),
  },
  {
    label: "Arhitektura",
    title: <>Gotska eleganca na <span style={{ color: GOLD }}>gorski skali</span></>,
    body: (
      <>
        <p>Stavba združuje romansko jedro z gotskimi dodatki iz 15. in 16. stoletja. Značilni šilasti zvonik, polkrožna apsida in masivni zidovi iz lokalnega kamna pričajo o slogovnem razvoju skozi stoletja.</p>
        <p>Streha iz lesenih skodel, karakteristična za koroške gorske cerkvice, daje stavbi edinstveno silueto — prepoznavno iz kilometrske razdalje. Notranjost krasi baročni oltar s podobo zavetnice.</p>
      </>
    ),
  },
  {
    label: "Romanje",
    title: <>Živo romanje <span style={{ color: GOLD }}>do danes</span></>,
    body: (
      <>
        <p>Vsako leto na god sv. Ursula, 21. oktobra, se na vrhu Uršlje gore zbere množica romarjev in pohodnikov. Sveta maša pod odprtim nebom — ob jasnem dnevu z razgledom na Alpe in Panonsko nižino — je doživetje, ki se vtisne v spomin.</p>
        <p>Poleg letnega romanja je cerkev priljubljena ciljna točka pohodnikov skozi celo leto. Ključ za ogled notranjosti je dostopen v bližnji planinarski koči Uršlja gora.</p>
      </>
    ),
  },
];

const galleryImgs = [
  { src: "/cer2.jpg", cls: "g-main" },
  { src: "/cer4.jpg", cls: "g-tr" },
  { src: "/cer3.jpg", cls: "g-mr" },
  { src: "/cer1.jpg", cls: "g-bl" },
  { src: "/cer5.jpg", cls: "g-br" },
];

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
    transition: { duration: 0.85, delay, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
  });

  return (
    <div className="cer-page">
      <style>{G}</style>

      {/* ── HERO — enak slog kot homepage ── */}
      <section ref={heroRef} style={{ position: "relative", height: "100svh", minHeight: 560, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <Image
            src="/cer4.jpg"
            alt="Cerkev sv. Ursula na Uršlji gori"
            fill priority sizes="100vw" quality={85}
            style={{ objectFit: "cover" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(17,16,8,0.2) 0%, rgba(17,16,8,0.4) 60%, rgba(17,16,8,0.92) 100%)",
          }} />
        </motion.div>

        <motion.div
          style={{ opacity: heroO, position: "relative", zIndex: 10, height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center", padding: "0 24px" }}
        >
          {/* Eyebrow — enako kot homepage */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
          >
          
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontSize: "clamp(52px, 9vw, 110px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}
          >
            Sv. Uršula<br />
            <span style={{ color: "rgb(221,204,171)" }}>nad oblaki</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: 22, fontSize: 17, color: "rgba(255, 255, 255, 0.9)", maxWidth: 460, lineHeight: 1.75 }}
          >
            Romarska cerkev na vrhu Uršlje gore — tiha priča tisočletij, zakopana v snegu pozimi in ovita v zlato svetlobo poletnih sončnih zahodov.
          </motion.p>

          {/* Scroll indikator — enako kot homepage */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            style={{ position: "absolute", bottom: 36, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(201,169,110,0.7), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── UVOD + STATISTIKE — svetla sekcija ── */}
      <section style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <motion.div {...fadUp(0)}>
            <SectionLabel text="O cerkvi" />
            <h2 style={{ fontSize: "clamp(30px, 4vw, 50px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 24 }}>
              Kjer se nebo dotakne <span style={{ color: GOLD }}>gore</span>
            </h2>
            <div style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.88, display: "flex", flexDirection: "column", gap: 14 }}>
              <p>Na nadmorski višini 1699 metrov stoji ena redkih gorskih sakralnih stavb v Evropi, ki je bila ohranjena in aktivna brez prekinitve že skoraj tisočletje.</p>
              <p>Njena bela fasada sijé v pokrajino, ki se razteza od Karavank do Pohorja — kot svetilnik za vse, ki hodijo po gorah Koroške.</p>
            </div>
          </motion.div>

          <motion.div className="cer-stats-grid" {...fadUp(0.18)}>
            {[
              { num: "1699",    label: "metrov nad morjem" },
              { num: "12.–13.", label: "stoletje — začetki" },
              { num: "21. okt.",label: "god sv. Ursula · romanje" },
              { num: "360°",    label: "razgled na Alpe" },
            ].map((s, i) => (
              <motion.div
                key={i} className="cer-stat"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
              >
                <div style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 600, color: CREAM, lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, marginTop: 8, fontWeight: 600 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GALERIJA — temna sekcija ── */}
      <section style={{ backgroundColor: "var(--section-bg-dark)", padding: "80px 0 100px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <motion.div {...fadUp(0)} style={{ marginBottom: 36 }}>
            <SectionLabel text="Fotografije" light />
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "var(--heading-inv)", letterSpacing: "-0.025em", margin: 0 }}>
              Skozi letne <span style={{ color: GOLD }}>čase</span>
            </h2>
          </motion.div>
          <motion.div
            className="cer-gallery-grid"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ duration: 0.9 }}
          >
            {galleryImgs.map((img, i) => (
              <div key={i} className={`cer-gitem ${img.cls}`} onClick={() => setLb(i)}>
                <img src={img.src} alt={`Cerkev sv. Ursula ${i + 1}`} />
                <div className="cer-gitem-veil" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VSEBINSKI BLOKI — temna sekcija ── */}
      <section style={{ backgroundColor: WARM, padding: "90px 24px" }}>
        <div className="cer-content-inner">
          {/* Nav sidebar */}
          <motion.div className="cer-content-nav" {...fadUp(0)}>
            <p style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 24 }}>Vsebina</p>
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
                <SectionLabel text={b.label} light />
                <h3 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: CREAM, lineHeight: 1.2, marginBottom: 20 }}>
                  {b.title}
                </h3>
                <div style={{ fontSize: "clamp(15px, 1.5vw, 17px)", color: "rgba(247,244,239,0.58)", lineHeight: 1.9 }}>
                  {b.body}
                </div>
                <div className="cer-divider" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE — enako kot homepage ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--section-bg-dark)" }} />
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/cer2.jpg" alt="" fill loading="lazy" sizes="100vw" quality={60}
            style={{ objectFit: "cover", opacity: 0.18 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(17,16,8,0.8) 100%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: 64, color: GOLD, lineHeight: 0.5, marginBottom: 24, opacity: 0.5 }}>"</div>
          <p style={{ fontSize: "clamp(22px, 4vw, 36px)", color: "var(--heading-inv)", fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.01em", fontStyle: "italic" }}>
            Kdor stopi na Uršljo goro, ne pride le na vrh gore — pride na kraj, kjer čas teče drugače.
          </p>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "32px auto 0" }} />
          <p style={{ marginTop: 20, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-primary-inv)" }}>
            Gorski izrek · Koroška
          </p>
        </motion.div>
      </section>

      {/* ── OBISK — svetla sekcija ── */}
      <section style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 60, alignItems: "start" }}>
          <motion.div {...fadUp(0)}>
            <SectionLabel text="Načrtuj obisk" />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.15, marginBottom: 20 }}>
              Pot do <span style={{ color: GOLD }}>vrha</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.85, marginBottom: 0 }}>
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
              <div key={i} style={{
                background: "white", padding: "22px 20px",
                border: "1px solid rgba(0,0,0,0.07)",
                borderLeft: `3px solid ${GOLD}`,
              }}>
                <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8, fontWeight: 600 }}>{it.label}</p>
                <p style={{ fontSize: 15, color: DARK, fontWeight: 500 }}>{it.val}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lb !== null && (
        <motion.div
          className="cer-lb-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
              src={galleryImgs[lb].src}
              alt="Cerkev sv. Ursula na Uršlji gori"
              className="cer-lb-img"
            />
            <button className="cer-lb-close" onClick={() => setLb(null)}>✕ Zapri</button>
            {lb > 0 && <button className="cer-lb-arr prev" onClick={() => setLb(l => l! - 1)}>‹</button>}
            {lb < galleryImgs.length - 1 && <button className="cer-lb-arr next" onClick={() => setLb(l => l! + 1)}>›</button>}
          </motion.div>
        </motion.div>
      )}

  

   
    </div>
  );
}