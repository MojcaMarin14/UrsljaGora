"use client";

import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Footer from "./components/Footer";
import SeasonsSection from "./components/SeasonsSection";
import { fetchAPI, getStrapiMedia } from "@/lib/api";

function SectionLabel({ text, onDark = false }: { text: string; onDark?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 36, height: 2, background: "var(--accent)", flexShrink: 0 }} />
      <span style={{
        fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase",
        color: onDark ? "var(--label-inv)" : "var(--label)", fontWeight: 700,
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
        background: "var(--section-bg)",
        borderRadius: 20,
        border: "1px solid var(--border-light)",
        overflow: "hidden", display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ overflow: "hidden", height: 220, position: "relative" }}>
        <Image src={img} alt={title} fill loading="lazy" sizes="(max-width: 768px) 100vw, 33vw" quality={80} style={{ objectFit: "cover" }} />
      </div>
      <div style={{ padding: "28px 28px 32px", flex: 1, display: "flex", flexDirection: "column" }}>
        <h3 style={{ fontSize: 20, fontWeight: 600, color: "var(--heading)", marginBottom: 10, letterSpacing: "-0.5px" }}>{title}</h3>
        <p style={{ fontSize: 15, color: "var(--text-muted)", lineHeight: 1.6, maxWidth: "70ch", flex: 1 }}>{desc}</p>
      </div>
    </motion.div>
  );
}

const CATEGORY_META: Record<string, { label: string; icon: string }> = {
  Novice:  { label: "Novica",  icon: "✦" },
  Ponudbe: { label: "Ponudba", icon: "✦" },
  Dogodki: { label: "Dogodek", icon: "✦" },
};

function NewsCard({ img, category, title, excerpt, href, index }: {
  img: string; category: string; title: string; excerpt?: string; href: string; index: number;
}) {
  const meta = CATEGORY_META[category] ?? { label: category, icon: "✦" };

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      style={{
        display: "block", textDecoration: "none",
        position: "relative", borderRadius: 20, overflow: "hidden",
        cursor: "pointer",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
      }}
    >
      <div style={{ height: 210, position: "relative", overflow: "hidden" }}>
        <motion.div
          variants={{ hover: { scale: 1.05 } }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0 }}
        >
          <img src={img} alt={title} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </motion.div>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)",
        }} />
        <div style={{ position: "absolute", top: 14, left: 14 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
            border: "1px solid var(--accent-subtle)",
            color: "var(--accent)", borderRadius: 999,
            fontSize: 10, fontWeight: 700, padding: "4px 11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>

      <div style={{ padding: "20px 22px 24px" }}>
        <h3 style={{
          fontSize: 17, fontWeight: 600, color: "var(--text-primary-inv)",
          letterSpacing: "-0.5px", lineHeight: 1.4, margin: "0 0 8px",
        }}>
          {title}
        </h3>
        {excerpt && (
          <p style={{ fontSize: 14, color: "var(--text-muted-inv)", lineHeight: 1.6, margin: "0 0 18px", maxWidth: "70ch" }}>
            {excerpt.slice(0, 110)}…
          </p>
        )}
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Preberi več
          </span>
          <motion.span
            variants={{ hover: { x: 4 } }}
            transition={{ duration: 0.25 }}
            style={{ color: "var(--accent)", fontSize: 13 }}
          >
            →
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          transformOrigin: "left center",
        }}
      />
    </motion.a>
  );
}

