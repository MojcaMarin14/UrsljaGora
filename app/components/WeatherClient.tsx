"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "./Footer";

const GOLD  = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK  = "#111008";


const ICONS: { [key: number]: string } = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌦️", 63: "🌧️", 65: "🌧️", 71: "🌨️", 73: "🌨️",
  75: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️", 85: "🌨️", 86: "❄️",
};

interface WeatherData {
  hourly: { time: string[]; temperature_2m: number[] };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
    precipitation_sum: number[];
    snowfall_sum: number[];
  };
}

function icon(code: number): string {
  return ICONS[code] ?? "🌡️";
}

export default function WeatherClient({ weather }: { weather: WeatherData }) {
  const { hourly, daily } = weather;
  const [selectedDay, setSelectedDay] = useState(0);

  const selectedDate = daily.time[selectedDay];
  const hoursForDay = hourly.time
    .map((t, i) => ({ t, temp: hourly.temperature_2m[i] }))
    .filter((h) => h.t.startsWith(selectedDate));

  const maxTemp = Math.max(...hoursForDay.map((h) => h.temp));
  const minTemp = Math.min(...hoursForDay.map((h) => h.temp));
  const tempRange = maxTemp - minTemp || 1;

  const todayMax = Math.round(daily.temperature_2m_max[0]);
  const todayCode = daily.weather_code[0];

  return (
    <main style={{ width: "100%", height: "100vh", overflow: "hidden", position: "relative" }}>

      {/* ── VIDEO BACKGROUND — cela stran ── */}
      <video
        src="/vreme.mp4"
        autoPlay muted loop playsInline
        style={{ position: "fixed", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0 }}
      />

      {/* Overlay */}
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 1 }} />

      {/* ── DASHBOARD NA VIDEU ── */}
      <div style={{
        position: "relative", zIndex: 10,
        height: "100vh",
        paddingTop: 60,
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        overflow: "hidden",
      }}>

        {/* ── LEVO: Seznam dni ── */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: "rgba(17,16,8,0.55)",
          backdropFilter: "blur(20px)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
        }}>
          {/* Header */}
          <div style={{
            padding: "28px 24px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 24, height: 1, background: GOLD }} />
              <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 700 }}>
                Uršlja gora · 1699m
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 44 }}>{icon(todayCode)}</span>
              <div>
                <p style={{ fontSize: 40, fontWeight: 600, color: "white", letterSpacing: "-0.03em", margin: 0, lineHeight: 1 }}>
                  {todayMax}°C
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", margin: "4px 0 0" }}>danes</p>
              </div>
            </div>
          </div>

          {/* Dni */}
          <div style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
            {daily.time.map((date, i) => {
              const d = new Date(date);
              const day = d.toLocaleDateString("sl-SI", { weekday: "long" });
              const full = d.toLocaleDateString("sl-SI", { day: "2-digit", month: "2-digit" });
              const isSelected = selectedDay === i;
              const isToday = i === 0;

              return (
                <button
                  key={date}
                  onClick={() => setSelectedDay(i)}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "11px 14px",
                    borderRadius: 14,
                    border: isSelected ? `1.5px solid rgba(201,169,110,0.7)` : "1.5px solid transparent",
                    background: isSelected ? "rgba(201,169,110,0.15)" : "transparent",
                    cursor: "pointer",
                    marginBottom: 3,
                    transition: "all 0.18s",
                    textAlign: "left",
                  }}
                  onMouseEnter={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{icon(daily.weather_code[i])}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 600, color: isSelected ? "white" : "rgba(255,255,255,0.65)", margin: 0, letterSpacing: "-0.01em" }}>
                      {isToday ? "Danes" : day}
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "1px 0 0" }}>{full}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: isSelected ? GOLD : "rgba(255,255,255,0.7)", margin: 0, letterSpacing: "-0.02em" }}>
                      {Math.round(daily.temperature_2m_max[i])}°
                    </p>
                    <p style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", margin: "1px 0 0" }}>
                      {Math.round(daily.temperature_2m_min[i])}°
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── DESNO: Detail ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDay}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            style={{
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              background: "rgba(17,16,8,0.35)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div style={{
              padding: "28px 36px 24px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 700, margin: "0 0 6px" }}>
                  {selectedDay === 0 ? "Danes" : new Date(selectedDate).toLocaleDateString("sl-SI", { weekday: "long" })}
                </p>
                <h2 style={{ fontSize: "clamp(20px, 2.5vw, 30px)", fontWeight: 500, color: "white", letterSpacing: "-0.025em", margin: 0 }}>
                  {new Date(selectedDate).toLocaleDateString("sl-SI", { day: "numeric", month: "long", year: "numeric" })}
                </h2>
              </div>

              {/* Stats */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {[
                  { label: "Max", value: `${Math.round(daily.temperature_2m_max[selectedDay])}°C` },
                  { label: "Min", value: `${Math.round(daily.temperature_2m_min[selectedDay])}°C` },
                  { label: "Padavine", value: `${daily.precipitation_sum[selectedDay]} mm` },
                  { label: "Sneg", value: `${daily.snowfall_sum[selectedDay]} cm` },
                ].map((s) => (
                  <div key={s.label} style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 14, padding: "10px 18px", textAlign: "center",
                    backdropFilter: "blur(8px)",
                  }}>
                    <p style={{ fontSize: 10, color: "rgba(201,169,110,0.85)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>{s.label}</p>
                    <p style={{ fontSize: 20, fontWeight: 600, color: "white", margin: 0, letterSpacing: "-0.02em" }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Graf */}
            <div style={{ flex: 1, padding: "24px 36px 28px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ width: 24, height: 1, background: GOLD }} />
                <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(201,169,110,0.9)", fontWeight: 700 }}>
                  Urna napoved
                </span>
              </div>

              {hoursForDay.length > 0 ? (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
                  <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 6, overflowX: "auto", paddingBottom: 8 }}>
                    {hoursForDay.map((h, i) => {
                      const heightPct = ((h.temp - minTemp) / tempRange) * 75 + 10;
                      const isWarm = h.temp >= (maxTemp + minTemp) / 2;
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scaleY: 0 }}
                          animate={{ opacity: 1, scaleY: 1 }}
                          transition={{ duration: 0.35, delay: i * 0.025 }}
                          style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, width: 52, height: "100%", transformOrigin: "bottom" }}
                        >
                          <p style={{ fontSize: 12, fontWeight: 600, color: "white", margin: "0 0 6px" }}>
                            {Math.round(h.temp)}°
                          </p>
                          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", width: "100%" }}>
                            <div style={{
                              width: "100%", borderRadius: 8,
                              height: `${heightPct}%`,
                              background: isWarm
                                ? `linear-gradient(to top, ${GOLD}, rgba(201,169,110,0.3))`
                                : "linear-gradient(to top, rgba(147,191,212,0.9), rgba(147,191,212,0.2))",
                            }} />
                          </div>
                          <p style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 6 }}>
                            {new Date(h.t).getHours()}:00
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  <div style={{ display: "flex", gap: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)", marginTop: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                      <div style={{ width: 12, height: 12, borderRadius: 4, background: GOLD }} />
                      Toplejše
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "rgba(255,255,255,0.45)" }}>
                      <div style={{ width: 12, height: 12, borderRadius: 4, background: "#93bfd4" }} />
                      Hladnejše
                    </div>
                  </div>
                  {/* Weather effect vizual */}
<div style={{
  marginTop: 16,
  borderTop: "1px solid rgba(255,255,255,0.08)",
  paddingTop: 16,
  height: 80,
  borderRadius: 14,
  overflow: "hidden",
  position: "relative",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
}}>
  {/* Label */}
  <div style={{ position: "absolute", top: 8, left: 14, fontSize: 19, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", fontWeight: 700 }}>
    Vizualizacija
  </div>

  <AnimatePresence mode="wait">
    {(() => {
     const code = daily.weather_code[selectedDay];

const isSnow  = (code >= 71 && code <= 75) || (code >= 85 && code <= 86); // samo čisti sneg
const isRain  = (code >= 51 && code <= 65) || (code >= 80 && code <= 82); // dež in rosenje  
const isSun   = code === 0 || code === 1;
const isMist  = code === 45 || code === 48;
const isCloud = code === 2 || code === 3;

      if (isSnow) return (
        <motion.div key="snow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div key={i}
              animate={{ y: ["-10px", "90px"], x: [0, (i % 2 === 0 ? 1 : -1) * 15] }}
              transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, delay: Math.random() * 2, ease: "linear" }}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: 0,
                width: Math.random() * 4 + 2,
                height: Math.random() * 4 + 2,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.85)",
              }}
            />
          ))}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 20, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
            ❄️ Sneženje
          </div>
        </motion.div>
      );

      if (isRain) return (
        <motion.div key="rain" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div key={i}
              animate={{ y: ["-10px", "90px"] }}
              transition={{ duration: Math.random() * 0.3 + 0.2, repeat: Infinity, delay: Math.random() * 1.5, ease: "linear" }}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: 0,
                width: 1.5,
                height: Math.random() * 14 + 8,
                background: "rgba(174,214,241,0.6)",
                borderRadius: 2,
                transform: "rotate(8deg)",
              }}
            />
          ))}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 20, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
            🌧️ Dež
          </div>
        </motion.div>
      );

      if (isSun) return (
        <motion.div key="sun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: 48, height: 48, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,210,80,0.9), rgba(255,160,30,0.4))", boxShadow: "0 0 30px rgba(255,200,50,0.4)" }}
          />
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={i}
              animate={{ opacity: [0.3, 0.8, 0.3], scale: [0.8, 1.2, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.25, ease: "easeInOut" }}
              style={{
                position: "absolute",
                width: 2, height: 16,
                background: "rgba(255,210,80,0.6)",
                borderRadius: 2,
                transformOrigin: "center 32px",
                transform: `rotate(${i * 45}deg) translateY(-32px)`,
              }}
            />
          ))}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 20, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
            ☀️ Sončno
          </div>
        </motion.div>
      );

      if (isMist) return (
        <motion.div key="mist" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          {Array.from({ length: 4 }).map((_, i) => (
            <motion.div key={i}
              animate={{ x: ["-30%", "120%"] }}
              transition={{ duration: 8 + i * 3, repeat: Infinity, delay: i * 2, ease: "linear" }}
              style={{
                position: "absolute",
                top: `${15 + i * 20}%`,
                left: "-30%",
                width: "50%", height: 20,
                background: "rgba(255,255,255,0.07)",
                borderRadius: "50%",
                filter: "blur(10px)",
              }}
            />
          ))}
          <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 12, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
            🌫️ Megla
          </div>
        </motion.div>
      );

      if (isCloud) return (
  <motion.div key="cloud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
    
    {/* Oblak 1 — velik, zadaj */}
    <motion.div
      animate={{ x: [0, 6, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "absolute", left: "10%", top: "18%" }}
    >
      <div style={{ position: "relative", width: 80, height: 30 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 22, background: "rgba(255,255,255,0.12)", borderRadius: 999, filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 12, left: 14, width: 30, height: 26, background: "rgba(255,255,255,0.12)", borderRadius: "50%", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 12, left: 32, width: 22, height: 20, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(2px)" }} />
      </div>
    </motion.div>

    {/* Oblak 2 — srednji */}
    <motion.div
      animate={{ x: [0, -8, 0] }}
      transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      style={{ position: "absolute", left: "35%", top: "25%" }}
    >
      <div style={{ position: "relative", width: 100, height: 38 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 26, background: "rgba(255,255,255,0.15)", borderRadius: 999, filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 18, width: 38, height: 32, background: "rgba(255,255,255,0.14)", borderRadius: "50%", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 16, left: 44, width: 28, height: 24, background: "rgba(255,255,255,0.12)", borderRadius: "50%", filter: "blur(2px)" }} />
      </div>
    </motion.div>

    {/* Oblak 3 — mali, spredaj */}
    <motion.div
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      style={{ position: "absolute", right: "12%", top: "20%" }}
    >
      <div style={{ position: "relative", width: 64, height: 26 }}>
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 18, background: "rgba(255,255,255,0.1)", borderRadius: 999, filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 12, width: 24, height: 20, background: "rgba(255,255,255,0.1)", borderRadius: "50%", filter: "blur(2px)" }} />
        <div style={{ position: "absolute", bottom: 10, left: 28, width: 18, height: 16, background: "rgba(255,255,255,0.08)", borderRadius: "50%", filter: "blur(2px)" }} />
      </div>
    </motion.div>

    <div style={{ position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)", fontSize: 20, color: "rgba(255,255,255,0.5)", whiteSpace: "nowrap" }}>
      ☁️ Oblačno
    </div>
  </motion.div>
);
      return (
        <motion.div key="default" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>
          🌡️ Spremenljivo
        </motion.div>
      );
    })()}
  </AnimatePresence>
</div>
                </div>

              ) : (
                <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Ni podatkov za ta dan.</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}