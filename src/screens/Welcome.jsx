import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function Welcome() {
  const navigate = useNavigate();
  const { t } = useUser();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background-light">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center space-y-8 mt-12">
        
        <div className="text-8xl mb-8 animate-bounce" style={{animationDuration: '3s'}}>
          👵🏽👴🏼
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl text-primary font-bold">VivaMente</h1>
          <p className="text-2xl text-text-sec px-4 leading-relaxed font-bold">
            "Activa tu mente, cuida tu cuerpo — cada día."
          </p>
        </div>

      </div>

      <div className="w-full max-w-md space-y-6 pb-12">
        <button 
          onClick={() => navigate('/register')}
          className="btn-primary w-full text-2xl py-5"
        >
          {t('empezarAhora')}
        </button>
        <button 
          onClick={() => navigate('/login')}
          className="w-full text-xl text-primary font-bold hover:text-primary-hover active:scale-95 transition-all p-3"
        >
          {t('yaTengoCuenta')}
        </button>
      </div>
    </div>
  );
}
