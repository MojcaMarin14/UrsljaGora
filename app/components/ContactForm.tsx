"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const GOLD = "#d4b676";
const TURNSTILE_ACTION = "contact_form";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          theme?: "auto" | "light" | "dark";
          size?: "normal" | "compact" | "flexible";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export function ContactForm() {
  const [form, setForm] = useState({ ime: "", email: "", sporocilo: "" });
  const [gdpr, setGdpr] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

  useEffect(() => {
    if (!siteKey || !turnstileReady || !widgetContainerRef.current || widgetIdRef.current || !window.turnstile) {
      return;
    }

    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      theme: "auto",
      size: "flexible",
      callback: (token) => {
        setTurnstileToken(token);
        setTurnstileError("");
      },
      "error-callback": () => {
        setTurnstileToken("");
        setTurnstileError("Preverjanje ni uspelo. Poskusite znova.");
      },
      "expired-callback": () => {
        setTurnstileToken("");
        setTurnstileError("Preverjanje je poteklo. Potrdite še enkrat.");
      },
    });
  }, [siteKey, turnstileReady]);

  useEffect(() => {
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetTurnstile = () => {
    setTurnstileToken("");
    setTurnstileError("");

    if (widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!form.ime || !form.email || !form.sporocilo || !gdpr) return;

    if (!siteKey) {
      setStatus("error");
      setTurnstileError("Zaščita obrazca trenutno ni nastavljena.");
      return;
    }

    if (!turnstileToken) {
      setStatus("error");
      setTurnstileError("Potrdite, da niste robot.");
      return;
    }

    setStatus("sending");
    setTurnstileError("");

    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, turnstileToken }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus("sent");
        setForm({ ime: "", email: "", sporocilo: "" });
        setGdpr(false);
        resetTurnstile();
      } else {
        setStatus("error");
        setTurnstileError(data?.error ?? "Preverjanje obrazca ni uspelo.");
        resetTurnstile();
      }
    } catch {
      setStatus("error");
      setTurnstileError("Povezava s strežnikom ni uspela. Poskusite znova.");
      resetTurnstile();
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: "14px 18px",
    fontSize: 15,
    color: "white",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const submitDisabled = status === "sending" || !gdpr || !turnstileToken || !siteKey;

  return (
    <section style={{ padding: "0 24px 96px", background: "linear-gradient(to bottom, #0b0b0b, black)" }}>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ width: 28, height: 1, background: "rgba(212,182,118,0.6)" }} />
            <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(212,182,118,0.8)", fontWeight: 600 }}>
              Pišite nam
            </span>
          </div>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, color: "white", letterSpacing: "-0.025em", margin: 0 }}>
            Pošljite <span style={{ color: GOLD }}>sporočilo</span>
          </h2>
          <p style={{ marginTop: 12, fontSize: 15, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
            Za rezervacije, vprašanja o dostopih ali dejavnostih - odgovorimo v najkrajšem možnem času.
          </p>
        </div>

        <div style={{
          background: "#111",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: 28,
          padding: "44px 48px",
        }}>
          {status === "sent" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "32px 0" }}
            >
              <div style={{ fontSize: 40, marginBottom: 16 }}>✉️</div>
              <h3 style={{ fontSize: 22, fontWeight: 500, color: "white", marginBottom: 10 }}>Sporočilo poslano!</h3>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 15 }}>Odgovorili vam bomo v najkrajšem možnem času.</p>
              <motion.button
                onClick={() => {
                  setStatus("idle");
                  resetTurnstile();
                }}
                whileHover={{ scale: 1.03 }}
                style={{ marginTop: 28, background: "rgba(212,182,118,0.1)", border: `1px solid ${GOLD}40`, color: GOLD, padding: "10px 24px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                Novo sporočilo
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Ime in priimek</label>
                  <input
                    name="ime"
                    value={form.ime}
                    onChange={handleChange}
                    placeholder="Jana Novak"
                    maxLength={100}
                    style={inputBase}
                    onFocus={(e) => { e.target.style.borderColor = `${GOLD}60`; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>E-pošta</label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="jana@email.com"
                    maxLength={254}
                    style={inputBase}
                    onFocus={(e) => { e.target.style.borderColor = `${GOLD}60`; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Sporočilo</label>
                <textarea
                  name="sporocilo"
                  value={form.sporocilo}
                  onChange={handleChange}
                  placeholder="Vaše vprašanje ali sporočilo..."
                  rows={5}
                  maxLength={2000}
                  style={{ ...inputBase, resize: "vertical", lineHeight: 1.7 }}
                  onFocus={(e) => { e.target.style.borderColor = `${GOLD}60`; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {!siteKey ? (
                  <p style={{ fontSize: 13, color: "#fbbf24", margin: 0 }}>
                    Turnstile ni nastavljen. Dodajte `NEXT_PUBLIC_TURNSTILE_SITE_KEY` v okoljske spremenljivke.
                  </p>
                ) : (
                  <div ref={widgetContainerRef} style={{ minHeight: 65, alignSelf: "flex-start" }} />
                )}

                {turnstileError && (
                  <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>
                    {turnstileError}
                  </p>
                )}
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                <input
                  type="checkbox"
                  id="gdpr"
                  checked={gdpr}
                  onChange={(e) => setGdpr(e.target.checked)}
                  style={{
                    marginTop: 2,
                    width: 16,
                    height: 16,
                    accentColor: GOLD,
                    flexShrink: 0,
                    cursor: "pointer",
                  }}
                />
                <label htmlFor="gdpr" style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 1.65, cursor: "pointer" }}>
                  Strinjam se z{" "}
                  <Link href="/zasebnost" style={{ color: GOLD, textDecoration: "underline" }}>
                    obdelavo osebnih podatkov
                  </Link>{" "}
                  za namen odgovora na moje povpraševanje. Soglasje lahko kadarkoli prekličem z zahtevo na{" "}
                  <a href="mailto:info@ursljagora.si" style={{ color: GOLD }}>info@ursljagora.si</a>.
                </label>
              </div>

              {status === "error" && !turnstileError && (
                <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>
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
                    background: submitDisabled ? "rgba(212,182,118,0.25)" : status === "sending" ? "rgba(212,182,118,0.4)" : GOLD,
                    color: submitDisabled ? "rgba(17,16,8,0.4)" : "#111008",
                    fontWeight: 700,
                    padding: "13px 32px",
                    borderRadius: 999,
                    fontSize: 14,
                    letterSpacing: "0.02em",
                    border: "none",
                    cursor: submitDisabled ? "default" : "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.2s",
                  }}
                >
                  {status === "sending" ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                        style={{ display: "inline-block", width: 14, height: 14, border: "2px solid #11100840", borderTopColor: "#111008", borderRadius: "50%" }}
                      />
                      Pošiljam...
                    </>
                  ) : "Pošlji sporočilo →"}
                </motion.button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
