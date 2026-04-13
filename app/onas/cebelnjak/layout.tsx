import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Čebelnjak",
  description:
    "Čebelnjak pri Domu na Uršlji gori – odkrijte svet čebel in domači med na 1680 m nadmorske višine v Koroški regiji.",
  keywords: [
    "čebelnjak Uršlja gora",
    "domači med Koroška",
    "čebelarstvo planinska koča",
    "Dom na Uršlji gori",
  ],
  openGraph: {
    title: "Čebelnjak – Dom na Uršlji gori",
    description:
      "Čebelnjak in domači med pri Domu na Uršlji gori na 1680 m. Odkrijte svet čebel v srcu Koroške.",
    url: "https://ursljagoradom.si/onas/cebelnjak",
  },
};

export default function CebelnjaksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
