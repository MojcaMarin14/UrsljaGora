"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const GOLD = "#d4b676";

// Dodaj to komponento v kontakt/page.tsx — takoj pred <Footer dark />

export function ContactForm() {
  const [form, setForm] = useState({ ime: "", email: "", sporocilo: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!form.ime || !form.email || !form.sporocilo) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ ime: "", email: "", sporocilo: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
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

  return (
    <section style={{ padding: "0 24px 96px", background: "linear-gradient(to bottom, #0b0b0b, black)" }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.75 }}
        style={{ maxWidth: 720, margin: "0 auto" }}
      >
        {/* Header */}
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
            Za rezervacije, vprašanja o dostopih ali dejavnostih — odgovorimo v najkrajšem možnem času.
          </p>
        </div>

        {/* Form card */}
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
                onClick={() => setStatus("idle")}
                whileHover={{ scale: 1.03 }}
                style={{ marginTop: 28, background: "rgba(212,182,118,0.1)", border: `1px solid ${GOLD}40`, color: GOLD, padding: "10px 24px", borderRadius: 999, fontSize: 13, cursor: "pointer", fontFamily: "inherit" }}
              >
                Novo sporočilo
              </motion.button>
            </motion.div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

              {/* Ime + Email v vrsti */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Ime in priimek</label>
                  <input
                    name="ime"
                    value={form.ime}
                    onChange={handleChange}
                    placeholder="Jana Novak"
                    style={inputBase}
                    onFocus={e => e.target.style.borderColor = `${GOLD}60`}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
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
                    style={inputBase}
                    onFocus={e => e.target.style.borderColor = `${GOLD}60`}
                    onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                  />
                </div>
              </div>

              {/* Sporočilo */}
              <div>
                <label style={{ display: "block", fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.35)", marginBottom: 8 }}>Sporočilo</label>
                <textarea
                  name="sporocilo"
                  value={form.sporocilo}
                  onChange={handleChange}
                  placeholder="Vaše vprašanje ali sporočilo..."
                  rows={5}
                  style={{ ...inputBase, resize: "vertical", lineHeight: 1.7 }}
                  onFocus={e => e.target.style.borderColor = `${GOLD}60`}
                  onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <p style={{ fontSize: 13, color: "#f87171", margin: 0 }}>
                  Prišlo je do napake. Poskusite znova ali nas kontaktirajte neposredno.
                </p>
              )}

              {/* Submit */}
              <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 4 }}>
                <motion.button
                  onClick={handleSubmit}
                  disabled={status === "sending"}
                  whileHover={{ scale: status === "sending" ? 1 : 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: status === "sending" ? "rgba(212,182,118,0.4)" : GOLD,
                    color: "#111008",
                    fontWeight: 700, padding: "13px 32px", borderRadius: 999,
                    fontSize: 14, letterSpacing: "0.02em",
                    border: "none", cursor: status === "sending" ? "default" : "pointer",
                    fontFamily: "inherit",
                    transition: "background 0.2s",
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
