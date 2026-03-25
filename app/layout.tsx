import "./globals.css";
import Navbar from "./components/Navbar";

export const metadata = {
  title: "Koča",
  description: "Spletna stran"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sl">
      <body className="bg-[#0f1414] text-white">
        <Navbar />
        <div className="pt-20">{children}</div>
      </body>
    </html>
  );
}
