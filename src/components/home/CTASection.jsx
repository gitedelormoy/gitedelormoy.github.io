
import React from 'react';

export default function CTASection() {
  return (
    <section className="relative py-32 px-6 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://www.gitedelormoy.fr/wp-content/uploads/2015/02/Gîte-de-lOrmoy-Photos-2023-Le-Gîte-de-lOrmoy-20.jpg)",
        }}
      >
        <div className="absolute inset-0 bg-primary/75" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center text-primary-foreground">
        <p className="font-body text-primary-foreground/70 text-xs tracking-[0.3em] uppercase mb-4">
          Disponibilités
        </p>
        <h2 className="font-heading text-4xl md:text-6xl font-light mb-6">
          Prêt pour votre escapade ?
        </h2>
        <p className="font-body text-primary-foreground/80 leading-relaxed mb-10 max-w-xl mx-auto">
          Contactez-nous pour vérifier les disponibilités et organiser votre séjour
          sur mesure au cœur de la Sologne.
        </p>
        <a
          href="/reserver"
          className="inline-block px-10 py-4 bg-white text-foreground rounded-full font-body font-medium tracking-wide hover:bg-white/90 transition-all duration-300 shadow-lg text-sm"
        >
          Demander une réservation
        </a>
      </div>
    </section>
  );
}
