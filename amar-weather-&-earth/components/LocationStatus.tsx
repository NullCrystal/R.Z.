
import React from 'react';
import { LocationSource } from '../types';

interface LocationStatusProps {
  source: LocationSource;
  name: string;
}

const LocationStatus: React.FC<LocationStatusProps> = ({ source, name }) => {
  const config = {
    auto: { color: 'text-emerald-600 bg-emerald-500/5 border-emerald-500/10' },
    manual: { color: 'text-sky-600 bg-sky-500/5 border-sky-500/10' },
    fallback: { color: 'text-slate-500 bg-slate-500/5 border-slate-500/10' }
  };

  const current = config[source];

  // For manual search, show the name. For auto/fallback, follow user request to say "nothing" or "your location".
  // We'll use "আপনার অবস্থান" (Your Location) for a professional feel.
  const displayName = source === 'manual' ? name : 'আপনার অবস্থান';

  return (
    <div className={`flex items-center gap-2 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] shadow-sm backdrop-blur-md transition-all duration-300 ${current.color}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      <span>{displayName}</span>
    </div>
  );
};

export default LocationStatus;
