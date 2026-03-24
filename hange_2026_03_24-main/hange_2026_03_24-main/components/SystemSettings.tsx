
import React, { useState } from 'react';
import { 
  User, Shield, Bell, Cpu, Save, 
  Globe, Mail, CreditCard, ChevronRight,
  ToggleLeft, ToggleRight, Plus, Settings
} from 'lucide-react';
import { Language, translations } from '../constants';
import { useAppStore } from '../store';

const SystemSettings: React.FC<{ isSuperAdminView?: boolean }> = ({ isSuperAdminView }) => {
  const { language } = useAppStore();
  const t = translations[language].settings;
  const [activeTab, setActiveTab] = useState<'general' | 'team' | 'ai'>('general');

  // Mock Data
  const [teamMembers] = useState([
    { id: 1, name: 'Alice Chen', role: 'Admin', email: 'alice@hangai.cloud', avatar: 'AC' },
    { id: 2, name: 'Marcus Weber', role: 'Editor', email: 'marcus@hangai.cloud', avatar: 'MW' },
    { id: 3, name: 'Sarah Jones', role: 'Viewer', email: 'sarah@hangai.cloud', avatar: 'SJ' },
  ]);

  const [aiKeywords, setAiKeywords] = useState("Semiconductor, Green Energy, AI Governance, Exhibition Tech");
  const [creativity, setCreativity] = useState(70);

  const renderContent = () => {
    switch (activeTab) {
      case 'general':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                   <label className="text-sm font-medium text-[#86868b]">{t.general.orgName}</label>
                   <input type="text" defaultValue="Global Tech Association" className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors" />
                </div>
                <div className="space-y-3">
                   <label className="text-sm font-medium text-[#86868b]">{t.general.timezone}</label>
                   <select className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors appearance-none">
                      <option>Asia/Shanghai (GMT+8)</option>
                      <option>Europe/Berlin (GMT+1)</option>
                      <option>America/New_York (GMT-5)</option>
                   </select>
                </div>
             </div>
             
             <div className="h-px bg-[#1d1d1f]" />
             
             <div className="flex items-center justify-between">
                <div>
                   <h3 className="text-white font-medium mb-1">Dark Mode</h3>
                   <p className="text-xs text-[#86868b]">Force dark mode for all organization users</p>
                </div>
                <ToggleRight size={32} className="text-[#2997ff]" />
             </div>

             <div className="flex justify-end pt-4">
                <button className="px-6 py-2 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-lg font-medium transition-colors flex items-center gap-2">
                   <Save size={16} /> {t.general.save}
                </button>
             </div>
          </div>
        );
      
      case 'team':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">3 Active Members</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] hover:bg-[#2c2c2e] text-white rounded-lg text-sm font-medium transition-colors border border-[#2c2c2e]">
                   <Plus size={14} /> {t.team.invite}
                </button>
             </div>
             
             <div className="space-y-3">
                {teamMembers.map(member => (
                   <div key={member.id} className="flex items-center justify-between p-4 bg-[#1d1d1f] rounded-2xl border border-[#2c2c2e]">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2997ff] to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                            {member.avatar}
                         </div>
                         <div>
                            <div className="text-sm font-medium text-white">{member.name}</div>
                            <div className="text-xs text-[#86868b]">{member.email}</div>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <span className={`text-xs px-2 py-1 rounded border ${member.role === 'Admin' ? 'border-[#2997ff]/30 text-[#2997ff] bg-[#2997ff]/10' : 'border-[#86868b]/30 text-[#86868b]'}`}>
                           {member.role === 'Admin' ? t.team.roleAdmin : t.team.roleEditor}
                         </span>
                         <div className="w-2 h-2 rounded-full bg-emerald-500" title={t.team.statusActive} />
                      </div>
                   </div>
                ))}
             </div>
          </div>
        );

      case 'ai':
         return (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="p-5 bg-gradient-to-r from-[#1d1d1f] to-[#161617] border border-[#2c2c2e] rounded-2xl">
                  <div className="flex items-center gap-3 mb-4">
                     <div className="w-8 h-8 rounded-lg bg-[#2997ff]/10 flex items-center justify-center text-[#2997ff]">
                        <Cpu size={18} />
                     </div>
                     <h3 className="text-lg font-semibold text-white">{t.ai.keywordsTitle}</h3>
                  </div>
                  <p className="text-sm text-[#86868b] mb-4">{t.ai.keywordsDesc}</p>
                  <textarea 
                    value={aiKeywords}
                    onChange={(e) => setAiKeywords(e.target.value)}
                    rows={3}
                    className="w-full bg-black/50 border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors text-sm leading-relaxed" 
                  />
               </div>

               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                     <div>
                        <h3 className="text-white font-medium mb-1">{t.ai.creativityTitle}</h3>
                        <p className="text-xs text-[#86868b]">{t.ai.creativityDesc}</p>
                     </div>
                     <div className="text-[#2997ff] font-bold">{creativity}%</div>
                  </div>
                  <input 
                     type="range" 
                     min="0" 
                     max="100" 
                     value={creativity}
                     onChange={(e) => setCreativity(parseInt(e.target.value))}
                     className="w-full h-1 bg-[#2c2c2e] rounded-lg appearance-none cursor-pointer accent-[#2997ff]" 
                  />
               </div>

               <div className="flex items-center justify-between p-4 bg-[#1d1d1f] rounded-xl border border-[#2c2c2e]">
                  <span className="text-sm font-medium text-white">{t.ai.autoReport}</span>
                  <ToggleRight size={28} className="text-[#2997ff] cursor-pointer" />
               </div>
            </div>
         );
    }
  };

  return (
    <div className="h-full flex flex-col bg-black relative">
      {isSuperAdminView && (
        <div className="absolute top-4 right-10 flex items-center gap-2 bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs font-bold z-50">
          <Settings size={14} />
          {language === Language.ZH ? '超级管理员修改模式' : 'Super Admin Edit Mode'}
        </div>
      )}
       <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 border-r border-[#1d1d1f] p-6 space-y-2 overflow-y-auto">
             <div className="text-xs font-bold text-[#86868b] uppercase tracking-widest mb-4 px-2">Settings</div>
             
             <button 
               onClick={() => setActiveTab('general')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'general' ? 'bg-[#1c1c1e] text-white' : 'text-[#86868b] hover:text-white hover:bg-[#1c1c1e]/50'}`}
             >
                <Globe size={18} /> {t.tabs.general}
             </button>
             
             <button 
               onClick={() => setActiveTab('team')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'team' ? 'bg-[#1c1c1e] text-white' : 'text-[#86868b] hover:text-white hover:bg-[#1c1c1e]/50'}`}
             >
                <User size={18} /> {t.tabs.team}
             </button>

             <button 
               onClick={() => setActiveTab('ai')}
               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === 'ai' ? 'bg-[#1c1c1e] text-white' : 'text-[#86868b] hover:text-white hover:bg-[#1c1c1e]/50'}`}
             >
                <Cpu size={18} /> {t.tabs.ai}
             </button>

             <button disabled className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#86868b]/50 cursor-not-allowed text-sm font-medium">
                <Bell size={18} /> {t.tabs.notifications}
             </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
             <div className="max-w-2xl">
                <h2 className="text-3xl font-bold text-white mb-2">
                   {activeTab === 'general' ? t.tabs.general : activeTab === 'team' ? t.tabs.team : t.tabs.ai}
                </h2>
                <p className="text-[#86868b] mb-10">Manage your organization preferences and system behaviors.</p>
                
                {renderContent()}
             </div>
          </div>
       </div>
    </div>
  );
};

export default SystemSettings;
