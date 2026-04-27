import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Printer, Globe } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Setting worker path correctly for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ ebook, onClose }) {
  const { t, user } = useUser();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0); // Simple zoom for desktop/tablet mode
  const canvasRef = useRef(null);
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setError(null);
        console.log("Loading PDF url:", ebook.pdfUrl);
        const loadingTask = pdfjsLib.getDocument(ebook.pdfUrl);
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setPageNum(1); // Or load from user.library progress if desired
      } catch (error) {
        console.error("Error loading PDF", error);
        setError(error.message || "Failed to load PDF");
      }
    };
    loadPdf();
  }, [ebook.pdfUrl]);

  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(pageNum);
    }
  }, [pdfDoc, pageNum, scale]);

  const renderPage = async (num) => {
    if (!pdfDoc) return;
    const page = await pdfDoc.getPage(num);
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // In a real mobile app, responsive width is better. Here we set simple scale.
    // Fit to parent width
    let viewport = page.getViewport({ scale: scale });
    const parentWidth = canvas.parentElement.clientWidth;
    const fitScale = (parentWidth - 32) / viewport.width; // 32 is padding
    viewport = page.getViewport({ scale: fitScale * scale });

    const ctx = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };

    await page.render(renderContext).promise;
  };

  const handleTranslate = async () => {
    if (!pdfDoc) return;
    setTranslating(true);
    setTranslatedText('');
    
    try {
      const page = await pdfDoc.getPage(pageNum);
      const textContent = await page.getTextContent();
      const text = textContent.items.map(item => item.str).join(' ');

      if (!text.trim()) {
        setTranslatedText(t('translationFallback') + " (Página sin texto/texto imagen)");
        setTranslating(false);
        return;
      }

      const targetLang = user.language === 'pt' ? 'pt' : 'es';
      const encodedText = encodeURIComponent(text);
      
      const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodedText}`);

      if (!response.ok) throw new Error('Translation API error');

      const data = await response.json();
      
      // Google translate returns an array where data[0] contains translation segments
      if (data && data[0]) {
        const fullTranslation = data[0].map(segment => segment[0]).join('');
        setTranslatedText(fullTranslation);
      } else {
        throw new Error("Invalid translation payload");
      }
      
    } catch (err) {
      console.error(err);
      setTranslatedText(t('translationFallback'));
    } finally {
      setTranslating(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    const title = ebook.title;
    // Extract canvas image to print. Mobile-friendly basic print.
    const imgSrc = canvasRef.current.toDataURL();

    printWindow.document.write(`
      <html>
        <head>
          <title>Imprimir - ${title}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; font-family: sans-serif; }
              img { max-width: 100%; height: auto; }
            }
          </style>
        </head>
        <body>
          <h2>${title} - Página ${pageNum}</h2>
          <img src="${imgSrc}" />
          <script>
            window.onload = function() { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    setShowPrintModal(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex flex-col animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-3 sm:p-4 bg-primary shadow-sm z-10 w-full safe-area-top">
        <button onClick={onClose} className="p-2 -ml-1 rounded-full hover:bg-white/20 min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} className="text-white" />
        </button>
        <span className="font-heading font-bold text-sm sm:text-lg truncate flex-1 px-2 sm:px-4 text-center text-white">{ebook.titulo}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 dark:bg-slate-700 w-full">
        <div 
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${pdfDoc ? (pageNum / pdfDoc.numPages) * 100 : 0}%` }}
        />
      </div>

      {/* Main PDF Area */}
      <div className="flex-1 overflow-y-auto w-full flex flex-col items-center p-2 sm:p-4 pb-24">
        {error ? (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4 px-4">
             <div className="text-red-500 font-bold text-lg sm:text-xl">Erro ao carregar PDF</div>
             <div className="text-gray-500 text-xs sm:text-sm max-w-sm text-center">{error}</div>
             <button onClick={() => window.location.reload()} className="btn-primary mt-4 text-sm">Tentar novamente</button>
           </div>
        ) : pdfDoc ? (
          <div className="relative w-full max-w-md mx-auto card shadow-md p-0.5 sm:p-1 mb-4">
            <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
          </div>
        ) : (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
             <p className="text-primary font-bold animate-pulse">Cargando...</p>
           </div>
        )}

        {/* Translation Box */}
        {(translating || translatedText) && (
          <div className="w-full max-w-md mx-auto mt-4 p-5 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800/50 rounded-2xl mb-20 animate-in fade-in slide-in-from-bottom-4">
            <div className="flex items-center space-x-2 text-indigo-700 dark:text-indigo-300 font-bold mb-2">
              <Globe size={20} />
              <span>Traducción</span>
            </div>
            {translating ? (
              <p className="text-gray-600 dark:text-gray-400 italic flex items-center">
                <span className="animate-pulse">{t('translating')}</span>
              </p>
            ) : (
              <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{translatedText}</p>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 w-full bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border-t border-gray-200 dark:border-slate-700 px-3 py-2.5 sm:p-4 flex justify-between items-center z-20" style={{ paddingBottom: 'max(0.625rem, env(safe-area-inset-bottom))' }}>
        
        {/* Pagination */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            disabled={pageNum <= 1}
            onClick={() => setPageNum(p => p - 1)}
            className="p-2.5 sm:p-3 bg-gray-100 dark:bg-slate-700 rounded-full disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronLeft size={20} />
          </button>
          <span className="font-bold text-sm sm:text-base min-w-[3rem] text-center">
            {pageNum} / {pdfDoc?.numPages || '-'}
          </span>
          <button 
            disabled={!pdfDoc || pageNum >= pdfDoc.numPages}
            onClick={() => setPageNum(p => p + 1)}
            className="p-2.5 sm:p-3 bg-gray-100 dark:bg-slate-700 rounded-full disabled:opacity-50 min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex space-x-1.5 sm:space-x-2">
          <button 
            onClick={handleTranslate}
            className="p-2.5 sm:p-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Globe size={20} />
          </button>
          <button 
            onClick={() => setShowPrintModal(true)}
            className="p-2.5 sm:p-3 bg-primary/10 text-primary rounded-full shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Printer size={20} />
          </button>
        </div>

      </div>

      {/* Print Modal */}
      {showPrintModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-6">
            <h2 className="text-2xl font-bold font-heading">{t('printOptions')}</h2>
            
            <div className="space-y-3">
              <button onClick={handlePrint} className="w-full btn-primary px-4 py-3 min-h-0 h-auto">
                {t('printCurrentPage')}
              </button>
              <button 
                onClick={() => {
                  window.open(ebook.pdfUrl, '_blank');
                  setShowPrintModal(false);
                }} 
                className="w-full bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 font-bold px-4 py-3 rounded-xl min-h-0 h-auto transition-colors"
              >
                {t('printFullDoc')}
              </button>
            </div>

            <button onClick={() => setShowPrintModal(false)} className="w-full btn-outline">
              {t('cancel')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
