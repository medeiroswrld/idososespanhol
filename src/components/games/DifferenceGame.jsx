import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const LEVELS = [
  { icons: ['🍎', '🍎', '🍎', '🍅'], diffIndex: 3 },
  { icons: ['🐶', '🐱', '🐶', '🐶'], diffIndex: 1 },
  { icons: ['🚗', '🚗', '🚙', '🚗'], diffIndex: 2 },
  { icons: ['☀️', '☀️', '☀️', '🌕'], diffIndex: 3 }
];

export default function DifferenceGame() {
  const navigate = useNavigate();
  const { t, completeActivity } = useUser();
  const [level, setLevel] = useState(0);
  const [status, setStatus] = useState('playing'); // playing, done
  
  const handleSelect = (index) => {
    if (index === LEVELS[level].diffIndex) {
      if (level < LEVELS.length - 1) {
        setLevel(l => l + 1);
      } else {
        setStatus('done');
        completeActivity('game-difference');
      }
    } else {
      // Just a simple visual feedback can be added, for now keep simple MVP
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light p-4 animate-in fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-heading font-bold ml-2">¿Cuál es Diferente?</h1>
        <div className="ml-auto font-bold text-gray-500">{level + 1} / {LEVELS.length}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-8">
        
        {status === 'playing' && (
          <>
            <p className="text-xl text-center mb-4">Toca la imagen que es distinta a las demás.</p>
            <div className="grid grid-cols-2 gap-4 w-full">
              {LEVELS[level].icons.map((icon, i) => (
                <button 
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="aspect-square bg-white shadow-sm border border-gray-100 rounded-2xl flex items-center justify-center text-7xl hover:bg-primary/5 active:scale-95 transition-transform"
                >
                  {icon}
                </button>
              ))}
            </div>
          </>
        )}

        {status === 'done' && (
          <div className="mt-8 text-center pb-safe-offset-top">
            <h2 className="text-2xl font-bold text-primary mb-4">{t('wellDone')}</h2>
            <button onClick={() => navigate(-1)} className="btn-primary w-full max-w-xs mx-auto">
              {t('continueBtn')}
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
