
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { WeatherType } from '../types';
import { getBangladeshTime } from '../utils';

interface LiveMoodBadgeProps {
  weatherType: WeatherType;
}

const moodMap: Record<WeatherType, string> = {
  [WeatherType.Sunny]: 'Radiant Vibes',
  [WeatherType.Cloudy]: 'Quiet Skies',
  [WeatherType.Rain]: 'Melodic Rain',
  [WeatherType.Storm]: 'Electric Storm',
  [WeatherType.Fog]: 'Mystic Haze',
  [WeatherType.Snow]: 'Frozen Calm'
};

const LiveMoodBadge: React.FC<LiveMoodBadgeProps> = ({ weatherType }) => {
  const [time, setTime] = useState(getBangladeshTime());

  useEffect(() => {
    const timer = setInterval(() => setTime(getBangladeshTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const moodText = moodMap[weatherType] || 'Serene Day';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        opacity: { duration: 0.4 },
        scale: { type: 'spring', damping: 20, stiffness: 100 },
      }}
      className="inline-flex items-center gap-4 px-5 py-2.5 glass rounded-full border border-white/50 shadow-xl brilliant-edge select-none"
    >
      <div className="flex items-center gap-2 border-r border-slate-900/10 pr-4">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
        </div>
        <span 
          className="text-[11px] font-black text-slate-800 tracking-tighter uppercase"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Mood</span>
        <span className="text-[11px] font-black text-slate-900 tracking-tight">
          {moodText}
        </span>
      </div>
    </motion.div>
  );
};

export default LiveMoodBadge;
