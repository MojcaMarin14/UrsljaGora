"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useState, useRef } from "react";
import Image from "next/image";
import Footer from "@/app/components/Footer";

function SimpleSlider() {
  const images = ["/cebel.jpg", "/knj.jpg", "/cerk.jpg"];
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl" style={{ position: "relative" }}>
      {/*
        FIX: Next.js <Image> z fill za slider
        - loading="lazy" ker je slider pod foldom
        - sizes="(max-width: 768px) 100vw, 50vw"
      */}
      <div style={{ position: "relative", height: 480, borderRadius: 24, overflow: "hidden" }}>
        <Image
          key={index}
          src={images[index]}
          alt="Dom na Uršlji gori – galerija"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 50vw"
          quality={80}
          style={{ objectFit: "cover", borderRadius: 24 }}
        />
        <motion.div
          key={`overlay-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          style={{ position: "absolute", inset: 0 }}
        />
      </div>
      <div
        style={{ position: "absolute", inset: 0, borderRadius: 24, pointerEvents: "none", background: "linear-gradient(to top, rgba(0,0,0,0.4), transparent)" }}
      />
      <div style={{ position: "absolute", bottom: 20, right: 20, display: "flex", gap: 8, zIndex: 10 }}>
        <button
          onClick={() => setIndex((index - 1 + images.length) % images.length)}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Prejšnja slika"
        >‹</button>
        <button
          onClick={() => setIndex((index + 1) % images.length)}
          style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "1px solid rgba(255,255,255,0.2)", color: "white", fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
          aria-label="Naslednja slika"
        >›</button>
      </div>
      <div style={{ position: "absolute", bottom: 24, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 10 }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Slika ${i + 1}`}
            style={{
              borderRadius: 999, height: 8,
              width: i === index ? 24 : 8,
              background: i === index ? "#d4b676" : "rgba(255,255,255,0.5)",
              border: "none", cursor: "pointer",
              transition: "all 0.3s", padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SectionLabel({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 32, height: 1, background: "#d4b676", flexShrink: 0 }} />
      <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#d4b676", fontWeight: 500 }}>
        {text}
      </span>
    </div>
  );
}

export default function ONasPage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } },
  };

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.15 } },
  };

  const BG = "#080808";
  const GOLD = "#d4b676";

  return (
    <main style={{ width: "100%", backgroundColor: BG, color: "white", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div style={{ y: heroY, position: "absolute", inset: 0 }}>
          {/*
            KLJUČNA OPTIMIZACIJA — LCP FIX:
            - <Image priority> namesto <img> = browser takoj fetchá hero sliko
            - fill + sizes="100vw" = pravilna velikost za full-screen hero
            - Pred: <img> brez prioritete = LCP 4.5s
            - Po: <Image priority> = LCP < 2s
          */}
          <Image
            src="/onas-hero.jpg"
            alt="O nas — Dom na Uršlji gori"
            fill
            priority
            sizes="100vw"
            quality={85}
            style={{ objectFit: "cover", transform: "scale(1.1)", transformOrigin: "center" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.5), ${BG})` }} />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity, position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "0 24px", paddingTop: 96 }}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, border: `1px solid rgba(212,182,118,0.3)`, padding: "6px 16px", borderRadius: 999, marginBottom: 32 }}
          >
            <motion.span
              style={{ width: 6, height: 6, borderRadius: "50%", background: GOLD, display: "inline-block" }}
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Uršlja gora · Koroška
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{ fontSize: "clamp(64px, 12vw, 120px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: "white", margin: 0 }}
          >
            O <span style={{ color: GOLD }}>nas</span>
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
            style={{ marginTop: 24, fontSize: 18, color: "rgba(255,255,255,0.55)", maxWidth: 400, lineHeight: 1.7 }}
          >
            Spoznajte zgodbo, tradicijo in posebnosti Uršlje gore.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
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

      {/* ── VSEBINA ── */}
      <div style={{ backgroundColor: BG, padding: "128px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", flexDirection: "column", gap: 160 }}>

          {/* BLOK 1 – Predstavitev */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Predstavitev" />
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "white", marginBottom: 24 }}>
                Srce <span style={{ color: GOLD }}>Koroške</span>
              </h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 32 }}>
                Uršlja gora je ena najbolj prepoznavnih gora Koroške. Naša koča
                sprejema pohodnike, družine in ljubitelje narave že desetletja.
              </p>
              <motion.a
                href="#zgodovina"
                whileHover={{ x: 6 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, fontWeight: 500, textDecoration: "none", fontSize: 16 }}
              >
                Preberi več <span style={{ fontSize: 18 }}>→</span>
              </motion.a>
            </motion.div>

            {/* FIX: <Image> z lazy + sizes za content slike */}
            <motion.div variants={fadeUp} style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: 500 }}>
              <Image
                src="/onas1.jpg"
                alt="Notranjost Doma na Uršlji gori"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          </motion.div>

          {/* BLOK 2 – Zgodovina */}
          <motion.div
            id="zgodovina"
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}
          >
            <motion.div variants={fadeUp}>
              <SimpleSlider />
            </motion.div>

            <motion.div variants={fadeUp}>
              <SectionLabel text="Zgodovina & zanimivosti" />
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "white", marginBottom: 24 }}>
                Zgodbe <span style={{ color: GOLD }}>gore</span>
              </h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 32 }}>
                Uršlja gora skriva številne zgodbe, kulturne posebnosti in naravne zanimivosti.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { label: "Čebelnjak", href: "/onas/cebelnjak" },
                  { label: "Knjižnjica", href: "/onas/knjiznjica" },
                  { label: "Cerkvica sv. Uršule", href: "/onas/cerkvica" },
                ].map((item, i) => (
                  <motion.a
                    key={i}
                    href={item.href}
                    whileHover={{ x: 5 }}
                    style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderRadius: 16, border: "1px solid rgba(255,255,255,0.08)", textDecoration: "none", color: "rgba(255,255,255,0.7)", fontSize: 16, transition: "all 0.3s" }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,182,118,0.5)";
                      (e.currentTarget as HTMLElement).style.background = "rgba(212,182,118,0.05)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                      (e.currentTarget as HTMLElement).style.background = "transparent";
                      (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ color: GOLD, opacity: 0, transition: "opacity 0.3s" }}>→</span>
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* BLOK 3 – Jedilnik */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 64, alignItems: "center" }}
          >
            <motion.div variants={fadeUp}>
              <SectionLabel text="Ponudba" />
              <h2 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 500, letterSpacing: "-0.02em", lineHeight: 1.15, color: "white", marginBottom: 24 }}>
                Jedilnik <span style={{ color: GOLD }}>koče</span>
              </h2>
              <p style={{ fontSize: 18, color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: 32 }}>
                Oglejte si ponudbo domačih jedi, toplih obrokov in pijač.
              </p>
              <motion.a
                href="/onas/jedilnik"
                whileHover={{ x: 6 }}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, color: GOLD, fontWeight: 500, textDecoration: "none", fontSize: 16 }}
              >
                Odpri jedilnik <span style={{ fontSize: 18 }}>→</span>
              </motion.a>
            </motion.div>

            {/* FIX: <Image> z lazy za jedilnik sliko */}
            <motion.div variants={fadeUp} style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: 500 }}>
              <Image
                src="/meni2.jpg"
                alt="Jedilnik in hrana v Domu na Uršlji gori"
                fill
                loading="lazy"
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={80}
                style={{ objectFit: "cover" }}
              />
            </motion.div>
          </motion.div>

          {/* BLOK 4 – CTA Kontakt */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", padding: "96px 48px", textAlign: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,182,118,0.1), transparent, rgba(212,182,118,0.05))", pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 1, height: 64, background: "linear-gradient(to bottom, rgba(212,182,118,0.6), transparent)" }} />

              <div style={{ position: "relative", zIndex: 10 }}>
                <SectionLabel text="Kontakt" />
                <h2 style={{ fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 500, letterSpacing: "-0.02em", color: "white", marginBottom: 20 }}>
                  Stopite v <span style={{ color: GOLD }}>stik</span>
                </h2>
                <p style={{ fontSize: 18, color: "rgba(255,255,255,0.5)", maxWidth: 360, margin: "0 auto 40px", lineHeight: 1.7 }}>
                  Vsi kontaktni podatki, lokacija in informacije na enem mestu.
                </p>
                <motion.a
                  href="/kontakt"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 10, background: GOLD, color: "black", fontWeight: 600, padding: "16px 36px", borderRadius: 999, textDecoration: "none", fontSize: 16 }}
                >
                  Odpri kontakt →
                </motion.a>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      <Footer dark />
    </main>
  );
}