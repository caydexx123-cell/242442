import React, { useEffect, useState } from 'react';
import { Bot, ShieldAlert, ShieldCheck, Server, MapPin, Globe, Clock, Network, RefreshCw } from 'lucide-react';
import { IPAnalysis } from '../types';
import { analyzeIPContext } from '../services/geminiService';

interface SecurityAdvisorProps {
  scanData: IPAnalysis | null;
}

export const SecurityAdvisor: React.FC<SecurityAdvisorProps> = ({ scanData }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (scanData && scanData.success !== false) {
      const fetchAdvice = async () => {
        setLoading(true);
        const result = await analyzeIPContext(scanData);
        setAdvice(result);
        setLoading(false);
      };
      fetchAdvice();
    } else if (scanData?.success === false) {
       setAdvice("Не удалось подключиться к серверам анализа. Проверьте соединение или отключите блокировщик рекламы (AdBlock), так как он может блокировать запросы к базам IP.");
    }
  }, [scanData]);

  if (!scanData) return null;

  const isError = scanData.success === false;

  return (
    <div className="perspective-container w-full max-w-5xl mx-auto mt-12 mb-12 animate-[float_8s_ease-in-out_infinite]">
      <div className={`card-3d glass-panel rounded-xl overflow-hidden border ${isError ? 'border-red-500/30' : 'border-white/10'}`}>
        
        {/* Header Bar */}
        <div className="bg-black/40 p-4 border-b border-white/10 flex justify-between items-center backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Network className={`${isError ? 'text-red-400' : 'text-purple-400'} w-5 h-5`} />
            <span className={`text-sm font-mono ${isError ? 'text-red-200' : 'text-purple-200'}`}>
              REAL_TIME_ANALYSIS // <span className="text-white">{scanData.ip}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <div className={`w-2 h-2 rounded-full ${isError ? 'bg-red-500' : 'bg-red-500'} animate-pulse`}></div>
            <div className="text-[10px] text-gray-400 tracking-wider">LIVE DATA</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Data Column (Left) */}
          <div className="md:col-span-5 p-8 bg-gradient-to-b from-white/5 to-transparent border-b md:border-b-0 md:border-r border-white/10">
            <h3 className="text-white font-classic mb-6 tracking-wider flex items-center gap-2 text-lg border-b border-white/10 pb-2">
              <Server className="w-5 h-5 text-cyan-400" /> 
              ЦИФРОВОЙ ОТПЕЧАТОК
            </h3>
            
            <div className="space-y-6">
              <div className="group transition-all hover:translate-x-1">
                <label className="text-[10px] text-cyan-400/70 uppercase tracking-widest font-bold">Публичный IP</label>
                <div className="text-white font-mono text-2xl tracking-tight mt-1 drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {scanData.ip}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                 <div className="group">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">Провайдер (ISP)</label>
                    <div className="text-gray-200 text-sm mt-1 leading-tight font-medium">
                      {scanData.isp || "Unknown"}
                    </div>
                 </div>
                 <div className="group">
                    <label className="text-[10px] text-gray-500 uppercase tracking-widest">ASN</label>
                    <div className="text-gray-200 text-sm mt-1 font-mono">
                      {scanData.asn || "Unknown"}
                    </div>
                 </div>
              </div>

              <div className="group">
                <label className="text-[10px] text-gray-500 uppercase tracking-widest">Геолокация</label>
                <div className="text-white font-light flex items-start gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                  <span>
                     {scanData.city}, {scanData.region}<br/>
                     <span className="text-xs text-gray-400">{scanData.country}</span>
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                <div>
                   <label className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Timezone
                   </label>
                   <div className="text-xs text-gray-300 mt-1 font-mono">{scanData.timezone?.id}</div>
                </div>
                <div>
                   <label className="text-[10px] text-gray-500 uppercase tracking-widest flex items-center gap-1">
                      <Globe className="w-3 h-3" /> Coordinates
                   </label>
                   <div className="text-xs text-gray-300 mt-1 font-mono">
                      {scanData.latitude?.toFixed(2)}, {scanData.longitude?.toFixed(2)}
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Output Column (Right) */}
          <div className="md:col-span-7 p-8 relative min-h-[400px]">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
              <Bot className="w-48 h-48" />
            </div>

            <h3 className="text-white font-classic mb-6 tracking-wider flex items-center gap-2 text-lg">
              {isError ? <ShieldAlert className="w-5 h-5 text-red-500" /> : <ShieldCheck className="w-5 h-5 text-purple-400" />}
              {isError ? 'ОШИБКА СКАНИРОВАНИЯ' : 'ВЕРДИКТ ИИ AEGIS'}
            </h3>

            {loading ? (
              <div className="space-y-4 animate-pulse pt-4">
                <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                   <div className="h-4 bg-cyan-500/10 rounded w-1/3 border border-cyan-500/20"></div>
                </div>
                <div className="h-24 bg-white/5 rounded-lg w-full border border-white/10"></div>
                <div className="h-4 bg-white/5 rounded w-2/3"></div>
                <div className="h-4 bg-white/5 rounded w-3/4"></div>
              </div>
            ) : (
              <div className="animate-[fadeIn_0.5s_ease-out]">
                <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                  <div className={`text-gray-300 whitespace-pre-line font-light border-l-2 ${isError ? 'border-red-500' : 'border-purple-500'} pl-6 py-1`}>
                    {advice}
                  </div>
                </div>
                
                {!isError && (
                  <div className="mt-8 flex gap-4">
                     <div className="flex-1 bg-red-500/10 border border-red-500/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldAlert className="w-4 h-4 text-red-400" />
                          <span className="text-red-200 text-xs font-bold uppercase">Видимость</span>
                        </div>
                        <p className="text-[11px] text-red-200/70">
                          Ваш реальный IP адрес и локация видны всем веб-сайтам.
                        </p>
                     </div>
                     <div className="flex-1 bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                           <ShieldCheck className="w-4 h-4 text-cyan-400" />
                           <span className="text-cyan-200 text-xs font-bold uppercase">Рекомендация</span>
                        </div>
                        <p className="text-[11px] text-cyan-200/70">
                           Используйте VPN для скрытия геолокации и шифрования трафика.
                        </p>
                     </div>
                  </div>
                )}
                
                {isError && (
                   <div className="mt-8 bg-white/5 border border-white/10 p-4 rounded-lg flex items-center justify-center gap-2 text-gray-400 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => window.location.reload()}>
                      <RefreshCw className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Перезагрузить систему</span>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};