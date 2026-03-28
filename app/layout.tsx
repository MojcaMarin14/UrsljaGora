import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Koča",
  description: "Spletna stran"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className="bg-[var(--background)] text-[var(--foreground)] m-0 p-0">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
