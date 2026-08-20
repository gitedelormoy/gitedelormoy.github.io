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
      // On déclenche l'animation plus tard (à 250px de défilement)
      // pour laisser le temps de passer la photo sombre
      setScrolled(window.scrollY > 250);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Bandeau climatisation */}
      {showBanner && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4">
          <p className="font-body text-xs tracking-[0.15em] uppercase">
            ❄️ Gîte entièrement climatisé — Profitez d'une fraîcheur bienvenue cet été
          </p>
        </div>
      )}

      <nav
        // On a passé la transition à duration-700 pour un fondu très élégant
        className={`transition-all duration-700 ${
          scrolled
            ? 'bg-background/98 backdrop-blur-md border-b border-border/50 py-3 shadow-sm'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-2.5 group">
            <img
              src="https://res.cloudinary.com/dpgmwola2/image/upload/v1785775632/gite-de-l-ormoy-logo-big-Icon_gp9vcy.png"
              alt="Logo Gîte de l'Ormoy"
              className="h-8 w-auto rounded-full group-hover:scale-105 transition-transform duration-300"
            />
            <span className={`font-heading text-base font-light tracking-widest transition-colors duration-700 ${
              scrolled ? 'text-foreground' : 'text-white'
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
                className={`text-xs font-body tracking-[0.12em] uppercase transition-colors duration-700 ${
                  currentPath === link.path
                    ? scrolled ? 'text-primary' : 'text-white'
                    : scrolled
                    ? 'text-foreground/50 hover:text-foreground'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/reserver"
              className={`text-xs font-body tracking-[0.12em] uppercase transition-all duration-500 px-5 py-2 rounded-full ${
                scrolled
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'border border-white/40 text-white hover:bg-white/20'
              }`}
            >
              Réserver
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 transition-colors duration-700 ${scrolled ? 'text-foreground' : 'text-white'}`}
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
                className={`block font-heading text-2xl font-light transition-colors ${
                  currentPath === '/' ? 'text-primary' : 'text-foreground/60'
                }`}
              >
                Accueil
              </a>
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`block font-heading text-2xl font-light transition-colors ${
                    currentPath === link.path ? 'text-primary' : 'text-foreground/60'
                  }`}
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-4 border-t border-border">
                <a
                  href="/reserver"
                  className="inline-block px-6 py-3 bg-primary text-primary-foreground font-body text-xs tracking-[0.12em] uppercase rounded-full"
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
