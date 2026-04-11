"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Footer from "@/app/components/Footer"; // pomembno!

export default function JedilnikPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0 },
  };

  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    show: { opacity: 1, scale: 1 },
  };

  const rednaPonudba = [
    {
      ime: "Jota s klobaso",
      opis: "Tradicionalna koroška jota z domačo klobaso.",
      cena: "9.50 €",
      slika: "/jota.jpg",
    },
    {
      ime: "Ajdovi žganci",
      opis: "Postreženi z ocvirki in kislim mlekom.",
      cena: "7.00 €",
      slika: "/zganci.jpg",
    },
    {
      ime: "Štruklji po domače",
      opis: "Domači štruklji z orehi ali skuto.",
      cena: "6.50 €",
      slika: "/struklji.jpg",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-black text-white">

      {/* FULL-WIDTH HERO */}
      <motion.section
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        viewport={{ once: true }}
        className="relative w-full h-[50vh] mb-24 overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.7)]"
      >
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: "url('/demo-food/hero-dark.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          initial={{ scale: 1.2 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex items-center justify-center h-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-white text-6xl font-bold tracking-wide drop-shadow-xl"
          >
            Redna ponudba
          </motion.h1>
        </div>
      </motion.section>

      {/* CONTENT */}
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* UVOD */}
        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={fadeUp}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <p className="text-lg text-white/90 max-w-2xl mx-auto leading-relaxed">
            Naša stalna izbira domačih jedi, ki so na voljo skozi vse leto.
            Pripravljene iz lokalnih sestavin in postrežene v prijetnem ambientu naše koče.
          </p>

          <div className="w-24 h-1 bg-[#d4b676] mx-auto mt-6 rounded-full"></div>
        </motion.section>

        {/* GRID */}
        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-16"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            show: { transition: { staggerChildren: 0.2 } },
          }}
        >
          {rednaPonudba.map((j, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              transition={{ duration: 0.7 }}
              className="rounded-3xl overflow-hidden bg-[#111] shadow-[0_0_25px_rgba(0,0,0,0.5)] hover:shadow-[0_0_35px_rgba(0,0,0,0.7)] transition-shadow"
            >
              <motion.div
                className="h-56 w-full relative"
                variants={scaleIn}
                transition={{ duration: 0.8 }}
              >
                <Image src={j.slika} alt={j.ime} fill className="object-cover" />
              </motion.div>

              <div className="p-8 space-y-4">
                <h3 className="text-2xl font-semibold text-white tracking-wide">
                  {j.ime}
                </h3>

                <p className="text-white/80 text-sm leading-relaxed">
                  {j.opis}
                </p>

                <p className="text-2xl font-bold text-[#d4b676]">
                  {j.cena}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* LINK */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 text-center"
        >
          <a
            href="/aktualno/ponudbe"
            className="inline-block px-10 py-4 bg-[#d4b676] text-black text-lg font-semibold rounded-full shadow-lg hover:bg-[#c9a965] transition"
          >
            Poglej še posebne ponudbe →
          </a>
        </motion.div>

      </main>

      {/* DARK FOOTER */}
      <Footer dark />

    </div>
  );
}
