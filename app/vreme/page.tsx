import WeatherClient from "../components/WeatherClient";

export const revalidate = 1800;

async function getWeather() {
  const res = await fetch(
    "https://api.open-meteo.com/v1/forecast?latitude=46.48&longitude=14.966&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min,snowfall_sum,precipitation_sum&timezone=Europe%2FLjubljana",
    { next: { revalidate } }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch weather data");
  }

  return res.json();
}

export default async function VremePage() {
  const weather = await getWeather();
  return <WeatherClient weather={weather} />;
}
