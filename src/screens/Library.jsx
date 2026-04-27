import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Search, BookOpen, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';

export default function Library() {
  const { user } = useUser();
  const [search, setSearch] = useState('');
  const [activeEbook, setActiveEbook] = useState(null);
  const navigate = useNavigate();

  if (activeEbook) {
    return <PDFViewer ebook={activeEbook} onClose={() => setActiveEbook(null)} />;
  }

  const searchedLibrary = user.library?.filter(ebook => {
    if (search && !ebook.titulo.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  const cognitivos = searchedLibrary.filter(e => e.categoria === 'cognitivo');
  const fisicos = searchedLibrary.filter(e => e.categoria === 'fisico');
  const jogos = searchedLibrary.filter(e => e.categoria === 'jogos');

  const sections = [
    { title: 'Atividades Cognitivas', emoji: '🧠', items: cognitivos, bg: '#EAF4FF', accent: '#1565C0' },
    { title: 'Atividades Físicas', emoji: '🏃', items: fisicos, bg: '#FFF3E0', accent: '#E65100' },
    { title: 'Jogos para Idosos', emoji: '🎲', items: jogos, bg: '#FCE4EC', accent: '#880E4F' },
  ];

  return (
    <div className="px-3 sm:px-4 py-2 animate-in fade-in zoom-in duration-300 pb-28">
      
      {/* Header */}
      <div className="flex items-center space-x-3 mt-3 mb-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-1 rounded-xl hover:bg-[#E8E0D8]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <div className="bg-[#E8E0D8]/40 p-2.5 rounded-xl">
          <BookOpen size={24} className="text-primary"/>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-primary font-heading">Biblioteca</h1>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-sec" size={18} />
        <input 
          type="text" 
          placeholder="Buscar ebook..."
          className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-[#E8E0D8] bg-white focus:ring-4 focus:ring-primary/20 text-sm sm:text-base font-bold text-text-main"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sections */}
      {sections.map(section => {
        if (section.items.length === 0) return null;
        return (
          <div key={section.title} className="mb-5">
            {/* Section Header */}
            <div 
              className="flex items-center space-x-2.5 px-3 py-2.5 rounded-xl mb-2"
              style={{ backgroundColor: section.bg }}
            >
              <span className="text-xl">{section.emoji}</span>
              <h2 className="text-sm sm:text-base font-bold font-heading flex-1" style={{ color: section.accent }}>
                {section.title}
              </h2>
              <span 
                className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: section.accent + '20', color: section.accent }}
              >
                {section.items.length}
              </span>
            </div>

            {/* Items List */}
            <div className="space-y-2">
              {section.items.map(ebook => (
                <button
                  key={ebook.id}
                  onClick={() => setActiveEbook(ebook)}
                  className="w-full bg-white border border-[#E8E0D8] rounded-xl flex items-center p-2.5 sm:p-3 transform active:scale-[0.98] transition-all text-left hover:border-primary/30 hover:shadow-sm min-h-[56px]"
                >
                  <div 
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                    style={{ backgroundColor: ebook.corCapa }}
                  >
                    {ebook.icono}
                  </div>
                  <div className="ml-2.5 sm:ml-3 flex-1 min-w-0">
                    <h3 className="font-bold text-sm sm:text-base text-text-main leading-snug line-clamp-2">
                      {ebook.titulo}
                    </h3>
                  </div>
                  <ChevronRight size={18} className="ml-1.5 text-primary flex-shrink-0 opacity-60" />
                </button>
              ))}
            </div>
          </div>
        );
      })}

      {searchedLibrary.length === 0 && (
        <div className="text-center py-12 text-text-sec font-bold text-base">
          Nenhum ebook encontrado.
        </div>
      )}

    </div>
  );
}

