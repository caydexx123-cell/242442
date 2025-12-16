import React, { useState } from 'react';
import { Shield, Activity, Wifi, Globe, Server, AlertCircle } from 'lucide-react';
import { IPAnalysis } from '../types';

interface ScannerProps {
  onScanComplete: (data: IPAnalysis) => void;
}

export const Scanner: React.FC<ScannerProps> = ({ onScanComplete }) => {
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState(0);
  const [displayText, setDisplayText] = useState("Система готова / System Ready");

  const fetchRealIP = async (): Promise<IPAnalysis> => {
    const normalizeIpWhoIs = (data: any): IPAnalysis => ({
       ...data,
       success: data.success !== false // ipwho.is returns success boolean
    });

    const normalizeIpApiCo = (data: any): IPAnalysis => ({
      ip: data.ip,
      success: true,
      type: data.version || 'IPv4',
      continent: data.continent_code || 'Unknown',
      country: data.country_name,
      country_code: data.country,
      region: data.region,
      city: data.city,
      latitude: data.latitude,
      longitude: data.longitude,
      isp: data.org,
      org: data.org,
      asn: data.asn,
      timezone: {
        id: data.timezone,
        current_time: new Date().toISOString()
      }
    });

    try {
      // Primary: ipwho.is
      const response = await fetch('https://ipwho.is/');
      if (!response.ok) throw new Error('ipwho.is failed');
      const data = await response.json();
      if (data.success === false) throw new Error(data.message || 'ipwho.is error');
      return normalizeIpWhoIs(data);
    } catch (e1) {
      console.warn("Primary IP API failed, trying backup...", e1);
      try {
        // Secondary: ipapi.co
        const response = await fetch('https://ipapi.co/json/');
        if (!response.ok) throw new Error('ipapi.co failed');
        const data = await response.json();
        if (data.error) throw new Error(data.reason);
        return normalizeIpApiCo(data);
      } catch (e2) {
         console.error("All IP APIs failed", e2);
         return {
            success: false,
            ip: "Сбой определения",
            type: "Unknown",
            continent: "-",
            country: "Неизвестно",
            country_code: "??",
            region: "-",
            city: "-",
            latitude: 0,
            longitude: 0,
            isp: "AdBlock/Connection Error",
            org: "Check Network",
            asn: "-",
            timezone: { id: "UTC", current_time: new Date().toISOString() }
         };
      }
    }
  };

  const runScan = async () => {
    setScanning(true);
    setStep(1);
    
    // 1. Visual initialization
    setDisplayText("Инициализация протоколов... / Initializing");
    await new Promise(r => setTimeout(r, 800));

    // 2. Real Data Fetching (Parallel with animation)
    setStep(2);
    setDisplayText("Запрос внешнего IP... / Pinging External Node");
    const startTime = Date.now();
    const data = await fetchRealIP();
    
    // Ensure animation lasts at least a little bit to look cool
    const elapsed = Date.now() - startTime;
    if (elapsed < 1500) await new Promise(r => setTimeout(r, 1500 - elapsed));

    // 3. Analyzing headers
    setStep(3);
    setDisplayText("Анализ заголовков и ASN... / Analyzing ASN");
    await new Promise(r => setTimeout(r, 1200));

    // 4. Complete
    setStep(4);
    setDisplayText("Сканирование завершено. / Scan Complete");
    await new Promise(r => setTimeout(r, 600));

    setScanning(false);
    onScanComplete(data);
  };

  return (
    <div className="perspective-container w-full max-w-lg mx-auto">
      <div className={`
        card-3d glass-panel rounded-2xl p-8 text-center relative overflow-hidden transition-all duration-700
        ${scanning ? 'border-purple-500/50 shadow-[0_0_50px_rgba(168,85,247,0.2)]' : 'border-white/10'}
      `}>
        {/* Animated Background Glow */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl -z-10 transition-opacity duration-1000 ${scanning ? 'opacity-100' : 'opacity-0'}`}></div>

        <div className="mb-8 relative h-32 flex items-center justify-center">
          {/* 3D Object Representation */}
          <div className={`relative w-24 h-24 transition-all duration-1000 ${scanning ? 'animate-[spin_3s_linear_infinite]' : ''}`}>
             <div className="absolute inset-0 border-2 border-purple-400/30 rounded-full skew-x-12 scale-110"></div>
             <div className="absolute inset-0 border-2 border-cyan-400/30 rounded-full -skew-y-12 scale-90"></div>
             <div className="absolute inset-0 border border-white/50 rounded-full flex items-center justify-center backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
                {scanning ? <Activity className="w-10 h-10 text-white animate-pulse" /> : <Globe className="w-10 h-10 text-white" />}
             </div>
          </div>
          
          {/* Decorative Lines */}
          <div className="absolute w-full h-full flex items-center justify-center pointer-events-none">
             <div className={`h-[1px] bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute top-1/2 left-0 right-0 transition-all duration-500 ${scanning ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
             <div className={`w-[1px] bg-gradient-to-b from-transparent via-cyan-500 to-transparent absolute top-0 bottom-0 left-1/2 transition-all duration-500 ${scanning ? 'h-full opacity-100' : 'h-0 opacity-0'}`}></div>
          </div>
        </div>

        <h2 className="text-2xl font-classic text-white mb-2 tracking-widest uppercase">
          {scanning ? 'SCANNING...' : 'AEGIS MONITOR'}
        </h2>
        
        <p className="text-gray-400 font-light mb-8 h-6 text-sm font-mono">
          {displayText}
        </p>

        {!scanning && (
          <button 
            onClick={runScan}
            className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-transparent border border-white/20 rounded-lg hover:bg-white/5 hover:border-purple-400 hover:shadow-[0_0_30px_rgba(192,132,252,0.3)] overflow-hidden"
          >
            <span className="mr-2 relative z-10 tracking-wider">ПРОВЕРИТЬ МОЙ IP</span>
            <Wifi className="w-4 h-4 group-hover:scale-110 transition-transform relative z-10" />
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </button>
        )}

        {/* Progress Indicators */}
        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-500 ${
                step >= i ? 'w-8 bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'w-2 bg-gray-800'
              }`}
            />
          ))}
        </div>
        
        <div className="mt-4 flex justify-between px-4 text-[10px] text-gray-600 font-mono">
           <span>SECURE PROTOCOL</span>
           <span>NO LOGS</span>
        </div>
      </div>
    </div>
  );
};