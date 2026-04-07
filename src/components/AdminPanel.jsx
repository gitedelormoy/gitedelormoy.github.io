import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore, collection, addDoc, deleteDoc, doc,
  onSnapshot, query, orderBy, serverTimestamp
} from 'firebase/firestore';

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

// ── iCal parser ───────────────────────────────────────────────────────────────
function parseICS(text) {
  const events = [];
  const blocks = text.split('BEGIN:VEVENT');
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const summary = (block.match(/SUMMARY[^:]*:(.+)/) || [])[1]?.trim() || 'Réservé';
    const dtstart = (block.match(/DTSTART[;:][^:\r\n]*:?(\d{8})/) || block.match(/DTSTART:(\d{8})/) || [])[1];
    const dtend   = (block.match(/DTEND[;:][^:\r\n]*:?(\d{8})/) || block.match(/DTEND:(\d{8})/) || [])[1];
    if (!dtstart || !dtend) continue;
    const toDate = s => `${s.slice(0,4)}-${s.slice(4,6)}-${s.slice(6,8)}`;
    if (summary.toLowerCase().includes('airbnb') || summary.toLowerCase().includes('not available') || summary.toLowerCase().includes('reserved')) {
      events.push({ label: summary, arrival: toDate(dtstart), departure: toDate(dtend) });
    } else {
      events.push({ label: summary, arrival: toDate(dtstart), departure: toDate(dtend) });
    }
  }
  return events;
}

const ICAL_SOURCES = [
  { name: 'Airbnb', source: 'airbnb', url: 'https://www.airbnb.fr/calendar/ical/7268032.ics?t=cab18de279ac4a39a295599ff51f4602' },
  { name: 'Booking', source: 'booking', url: 'https://ical.booking.com/v1/export?t=65fb0d40-ba23-440d-953f-2685a2b18eb0' },
];

const PROXY = 'https://corsproxy.io/?';

const SOURCE_COLORS = {
  airbnb: 'bg-red-100 text-red-700',
  booking: 'bg-yellow-100 text-yellow-700',
  direct: 'bg-green-100 text-green-700',
  blocked: 'bg-gray-100 text-gray-600',
};

const SOURCE_LABELS = {
  airbnb: 'Airbnb',
  booking: 'Booking',
  direct: 'Direct',
  blocked: 'Bloqué',
};

