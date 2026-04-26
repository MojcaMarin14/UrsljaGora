"use client";

import dynamic from "next/dynamic";
import { motion, Variants, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Footer from "@/app/components/Footer";

const GOLD  = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK  = "#111008";

const ContactForm = dynamic(
  () => import("@/app/components/ContactForm").then((mod) => mod.ContactForm),
  {
    loading: () => (
      <div style={{ maxWidth: 720, margin: "0 auto", borderRadius: 24, border: "1px solid rgba(17,16,8,0.08)", background: "white", padding: "64px 32px", textAlign: "center", color: "rgba(17,16,8,0.4)" }}>
        Nalagam obrazec ...
      </div>
    ),
  }
);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

function SectionLabel({ text, dark = false }: { text: string; dark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 32, height: 1, background: GOLD, flexShrink: 0 }} />
      <span style={{ fontSize: 20, letterSpacing: "0.18em", textTransform: "uppercase", color: dark ? "rgba(201,169,110,0.9)" : "#8B6914", fontWeight: 700 }}>
        {text}
      </span>
    </div>
  );
}

const contacts = [
  {
    title: "Dom na Uršlji gori",
    subtitle: "Plešivec",
    items: [
      { label: "Mobilni",  value: "064 132 385",              href: "tel:041743442" },
      { label: "E-pošta",  value: "juvan.nejc2@gmail.com",       href: "mailto:juvan.nejc2@gmail.com" },
      { label: "Naslov",   value: "Jazbina 19, 2393 Črna na Koroškem", href: null },
    ],
  },
  {
    title: "Planinska koča",
    subtitle: "PZS",
    items: [
      { label: "Telefon",  value: "041 685 555",   href: "tel:041685555" },
      { label: "Kontakt",  value: "Sonja",          href: null },
      { label: "Spletna stran", value: "Dom na Uršlji gori — PZS →", href: "https://pzs.si/koce/74/" },
    ],
  },
  {
    title: "TIC Črna na Koroškem",
    subtitle: "Turistično informacijski center",
    items: [
      { label: "Pon–Pet",  value: "9:00 – 16:00",  href: null },
      { label: "Vikendi",  value: "Prilagojeno",    href: null },
      { label: "Več info", value: "Visit Črna na Koroškem →", href: "https://www.visit-crna.si/objava/257019" },
    ],
  },
];

const pills = [
  { label: "064 132 385",               icon: "📞" },
  { label: "juvan.nejc2@gmail.com",           icon: "✉️" },
  { label: "Jazbina 19, Črna na Koroškem", icon: "📍" },
];

export default function KontaktPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <div ref={heroRef} style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div
          style={{ y: heroY, position: "absolute", inset: 0 }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src="/kont.jpg"
            alt="Kontakt"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 60%, #1e1e1e 100%)` }} />
        </motion.div>

        <motion.div
          style={{
            opacity: heroOpacity,
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", textAlign: "center",
            padding: "0 24px", paddingTop: 96,
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
          >
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.7)" }} />
            <span style={{ fontSize: 20, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 500 }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 36, height: 1, background: "rgba(201,169,110,0.7)" }} />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3 }}
            style={{ fontSize: "clamp(56px, 11vw, 110px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1, color: "white", margin: 0 }}
          >
            Kontakt &amp; <span style={{ color: GOLD }}>Dostop</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            style={{ height: 1, background: "rgba(201,169,110,0.6)", marginTop: 32, borderRadius: 999 }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7 }}
            style={{ marginTop: 24, fontSize: 20, color: "rgba(255,255,255,0.6)", maxWidth: 420, lineHeight: 1.7 }}
          >
            Informacije o koči, dostopu in dejavnostih na Uršlji gori.
          </motion.p>

          {/* Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.85 }}
            style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginTop: 32 }}
          >
            {pills.map((p, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.15)",
                backdropFilter: "blur(8px)",
                borderRadius: 999, padding: "8px 18px",
                fontSize: 13, color: "rgba(255,255,255,0.8)",
              }}>
                <span>{p.icon}</span>
                {p.label}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            style={{ position: "absolute", bottom: 40, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}
          >
            <span style={{ fontSize: 20, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              Pomakni navzdol
            </span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{ width: 1, height: 32, background: "linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)" }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* ── TEMNA SEKCIJA ── */}
      <section style={{ backgroundColor: "#1e1e1e", padding: "100px 24px 120px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}
        >
          <SectionLabel text="Kontaktirajte nas" dark />
          <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 500, color: "white", letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 16 }}>
            Stopite v <span style={{ color: GOLD }}>stik</span>
          </h2>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, maxWidth: 520, margin: "0 auto" }}>
            Za rezervacije, informacije o prenočitvah in dejavnostih nas kontaktirajte neposredno ali izpolnite obrazec spodaj.
          </p>
        </motion.div>
      </section>

      {/* ── KONTAKTNE KARTICE ── */}
      <section style={{ backgroundColor: CREAM, padding: "80px 24px 100px" }}>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1152, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}
        >
          {contacts.map((c, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              style={{
                background: "white",
                borderRadius: 24,
                border: "1px solid rgba(17,16,8,0.07)",
                padding: "36px 32px",
                boxShadow: "0 2px 16px rgba(17,16,8,0.05)",
              }}
            >
              <SectionLabel text={c.subtitle} />
              <h3 style={{ fontSize: 22, fontWeight: 500, color: DARK, letterSpacing: "-0.02em", marginBottom: 24 }}>
                {c.title}
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {c.items.map((item, j) => (
                  <div key={j} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6914" }}>
                      {item.label}
                    </span>
                    {item.href ? (
                      <a
                        href={item.href}
                        target={item.href.startsWith("http") ? "_blank" : undefined}
                        rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                        style={{ fontSize: 15, color: DARK, textDecoration: "none", fontWeight: 500 }}
                        onMouseEnter={e => (e.currentTarget.style.color = GOLD)}
                        onMouseLeave={e => (e.currentTarget.style.color = DARK)}
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span style={{ fontSize: 15, color: "rgba(17,16,8,0.65)" }}>{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── ZEMLJEVID ── */}
      <section style={{ position: "relative", height: 480, width: "100%", overflow: "hidden" }}>
        <iframe
          style={{ width: "100%", height: "100%", border: 0, filter: "grayscale(15%) brightness(0.9)" }}
          loading="lazy"
          allowFullScreen
          referrerPolicy="no-referrer-when-downgrade"
          src="https://www.google.com/maps?q=Jazbina+19,+2393+Črna+na+Koroškem&output=embed"
        />
        {/* Overlay top fade */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 60, background: `linear-gradient(to bottom, ${CREAM}, transparent)`, pointerEvents: "none" }} />
      </section>

      {/* ── KONTAKTNI OBRAZEC ── */}
      <section style={{ backgroundColor: CREAM, padding: "100px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ maxWidth: 760, margin: "0 auto 48px", textAlign: "center" }}
        >
          <SectionLabel text="Pišite nam" />
          <h2 style={{ fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em", marginBottom: 16 }}>
            Pošljite <span style={{ color: GOLD }}>sporočilo</span>
          </h2>
          <p style={{ fontSize: 18, color: "rgba(17,16,8,0.5)", lineHeight: 1.75 }}>
            Odgovorili vam bomo v najkrajšem možnem času.
          </p>
        </motion.div>

        <ContactForm />
      </section>

      <Footer dark />
    </main>
  );
}