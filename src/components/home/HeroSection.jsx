import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496829/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--4-min_ks62ta.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p
          className="font-body text-white/80 text-xs tracking-[0.3em] uppercase mb-4 opacity-0 animate-[fadeUp_0.8s_ease_0.3s_forwards]"
        >
          Meublé de tourisme ★★★★
        </p>

        <h1
          className="font-heading text-6xl md:text-8xl lg:text-9xl font-light text-white leading-tight opacity-0 animate-[fadeUp_1s_ease_0.5s_forwards]"
        >
          Gîte de l'Ormoy
        </h1>

        <p
          className="font-body text-white/80 text-base md:text-lg max-w-xl mt-6 leading-relaxed opacity-0 animate-[fadeUp_1s_ease_0.7s_forwards]"
        >
          Un havre de paix au cœur de la Sologne & du Berry,<br />
          où le charme champêtre rencontre le confort moderne
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 opacity-0 animate-[fadeUp_1s_ease_0.9s_forwards]">
          <a
            href="/reserver"
            className="px-8 py-3.5 bg-white text-foreground font-body font-medium text-sm rounded-full hover:bg-white/90 transition-all duration-300 tracking-wide shadow-lg"
          >
            Réserver un séjour
          </a>
          <a
            href="/le-gite"
            className="px-8 py-3.5 border border-white/40 text-white font-body font-medium text-sm rounded-full hover:bg-white/10 transition-all duration-300 tracking-wide"
          >
            Découvrir le gîte
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 animate-bounce">
        <ChevronDown className="w-6 h-6" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
