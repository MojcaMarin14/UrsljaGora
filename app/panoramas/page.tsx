import { getPanoramas } from "@/lib/panoramas";
import Image from "next/image";
import Link from "next/link";

//import { panoramas } from "@/lib/panoramas";

export default async function PanoramaPage() {
  const panoramas = await getPanoramas();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "48px 24px",
        background: "linear-gradient(180deg, #f6f8fb 0%, #e8edf3 100%)",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: "32px" }}>
          <Link
            href="/"
            style={{
              display: "inline-block",
              marginBottom: "16px",
              color: "#1f4f7a",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to home
          </Link>

          <h1 style={{ fontSize: "2.5rem", margin: "0 0 12px" }}>
            Panorama Gallery
          </h1>

          <p style={{ margin: 0, fontSize: "1.05rem", color: "#4f5d6b" }}>
            Choose one of the available panorama images to open it in the
            interactive 360 viewer.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
            alignItems: "stretch",
          }}
        >
          {panoramas.map((panorama) => (
            <Link
              key={panorama.slug}
              href={`/panoramas/${panorama.slug}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                backgroundColor: "#ffffff",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 18px 45px rgba(28, 46, 66, 0.12)",
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <div style={{ position: "relative", aspectRatio: "16 / 9" }}>
                <Image
                   src={panorama.imageUrl}
                  alt={panorama.title || "Panorama image"} //alt image fallback ce ni definiran v cms 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  style={{ objectFit: "cover" }}
                  unoptimized //strapi image URLs are not compatible with Nextjs img optimization??
                />
              </div>

              <div
                style={{
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: "260px",
                }}
              >
                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "1.2rem",
                    lineHeight: "1.4",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "2.8em",
                  }}
                >
                  {panorama.title}
                </h2>

                <p
                  style={{
                    margin: 0,
                    color: "#5d6a76",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    minHeight: "3em",
                  }}
                >
                  {panorama.description}
                </p>

                <span
                  style={{
                    display: "inline-block",
                    marginTop: "auto",
                    alignSelf: "flex-start",
                    padding: "10px 16px",
                    borderRadius: "999px",
                    backgroundColor: "#1f4f7a",
                    color: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  Open in 360
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
