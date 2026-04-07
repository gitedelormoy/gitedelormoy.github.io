import React, { useState, useMemo, useEffect } from 'react';
import { Send, CheckCircle, Calculator, Loader } from 'lucide-react';

const FORMSPREE_ID = 'xdapyjbz';

// ─── Parsing iCal ─────────────────────────────────────────────────────────────
function parseICS(text) {
  const events = [];
  const blocks = text.split('BEGIN:VEVENT');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const summary = (block.match(/SUMMARY[^:]*:(.+)/) || [])[1]?.trim() || '';
    const dtstart = (block.match(/DTSTART[^:]*:(\d{8})/) || [])[1];
    const dtend   = (block.match(/DTEND[^:]*:(\d{8})/) || [])[1];
    if (!dtstart || !dtend) continue;
    const toDate = s => new Date(`${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`);
    events.push({ summary, start: toDate(dtstart), end: toDate(dtend) });
  }
  return events;
}

// Filtrer : garder uniquement Toussaint, Hiver, Printemps (pas Été ni Noël)
function isMoyenneSaisonVacance(summary) {
  const s = summary.toLowerCase();
  return s.includes('toussaint') || s.includes('hiver') || s.includes('printemps');
}

// ─── Haute saison : été + Noël ─────────────────────────────────────────────
function isHauteSaison(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 7 || m === 8) return true;
  if (m === 12 && d >= 20) return true;
  if (m === 1 && d <= 5) return true;
  return false;
}

// ─── Tarifs ────────────────────────────────────────────────────────────────
const TARIFS = {
  semaine: { basse: 740, moyenne: 840, haute: 930 },
  nuits: {
    2: { basse: 390, moyenne: 430, haute: 470 },
    3: { basse: 480, moyenne: 530, haute: 580 },
    4: { basse: 560, moyenne: 620, haute: 680 },
    5: { basse: 630, moyenne: 700, haute: 770 },
    6: { basse: 690, moyenne: 770, haute: 850 },
  },
};

const SAISON_LABEL = { basse: 'Basse saison', moyenne: 'Moyenne saison', haute: 'Haute saison' };
const SAISON_COLOR = { basse: 'text-blue-600', moyenne: 'text-amber-600', haute: 'text-primary' };

