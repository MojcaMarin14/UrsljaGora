"use client";

import { motion, Variants } from "framer-motion";
import Footer from "@/app/components/Footer";
import { ContactForm } from "@/app/components/ContactForm";

export default function KontaktPage() {
  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
  };

 const dots = [
  { top: "10%", left: "5%",   size: 8,  dur: 3.1, delay: 0 },
  { top: "18%", left: "20%",  size: 14, dur: 4.0, delay: 0.3 },
  { top: "70%", left: "8%",   size: 6,  dur: 4.2, delay: 1 },
  { top: "80%", left: "25%",  size: 10, dur: 3.5, delay: 0.6 },
  { top: "25%", right: "15%", size: 12, dur: 3.7, delay: 0.5 },
  { top: "45%", right: "5%",  size: 7,  dur: 4.8, delay: 1.2 },
  { top: "75%", right: "10%", size: 9,  dur: 5,   delay: 1.5 },
  { top: "60%", right: "30%", size: 5,  dur: 3.9, delay: 0.9 },
  { top: "35%", left: "45%",  size: 11, dur: 4.3, delay: 0.4 },
];
  const pills = [
    {
      label: "02 87 0 48 20",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4b676" strokeWidth="2">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.14 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.05 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 16.92z" />
        </svg>
      ),
    },
    {
      label: "info@ursljagora.si",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4b676" strokeWidth="2">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
    },
    {
      label: "Jazbina 19, Črna na Koroškem",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4b676" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
    },
  ];

  return (
    <main className="w-full bg-black text-white">

      {/* ── HERO ── */}
      <section className="relative w-full min-h-[70vh] overflow-hidden bg-[#0a0a0a] flex items-center justify-center">

        {/* Mrežne linije */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,182,118,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,118,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Mehak zlat blur v sredini */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#d4b676]/5 blur-3xl pointer-events-none" />

        {/* Kotni okraski */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-[#d4b676]/30" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-[#d4b676]/30" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-[#d4b676]/30" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-[#d4b676]/30" />

        {/* Lebdeče pike */}
        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#d4b676]"
            style={{
              width: d.size,
              height: d.size,
              top: d.top,
              left: "left" in d ? d.left : undefined,
              right: "right" in d ? (d as any).right : undefined,
            }}
            animate={{ y: [-8, 0, -8], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        {/* Vsebina */}
{/* Vsebina */}
<div className="relative z-10 flex flex-col items-center text-center px-6 pt-40 pb-28">
          {/* Badge */}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-[#d4b676] border border-[#d4b676]/40 px-4 py-1.5 rounded-full mb-7"
          >
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-[#d4b676]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Uršlja gora
          </motion.span>

          {/* Naslov */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-6xl md:text-8xl font-medium tracking-tight leading-none"
          >
            Kontakt &amp;{" "}
            <span className="text-[#d4b676]">Dostop</span>
          </motion.h1>

          {/* Zlata črta */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="h-[2px] bg-[#d4b676] rounded-full mt-7"
          />

          {/* Podopis */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 text-lg text-white/50 max-w-md leading-relaxed"
          >
            Informacije o koči, dostopu in dejavnostih na Uršlji gori.
          </motion.p>

          {/* Kontaktni pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="flex flex-wrap gap-3 justify-center mt-9"
          >
            {pills.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 bg-white/[0.04] border border-white/10 rounded-full px-5 py-2 text-sm text-white/70"
              >
                {p.icon}
                {p.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── VSEBINA ── */}
      <section className="py-32 px-6 bg-gradient-to-b from-black via-[#0b0b0b] to-black">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* BLOK 1 – Koča */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-[#111] rounded-3xl p-10 md:p-14 border border-white/5"
          >
            <h2 className="text-4xl font-semibold text-[#d4b676] mb-4 tracking-tight">
              Dom na Uršlji gori (Plešivec)
            </h2>
            <div className="w-20 h-[2px] bg-[#d4b676] mb-10 rounded-full" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="text-white font-medium">Telefon:</span> 02 87 0 48 20</p>
              <p><span className="text-white font-medium">Mobilni telefon:</span> 041 743 442</p>
              <p>
                <span className="text-white font-medium">E‑pošta:</span>{" "}
                <a href="mailto:info@ursljagora.si" className="text-[#d4b676] hover:text-white transition-colors">
                  info@ursljagora.si
                </a>
              </p>
              <p><span className="text-white font-medium">Naslov:</span> Jazbina 19, 2393 Črna na Koroškem</p>
            </div>
          </motion.div>

          {/* BLOK 2 – PZS */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-[#111] rounded-3xl p-10 md:p-14 border border-white/5"
          >
            <h2 className="text-4xl font-semibold text-[#d4b676] mb-4 tracking-tight">
              Planinska koča – PZS
            </h2>
            <div className="w-20 h-[2px] bg-[#d4b676] mb-10 rounded-full" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="text-white font-medium">Telefon:</span> 041 685 555</p>
              <p><span className="text-white font-medium">Kontaktna oseba:</span> Sonja</p>
              <p>
                <a
                  href="https://pzs.si/koce/74/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4b676] hover:text-white transition-colors"
                >
                  Dom na Uršlji gori – PZS spletna stran →
                </a>
              </p>
            </div>
          </motion.div>

          {/* BLOK 3 – TIC */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-[#111] rounded-3xl p-10 md:p-14 border border-white/5"
          >
            <h2 className="text-4xl font-semibold text-[#d4b676] mb-4 tracking-tight">
              TIC Črna na Koroškem
            </h2>
            <div className="w-20 h-[2px] bg-[#d4b676] mb-10 rounded-full" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="text-white font-medium">Delovni čas:</span></p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Ponedeljek–petek: 9.00–16.00</li>
                <li>Vikendi: prilagojeno glede na dejavnosti</li>
              </ul>
              <p>
                <a
                  href="https://www.visit-crna.si/objava/257019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4b676] hover:text-white transition-colors"
                >
                  Visit Črna na Koroškem →
                </a>
              </p>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ── MAPA ── */}
      <section className="relative w-full h-[450px]">
        <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
        <iframe
          className="w-full h-full border-0"
          style={{ filter: "grayscale(20%) brightness(0.75)" }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps?q=Jazbina+19,+2393+Črna+na+Koroškem&output=embed"
        />
      </section>
        <div className="w-20 h-[2px] bg-[#d4b676] mb-10 rounded-full" />
      <section>
        <div>
          <ContactForm />
        </div>

      </section>

      <Footer dark />
    </main>
  );
}