
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { getWeatherEmoji, getWeatherType } from '../constants';
import { formatTime, getRelativeTime } from '../utils';

interface HourlyForecastProps { hourly: WeatherData['hourly']; }

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative w-full">
      <motion.div 
        ref={scrollRef}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex overflow-x-auto overflow-y-hidden pb-6 pt-2 gap-3 no-scrollbar snap-x snap-mandatory scroll-smooth cursor-grab active:cursor-grabbing px-4"
      >
        {hourly.map((item, i) => {
          const isNow = i === 0;
          const hourDate = new Date(new Date(item.time).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }));
          const type = getWeatherType(item.weatherCode);
          const emoji = getWeatherEmoji(type);
          
          return (
            <motion.div
              key={item.time}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.03, type: 'spring', stiffness: 200, damping: 20 }}
              className={`flex-shrink-0 snap-center relative ${isNow ? 'w-[72px]' : 'w-[64px]'}`}
            >
              <div className={`
                h-32 flex flex-col items-center justify-between py-4 px-2 rounded-[2rem] border transition-all duration-500 brilliant-edge
                ${isNow 
                  ? 'bg-slate-900 shadow-[0_12px_24px_rgba(0,0,0,0.15)] border-slate-800' 
                  : 'glass border-white/40 hover:bg-white/50'
                }
              `}>
                {/* Time */}
                <div className="flex flex-col items-center">
                  <span className={`text-[9px] font-black uppercase tracking-widest ${isNow ? 'text-sky-400' : 'text-slate-400'}`}>
                    {isNow ? 'এখন' : formatTime(hourDate).split(' ')[0]}
                  </span>
                  {!isNow && (
                    <span className="text-[7px] font-bold text-slate-400 opacity-60 uppercase">
                      {formatTime(hourDate).split(' ')[1]}
                    </span>
                  )}
                </div>

                {/* Emoji */}
                <div className={`text-xl select-none transition-transform hover:scale-125 duration-300 ${isNow ? 'drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]' : ''}`}>
                  {emoji}
                </div>

                {/* Temp & Precip */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-sm font-black tracking-tighter ${isNow ? 'text-white' : 'text-slate-800'}`}>
                    {Math.round(item.temp)}°
                  </span>
                  {item.precipProb > 15 && (
                    <div className="flex items-center gap-0.5 text-[7px] font-black text-sky-500 bg-sky-50/80 px-1 rounded-full border border-sky-100/50">
                      <span>{item.precipProb}%</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dot indicator for 'Now' */}
              {isNow && (
                <motion.div 
                  layoutId="activeHour"
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-slate-900 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default HourlyForecast;
