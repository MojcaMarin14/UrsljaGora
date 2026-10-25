"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState } from "react";

const TURNSTILE_ACTION = "contact_form";
type ContactConfig = { available: boolean; localTest: boolean; siteKey: string | null };

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
  const [config, setConfig] = useState<ContactConfig | null>(null);
  const [sentLocally, setSentLocally] = useState(false);
  const [turnstileReady, setTurnstileReady] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileError, setTurnstileError] = useState("");
  const [deliveryError, setDeliveryError] = useState("");
  const widgetContainerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef        = useRef<string | null>(null);
  const siteKey = config?.siteKey || "";
  const showForm = status !== "sent";
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/kontakt", { cache: "no-store", signal: controller.signal })
      .then(async response => {
        if (!response.ok) throw new Error("Contact unavailable");
        const data = await response.json();
        if (!controller.signal.aborted) setConfig({ available: data.available === true, localTest: data.localTest === true, siteKey: typeof data.siteKey === "string" ? data.siteKey : null });
      })
      .catch(() => { if (!controller.signal.aborted) setConfig({ available: false, localTest: false, siteKey: null }); });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!showForm || !siteKey || !turnstileReady || !widgetContainerRef.current || widgetIdRef.current || !window.turnstile) return;
    widgetIdRef.current = window.turnstile.render(widgetContainerRef.current, {
      sitekey: siteKey,
      action: TURNSTILE_ACTION,
      theme: "light",
      size: "flexible",
      callback: (token) => { setTurnstileToken(token); setTurnstileError(""); },
      "error-callback":   () => { setTurnstileToken(""); setTurnstileError("Preverjanje ni uspelo. Poskusite znova."); },
      "expired-callback": () => { setTurnstileToken(""); setTurnstileError("Preverjanje je poteklo. Potrdite še enkrat."); },
    });
    return () => {
      if (widgetIdRef.current && window.turnstile) window.turnstile.remove(widgetIdRef.current);
      widgetIdRef.current = null;
    };
  }, [siteKey, turnstileReady, showForm]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetTurnstile = () => {
    setTurnstileToken(""); setTurnstileError("");
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending" || !form.ime.trim() || !form.email.trim() || !form.sporocilo.trim() || !gdpr || !config?.available) return;
    if (!config.localTest && !turnstileToken) { setStatus("error"); setTurnstileError("Potrdite, da niste robot."); return; }
    setStatus("sending"); setTurnstileError(""); setDeliveryError("");
    try {
      const res  = await fetch("/api/kontakt", { method: "POST", signal: AbortSignal.timeout(30000), headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ime: form.ime.trim(), email: form.email.trim(), sporocilo: form.sporocilo.trim(), gdpr, turnstileToken }) });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok === true) {
        setSentLocally(data.localTest === true);
        setStatus("sent"); setForm({ ime: "", email: "", sporocilo: "" }); setGdpr(false); resetTurnstile();
      } else {
        resetTurnstile(); setStatus("error"); setDeliveryError(data?.error ?? "Sporočila ni bilo mogoče poslati. Poskusite znova.");
      }
    } catch {
      resetTurnstile(); setStatus("error"); setDeliveryError("Povezava s strežnikom ni uspela. Poskusite znova.");
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    background: "var(--section-bg-white)",
    border: "1.5px solid var(--border-light)",
    borderRadius: 12,
    padding: "13px 16px",
    fontSize: 15,
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const submitDisabled = status === "sending" || !gdpr || !config?.available || (!config.localTest && (!turnstileToken || !siteKey));

  return (
    <div style={{ maxWidth: 720, margin: "0 auto" }}>
      {siteKey && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={() => setTurnstileReady(true)}
          onError={() => setTurnstileError("Preverjanja ni mogoče naložiti. Poskusite znova pozneje.")}
        />
      )}

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
        style={{
          background: "var(--section-bg-white)",
          borderRadius: 24,
          border: "1px solid var(--border-light)",
          padding: "44px 48px",
          boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
        }}
      >
        {status === "sent" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: "center", padding: "40px 0" }}
          >
            <div style={{ fontSize: 48, marginBottom: 20 }}>✉️</div>
            <h3 style={{ fontSize: 24, fontWeight: 500, color: "var(--heading)", letterSpacing: "-0.02em", marginBottom: 10 }}>
              {sentLocally ? "Sporočilo shranjeno v testni predal!" : "Sporočilo poslano!"}
            </h3>
            <p style={{ color: "var(--text-muted)", fontSize: 15, lineHeight: 1.7 }}>
              {sentLocally ? "To je lokalni preizkus. Sporočilo ni bilo poslano na pravi e-poštni naslov." : "Odgovorili vam bomo v najkrajšem možnem času."}
            </p>
            {sentLocally && <a href="/testna-posta/" target="_blank" rel="noopener noreferrer" style={{ display: "block", marginTop: 18, color: "var(--accent)", textDecoration: "underline" }}>Odpri testni predal</a>}
            <motion.button
              type="button"
              onClick={() => { setStatus("idle"); setDeliveryError(""); resetTurnstile(); }}
              whileHover={{ scale: 1.03 }}
              style={{
                marginTop: 28,
                background: "transparent",
                border: "1.5px solid var(--accent)",
                color: "var(--accent)",
                padding: "10px 28px",
                borderRadius: 999,
                fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                letterSpacing: "0.04em",
              }}
            >
              Novo sporočilo
            </motion.button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                { name: "ime", label: "Ime in priimek", placeholder: "Jana Novak", type: "text" },
                { name: "email", label: "E-pošta", placeholder: "jana@email.com", type: "email" },
              ].map((f) => (
                <div key={f.name}>
                  <label htmlFor={`contact-${f.name}`} style={{ display: "block", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--label)", fontWeight: 700, marginBottom: 8 }}>
                    {f.label}
                  </label>
                  <input
                    id={`contact-${f.name}`}
                    required
                    name={f.name}
                    type={f.type}
                    value={(form as any)[f.name]}
                    onChange={handleChange}
                    placeholder={f.placeholder}
                    maxLength={f.name === "email" ? 254 : 100}
                    style={inputBase}
                    onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                    onBlur={(e)  => { e.target.style.borderColor = "var(--border-light)"; }}
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="contact-message" style={{ display: "block", fontSize: 17, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--label)", fontWeight: 700, marginBottom: 8 }}>
                Sporočilo
              </label>
              <textarea
                id="contact-message"
                required
                name="sporocilo"
                value={form.sporocilo}
                onChange={handleChange}
                placeholder="Vaše vprašanje ali sporočilo..."
                rows={5}
                maxLength={2000}
                style={{ ...inputBase, resize: "vertical", lineHeight: 1.7 }}
                onFocus={(e) => { e.target.style.borderColor = "var(--accent)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "var(--border-light)"; }}
              />
            </div>

            <div>
              {!config ? <p role="status" style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Pripravljamo obrazec…</p>
                : !config.available ? <p role="status" style={{ fontSize: 13, color: "#d97706", margin: 0 }}>Pošiljanje trenutno ni na voljo. Prosimo, uporabite e-pošto ali telefon.</p>
                : config.localTest ? <p role="status" style={{ fontSize: 13, color: "var(--text-muted)", margin: 0 }}>Lokalni preizkus: sporočilo bo shranjeno samo v <a href="/testna-posta/" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "underline" }}>testni predal</a>.</p>
                : <div ref={widgetContainerRef} style={{ minHeight: 65 }} />}

              {turnstileError && (
                <p role="alert" style={{ fontSize: 13, color: "#dc2626", margin: "8px 0 0" }}>{turnstileError}</p>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <input
                type="checkbox" id="gdpr" checked={gdpr}
                onChange={(e) => setGdpr(e.target.checked)}
                style={{ marginTop: 2, width: 16, height: 16, accentColor: "var(--accent)", flexShrink: 0, cursor: "pointer" }}
              />
              <label htmlFor="gdpr" style={{ fontSize: 17, color: "var(--text-muted)", lineHeight: 1.65, cursor: "pointer" }}>
                Strinjam se z{" "}
                <Link href="/politikaZasebnosti" style={{ color: "var(--accent)", textDecoration: "underline" }}>
                  obdelavo osebnih podatkov
                </Link>{" "}
                za namen odgovora na moje povpraševanje. Soglasje lahko kadarkoli prekličem z zahtevo na{" "}
                <a href="mailto:juvan.nejc2@gmail.com" style={{ color: "var(--accent)" }}>juvan.nejc2@gmail.com</a>.
              </label>
            </div>

            {deliveryError && <p role="alert" style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>{deliveryError}</p>}

            {status === "error" && !turnstileError && !deliveryError && (
              <p style={{ fontSize: 13, color: "#dc2626", margin: 0 }}>
                Prišlo je do napake. Poskusite znova ali nas kontaktirajte neposredno.
              </p>
            )}

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
              <motion.button
                type="submit"
                disabled={submitDisabled}
                whileHover={{ scale: submitDisabled ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: submitDisabled ? "var(--border-light)" : "var(--accent)",
                  color: submitDisabled ? "var(--text-muted)" : "white",
                  border: "none", padding: "13px 32px", borderRadius: 999,
                  fontSize: 14, fontWeight: 600,
                  cursor: submitDisabled ? "not-allowed" : "pointer",
                  fontFamily: "inherit", letterSpacing: "0.04em",
                  transition: "background 0.2s, color 0.2s",
                }}
              >
                {status === "sending" ? "Pošiljam…" : "Pošlji sporočilo"}
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
