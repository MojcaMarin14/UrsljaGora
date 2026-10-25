import { getSiteUrl } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aktualno",
  description:
    "Novice, dogodki in posebne ponudbe Doma na Uršlji gori. Ostanite v stiku z vsem, kar se dogaja na Uršlji gori.",
  keywords: [
    "novice Uršlja gora",
    "dogodki planinska koča",
    "ponudbe Dom na Uršlji gori",
    "aktualno Koroška",
  ],
  openGraph: {
    title: "Aktualno – Dom na Uršlji gori",
    description:
      "Novice, dogodki in posebne ponudbe Doma na Uršlji gori. Vse aktualno z Uršlje gore.",
    url: `${getSiteUrl()}/aktualno`,
  },
};

export default function AktualnoLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
