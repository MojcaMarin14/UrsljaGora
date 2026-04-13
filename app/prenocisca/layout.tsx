import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prenočišča",
  description:
    "Prenočišča v Domu na Uršlji gori – sobice in skupne spalnice za pohodnike na 1680 m. Rezervirajte nočitev na vrhu Koroške.",
  keywords: [
    "prenočišča Uršlja gora",
    "planinska koča nočitev",
    "Dom na Uršlji gori sobe",
    "pohod z nočitvijo",
    "Koroška gorska prenočišča",
    "rezervacija koče",
  ],
  openGraph: {
    title: "Prenočišča – Dom na Uršlji gori",
    description:
      "Sobice in skupne spalnice za pohodnike na 1680 m. Nočitev v Domu na Uršlji gori v srcu Koroške.",
    url: "https://ursljagoradom.si/prenocisca",
  },
};

export default function PrenociscaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
