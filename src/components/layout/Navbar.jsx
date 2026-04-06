import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Accueil', path: '/' },
  { label: 'Le Gîte', path: '/le-gite' },
  { label: 'Galerie', path: '/galerie' },
  { label: 'Services', path: '/services' },
  { label: 'Tarifs', path: '/tarifs' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
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
          ? 'bg-background/95 backdrop-blur-md shadow-sm py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center gap-3">
          <img
            src="https://www.gitedelormoy.fr/wp-content/uploads/2015/07/gite-de-l-ormoy-logo.jpg"
            alt="Logo Gîte de l'Ormoy"
            className="h-9 w-auto rounded-full"
          />
          <span
            className={`font-heading text-xl font-semibold tracking-wide transition-colors duration-500 ${
              scrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Gîte de l'Ormoy
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-7">
          {navLinks.map((link) => (
            <a
              key={link.path}
              href={link.path}
              className={`text-sm font-body font-medium tracking-wide transition-all duration-300 ${
                currentPath === link.path
                  ? scrolled
                    ? 'text-primary'
                    : 'text-white'
                  : scrolled
                  ? 'text-foreground/65 hover:text-primary'
                  : 'text-white/75 hover:text-white'
              }`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="/contact"
            className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all duration-300 ${
              scrolled
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-white/20 text-white backdrop-blur-sm border border-white/30 hover:bg-white/30'
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
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-background/98 backdrop-blur-lg border-t border-border">
          <div className="px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={() => setMobileOpen(false)}
                className={`block text-base font-body font-medium transition-colors ${
                  currentPath === link.path ? 'text-primary' : 'text-foreground/70'
                }`}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="block w-full text-center px-5 py-3 rounded-full bg-primary text-primary-foreground font-body font-medium text-sm"
            >
              Réserver
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
