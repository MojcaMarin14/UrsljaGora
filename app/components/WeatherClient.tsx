"use client";

import { useState } from "react";

const ICONS = {
  0: "☀️",
  1: "🌤️",
  2: "⛅",
  3: "☁️",
  45: "🌫️",
  48: "🌫️",
  51: "🌦️",
  53: "🌦️",
  55: "🌧️",
  61: "🌦️",
  63: "🌧️",
  65: "🌧️",
  71: "🌨️",
  73: "🌨️",
  75: "❄️",
  80: "🌦️",
  81: "🌧️",
  82: "🌧️",
  85: "🌨️",
  86: "❄️",
};

interface IconMap {
    [key: number]: string;
}

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
    return ICONS[code as keyof typeof ICONS] ?? "🌡️";
}

export default function WeatherClient({ weather }: { weather: WeatherData }) {
  const hourly = weather.hourly;
  const daily = weather.daily;

  // privzeto izbran dan = danes
  const [selectedDay, setSelectedDay] = useState(0);

  // filtriramo hourly podatke za izbran dan
  const selectedDate = daily.time[selectedDay];
  const hoursForDay = hourly.time
    .map((t, i) => ({ t, temp: hourly.temperature_2m[i] }))
    .filter((h) => h.t.startsWith(selectedDate));

  return (
    <main className="w-full">

      {/* HERO VIDEO */}
      <section className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/vreme.mp4"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">
            Vreme
          </h1>
          <p className="mt-4 text-lg md:text-2xl max-w-2xl drop-shadow-lg">
            Napoved za Uršljo goro.
          </p>
        </div>
      </section>

      {/* GRAF ZA IZBRANI DAN */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold mb-4">
          Potek temperature – {new Date(selectedDate).toLocaleDateString("sl-SI")}
        </h2>

        <div className="bg-white/80 rounded-2xl shadow p-6">
          <div className="flex gap-2 overflow-x-auto">
            {hoursForDay.map((h, i) => (
              <div key={i} className="flex flex-col items-center w-12">
                <div
                  className="w-2 rounded bg-blue-400"
                  style={{ height: `${(h.temp + 10) * 4}px` }}
                ></div>
                <span className="text-xs mt-1">{Math.round(h.temp)}°</span>
                <span className="text-[10px] text-gray-500">
                  {new Date(h.t).getHours()}:00
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DNEVNE KARTICE */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <h2 className="text-3xl font-bold mb-8">Dnevna napoved</h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {daily.time.map((date, i) => {
            const d = new Date(date);
            const day = d.toLocaleDateString("sl-SI", { weekday: "short" });
            const full = d.toLocaleDateString("sl-SI", {
              day: "2-digit",
              month: "2-digit",
            });

            return (
              <article
                key={date}
                onClick={() => setSelectedDay(i)}
                className={`cursor-pointer bg-white/80 rounded-2xl shadow p-6 hover:shadow-md transition ${
                  selectedDay === i ? "ring-2 ring-blue-400" : ""
                }`}
              >
                <div className="flex justify-between text-sm text-gray-600">
                  <span className="font-semibold uppercase">{day}</span>
                  <span>{full}</span>
                </div>

                <div className="flex items-center gap-4 mt-3">
                  <div className="text-4xl">{icon(daily.weather_code[i])}</div>
                  <div>
                    <div className="text-2xl font-bold">
                      {Math.round(daily.temperature_2m_max[i])}°C
                    </div>
                    <div className="text-sm text-gray-600">
                      Min {Math.round(daily.temperature_2m_min[i])}°C
                    </div>
                  </div>
                </div>

                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>Padavine:</strong> {daily.precipitation_sum[i]} mm
                  </p>
                  <p>
                    <strong>Sneg:</strong> {daily.snowfall_sum[i]} cm
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
