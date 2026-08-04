import React from 'react';

const testimonials = [
  {
    text: "Superbe séjour dans ce gîte magnifique, décoré avec beaucoup de goût. Nous avons été admirablement accueillis et avons eu l'agréable surprise de découvrir des spécialités régionales offertes par nos hôtes.",
    author: "Raymonde",
    source: "Airbnb",
  },
  {
    text: "Très belle semaine passée dans un cadre paisible. L'accueil était parfait et attentionné, avec plusieurs surprises qui nous attendaient. La maison est idéale pour une famille.",
    author: "Patrice",
    source: "Airbnb",
  },
  {
    text: "Gabriel and Pascale transformed this house into a very pleasant place to stay. Very pleasant and cozy decorated, with a modern touch showing the old parts of the building.",
    author: "Martin De Ruiter",
    source: "Airbnb",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-28 md:py-36 px-8 md:px-16 lg:px-24 bg-muted/30">
      <div className="max-w-6xl mx-auto">

        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <h2 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Ce qu'ils<br /><span className="italic">en disent</span>
          </h2>
          
            href="https://www.airbnb.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="font-body text-xs text-muted-foreground hover:text-primary transition-colors tracking-widest uppercase"
          >
            Voir tous les avis
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
          {testimonials.map((t, i) => (
            <div key={i} className="bg-background p-8 md:p-10 flex flex-col justify-between gap-8">
              <p className="font-heading text-lg font-light leading-relaxed text-foreground/80 italic">
                "{t.text}"
              </p>
              <div>
                <div className="flex gap-0.5 mb-3">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="text-primary text-xs">★</span>
                  ))}
                </div>
                <p className="font-body text-sm font-medium text-foreground">{t.author}</p>
                <p className="font-body text-xs text-muted-foreground mt-0.5">{t.source}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
