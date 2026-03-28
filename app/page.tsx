import SeasonsSection from "./components/SeasonsSection";
import Navbar from "./components/SeasonsSection";

export default function HomePage() {
  return (
    <main className="w-full">

{/* HERO */}
<section className="relative w-full h-screen overflow-hidden">
  <video
    src="/drone.mp4"
    autoPlay
    muted
    loop
    playsInline
    className="absolute inset-0 w-full h-full object-cover"
  />

  {/* Centered text */}
  <div className="absolute inset-0 flex items-center justify-center text-center px-6">
    <div>
      <p className="text-sm md:text-base font-light tracking-[0.35em] uppercase text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)]">
        Uršlja gora
      </p>

      <h1
        className="
          text-4xl md:text-6xl
          font-semibold
          text-white
          leading-tight
          tracking-[-0.05em]
          drop-shadow-[0_8px_24px_rgba(0,0,0,0.9)]
        "
        style={{ fontFamily: "var(--font-premium)" }}
      >
        Med nebom in tišino
      </h1>
    </div>
  </div>
</section>

{/* DOBRODOŠLI PANEL */}
<section className="bg-white py-24 px-6">
  <div className="max-w-3xl mx-auto text-center">
    <h2 className="text-4xl font-bold text-[var(--text-heading)] mb-6">
      Dobrodošli na Uršlji gori
    </h2>

    <p className="text-[var(--text-main)] text-lg leading-relaxed">
      Uršlja gora je ena najbolj prepoznavnih razglednih točk Koroške.
      Ponuja mir, naravo, svež zrak in poti, ki so primerne za vse –
      od družin do izkušenih pohodnikov. Na vrhu vas pričaka koča,
      domačnost in občutek, da ste za trenutek pobegnili iz vsakdana.
    </p>
  </div>
</section>

{/* AKTIVNOSTI – 3 kartice */}
<section className="py-24 px-6 bg-[var(--brand-light)]">
  <div className="max-w-4xl mx-auto text-center mb-16">
    <h2 className="text-4xl font-semibold text-[var(--text-heading)] tracking-tight">
      Kaj lahko doživiš v okolici
    </h2>
    <p className="text-[var(--text-main)] mt-4 text-lg leading-relaxed">
      Narava, razgledi, pohodi in domačnost – vse na enem mestu.
    </p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">

    {/* Pohodništvo */}
    <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden hover:shadow-md transition-shadow">
      <img src="/pohod.jpg" alt="Pohodništvo" className="w-full h-48 object-cover" />
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold text-[var(--text-heading)] mb-3 tracking-tight">
          Pohodništvo
        </h3>
        <p className="text-[var(--text-main)] leading-relaxed">
          Raznolike poti iz Kotlj, Naravskih ledin in Ivarčkega jezera – primerne za družine in izkušene pohodnike.
        </p>
      </div>
    </div>

    {/* Razgledi */}
    <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden hover:shadow-md transition-shadow">
      <img src="/razgled.jpg" alt="Razgledi" className="w-full h-48 object-cover" />
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold text-[var(--text-heading)] mb-3 tracking-tight">
          Razgledi in fotografija
        </h3>
        <p className="text-[var(--text-main)] leading-relaxed">
          Eden najlepših razgledov na Koroško, Pohorje in Savinjsko dolino. Popolno za sončne vzhode in zahode.
        </p>
      </div>
    </div>

    {/* Koča */}
    <div className="bg-white rounded-2xl shadow-sm border border-black/10 overflow-hidden hover:shadow-md transition-shadow">
      <img src="/koca.jpg" alt="Koča" className="w-full h-48 object-cover" />
      <div className="p-8 text-center">
        <h3 className="text-xl font-semibold text-[var(--text-heading)] mb-3 tracking-tight">
          Koča in domačnost
        </h3>
        <p className="text-[var(--text-main)] leading-relaxed">
          Topli obroki, čaj, sladice in prijeten kotiček za počitek po vzponu.
        </p>
      </div>
    </div>

  </div>
</section>


<SeasonsSection />


</main>
  );

  
}
