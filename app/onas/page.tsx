"use client";
import { useState } from "react";

function SimpleSlider() {
  const images = ["/cebel.jpg", "/knj.jpg", "/cerk.jpg"];
  const [index, setIndex] = useState(0);

  return (
    <div className="relative w-full overflow-hidden rounded-3xl shadow-xl">

      {/* SLIDE */}
      <div className="w-full h-[420px]">
        <img
          src={images[index]}
          className="w-full h-full object-cover rounded-3xl transition-opacity duration-500"
        />
      </div>

      {/* DOTS */}
      <div className="absolute bottom-4 w-full flex justify-center gap-3">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-[var(--brand)]" : "bg-white/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default function ONasPage() {
  return (
    <main className="w-full">

      {/* HERO – ostane tak kot je */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src="/onas-hero.jpg"
          className="absolute inset-0 w-full h-full object-cover"
          alt="O nas"
        />
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-6">
          <h1 className="text-6xl font-bold drop-shadow-lg tracking-tight">O nas</h1>
          <p className="mt-4 text-2xl max-w-2xl drop-shadow-lg">
            Spoznajte zgodbo, tradicijo in posebnosti Uršlje gore.
          </p>
        </div>
      </section>

      {/* CONTENT – minimalistično, pastelno, premium */}
      <section className="py-32 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-40">

          {/* BLOK 1 – Predstavitev */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
                Predstavitev
              </h2>
              <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
                Uršlja gora je ena najbolj prepoznavnih gora Koroške. Naša koča
                sprejema pohodnike, družine in ljubitelje narave že desetletja.
              </p>
              <a
                href="#zgodovina"
                className="text-[var(--brand)] text-xl font-semibold hover:underline"
              >
                Preberi več →
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src="/onas1.jpg" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* BLOK 2 – Zgodovina + CAROUSEL */}
          <div id="zgodovina" className="grid md:grid-cols-2 gap-16 items-center">
            
            {/* CAROUSEL */}
            <div className="order-2 md:order-1">
              <SimpleSlider />
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
                Zgodovina & zanimivosti
              </h2>
              <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
                Uršlja gora skriva številne zgodbe, kulturne posebnosti in naravne zanimivosti.
              </p>

              <ul className="space-y-4 text-xl text-[var(--brand)] font-medium">
                <li><a href="/o-nas/cebelnjak" className="hover:text-[var(--text-heading)]">• Čebelnjak</a></li>
                <li><a href="/o-nas/knjiznjica" className="hover:text-[var(--text-heading)]">• Knjižnjica</a></li>
                <li><a href="/o-nas/cerkvica" className="hover:text-[var(--text-heading)]">• Cerkvica sv. Uršule</a></li>
              </ul>
            </div>
          </div>

          {/* BLOK 3 – Jedilnik */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
                Jedilnik koče
              </h2>
              <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
                Oglejte si ponudbo domačih jedi, toplih obrokov in pijač.
              </p>
              <a href="/jedilnik" className="text-[var(--brand)] text-xl font-semibold hover:underline">
                Odpri jedilnik →
              </a>
            </div>

            <div className="rounded-3xl overflow-hidden shadow-xl">
              <img src="/meni2.jpg" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* BLOK 4 – Kontakt */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            

            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-semibold text-[var(--text-heading)] mb-6 tracking-tight">
                Kontakt
              </h2>
              <p className="text-[var(--text-main)] text-xl leading-relaxed mb-8">
                Vsi kontaktni podatki, lokacija in informacije na enem mestu.
              </p>
              <a href="/kontakt" className="text-[var(--brand)] text-xl font-semibold hover:underline">
                Odpri kontakt →
              </a>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
