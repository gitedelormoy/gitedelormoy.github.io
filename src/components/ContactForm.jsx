import React, { useState, useEffect, useMemo } from 'react';
import { Send, CheckCircle, Calculator } from 'lucide-react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { DayPicker } from 'react-day-picker';
import { fr } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';

const FORMSPREE_ID = 'xdapyjbz';

const firebaseConfig = {
  apiKey: "AIzaSyBiGQKhFbak81_zVBBeHOLGjSpuJ68EKmg",
  authDomain: "resa-gite.firebaseapp.com",
  projectId: "resa-gite",
  storageBucket: "resa-gite.firebasestorage.app",
  messagingSenderId: "773467849323",
  appId: "1:773467849323:web:15eadc8bd0ea294061a72e"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const VACANCES_MOYENNES = [
  { start: '2024-10-19', end: '2024-11-04' },
  { start: '2025-02-08', end: '2025-02-24' },
  { start: '2025-04-05', end: '2025-04-22' },
  { start: '2025-10-18', end: '2025-11-03' },
  { start: '2026-02-14', end: '2026-03-02' },
  { start: '2026-04-04', end: '2026-04-20' },
  { start: '2026-10-17', end: '2026-11-02' },
  { start: '2027-02-13', end: '2027-03-01' },
  { start: '2027-04-10', end: '2027-04-26' },
  { start: '2027-10-23', end: '2027-11-08' },
  { start: '2028-02-19', end: '2028-03-04' },
  { start: '2028-04-08', end: '2028-04-24' },
];

function isHauteSaison(date) {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  if (m === 7 || m === 8) return true;
  if (m === 12 && d >= 20) return true;
  if (m === 1 && d <= 5) return true;
  return false;
}

function getSaison(date) {
  if (isHauteSaison(date)) return 'haute';
  const iso = date.toISOString().slice(0, 10);
  if (VACANCES_MOYENNES.some(v => iso >= v.start && iso < v.end)) return 'moyenne';
  return 'basse';
}

const TARIFS = {
  nuits: {
    2: { basse: 390, moyenne: 430, haute: 470 },
    3: { basse: 480, moyenne: 530, haute: 580 },
    4: { basse: 560, moyenne: 620, haute: 680 },
    5: { basse: 630, moyenne: 700, haute: 770 },
    6: { basse: 690, moyenne: 770, haute: 930 },
  },
};

const SAISON_LABEL = { basse: 'Basse saison', moyenne: 'Moyenne saison', haute: 'Haute saison' };
const SAISON_COLOR = { basse: 'text-blue-600', moyenne: 'text-amber-600', haute: 'text-primary' };

function toIso(date) {
  return date.toISOString().slice(0, 10);
}

function getDatesBetween(arrival, departure) {
  const dates = [];
  const current = new Date(arrival);
  const end = new Date(departure);
  while (current < end) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function formatDate(date) {
  if (!date) return '';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', guests: '', message: '',
  });
  const [range, setRange] = useState({ from: undefined, to: undefined });
  const [status, setStatus] = useState('idle');
  const [bookedDates, setBookedDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    async function fetchReservations() {
      const snap = await getDocs(collection(db, 'reservations'));
      const dates = [];
      snap.forEach(doc => {
        const { arrival, departure } = doc.data();
        if (arrival && departure) {
          dates.push(...getDatesBetween(arrival, departure));
        }
      });
      setBookedDates(dates);
    }
    fetchReservations();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const disabledDays = [
    { before: today },
    ...bookedDates,
  ];

  const hauteSaisonInfo = range.from && isHauteSaison(range.from);

  const handleRangeSelect = (selected) => {
    if (!selected) {
      setRange({ from: undefined, to: undefined });
      return;
    }
    if (selected.from && selected.to) {
      const between = getDatesBetween(selected.from, selected.to);
      const hasBooked = between.some(d =>
        bookedDates.some(b => toIso(b) === toIso(d))
      );
      if (hasBooked) {
        setRange({ from: selected.from, to: undefined });
        return;
      }
      if (isHauteSaison(selected.from)) {
        const nuits = Math.round((selected.to - selected.from) / (1000 * 60 * 60 * 24));
        if (nuits < 6) {
          setRange({ from: selected.from, to: undefined });
          return;
        }
      }
      setShowCalendar(false);
    }
    setRange(selected);
  };

  const prixInfo = useMemo(() => {
    if (!range.from || !range.to || !form.guests) return null;
    const nuits = Math.round((range.to - range.from) / (1000 * 60 * 60 * 24));
    if (nuits < 1) return null;
    if (nuits > 6) return { surDemande: true, nuits };
    const saison = getSaison(range.from);
    const base = TARIFS.nuits[nuits]?.[saison] ?? null;
    if (!base) return null;
    const nbPersonnes = parseInt(form.guests);
    const taxeSejour = Math.round(nbPersonnes * 0.22 * nuits * 100) / 100;
    return { surDemande: false, base, taxeSejour, total: base + taxeSejour, nuits, saison };
  }, [range, form.guests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          arrival: range.from ? toIso(range.from) : '',
          departure: range.to ? toIso(range.to) : '',
          _subject: `Demande de réservation — ${form.name}${prixInfo && !prixInfo.surDemande ? ` — ~${prixInfo.total.toFixed(0)}€` : ''}`,
          estimation_prix: prixInfo
            ? prixInfo.surDemande
              ? `Prix sur demande (${prixInfo.nuits} nuits)`
              : `${prixInfo.total.toFixed(2)}€ (${SAISON_LABEL[prixInfo.saison]}, ${prixInfo.nuits} nuits)`
            : 'Non calculé',
        }),
      });
      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', guests: '', message: '' });
        setRange({ from: undefined, to: undefined });
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block font-body text-sm font-medium text-foreground mb-1.5">Nom complet *</label>
          <input name="name" type="text" required value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            placeholder="Votre nom"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
        <div>
          <label className="block font-body text-sm font-medium text-foreground mb-1.5">Email *</label>
          <input name="email" type="email" required value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            placeholder="votre@email.com"
            className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
        </div>
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-foreground mb-1.5">Téléphone</label>
        <input name="phone" type="tel" value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          placeholder="+33 6 00 00 00 00"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors" />
      </div>

      {/* Calendrier */}
      <div>
        <label className="block font-body text-sm font-medium text-foreground mb-1.5">Dates de séjour *</label>
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        >
          {range.from && range.to
            ? `${formatDate(range.from)} → ${formatDate(range.to)}`
            : range.from
            ? `${formatDate(range.from)} → choisir le départ`
            : '📅 Sélectionner vos dates'}
        </button>

        {hauteSaisonInfo && (
          <p className="font-body text-xs text-primary mt-1">☀️ Haute saison — 6 nuits minimum</p>
        )}

        {showCalendar && (
          <div className="mt-2 border border-border rounded-2xl p-4 bg-card shadow-sm overflow-x-auto">
            <style>{`
              .rdp { --rdp-accent-color: hsl(150, 25%, 28%); --rdp-background-color: hsla(150, 25%, 28%, 0.1); margin: 0; }
              .rdp-day_disabled { opacity: 0.3; text-decoration: line-through; }
              .rdp-day_selected { background-color: hsl(150, 25%, 28%) !important; color: white !important; border-radius: 50%; }
              .rdp-day_range_middle { background-color: hsla(150, 25%, 28%, 0.15) !important; color: hsl(150, 25%, 28%) !important; border-radius: 0 !important; }
              .rdp-day_range_start { background-color: hsl(150, 25%, 28%) !important; color: white !important; border-radius: 50% 0 0 50% !important; }
              .rdp-day_range_end { background-color: hsl(150, 25%, 28%) !important; color: white !important; border-radius: 0 50% 50% 0 !important; }
              .rdp-day:hover:not(.rdp-day_disabled) { background-color: hsla(150, 25%, 28%, 0.2) !important; border-radius: 50%; }
            `}</style>
            <DayPicker
              mode="range"
              selected={range}
              onSelect={handleRangeSelect}
              disabled={disabledDays}
              locale={fr}
              numberOfMonths={1}
              fromDate={today}
              modifiersClassNames={{
                disabled: 'rdp-day_disabled',
              }}
            />
            <div className="flex items-center justify-between mt-3">
              {range.from && !range.to && (
                <p className="font-body text-xs text-muted-foreground">
                  Cliquez sur la date de départ
                  {hauteSaisonInfo ? ` (min. 6 nuits)` : ''}
                </p>
              )}
              {!range.from && (
                <p className="font-body text-xs text-muted-foreground">
                  Cliquez sur votre date d'arrivée
                </p>
              )}
              {range.from && (
                <button
                  type="button"
                  onClick={() => setRange({ from: undefined, to: undefined })}
                  className="ml-auto font-body text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  ✕ Effacer les dates
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="block font-body text-sm font-medium text-foreground mb-1.5">Personnes *</label>
        <select required value={form.guests}
          onChange={e => setForm({ ...form, guests: e.target.value })}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors">
          <option value="">—</option>
          {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>)}
        </select>
      </div>

      {prixInfo && (
        prixInfo.surDemande ? (
          <div className="rounded-xl bg-muted/50 border border-border p-4 flex items-center gap-3">
            <Calculator className="w-4 h-4 text-muted-foreground shrink-0" />
            <div>
              <p className="font-body text-sm font-medium text-foreground">{prixInfo.nuits} nuits — Prix sur demande</p>
              <p className="font-body text-xs text-muted-foreground mt-0.5">Pour les séjours de plus de 6 nuits, nous vous enverrons un tarif personnalisé.</p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Calculator className="w-4 h-4 text-primary" />
              <span className="font-body text-sm font-medium text-foreground">Estimation du prix</span>
              <span className={`font-body text-xs px-2 py-0.5 rounded-full bg-primary/10 ${SAISON_COLOR[prixInfo.saison]}`}>
                {SAISON_LABEL[prixInfo.saison]}
              </span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>{prixInfo.nuits} nuit{prixInfo.nuits > 1 ? 's' : ''}</span>
              <span>{prixInfo.base}€</span>
            </div>
            <div className="flex justify-between font-body text-sm text-muted-foreground">
              <span>Taxe de séjour ({form.guests} pers. × {prixInfo.nuits} nuits × 0,22€)</span>
              <span>{prixInfo.taxeSejour.toFixed(2)}€</span>
            </div>
            <div className="flex justify-between font-body text-sm font-semibold text-foreground border-t border-primary/20 pt-2">
              <span>Total estimé</span>
              <span className="text-primary">{prixInfo.total.toFixed(2)}€</span>
            </div>
            <p className="font-body text-xs text-muted-foreground">* Estimation indicative, tarif définitif confirmé par email.</p>
          </div>
        )
      )}

      <div>
        <label className="block font-body text-sm font-medium text-foreground mb-1.5">Message</label>
        <textarea name="message" value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          placeholder="Questions ou demandes particulières…" rows={3}
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none" />
      </div>

      {status === 'error' && (
        <p className="font-body text-sm text-red-500">Une erreur est survenue. Réessayez ou contactez-nous par email.</p>
      )}

      <button type="submit" disabled={status === 'sending' || !range.from || !range.to}
        className="w-full flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all duration-300 disabled:opacity-60">
        {status === 'sending' ? (
          <>
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            Envoi en cours...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            Envoyer la demande
            {prixInfo && !prixInfo.surDemande && (
              <span className="ml-1 opacity-90">({prixInfo.total.toFixed(2)}€ estimé)</span>
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
