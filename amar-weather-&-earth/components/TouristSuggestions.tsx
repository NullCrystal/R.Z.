
import React from 'react';
import { motion } from 'framer-motion';
import { TouristSpotResult } from '../types';

interface TouristSuggestionsProps {
  data: TouristSpotResult | null;
  loading: boolean;
}

const TouristSuggestions: React.FC<TouristSuggestionsProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="h-10 w-48 bg-white/20 animate-pulse rounded-full" />
          <div className="h-4 w-32 bg-white/10 animate-pulse rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[400px] w-full bg-white/20 animate-pulse rounded-[3rem]" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.spots.length === 0) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center text-center space-y-2 mb-4">
        <h2 className="text-4xl font-black text-slate-900 tracking-tighter">পর্যটন কেন্দ্র</h2>
        <p className="text-slate-500 text-[11px] font-bold uppercase tracking-[0.5em] opacity-60">Nearby Sightseeing Highlights</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data.spots.map((spot, idx) => {
          const isHero = idx === 0;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.15, type: 'spring', stiffness: 100 }}
              className={`group relative glass rounded-[3rem] overflow-hidden border border-white/50 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-sky-200/50 ${isHero ? 'md:col-span-2 md:row-span-1' : ''}`}
            >
              {/* Image Header */}
              <div className="relative h-56 overflow-hidden">
                {isHero && data.heroImage ? (
                  <motion.img 
                    src={data.heroImage} 
                    alt={spot.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
                    <span className="text-4xl opacity-20">🏝️</span>
                  </div>
                )}
                
                {/* Overlay Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[9px] font-black uppercase tracking-widest text-slate-900 shadow-sm">
                    {spot.category}
                  </span>
                  <span className="px-3 py-1 bg-sky-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                    ⭐ {spot.rating}
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-slate-900/80 to-transparent">
                  <h3 className="text-2xl font-black text-white tracking-tighter">{spot.name}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="space-y-4">
                  <p className="text-lg font-bold text-slate-800 leading-snug">
                    {spot.descriptionBn}
                  </p>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed opacity-80">
                    {spot.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-900/5">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Travel Time</span>
                    <span className="text-sm font-black text-slate-900">~{spot.distance}</span>
                  </div>
                  
                  {spot.mapUrl && (
                    <motion.a
                      href={spot.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl transition-all hover:bg-sky-600"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                      লোকেশন
                    </motion.a>
                  )}
                </div>
              </div>

              {/* Interactive Decoration */}
              <div className="absolute top-2 right-2 p-4 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="0.5"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/></svg>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full border border-white/50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Real-time Maps & AI Intelligence
        </div>
      </div>
    </motion.div>
  );
};

export default TouristSuggestions;
