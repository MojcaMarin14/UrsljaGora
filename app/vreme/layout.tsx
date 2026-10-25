import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vreme",
  description:
    "Vremenska napoved pri Domu na Uršlji gori (1680 m) – temperatura, veter, padavine in nov sneg. Preverite vreme pred pohodom na Uršljo goro.",
  keywords: [
    "vreme Uršlja gora",
    "vremenska napoved gore",
    "temperatura Uršlja gora Koroška",
    "sneg Uršlja gora",
    "pohod vreme",
  ],
  openGraph: {
    title: "Vreme na Uršlji gori – Dom na Uršlji gori",
    description:
      "Aktualna vremenska napoved pri Domu na Uršlji gori (1680 m). Temperatura, veter, sunki, padavine in nov sneg.",
    url: `${getSiteUrl()}/vreme`,
  },
};

export default function VremeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
