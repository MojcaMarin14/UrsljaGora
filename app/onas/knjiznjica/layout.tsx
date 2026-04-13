import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Knjižnica",
  description:
    "Planinska knjižnica v Domu na Uršlji gori – zbirka knjig in gradiv o Uršlji gori, Koroški in slovenskem planinstvu.",
  keywords: [
    "knjižnica Uršlja gora",
    "planinska literatura",
    "Dom na Uršlji gori",
    "koroška история",
    "planinska koča knjige",
  ],
  openGraph: {
    title: "Knjižnica – Dom na Uršlji gori",
    description:
      "Planinska knjižnica v Domu na Uršlji gori z zbirko o Koroški in slovenskem planinstvu.",
    url: "https://ursljagoradom.si/onas/knjiznjica",
  },
};

export default function KnjiznjicaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
