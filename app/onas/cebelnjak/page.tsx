"use client";

import { motion, Variants } from "framer-motion";
import type { Transition } from "framer-motion";

const GOLD = "#c9a96e";
const HONEY = "#e8a020";
const CREAM = "#f7f4ef";
const DARK = "#111008";

function SectionLabel({ text, light = false }: { text: string; light?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
      <div style={{ width: 28, height: 1, background: light ? "rgba(201,169,110,0.7)" : GOLD, flexShrink: 0 }} />
      <span style={{
        fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase",
        color: light ? "rgba(201,169,110,0.85)" : GOLD, fontWeight: 600,
        fontFamily: "sans-serif",
      }}>
        {text}
      </span>
    </div>
  );
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as Transition["ease"] },
  },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const facts = [
  { icon: "📍", label: "Nadmorska višina", value: "1699 m" },
  { icon: "🏆", label: "Rekord", value: "Najvišje ležeči slovenski čebelnjak" },
  { icon: "🐝", label: "Vrsta čebel", value: "Kranjska čebela (Apis mellifera carnica)" },
  { icon: "📡", label: "Monitoring", value: "Elektronska tehtnica, nadzor po spletu" },
  { icon: "📅", label: "Sezona", value: "Junij – jesen (do prve snega)" },
  { icon: "🍯", label: "Med", value: "Gorski cvetlični med" },
];

