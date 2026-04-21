"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Footer from "./components/Footer";
import SeasonsSection from "./components/SeasonsSection";

const GOLD = "rgba(188, 147, 72, 0.57)";
const CREAM = "#f7f4ef";
const DARK = "#111008";
const GOLD1 = "rgba(215, 191, 148, 0.82)";
function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 36, height: 2, background: light ? "rgba(203, 160, 81, 0.7)" : GOLD, flexShrink: 0 }} />
      <span style={{
        fontSize: 22,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: light ? "rgba(167, 141, 91, 0.9)" : "#8B6914",  // temnejši gold na svetlem ozadju
        fontWeight: 700
      }}>
        {text}
      </span>
    </div>
  );
}
function ActivityCard({ img, title, desc }: { img: string; title: string; desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.35 }}
      style={{
        background: "white", borderRadius: 20,
        border: "1px solid rgba(0,0,0,0.07)",
        overflow: "hidden", display: "flex", flexDirection: "column"
      }}
    >
      {/*
        FIX: Next.js <Image> z loading="lazy" za slike ki niso LCP
        - activity cards so pod foldom = lazy je OK
        - sizes="(max-width: 768px) 100vw, 33vw" = pravi format za grid
      */}
      <div style={{ overflow: "hidden", height: 220, position: "relative" }}>
        <Image
          src={img}
          alt={title}
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          quality={80}
          style={{ objectFit: "cover" }}
        />
      </div>
      <div style={{ padding: "28px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: DARK, marginBottom: 10, letterSpacing: "-0.01em" }}>
          {title}
        </h3>
        <p style={{ fontSize: 15, color: "rgba(17,16,8,0.6)", lineHeight: 1.7, flex: 1 }}>
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: "easeOut" as const } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
  };

  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div style={{ y: videoY, position: "absolute", inset: 0, scale: 1.1 }}>

          {/*
            KLJUČNA OPTIMIZACIJA ZA LCP:

            Problem: video blokira LCP ker se mora naložiti preden browser
            sploh ve kaj je LCP element. Brez poster= je ekran prazen dokler
            se video ne naloži = LCP 6.6s.

            Rešitev:
            1. poster="/hero-poster.jpg" — browser takoj prikaže sliko,
               video se naloži v ozadju. LCP postane JPG slika, ne video.
            2. preload="none" — browser ne prednaložuje video filea pri
               page loadu. Video se začne nalagat šele ko je stran naložena.
               (prej je browser takoj začel nalagat 8.mp4 = blokiral vse)

            POTREBNO: ustvari /public/hero-poster.jpg
            - vzemi frame iz 8.mp4 (VLC → Video → Snapshot)
            - ali katerakoli lepa slika koče/gore
            - priporočena velikost: 1920x1080, ~200KB
          */}
          <video
            src="/8.mp4"
            autoPlay
            muted
            loop
            playsInline
            poster="/hero-poster.jpg"
            preload="none"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0, 0, 0, 0.35)",
            }}
          />
        </motion.div>

        {/* Hero vsebina */}
        <motion.div
          style={{
            y: textY, opacity: heroOpacity,
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", textAlign: "center", padding: "0 24px"
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
          >
            <div style={{ width: 40, height: 1, background: "rgba(221, 204, 171, 0.91)" }} />
            <span style={{ fontSize: 21, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(221, 204, 171, 0.91)", fontWeight: 500 }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 40, height: 1, background: "rgba(221, 204, 171, 0.91)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            style={{ fontSize: "clamp(52px, 10vw, 110px)", fontWeight: 500, color: "white", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}
          >
            Med nebom
            <br />
            <span style={{ color: "rgb(221, 204, 171)" }}>in tišino</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            style={{ marginTop: 24, fontSize: 18, color: "rgb(239, 239, 239)", maxWidth: 440, lineHeight: 1.7 }}
          >
          
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}
          >
            <motion.a
              href="/kontakt"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: GOLD1, color: DARK, fontWeight: 700, padding: "14px 32px", borderRadius: 999, textDecoration: "none", fontSize: 17, letterSpacing: "0.02em" }}
            >
              Obiščite nas →
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

      {/* ── DOBRODOŠLI ── */}
      <section style={{ backgroundColor: CREAM, padding: "100px 24px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel text="Dobrodošli" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 24 }}
          >
            Kraj, kjer se gore dotaknejo <span style={{ color: GOLD }}>neba</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontSize: 18, color: "rgba(17,16,8,0.6)", lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}
          >
            Uršlja gora je ena najbolj prepoznavnih razglednih točk Koroške.
            Ponuja mir, naravo, svež zrak in poti, ki so primerne za vse —
            od družin do izkušenih pohodnikov. Na vrhu vas pričaka koča,
            domačnost in občutek, da ste za trenutek pobegnili iz vsakdana.
          </motion.p>

          <motion.div
            variants={fadeUp}
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2, maxWidth: 560, margin: "0 auto" }}
          >
            {[
              { num: "1699", unit: "m", label: "Nadmorska višina" },
              { num: "10+", unit: "", label: "Pohodnih poti" },
              { num: "100+", unit: "let", label: "Tradicije" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "24px 16px", borderRight: i < 2 ? "1px solid rgba(17,16,8,0.1)" : "none" }}>
                <div style={{ fontSize: 36, fontWeight: 600, color: DARK, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: 18, color: GOLD, marginLeft: 2 }}>{s.unit}</span>
                </div>
                <div style={{ fontSize: 13, color: "rgba(17,16,8,0.45)", marginTop: 6, letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── AKTIVNOSTI ── */}
      <section style={{ backgroundColor: "white", padding: "100px 24px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ maxWidth: 1152, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 56, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <SectionLabel text="Doživetja" />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0 }}>
              Kaj vas čaka na <span style={{ color: GOLD }}>Uršlji gori</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}
          >
            {[
              { img: "/pol2.jpg", title: "Pohodništvo", desc: "Raznolike poti iz Kotlj, Naravskih ledin in Ivarčkega jezera – primerne za družine in izkušene pohodnike." },
              { img: "/razg.jpg", title: "Razgledi & fotografija", desc: "Eden najlepših razgledov na Koroško, Pohorje in Savinjsko dolino. Popolno za sončne vzhode in zahode." },
              { img: "/onas3.jpg", title: "Koča & domačnost", desc: "Topli obroki, čaj, sladice in prijeten kotiček za počitek po vzponu." },
            ].map((a, i) => (
              <motion.div key={i} variants={fadeUp}>
                <ActivityCard {...a} />
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: DARK }} />
        {/*
          FIX: quote banner slika — lazy + sizes za polno širino
          Je pod foldom, ni LCP = lazy je OK
        */}
        <div style={{ position: "absolute", inset: 0 }}>
          <Image
            src="/razgled.jpg"
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            quality={75}
            style={{ objectFit: "cover", opacity: 0.2 }}
          />
        </div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(17,16,8,0.7) 100%)" }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: 64, color: GOLD, lineHeight: 0.5, marginBottom: 24, opacity: 0.5 }}>"</div>
          <p style={{ fontSize: "clamp(22px, 4vw, 36px)", color: "white", fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.01em", fontStyle: "italic" }}>
            Uršlja gora ni le vrh — je kraj, kjer se pohodnik ustavi in za hip pozabi na vse ostalo.
          </p>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "32px auto 0" }} />
        </motion.div>
      </section>

      {/* ── HITRA NAVIGACIJA ── */}
      <section style={{ backgroundColor: CREAM, padding: "100px 24px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1152, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 48, textAlign: "center" }}>
            <SectionLabel text="Explore" />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 500, color: DARK, letterSpacing: "-0.02em" }}>
              Raziščite <span style={{ color: GOLD }}>vse</span>
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
          >
            {[
              { label: "O nas", sub: "Zgodba & tradicija", href: "/onas", img: "/onas3.jpg" },
              { label: "Jedilnik", sub: "Hrana & pijača", href: "/onas/jedilnik", img: "/meni2.jpg" },
              { label: "Prenočišča", sub: "Počitek na vrhu", href: "/prenocisca", img: "/pren1.jpg" },
              { label: "Kontakt", sub: "Kako do nas", href: "/kontakt", img: "/kont.jpg" },
            ].map((item, i) => (
              <motion.a
                key={i}
                href={item.href}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                style={{ position: "relative", borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "block", height: 200 }}
              >
                {/*
                  FIX: nav kartice — lazy + fill + sizes
                  4 kartice v gridu = vsaka ~25vw na desktopu
                */}
                <Image
                  src={item.img}
                  alt={item.label}
                  fill
                  loading="lazy"
                  sizes="(max-width: 768px) 50vw, 25vw"
                  quality={75}
                  style={{ objectFit: "cover" }}
                />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,16,8,0.85) 0%, rgba(17,16,8,0.2) 60%, transparent 100%)" }} />
                <div style={{ position: "absolute", bottom: 20, left: 20 }}>
                  <p style={{ fontSize: 18, fontWeight: 600, color: "white", margin: 0, letterSpacing: "-0.01em" }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", margin: "3px 0 0", letterSpacing: "0.05em" }}>{item.sub}</p>
                </div>
                <div style={{ position: "absolute", top: 16, right: 16, width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14 }}>
                  →
                </div>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <SeasonsSection />
      <Footer dark />
    </main>
  );
}