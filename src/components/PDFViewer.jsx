import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Printer, Globe, ExternalLink } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';

// For production stability, we can also use the CDN worker as a fallback if needed
// but let's try to ensure the bundled one is used correctly.
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

export default function PDFViewer({ ebook, onClose }) {
  const { t, user } = useUser();
  const [pdfDoc, setPdfDoc] = useState(null);
  const [pageNum, setPageNum] = useState(1);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef(null);
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [error, setError] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Attempting to load PDF from:", ebook.pdfUrl);
        
        const loadingTask = pdfjsLib.getDocument({
          url: ebook.pdfUrl,
          // Add some options for better compatibility
          withCredentials: false
        });
        
        const pdf = await loadingTask.promise;
        setPdfDoc(pdf);
        setPageNum(1);
        setLoading(false);
      } catch (err) {
        console.error("PDF.js Error:", err);
        setError(`${err.message || "Failed to load"}. URL: ${ebook.pdfUrl}`);
        setLoading(false);
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
    try {
      const page = await pdfDoc.getPage(num);
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      let viewport = page.getViewport({ scale: scale });
      const parentWidth = canvas.parentElement.clientWidth;
      const fitScale = (parentWidth - 32) / viewport.width;
      viewport = page.getViewport({ scale: fitScale * scale });

      const ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      const renderContext = {
        canvasContext: ctx,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Render Error:", err);
    }
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
    const title = ebook.titulo;
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
        <div className="w-10"></div> {/* Spacer for symmetry */}
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
           <div className="flex-1 flex flex-col items-center justify-center space-y-6 px-6 text-center">
             <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-3xl border border-red-100 dark:border-red-800">
               <div className="text-red-500 font-bold text-lg mb-2">Erro ao carregar o livro</div>
               <div className="text-gray-500 text-xs sm:text-sm break-all font-mono mb-4">{error}</div>
               
               <div className="flex flex-col space-y-3">
                 <button 
                  onClick={() => window.open(ebook.pdfUrl, '_blank')}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm py-3"
                 >
                   <ExternalLink size={18} />
                   <span>Abrir PDF Original</span>
                 </button>
                 
                 <button 
                  onClick={() => window.location.reload()} 
                  className="text-primary font-bold text-sm hover:underline"
                 >
                   Tentar novamente
                 </button>
               </div>
             </div>
             
             <p className="text-gray-400 text-xs max-w-xs">
               Se o PDF abrir no botão acima mas não aqui, pode ser um problema de compatibilidade do navegador ou do visualizador interno.
             </p>
           </div>
        ) : loading ? (
           <div className="flex-1 flex flex-col items-center justify-center space-y-4">
             <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
             <p className="text-primary font-bold animate-pulse">Cargando...</p>
           </div>
        ) : (
          <div className="relative w-full max-w-md mx-auto card shadow-md p-0.5 sm:p-1 mb-4">
            <canvas ref={canvasRef} className="w-full h-auto rounded-lg" />
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
            disabled={!pdfDoc}
            onClick={handleTranslate}
            className="p-2.5 sm:p-3 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded-full shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30"
          >
            <Globe size={20} />
          </button>
          <button 
            disabled={!pdfDoc}
            onClick={() => setShowPrintModal(true)}
            className="p-2.5 sm:p-3 bg-primary/10 text-primary rounded-full shadow-sm min-w-[44px] min-h-[44px] flex items-center justify-center disabled:opacity-30"
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