function FeaturedCard({ img, category, title, excerpt, href }: {
  img: string; category: string; title: string; excerpt?: string; href: string;
}) {
  const meta = CATEGORY_META[category] ?? { label: category, icon: "✦" };

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      whileHover="hover"
      className="featured-card"
      style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        textDecoration: "none", position: "relative",
        borderRadius: 20, overflow: "hidden", cursor: "pointer",
        background: "var(--card-bg)",
        border: "1px solid var(--border)",
        minHeight: 300,
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <motion.div
          variants={{ hover: { scale: 1.04 } }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: "absolute", inset: 0 }}
        >
          <img src={img} alt={title} loading="lazy"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </motion.div>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 55%, rgba(0,0,0,0.85) 100%)" }} />
        <div style={{ position: "absolute", top: 20, left: 20 }}>
          <span style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            background: "rgba(0,0,0,0.5)", backdropFilter: "blur(12px)",
            border: "1px solid var(--accent-subtle)",
            color: "var(--accent)", borderRadius: 999,
            fontSize: 10, fontWeight: 700, padding: "4px 11px",
            letterSpacing: "0.12em", textTransform: "uppercase",
          }}>
            {meta.icon} {meta.label}
          </span>
        </div>
      </div>

      <div className="featured-card-body" style={{ padding: "40px 36px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <div style={{
          width: 28, height: 1,
          background: "linear-gradient(90deg, var(--accent), transparent)",
          marginBottom: 22, opacity: 0.7,
        }} />
        <h3 style={{
          fontSize: "clamp(20px, 2vw, 26px)",
          fontWeight: 600, color: "var(--text-primary-inv)",
          letterSpacing: "-0.5px", lineHeight: 1.3, margin: "0 0 12px",
        }}>
          {title}
        </h3>
        {excerpt && (
          <p style={{
            fontSize: 14, color: "var(--text-muted-inv)",
            lineHeight: 1.6, margin: "0 0 26px", maxWidth: "70ch",
          }}>
            {excerpt.slice(0, 180)}…
          </p>
        )}
        <motion.div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            Preberi več
          </span>
          <motion.span variants={{ hover: { x: 5 } }} transition={{ duration: 0.3 }} style={{ color: "var(--accent)" }}>
            →
          </motion.span>
        </motion.div>
      </div>

      <motion.div
        variants={{ hover: { scaleX: 1 } }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: "linear-gradient(90deg, transparent, var(--accent), transparent)",
          transformOrigin: "left center", gridColumn: "1 / -1",
        }}
      />
    </motion.a>
  );
}

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [novica,  setNovica]  = useState<any>(null);
  const [ponudba, setPonudba] = useState<any>(null);
  const [dogodek, setDogodek] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      fetchAPI("novicas?populate=*&pagination[limit]=1"),
      fetchAPI("dogodkis?populate=*&pagination[limit]=1"),
      fetchAPI("ponudbes?populate=*&pagination[limit]=1"),
    ]).then(([resN, resD, resP]) => {
      setNovica(resN.data?.[0]  ?? null);
      setDogodek(resD.data?.[0] ?? null);
      setPonudba(resP.data?.[0] ?? null);
    });
  }, []);

  const novinaImg  = novica?.slika?.url       ? getStrapiMedia(novica.slika.url)      : "/pol2.jpg";
  const ponudbaImg = ponudba?.slika?.[0]?.url ? getStrapiMedia(ponudba.slika[0].url)  : "/meni2.jpg";
  const dogodekImg = dogodek?.slika?.[0]?.url ? getStrapiMedia(dogodek.slika[0].url)  : "/onas3.jpg";

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 44 },
    show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: "easeOut" as const } },
  };
  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13 } },
  };

  return (
    <main style={{ width: "100%", backgroundColor: "var(--background)", overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section ref={heroRef} className="homepage-hero" style={{ position: "relative", width: "100%", height: "100vh", overflow: "hidden" }}>
        <motion.div style={{ y: videoY, position: "absolute", inset: 0, scale: 1.1 }}>
          <video
            src="/8.mp4" autoPlay muted loop playsInline
            poster="/hero-poster.jpg" preload="none"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
          />
          <div className="hero-overlay hero-overlay--video" style={{ position: "absolute", inset: 0 }} />
        </motion.div>

        <motion.div
          style={{
            y: textY, opacity: heroOpacity,
            position: "relative", zIndex: 10,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            height: "100%", textAlign: "center", padding: "0 24px",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 28 }}
          >
            <div style={{ width: 40, height: 1, background: "rgba(221,204,171,0.91)" }} />
            <span className="hero-subtitle" style={{ fontSize: 21, letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 500 }}>
              Uršlja gora · Koroška
            </span>
            <div style={{ width: 40, height: 1, background: "rgba(221,204,171,0.91)" }} />
          </motion.div>

          <motion.h1
            initial={{ y: 40 }} animate={{ y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
            className="hero-title"
            style={{ fontSize: "clamp(52px, 10vw, 110px)", fontWeight: 500, letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}
          >
            Med nebom<br />
            <span style={{ color: "var(--hero-span)" }}>in tišino</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            style={{ display: "flex", gap: 12, marginTop: 40, flexWrap: "wrap", justifyContent: "center" }}
          >
            <motion.a
              href="/kontakt"
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              className="hero-cta"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "var(--hero-cta-bg)",
                color: "var(--hero-cta-text)",
                fontWeight: 700, padding: "14px 32px", borderRadius: 999,
                textDecoration: "none", fontSize: 17, letterSpacing: "0.02em",
              }}
            >
              Obiščite nas →
            </motion.a>
          </motion.div>

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

      {/* ── DOBRODOŠLI ── */}
      <section className="hero-next mobile-pad" style={{ padding: "100px 24px" }}>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}
        >
          <motion.div variants={fadeUp}><SectionLabel text="Dobrodošli" /></motion.div>
          <motion.h2
            variants={fadeUp}
            className="hero-next-heading"
            style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 24 }}
          >
            Kraj, kjer se gore dotaknejo <span style={{ color: "var(--accent)" }}>neba</span>
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="hero-next-copy"
            style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 640, margin: "0 auto 40px" }}
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
              { num: "1699", unit: "m",   label: "Nadmorska višina" },
              { num: "10+",  unit: "",    label: "Pohodnih poti" },
              { num: "100+", unit: "let", label: "Tradicije" },
            ].map((s, i) => (
              <div key={i} style={{ padding: "24px 16px", borderRight: i < 2 ? "1px solid var(--border-light)" : "none" }}>
                <div className="hero-next-number" style={{ fontSize: 36, fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1 }}>
                  {s.num}<span style={{ fontSize: 18, color: "var(--accent)", marginLeft: 2 }}>{s.unit}</span>
                </div>
                <div className="hero-next-label" style={{ fontSize: 13, marginTop: 6, letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── AKTIVNOSTI ── */}
      <section className="mobile-pad" style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          style={{ maxWidth: 1152, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 56, display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <SectionLabel text="Doživetja" />
            <h2 style={{ fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 500, color: "var(--heading)", letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0 }}>
              Kaj vas čaka na <span style={{ color: "var(--accent)" }}>Uršlji gori</span>
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}
          >
            {[
              { img: "/pol2.jpg",  title: "Pohodništvo",            desc: "Raznolike poti iz Kotlj, Naravskih ledin in Ivarčkega jezera – primerne za družine in izkušene pohodnike." },
              { img: "/razg.jpg",  title: "Razgledi & fotografija", desc: "Eden najlepših razgledov na Koroško, Pohorje in Savinjsko dolino. Popolno za sončne vzhode in zahode." },
              { img: "/onas3.jpg", title: "Koča & domačnost",       desc: "Topli obroki, čaj, sladice in prijeten kotiček za počitek po vzponu." },
            ].map((a, i) => (
              <motion.div key={i} variants={fadeUp}><ActivityCard {...a} /></motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── QUOTE BANNER ── */}
      <section style={{ position: "relative", overflow: "hidden", padding: "120px 24px" }}>
        <div style={{ position: "absolute", inset: 0, backgroundColor: "var(--section-bg-dark)" }} />
        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/razgled.jpg" alt="" fill loading="lazy" sizes="100vw" quality={75} style={{ objectFit: "cover", opacity: 0.15 }} />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
          style={{ position: "relative", zIndex: 10, maxWidth: 760, margin: "0 auto", textAlign: "center" }}
        >
          <div style={{ fontSize: 64, color: "var(--accent)", lineHeight: 0.5, marginBottom: 24, opacity: 0.6 }}>"</div>
          <p style={{ fontSize: "clamp(22px, 4vw, 36px)", color: "var(--text-primary-inv)", fontWeight: 400, lineHeight: 1.5, letterSpacing: "-0.01em", fontStyle: "italic" }}>
            Uršlja gora ni le vrh — je kraj, kjer se pohodnik ustavi in za hip pozabi na vse ostalo.
          </p>
          <div style={{ width: 40, height: 1, background: "var(--accent)", margin: "32px auto 0" }} />
        </motion.div>
      </section>

      {/* ── HITRA NAVIGACIJA ── */}
      <section className="mobile-pad" style={{ backgroundColor: "var(--section-bg)", padding: "100px 24px" }}>
        <motion.div
          variants={stagger} initial="hidden" whileInView="show"
          viewport={{ once: true }}
          style={{ maxWidth: 1152, margin: "0 auto" }}
        >
          <motion.div variants={fadeUp} style={{ marginBottom: 48, textAlign: "center" }}>
            <SectionLabel text="Explore" />
            <h2 style={{ fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 500, color: "var(--heading)", letterSpacing: "-0.02em" }}>
              Raziščite <span style={{ color: "var(--accent)" }}>vse</span>
            </h2>
          </motion.div>
          <motion.div
            variants={stagger}
            style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}
          >
            {[
              { label: "O nas",      sub: "Zgodba & tradicija", href: "/onas",          img: "/onas3.jpg" },
              { label: "Jedilnik",   sub: "Hrana & pijača",     href: "/onas/jedilnik", img: "/meni2.jpg" },
              { label: "Prenočišča", sub: "Počitek na vrhu",    href: "/prenocisca",    img: "/pren1.jpg" },
              { label: "Kontakt",    sub: "Kako do nas",        href: "/kontakt",       img: "/kont.jpg"  },
            ].map((item, i) => (
              <motion.a
                key={i} href={item.href} variants={fadeUp} whileHover={{ y: -4 }}
                style={{ position: "relative", borderRadius: 20, overflow: "hidden", textDecoration: "none", display: "block", height: 200 }}
              >
                <Image src={item.img} alt={item.label} fill loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" quality={75} style={{ objectFit: "cover" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
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

      {/* ── NOVOSTI IZ VRHA ── */}
      <section className="mobile-pad" style={{ position: "relative", backgroundColor: "var(--section-bg-dark)", padding: "100px 24px 110px", overflow: "hidden" }}>

        <div style={{ position: "absolute", inset: 0 }}>
          <Image src="/Drone-April-4.jpg" alt="" fill loading="lazy" sizes="100vw" quality={60}
            style={{ objectFit: "cover", opacity: 0.06 }} />
        </div>

        <div style={{ maxWidth: 1152, margin: "0 auto", position: "relative" }}>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 48, flexWrap: "wrap", gap: 16 }}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                <div style={{ width: 36, height: 2, background: "var(--accent)", flexShrink: 0 }} />
                <span style={{ fontSize: 22, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--label-inv)", fontWeight: 700 }}>
                  Aktualno
                </span>
              </div>
              <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 500, color: "var(--heading-inv)", letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0 }}>
                Novosti iz <span style={{ color: "var(--accent)" }}>vrha</span>
              </h2>
            </div>

            <motion.a
              href="/aktualno"
              whileHover={{ x: 3 }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                color: "var(--text-high-inv)", textDecoration: "none",
                fontSize: 17, fontWeight: 600,
                letterSpacing: "0.1em", textTransform: "uppercase",
                paddingBottom: 4,
                borderBottom: "1px solid var(--accent-subtle)",
              }}
            >
              Vse novosti <span style={{ fontSize: 22 }}>→</span>
            </motion.a>
          </motion.div>

          <div style={{ marginBottom: 20 }}>
            <FeaturedCard
              img={novinaImg} category="Novice"
              title={novica?.naslov ?? "Novosti s koče"}
              excerpt={novica?.opis} href="/aktualno/novice"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
            <NewsCard img={ponudbaImg} category="Ponudbe" title={ponudba?.naslov ?? "Posebne ponudbe"} excerpt={ponudba?.opis} href="/aktualno/ponudbe" index={0} />
            <NewsCard img={dogodekImg} category="Dogodki" title={dogodek?.naslov ?? "Prihajajoči dogodki"} excerpt={dogodek?.opis} href="/aktualno/dogodki" index={1} />
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
