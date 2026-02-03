
import React from 'react';
import { motion } from 'framer-motion';
import { WeatherData, LocationData } from '../types';
import { getWeatherType, getWeatherEmoji } from '../constants';

interface WeatherHeroProps {
  weather: WeatherData;
  location: LocationData;
}

const WeatherHero: React.FC<WeatherHeroProps> = ({ weather, location }) => {
  const type = getWeatherType(weather.current.weatherCode);
  const emoji = getWeatherEmoji(type);
  const uvColor = weather.current.uvIndex > 6 ? 'text-rose-500 bg-rose-50' : weather.current.uvIndex > 3 ? 'text-orange-500 bg-orange-50' : 'text-emerald-500 bg-emerald-50';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass p-6 md:p-10 rounded-[3rem] shadow-xl relative overflow-hidden border border-white/60 brilliant-edge"
    >
      <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center">
        <div className="flex-1 w-full space-y-8">
          <div className="flex flex-col items-center md:items-start space-y-1">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-baseline gap-3"
            >
              <h1 className="text-7xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none">
                {Math.round(weather.current.temp)}<span className="text-sky-400 font-extralight tracking-widest">°</span>
              </h1>
              <div className="pb-3 text-center md:text-left">
                <p className="text-2xl font-black text-slate-800 tracking-tight">{type}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Feels like {Math.round(weather.current.feelsLike)}°C</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Humidity" value={`${weather.current.humidity}%`} icon="💧" />
            <MetricCard label="Visibility" value={`${weather.current.visibility.toFixed(1)}km`} icon="👁️" />
            <MetricCard label="Pressure" value={`${Math.round(weather.current.pressure)}`} sub="hPa" icon="🌡️" />
            <MetricCard label="Clouds" value={`${weather.current.cloudCover}%`} icon="☁️" />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center space-y-6 md:border-l md:border-slate-900/5 md:pl-10">
          <motion.div 
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="text-[8rem] md:text-[9rem] leading-none filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.1)] select-none cursor-default"
          >
            {emoji}
          </motion.div>
          
          <div className="flex flex-col items-center gap-3 w-full">
            <div className={`w-full text-center px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] border border-current/10 shadow-sm ${uvColor}`}>
              UV Index: {weather.current.uvIndex.toFixed(1)}
            </div>
            <div className="flex items-center justify-between w-full bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center" style={{ transform: `rotate(${weather.current.windDirection}deg)` }}>
                   <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>
                 </div>
                 <span className="text-[9px] font-black uppercase tracking-widest">Wind</span>
              </div>
              <span className="text-lg font-black">{weather.current.windSpeed} <span className="text-[9px] opacity-40">km/h</span></span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const MetricCard = ({ label, value, sub, icon }: { label: string, value: string, sub?: string, icon: string }) => (
  <div className="bg-white/40 p-4 rounded-3xl border border-white/60 shadow-lg transition-all flex flex-col items-center md:items-start space-y-1">
    <div className="flex items-center justify-between w-full">
      <span className="text-[8px] text-slate-400 uppercase font-black tracking-widest leading-none">{label}</span>
      <span className="text-sm grayscale opacity-50">{icon}</span>
    </div>
    <p className="text-xl font-black text-slate-900 tracking-tighter">
      {value}{sub && <span className="text-[9px] font-medium opacity-40 ml-1">{sub}</span>}
    </p>
  </div>
);

export default WeatherHero;
