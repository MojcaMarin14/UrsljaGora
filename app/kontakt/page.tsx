"use client";

import dynamic from "next/dynamic";
import { motion, Variants } from "framer-motion";
import { useState } from "react";

import Footer from "@/app/components/Footer";

const ContactForm = dynamic(
  () => import("@/app/components/ContactForm").then((mod) => mod.ContactForm),
  {
    loading: () => (
      <div className="mx-auto max-w-[720px] rounded-[28px] border border-white/6 bg-[#111] px-8 py-16 text-center text-white/45">
        Nalagam obrazec ...
      </div>
    ),
  }
);

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const dots = [
  { top: "10%", left: "5%", size: 8, dur: 3.1, delay: 0 },
  { top: "18%", left: "20%", size: 14, dur: 4.0, delay: 0.3 },
  { top: "70%", left: "8%", size: 6, dur: 4.2, delay: 1 },
  { top: "80%", left: "25%", size: 10, dur: 3.5, delay: 0.6 },
  { top: "25%", right: "15%", size: 12, dur: 3.7, delay: 0.5 },
  { top: "45%", right: "5%", size: 7, dur: 4.8, delay: 1.2 },
  { top: "75%", right: "10%", size: 9, dur: 5, delay: 1.5 },
  { top: "60%", right: "30%", size: 5, dur: 3.9, delay: 0.9 },
  { top: "35%", left: "45%", size: 11, dur: 4.3, delay: 0.4 },
] as const;

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
] as const;

export default function KontaktPage() {
  const [showMap, setShowMap] = useState(false);

  return (
    <main className="w-full bg-black text-white">
      <section className="relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden bg-[#0a0a0a]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(212,182,118,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(212,182,118,0.07) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#d4b676]/5 blur-3xl" />

        <div className="absolute left-6 top-6 h-8 w-8 border-l border-t border-[#d4b676]/30" />
        <div className="absolute right-6 top-6 h-8 w-8 border-r border-t border-[#d4b676]/30" />
        <div className="absolute bottom-6 left-6 h-8 w-8 border-b border-l border-[#d4b676]/30" />
        <div className="absolute bottom-6 right-6 h-8 w-8 border-b border-r border-[#d4b676]/30" />

        {dots.map((d, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-[#d4b676]"
            style={{
              width: d.size,
              height: d.size,
              top: d.top,
              left: "left" in d ? d.left : undefined,
              right: "right" in d ? d.right : undefined,
            }}
            animate={{ y: [-8, 0, -8], opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}

        <div className="relative z-10 flex flex-col items-center px-6 pb-28 pt-40 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d4b676]/40 px-4 py-1.5 text-[11px] uppercase tracking-[0.15em] text-[#d4b676]"
          >
            <motion.span
              className="h-1.5 w-1.5 rounded-full bg-[#d4b676]"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Uršlja gora
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="text-6xl font-medium leading-none tracking-tight md:text-8xl"
          >
            Kontakt &amp; <span className="text-[#d4b676]">Dostop</span>
          </motion.h1>

          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 80, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-7 h-[2px] rounded-full bg-[#d4b676]"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            className="mt-6 max-w-md text-lg leading-relaxed text-white/50"
          >
            Informacije o koči, dostopu in dejavnostih na Uršlji gori.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.75 }}
            className="mt-9 flex flex-wrap justify-center gap-3"
          >
            {pills.map((p, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2 text-sm text-white/70"
              >
                {p.icon}
                {p.label}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-black via-[#0b0b0b] to-black px-6 py-32">
        <div className="mx-auto max-w-6xl space-y-16">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-[#111] p-10 md:p-14"
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-[#d4b676]">
              Dom na Uršlji gori (Plešivec)
            </h2>
            <div className="mb-10 h-[2px] w-20 rounded-full bg-[#d4b676]" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="font-medium text-white">Telefon:</span> 02 87 0 48 20</p>
              <p><span className="font-medium text-white">Mobilni telefon:</span> 041 743 442</p>
              <p>
                <span className="font-medium text-white">E-pošta:</span>{" "}
                <a href="mailto:info@ursljagora.si" className="text-[#d4b676] transition-colors hover:text-white">
                  info@ursljagora.si
                </a>
              </p>
              <p><span className="font-medium text-white">Naslov:</span> Jazbina 19, 2393 Črna na Koroškem</p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-[#111] p-10 md:p-14"
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-[#d4b676]">
              Planinska koča - PZS
            </h2>
            <div className="mb-10 h-[2px] w-20 rounded-full bg-[#d4b676]" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="font-medium text-white">Telefon:</span> 041 685 555</p>
              <p><span className="font-medium text-white">Kontaktna oseba:</span> Sonja</p>
              <p>
                <a
                  href="https://pzs.si/koce/74/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4b676] transition-colors hover:text-white"
                >
                  Dom na Uršlji gori - PZS spletna stran →
                </a>
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="rounded-3xl border border-white/5 bg-[#111] p-10 md:p-14"
          >
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-[#d4b676]">
              TIC Črna na Koroškem
            </h2>
            <div className="mb-10 h-[2px] w-20 rounded-full bg-[#d4b676]" />
            <div className="space-y-4 text-lg text-white/70">
              <p><span className="font-medium text-white">Delovni čas:</span></p>
              <ul className="ml-6 list-disc space-y-1">
                <li>Ponedeljek-petek: 9.00-16.00</li>
                <li>Vikendi: prilagojeno glede na dejavnosti</li>
              </ul>
              <p>
                <a
                  href="https://www.visit-crna.si/objava/257019"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#d4b676] transition-colors hover:text-white"
                >
                  Visit Črna na Koroškem →
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative h-[450px] w-full overflow-hidden bg-[#0f0f0f]">
        <div className="absolute inset-0 z-10 bg-black/40 pointer-events-none" />
        {showMap ? (
          <iframe
            className="h-full w-full border-0"
            style={{ filter: "grayscale(20%) brightness(0.75)" }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=Jazbina+19,+2393+Črna+na+Koroškem&output=embed"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_center,rgba(212,182,118,0.10),transparent_55%)] px-6 text-center">
            <div className="relative z-20 flex max-w-md flex-col items-center gap-4">
              <p className="text-sm uppercase tracking-[0.45em] text-[#d4b676]/85">Zemljevid</p>
              <button
                type="button"
                onClick={() => setShowMap(true)}
                className="rounded-full border border-[#d4b676]/40 bg-[#d4b676] px-6 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-black transition hover:brightness-110"
              >
                Naloži zemljevid
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="px-6 py-20">
        <ContactForm />
      </section>

      <Footer dark />
    </main>
  );
}
