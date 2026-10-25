const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const weatherModule = path.resolve(__dirname, '../lib/weather.ts');
const { buildWeatherUrl, parseWeather, formatReading, weatherIcon, weatherDescription } = require(weatherModule);
function fixture() {
  return { elevation: 1680, timezone: 'Europe/Ljubljana',
    current: {time: '2026-10-25T18:15', temperature_2m: -1.2, weather_code: 0, is_day: 0},
    hourly: {time: ['2026-10-25T00:00','2026-10-25T01:00'], temperature_2m: [null, -3]},
    daily: {time: ['2026-10-25'], temperature_2m_max: [2], temperature_2m_min: [-4], weather_code: [95], precipitation_sum: [1.2], snowfall_sum: [0], wind_speed_10m_max: [22], wind_gusts_10m_max: [45]} };
}
test('forecast request explicitly sets the hut location, height, units and wind data', () => {
  const url = new URL(buildWeatherUrl());
  assert.equal(url.hostname, 'api.open-meteo.com');
  for (const [key, value] of Object.entries({latitude:'46.48471873',longitude:'14.96506219',elevation:'1680',timezone:'Europe/Ljubljana',forecast_days:'7',temperature_unit:'celsius',wind_speed_unit:'kmh',precipitation_unit:'mm'})) assert.equal(url.searchParams.get(key), value);
  assert.ok(url.searchParams.get('current').includes('temperature_2m'));
  assert.ok(url.searchParams.get('daily').includes('wind_gusts_10m_max'));
  assert.equal(url.searchParams.has('apikey'), false);
});
test('optional provider key selects the commercial endpoint, never browser props', () => {
  const url = new URL(buildWeatherUrl('fixture-key-not-real'));
  assert.equal(url.hostname,'customer-api.open-meteo.com');
  assert.equal(url.searchParams.get('apikey'),'fixture-key-not-real');
  const value={...fixture(),apikey:'fixture-key-not-real',provider_url:url.toString()};
  assert.ok(!JSON.stringify(parseWeather(value)).includes('fixture-key-not-real'));
});
test('valid forecast accepts missing individual measurements without showing zero', () => {
  assert.ok(parseWeather(fixture()));
  assert.equal(formatReading(null,'°C'),'—');
  assert.equal(formatReading(undefined,' km/h'),'—');
  assert.equal(formatReading(NaN),'—');
  assert.equal(formatReading(0,' cm'),'0 cm');
  assert.equal(formatReading(1.2,' mm',1),'1,2 mm');
  const noCurrent=fixture(); delete noCurrent.current;
  assert.ok(parseWeather(noCurrent));
});
test('error payload, wrong elevation, malformed timestamps and truncated arrays fail safely', () => {
  assert.equal(parseWeather({error:true,reason:'test'}),null);
  const wrong=fixture(); wrong.elevation=1448; assert.equal(parseWeather(wrong),null);
  const truncated=fixture(); truncated.daily.wind_gusts_10m_max=[]; assert.equal(parseWeather(truncated),null);
  const wrongTime=fixture(); wrongTime.current.time='invalid'; assert.equal(parseWeather(wrongTime),null);
  const wrongValue=fixture(); wrongValue.hourly.temperature_2m[0]='-3'; assert.equal(parseWeather(wrongValue),null);
  assert.equal(parseWeather(null),null);
});
test('thunderstorms, freezing rain and snow grains retain their specific descriptions', () => {
  for (const code of [95,96,97,99]) { assert.match(weatherDescription(code),/nevihta/i); assert.equal(weatherIcon(code),'⛈️'); }
  for (const code of [56,57,66,67]) assert.match(weatherDescription(code),/zmrzuje/);
  assert.equal(weatherDescription(77),'Snežna zrna');
  assert.equal(weatherDescription(null),'Ni podatka o vremenu');
  assert.equal(weatherIcon(0,false),'🌙');
  assert.equal(weatherIcon(0,true),'☀️');
});
test('Ljubljana calendar dates remain identical across visitor zones and DST dates', () => {
  const code=`const {formatForecastDate}=require(${JSON.stringify(weatherModule)}); console.log(JSON.stringify(['2026-10-25','2026-10-26','2026-03-29'].map(d=>formatForecastDate(d,{weekday:'long',day:'numeric',month:'long',year:'numeric'}))));`;
  const outputs=['UTC','Europe/Ljubljana','America/Los_Angeles','Pacific/Honolulu','Pacific/Auckland'].map(TZ=>execFileSync(process.execPath,['--experimental-strip-types','-e',code],{env:{...process.env,TZ},encoding:'utf8'}).trim());
  assert.equal(new Set(outputs).size,1);
  assert.match(outputs[0],/25\. oktober 2026/);
});
