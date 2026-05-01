import "./globals.css";
import Navbar from "./components/Navbar";
import { Analytics } from "@vercel/analytics/react";
import CookieConsent from "./components/CookieConsent";
import GuestBook from "./components/GuestBook";

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
    <html lang="sl" data-theme="dark">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t);}catch(e){}})();` }} />
      </head>
      <body className="m-0 p-0" style={{ backgroundColor: "var(--page-bg)", color: "var(--text-primary)" }}>
        <Navbar />
        {children}
        <Analytics />
        <CookieConsent />
        <GuestBook />
      </body>
    </html>
  );
}
