
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SearchInputProps {
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      className="relative w-full max-w-md group"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
      <div className="absolute inset-0 bg-white/40 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-700" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search City or District..."
        className="w-full px-8 py-4 glass rounded-3xl shadow-xl outline-none text-slate-800 placeholder:text-slate-400 focus:ring-4 focus:ring-white/20 transition-all duration-500 pr-14 text-base font-semibold relative z-10 brilliant-edge"
      />
      <button 
        type="submit"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-90 transition-all z-20 shadow-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      </button>
    </motion.form>
  );
};

export default SearchInput;
