import Link from "next/link";
import Footer from "@/app/components/Footer";

const GOLD = "var(--accent)";
const DARK = "var(--heading)";

export default function NotFound() {
  return (
    <main style={{ width: "100%", backgroundColor: "var(--section-bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      <section style={{
        background: DARK,
        padding: "140px 24px 100px",
        textAlign: "center",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.5)" }} />
          <span className="hero-subtitle" style={{ fontSize: 11, letterSpacing: "0.26em", textTransform: "uppercase", fontWeight: 500 }}>
            Uršlja gora · Koroška
          </span>
          <div style={{ width: 28, height: 1, background: "rgba(201,169,110,0.5)" }} />
        </div>

        <p style={{ fontSize: "clamp(72px, 14vw, 140px)", fontWeight: 700, color: GOLD, margin: "0 0 8px", lineHeight: 1 }}>
          404
        </p>

        <h1 className="hero-title" style={{
          fontSize: "clamp(24px, 4vw, 44px)",
          fontWeight: 500,
          letterSpacing: "-0.03em",
          lineHeight: 1.2,
          margin: "0 0 16px",
        }}>
          Stran ni bila <span style={{ color: GOLD }}>najdena</span>
        </h1>

        <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 420, lineHeight: 1.7, margin: "0 0 40px" }}>
          Stran, ki jo iščete, ne obstaja ali je bila premaknjena.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            padding: "14px 36px",
            background: GOLD,
            color: "#fff",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            letterSpacing: "0.04em",
          }}
        >
          Nazaj na začetno stran
        </Link>
      </section>

      <Footer />
    </main>
  );
}
