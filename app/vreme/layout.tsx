import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vreme",
  description:
    "Vremenska napoved za Uršljo goro (1699 m) – temperatura, padavine in sneg. Preverite vreme pred pohodom na Uršljo goro.",
  keywords: [
    "vreme Uršlja gora",
    "vremenska napoved gore",
    "temperatura vrh Koroška",
    "sneg Uršlja gora",
    "pohod vreme",
  ],
  openGraph: {
    title: "Vreme na Uršlji gori – Dom na Uršlji gori",
    description:
      "Aktualna vremenska napoved za vrh Uršlje gore (1699 m). Temperatura, padavine in snežne razmere.",
    url: "https://ursljagoradom.si/vreme",
  },
};

export default function VremeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
