import React, { useState } from 'react';
import { useUser } from '../context/UserContext';

export default function Onboarding() {
  const { updateUser, t } = useUser();
  const [step, setStep] = useState(0);

  const slides = [
    {
      emoji: "🧠",
      title: "Activa tu mente cada día",
      desc: "Ejercicios cognitivos diseñados especialmente para adultos mayores",
      bgClass: "bg-[#FFFBF5]" // background-light
    },
    {
      emoji: "💪",
      title: "A tu propio ritmo",
      desc: "Actividades físicas suaves adaptadas para ti — sin presión",
      bgClass: "bg-[#FFF3E8]" // background-alt
    },
    {
      emoji: "📚",
      title: "Tu biblioteca personal",
      desc: "Accede a guías y actividades, tradúcelas a tu idioma e imprímelas",
      bgClass: "bg-[#EAF4FF]" // Light blue for contrast
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      updateUser({ isOnboarded: true });
    }
  };

  const currentSlide = slides[step];

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 ${currentSlide.bgClass} transition-colors duration-500`}>
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md text-center text-text-main">
        
        <div className="text-9xl mb-12 animate-bounce" style={{animationDuration: '3s'}}>
          {currentSlide.emoji}
        </div>
        
        <h1 className="text-4xl font-bold mb-6 text-primary">
          {currentSlide.title}
        </h1>
        
        <p className="text-2xl text-text-sec px-4 leading-relaxed font-bold">
          {currentSlide.desc}
        </p>
        
      </div>

      <div className="w-full max-w-md pb-12 flex flex-col items-center space-y-8">
        <div className="flex space-x-4">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-4 rounded-full transition-all duration-300 ${i === step ? 'w-12 bg-primary' : 'w-4 bg-[#E8E0D8]'}`} 
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          className="btn-primary w-full text-2xl py-6"
        >
          {step === slides.length - 1 ? "¡Empezar mi primera actividad!" : "Siguiente"}
        </button>
      </div>
    </div>
  );
}
