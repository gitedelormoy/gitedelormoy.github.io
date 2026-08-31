import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Le Gîte', path: '/le-gite' },
  { label: 'Galerie', path: '/galerie' },
  { label: 'Services', path: '/services' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Blog', path: '/blog' },
];

function isClimatisationSeason() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  if (month > 5 && month < 10) return true;
  if (month === 5 && day >= 1) return true;
  if (month === 9 && day <= 30) return true;
  return false;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    setShowBanner(isClimatisationSeason());
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 250);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Bandeau climatisation */}
      {showBanner && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 shadow-sm relative z-10">
          <p className="font-body text-xs tracking-[0.15em] uppercase font-medium">
            ❄️ Gîte entièrement climatisé — Profitez d'une fraîcheur bienvenue cet été
          </p>
        </div>
      )}

      <nav
        className={`transition-all duration-700 ${
          scrolled
            ? 'bg-background/98 backdrop-blur-md border-b border-border/50 py-3 shadow-sm'
            // Ajout du dégradé linéaire pour protéger le texte sur la photo
            : 'bg-gradient-to-b from-black/70 via-black/20 to-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="https://res.cloudinary.com/dpgmwola2/image/upload/v1785775632/gite-de-l-ormoy-logo-big-Icon_gp9vcy.png"
              alt="Logo Gîte de l'Ormoy"
              className="h-8 w-auto rounded-full group-hover:scale-105 transition-transform duration-300 shadow-sm"
            />
            <span className={`font-heading text-base tracking-widest transition-colors duration-700 ${
              // Remplacement de font-light par font-medium + ajout d'un drop-shadow
              scrolled ? 'text-foreground font-medium' : 'text-white font-medium drop-shadow-md'
            }`}>
              Le Gîte de l'Ormoy
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                // Ajout de font-medium pour épaissir la police
                className={`text-xs font-body font-medium tracking-[0.15em] uppercase transition-all duration-700 ${
                  currentPath === link.path
                    ? scrolled ? 'text-primary' : 'text-white drop-shadow-md'
                    : scrolled
                    ? 'text-foreground/70 hover:text-foreground'
                    : 'text-white/90 hover:text-white drop-shadow-md'
                }`}
              >
                {link.label}
              </a>
            ))}
            
            {/* Bouton Réserver plein en permanence avec effet de survol */}
            <a
              href="/reserver"
              className="text-xs font-body font-medium tracking-[0.12em] uppercase transition-all duration-300 px-6 py-2.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Réserver
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors duration-700 drop-shadow-md ${scrolled ? 'text-foreground' : 'text-white'}`}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden bg-background border-t border-border absolute top-full left-0 w-full shadow-lg">
            <div className="px-8 py-8 space-y-6">
              <a
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`block font-heading text-2xl transition-colors ${
                  currentPath === '/' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                Accueil
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-heading text-2xl transition-colors ${
                    currentPath === link.path ? 'text-primary font-medium' : 'text-foreground/80'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href="/reserver"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground font-body font-medium text-xs tracking-[0.12em] uppercase rounded-full shadow-md"
                >
                  Réserver
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
