import React, { useState, useEffect } from 'react';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy } from 'firebase/firestore';

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

const MONTHS_FR = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const DAYS_FR = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function isDateBlocked(date, reservations) {
  const d = date.toISOString().slice(0, 10);
  return reservations.some(r => d >= r.arrival && d < r.departure);
}

function isDatePast(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  // Monday = 0
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function CalendrierPublic() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'reservations'), orderBy('arrival'));
    const unsub = onSnapshot(q, (snap) => {
      setReservations(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, () => setLoading(false));
    return unsub;
  }, []);

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  // Build calendar grid
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const SOURCE_COLORS = {
    airbnb: '#E67C73',
    booking: '#F6BF26',
    direct: '#2D5A3D',
    blocked: '#9E9E9E',
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header navigation */}
      <div className="flex items-center justify-between mb-6 px-2">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors font-body text-foreground"
        >
          ‹
        </button>
        <h3 className="font-heading text-2xl font-light text-foreground">
          {MONTHS_FR[currentMonth]} {currentYear}
        </h3>
        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors font-body text-foreground"
        >
          ›
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS_FR.map(d => (
          <div key={d} className="text-center font-body text-xs text-muted-foreground py-2 tracking-wide uppercase">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;

            const date = new Date(currentYear, currentMonth, day);
            const isPast = isDatePast(date);
            const blocked = isDateBlocked(date, reservations);

            // Find which reservation this day belongs to
            const resa = reservations.find(r => {
              const d = date.toISOString().slice(0, 10);
              return d >= r.arrival && d < r.departure;
            });

            const isToday = date.toISOString().slice(0, 10) === today.toISOString().slice(0, 10);

            return (
              <div
                key={day}
                className={`
                  aspect-square rounded-lg flex items-center justify-center text-sm font-body
                  transition-all duration-200 relative
                  ${isPast ? 'opacity-30' : ''}
                  ${isToday ? 'ring-2 ring-primary ring-offset-1' : ''}
                  ${blocked
                    ? 'text-white font-medium'
                    : 'text-foreground hover:bg-muted/60'
                  }
                `}
                style={blocked ? { backgroundColor: SOURCE_COLORS[resa?.source] || SOURCE_COLORS.blocked } : {}}
                title={blocked && resa ? `${resa.label || 'Réservé'} (${resa.source})` : ''}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}

      {/* Légende */}
      <div className="flex flex-wrap justify-center gap-5 mt-6 font-body text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SOURCE_COLORS.direct }} />
          Réservation directe
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SOURCE_COLORS.airbnb }} />
          Airbnb
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SOURCE_COLORS.booking }} />
          Booking
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block" style={{ background: SOURCE_COLORS.blocked }} />
          Bloqué
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm border border-border inline-block bg-card" />
          Disponible
        </div>
      </div>

      <p className="font-body text-xs text-muted-foreground text-center mt-3">
        🔄 Synchronisé en temps réel
      </p>
    </div>
  );
}
