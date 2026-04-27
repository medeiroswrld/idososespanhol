import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { Gamepad2, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PDFViewer from '../components/PDFViewer';

export default function Games() {
  const { user } = useUser();
  const [activeEbook, setActiveEbook] = useState(null);
  const navigate = useNavigate();

  if (activeEbook) {
    return <PDFViewer ebook={activeEbook} onClose={() => setActiveEbook(null)} />;
  }

  const jogos = user.library?.filter(e => e.categoria === 'jogos') || [];

  return (
    <div className="px-3 sm:px-4 py-2 animate-in fade-in zoom-in duration-300 pb-28">
      
      <div className="flex items-center space-x-3 mt-3 mb-5">
        <button onClick={() => navigate('/')} className="p-2 -ml-1 rounded-xl hover:bg-[#E8E0D8]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} className="text-primary" />
        </button>
        <div className="bg-[#E8E0D8]/40 p-2.5 rounded-xl">
          <Gamepad2 size={24} className="text-primary"/>
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-primary font-heading">Jogos para Idosos</h1>
          <p className="text-xs sm:text-sm text-text-sec font-medium">{jogos.length} ebooks disponíveis</p>
        </div>
      </div>

      <div className="space-y-2">
        {jogos.map((ebook) => (
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
              <h3 className="font-bold text-sm sm:text-base text-text-main leading-snug line-clamp-2">{ebook.titulo}</h3>
              <p className="text-xs sm:text-sm text-text-sec font-medium mt-0.5 line-clamp-1">{ebook.descricao}</p>
            </div>
            <ChevronRight size={18} className="ml-1.5 text-primary flex-shrink-0 opacity-60" />
          </button>
        ))}
      </div>

    </div>
  );
}

