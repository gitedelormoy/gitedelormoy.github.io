import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Le Gîte', path: '/le-gite' },
  { label: 'Galerie', path: '/galerie' },
  { label: 'Services', path: '/services' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Blog', path: '/blog' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-background/98 backdrop-blur-md border-b border-border/50 py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-8 md:px-16 flex items-center justify-between">

        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <img
            src="https://res.cloudinary.com/dpgmwola2/image/upload/v1785775632/gite-de-l-ormoy-logo-big-Icon_gp9vcy.png"
            alt="Logo Gîte de l'Ormoy"
            className="h-8 w-auto rounded-full"
          />
          <span className={`font-heading text-base font-light tracking-widest transition-colors duration-500 ${
            scrolled ? 'text-foreground' : 'text-white'
          }`}>
            L'Ormoy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`text-xs font-body tracking-[0.12em] uppercase transition-all duration-300 ${
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
            className={`text-xs font-body tracking-[0.12em] uppercase transition-all duration-300 px-5 py-2 rounded-full ${
              scrolled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'border border-white/40 text-white hover:bg-white/10'
            }`}
          >
            Réserver
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 transition-colors ${scrolled ? 'text-foreground' : 'text-white'}`}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background border-t border-border">
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
  );
}
