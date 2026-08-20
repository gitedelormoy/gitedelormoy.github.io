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
  let d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

export default function CalendrierPublic() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null); // Nouvelle ligne pour mémoriser le clic

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

  // Fonction déclenchée au clic sur une date
  const handleDateClick = (date, isPast, isBlocked) => {
    if (isPast || isBlocked) return; // On ne fait rien si c'est passé ou réservé
    
    const dateString = date.toISOString().slice(0, 10);
    setSelectedDate(dateString);

    // 1. On envoie un signal global que le formulaire va écouter
    window.dispatchEvent(new CustomEvent('ormoy-date-selected', { detail: date }));

    // 2. On fait scroller la page doucement vers le formulaire
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-2">
        <button onClick={prevMonth} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors font-body text-foreground">‹</button>
        <h3 className="font-heading text-2xl font-light text-foreground">{MONTHS_FR[currentMonth]} {currentYear}</h3>
        <button onClick={nextMonth} className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors font-body text-foreground">›</button>
      </div>

      <div className="grid grid-cols-7 mb-4">
        {DAYS_FR.map(d => (
          <div key={d} className="text-center font-body text-xs text-muted-foreground py-2 tracking-wide uppercase">{d}</div>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-y-4 gap-x-1">
          {cells.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} />;

            const date = new Date(currentYear, currentMonth, day);
            const isPast = isDatePast(date);
            const isBlocked = isDateBlocked(date, reservations);
            const dateString = date.toISOString().slice(0, 10);
            const isSelected = selectedDate === dateString;

            return (
              <div
                key={day}
                onClick={() => handleDateClick(date, isPast, isBlocked)}
                className={`
                  flex items-center justify-center text-sm font-body py-2 rounded-md transition-all
                  ${isPast || isBlocked ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${isPast && !isBlocked ? 'opacity-30' : ''}
                  ${isBlocked ? 'text-muted-foreground/50 line-through decoration-muted-foreground/50' : 'hover:bg-primary/10'}
                  ${isSelected ? 'bg-primary text-primary-foreground font-bold hover:bg-primary' : ''}
                  ${!isBlocked && !isSelected ? 'text-foreground' : ''}
                `}
              >
                {day}
              </div>
            );
          })}
        </div>
      )}

      <div className="flex justify-center gap-8 mt-8 font-body text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="line-through text-muted-foreground/50 decoration-muted-foreground/50">24</span>
          <span>Réservé</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-foreground">25</span>
          <span>Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground px-2 py-0.5 rounded-sm">26</span>
          <span>Sélectionné</span>
        </div>
      </div>
    </div>
  );
}
