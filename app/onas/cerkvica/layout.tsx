import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cerkev sv. Uršule",
  description:
    "Cerkev sv. Uršule na Uršlji gori (1699 m) – najvišje ležeča cerkev v Sloveniji. Odkrijte njeno bogato zgodovino, arhitekturo in duhovno vrednost.",
  keywords: [
    "Cerkev sv. Uršule",
    "Uršlja gora",
    "najvišja cerkev Slovenija",
    "romanje",
    "Koroška",
    "sakralna arhitektura",
  ],
  openGraph: {
    title: "Cerkev sv. Uršule – Dom na Uršlji gori",
    description:
      "Najvišje ležeča cerkev v Sloveniji na vrhu Uršlje gore (1699 m). Zgodovinska romarska točka v srcu Koroške.",
    url: "https://ursljagoradom.si/onas/cerkvica",
  },
};

export default function CerkvicaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
