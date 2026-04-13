import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jedilnik",
  description:
    "Jedilnik Doma na Uršlji gori – domača planinska kuhinja z lokalnimi specialitetami. Topla hrana, pijača in sladice na 1680 m nadmorske višine.",
  keywords: [
    "jedilnik",
    "Dom na Uršlji gori",
    "planinska hrana",
    "koroška kuhinja",
    "gostilna v gorah",
    "malica na izletu",
  ],
  openGraph: {
    title: "Jedilnik – Dom na Uršlji gori",
    description:
      "Domača planinska kuhinja na 1680 m. Topla hrana, lokalne specialitete in okrepčila za pohodnike na Uršlji gori.",
    url: "https://ursljagoradom.si/onas/jedilnik",
  },
};

export default function JedilnikLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
