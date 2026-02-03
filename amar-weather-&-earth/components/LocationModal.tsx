
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LocationModalProps {
  show: boolean;
  onAllow: () => void;
  onFallback: () => void;
  onClose: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({ show, onAllow, onFallback, onClose }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40, rotateX: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-[340px] glass p-8 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] text-center space-y-8 border border-white/40 brilliant-edge overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-sky-400/50 to-transparent" />
            
            <motion.div 
              animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="text-7xl drop-shadow-2xl"
            >
              🌍
            </motion.div>

            <div className="space-y-3">
              <h2 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">
                আপনার সঠিক অবস্থান?
              </h2>
              <p className="text-[13px] text-slate-500 font-medium leading-relaxed px-2">
                নির্ভুল আবহাওয়ার আপডেট পেতে আপনার ডিভাইসের লোকেশন পারমিশন দিন।
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onAllow(); onClose(); }}
                className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black text-[13px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-colors"
              >
                লোকেশন অন করুন
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { onFallback(); onClose(); }}
                className="w-full bg-white/50 text-slate-500 py-3 rounded-[2rem] font-bold text-[11px] uppercase tracking-[0.2em] border border-white/60"
              >
                গাজীপুর দিয়ে দেখুন
              </motion.button>
            </div>

            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest opacity-40">
              R.Z.Weather Intelligence
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LocationModal;
