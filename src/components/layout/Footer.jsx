import React from 'react';
import { MapPin, Mail, ExternalLink } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Le Gîte', path: '/le-gite' },
  { label: 'Galerie', path: '/galerie' },
  { label: 'Services', path: '/services' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Blog', path: '/blog' },
  { label: 'Réserver', path: '/reserver' },
  { label: 'Réserver', path: '/reserver' },
];

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-3xl font-semibold mb-4">Gîte de l'Ormoy</h3>
            <p className="font-body text-sm leading-relaxed opacity-80">
              Meublé de tourisme 4 étoiles au cœur de la Sologne & du Berry.
              Un havre de paix où le charme champêtre rencontre le confort moderne.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">Navigation</h4>
            <div className="space-y-2 font-body text-sm">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  className="block opacity-80 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-heading text-xl font-semibold mb-4">Contact</h4>
            <div className="space-y-3 font-body text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 opacity-80 shrink-0" />
                <span className="opacity-80">Château de l'Ormoy, Saint Laurent<br />près de Vierzon, France</span>
              </div>
              <a
                href="mailto:contact@gitedelormoy.fr"
                className="flex items-center gap-3 opacity-80 hover:opacity-100 transition-opacity"
              >
                <Mail className="w-4 h-4 shrink-0" />
                <span>contact@gitedelormoy.fr</span>
              </a>
              <div className="pt-4 space-y-2">
                <a
                  href="http://www.officedetourismepaysdevierzon.fr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  Office de Tourisme de Vierzon
                </a>
                <a
                  href="http://www.villagesdelaforet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 opacity-80 hover:opacity-100 transition-opacity text-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  Villages de la Forêt
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-xs opacity-60">
            © {new Date().getFullYear()} Gîte de l'Ormoy. Tous droits réservés.
          </p>
          <img
            src="https://www.gitedelormoy.fr/wp-content/uploads/2023/12/Plaque-Meuble_tourisme4_2023.png"
            alt="Meublé de tourisme 4 étoiles"
            className="h-14 object-contain opacity-90"
          />
        </div>
      </div>
    </footer>
  );
}
