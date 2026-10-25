import WeatherClient from '../components/WeatherClient';
import { buildWeatherUrl, parseWeather } from '@/lib/weather';
import { unstable_cache } from 'next/cache';

export const dynamic = 'force-dynamic';

// Cache valid forecasts independently of the dynamically rendered page.
// An upstream error is not cached as an empty forecast for the next 30 minutes.
const getCachedWeather = unstable_cache(async (apiKey: string, forecastDay: string) => {
  const res = await fetch(buildWeatherUrl(apiKey), {
    cache: 'no-store', signal: AbortSignal.timeout(5000),
  });
  if (!res.ok) throw new Error('Weather service unavailable');
  const weather = parseWeather(await res.json());
  if (!weather || weather.daily.time[0] !== forecastDay) throw new Error('Invalid weather response');
  return { ...weather, fetchedAt: Date.now() };
}, ['urslja-gora-weather-hut-1680-v2'], { revalidate: 1800 });

export default async function VremePage() {
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Ljubljana' }).format(new Date());
  const cached = await getCachedWeather(process.env.WEATHER_API_KEY?.trim() || '', today).catch(() => null);
  // During a provider outage, never present an old forecast as current indefinitely.
  const weather = cached && Date.now() - cached.fetchedAt <= 3600000 ? cached : null;
  if (!weather) return (
    <main style={{ minHeight: '60vh', padding: '120px 24px', textAlign: 'center' }}>
      <h1>Vreme na Uršlji gori</h1>
      <p>Vremenski podatki trenutno niso na voljo. Poskusite znova čez nekaj minut.</p>
    </main>
  );
  return <WeatherClient weather={weather} />;
}
