"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const GOLD  = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK  = "#111008";

const TURNSTILE_ACTION = "contact_form";

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: {
        sitekey: string; action?: string; theme?: "light" | "dark" | "auto";
        size?: "normal" | "compact" | "flexible";
        callback?: (token: string) => void;
        "error-callback"?: () => void;
        "expired-callback"?: () => void;
      }) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function ContactForm() {
  const [form, setForm]               = useState({ ime: "", email: "", sporocilo: "" });
  const [gdpr, setGdpr]               = useState(false);
  const [status, setStatus]           = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef        = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !turnstileReady || !widgetContainerRef.current || widgetIdRef.current || !window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      theme: "light",
      size: "flexible",
      callback: (token) => { setTurnstileToken(token); setTurnstileError(""); },
      "error-callback":   () => { setTurnstileToken(""); setTurnstileError("Preverjanje ni uspelo. Poskusite znova."); },
      "expired-callback": () => { setTurnstileToken(""); setTurnstileError("Preverjanje je poteklo. Potrdite še enkrat."); },
    });
  }, [siteKey, turnstileReady]);

  useEffect(() => {
    return () => { if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current); };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetTurnstile = () => {
    setTurnstileToken(""); setTurnstileError("");
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.ime || !form.email || !form.sporocilo || !gdpr) return;
    if (!siteKey) { setStatus("error"); setTurnstileError("Zaščita obrazca trenutno ni nastavljena."); return; }
    if (!turnstileToken) { setStatus("error"); setTurnstileError("Potrdite, da niste robot."); return; }
    setStatus("sending"); setTurnstileError("");
    try {
      const res  = await fetch("/api/kontakt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, turnstileToken }) });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setStatus("sent"); setForm({ ime: "", email: "", sporocilo: "" }); setGdpr(false); resetTurnstile();
      } else {
        setStatus("error"); setTurnstileError(data?.error ?? "Preverjanje obrazca ni uspelo."); resetTurnstile();
      }
    } catch {
      setStatus("error"); setTurnstileError("Povezava s strežnikom ni uspela. Poskusite znova."); resetTurnstile();
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "#faf9f6",
    border: "1.5px solid rgba(17,16,8,0.1)",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 15,
    color: DARK,
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const submitDisabled = status === "sending" || !gdpr || !turnstileToken || !siteKey;

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
        style={{
          background: "white",
          borderRadius: 24,
          border: "1px solid rgba(17,16,8,0.07)",
          padding: "44px 48px",
          boxShadow: "0 2px 24px rgba(17,16,8,0.06)",
        }}
      >
        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: DARK, letterSpacing: "-0.02em", marginBottom: 10 }}>
              Sporočilo poslano!
            </h3>
            <p style={{ color: "rgba(17,16,8,0.5)", fontSize: 15, lineHeight: 1.7 }}>
              Odgovorili vam bomo v najkrajšem možnem času.
            </p>
            <motion.button
              onClick={() => { setStatus("idle"); resetTurnstile(); }}
              whileHover={{ scale: 1.03 }}
              style={{
                marginTop: 28,
                background: "transparent",
                border: `1.5px solid ${GOLD}`,
                color: GOLD,
                padding: "10px 28px",
                borderRadius: 999,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
                letterSpacing: "0.04em",
              }}
            >
              Novo sporočilo
            </motion.button>
          </motion.div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label style={{ display: "block", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B6914", fontWeight: 700, marginBottom: 8 }}>
                  Ime in priimek
                </label>
                <input
                  name="ime"
                  value={form.ime}
                  onChange={handleChange}
                  placeholder="Jana Novak"
                  maxLength={100}
                  style={inputBase}
                  onFocus={(e) => { e.target.style.borderColor = GOLD; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(17,16,8,0.1)"; }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B6914", fontWeight: 700, marginBottom: 8 }}>
                  E-pošta
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="jana@email.com"
                  maxLength={254}
                  style={inputBase}
                  onFocus={(e) => { e.target.style.borderColor = GOLD; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(17,16,8,0.1)"; }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: "#8B6914", fontWeight: 700, marginBottom: 8 }}>
                Sporočilo
              </label>
              <textarea
                name="sporocilo"
                value={form.sporocilo}
                onChange={handleChange}
                placeholder="Vaše vprašanje ali sporočilo..."
                rows={5}
                maxLength={2000}
                style={{ ...inputBase, resize: "vertical", lineHeight: 1.7 }}
                onFocus={(e) => { e.target.style.borderColor = GOLD; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(17,16,8,0.1)"; }}
              />
            </div>

            <div>
              {!siteKey ? (
                <p style={{ fontSize: 13, color: "#d97706", margin: 0 }}>
                </p>
              ) : (
                <div ref={widgetContainerRef} style={{ minHeight: 65 }} />
              )}
              {turnstileError && (
                <p style={{ fontSize: 13, color: "#dc2626", margin: "8px 0 0" }}>{turnstileError}</p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <input
                type="checkbox"
                id="gdpr"
                checked={gdpr}
                onChange={(e) => setGdpr(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: GOLD, flexShrink: 0, cursor: "pointer" }}
              />
              <label htmlFor="gdpr" style={{ fontSize: 17, color: "rgba(17,16,8,0.5)", lineHeight: 1.65, cursor: "pointer" }}>
                Strinjam se z{" "}
                <Link href="/zasebnost" style={{ color: GOLD, textDecoration: "underline" }}>
                  obdelavo osebnih podatkov
                </Link>{" "}
                za namen odgovora na moje povpraševanje. Soglasje lahko kadarkoli prekličem z zahtevo na{" "}
                <a href="mailto:info@ursljagora.si" style={{ color: GOLD }}>info@ursljagora.si</a>.
              </label>
            </div>

            {status === "error" && !turnstileError && (
              <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                Prišlo je do napake. Poskusite znova ali nas kontaktirajte neposredno.
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <motion.button
                onClick={handleSubmit}
                disabled={submitDisabled}
                whileHover={{ scale: submitDisabled ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: submitDisabled ? "rgba(17,16,8,0.12)" : GOLD,
                  color: submitDisabled ? "rgba(17,16,8,0.35)" : "white",
                  border: "none",
                  padding: "13px 32px",
                  borderRadius: 999,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: submitDisabled ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  letterSpacing: "0.04em",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {status === "sending" ? "Pošiljam…" : "Pošlji sporočilo"}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}