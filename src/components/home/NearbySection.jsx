import React from 'react';

const highlights = [
  { emoji: '⛪', label: 'Bourges', sublabel: '~30 min · Cité médiévale classée UNESCO' },
  { emoji: '🦁', label: 'Zoo de Beauval', sublabel: "~1h · L'un des plus beaux zoos de France" },
  { emoji: '🏰', label: 'Châteaux de la Loire', sublabel: '~1h30 · Chambord, Chenonceau...' },
  { emoji: '🌲', label: 'Sologne', sublabel: '~20 min · Forêts, étangs, randonnées' },
  { emoji: '🎣', label: 'Pêche & Nature', sublabel: 'Étangs privés à proximité' },
  { emoji: '🚴', label: 'Véloroute Berry', sublabel: 'Pistes cyclables depuis le gîte' },
];

export default function NearbySection() {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Explorer</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">Aux alentours</h2>
          <p className="font-body text-muted-foreground mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Idéalement situé au cœur de la France, le Gîte de l'Ormoy est une base parfaite
            pour explorer la Sologne, le Berry et bien plus encore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Map embed */}
          <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-96">
            <iframe
              title="Localisation Gîte de l'Ormoy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=1.7%2C47.0%2C2.5%2C47.4&layer=mapnik&marker=47.2012%2C2.1245"
              className="w-full h-full"
              loading="lazy"
            />
          </div>

          {/* Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {highlights.map((h) => (
              <div
                key={h.label}
                className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <span className="text-2xl">{h.emoji}</span>
                <div>
                  <p className="font-body font-medium text-foreground text-sm">{h.label}</p>
                  <p className="font-body text-muted-foreground text-xs mt-0.5">{h.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
