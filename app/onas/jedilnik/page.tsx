"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";

const GOLD = "var(--accent)";
const BG = "var(--background)";

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 32, height: 1, background: GOLD, flexShrink: 0 }} />
      <span style={{ fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--label)", fontWeight: 700 }}>
        {text}
      </span>
    </div>
  );
}

export default function JedilnikPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const rednaPonudba = [
    { ime: "Jota s klobaso", opis: "Tradicionalna koroška jota z domačo klobaso.", cena: "9.50 €", slika: "/jota.jpg" },
    { ime: "Ajdovi žganci", opis: "Postreženi z ocvirki in kislim mlekom.", cena: "7.00 €", slika: "/zganci.jpg" },
    { ime: "Štruklji po domače", opis: "Domači štruklji z orehi ali skuto.", cena: "6.50 €", slika: "/struklji.jpg" },
  ];

  return (
    <main style={{ width: "100%", backgroundColor: BG, color: "var(--text-primary-inv)", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{ y: heroY, position: "absolute", inset: 0 }}
        >
          <Image
            src="/menuphoto.jpg"
            alt="Jedilnik — Dom na Uršlji gori"
            fill
            priority
            sizes="100vw"
            quality={85}
            style={{ objectFit: "cover" }}
          />
          <div className="hero-overlay" style={{ position: "absolute", inset: 0 }} />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", textAlign: "center", padding: "0 24px", paddingTop: 96
          }}
        >
      

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            className="hero-title"
            style={{ fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, margin: 0 }}
          >
            Jedil<span style={{ color: GOLD }}>nik</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ height: 1, background: "rgba(212,182,118,0.6)", marginTop: 32, borderRadius: 999 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ marginTop: 24, fontSize: 20, color: "rgba(255,255,255,0.65)", maxWidth: 400, lineHeight: 1.7 }}
          >
            Domače jedi, pripravljene iz lokalnih sestavin.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
              Pomakni navzdol
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.3), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* ── UVOD ── */}
      <section style={{ padding: "100px 24px 60px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <motion.div variants={fadeUp}>
            <SectionLabel text="Redna ponudba" />
          </motion.div>
          <motion.h2
            variants={fadeUp}
            style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.2, color: "var(--heading-inv)", marginBottom: 24 }}
          >
            Okusi <span style={{ color: GOLD }}>domačega</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            style={{ fontSize: 18, color: "var(--text-muted-inv)", lineHeight: 1.8 }}
          >
            Naša stalna izbira domačih jedi, pripravljenih iz lokalnih sestavin in postreženih v prijetnem ambientu naše koče.
          </motion.p>
          <motion.div variants={fadeUp} style={{ width: 40, height: 1, background: GOLD, margin: "32px auto 0", opacity: 0.6 }} />
        </motion.div>
      </section>

      {/* ── JEDI ── */}
      <section style={{ padding: "40px 24px 100px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}
        >
          {rednaPonudba.map((j, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35 }}
              style={{ borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--section-bg-dark)" }}
            >
              <div style={{ position: "relative", height: 240, overflow: "hidden" }}>
                <Image src={j.slika} alt={j.ime} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" quality={80} style={{ objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(8,8,8,0.6), transparent)" }} />
              </div>
              <div style={{ padding: "28px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: 22, fontWeight: 500, color: "var(--heading-inv)", marginBottom: 10, letterSpacing: "-0.01em" }}>
                  {j.ime}
                </h3>
                <p style={{ fontSize: 15, color: "var(--text-muted-inv)", lineHeight: 1.7, flex: 1 }}>
                  {j.opis}
                </p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 24, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 24, fontWeight: 600, color: GOLD, letterSpacing: "-0.02em" }}>{j.cena}</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted-2)", letterSpacing: "0.1em", textTransform: "uppercase" }}>Domača jed</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--section-bg-dark)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, rgba(212,182,118,0.07) 0%, transparent 70%)" }} />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: 64, color: GOLD, lineHeight: 0.5, marginBottom: 24, opacity: 0.4 }}>"</div>
          <p style={{ fontSize: "clamp(20px, 3vw, 32px)", color: "var(--text-primary-inv)", fontWeight: 400, lineHeight: 1.6, letterSpacing: "-0.01em", fontStyle: "italic", opacity: 0.85 }}>
            Vsak obrok je pripravljen z ljubeznijo — tako kot ga pripravi domača roka.
          </p>
          <div style={{ width: 40, height: 1, background: GOLD, margin: "32px auto 0", opacity: 0.5 }} />
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: "100px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ maxWidth: 760, margin: "0 auto" }}
        >
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid var(--border)", padding: "80px 48px", textAlign: "center" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,182,118,0.08), transparent)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 64, background: "linear-gradient(to bottom, rgba(212,182,118,0.6), transparent)" }} />
            <div style={{ position: "relative", zIndex: 10 }}>
              <SectionLabel text="Posebne ponudbe" />
              <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, letterSpacing: "-0.02em", color: "var(--heading-inv)", marginBottom: 16 }}>
                Sezonske <span style={{ color: GOLD }}>specialitete</span>
              </h2>
              <p style={{ fontSize: 17, color: "var(--text-muted-inv)", maxWidth: 360, margin: "0 auto 36px", lineHeight: 1.7 }}>
                Posebne jedi glede na sezono in razpoložljive sestavine.
              </p>
              <motion.a
                href="/aktualno/ponudbe"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: "black", fontWeight: 600, padding: "16px 36px", borderRadius: 999, textDecoration: "none", fontSize: 16 }}
              >
                Poglej posebne ponudbe →
              </motion.a>
            </div>
          </div>
        </motion.div>
      </section>

      <Footer />
    </main>
  );
}