// ─── Composant ─────────────────────────────────────────────────────────────
export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    arrival: '', departure: '', guests: '', message: '',
  });
  const [status, setStatus] = useState('idle');
  const [vacances, setVacances] = useState(null); // null = chargement, [] = erreur/vide
  const [vacancesError, setVacancesError] = useState(false);

  // Charger le calendrier Zone B au montage
  useEffect(() => {
    const PROXY = 'https://api.allorigins.win/raw?url=';
    const ICS_URL = encodeURIComponent('https://fr.ftp.opendatasoft.com/openscol/fr-en-calendrier-scolaire/Zone-B.ics');
    fetch(PROXY + ICS_URL)
      .then(r => r.text())
      .then(text => {
        const all = parseICS(text);
        const moyennes = all.filter(e => isMoyenneSaisonVacance(e.summary));
        setVacances(moyennes);
      })
      .catch(() => {
        setVacancesError(true);
        setVacances([]); // fallback : tableau vide
      });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Déterminer la saison d'une date donnée
  const getSaison = (date) => {
    if (isHauteSaison(date)) return 'haute';
    if (vacances && vacances.some(v => date >= v.start && date < v.end)) return 'moyenne';
    return 'basse';
  };

  const prix = useMemo(() => {
    if (!form.arrival || !form.departure || !form.guests || vacances === null) return null;
    const d1 = new Date(form.arrival);
    const d2 = new Date(form.departure);
    if (d2 <= d1) return null;
    const nuits = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    if (nuits < 1) return null;

    const saison = getSaison(d1);
    let base = 0;

    if (nuits >= 7) {
      base = TARIFS.semaine[saison];
    } else if (TARIFS.nuits[nuits]) {
      base = TARIFS.nuits[nuits][saison];
    } else if (nuits === 1) {
      base = Math.round(TARIFS.nuits[2][saison] / 2);
    } else {
      return null;
    }

    const nbPersonnes = parseInt(form.guests);
    const taxeSejour = Math.round(nbPersonnes * 0.22 * nuits * 100) / 100;
    const total = base + taxeSejour;
    return { base, taxeSejour, total, nuits, saison };
  }, [form.arrival, form.departure, form.guests, vacances]);

  const hauteSaisonWarning = useMemo(() => {
    if (!form.arrival || !form.departure) return null;
    const d1 = new Date(form.arrival);
    const d2 = new Date(form.departure);
    if (d2 <= d1) return null;
    const nuits = Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
    if (isHauteSaison(d1) && nuits < 6) {
      return `En haute saison, le séjour minimum est de 6 nuits. Vous avez sélectionné ${nuits} nuit${nuits > 1 ? 's' : ''}.`;
    }
    return null;
  }, [form.arrival, form.departure]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          _subject: `Demande de réservation — ${form.name}${prix ? ` — ~${prix.total.toFixed(0)}€` : ''}`,
          estimation_prix: prix ? `${prix.total.toFixed(2)}€ (${SAISON_LABEL[prix.saison]}, ${prix.nuits} nuits)` : 'Non calculé',
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
          Merci pour votre demande. Nous vous répondrons dans les meilleurs délais pour confirmer les disponibilités.
        </p>
        <button onClick={() => setStatus('idle')} className="mt-2 font-body text-sm text-primary hover:underline">
          Envoyer une autre demande
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-8 border border-border shadow-sm space-y-5">

      {/* Indicateur chargement calendrier */}
      {vacances === null && (
        <div className="flex items-center gap-2 text-muted-foreground font-body text-xs">
          <Loader className="w-3 h-3 animate-spin" />
          Chargement du calendrier scolaire officiel…
        </div>
      )}
      {vacancesError && (
        <p className="font-body text-xs text-amber-600">
          ⚠️ Calendrier scolaire indisponible — estimation basée sur la basse saison uniquement.
        </p>
      )}

      {/* Nom + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block font-body text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Votre nom"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div>
          <label htmlFor="email" className="block font-body text-sm font-medium text-foreground mb-1.5">Email *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="phone" className="block font-body text-sm font-medium text-foreground mb-1.5">Téléphone</label>
        <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+33 6 00 00 00 00"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
      </div>

      {/* Dates + personnes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label htmlFor="arrival" className="block font-body text-sm font-medium text-foreground mb-1.5">Arrivée *</label>
          <input id="arrival" name="arrival" type="date" required value={form.arrival} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div>
          <label htmlFor="departure" className="block font-body text-sm font-medium text-foreground mb-1.5">Départ *</label>
          <input id="departure" name="departure" type="date" required value={form.departure} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div>
          <label htmlFor="guests" className="block font-body text-sm font-medium text-foreground mb-1.5">Personnes *</label>
          <select id="guests" name="guests" required value={form.guests} onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
            <option value="">—</option>
            {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
          </select>
        </div>
      </div>

      {/* Avertissement haute saison */}
      {hauteSaisonWarning && (
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
          <span className="text-amber-500 text-lg shrink-0">⚠️</span>
          <div>
            <p className="font-body text-sm font-medium text-amber-800">Séjour minimum non respecté</p>
            <p className="font-body text-sm text-amber-700 mt-0.5">{hauteSaisonWarning}</p>
            <p className="font-body text-xs text-amber-600 mt-1">Veuillez sélectionner au moins 6 nuits pour un séjour en haute saison.</p>
          </div>
        </div>
      )}

      {/* Prix estimé */}
      {prix && !hauteSaisonWarning && (
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <Calculator className="w-4 h-4 text-primary" />
            <span className="font-body text-sm font-medium text-foreground">Estimation du prix</span>
            <span className={`font-body text-xs px-2 py-0.5 rounded-full bg-primary/10 ${SAISON_COLOR[prix.saison]}`}>
              {SAISON_LABEL[prix.saison]}
            </span>
          </div>
          <div className="flex justify-between font-body text-sm text-muted-foreground">
            <span>{prix.nuits} nuit{prix.nuits > 1 ? 's' : ''}</span>
            <span>{prix.base}€</span>
          </div>
          <div className="flex justify-between font-body text-sm text-muted-foreground">
            <span>Taxe de séjour ({form.guests} pers. × {prix.nuits} nuits × 0,22€)</span>
            <span>{prix.taxeSejour.toFixed(2)}€</span>
          </div>
          <div className="flex justify-between font-body text-sm font-semibold text-foreground border-t border-primary/20 pt-2">
            <span>Total estimé</span>
            <span className="text-primary">{prix.total.toFixed(2)}€</span>
          </div>
          <p className="font-body text-xs text-muted-foreground">* Estimation indicative, tarif définitif confirmé par email.</p>
        </div>
      )}

      {/* Message */}
      <div>
        <label htmlFor="message" className="block font-body text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea id="message" name="message" value={form.message} onChange={handleChange}
          placeholder="Questions, demandes particulières, animaux de compagnie..." rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm text-red-500">Une erreur est survenue. Réessayez ou contactez-nous par email.</p>
      )}

      <button
        type="submit"
        disabled={status === 'sending' || !!hauteSaisonWarning}
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
            {prix && !hauteSaisonWarning && (
              <span className="ml-1 opacity-90">({prix.total.toFixed(2)}€ estimé)</span>
            )}
          </>
        )}
      </button>

      <p className="font-body text-xs text-muted-foreground text-center">
        * Champs obligatoires. Réponse sous 24–48h.
      </p>
    </form>
  );
}
