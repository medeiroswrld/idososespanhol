import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { Home, Library, Puzzle, User } from 'lucide-react';

export default function Layout() {
  const { t } = useUser();

  const navItems = [
    { to: "/", icon: <Home size={32} />, label: t('inicio') },
    { to: "/library", icon: <Library size={32} />, label: t('biblioteca') },
    { to: "/games", icon: <Puzzle size={32} />, label: t('juegos') },
    { to: "/profile", icon: <User size={32} />, label: t('perfil') }
  ];

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-background-light dark:bg-dark-bg transition-colors duration-200">
      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-lg mx-auto relative pt-4 pb-6 px-2 sm:px-4">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 w-full bg-background-card dark:bg-dark-card border-t border-[#E8E0D8] dark:border-slate-800 safe-area-bottom z-50">
        <div className="max-w-md mx-auto flex justify-around items-center h-24">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => 
                `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative font-bold ${
                  isActive ? 'text-primary' : 'text-text-sec'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {item.icon}
                  <span className="text-sm">{item.label}</span>
                  {isActive && <div className="absolute bottom-0 w-1/2 h-1.5 bg-primary rounded-t-full"></div>}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
