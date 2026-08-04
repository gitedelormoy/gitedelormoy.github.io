import React from 'react';
const highlights = [
  { label: 'Bourges', sublabel: '30 min', detail: 'Cité médiévale classée UNESCO' },
  { label: 'Zoo de Beauval', sublabel: '1h', detail: "L'un des plus beaux zoos de France" },
  { label: 'Châteaux de la Loire', sublabel: '1h30', detail: 'Chambord, Chenonceau...' },
  { label: 'Sologne', sublabel: '20 min', detail: 'Forêts, étangs, randonnées' },
  { label: 'Pêche & Nature', sublabel: 'Sur place', detail: 'Étangs privés à proximité' },
  { label: 'Véloroute Berry', sublabel: 'Au départ', detail: 'Pistes cyclables depuis le gîte' },
];
export default function NearbySection() {
  return (
    <section className="py-28 md:py-36 px-8 md:px-16 lg:px-24 bg-muted/20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          {/* Colonne gauche — titre + liste */}
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground mb-4">
              Aux alentours
            </h2>
            <p className="font-body text-foreground/50 text-sm leading-relaxed mb-12 max-w-sm">
              Une base idéale pour explorer la Sologne, le Berry et la Loire.
            </p>
            <div className="divide-y divide-border">
              {highlights.map((h) => (
                <div key={h.label} className="flex items-center justify-between py-4 group">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                      {h.label}
                    </p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">{h.detail}</p>
                  </div>
                  <span className="font-body text-xs text-muted-foreground/60 shrink-0 ml-4">
                    {h.sublabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
          {/* Colonne droite — carte */}
          <div className="rounded-2xl overflow-hidden border border-border h-[480px] lg:h-full min-h-[400px]">
            <iframe
              title="Localisation Gîte de l'Ormoy"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2709.7689113947526!2d2.2031995121903676!3d47.221103771036844!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47fac445a1d35b31%3A0xc91225407655d81f!2sLe%20G%C3%AEte%20de%20l'Ormoy!5e0!3m2!1sfr!2sfr!4v1776966632505!5m2!1sfr!2sfr"
              className="w-full h-full"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
