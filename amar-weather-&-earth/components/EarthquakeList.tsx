
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Earthquake } from '../types';
import { getTimeAgo } from '../utils';

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  onRefresh: () => void;
}

const EarthquakeList: React.FC<EarthquakeListProps> = ({ earthquakes, onRefresh }) => {
  if (earthquakes.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-8 rounded-3xl text-center space-y-3">
        <div className="text-4xl">✅</div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-800">কোনো উল্লেখযোগ্য ভূমিকম্প নেই</h3>
          <p className="text-slate-500 text-xs">No earthquakes felt in Bangladesh recently.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <AnimatePresence>
        {earthquakes.map((eq, i) => {
          let intensityColor = 'bg-slate-400';
          let intensityText = 'text-slate-600';
          let indicatorLabel = 'খুবই সামান্য';
          if (eq.feltMag >= 4.0) { intensityColor = 'bg-red-500'; intensityText = 'text-red-500'; indicatorLabel = 'খুব শক্তিশালী'; }
          else if (eq.feltMag >= 3.0) { intensityColor = 'bg-orange-500'; intensityText = 'text-orange-500'; indicatorLabel = 'শক্তিশালী'; }
          else if (eq.feltMag >= 2.0) { intensityColor = 'bg-yellow-500'; intensityText = 'text-yellow-600'; indicatorLabel = 'মাঝারি'; }
          else if (eq.feltMag >= 1.5) { intensityColor = 'bg-emerald-500'; intensityText = 'text-emerald-500'; indicatorLabel = 'সামান্য'; }

          return (
            <motion.div
              key={eq.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`glass p-5 rounded-[1.5rem] shadow-sm relative overflow-hidden border-l-4 ${eq.feltMag >= 3.0 ? 'border-orange-500' : 'border-slate-300'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${intensityColor}`} />
                    <span className={`text-xl font-black ${eq.originalMag >= 5.0 ? 'text-red-500' : 'text-slate-800'}`}>{eq.originalMag}</span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-500 truncate max-w-[150px]">{eq.place}</p>
                </div>
                <span className="text-[8px] font-black bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                  {getTimeAgo(eq.time)}
                </span>
              </div>

              <div className="mt-3 p-3 rounded-xl bg-white/40 border border-white/40 flex items-center justify-between">
                <div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">🇧🇩 Felt Mag</p>
                  <span className={`text-lg font-black ${intensityText}`}>{eq.feltMag}</span>
                  <span className="text-[8px] font-bold ml-1.5 opacity-60">({indicatorLabel})</span>
                </div>
                <div className="text-right">
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">To {eq.nearestCity}</p>
                  <p className="text-xs font-black text-slate-700">{eq.distanceFromNearestCity} km</p>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/20 pt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[8px]">📊</div>
                  <p className="text-[9px] font-bold text-slate-600">Depth: {Math.round(eq.depth)}km</p>
                </div>
                <div className="flex items-center gap-1.5 justify-end">
                  <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[8px]">📈</div>
                  <p className="text-[9px] font-bold text-slate-600">RMS: {eq.rms.toFixed(1)}s</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default EarthquakeList;
