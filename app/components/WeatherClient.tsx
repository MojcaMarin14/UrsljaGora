"use client";

import { useState } from "react";
import Footer from "./Footer";

const ICONS: { [key: number]: string } = {
  0: "☀️", 1: "🌤️", 2: "⛅", 3: "☁️",
  45: "🌫️", 48: "🌫️", 51: "🌦️", 53: "🌦️", 55: "🌧️",
  61: "🌦️", 63: "🌧️", 65: "🌧️", 71: "🌨️", 73: "🌨️",
  75: "❄️", 80: "🌦️", 81: "🌧️", 82: "🌧️", 85: "🌨️", 86: "❄️",
};

interface WeatherData {
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
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
  const hourly = weather.hourly;
  const daily = weather.daily;
  const [selectedDay, setSelectedDay] = useState(0);

  const selectedDate = daily.time[selectedDay];
  const hoursForDay = hourly.time
    .map((t, i) => ({ t, temp: hourly.temperature_2m[i] }))
    .filter((h) => h.t.startsWith(selectedDate));

  const maxTemp = Math.max(...hoursForDay.map((h) => h.temp));
  const minTemp = Math.min(...hoursForDay.map((h) => h.temp));
  const tempRange = maxTemp - minTemp || 1;

  return (
    <main className="w-full bg-white text-[#1a1a1a]">

      {/* HERO */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/vreme.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <span className="inline-flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase text-white/80 border border-white/30 px-4 py-1.5 rounded-full mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
            Uršlja gora · {Math.round(daily.temperature_2m_max[0])}°C danes
          </span>
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight drop-shadow-lg text-white">
            Vreme
          </h1>
          <div className="w-20 h-[2px] bg-white/50 rounded-full mt-6" />
          <p className="mt-5 text-lg md:text-xl text-white/80 max-w-md">
            Napoved za Uršljo goro
          </p>
        </div>
      </section>

      {/* DNEVNE KARTICE */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.15em] uppercase text-[#a08c5b] mb-1">7-dnevna napoved</p>
            <h2 className="text-3xl font-medium tracking-tight text-[#1a1a1a]">Dnevna napoved</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {daily.time.map((date, i) => {
            const d = new Date(date);
            const day = d.toLocaleDateString("sl-SI", { weekday: "long" });
            const full = d.toLocaleDateString("sl-SI", { day: "2-digit", month: "2-digit" });
            const isSelected = selectedDay === i;
            const isToday = i === 0;

            return (
            <article
  key={date}
  onClick={() => setSelectedDay(i)}
  className={`
    cursor-pointer rounded-2xl p-6 transition-all duration-200 border
    ${isSelected
      ? "bg-[#e8f4fd] text-[#1a1a1a] border-[#93bfd4] shadow-md scale-[1.02]"
      : "bg-white text-[#1a1a1a] border-black/10 hover:shadow-md hover:scale-[1.01] hover:border-black/20"
    }
  `}
>
  <div className="flex items-start justify-between mb-4">
    <div>
      <p className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-[#2a7ab5]" : "text-[#a08c5b]"}`}>
        {isToday ? "Danes" : day}
      </p>
      <p className={`text-sm mt-0.5 ${isSelected ? "text-[#1a1a1a]/50" : "text-black/40"}`}>{full}</p>
    </div>
    <span className="text-3xl leading-none">{icon(daily.weather_code[i])}</span>
  </div>

  <div className="mt-3">
    <span className="text-4xl font-semibold tracking-tight text-[#1a1a1a]">
      {Math.round(daily.temperature_2m_max[i])}°
    </span>
    <span className="text-base ml-1.5 text-black/35">
      / {Math.round(daily.temperature_2m_min[i])}°
    </span>
  </div>

  <div className={`mt-4 pt-4 border-t text-sm space-y-1.5 ${isSelected ? "border-[#93bfd4]/40" : "border-black/8"}`}>
    <div className="flex justify-between">
      <span className="text-black/50">Padavine</span>
      <span className="font-medium text-[#1a1a1a]">{daily.precipitation_sum[i]} mm</span>
    </div>
    <div className="flex justify-between">
      <span className="text-black/50">Sneg</span>
      <span className="font-medium text-[#1a1a1a]">{daily.snowfall_sum[i]} cm</span>
    </div>
  </div>

  {/* Izbrano oznaka */}
  {isSelected && (
    <div className="mt-4 flex justify-center">
      <span className="text-[10px] font-semibold uppercase tracking-widest text-[#2a7ab5] bg-[#2a7ab5]/10 px-3 py-1 rounded-full">
        Izbrano
      </span>
    </div>
  )}
</article>
            );
          })}
        </div>
      </section>

      {/* URNI GRAF */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="bg-[#f8f7f4] rounded-3xl border border-black/8 p-8">

          {/* Glava */}
          <div className="flex items-start justify-between mb-10">
            <div>
              <p className="text-xs tracking-[0.15em] uppercase text-[#a08c5b] mb-1">Urna napoved</p>
              <h2 className="text-2xl font-medium tracking-tight text-[#1a1a1a]">
                {new Date(selectedDate).toLocaleDateString("sl-SI", {
                  weekday: "long", day: "numeric", month: "long",
                })}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-black/40 mb-0.5">Razpon</p>
              <p className="text-base font-semibold text-[#1a1a1a]">
                {Math.round(minTemp)}° – {Math.round(maxTemp)}°C
              </p>
            </div>
          </div>

          {/* Graf */}
          {hoursForDay.length > 0 ? (
            <>
              <div className="flex items-end gap-2 overflow-x-auto pb-4" style={{ height: "200px" }}>
                {hoursForDay.map((h, i) => {
                  const heightPct = ((h.temp - minTemp) / tempRange) * 80 + 10;
                  const isWarm = h.temp >= (maxTemp + minTemp) / 2;

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center flex-shrink-0 group"
                      style={{ width: "52px", height: "100%" }}
                    >
                      {/* Temperatura nad stolpcem */}
                      <p className="text-xs font-semibold text-[#1a1a1a] mb-1">
                        {Math.round(h.temp)}°
                      </p>

                      {/* Stolpec */}
                      <div className="flex-1 flex items-end w-full">
                        <div
                          className={`w-full rounded-xl transition-opacity duration-200 group-hover:opacity-70 ${
                            isWarm ? "bg-[#d4b676]" : "bg-[#93bfd4]"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />
                      </div>

                      {/* Ura */}
                      <p className="text-[10px] text-black/40 mt-2">
                        {new Date(h.t).getHours()}:00
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="flex gap-5 mt-4 pt-5 border-t border-black/8">
                <div className="flex items-center gap-2 text-sm text-black/50">
                  <div className="w-3 h-3 rounded-sm bg-[#d4b676]" />
                  Toplejše
                </div>
                <div className="flex items-center gap-2 text-sm text-black/50">
                  <div className="w-3 h-3 rounded-sm bg-[#93bfd4]" />
                  Hladnejše
                </div>
              </div>
            </>
          ) : (
            <p className="text-black/40 text-sm">Ni podatkov za ta dan.</p>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}