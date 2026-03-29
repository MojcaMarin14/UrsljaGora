import Link from "next/link";
import { notFound } from "next/navigation";

import MarzipanoViewer from "@/components/MarzipanoViewer";
import { getPanoramaBySlug } from "@/lib/panoramas";

export default async function PanoramaViewerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const panorama = await getPanoramaBySlug(slug);

  if (!panorama) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#09111b",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "18px 24px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        }}
      >
        <div>
          <Link
            href="/panoramas"
            style={{
              display: "inline-block",
              marginBottom: "8px",
              color: "#93c5fd",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Back to gallery
          </Link>

          <h1 style={{ margin: 0, fontSize: "1.5rem" }}>
            {panorama.title}
          </h1>
        </div>

        <p
          style={{
            margin: 0,
            maxWidth: "420px",
            color: "rgba(255, 255, 255, 0.75)",
            textAlign: "right",
          }}
        >
          Click and drag inside the image to look around the scene.
        </p>
      </div>

      <div style={{ height: "calc(100vh - 95px)" }}>
        <MarzipanoViewer imageUrl={panorama.imageUrl} />
      </div>
    </main>
  );
}