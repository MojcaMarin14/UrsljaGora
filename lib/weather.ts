// Coordinates: PZS, Dom na Uršlji gori. The hut is at 1680 m; the summit is 1699 m.
export const WEATHER_LOCATION = { latitude: 46.48471873, longitude: 14.96506219, elevation: 1680 };

type Reading = number | null;
export interface WeatherData {
  elevation: number;
  timezone: string;
  current?: { time: string; temperature_2m: Reading; weather_code: Reading; is_day: Reading };
  hourly: { time: string[]; temperature_2m: Reading[] };
  daily: {
    time: string[];
    temperature_2m_max: Reading[];
    temperature_2m_min: Reading[];
    weather_code: Reading[];
    precipitation_sum: Reading[];
    snowfall_sum: Reading[];
    wind_speed_10m_max: Reading[];
    wind_gusts_10m_max: Reading[];
  };
}

export function buildWeatherUrl(apiKey?: string) {
  const url = new URL(apiKey ? "https://customer-api.open-meteo.com/v1/forecast" : "https://api.open-meteo.com/v1/forecast");
  url.search = new URLSearchParams({
    latitude: String(WEATHER_LOCATION.latitude), longitude: String(WEATHER_LOCATION.longitude),
    elevation: String(WEATHER_LOCATION.elevation), timezone: "Europe/Ljubljana", forecast_days: "7",
    temperature_unit: "celsius", wind_speed_unit: "kmh", precipitation_unit: "mm",
    current: "temperature_2m,weather_code,is_day", hourly: "temperature_2m",
    daily: "weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max",
  }).toString();
  if (apiKey) url.searchParams.set("apikey", apiKey);
  return url.toString();
}

export function parseWeather(value: unknown): WeatherData | null {
  if (!value || typeof value !== "object") return null;
  const data = value as Partial<WeatherData> & { error?: unknown };
  const daily = data.daily, hourly = data.hourly;
  if (!daily || !hourly) return null;
  if (data.error || data.elevation !== WEATHER_LOCATION.elevation || data.timezone !== "Europe/Ljubljana") return null;
  const readings = (values: unknown, length: number) => Array.isArray(values) && values.length === length && values.every(v => v === null || (typeof v === "number" && Number.isFinite(v)));
  const dates = daily.time;
  const hours = hourly.time;
  if (!Array.isArray(dates) || !dates.length || !dates.every(d => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d))) return null;
  if (!Array.isArray(hours) || !hours.every(h => typeof h === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(h))) return null;
  if (!readings(hourly.temperature_2m, hours.length)) return null;
  for (const key of ["temperature_2m_max", "temperature_2m_min", "weather_code", "precipitation_sum", "snowfall_sum", "wind_speed_10m_max", "wind_gusts_10m_max"] as const) {
    if (!readings(daily[key], dates.length)) return null;
  }
  const current = data.current;
  if (current !== undefined) {
    if (!current || typeof current.time !== "string" || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(current.time)) return null;
    if (!(["temperature_2m", "weather_code", "is_day"] as const).every(k => readings([current[k]], 1))) return null;
  }
  // Return only public forecast fields. Provider credentials and metadata never enter client props.
  return { elevation: data.elevation, timezone: data.timezone, hourly, daily,
    ...(data.current ? { current: { time: data.current.time, temperature_2m: data.current.temperature_2m, weather_code: data.current.weather_code, is_day: data.current.is_day } } : {}) };
}

const CONDITIONS: Record<number, { icon: string; label: string }> = {
  0: { icon: "☀️", label: "Jasno" }, 1: { icon: "🌤️", label: "Pretežno jasno" },
  2: { icon: "⛅", label: "Delno oblačno" }, 3: { icon: "☁️", label: "Oblačno" },
  45: { icon: "🌫️", label: "Megla" }, 48: { icon: "🌫️", label: "Megla z ivjem" },
  51: { icon: "🌦️", label: "Rahlo rosenje" }, 53: { icon: "🌦️", label: "Rosenje" }, 55: { icon: "🌧️", label: "Močno rosenje" },
  56: { icon: "🧊", label: "Rahlo rosenje, ki zmrzuje" }, 57: { icon: "🧊", label: "Močno rosenje, ki zmrzuje" },
  61: { icon: "🌦️", label: "Rahel dež" }, 63: { icon: "🌧️", label: "Dež" }, 65: { icon: "🌧️", label: "Močan dež" },
  66: { icon: "🧊", label: "Rahel dež, ki zmrzuje" }, 67: { icon: "🧊", label: "Močan dež, ki zmrzuje" },
  71: { icon: "🌨️", label: "Rahlo sneženje" }, 73: { icon: "🌨️", label: "Sneženje" }, 75: { icon: "❄️", label: "Močno sneženje" },
  77: { icon: "🌨️", label: "Snežna zrna" },
  80: { icon: "🌦️", label: "Rahle plohe" }, 81: { icon: "🌧️", label: "Plohe" }, 82: { icon: "🌧️", label: "Močne plohe" },
  85: { icon: "🌨️", label: "Snežne plohe" }, 86: { icon: "❄️", label: "Močne snežne plohe" },
  95: { icon: "⛈️", label: "Nevihta" }, 96: { icon: "⛈️", label: "Nevihta s točo" },
  97: { icon: "⛈️", label: "Močna nevihta" }, 99: { icon: "⛈️", label: "Močna nevihta s točo" },
};

export function weatherIcon(code: Reading | undefined, isDay = true) {
  if (!isDay && (code === 0 || code === 1)) return "🌙";
  if (!isDay && code === 2) return "☁️";
  return code == null ? "🌡️" : CONDITIONS[code]?.icon ?? "🌡️";
}
export function weatherDescription(code: Reading | undefined) {
  return code == null ? "Ni podatka o vremenu" : CONDITIONS[code]?.label ?? "Ni podatka o vremenu";
}
export function formatReading(value: Reading | undefined, unit = "", decimals = 0) {
  if (value == null || !Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("sl-SI", { maximumFractionDigits: decimals }).format(value) + unit;
}
export function formatForecastDate(date: string, options: Intl.DateTimeFormatOptions) {
  // These are Ljubljana calendar dates, not instants to convert to the visitor's zone.
  return new Date(date + "T12:00:00Z").toLocaleDateString("sl-SI", { ...options, timeZone: "UTC" });
}
