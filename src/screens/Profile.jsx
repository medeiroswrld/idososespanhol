import React from 'react';
import { useUser } from '../context/UserContext';
import { LogOut, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

export default function Profile() {
  const { user, t, logout, updateConfiguracion, updateUser } = useUser();
  const navigate = useNavigate();

  const achievements = [
    {
      id: 'first',
      title: 'Primeros Pasos',
      desc: 'Completaste tu primer día',
      emoji: '🌅',
      unlocked: user.progreso.diasCompletados >= 1
    },
    {
      id: 'week',
      title: 'Semana Completa',
      desc: '7 días seguidos',
      emoji: '🔥',
      unlocked: user.progreso.racha >= 7
    },
    {
      id: 'cognitive',
      title: 'Día Lleno',
      desc: '3 actividades el mismo día',
      emoji: '🌟',
      unlocked: user.progreso.diasCompletados >= 1 // Fallback rule for MVP
    },
  ];

  const handleDownloadCert = (achievement) => {
    const doc = new jsPDF('landscape');
    
    // Simple Certificate
    doc.setFillColor(255, 251, 245); // background-light
    doc.rect(0, 0, 297, 210, 'F');
    
    doc.setDrawColor(232, 98, 42); // primary
    doc.setLineWidth(5);
    doc.rect(10, 10, 277, 190);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(40);
    doc.setTextColor(232, 98, 42);
    doc.text("Certificado de Logro", 148, 60, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.setTextColor(26, 26, 46);
    doc.text("Este certificado se otorga a", 148, 90, null, null, "center");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(30);
    doc.text(user.nombre, 148, 115, null, null, "center");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(20);
    doc.text(`por haber obtenido el logro: "${achievement.title}"`, 148, 140, null, null, "center");

    doc.setFontSize(14);
    const date = new Date().toLocaleDateString(user.idioma === 'pt' ? 'pt-BR' : 'es-MX');
    doc.text(`Fecha: ${date}`, 148, 170, null, null, "center");

    doc.save(`Certificado_${achievement.title.replace(' ', '_')}.pdf`);
  };

  return (
    <div className="px-4 py-2 space-y-6 pb-24 animate-in fade-in zoom-in duration-300">
      
      {/* Back Button */}
      <div className="mt-2 mb-4">
        <button onClick={() => navigate('/')} className="p-2 -ml-1 rounded-xl hover:bg-[#E8E0D8]/40 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
          <ArrowLeft size={24} className="text-primary" />
        </button>
      </div>

      {/* Header Info */}
      <div className="flex items-center space-x-6 bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-[#E8E0D8] dark:border-slate-700">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-white shadow-inner">
          {user.nombre.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-primary mb-1">{user.nombre}</h2>
          <p className="text-lg text-text-sec dark:text-dark-text/70 font-bold">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-[#E8E0D8] dark:border-slate-700 text-center">
          <div className="text-4xl font-bold text-primary mb-2">{user.progreso.diasCompletados}</div>
          <div className="text-sm font-bold text-text-sec uppercase tracking-wide">{t('diasTotales')}</div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-[#E8E0D8] dark:border-slate-700 text-center">
          <div className="text-4xl font-bold text-secondary mb-2">{user.progreso.racha}</div>
          <div className="text-sm font-bold text-text-sec uppercase tracking-wide">{t('rachaActual')}</div>
        </div>
      </section>

      {/* Achievements */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold px-2">{t('logros')}</h3>
        <div className="space-y-4">
          {achievements.map(a => (
            <div key={a.id} className={`bg-white rounded-3xl border-2 flex items-center p-5 ${a.unlocked ? 'border-[#E8E0D8]' : 'border-gray-100 opacity-60 grayscale'}`}>
              <div className={`p-4 text-4xl rounded-full mr-4 ${a.unlocked ? 'bg-[#EAF4FF]' : 'bg-gray-100'}`}>
                {a.emoji}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-xl text-text-main">{a.title}</h4>
                <p className="text-base text-text-sec font-bold">{a.desc}</p>
              </div>
              {a.unlocked && (
                <button 
                  onClick={() => handleDownloadCert(a)}
                  className="p-4 text-secondary hover:bg-secondary/10 rounded-2xl transition-colors active:scale-95"
                  title="Descargar Certificado"
                >
                  <Download size={28} />
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h3 className="text-2xl font-bold px-2">{t('configuracion')}</h3>
        <div className="bg-white dark:bg-dark-card border-2 border-[#E8E0D8] dark:border-slate-700 rounded-3xl p-6 space-y-6">
          
          <div className="flex items-center justify-between">
            <span className="font-bold text-xl">{t('idioma')}</span>
            <select 
              value={user.idioma}
              onChange={(e) => {
                updateUser({ idioma: e.target.value });
              }}
              className="px-4 py-3 border-2 border-[#E8E0D8] rounded-xl bg-white min-h-[56px] text-lg font-bold text-text-main"
            >
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>
          
          <div className="h-px bg-[#E8E0D8] w-full" />

          <div className="flex items-center justify-between">
            <span className="font-bold text-xl">{t('tamanoFuente')}</span>
            <select 
              value={user.configuracion.tamanoFuente}
              onChange={(e) => updateConfiguracion('tamanoFuente', e.target.value)}
              className="px-4 py-3 border-2 border-[#E8E0D8] rounded-xl bg-white min-h-[56px] text-lg font-bold text-text-main"
            >
              <option value="normal">{t('fuenteNormal')}</option>
              <option value="grande">{t('fuenteGrande')}</option>
              <option value="muy-grande">{t('fuenteMuyGrande')}</option>
            </select>
          </div>

          <div className="h-px bg-[#E8E0D8] w-full" />

          <div className="flex items-center justify-between">
            <span className="font-bold text-xl">{t('modoOscuro')}</span>
            <button 
              onClick={() => updateConfiguracion('modoOscuro', !user.configuracion.modoOscuro)}
              className={`w-16 h-8 flex items-center rounded-full p-1 transition-colors ${user.configuracion.modoOscuro ? 'bg-primary' : 'bg-[#E8E0D8]'}`}
            >
              <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform ${user.configuracion.modoOscuro ? 'translate-x-8' : ''}`} />
            </button>
          </div>

        </div>
      </section>

      {/* Logout */}
      <button 
        onClick={logout}
        className="w-full flex items-center justify-center py-5 text-red-600 font-bold bg-[#FFFBF5] border-2 border-red-200 rounded-2xl hover:bg-red-50 hover:border-red-300 active:scale-95 transition-all text-xl mt-8"
      >
        <LogOut size={28} className="mr-3" />
        {t('cerrarSesion')}
      </button>

    </div>
  );
}
