import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 2000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "contact_form";

type ContactRequestBody = {
  ime?: unknown;
  email?: unknown;
  sporocilo?: unknown;
  turnstileToken?: unknown;
};

type TurnstileValidationResult = {
  success: boolean;
  action?: string;
  hostname?: string;
  "error-codes"?: string[];
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim();
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getClientIp(req: NextRequest) {
  const cfIp = req.headers.get("cf-connecting-ip");
  if (cfIp) return cfIp;

  const forwardedFor = req.headers.get("x-forwarded-for");
  if (!forwardedFor) return null;

  return forwardedFor.split(",")[0]?.trim() || null;
}

async function validateTurnstile(token: string, req: NextRequest) {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    console.error("Missing TURNSTILE_SECRET_KEY");
    return {
      success: false,
      "error-codes": ["missing-input-secret"],
    } satisfies TurnstileValidationResult;
  }

  const formData = new FormData();
  formData.append("secret", secret);
  formData.append("response", token);
  formData.append("idempotency_key", crypto.randomUUID());

  const remoteIp = getClientIp(req);
  if (remoteIp) {
    formData.append("remoteip", remoteIp);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        success: false,
        "error-codes": ["bad-request"],
      } satisfies TurnstileValidationResult;
    }

    return await response.json() as TurnstileValidationResult;
  } catch (error) {
    console.error("Turnstile validation failed:", error);
    return {
      success: false,
      "error-codes": ["internal-error"],
    } satisfies TurnstileValidationResult;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function POST(req: NextRequest) {
  let body: ContactRequestBody;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Neveljaven JSON" }, { status: 400 });
  }

  const ime = getString(body.ime);
  const email = getString(body.email);
  const sporocilo = getString(body.sporocilo);
  const turnstileToken = getString(body.turnstileToken);

  if (!ime || !email || !sporocilo || !turnstileToken) {
    return NextResponse.json({ error: "Manjkajoča polja" }, { status: 400 });
  }

  if (
    ime.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    sporocilo.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json({ error: "Vnos je predolg" }, { status: 400 });
  }

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Neveljaven e-poštni naslov" }, { status: 400 });
  }

  const turnstileResult = await validateTurnstile(turnstileToken, req);

  if (!turnstileResult.success) {
    return NextResponse.json({ error: "Turnstile preverjanje ni uspelo" }, { status: 403 });
  }

  if (turnstileResult.action && turnstileResult.action !== TURNSTILE_ACTION) {
    return NextResponse.json({ error: "Neveljavno dejanje Turnstile" }, { status: 403 });
  }

  const expectedHostname = process.env.TURNSTILE_EXPECTED_HOSTNAME?.trim();
  if (
    expectedHostname &&
    turnstileResult.hostname &&
    turnstileResult.hostname !== expectedHostname
  ) {
    return NextResponse.json({ error: "Neveljaven izvor Turnstile" }, { status: 403 });
  }

  const safeIme = cleanHeader(ime);
  const safeEmail = cleanHeader(email);
  const escapedIme = escapeHtml(ime);
  const escapedEmail = escapeHtml(email);
  const escapedSporocilo = escapeHtml(sporocilo).replace(/\r?\n/g, "<br />");

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Uršlja gora - Kontaktni obrazec" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: safeEmail,
      subject: `Novo sporočilo od ${safeIme}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
          <h2 style="color: #c9a96e; margin-bottom: 4px;">Novo sporočilo</h2>
          <p style="color: #888; margin-top: 0; font-size: 13px;">Uršlja gora - kontaktni obrazec</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Ime:</strong> ${escapedIme}</p>
          <p><strong>E-pošta:</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
          <p><strong>Sporočilo:</strong></p>
          <p style="background: #f7f4ef; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${escapedSporocilo}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email napaka:", err);
    return NextResponse.json({ error: "Napaka pri pošiljanju" }, { status: 500 });
  }
}
