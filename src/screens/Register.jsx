import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register, t } = useUser();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    pais: 'mx',
    idioma: 'es'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.nombre && formData.email) {
      register(formData);
    }
  };

  const countries = [
    { value: 'mx', label: 'México' },
    { value: 'ar', label: 'Argentina' },
    { value: 'co', label: 'Colombia' },
    { value: 'pe', label: 'Perú' },
    { value: 'cl', label: 'Chile' },
    { value: 'br', label: 'Brasil' },
    { value: 'other', label: 'Otro / Outro' }
  ];

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background-light">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 w-max rounded-full hover:bg-black/5 transition-colors">
        <ArrowLeft size={32} className="text-text-main" />
      </button>
      
      <div className="w-full max-w-md mx-auto space-y-8 flex-1">
        <h1 className="text-primary font-bold">{t('registrar')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-lg font-bold">{t('nombre')}</label>
            <input 
              type="text" 
              required
              className="w-full"
              value={formData.nombre}
              onChange={(e) => setFormData({...formData, nombre: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-bold">{t('correo')}</label>
            <input 
              type="email" 
              required
              placeholder="tu@email.com"
              className="w-full"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-lg font-bold">{t('pais')}</label>
            <select 
              className="w-full"
              value={formData.pais}
              onChange={(e) => setFormData({...formData, pais: e.target.value})}
            >
              {countries.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-lg font-bold">{t('idioma')}</label>
            <select 
              className="w-full"
              value={formData.idioma}
              onChange={(e) => setFormData({...formData, idioma: e.target.value})}
            >
              <option value="es">Español</option>
              <option value="pt">Português</option>
            </select>
          </div>

          <button type="submit" className="btn-primary w-full text-xl mt-8">
            {t('registrar')}
          </button>
        </form>
      </div>
    </div>
  );
}
