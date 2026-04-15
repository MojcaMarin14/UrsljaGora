import "./globals.css";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "./components/CookieConsent";

export const metadata = {
  title: {
    default: "Dom na Uršlji gori – Planinska koča | Koroška",
    template: "%s | Dom na Uršlji gori",
  },
  description:
    "Obiščite Dom na Uršlji gori (1699 m) v srcu Koroške. Planinska koča, prenočišča, pohodniške poti in čudoviti razgledi na Karavankah.",
  keywords: [
    "Uršlja gora",
    "Dom na Uršlji gori",
    "planinska koča",
    "pohod Koroška",
    "prenočišče gore",
    "Cerkev sv. Uršule",
    "pohodniške poti",
    "Karavanke",
    "Slovenija",
  ],
  openGraph: {
    siteName: "Dom na Uršlji gori",
    locale: "sl_SI",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className="bg-[var(--background)] text-[var(--foreground)] m-0 p-0">
        <Navbar />
        {children}
        {/* Vercel Analytics – spremljanje obiskov, GDPR-skladno, brez piškotkov */}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