export default function CebelnjakPage() {
  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* ── HERO ── */}
      <section style={{ position: "relative", height: "60vh", overflow: "hidden" }}>
        <img
          src="/honey.jpg"
          alt="Čebelnjak na Uršlji gori"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 60%" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(17,16,8,0.25) 0%, rgba(17,16,8,0.78) 100%)",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          style={{
            position: "relative", zIndex: 10, height: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", textAlign: "center", padding: "0 24px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.6)" }} />
            <span style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", color: "rgba(201,169,110,0.85)", fontWeight: 500, fontFamily: "sans-serif" }}>
              Uršlja gora · 1699 m
            </span>
            <div style={{ width: 32, height: 1, background: "rgba(201,169,110,0.6)" }} />
          </div>
          <h1 style={{
            fontSize: "clamp(38px, 8vw, 80px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0,
          }}>
            Čebelnjak<br /><span style={{ color: GOLD }}>na vrhu</span>
          </h1>
          <p style={{
            marginTop: 20, fontSize: 16, color: "rgba(255,255,255,0.55)",
            maxWidth: 440, lineHeight: 1.78, fontFamily: "sans-serif",
          }}>
            Najvišje ležeči slovenski čebelnjak — kjer se kranjske čebele pašejo med gorskimi cvetovi Koroške.
          </p>
        </motion.div>

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 80,
          background: `linear-gradient(to bottom, transparent, ${CREAM})`,
        }} />
      </section>

      {/* ── ZGODBA ── */}
      <section style={{ backgroundColor: CREAM, padding: "72px 24px 80px" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto" }}>
          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true, margin: "-40px" }}
            className="flex flex-col md:grid md:grid-cols-2 md:gap-16 md:items-center"
            style={{ gap: 40 }}
          >
            {/* Slika */}
            <motion.div variants={fadeUp} style={{ borderRadius: 20, overflow: "hidden" }}>
              <motion.img
                src="/ceb1.jpg"
                alt="Čebelnjak pozimi"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.6 }}
                style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                className="h-64 md:h-[420px]"
              />
            </motion.div>

            {/* Besedilo */}
            <motion.div variants={fadeUp}>
              <SectionLabel text="Naša zgodba" />
              <h2 style={{
                fontSize: "clamp(24px, 3.5vw, 38px)", fontWeight: 500, color: DARK,
                letterSpacing: "-0.025em", lineHeight: 1.2, marginBottom: 20, marginTop: 0,
              }}>
                Rekordni čebelnjak <span style={{ color: GOLD }}>med oblaki</span>
              </h2>
              <p style={{ fontSize: 15.5, color: "rgba(17,16,8,0.62)", lineHeight: 1.82, marginBottom: 18, fontFamily: "sans-serif" }}>
                Koroški čebelarji so leta 2018 na 1699 metrih visoki Uršlji gori postavili <strong style={{ color: DARK }}>najvišje ležeči slovenski čebelnjak</strong>. Čebelnjak je bil slovesno otvorjen in blagoslovljen ob svetovnem dnevu čebel, botra pa je postala županja Črne na Koroškem mag. Romana Lesjak.
              </p>
              <p style={{ fontSize: 15.5, color: "rgba(17,16,8,0.62)", lineHeight: 1.82, marginBottom: 18, fontFamily: "sans-serif" }}>
                V njem bivata dve družini <strong style={{ color: DARK }}>kranjskih čebel</strong> — ponosa slovenskega čebelarstva. Vsako pomlad se čebele iz doline preselijo na goro, kjer pašejo med gorskimi cvetovi vse do jeseni.
              </p>
              <p style={{ fontSize: 15.5, color: "rgba(17,16,8,0.62)", lineHeight: 1.82, fontFamily: "sans-serif" }}>
                Posebnost čebelnjaka je sodobni <strong style={{ color: DARK }}>elektronski nadzor</strong> — panjev dnevni donos čebelarji spremljajo v realnem času prek spleta, zahvaljujoč elektronski tehtnici.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── DEJSTVA ── */}
      <section style={{ backgroundColor: "white", padding: "72px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ maxWidth: 1040, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <SectionLabel text="Zanimivosti" />
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 500, color: DARK,
              letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0,
            }}>
              Čebelnjak: <span style={{ color: GOLD }}>visoko nad dolinami</span>
            </h2>
          </div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show"
            viewport={{ once: true }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {facts.map((f, i) => (
              <motion.div
                key={i} variants={fadeUp}
                style={{
                  padding: "28px 30px",
                  borderRadius: 18,
                  border: "1px solid rgba(17,16,8,0.07)",
                  background: CREAM,
                  display: "flex", alignItems: "flex-start", gap: 16,
                }}
              >
                <span style={{ fontSize: 28, flexShrink: 0, marginTop: 2 }}>{f.icon}</span>
                <div>
                  <p style={{ fontSize: 10, letterSpacing: "0.18em", textTransform: "uppercase", color: GOLD, fontWeight: 700, marginBottom: 6, fontFamily: "sans-serif" }}>
                    {f.label}
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 500, color: DARK, margin: 0 }}>
                    {f.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── GALERIJA ── */}
      <section style={{ backgroundColor: CREAM, padding: "72px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
          style={{ maxWidth: 1040, margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <SectionLabel text="Galerija" />
            <h2 style={{
              fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 500, color: DARK,
              letterSpacing: "-0.025em", lineHeight: 1.2, margin: 0,
            }}>
              Čebele skozi <span style={{ color: GOLD }}>letne čase</span>
            </h2>
          </div>

          {/* Desktop: 3 slike v vrstici, mobile: stack */}
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-4">
            {[
              { src: "/ceb1.jpg", caption: "Zimski čas — koča pod snegom" },
              { src: "/ceb2.jpg", caption: "Pomlad — čebelnjak v polnem cvetu" },
              { src: "/ceb3.jpg", caption: "Poletni sončni zahod" },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] as Transition["ease"] }}
                style={{ borderRadius: 16, overflow: "hidden", position: "relative" }}
              >
                <motion.img
                  src={img.src}
                  alt={img.caption}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.6 }}
                  style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }}
                />
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  padding: "32px 20px 18px",
                  background: "linear-gradient(to top, rgba(17,16,8,0.75) 0%, transparent 100%)",
                }}>
                  <p style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.8)", fontFamily: "sans-serif" }}>
                    {img.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── DARK BANNER ── */}
      <section style={{ backgroundColor: DARK, padding: "72px 24px" }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.8 }}
          style={{ maxWidth: 860, margin: "0 auto" }}
        >
          {/* Dekorativni med kapljica */}
          <div style={{ textAlign: "center", fontSize: 48, marginBottom: 24 }}>🍯</div>

          <SectionLabel text="Kranjska čebela" light />
          <h2 style={{
            fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 500, color: "white",
            letterSpacing: "-0.025em", marginBottom: 28,
          }}>
            Ponos <span style={{ color: GOLD }}>slovenskega čebelarstva</span>
          </h2>

          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, marginBottom: 20, fontFamily: "sans-serif" }}>
            Kranjska čebela (<em>Apis mellifera carnica</em>) je avtohtona slovenska pasma, znana po mirnosti, delavnosti in odpornosti na bolezni. Na Uršlji gori pašejo med redkimi gorskimi cvetovi — od planinskih travnikov do alpskih rastlin, ki uspevajo le na nadmorski višini nad 1500 m.
          </p>
          <p style={{ fontSize: 15.5, color: "rgba(255,255,255,0.55)", lineHeight: 1.85, fontFamily: "sans-serif" }}>
            Vsako leto koroški čebelarji organizirajo <strong style={{ color: GOLD }}>vsekoroški pohod čebelarjev na Uršljo goro</strong> z ogledom čebelnjaka. Obiskovalci si med pohodom lahko ogledajo čebelnjak in spoznajo skrivnosti gorskega čebelarstva.
          </p>

          <div style={{
            marginTop: 40, padding: "24px 28px",
            border: "1px solid rgba(201,169,110,0.2)", borderRadius: 14,
            display: "flex", alignItems: "flex-start", gap: 16, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 24 }}>📰</span>
            <div>
              <p style={{ fontSize: 12, color: GOLD, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "sans-serif" }}>
                V medijih
              </p>
              <p style={{ fontSize: 14.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.75, margin: 0, fontFamily: "sans-serif" }}>
                O čebelnjaku so poročale Koroške Novice:{" "}
                <a
                  href="https://www.koroskenovice.si/novice/cebele-so-se-vrnile-na-ursljo-goro-v-najvisje-lezeci-slovenski-cebelnjak/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: GOLD, textDecoration: "underline" }}
                >
                  Čebele so se vrnile na Uršljo goro
                </a>
              </p>
            </div>
          </div>
        </motion.div>
      </section>

    </main>
  );
}
