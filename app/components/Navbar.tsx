export default function Navbar() {
  return (
    <nav className="w-full bg-black/20 backdrop-blur-md border-b border-white/10 fixed top-0 left-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo / ime */}
        <a href="/" className="text-2xl font-bold text-white hover:text-green-300 transition">
          Koča
        </a>

        {/* Navigacija */}
        <div className="flex items-center gap-8">
          <a
            href="/"
            className="text-gray-300 hover:text-white transition text-lg"
          >
            Domov
          </a>

          <a
            href="/aktualno"
            className="text-gray-300 hover:text-white transition text-lg"
          >
            Aktualno
          </a>

          <a
            href="/kontakt"
            className="text-gray-300 hover:text-white transition text-lg"
          >
            Kontakt
          </a>
        </div>
      </div>
    </nav>
  );
}
