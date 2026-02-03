
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData } from '../types';
import { getWeatherType, getWeatherEmoji } from '../constants';
import { getBnDayName } from '../utils';

interface ForecastGridProps {
  forecast: WeatherData['daily'];
}

const ForecastGrid: React.FC<ForecastGridProps> = ({ forecast }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5">
      {forecast.map((day, i) => {
        const type = getWeatherType(day.weatherCode);
        const emoji = getWeatherEmoji(type);
        const bnDay = getBnDayName(day.date);
        
        return (
          <motion.div
            key={day.date}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass p-3.5 rounded-2xl flex flex-col items-center text-center space-y-1.5 group cursor-default"
          >
            <p className="text-xs font-bold text-slate-800">{i === 0 ? 'আজ' : bnDay}</p>
            <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
            <div className="text-2xl my-0.5 filter group-hover:scale-110 transition-transform">
              {emoji}
            </div>
            <div className="flex items-center gap-1.5 font-bold text-xs">
              <span className="text-slate-800">{Math.round(day.maxTemp)}°</span>
              <span className="text-slate-400 opacity-60 font-normal">{Math.round(day.minTemp)}°</span>
            </div>
            {day.rainProb > 0 && (
              <div className="text-[8px] font-black text-sky-500 bg-sky-50/50 px-1.5 py-0.5 rounded-full border border-sky-100/30">
                {day.rainProb}%
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default ForecastGrid;
