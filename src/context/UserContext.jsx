import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/i18n';
import { biblioteca } from '../data/seedData';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUserEmail = localStorage.getItem('vivamente_logged_user');
    if (loggedUserEmail) {
      const userData = JSON.parse(localStorage.getItem(`vivamented_user_${loggedUserEmail}`));
      if (userData) {
        // Hydrate library with latest data to avoid stale cache missing fields like pdfUrl
        userData.library = biblioteca;
        setUser(userData);
        applySettings(userData.configuracion);
      }
    }
    setLoading(false);
  }, []);

  const applySettings = (config) => {
    if (!config) return;
    
    // Apply dark mode
    if (config.modoOscuro) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Apply font size
    let size = '20px'; // normal (base V2)
    if (config.tamanoFuente === 'grande') size = '24px';
    if (config.tamanoFuente === 'muy-grande') size = '28px';
    document.documentElement.style.fontSize = size;
  };

  const register = (userData) => {
    const newUser = {
      nombre: userData.nombre,
      email: userData.email,
      pais: userData.pais || "mx",
      idioma: userData.idioma || "es",
      creadoEn: new Date().toISOString(),
      isOnboarded: false,
      progreso: {
        racha: 0,
        diasCompletados: 0,
        ultimoDiaActivo: null,
        actividadesCompletadas: []
      },
      library: biblioteca,
      configuracion: {
        tamanoFuente: "normal",
        modoOscuro: false
      }
    };
    localStorage.setItem(`vivamented_user_${userData.email}`, JSON.stringify(newUser));
    localStorage.setItem('vivamente_logged_user', userData.email);
    setUser(newUser);
    applySettings(newUser.configuracion);
  };

  const login = (email) => {
    const userData = JSON.parse(localStorage.getItem(`vivamented_user_${email}`));
    if (userData) {
      localStorage.setItem('vivamente_logged_user', email);
      userData.library = biblioteca; // Hydrate with latest data
      setUser(userData);
      applySettings(userData.configuracion);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('vivamente_logged_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(`vivamented_user_${user.email}`, JSON.stringify(updatedUser));
  };

  const updateConfiguracion = (settingKey, value) => {
    const newConfig = { ...user.configuracion, [settingKey]: value };
    const updatedUser = { ...user, configuracion: newConfig };
    setUser(updatedUser);
    localStorage.setItem(`vivamented_user_${user.email}`, JSON.stringify(updatedUser));
    applySettings(newConfig);
  };

  const registrarAtividadeConcluida = (tipo, actividadId) => {
    if (!user) return;
    
    // Create deep copy
    const newUser = JSON.parse(JSON.stringify(user));
    
    const hoy = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const ayer = yesterdayDate.toISOString().split('T')[0];

    // Check if already finished today
    const jaFez = newUser.progreso.actividadesCompletadas.some(
      a => a.id === actividadId && a.fecha === hoy
    );
    if (jaFez) return;

    // Register activity
    newUser.progreso.actividadesCompletadas.push({
      id: actividadId,
      tipo: tipo,
      fecha: hoy
    });

    // Update streak logic based on V2 Prompt
    if (newUser.progreso.ultimoDiaActivo === ayer) {
      newUser.progreso.racha += 1;
    } else if (newUser.progreso.ultimoDiaActivo !== hoy) {
      newUser.progreso.racha = 1;
    }
    newUser.progreso.ultimoDiaActivo = hoy;

    // Check if daily program completed (Cognitivo, Fisico, Juego)
    const hojeFeitas = newUser.progreso.actividadesCompletadas.filter(a => a.fecha === hoy);
    const categorias = ['cognitivo', 'fisico', 'juego'];
    const diaCompleto = categorias.every(cat => hojeFeitas.some(a => a.tipo === cat));

    if (diaCompleto) {
      // Should trigger Celebration! This logic is simplified for context updates
      newUser.progreso.diasCompletados += 1;
    }

    setUser(newUser);
    localStorage.setItem(`vivamented_user_${newUser.email}`, JSON.stringify(newUser));
    return diaCompleto; // Let the caller know if the day was completed
  };

  // Translation hook wrapper
  const t = (key) => {
    if (!user) return translations['es'][key] || key;
    const lang = user.idioma === 'pt' ? 'pt' : 'es';
    return translations[lang][key] || key;
  };

  return (
    <UserContext.Provider value={{
      user, 
      loading, 
      register, 
      login, 
      logout, 
      updateUser, 
      updateConfiguracion, 
      registrarAtividadeConcluida, 
      t
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

