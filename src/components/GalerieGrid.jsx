import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function GalerieGrid({ images }) {
  const [selected, setSelected] = useState(null);

  const prev = () => {
    const idx = images.findIndex((img) => img.src === selected.src);
    setSelected(images[(idx - 1 + images.length) % images.length]);
  };

  const next = () => {
    const idx = images.findIndex((img) => img.src === selected.src);
    setSelected(images[(idx + 1) % images.length]);
  };

  // Keyboard navigation
  const handleKey = (e) => {
    if (!selected) return;
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
    if (e.key === 'Escape') setSelected(null);
  };

  return (
    <>
      {/* Masonry-style grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" onKeyDown={handleKey} tabIndex={-1}>
        {images.map((img, i) => (
          <div
            key={i}
            className={`cursor-pointer group overflow-hidden rounded-2xl ${
              i === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'
            }`}
            onClick={() => setSelected(img)}
          >
            <img
              src={img.src}
              alt={img.alt}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          {/* Close */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-8 h-8" />
          </button>

          {/* Prev */}
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Précédent"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>

          {/* Image */}
          <img
            src={selected.src}
            alt={selected.alt}
            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 text-white/70 hover:text-white transition-colors p-2"
            aria-label="Suivant"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          {/* Caption */}
          <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-body text-white/60 text-sm">
            {selected.alt}
          </p>
        </div>
      )}
    </>
  );
}
