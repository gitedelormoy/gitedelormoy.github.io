import React from 'react';

export default function IntroSection() {
  return (
    <section id="decouvrir" className="py-24 md:py-32 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="section-label mb-4">Bienvenue</p>
        <h2 className="font-heading text-4xl md:text-6xl font-light text-foreground mb-8 leading-tight">
          Un cocon de charme<br />au cœur de la France
        </h2>
        <p className="font-body text-muted-foreground leading-relaxed text-lg max-w-2xl mx-auto mb-6">
          Découvrez la tranquillité à seulement cinquante mètres du village pittoresque de Saint Laurent.
          Suivez une petite route de campagne et empruntez l'allée majestueuse de marronniers menant au château.
        </p>
        <p className="font-body text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          La Maison de Gardien du Château de L'Ormoy est un joyau préservé, témoignant de l'histoire
          à travers les âges. Grâce à une restauration minutieuse, cette demeure est désormais un havre
          où chacun peut savourer une qualité de vie exceptionnelle.
        </p>

        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
          {[
            { value: '6', label: 'Couchages' },
            { value: '3', label: 'Chambres' },
            { value: '4★', label: 'Meublé tourisme' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-heading text-5xl font-light text-primary">{stat.value}</p>
              <p className="font-body text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
