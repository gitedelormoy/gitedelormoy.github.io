import React from 'react';

export default function HeroSection() {
  return (
    <section className="relative min-h-[100dvh] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-[1.02]"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dpgmwola2/image/upload/q_auto/f_auto/v1775496829/Gi%CC%82te_de_l_Ormoy_-_Photos_2023-Le_Gi%CC%82te_de_l_Ormoy--4-min_ks62ta.jpg)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="relative z-10 min-h-[100dvh] flex flex-col justify-end px-8 md:px-16 lg:px-24 pb-20 md:pb-24">
        <div className="max-w-2xl">
          <p className="font-body text-white/50 text-[11px] tracking-[0.25em] uppercase mb-6">
            Sologne {'&'} Berry — 4 étoiles
          </p>
          <h1 className="font-heading font-light text-white leading-[0.95] mb-8">
            <span className="block text-5xl md:text-7xl lg:text-8xl">Le Gîte</span>
            <span className="block text-5xl md:text-7xl lg:text-8xl italic text-white/90">de l'Ormoy</span>
          </h1>
          <p className="font-body text-white/65 text-sm md:text-base max-w-sm leading-relaxed mb-10">
            Un havre de paix au cœur de la France, où le charme champêtre rencontre le confort moderne.
          </p>
          <div className="flex items-center gap-6">
            
              href="/reserver"
              className="px-7 py-3 bg-white text-stone-900 font-body font-medium text-sm rounded-full hover:bg-white/90 transition-all duration-300 tracking-wide"
            >
              Réserver
            </a>
            
              href="/le-gite"
              className="font-body text-white/70 text-sm hover:text-white transition-colors duration-300 tracking-wide underline underline-offset-4 decoration-white/30 hover:decoration-white/60"
            >
              Découvrir le gîte
            </a>
          </div>
        </div>
      </div>
      <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col items-center gap-4">
        <div className="w-px h-16 bg-white/20" />
        <p
          className="font-body text-white/30 text-[10px] tracking-[0.3em] uppercase"
          style={{ writingMode: 'vertical-rl' }}
        >
          Saint-Laurent
        </p>
        <div className="w-px h-16 bg-white/20" />
      </div>
    </section>
  );
}
