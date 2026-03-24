
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DigitalAssets from './DigitalAssets';
import PartnerConnect from './PartnerConnect';
import ProjectKanban from './ProjectKanban';
import SystemSettings from './SystemSettings';
import AdminPanel from './AdminPanel';
import IntelligenceCenter from './IntelligenceCenter';
import LanguageSwitcher from './LanguageSwitcher';
import { translations, UserRole, navItems, Enterprise } from '../constants';
import { useAppStore } from '../store';
import { 
  Globe, Users, Layout, Package, Settings, 
  Search, Bell, Command, Home, LogOut,
  ChevronRight, User, Shield, Building2, ChevronDown
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const { language: lang, user, activeEnterprise, setActiveEnterprise, enterprises, activeTab, setActiveTab } = useAppStore();
  const [showEnterpriseMenu, setShowEnterpriseMenu] = useState(false);

  const t = translations[lang];

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'assets':
        return <DigitalAssets tenantId={activeEnterprise?.id || ''} isSuperAdminView={user?.role === UserRole.SYSTEM_ADMIN} />;
      case 'partners':
        return <PartnerConnect />;
      case 'kanban':
        return <ProjectKanban tenantId={activeEnterprise?.id || ''} isSuperAdminView={user?.role === UserRole.SYSTEM_ADMIN} />;
      case 'adminPanel':
        return <AdminPanel />;
      case 'settings':
        return <SystemSettings />;
      case 'intelligence':
        return <IntelligenceCenter language={lang} />;
      default:
        return <IntelligenceCenter language={lang} />;
    }
  };

  const getTabLabel = (id: string) => {
    switch (id) {
      case 'intelligence': return t.intelligence.title;
      case 'partners': return t.partnerConnect.title;
      case 'kanban': return t.projectKanban.title;
      case 'assets': return t.digitalAssets.title;
      case 'adminPanel': return t.adminPanel.title;
      case 'settings': return t.settings.title;
      default: return id;
    }
  };

  const getTabIcon = (id: string) => {
    switch (id) {
      case 'intelligence': return <Globe size={18} />;
      case 'partners': return <Users size={18} />;
      case 'kanban': return <Layout size={18} />;
      case 'assets': return <Package size={18} />;
      case 'adminPanel': return <Shield size={18} />;
      case 'settings': return <Settings size={18} />;
      default: return <Home size={18} />;
    }
  };

  return (
    <div className="flex h-screen bg-black text-[#f5f5f7] overflow-hidden font-sans selection:bg-[#2997ff] selection:text-white">
      {/* Apple Style Sidebar */}
      <aside className="w-[280px] bg-black flex flex-col shrink-0 pt-10 pb-6 px-4 z-50 border-r border-[#1d1d1f]">
        {/* Enterprise Brand Section */}
        <div className="px-4 mb-10 relative">
          <button 
            onClick={() => user?.role === UserRole.SYSTEM_ADMIN && setShowEnterpriseMenu(!showEnterpriseMenu)}
            className={`w-full flex items-center gap-3 p-2 rounded-2xl transition-all ${user?.role === UserRole.SYSTEM_ADMIN ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}`}
          >
            <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-white/5">
              {activeEnterprise?.logo}
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="font-bold text-sm tracking-tight leading-none truncate">{activeEnterprise?.name}</span>
              <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] mt-1">
                {user?.role === UserRole.SYSTEM_ADMIN ? 'Admin' : 'Staff'}
              </span>
            </div>
            {user?.role === UserRole.SYSTEM_ADMIN && <ChevronDown size={14} className={`ml-auto text-[#86868b] transition-transform ${showEnterpriseMenu ? 'rotate-180' : ''}`} />}
          </button>

          {/* Enterprise Switcher Dropdown */}
          <AnimatePresence>
            {showEnterpriseMenu && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-4 right-4 mt-2 bg-[#1c1c1e] border border-white/10 rounded-2xl shadow-2xl z-[100] overflow-hidden"
              >
                <div className="p-2 max-h-[300px] overflow-y-auto">
                  {enterprises.map(ent => (
                    <button
                      key={ent.id}
                      onClick={() => {
                        setActiveEnterprise(ent);
                        setShowEnterpriseMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl transition-colors ${activeEnterprise?.id === ent.id ? 'bg-[#2997ff]/10 text-[#2997ff]' : 'hover:bg-white/5 text-[#86868b] hover:text-white'}`}
                    >
                      <span className="text-xl">{ent.logo}</span>
                      <span className="text-xs font-bold truncate">{ent.name}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <nav className="flex-1 space-y-1">
          {filteredNavItems.filter(i => i.section === 'workspace').map(item => (
            <NavItem 
              key={item.id}
              icon={getTabIcon(item.id)} 
              label={getTabLabel(item.id)} 
              active={activeTab === item.id} 
              onClick={() => setActiveTab(item.id)} 
            />
          ))}
          
          {user?.role === UserRole.SYSTEM_ADMIN && (
            <>
              <div className="my-6 h-px bg-[#1d1d1f] mx-4" />
              <div className="px-4 mb-2 text-[10px] font-bold text-[#424245] uppercase tracking-[0.2em]">Management</div>
              {filteredNavItems.filter(i => i.section === 'management').map(item => (
                <NavItem 
                  key={item.id}
                  icon={getTabIcon(item.id)} 
                  label={getTabLabel(item.id)} 
                  active={activeTab === item.id} 
                  onClick={() => setActiveTab(item.id)} 
                />
              ))}
            </>
          )}
        </nav>

        {/* User Profile Section */}
        <div className="mt-auto px-2 space-y-4">
          <div className="p-3 bg-[#161617] rounded-2xl border border-[#1d1d1f] flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2997ff] to-[#0071e3] flex items-center justify-center text-white font-bold text-xs">
              {user?.email.substring(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white truncate">{user?.email.split('@')[0]}</div>
              <div className="text-[10px] text-[#86868b] font-bold uppercase tracking-widest truncate">{user?.role}</div>
            </div>
            <button onClick={onLogout} className="p-2 text-[#86868b] hover:text-rose-400 transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Floating Header */}
        <header className="h-20 flex items-center justify-between px-10 shrink-0 z-40 bg-black/80 backdrop-blur-xl border-b border-[#1d1d1f]">
          <div className="flex items-center gap-2 text-sm font-medium text-[#86868b]">
            <span className="font-bold text-white tracking-tight">{activeEnterprise?.name}</span>
            <ChevronRight size={14} />
            <span className="text-[#2997ff] font-bold uppercase tracking-widest text-xs">
              {getTabLabel(activeTab)}
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-white transition-colors" size={14} />
              <input 
                type="text" 
                placeholder="Search" 
                className="bg-[#1d1d1f] hover:bg-[#2c2c2e] focus:bg-[#2c2c2e] rounded-lg py-2 pl-9 pr-4 text-sm w-48 transition-all outline-none text-white placeholder:text-[#86868b]" 
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                 <Command size={10} className="text-[#86868b]" />
                 <span className="text-[10px] text-[#86868b] font-medium">K</span>
              </div>
            </div>
            
            <div className="h-4 w-px bg-[#1d1d1f]" />
            
            <LanguageSwitcher />
            
            <button className="relative w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-[#f5f5f7] hover:bg-[#2c2c2e] transition-colors">
              <Bell size={16} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-rose-500 rounded-full border-2 border-black" />
            </button>
          </div>
        </header>

        {/* Content Container */}
        <div className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeEnterprise?.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-[13px] font-bold group ${
    active ? 'bg-[#1c1c1e] text-white shadow-lg shadow-black/20' : 'text-[#86868b] hover:text-white hover:bg-[#1c1c1e]/50'
  }`}>
    <span className={`${active ? 'text-[#2997ff]' : 'text-[#86868b] group-hover:text-white'} transition-colors`}>{icon}</span>
    <span className="tracking-wide truncate">{label}</span>
    {active && (
      <motion.div 
        layoutId="active-pill"
        className="ml-auto w-1 h-4 bg-[#2997ff] rounded-full"
      />
    )}
  </button>
);

export default Dashboard;
