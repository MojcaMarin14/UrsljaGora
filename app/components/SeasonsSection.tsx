"use client";
import { useState, useRef } from "react";

export default function SeasonsSection() {
  const [season, setSeason] = useState<"summer" | "winter">("summer");
  const [effect, setEffect] = useState<"none" | "snow" | "leaves">("none");
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const handleSwitch = (value: "summer" | "winter") => {
    setSeason(value);

    // Trigger effect
    setEffect(value === "winter" ? "snow" : "leaves");

    // Remove effect after animation
    setTimeout(() => setEffect("none"), 2500);

    // ❌ removed scrollIntoView so page stays still
  };

  return (
    <section ref={sectionRef} className="relative py-24 px-6 bg-white overflow-hidden">

      {/* EFFECT LAYER */}
      {effect !== "none" && (
        <div className="pointer-events-none absolute inset-0 flex justify-center z-20">
          <div className="relative w-[350px] h-full overflow-visible">

            {effect === "snow" &&
              Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="snowflake"
                  style={{
                    "--i": i,
                    "--size": Math.random() * 3,
                    "--speed": Math.random() * 20,
                    "--rotate": Math.random() * 360,
                    "--offset": (Math.random() - 0.5) * 4,
                  } as any}
                >
                  ❄
                </div>
              ))
            }

            {effect === "leaves" &&
              Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="leaf"
                  style={{
                    "--i": i,
                    "--size": Math.random() * 3,
                    "--speed": Math.random() * 1,
                    "--rotate": Math.random() * 360,
                    "--offset": (Math.random() - 0.5) * 4,
                    "--sway": (Math.random() - 0.5) * 2,
                  } as any}
                >
                  🍃
                </div>
              ))
            }

          </div>
        </div>
      )}

      {/* TITLE + SWITCH */}
      <div className="max-w-4xl mx-auto text-center mb-16 relative z-10">
        <h2 className="text-4xl font-semibold text-[var(--text-heading)] tracking-tight">
          Doživetja skozi letne čase
        </h2>
        <p className="text-[var(--text-main)] mt-4 text-lg leading-relaxed">
          Uršlja gora ponuja popolnoma različna doživetja poleti in pozimi.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => handleSwitch("summer")}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              season === "summer"
                ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md"
                : "border-black/20 text-black hover:bg-black/5"
            }`}
          >
            Poletni čas
          </button>

          <button
            onClick={() => handleSwitch("winter")}
            className={`px-6 py-2 rounded-full border transition-all duration-300 ${
              season === "winter"
                ? "bg-[var(--brand)] text-white border-[var(--brand)] shadow-md"
                : "border-black/20 text-black hover:bg-black/5"
            }`}
          >
            Zimski čas
          </button>
        </div>
      </div>

      {/* TEXT AREA – PREMIUM CARD */}
      <div className="relative max-w-3xl mx-auto min-h-[420px] flex items-center justify-center">

        {/* BACKGROUND CARD */}
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-black/5"></div>

        {/* SUMMER */}
        <div
          className={`
            absolute px-10 transition-all duration-500 text-center
            ${season === "summer"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <h3 className="text-3xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
            Poletna doživetja
          </h3>

          <ul className="text-[var(--text-main)] leading-relaxed space-y-3 text-lg">
            <li>• Pohodništvo po označenih poteh.</li>
            <li>• Družinske poti primerne za otroke.</li>
            <li>• Gorsko kolesarjenje – single traili, krožne ture.</li>
            <li>• Fotografiranje razgledov, sončni vzhodi in zahodi.</li>
            <li>• Flora: zoisova zvončnica, kortuzovka.</li>
            <li>• Obisk cerkve sv. Uršule.</li>
          </ul>
        </div>

        {/* WINTER */}
        <div
          className={`
            absolute px-10 transition-all duration-500 text-center
            ${season === "winter"
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none"}
          `}
        >
          <h3 className="text-3xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
            Zimska doživetja
          </h3>

          <ul className="text-[var(--text-main)] leading-relaxed space-y-3 text-lg">
            <li>• Turno smučanje.</li>
            <li>• Zimsko pohodništvo.</li>
            <li>• Razgledi na zasneženo Koroško.</li>
            <li>• Topli obroki in čaj v planinskem domu.</li>
            <li>• Cerkev sv. Uršule v zimski idili.</li>
            <li>• Smučišča: Ošven, Kope, Peca.</li>
          </ul>
        </div>

      </div>
    </section>
  );
}
