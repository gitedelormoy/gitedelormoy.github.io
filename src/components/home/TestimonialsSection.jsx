import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const testimonials = [
  {
    text: "Superbe séjour dans ce gîte magnifique, décoré avec beaucoup de goût et très bien équipé ! Nous avons été admirablement accueillis et avons eu l'agréable surprise de découvrir des spécialités régionales offertes par nos hôtes. Nous nous sommes tout de suite sentis les bienvenus.",
    author: "Raymonde",
    source: "Airbnb",
  },
  {
    text: "Superbe gîte, confortable, restauré avec beaucoup de goût et tout équipé. Très belle semaine passée dans un cadre paisible. L'accueil était parfait et attentionné, avec plusieurs surprises qui nous attendaient. La maison est idéale pour une famille.",
    author: "Patrice",
    source: "Airbnb",
  },
  {
    text: "Wow, so Amazing! Gabriel and Pascale transformed this house into a very pleasant place to stay. It's built as if they would like to stay in it themselves, without compromises. Very pleasant and cozy decorated, with a modern touch showing the old parts of the building.",
    author: "Martin De Ruiter",
    source: "Airbnb",
  },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 md:py-32 bg-primary text-primary-foreground overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="font-body text-primary-foreground/60 text-xs tracking-[0.3em] uppercase mb-3">
            Témoignages
          </p>
          <h2 className="font-heading text-4xl md:text-5xl font-light">Ce qu'ils en disent</h2>
        </div>

        <div className="relative">
          <Quote className="w-12 h-12 text-primary-foreground/15 mx-auto mb-6" />

          <div key={current} className="text-center">
            <p className="font-heading text-xl md:text-2xl font-light leading-relaxed italic opacity-90 mb-8">
              "{testimonials[current].text}"
            </p>
            <div className="flex items-center justify-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-accent text-accent" />
              ))}
            </div>
            <p className="font-body text-sm font-medium">{testimonials[current].author}</p>
            <p className="font-body text-xs opacity-60 mt-1">{testimonials[current].source}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              aria-label="Précédent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-primary-foreground w-6' : 'bg-primary-foreground/40 w-2'
                  }`}
                  aria-label={`Témoignage ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-primary-foreground/30 flex items-center justify-center hover:bg-primary-foreground/10 transition-colors"
              aria-label="Suivant"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
