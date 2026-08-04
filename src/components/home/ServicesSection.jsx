import React from 'react';
import { Wifi, Tv, UtensilsCrossed, Shirt, Heart, Car, Flame, AirVent, Baby, Zap, BookOpen } from 'lucide-react';
const services = [
  { icon: Wifi, label: 'WiFi Fibre haut debit' },
  { icon: Tv, label: 'Televisions' },
  { icon: UtensilsCrossed, label: 'Cuisine equipee' },
  { icon: Shirt, label: 'Lave linge' },
  { icon: Heart, label: 'Accueil equestre' },
  { icon: Car, label: 'Parking gratuit' },
  { icon: Flame, label: 'Barbecue' },
  { icon: AirVent, label: 'Climatisation' },
  { icon: Baby, label: 'Equipement bebe' },
  { icon: Zap, label: 'Borne de recharge electrique' },
  { icon: BookOpen, label: 'Guides locaux' },
];
export default function ServicesSection() {
  return (
    <section className="py-28 md:py-36 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Tout le confort<br />
            <span className="italic text-primary">d'une maison de caractere</span>
          </h2>
          <a
            href="/services"
            className="inline-flex items-center gap-3 font-body text-sm text-foreground/60 hover:text-primary transition-colors duration-300 tracking-wide group"
          >
            <span className="w-8 h-px bg-current transition-all duration-300 group-hover:w-12" />
            Tous les services
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-border">
          {services.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-4 py-5 border-b border-border pr-8 group"
            >
              <div className="w-8 h-8 shrink-0 flex items-center justify-center">
                <Icon className="w-4 h-4 text-primary/60 group-hover:text-primary transition-colors duration-300" />
              </div>
              <span className="font-body text-sm text-foreground/70 group-hover:text-foreground transition-colors duration-300">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
