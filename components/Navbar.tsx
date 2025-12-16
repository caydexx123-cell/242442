import React from 'react';
import { Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel rounded-full px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-1.5 rounded-full border border-white/20">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl text-white font-classic tracking-widest font-bold">AEGIS</span>
        </div>
        <div className="hidden md:flex gap-6 text-xs tracking-widest text-gray-400 font-medium">
          <span className="hover:text-white cursor-pointer transition-colors">МОНИТОРИНГ</span>
          <span className="hover:text-white cursor-pointer transition-colors">АНАЛИЗ</span>
          <span className="hover:text-white cursor-pointer transition-colors">ЗАЩИТА</span>
        </div>
      </div>
    </nav>
  );
};