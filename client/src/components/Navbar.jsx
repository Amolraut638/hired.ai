import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4 text-gray-800 transition-all duration-300">
        {/* Logo (unchanged) */}
        <Link to="/">
          <img 
            src="/logo.svg" 
            alt="logo" 
            className="h-8 w-auto select-none hover:opacity-90 transition-opacity"
          />
        </Link>

        {/* Logout Button */}
        <div className="flex items-center gap-4 text-sm">
          <button
            onClick={logout}
            className="cursor-pointer bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 px-6 py-1.5 rounded-full active:scale-95 shadow-sm hover:shadow-md transition-all"
          >
            Logout
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
