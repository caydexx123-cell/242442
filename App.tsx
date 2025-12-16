import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Scanner } from './components/Scanner';
import { SecurityAdvisor } from './components/SecurityAdvisor';
import { IPAnalysis } from './types';

const App: React.FC = () => {
  const [scanResults, setScanResults] = useState<IPAnalysis | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 relative overflow-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Animated Hero Title */}
        <div className={`text-center mb-12 transition-all duration-700 ${scanResults ? 'scale-75 opacity-80' : 'scale-100'}`}>
          <h1 className="text-4xl md:text-7xl font-classic text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 mb-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            ЦИФРОВАЯ ОБОРОНА
          </h1>
          <p className="text-gray-400 text-xs md:text-sm tracking-[0.2em] uppercase max-w-xl mx-auto">
            Advanced IP Telemetry & Neural Analysis Network
          </p>
        </div>

        {/* Core Interaction */}
        <div className="w-full relative z-10">
          <Scanner onScanComplete={setScanResults} />
          
          {/* Result Section (AI) */}
          {scanResults && (
            <div className="animate-[slideUp_1s_ease-out]">
              <SecurityAdvisor scanData={scanResults} />
            </div>
          )}
        </div>

      </main>
      
      {/* Footer / Status */}
      <footer className="fixed bottom-4 left-0 w-full text-center pointer-events-none">
        <p className="text-[10px] text-gray-600 font-mono tracking-widest">
          AEGIS SYSTEMS v3.0 // CONNECTED // ENCRYPTED
        </p>
      </footer>
    </div>
  );
};

export default App;