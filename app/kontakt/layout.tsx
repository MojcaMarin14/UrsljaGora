import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Kontaktirajte Dom na Uršlji gori – telefonska številka, e-pošta in lokacija. Rezervacije sob in informacije o delovnem času.",
  keywords: [
    "kontakt Dom na Uršlji gori",
    "rezervacija planinska koča",
    "telefonska številka koča",
    "Uršlja gora informacije",
  ],
  openGraph: {
    title: "Kontakt – Dom na Uršlji gori",
    description:
      "Stopite v stik z Domom na Uršlji gori. Rezervacije, informacije o delovnem času in lokacija.",
    url: "https://ursljagoradom.si/kontakt",
  },
};

export default function KontaktLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
