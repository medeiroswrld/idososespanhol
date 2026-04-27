import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const ICONS = ['🍎', '🐶', '🌸', '🚗', '🎈', '🎸', '🌟', '🍕'];

export default function MemoryGame() {
  const navigate = useNavigate();
  const { t, completeActivity } = useUser();
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [solved, setSolved] = useState([]);
  const [moves, setMoves] = useState(0);

  useEffect(() => {
    // 4x4 grid -> 8 pairs
    const deck = [...ICONS, ...ICONS].sort(() => Math.random() - 0.5).map((icon, id) => ({ id, icon }));
    setCards(deck);
  }, []);

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || solved.includes(index)) return;
    
    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const match = cards[newFlipped[0]].icon === cards[newFlipped[1]].icon;
      if (match) {
        setSolved(s => [...s, ...newFlipped]);
        setFlipped([]);
        if (solved.length + 2 === cards.length) {
          setTimeout(() => {
            completeActivity('dr-jog-1');
            alert(t('congratsDay'));
          }, 500);
        }
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light p-4 animate-in fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-heading font-bold ml-2">Memoria de Pares</h1>
        <div className="ml-auto font-bold text-gray-500">Movimientos: {moves}</div>
      </div>

      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto flex-1 place-content-center">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || solved.includes(i);
          return (
            <div 
              key={card.id}
              onClick={() => handleCardClick(i)}
              className={`aspect-square flex items-center justify-center text-4xl rounded-2xl cursor-pointer transition-all duration-300 transform ${
                isFlipped ? 'bg-white shadow-md rotate-y-180' : 'bg-primary/20 shadow-inner'
              }`}
            >
              {isFlipped ? card.icon : ''}
            </div>
          );
        })}
      </div>
      
      {solved.length === cards.length && cards.length > 0 && (
        <div className="mt-8 text-center pb-safe-offset-top">
          <h2 className="text-2xl font-bold text-primary mb-4">{t('wellDone')}</h2>
          <button onClick={() => navigate(-1)} className="btn-primary w-full max-w-xs mx-auto">
            {t('continueBtn')}
          </button>
        </div>
      )}
    </div>
  );
}
