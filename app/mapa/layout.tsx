import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pohodniška mapa",
  description:
    "Interaktivna mapa pohodniških poti na Uršljo goro – 6 označenih poti z GPS podatki, višinskimi profili in časom hoje. Načrtujte svoj pohod.",
  keywords: [
    "pohodniška mapa Uršlja gora",
    "pohodni GPS poti",
    "interaktivna karta Koroška",
    "poti na Uršljo goro",
    "Železarska pot",
    "Grofovska pot",
    "Ivarčko jezero pohod",
    "Žerjav pohod",
  ],
  openGraph: {
    title: "Pohodniška mapa – Dom na Uršlji gori",
    description:
      "Interaktivna mapa 6 pohodniških poti na Uršljo goro z GPS koordinatami, višinami in časi hoje.",
    url: "https://ursljagoradom.si/mapa",
  },
};

export default function MapaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
