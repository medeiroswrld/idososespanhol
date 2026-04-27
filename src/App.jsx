import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

// Layout
import Layout from './components/Layout';

// Auth & Onboarding
import Welcome from './screens/Welcome';
import Login from './screens/Login';
import Register from './screens/Register';
import Onboarding from './screens/Onboarding';

// Main Screens
import Home from './screens/Home';
import Library from './screens/Library';
import Games from './screens/Games';
import Profile from './screens/Profile';

// Games
import VocalesGame from './components/games/VocalesGame';
import WordSearch from './components/games/WordSearch';
import OrdenarFraseGame from './components/games/OrdenarFraseGame';
import AntonimosGame from './components/games/AntonimosGame';
import SequenceGame from './components/games/SequenceGame';
import SieteErroresGame from './components/games/SieteErroresGame';
import CadenaGame from './components/games/CadenaGame';

function App() {
  const { user, loading } = useUser();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background-light"><div className="animate-spin rounded-full h-12 w-12 border-4 border-t-primary border-[#E8E0D8]"></div></div>;
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    );
  }

  if (!user.isOnboarded) {
    return (
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="*" element={<Navigate to="/onboarding" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="library" element={<Library />} />
        <Route path="games" element={<Games />} />
        <Route path="games/vocales" element={<VocalesGame />} />
        <Route path="games/sopa-letras" element={<WordSearch />} />
        <Route path="games/ordenar-frase" element={<OrdenarFraseGame />} />
        <Route path="games/antonimos" element={<AntonimosGame />} />
        <Route path="games/secuencia" element={<SequenceGame />} />
        <Route path="games/siete-errores" element={<SieteErroresGame />} />
        <Route path="games/cadena" element={<CadenaGame />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