const ADMIN_PASSWORD = 'ormoy2024';

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);

  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncLog, setSyncLog] = useState('');

  const [form, setForm] = useState({ label: '', arrival: '', departure: '', source: 'direct', notes: '' });
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState('list'); // list | add | sync

  // Auth
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      setPwError(true);
      setTimeout(() => setPwError(false), 2000);
    }
  };

  // Load reservations
  useEffect(() => {
    if (!authed) return;
    const q = query(collection(db, 'reservations'), orderBy('arrival'));
    const unsub = onSnapshot(q, (snap) => {
      setReservations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    });
    return unsub;
  }, [authed]);

  // Add reservation
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.label || !form.arrival || !form.departure) return;
    setSaving(true);
    await addDoc(collection(db, 'reservations'), {
      ...form,
      createdAt: serverTimestamp(),
    });
    setForm({ label: '', arrival: '', departure: '', source: 'direct', notes: '' });
    setSaving(false);
    setTab('list');
  };

  // Delete reservation
  const handleDelete = async (id, label) => {
    if (!confirm(`Supprimer la réservation "${label}" ?`)) return;
    await deleteDoc(doc(db, 'reservations', id));
  };

  // Sync iCal
  const handleSync = async () => {
    setSyncing(true);
    setSyncLog('Démarrage de la synchronisation...\n');
    let total = 0;

    for (const source of ICAL_SOURCES) {
      setSyncLog(prev => prev + `\n📡 Lecture ${source.name}...`);
      try {
        const res = await fetch(PROXY + encodeURIComponent(source.url));
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const text = await res.text();
        const events = parseICS(text);
        setSyncLog(prev => prev + ` ${events.length} événements trouvés`);

        // Only add events that don't already exist (check by arrival+source)
        const existing = reservations.filter(r => r.source === source.source).map(r => r.arrival);
        let added = 0;
        for (const ev of events) {
          if (ev.arrival && ev.departure && !existing.includes(ev.arrival)) {
            await addDoc(collection(db, 'reservations'), {
              label: ev.label || source.name,
              arrival: ev.arrival,
              departure: ev.departure,
              source: source.source,
              notes: `Importé depuis ${source.name}`,
              createdAt: serverTimestamp(),
            });
            added++;
            total++;
          }
        }
        setSyncLog(prev => prev + ` → ${added} nouvelles réservations ajoutées`);
      } catch (err) {
        setSyncLog(prev => prev + ` ❌ Erreur : ${err.message}`);
      }
    }

    setSyncLog(prev => prev + `\n\n✅ Synchronisation terminée — ${total} réservation(s) importée(s)`);
    setSyncing(false);
  };

  // ── Login screen ─────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="font-heading text-4xl font-light text-foreground mb-2">Administration</h1>
            <p className="font-body text-sm text-muted-foreground">Gîte de l'Ormoy</p>
          </div>
          <form onSubmit={handleLogin} className="bg-card rounded-2xl border border-border p-8 space-y-4 shadow-sm">
            <div>
              <label className="block font-body text-sm font-medium text-foreground mb-1.5">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-2.5 rounded-xl border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-colors ${pwError ? 'border-red-400 focus:ring-red-200' : 'border-border focus:border-primary'}`}
                autoFocus
              />
              {pwError && <p className="font-body text-xs text-red-500 mt-1">Mot de passe incorrect</p>}
            </div>
            <button type="submit" className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all">
              Accéder
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin panel ───────────────────────────────────────────────────────────
  const upcoming = reservations.filter(r => r.departure >= new Date().toISOString().slice(0,10));
  const past = reservations.filter(r => r.departure < new Date().toISOString().slice(0,10));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold">Administration</h1>
          <p className="font-body text-xs opacity-70">Gîte de l'Ormoy</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" className="font-body text-xs opacity-75 hover:opacity-100 transition-opacity">
            ← Voir le site
          </a>
          <button
            onClick={() => setAuthed(false)}
            className="font-body text-xs bg-primary-foreground/10 hover:bg-primary-foreground/20 px-3 py-1.5 rounded-full transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 py-6 max-w-5xl mx-auto">
        {[
          { label: 'À venir', value: upcoming.length, color: 'text-primary' },
          { label: 'Airbnb', value: upcoming.filter(r => r.source === 'airbnb').length, color: 'text-red-500' },
          { label: 'Booking', value: upcoming.filter(r => r.source === 'booking').length, color: 'text-yellow-600' },
          { label: 'Direct', value: upcoming.filter(r => r.source === 'direct').length, color: 'text-green-600' },
        ].map(s => (
          <div key={s.label} className="bg-card rounded-2xl border border-border p-5 text-center">
            <p className={`font-heading text-4xl font-light ${s.color}`}>{s.value}</p>
            <p className="font-body text-xs text-muted-foreground mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex gap-1 bg-muted rounded-xl p-1 mb-6 w-fit">
          {[
            { id: 'list', label: '📋 Réservations' },
            { id: 'add', label: '➕ Ajouter' },
            { id: 'sync', label: '🔄 Synchroniser' },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg font-body text-sm transition-all ${tab === t.id ? 'bg-card shadow-sm text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* LIST TAB */}
        {tab === 'list' && (
          <div className="space-y-3 pb-12">
            {loading ? (
              <div className="text-center py-12 font-body text-muted-foreground">Chargement...</div>
            ) : upcoming.length === 0 ? (
              <div className="text-center py-12 font-body text-muted-foreground">Aucune réservation à venir</div>
            ) : (
              <>
                <h2 className="font-heading text-xl font-light text-foreground mb-4">À venir ({upcoming.length})</h2>
                {upcoming.map(r => (
                  <div key={r.id} className="bg-card rounded-2xl border border-border p-5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <span className={`font-body text-xs px-2.5 py-1 rounded-full font-medium ${SOURCE_COLORS[r.source] || SOURCE_COLORS.blocked}`}>
                        {SOURCE_LABELS[r.source] || r.source}
                      </span>
                      <div>
                        <p className="font-body font-medium text-foreground text-sm">{r.label}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">
                          {new Date(r.arrival).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
                          {' → '}
                          {new Date(r.departure).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </p>
                        {r.notes && <p className="font-body text-xs text-muted-foreground mt-0.5 italic">{r.notes}</p>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(r.id, r.label)}
                      className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition-colors shrink-0"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                {past.length > 0 && (
                  <>
                    <h2 className="font-heading text-xl font-light text-muted-foreground mb-4 mt-8">Passées ({past.length})</h2>
                    {past.slice(-5).reverse().map(r => (
                      <div key={r.id} className="bg-card/50 rounded-2xl border border-border p-5 flex items-center justify-between gap-4 opacity-60">
                        <div className="flex items-center gap-4">
                          <span className={`font-body text-xs px-2.5 py-1 rounded-full ${SOURCE_COLORS[r.source] || SOURCE_COLORS.blocked}`}>
                            {SOURCE_LABELS[r.source] || r.source}
                          </span>
                          <div>
                            <p className="font-body font-medium text-foreground text-sm">{r.label}</p>
                            <p className="font-body text-xs text-muted-foreground mt-0.5">
                              {new Date(r.arrival).toLocaleDateString('fr-FR')} → {new Date(r.departure).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <button onClick={() => handleDelete(r.id, r.label)} className="w-8 h-8 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0">✕</button>
                      </div>
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        )}

        {/* ADD TAB */}
        {tab === 'add' && (
          <div className="max-w-xl pb-12">
            <h2 className="font-heading text-xl font-light text-foreground mb-6">Ajouter une réservation</h2>
            <form onSubmit={handleAdd} className="bg-card rounded-2xl border border-border p-8 space-y-5">
              <div>
                <label className="block font-body text-sm font-medium text-foreground mb-1.5">Nom / Label *</label>
                <input
                  type="text" required value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  placeholder="Ex: Famille Martin, Bloqué entretien..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">Arrivée *</label>
                  <input
                    type="date" required value={form.arrival}
                    onChange={e => setForm({ ...form, arrival: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-body text-sm font-medium text-foreground mb-1.5">Départ *</label>
                  <input
                    type="date" required value={form.departure}
                    min={form.arrival || undefined}
                    onChange={e => setForm({ ...form, departure: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-foreground mb-1.5">Source</label>
                <select
                  value={form.source}
                  onChange={e => setForm({ ...form, source: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                >
                  <option value="direct">Réservation directe</option>
                  <option value="airbnb">Airbnb</option>
                  <option value="booking">Booking</option>
                  <option value="blocked">Bloqué (entretien, etc.)</option>
                </select>
              </div>
              <div>
                <label className="block font-body text-sm font-medium text-foreground mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Informations supplémentaires..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors resize-none"
                />
              </div>
              <button
                type="submit" disabled={saving}
                className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-60"
              >
                {saving ? 'Enregistrement...' : 'Ajouter la réservation'}
              </button>
            </form>
          </div>
        )}

        {/* SYNC TAB */}
        {tab === 'sync' && (
          <div className="max-w-xl pb-12">
            <h2 className="font-heading text-xl font-light text-foreground mb-2">Synchroniser les calendriers</h2>
            <p className="font-body text-sm text-muted-foreground mb-6">
              Importe les réservations depuis Airbnb et Booking directement dans Firebase.
              Les réservations déjà existantes ne seront pas dupliquées.
            </p>

            <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
              {ICAL_SOURCES.map(s => (
                <div key={s.source} className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${s.source === 'airbnb' ? 'bg-red-400' : 'bg-yellow-400'}`} />
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">{s.name}</p>
                    <p className="font-body text-xs text-muted-foreground truncate max-w-xs">{s.url.slice(0, 50)}...</p>
                  </div>
                </div>
              ))}

              <button
                onClick={handleSync}
                disabled={syncing}
                className="w-full py-3 bg-primary text-primary-foreground rounded-full font-body font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-60 mt-4 flex items-center justify-center gap-2"
              >
                {syncing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                    Synchronisation...
                  </>
                ) : '🔄 Lancer la synchronisation'}
              </button>

              {syncLog && (
                <pre className="bg-muted rounded-xl p-4 font-body text-xs text-foreground whitespace-pre-wrap mt-4 leading-relaxed">
                  {syncLog}
                </pre>
              )}
            </div>

            <p className="font-body text-xs text-muted-foreground mt-4 text-center">
              💡 Lance cette synchro manuellement après chaque réservation Airbnb ou Booking pour mettre à jour le calendrier sur le site.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
