import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const EMAIL_REGEX = /^[^\s@<>;,]+@[^\s@<>;,]+\.[^\s@<>;,]+$/;
const TURNSTILE_ACTION = "contact_form";
const unavailable = "Pošiljanje trenutno ni na voljo. Prosimo, uporabite e-pošto ali telefon.";
const isLocalHost = (host: string) => host === "localhost" || host === "127.0.0.1" || host === "[::1]" || host.endsWith(".localhost");
const value = (name: string) => process.env[name]?.trim() || "";

function settings(req: NextRequest) {
  let configuredHost = "", requestHost = "";
  try { configuredHost = new URL(value("NEXT_PUBLIC_SITE_URL")).hostname; } catch { /* fail closed */ }
  try { requestHost = new URL(`http://${req.headers.get("host") || new URL(req.url).host}`).hostname; } catch { /* fail closed */ }
  const requestedLocal = value("CONTACT_LOCAL_TEST") === "true";
  const port = Number(value("EMAIL_PORT") || "465");
  const host = value("EMAIL_HOST");
  const secure = value("EMAIL_SECURE") ? value("EMAIL_SECURE") === "true" : port === 465;
  const local = requestedLocal && isLocalHost(configuredHost) && isLocalHost(requestHost) &&
    host === "mailpit" && port === 1025 && !secure && !value("EMAIL_USER") && !value("EMAIL_PASS");
  const from = value("EMAIL_FROM") || value("EMAIL_USER");
  const to = value("EMAIL_TO");
  // Server-owned destination only: visitors cannot choose a recipient.
  const smtpReady = Boolean(host && Number.isInteger(port) && port > 0 && port <= 65535 && EMAIL_REGEX.test(from) && EMAIL_REGEX.test(to));
  const siteKey = value("TURNSTILE_SITE_KEY") || value("NEXT_PUBLIC_TURNSTILE_SITE_KEY");
  const expectedHostname = value("TURNSTILE_EXPECTED_HOSTNAME") || configuredHost;
  const live = !requestedLocal && smtpReady && Boolean(siteKey && value("TURNSTILE_SECRET_KEY") && expectedHostname && value("EMAIL_USER") && value("EMAIL_PASS"));
  return { available: smtpReady && (local || live), local, from, to, host, port, secure, siteKey, expectedHostname };
}

export async function GET(req: NextRequest) {
  const config = settings(req);
  return NextResponse.json({ available: config.available, localTest: config.available && config.local, siteKey: config.available && !config.local ? config.siteKey : null }, { headers: { "Cache-Control": "no-store" } });
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
const string = (input: unknown) => typeof input === "string" ? input.trim() : "";

async function validTurnstile(token: string, hostname: string) {
  try {
    const form = new FormData();
    form.append("secret", value("TURNSTILE_SECRET_KEY"));
    form.append("response", token);
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form, signal: AbortSignal.timeout(5000), cache: "no-store" });
    if (!response.ok) return false;
    const result = await response.json();
    return result.success === true && result.action === TURNSTILE_ACTION && result.hostname === hostname;
  } catch { return false; }
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    const input = await req.json();
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid body");
    body = input;
  } catch { return NextResponse.json({ error: "Neveljavna zahteva." }, { status: 400 }); }
  const ime = string(body.ime), email = string(body.email), sporocilo = string(body.sporocilo);
  if (!ime || !email || !sporocilo || ime.length > 100 || email.length > 254 || sporocilo.length > 2000 || /[\r\n]/.test(ime) || !EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Preverite ime, e-poštni naslov in sporočilo." }, { status: 400 });
  }
  if (body.gdpr !== true) return NextResponse.json({ error: "Za pošiljanje potrdite soglasje." }, { status: 400 });
  const config = settings(req);
  if (!config.available) return NextResponse.json({ error: unavailable }, { status: 503 });
  // A local mode flag is insufficient by itself: both hostnames and the private
  // capture-only SMTP configuration must match. Production always needs CAPTCHA.
  if (!config.local && (!string(body.turnstileToken) || !await validTurnstile(string(body.turnstileToken), config.expectedHostname))) {
    return NextResponse.json({ error: "Preverjanje ni uspelo. Potrdite ga še enkrat." }, { status: 403 });
  }
  try {
    const transporter = nodemailer.createTransport({
      host: config.host, port: config.port, secure: config.secure,
      connectionTimeout: 5000, greetingTimeout: 5000, socketTimeout: 10000,
      ...(config.local ? { ignoreTLS: true } : { auth: { user: value("EMAIL_USER"), pass: value("EMAIL_PASS") }, requireTLS: !config.secure }),
    });
    const info = await transporter.sendMail({
      from: { name: "Uršlja gora - Kontaktni obrazec", address: config.from },
      to: config.to, replyTo: email, subject: `Novo sporočilo od ${ime}`,
      text: `Ime: ${ime}\nE-pošta: ${email}\n\n${sporocilo}`,
      html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222"><h2 style="color:#c9a96e">Novo sporočilo</h2><p>Uršlja gora – kontaktni obrazec</p><hr><p><strong>Ime:</strong> ${escapeHtml(ime)}</p><p><strong>E-pošta:</strong> ${escapeHtml(email)}</p><p style="background:#f7f4ef;padding:16px;white-space:pre-wrap">${escapeHtml(sporocilo)}</p></div>`,
    });
    if (!info.accepted?.length) throw new Error("SMTP recipient not accepted");
    return NextResponse.json({ ok: true, localTest: config.local });
  } catch {
    // Do not log credentials, message contents or transport error details.
    console.error("Contact email delivery failed");
    return NextResponse.json({ error: "Sporočila ni bilo mogoče poslati. Poskusite znova ali nas kontaktirajte neposredno." }, { status: 502 });
  }
}
