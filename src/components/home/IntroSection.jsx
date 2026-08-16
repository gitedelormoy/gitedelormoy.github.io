import React from 'react';

export default function IntroSection() {
  return (
    <section id="decouvrir" className="py-28 md:py-36 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-end">

          {/* Texte gauche */}
          <div>
            <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light text-foreground leading-[1.05] mb-10">
              Un cocon de charme<br />
              <span className="italic text-primary">au cœur de la France</span>
            </h2>
            
              <a href="/le-gite"
              className="inline-flex items-center gap-3 font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300 tracking-wide group"
            >
              <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-12" />
              Découvrir le gîte
            </a>
          </div>

          {/* Texte droit */}
          <div className="space-y-5">
            <p className="font-body text-foreground/70 leading-relaxed text-base">
              À cinquante mètres du village de Saint Laurent, une petite route de campagne mène à la majestueuse allée de marronniers du château de l'Ormoy.
            </p>
            <p className="font-body text-foreground/60 leading-relaxed text-sm">
              La Maison de Gardien, minutieusement restaurée, est un joyau préservé où chacun peut savourer une qualité de vie exceptionnelle — entre histoire et confort contemporain.
            </p>
          </div>
        </div>

        {/* Stats — ligne fine */}
        <div className="mt-20 pt-10 border-t border-border grid grid-cols-3 gap-0">
          {[
            { value: '6', label: 'Couchages' },
            { value: '3', label: 'Chambres' },
            { value: '4★', label: 'Meublé de tourisme' },
          ].map((stat, i) => (
            <div key={i} className={`py-6 ${i > 0 ? 'border-l border-border pl-8 md:pl-12' : ''}`}>
              <p className="font-heading text-4xl md:text-5xl font-light text-foreground">{stat.value}</p>
              <p className="font-body text-xs text-muted-foreground mt-2 tracking-wide uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
