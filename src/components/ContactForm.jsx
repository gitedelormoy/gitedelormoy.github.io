import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

// Replace YOUR_FORM_ID with your Formspree form ID after creating account at formspree.io
const FORMSPREE_ID = 'xdapyjbz';

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    arrival: '',
    departure: '',
    guests: '',
    message: '',
  });
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _subject: `Demande de réservation — ${form.name}`,
        }),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', arrival: '', departure: '', guests: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-card rounded-2xl p-10 border border-border shadow-sm flex flex-col items-center justify-center text-center gap-4 min-h-[400px]">
        <CheckCircle className="w-14 h-14 text-primary" />
        <h3 className="font-heading text-2xl text-foreground">Message envoyé !</h3>
        <p className="font-body text-muted-foreground text-sm max-w-sm">
          Merci pour votre demande. Nous vous répondrons dans les meilleurs délais
          pour confirmer les disponibilités.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-2 font-body text-sm text-primary hover:underline"
        >
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-5">
      {/* Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-body text-sm font-medium text-foreground mb-1.5">
            Nom complet *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            value={form.name}
            onChange={handleChange}
            placeholder="Votre nom"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-1.5">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={form.email}
            onChange={handleChange}
            placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-1.5">
          Téléphone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+33 6 00 00 00 00"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      {/* Dates + guests */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="arrival" className="block font-body text-sm font-medium text-foreground mb-1.5">
            Arrivée souhaitée
          </label>
          <input
            id="arrival"
            name="arrival"
            type="date"
            value={form.arrival}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="departure" className="block font-body text-sm font-medium text-foreground mb-1.5">
            Départ souhaité
          </label>
          <input
            id="departure"
            name="departure"
            type="date"
            value={form.departure}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label htmlFor="guests" className="block font-body text-sm font-medium text-foreground mb-1.5">
            Nb. de personnes
          </label>
          <select
            id="guests"
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          >
            <option value="">—</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-body text-sm font-medium text-foreground mb-1.5">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Questions, demandes particulières, animaux de compagnie..."
          rows={4}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
        />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm text-red-500">
          Une erreur est survenue. Merci de réessayer ou de nous contacter directement par email.
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-60"
      >
        {status === 'sending' ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer la demande
          </>
        )}
      </button>

      <p className="font-body text-xs text-muted-foreground text-center">
        * Champs obligatoires. Nous vous répondons sous 24–48h.
      </p>
    </form>
  );
}
