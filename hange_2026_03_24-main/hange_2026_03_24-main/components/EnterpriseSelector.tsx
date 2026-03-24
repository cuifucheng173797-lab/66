
import React from 'react';
import { motion } from 'framer-motion';
import { Enterprise, Language, translations } from '../constants';
import { useAppStore } from '../store';
import { Building2, ArrowRight, LogOut } from 'lucide-react';

interface EnterpriseSelectorProps {
  onSelect: (enterprise: Enterprise) => void;
  onLogout: () => void;
}

const EnterpriseSelector: React.FC<EnterpriseSelectorProps> = ({ onSelect, onLogout }) => {
  const { language: lang, enterprises } = useAppStore();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1c1c1e_0%,#000000_100%)] z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white tracking-tight mb-4">{t.enterprise.selectorTitle}</h1>
          <p className="text-[#86868b] text-lg max-w-2xl mx-auto">{t.enterprise.selectorSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enterprises.map((ent, index) => (
            <motion.button
              key={ent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onSelect(ent)}
              className="group relative bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] text-left hover:border-[#2997ff]/50 transition-all hover:shadow-2xl hover:shadow-[#2997ff]/10"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                  {ent.logo}
                </div>
                <div className="bg-[#2997ff]/10 text-[#2997ff] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter Workspace
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{ent.name}</h3>
              <p className="text-[#86868b] text-sm leading-relaxed">{ent.description}</p>
              
              <div className="mt-8 flex items-center gap-2 text-[#2997ff] font-bold text-sm">
                <span>{t.enterprise.switch}</span>
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.button>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button 
            onClick={onLogout}
            className="inline-flex items-center gap-2 text-[#86868b] hover:text-white transition-colors font-medium"
          >
            <LogOut size={18} />
            <span>{t.submit}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default EnterpriseSelector;
