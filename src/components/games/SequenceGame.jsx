import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export default function SequenceGame() {
  const navigate = useNavigate();
  const { t, completeActivity } = useUser();
  
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState([]);
  const [status, setStatus] = useState('waiting'); // waiting, showing, input, success, fail
  const [userInput, setUserInput] = useState('');

  const generateSequence = (length) => {
    let seq = '';
    for (let i = 0; i < length; i++) {
       seq += Math.floor(Math.random() * 10).toString();
    }
    return seq;
  };

  const startLevel = (lvl) => {
    setStatus('showing');
    setUserInput('');
    const len = 3 + lvl; // lvl 1 => 4 digits
    const seq = generateSequence(len);
    setSequence(seq);

    setTimeout(() => {
      setStatus('input');
    }, 3000); // show for 3 seconds
  };

  const handleStart = () => {
    startLevel(level);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (userInput === sequence) {
      if (level >= 3) {
        setStatus('done');
        completeActivity('game-sequence'); // Add a generic ID
      } else {
        setStatus('success');
        setTimeout(() => {
          setLevel(l => l + 1);
          startLevel(level + 1);
        }, 1500);
      }
    } else {
      setStatus('fail');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light p-4 animate-in fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-heading font-bold ml-2">Secuencia Numérica</h1>
        <div className="ml-auto font-bold text-gray-500">Nivel: {level}</div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full space-y-8">
        
        {status === 'waiting' && (
          <div className="text-center space-y-6">
            <p className="text-lg">Memoriza la secuencia de números.</p>
            <button onClick={handleStart} className="btn-primary w-full max-w-[200px] mx-auto">
              Comenzar
            </button>
          </div>
        )}

        {status === 'showing' && (
          <div className="text-6xl font-heading font-bold tracking-widest text-primary animate-pulse">
            {sequence}
          </div>
        )}

        {status === 'input' && (
          <form onSubmit={handleSubmit} className="w-full space-y-6 text-center">
            <p className="text-lg">Ingresa la secuencia:</p>
            <input 
              type="number"
              autoFocus
              className="text-center text-4xl tracking-[0.25em] font-heading font-bold"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <button type="submit" className="btn-primary w-full">Confirmar</button>
          </form>
        )}

        {status === 'success' && (
          <div className="text-3xl font-bold text-primary">
            ¡Correcto!
          </div>
        )}

        {status === 'fail' && (
          <div className="text-center space-y-6">
            <div className="text-2xl font-bold text-red-500">
              Incorrecto
            </div>
            <p>La secuencia era: {sequence}</p>
            <button onClick={() => startLevel(level)} className="btn-primary w-full max-w-[200px] mx-auto">
              {t('tryAgain')}
            </button>
          </div>
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
