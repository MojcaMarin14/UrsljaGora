import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Spoznajte Dom na Uršlji gori – planinsko kočo na 1680 m nadmorske višine v Koroški regiji. Zgodovina, ponudba hrane in pijače ter gostoljubna ekipa.",
  keywords: [
    "Dom na Uršlji gori",
    "planinska koča",
    "o nas",
    "Koroška",
    "Uršlja gora",
    "restavracija v gorah",
  ],
  openGraph: {
    title: "O nas – Dom na Uršlji gori",
    description:
      "Spoznajte Dom na Uršlji gori na 1680 m. Planinska koča z domačo kuhinjo, bogato zgodovino in čudovitimi razgledi na Karavanke.",
    url: "https://ursljagoradom.si/onas",
  },
};

export default function OnasLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
