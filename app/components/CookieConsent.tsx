"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const COOKIE_KEY = "urslja_cookie_consent";

export default function CookieConsent() {
  const [status, setStatus] = useState<"loading" | "show" | "hidden">("loading");

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    setStatus(saved ? "hidden" : "show");
  }, []);

  function handleAccept() {
    localStorage.setItem(COOKIE_KEY, "accepted");
    setStatus("hidden");
  }

  function handleDecline() {
    localStorage.setItem(COOKIE_KEY, "declined");
    setStatus("hidden");
  }

  if (status !== "show") return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      left: "50%",
      transform: "translateX(-50%)",
      zIndex: 99999,
      width: "min(480px, calc(100vw - 32px))",
      background: "#fff",
      borderRadius: 16,
      boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
      padding: "24px 28px",
      border: "1px solid rgba(0,0,0,0.07)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>🍪</span>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#2c2420" }}>Piškotki</span>
      </div>

      <p style={{ fontSize: 13, color: "#6b6460", lineHeight: 1.7, margin: "0 0 20px" }}>
        Ta spletna stran uporablja piškotke za analitiko obiskov in shranjevanje vaših nastavitev.
        Podatki so anonimni in ne vsebujejo osebnih informacij.{" "}
        <Link href="/politikaZasebnosti" style={{ color: "var(--accent)", textDecoration: "underline" }}>
          Več o zasebnosti →
        </Link>
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        <button
          onClick={handleAccept}
          style={{
            flex: 1,
            padding: "11px 0",
            background: "var(--accent)",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Sprejmem
        </button>
        <button
          onClick={handleDecline}
          style={{
            flex: 1,
            padding: "11px 0",
            background: "transparent",
            color: "#6b6460",
            border: "1.5px solid #ddd",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          Zavrnem
        </button>
      </div>
    </div>
  );
}
