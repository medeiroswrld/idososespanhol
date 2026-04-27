import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Flame, CheckCircle, BookOpen, Gamepad2 } from 'lucide-react';

export default function Home() {
  const { user, t } = useUser();
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting(t('buenosDias'));
    else if (hour < 18) setGreeting(t('buenasTardes'));
    else setGreeting(t('buenasNoches'));
  }, [t]);

  const getWeekProgress = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const str = d.toISOString().split('T')[0];
      const hasCompletedAtLeastOne = user.progreso.actividadesCompletadas.some(a => a.fecha === str);
      days.push({
        date: d,
        completed: hasCompletedAtLeastOne
      });
    }
    return days;
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in duration-300 pb-28">
      
      {/* Header */}
      <div className="bg-white dark:bg-dark-card p-5 rounded-3xl shadow-sm border border-[#E8E0D8] dark:border-slate-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
          {greeting}, {user.nombre.split(' ')[0]}! 👋
        </h1>
        <div className="flex items-center text-text-sec dark:text-dark-text/70 font-bold text-lg">
          <Flame size={24} className="mr-2 text-primary" />
          <span>¡Racha de {user.progreso.racha} días!</span>
        </div>
      </div>

      {/* Quick Access */}
      <section className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => navigate('/library')}
          className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-[#E8E0D8] dark:border-slate-700 flex flex-col items-center space-y-3 active:scale-95 transition-all hover:shadow-sm"
        >
          <div className="bg-[#EAF4FF] p-3 rounded-xl">
            <BookOpen size={28} className="text-[#1565C0]" />
          </div>
          <span className="font-bold text-base text-text-main dark:text-dark-text">{t('biblioteca')}</span>
        </button>
        <button 
          onClick={() => navigate('/games')}
          className="bg-white rounded-2xl p-5 border border-[#E8E0D8] flex flex-col items-center space-y-3 active:scale-95 transition-all hover:shadow-sm"
        >
          <div className="bg-[#FCE4EC] p-3 rounded-xl">
            <Gamepad2 size={28} className="text-[#880E4F]" />
          </div>
          <span className="font-bold text-base text-text-main dark:text-dark-text">{t('juegos')}</span>
        </button>
      </section>

      {/* Week Progress */}
      <section className="space-y-3">
        <h2 className="text-xl font-bold px-1">{t('tuProgreso')}</h2>
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-[#E8E0D8] dark:border-slate-700 p-5 flex justify-between">
          {getWeekProgress().map((day, i) => {
            const dayName = day.date.toLocaleDateString(user.idioma, { weekday: 'narrow' });
            return (
              <div key={i} className="flex flex-col items-center space-y-2">
                <span className="text-sm uppercase font-bold text-text-sec">{dayName}</span>
                {day.completed ? (
                  <CheckCircle size={28} className="text-primary" />
                ) : (
                  <div className="w-7 h-7 rounded-full border-3 border-[#E8E0D8] bg-background-light"></div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}

