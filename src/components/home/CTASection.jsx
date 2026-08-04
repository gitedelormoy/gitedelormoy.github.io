import React from 'react';

export default function CTASection() {
  return (
    <section className="relative py-32 md:py-40 px-8 md:px-16 lg:px-24 overflow-hidden bg-foreground">

      {/* Texture subtile */}
      <div className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">

          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.05]">
            Prêt pour<br />
            <span className="italic text-white/70">votre escapade ?</span>
          </h2>

          <div className="space-y-8">
            <p className="font-body text-white/50 leading-relaxed text-sm max-w-sm">
              Contactez-nous pour vérifier les disponibilités et organiser votre séjour sur mesure au cœur de la Sologne.
            </p>
            <div className="flex items-center gap-6">
              
                href="/reserver"
                className="px-7 py-3 bg-white text-stone-900 font-body font-medium text-sm rounded-full hover:bg-white/90 transition-all duration-300 tracking-wide"
              >
                Réserver
              </a>
              
                <a href="mailto:info@gitedelormoy.fr"
                className="font-body text-white/40 text-sm hover:text-white transition-colors duration-300 tracking-wide underline underline-offset-4 decoration-white/20 hover:decoration-white/50"
              >
                Nous écrire
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
