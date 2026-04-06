import React from 'react';
import { Wifi, Tv, UtensilsCrossed, Shirt, Bike, Heart, Car, Flame, Trees, Baby, Dog, BookOpen } from 'lucide-react';

const services = [
  { icon: Wifi, label: 'WiFi Fibre haut débit' },
  { icon: Tv, label: 'Télévisions' },
  { icon: UtensilsCrossed, label: 'Cuisine équipée' },
  { icon: Shirt, label: 'Lave linge' },
  { icon: Bike, label: 'Vélos' },
  { icon: Heart, label: 'Accueil équestre' },
  { icon: Car, label: 'Parking gratuit' },
  { icon: Flame, label: 'Barbecue' },
  { icon: Trees, label: 'Jardin clos' },
  { icon: Baby, label: 'Équipement bébé' },
  { icon: Dog, label: 'Animaux bienvenus' },
  { icon: BookOpen, label: 'Guides locaux' },
];

export default function ServicesSection() {
  return (
    <section className="py-24 px-6 bg-muted/50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="section-label mb-3">Confort</p>
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">Nos Services</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {services.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-card border border-border hover:border-primary/20 hover:shadow-sm transition-all duration-300 text-center group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <span className="font-body text-sm text-foreground/80 leading-tight">{label}</span>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <a href="/services" className="btn-primary">
            Tous les services
          </a>
        </div>
      </div>
    </section>
  );
}
