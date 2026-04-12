// app/api/kontakt/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { ime, email, sporocilo } = await req.json();

  if (!ime || !email || !sporocilo) {
    return NextResponse.json({ error: "Manjkajoča polja" }, { status: 400 });
  }

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
      from: `"Uršlja gora – Kontaktni obrazec" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `Novo sporočilo od ${ime}`,
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto; color: #222;">
          <h2 style="color: #c9a96e; margin-bottom: 4px;">Novo sporočilo</h2>
          <p style="color: #888; margin-top: 0; font-size: 13px;">Uršlja gora – kontaktni obrazec</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p><strong>Ime:</strong> ${ime}</p>
          <p><strong>E-pošta:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Sporočilo:</strong></p>
          <p style="background: #f7f4ef; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${sporocilo}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Email napaka:", err);
    return NextResponse.json({ error: "Napaka pri pošiljanju" }, { status: 500 });
  }
}