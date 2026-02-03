
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CycloneData } from '../types';

interface CycloneAlertProps {
  cyclone: CycloneData;
}

const CycloneAlert: React.FC<CycloneAlertProps> = ({ cyclone }) => {
  return (
    <AnimatePresence>
      {cyclone.active && cyclone.alerts.map((alert, idx) => (
        <motion.div 
          key={idx}
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="cyclone-alert-banner rounded-[3rem] p-8 mb-10 bg-gradient-to-br from-red-600/10 via-orange-500/5 to-slate-900/5 border-2 border-red-500/30 backdrop-blur-3xl relative overflow-hidden shadow-[0_32px_64px_-12px_rgba(239,68,68,0.2)]"
        >
          {/* Animated Background Pulse */}
          <div className="absolute inset-0 bg-red-500/[0.03] animate-pulse-slow" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full translate-x-32 -translate-y-32" />

          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
              {/* Animated Icon */}
              <div className="relative">
                <div className="text-7xl filter drop-shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-spin-slow">🌪️</div>
                <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-ping scale-75" />
              </div>
              
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-2xl font-black text-red-600 uppercase tracking-tighter">সতর্কতা | {alert.type}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl ${alert.severity === 'Minor' ? 'bg-amber-500 text-white' : 'bg-red-600 text-white'}`}>
                      {alert.severity}
                    </span>
                    <span className="bg-slate-800 text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">{alert.source}</span>
                  </div>
                </div>
                
                <p className="text-base font-medium text-slate-700 leading-relaxed max-w-2xl">
                  {alert.description}
                </p>

                {/* Dashboard Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                  <StatItem 
                    label="Wind Speed" 
                    value={alert.windSpeed || "Calculating..."} 
                    icon="💨" 
                  />
                  <StatItem 
                    label="Threat Level" 
                    value={alert.threatLevel || "Elevated"} 
                    icon="⚠️" 
                  />
                  <StatItem 
                    label="Landfall" 
                    value={alert.landfallTime || "Monitoring..."} 
                    icon="📍" 
                  />
                  <StatItem 
                    label="Status" 
                    value="Active" 
                    icon="📡" 
                  />
                </div>
              </div>
            </div>

            {/* Instruction Footer */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-8 pt-8 border-t border-red-500/10 grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white/30 p-5 rounded-[2.5rem] border border-white/60 shadow-inner">
                <p className="text-xs font-black text-slate-800 uppercase mb-3 flex items-center gap-2 tracking-widest">
                  <span className="text-xl">🛡️</span> Safety Guidance
                </p>
                <div className="space-y-2 text-xs font-bold text-slate-600 leading-tight">
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    {alert.instruction || "Secure loose items and follow local evacuation orders."}
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                    Identify the nearest cyclone shelter immediately.
                  </p>
                </div>
              </div>
              
              <div className="bg-red-600/5 p-6 rounded-[2.5rem] border border-red-500/10 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 text-6xl opacity-5 grayscale">🇧🇩</div>
                <p className="text-[11px] font-bold text-slate-700 leading-relaxed italic relative z-10">
                  নিয়মিত বিরতিতে আবহাওয়ার সর্বশেষ বুলেটিন অনুসরণ করুন। এই অ্যাপের তথ্য বিভিন্ন আন্তর্জাতিক ও স্থানীয় আবহাওয়া অধিদপ্তরের তথ্যের সমন্বয়। যেকোনো জরুরি অবস্থায় সরকারি নির্দেশাবলি মেনে চলুন।
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};

const StatItem = ({ label, value, icon }: { label: string, value: string, icon: string }) => (
  <div className="bg-white/40 backdrop-blur-md p-4 rounded-3xl border border-white/60 shadow-sm flex flex-col items-center sm:items-start transition-all hover:bg-white/50">
    <div className="flex items-center gap-2 mb-1">
      <span className="text-sm">{icon}</span>
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</span>
    </div>
    <span className="text-xs font-black text-slate-800 tracking-tight truncate w-full text-center sm:text-left">
      {value}
    </span>
  </div>
);

export default CycloneAlert;
