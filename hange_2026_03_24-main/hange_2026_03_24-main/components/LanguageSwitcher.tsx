
import React, { useState, useEffect, useRef } from 'react';
import { Language, translations } from '../constants';
import { useAppStore } from '../store';

const LanguageSwitcher: React.FC = () => {
  const { language: currentLang, setLanguage: onLangChange } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (switcherRef.current && !switcherRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={switcherRef} className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-6 py-2 bg-[rgba(0,47,167,0.03)] backdrop-blur-md border border-[rgba(0,47,167,0.1)] text-[#002fa7] rounded-full text-[0.75rem] font-semibold tracking-widest transition-all duration-300 hover:bg-[rgba(0,47,167,0.08)] shadow-sm"
      >
        {translations[currentLang].label}
        <span className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+12px)] right-0 min-w-[140px] bg-white/95 backdrop-blur-2xl border border-[rgba(0,47,167,0.1)] rounded-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-top-2 duration-300 z-[200]">
          {(Object.keys(translations) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => {
                onLangChange(lang);
                setIsOpen(false);
              }}
              className={`w-full text-left px-6 py-4 text-[0.8rem] transition-all duration-200 hover:bg-[rgba(0,47,167,0.08)] hover:pl-8 ${
                currentLang === lang ? 'text-[#002fa7] font-bold' : 'text-slate-600'
              }`}
            >
              {translations[lang].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
