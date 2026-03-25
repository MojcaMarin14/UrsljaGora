import Link from "next/link";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "20px",
        padding: "24px",
        background: "linear-gradient(180deg, #6e6f71 0%, #dbe5ef 100%)",
      }}
    >
      <h1 style={{ margin: 0, fontSize: "3rem", textAlign: "center" }}>
        Urslja Gora Project
      </h1>
      <p
        style={{
          maxWidth: "640px",
          margin: 0,
          textAlign: "center",
          fontSize: "1.1rem",
          color: "#4f5d6b",
        }}
      >
      </p>

      <Link
        href="/panoramas"
        style={{
          padding: "14px 26px",
          fontSize: "1.1rem",
          fontWeight: 700,
          textDecoration: "none",
          color: "#ffffff",
          backgroundColor: "#1f4f7a",
          borderRadius: "999px",
        }}
      >
        Open Panorama Gallery
      </Link>
    </main>
  );
}
