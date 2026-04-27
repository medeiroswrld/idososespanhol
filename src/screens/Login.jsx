import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { ArrowLeft } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, t } = useUser();
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      const success = login(email);
      if (!success) {
        setError(true);
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 bg-background-light">
      <button onClick={() => navigate(-1)} className="mb-6 p-2 w-max rounded-full hover:bg-black/5 transition-colors">
        <ArrowLeft size={32} className="text-text-main" />
      </button>
      
      <div className="w-full max-w-md mx-auto space-y-8 flex-1">
        <h1 className="text-primary font-bold text-4xl">{t('ingresar')}</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xl font-bold">{t('correo')}</label>
            <input 
              type="email" 
              required
              placeholder="tu@email.com"
              className={`w-full ${error ? 'border-red-500' : ''}`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError(false);
              }}
            />
            {error && <p className="text-red-500 text-sm font-bold mt-2">No encontrado / Não encontrado.</p>}
          </div>

          <button type="submit" className="btn-primary w-full text-2xl mt-8">
            {t('ingresar')}
          </button>
          
          <button 
            type="button"
            onClick={() => navigate('/register')}
            className="w-full text-center text-primary mt-4 py-4 text-xl font-bold hover:text-primary-hover"
          >
            {t('noTengoCuenta')}
          </button>
        </form>
      </div>
    </div>
  );
}
