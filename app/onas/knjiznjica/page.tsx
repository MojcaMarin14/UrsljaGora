"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

/* ── TOKENS — enako kot homepage ── */
const GOLD = "var(--accent)";
const CREAM = "var(--section-bg)";
const DARK = "var(--heading)";
const WARM       = "#1a1812";

/* ── GLOBAL STYLES ── */
const G = `
  .knj-page * { box-sizing: border-box; margin: 0; padding: 0; }
  .knj-page { background: ${DARK}; color: ${CREAM}; overflow-x: hidden; }

  /* GALLERY GRID */
  .knj-gallery-grid {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    grid-template-rows: 320px 260px;
    gap: 3px;
  }
  .knj-gallery-grid .gc-main { grid-column: 1; grid-row: 1 / 3; }
  .knj-gallery-grid .gc-tr   { grid-column: 2; grid-row: 1; }
  .knj-gallery-grid .gc-mr   { grid-column: 3; grid-row: 1; }
  .knj-gallery-grid .gc-bl   { grid-column: 2; grid-row: 2; }
  .knj-gallery-grid .gc-br   { grid-column: 3; grid-row: 2; }

  .knj-gitem {
    overflow: hidden; cursor: zoom-in; position: relative;
    background: ${WARM};
  }
  .knj-gitem img {
    width: 100%; height: 100%; object-fit: cover; display: block;
    transition: transform 0.65s cubic-bezier(0.25,0.1,0.25,1);
  }
  .knj-gitem:hover img { transform: scale(1.06); }

  /* FEATURES GRID */
  .knj-features-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2px;
  }
  .knj-feature {
    background: rgba(247,244,239,0.04);
    border: 1px solid rgba(201,169,110,0.08);
    padding: 32px 28px;
    transition: background 0.3s, border-color 0.3s;
  }
  .knj-feature:hover {
    background: rgba(201,169,110,0.06);
    border-color: rgba(201,169,110,0.22);
  }

  /* INFO GRID */
  .knj-info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 2px;
  }
  .knj-info-item {
    background: rgba(247,244,239,0.04);
    padding: 22px 20px;
    border-left: 2px solid ${GOLD};
    border-bottom: 1px solid rgba(201,169,110,0.08);
  }

  /* LIGHTBOX */
  .knj-lb {
    position: fixed; inset: 0; z-index: 9000;
    background: rgba(10,8,5,0.97);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .knj-lb-box { position: relative; max-width: 960px; width: 100%; }
  .knj-lb-img { width: 100%; display: block; max-height: 85vh; object-fit: contain; border-radius: 2px; }
  .knj-lb-close {
    position: absolute; top: -36px; right: 0;
    background: none; border: none; cursor: pointer;
    font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase;
    color: rgba(247,244,239,0.4);
  }
  .knj-lb-btn {
    position: absolute; top: 50%; transform: translateY(-50%);
    background: rgba(201,169,110,0.1); border: 1px solid rgba(201,169,110,0.25);
    color: ${GOLD}; width: 42px; height: 42px; border-radius: 50%;
    cursor: pointer; font-size: 20px;
    display: flex; align-items: center; justify-content: center;
    transition: background 0.2s;
  }
  .knj-lb-btn:hover { background: rgba(201,169,110,0.2); }
  .knj-lb-btn.prev { left: -54px; }
  .knj-lb-btn.next { right: -54px; }

  /* MOBILE */
  @media (max-width: 780px) {
    .knj-features-grid { grid-template-columns: 1fr; }
    .knj-gallery-grid {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 200px 180px 180px;
    }
    .knj-gallery-grid .gc-main { grid-column: 1 / 3; grid-row: 1; }
    .knj-gallery-grid .gc-tr   { grid-column: 1; grid-row: 2; }
    .knj-gallery-grid .gc-mr   { grid-column: 2; grid-row: 2; }
    .knj-gallery-grid .gc-bl   { grid-column: 1; grid-row: 3; }
    .knj-gallery-grid .gc-br   { grid-column: 2; grid-row: 3; }
    .knj-info-grid { grid-template-columns: 1fr; }
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
  }
`;

/* ── ENAKA KOMPONENTA KOT NA HOMEPAGE ── */
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

/* ── PODATKI ── */
const galleryItems = [
  { src: "/knji3.jpg", cls: "gc-main", alt: "Bralni kotiček s kaminom" },
  { src: "/knji1.jpg", cls: "gc-tr",   alt: "Knjige na polici — Uršlja gora" },
  { src: "/knji2.jpg", cls: "gc-mr",   alt: "Izposojevališče z laptopom" },
  { src: "/knji5.jpg", cls: "gc-bl",   alt: "Rumeni stoli ob kaminu" },
  { src: "/knji4.jpg", cls: "gc-br",   alt: "Knjiga Uršlja gora — Koroška lepotica" },
];

