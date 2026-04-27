import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useUser } from '../../context/UserContext';

const GRID = [
  ['M','A','N','Z','A','N','A','P'],
  ['E','X','D','C','B','A','Q','E'],
  ['L','P','L','A','T','A','N','R'],
  ['O','O','M','A','N','G','O','A'],
  ['N','T','F','R','E','S','A','L'],
  ['K','W','U','V','A','S','Z','Y']
];

const WORDS = [
  { text: 'MANZANA', found: false },
  { text: 'PLATANO', found: false },
  { text: 'PERA', found: false },
  { text: 'MANGO', found: false },
  { text: 'FRESA', found: false },
  { text: 'UVAS', found: false },
  { text: 'MELON', found: false }
];

export default function WordSearch() {
  const navigate = useNavigate();
  const { t, completeActivity } = useUser();
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundCells, setFoundCells] = useState([]);
  const [words, setWords] = useState(WORDS);

  const handleCellClick = (r, c) => {
    const id = `${r}-${c}`;
    if (foundCells.includes(id)) return;

    if (selectedCells.includes(id)) {
      setSelectedCells(selectedCells.filter(cell => cell !== id));
    } else {
      const newSelected = [...selectedCells, id];
      setSelectedCells(newSelected);
      checkWord(newSelected);
    }
  };

  const checkWord = (selected) => {
    // Collect chars
    const str = selected.map(id => {
      const [r, c] = id.split('-');
      return GRID[r][c];
    }).join('');
    
    // Check direct and reverse
    const reversed = str.split('').reverse().join('');
    
    const wordIndex = words.findIndex(w => !w.found && (w.text === str || w.text === reversed));
    
    if (wordIndex !== -1) {
      const updatedWords = [...words];
      updatedWords[wordIndex].found = true;
      setWords(updatedWords);
      setFoundCells([...foundCells, ...selected]);
      setSelectedCells([]);
      
      if (updatedWords.every(w => w.found)) {
        setTimeout(() => {
          completeActivity('dr-cog-1'); // Sopa de letras daily program ID
        }, 500);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-light p-4 animate-in fade-in">
      <div className="flex items-center mb-6">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-200">
          <ArrowLeft size={28} />
        </button>
        <h1 className="text-xl font-heading font-bold ml-2">Sopa de Letras</h1>
      </div>

      <div className="flex flex-wrap gap-2 justify-center mb-6">
        {words.map((w, i) => (
          <span key={i} className={`px-3 py-1 text-sm font-bold rounded-full ${w.found ? 'bg-primary text-white line-through opacity-70' : 'bg-gray-200 text-gray-700'}`}>
            {w.text}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-8 gap-1 max-w-md mx-auto flex-1 w-full place-content-start">
        {GRID.map((row, r) => (
          row.map((char, c) => {
            const id = `${r}-${c}`;
            const isSelected = selectedCells.includes(id);
            const isFound = foundCells.includes(id);
            return (
              <div
                key={id}
                onClick={() => handleCellClick(r, c)}
                className={`aspect-square flex items-center justify-center text-xl font-bold cursor-pointer rounded-lg select-none transition-colors ${
                  isFound ? 'bg-primary text-white' : 
                  isSelected ? 'bg-secondary text-white' : 
                  'bg-white border border-gray-200 text-gray-800'
                }`}
              >
                {char}
              </div>
            );
          })
        ))}
      </div>
      
      {words.every(w => w.found) && (
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
