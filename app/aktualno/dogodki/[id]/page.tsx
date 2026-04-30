import Footer from "@/app/components/Footer";
import { fetchAPI, getStrapiMedia } from "@/lib/api";
import Image from "next/image";

const GOLD = "#c9a96e";
const CREAM = "#f7f4ef";
const DARK = "#111008";
const WARM = "#1a1812";

export default async function DogodekDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await fetchAPI(`dogodkis?filters[id][$eq]=${id}&populate=*`);
  const dogodek = res.data?.[0];

  if (!dogodek) {
    return (
      <main style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: CREAM }}>
        <div style={{ textAlign: "center", padding: "0 24px" }}>
          <p style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, fontWeight: 600, marginBottom: 16 }}>
            404
          </p>
          <h1 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 500, color: DARK, letterSpacing: "-0.025em" }}>
            Dogodek ni bil najden
          </h1>
          <a href="/aktualno/dogodki" style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 28, color: GOLD, fontSize: 15, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
            ← Nazaj na dogodke
          </a>
        </div>
      </main>
    );
  }

  const a = dogodek;
  const img = a.slika?.[0]?.url ?? null;

  const formattedDate = a.datum
    ? new Date(a.datum).toLocaleString("sl-SI", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <main style={{ width: "100%", backgroundColor: CREAM, overflowX: "hidden" }}>

      {/* HERO */}
      <section style={{
        position: "relative",
        height: img ? "65vh" : "40vh",
        minHeight: 400,
        overflow: "hidden",
        background: DARK,
      }}>
        {img && (
          <>
            <Image
              src={getStrapiMedia(img)}
              alt={a.naslov}
              fill
              priority
              sizes="100vw"
              quality={85}
              style={{ objectFit: "cover", opacity: 0.35 }}
            />
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(to bottom, rgba(17,16,8,0.5) 0%, rgba(17,16,8,0.92) 100%)",
            }} />
          </>
        )}
        {!img && (
          <div style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(135deg, ${DARK} 0%, ${WARM} 100%)`,
          }} />
        )}

        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }} />

        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 clamp(24px, 6vw, 80px) 56px",
          zIndex: 10,
        }}>
          <nav style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[
              { label: "Domov", href: "/" },
              { label: "Aktualno", href: "/aktualno" },
              { label: "Dogodki", href: "/aktualno/dogodki" },
            ].map((crumb, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <a href={crumb.href} style={{
                  fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase",
                  color: "rgba(201,169,110,0.7)", textDecoration: "none", fontWeight: 500,
                }}>
                  {crumb.label}
                </a>
                <span style={{ color: "rgba(201,169,110,0.35)", fontSize: 13 }}>›</span>
              </span>
            ))}
            <span style={{ fontSize: 13, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(201,169,110,0.95)", fontWeight: 600 }}>
              {a.naslov?.slice(0, 30)}{a.naslov?.length > 30 ? "…" : ""}
            </span>
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
            <div style={{ width: 32, height: 2, background: GOLD, flexShrink: 0 }} />
            <span style={{ fontSize: 13, letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, fontWeight: 700 }}>
              Dogodek
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(38px, 6vw, 80px)",
            fontWeight: 500, color: "white",
            letterSpacing: "-0.03em", lineHeight: 1.08,
            margin: 0, maxWidth: 860,
          }}>
            {a.naslov}
          </h1>

          {formattedDate && (
            <p style={{ marginTop: 20, fontSize: 16, color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>
              📅 {formattedDate}
            </p>
          )}
        </div>
      </section>

      {/* VSEBINA */}
      <section style={{ backgroundColor: CREAM, padding: "72px clamp(24px, 6vw, 80px) 100px" }}>
        <div style={{ maxWidth: 780, margin: "0 auto" }}>

          {a.opis && (
            <div style={{
              fontSize: "clamp(17px, 2vw, 21px)",
              color: "rgba(17,16,8,0.72)",
              lineHeight: 1.9,
              whiteSpace: "pre-line",
              fontWeight: 400,
            }}>
              {a.opis}
            </div>
          )}

          <div style={{
            width: "100%", height: 1,
            background: "rgba(17,16,8,0.08)",
            margin: "64px 0 48px",
          }} />

          <a
            href="/aktualno/dogodki"
            style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              color: DARK, fontSize: 15, fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              textDecoration: "none",
              padding: "16px 32px",
              border: "2px solid rgba(17,16,8,0.15)",
              borderRadius: 999,
            }}
          >
            ← Vsi dogodki
          </a>
        </div>
      </section>

      <Footer dark />
    </main>
  );
}