const features = [
  { icon: "📚", title: "Prava knjižnica na vrhu",    body: "Deveta enota Koroške osrednje knjižnice dr. Franca Sušnika. Uradno evidentirano izposojevališče z možnostjo izposoje in vračanja knjig." },
  { icon: "🌲", title: "Znanje in narava",           body: "Bralni kotiček z razgledom na Karavanke — med leseno mizo, rumenimi stoli in kaminom. Za telo in duha hkrati." },
  { icon: "👦", title: "Za vse generacije",          body: "Posebni otroški kotiček s knjigami Primoža Suhodolčana, planinska literatura, Koroška in Slovenija." },
  { icon: "📅", title: "Odprto skozi vse leto",      body: "Izposojevališče deluje najmanj 4 ure na teden, sicer v času odprtosti Doma na Uršlji gori — tudi pozimi." },
  { icon: "🌿", title: "Zelena knjižica",            body: "Trajnostna pot do knjižnice peš, s kolesom ali javnim prevozom. Bralna kultura + okoljska zavest." },
  { icon: "🗺️", title: "1699 m — rekordna točka",   body: "Skupaj z najvišje ležečo cerkvijo in čebelnjakom je Uršlja gora trikratni rekorder — edinstven kraj v Sloveniji." },
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
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const heroO = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadUp = (delay = 0) => ({
    initial: { opacity: 0, y: 36 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] as [number,number,number,number] },
  });

  return (
    <div className="knj-page">
      <style>{G}</style>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", height: "100svh", minHeight: 540, overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          <Image
            src="/knj77.jpg"
            alt="Izposojevališče Uršlja gora"
            fill priority sizes="100vw" quality={85}
            style={{ objectFit: "cover" }}
          />
          {/* Enak overlay kot quote banner na homepage */}
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to bottom, rgba(17,16,8,0.25) 0%, rgba(17,16,8,0.45) 60%, rgba(17,16,8,0.92) 100%)",
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
            style={{ fontSize: "clamp(48px, 9vw, 100px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}
          >
            Knjižnica<br />
            <span style={{ color: "rgb(221,204,171)" }}>na vrhu gore</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: 22, fontSize: 17, color: "rgba(255, 255, 255, 0.94)", maxWidth: 420, lineHeight: 1.75 }}
          >
            Izposojevališče Uršlja gora — kjer se znanje sreča z naravo 
          </motion.p>

          {/* Badges — enako kot homepage CTA area */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{ display: "flex", gap: 10, marginTop: 36, flexWrap: "wrap", justifyContent: "center" }}
          >
            {["Najvišje v Sloveniji", "KOK Ravne na Koroškem", "9. enota knjižnice"].map((b, i) => (
              <span key={i} style={{
                background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: 999, padding: "7px 18px",
                fontSize: 17, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "rgba(255, 255, 255, 0.94)",
              }}>{b}</span>
            ))}
          </motion.div>

        </motion.div>
      </section>

      {/* ── STRIP — enako kot homepage statistike ── */}
      <div style={{ backgroundColor: WARM, borderTop: "1px solid rgba(201,169,110,0.12)", borderBottom: "1px solid rgba(201,169,110,0.12)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
          {[
            { num: "1699 m", label: "Nadmorska višina" },
            { num: "#1",     label: "Najvišje v Sloveniji" },
            { num: "9.",     label: "Enota KOK" },
            { num: "2025",   label: "Leto odprtja" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "28px 16px", textAlign: "center",
              borderRight: i < 3 ? "1px solid rgba(201,169,110,0.1)" : "none",
            }}>
              <div style={{ fontSize: 32, fontWeight: 600, color: CREAM, letterSpacing: "-0.03em", lineHeight: 1 }}>
                {s.num}
              </div>
              <div style={{ fontSize: 11, color: "rgba(247,244,239,0.4)", marginTop: 6, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── UVOD — svetla sekcija kot "Dobrodošli" na homepage ── */}
      <section style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <motion.div
          style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}
          {...fadUp(0)}
        >
          {/* Slika */}
          <div style={{ position: "relative", borderRadius: 20, overflow: "hidden", height: 480 }}>
            <Image
              src="/knji2.jpg" alt="Izposojevališče — pogled na polico"
              fill loading="lazy" sizes="(max-width: 768px) 100vw, 50vw" quality={80}
              style={{ objectFit: "cover" }}
            />
            {/* Badge čez sliko */}
            <div style={{
              position: "absolute", bottom: -16, right: -16,
              background: DARK, padding: "20px 24px", borderRadius: 16,
              border: `3px solid ${CREAM}`,
            }}>
              <div style={{ fontSize: 36, fontWeight: 600, color: GOLD, lineHeight: 1 }}>9.</div>
              <div style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(247,244,239,0.55)", marginTop: 4 }}>
                enota knjižnice
              </div>
            </div>
          </div>

          {/* Besedilo */}
          <div>
            <SectionLabel text="O izposojevališču" />
            <h2 style={{ fontSize: "clamp(28px, 3.5vw, 44px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 24 }}>
              Kjer se knjiga in gora <span style={{ color: GOLD }}>srečata</span>
            </h2>
            <div style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.85, display: "flex", flexDirection: "column", gap: 14 }}>
              <p>V soboto, 21. junija 2025 — na poletni solsticij — je Koroška osrednja knjižnica dr. Franca Sušnika slovesno odprla deveto knjižnično enoto: izposojevališče Uršlja gora.</p>
              <p>S tem je Uršlja gora postala najvišje ležeče izposojevališče knjig v Sloveniji. Skupaj z najvišje ležečo cerkvijo sv. Ursula in čebelnjakom — gora sedi na vrhu tudi kulturno.</p>
              <p>Med police so zašle planinska literatura, knjige o Koroški, otroški kotiček in domači avtorji.</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── GALERIJA — temna sekcija ── */}
      <section style={{ backgroundColor: "var(--section-bg-dark)", padding: "80px 0 100px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px" }}>
          <motion.div
            {...fadUp(0)}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 36, flexWrap: "wrap", gap: 12 }}
          >
            <div>
              <SectionLabel text="Fotografije" light />
              <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 500, color: "var(--heading-inv)", letterSpacing: "-0.025em", margin: 0 }}>
                Prostori <span style={{ color: GOLD }}>izposojevališča</span>
              </h2>
            </div>
          </motion.div>

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
        </div>
      </section>

      {/* ── FEATURES — bela sekcija kot "Aktivnosti" na homepage ── */}
      <section style={{ backgroundColor: "white", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <motion.div {...fadUp(0)} style={{ marginBottom: 56, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <SectionLabel text="Kaj ponujamo" />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0 }}>
              Knjižnica za <span style={{ color: GOLD }}>dušo in telo</span>
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
                style={{ background: "white", border: "1px solid rgba(0,0,0,0.07)", padding: "32px 28px", transition: "border-color 0.3s" }}
              >
                <span style={{ fontSize: 28, marginBottom: 16, display: "block" }}>{f.icon}</span>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: DARK, marginBottom: 10, letterSpacing: "-0.01em" }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-muted)", lineHeight: 1.8 }}>{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── QUOTE BANNER — enako kot homepage ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--section-bg-dark)" }} />
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/knji3.jpg" alt="" fill loading="lazy" sizes="100vw" quality={60}
            style={{ objectFit: "cover", opacity: 0.15 }} />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(17,16,8,0.8) 100%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: 64, color: GOLD, lineHeight: 0.5, marginBottom: 24, opacity: 0.5 }}>"</div>
          <p style={{ fontSize: "clamp(20px, 3.5vw, 34px)", color: "var(--heading-inv)", fontWeight: 400, lineHeight: 1.55, letterSpacing: "-0.01em", fontStyle: "italic" }}>
            Knjižnica se je povzpela do pohodnikov — da ni treba izbirati med knjigo in goro.
          </p>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "32px auto 0" }} />
          <p style={{ marginTop: 20, fontSize: 14, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--text-primary-inv)" }}>
            Aljaž Verhovnik · Direktor KOK dr. Franca Sušnika
          </p>
        </motion.div>
      </section>

      {/* ── INFO — svetla sekcija ── */}
      <section style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start" }}>
          <motion.div {...fadUp(0)}>
            <SectionLabel text="Praktično" />
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 20 }}>
              Načrtuj <span style={{ color: GOLD }}>obisk</span>
            </h2>
            <p style={{ fontSize: 16, color: "var(--text-muted)", lineHeight: 1.88, marginBottom: 28 }}>
              Izposojevališče je del Doma na Uršlji gori in deluje v skladu z urnikom koče. Za izposojo knjig potrebuješ člansko izkaznico Koroške osrednje knjižnice.
            </p>
            <motion.a
              href="https://www.knjiznica-ravne.si"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ x: 4 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, fontWeight: 600, fontSize: 14, textDecoration: "none", letterSpacing: "0.06em", textTransform: "uppercase" }}
            >
              Spletna stran knjižnice →
            </motion.a>
          </motion.div>

          <motion.div className="knj-info-grid" {...fadUp(0.15)}>
            {infoItems.map((it, i) => (
              <div key={i} style={{
                background: "white", padding: "22px 20px",
                borderLeft: `3px solid ${GOLD}`,
                border: "1px solid rgba(0,0,0,0.07)",
                borderLeftWidth: 3, borderLeftColor: GOLD,
              }}>
                <p style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: 8, fontWeight: 600 }}>{it.lbl}</p>
                <p style={{ fontSize: 15, color: DARK, fontWeight: 500 }}>{it.val}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {lb !== null && (
        <motion.div
          className="knj-lb"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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
            {lb > 0 && <button className="knj-lb-btn prev" onClick={() => setLb(l => l! - 1)}>‹</button>}
            {lb < galleryItems.length - 1 && <button className="knj-lb-btn next" onClick={() => setLb(l => l! + 1)}>›</button>}
          </motion.div>
        </motion.div>
      )}

      <div style={{ backgroundColor: "var(--section-bg-dark)" }}>
    
      </div>
       
    </div>
    
  );
}