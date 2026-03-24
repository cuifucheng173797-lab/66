
/// <reference types="@types/google.maps" />

import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import EnterpriseSelector from './components/EnterpriseSelector';
import { useAppStore } from './store';
import { translations, UserRole, Enterprise } from './constants';
import { Globe, Shield, User, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('admin@hangaicloud.com');
  const [password, setPassword] = useState('password');
  const [showSelector, setShowSelector] = useState(false);
  
  const { language: lang, user, setUser, activeEnterprise, setActiveEnterprise, enterprises } = useAppStore();
  const t = translations[lang];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Mock login logic
    setTimeout(() => {
      let role = UserRole.ENT_STAFF;
      let enterpriseId = 'ent-a';
      let userId = 'staff-1';
      let name = '企业员工';
      
      if (email.includes('admin')) {
        role = UserRole.SYSTEM_ADMIN;
        userId = 'admin-1';
        name = '系统管理员';
        setUser({ id: userId, email, role, name });
        setShowSelector(true);
      } else if (email.includes('head')) {
        role = UserRole.ENT_HEAD;
        userId = 'head-1';
        name = '企业负责人';
        const ent = enterprises.find(e => e.id === enterpriseId) || enterprises[0];
        setUser({ id: userId, email, role, enterpriseId, name });
        setActiveEnterprise(ent);
      } else {
        // Staff logic
        if (email.includes('staff-b')) enterpriseId = 'ent-b';
        else if (email.includes('staff-c')) enterpriseId = 'ent-c';
        else if (email.includes('staff-d')) enterpriseId = 'ent-d';
        
        const ent = enterprises.find(e => e.id === enterpriseId) || enterprises[0];
        setUser({ id: userId, email, role, enterpriseId, name });
        setActiveEnterprise(ent);
      }
      setIsLoading(false);
    }, 1200);
  };

  const handleLogout = () => {
    setUser(null);
    setActiveEnterprise(null);
    setShowSelector(false);
  };

  const handleSelectEnterprise = (ent: Enterprise) => {
    setActiveEnterprise(ent);
    setShowSelector(false);
  };

  if (user && activeEnterprise && !showSelector) {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (user?.role === UserRole.SYSTEM_ADMIN && showSelector) {
    return <EnterpriseSelector onSelect={handleSelectEnterprise} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans selection:bg-[#2997ff] selection:text-white overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#1c1c1e_0%,#000000_100%)] z-0" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#2997ff]/10 blur-[120px] rounded-full z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#2997ff]/5 blur-[120px] rounded-full z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] relative z-10"
      >
        {/* Logo Section */}
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl mb-6 shadow-2xl shadow-white/10"
          >
            <span className="text-black text-3xl font-bold tracking-tighter">H</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-2">HANGAICLOUD</h1>
          <p className="text-[#86868b] font-medium text-sm tracking-wide uppercase">{t.subtitle}</p>
        </div>

        {/* Login Form */}
        <div className="bg-[#1c1c1e]/50 backdrop-blur-2xl border border-white/10 p-10 rounded-[32px] shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] ml-1">{t.emailLabel}</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-[#2997ff] transition-colors" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 focus:bg-black/60 transition-all text-sm font-medium"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{t.passwordLabel}</label>
                <button type="button" className="text-[10px] font-bold text-[#2997ff] uppercase tracking-widest hover:underline">{t.forgotPassword}</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#424245] group-focus-within:text-[#2997ff] transition-colors" size={18} />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 focus:bg-black/60 transition-all text-sm font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded bg-black/40 border-white/10 text-[#2997ff] focus:ring-0 focus:ring-offset-0" />
              <label htmlFor="remember" className="text-xs text-[#86868b] font-medium">{t.rememberMe}</label>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-white text-black rounded-2xl py-4 font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#f5f5f7] active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {t.submit}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Info */}
        <div className="mt-10 text-center space-y-4">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
              <Shield size={12} className="text-emerald-500" />
              Enterprise Grade
            </div>
            <div className="w-1 h-1 bg-[#424245] rounded-full" />
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
              <Globe size={12} className="text-[#2997ff]" />
              Global Sync
            </div>
          </div>
          <p className="text-[10px] text-[#424245] font-medium tracking-widest uppercase">
            © 2026 HANGAICLOUD • ALL RIGHTS RESERVED
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default App;

