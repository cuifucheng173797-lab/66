
import React, { useState } from 'react';
import { 
  Building2, Plus, Trash2, Search, 
  MoreHorizontal, Edit2, X, Check,
  AlertCircle
} from 'lucide-react';
import { useAppStore } from '../store';
import { translations, Enterprise } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

const EnterpriseManagement: React.FC = () => {
  const { language, enterprises, addEnterprise, deleteEnterprise } = useAppStore();
  const t = translations[language].enterpriseManagement;
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newEnterprise, setNewEnterprise] = useState({
    name: '',
    logo: '🏢',
    description: ''
  });

  const filteredEnterprises = enterprises.filter(ent => 
    ent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    if (!newEnterprise.name.trim()) return;
    
    const id = `ent-${Math.random().toString(36).substr(2, 9)}`;
    addEnterprise({
      id,
      ...newEnterprise
    });
    
    setIsAddModalOpen(false);
    setNewEnterprise({ name: '', logo: '🏢', description: '' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.confirmDelete)) {
      deleteEnterprise(id);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black p-8 md:p-12 overflow-y-auto custom-scrollbar">
      <div className="max-w-6xl mx-auto w-full space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight mb-2">{t.title}</h2>
            <p className="text-[#86868b]">{language === 'zh' ? '管理系统中的所有企业租户及其基本信息。' : 'Manage all enterprise tenants and their basic information.'}</p>
          </div>
          
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-2xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
          >
            <Plus size={18} />
            {t.add}
          </button>
        </div>

        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 p-4 rounded-[24px]">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
            <input 
              type="text" 
              placeholder={translations[language].digitalAssets.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 transition-all text-sm"
            />
          </div>
          <div className="px-6 py-3 bg-white/5 rounded-xl border border-white/5 text-sm font-bold text-[#86868b] whitespace-nowrap">
            {enterprises.length} {language === 'zh' ? '个企业' : 'Enterprises'}
          </div>
        </div>

        {/* Enterprise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredEnterprises.map((ent) => (
              <motion.div
                key={ent.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 p-6 rounded-[32px] hover:border-[#2997ff]/30 transition-all"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {ent.logo}
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="p-2 text-[#86868b] hover:text-white transition-colors rounded-lg hover:bg-white/5">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(ent.id)}
                      className="p-2 text-[#86868b] hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-500/10"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2 truncate">{ent.name}</h3>
                <p className="text-[#86868b] text-xs leading-relaxed line-clamp-2 h-8 mb-6">{ent.description}</p>
                
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">Active</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#424245]">{ent.id}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredEnterprises.length === 0 && (
            <div className="col-span-full py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-white/5 rounded-full mb-4 text-[#424245]">
                <Building2 size={32} />
              </div>
              <p className="text-[#86868b] font-medium">{t.empty}</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-[#1c1c1e] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white tracking-tight">{t.add}</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="text-[#86868b] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] ml-1">{t.name}</label>
                  <input 
                    type="text" 
                    value={newEnterprise.name}
                    onChange={(e) => setNewEnterprise({...newEnterprise, name: e.target.value})}
                    placeholder="e.g. Global Tech Inc."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 transition-all text-sm font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] ml-1">{t.logo}</label>
                    <input 
                      type="text" 
                      value={newEnterprise.logo}
                      onChange={(e) => setNewEnterprise({...newEnterprise, logo: e.target.value})}
                      placeholder="🏢"
                      className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl border border-white/5">
                      {newEnterprise.logo || '🏢'}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] ml-1">{t.desc}</label>
                  <textarea 
                    value={newEnterprise.description}
                    onChange={(e) => setNewEnterprise({...newEnterprise, description: e.target.value})}
                    rows={3}
                    placeholder="Brief description of the enterprise..."
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-[#424245] outline-none focus:border-[#2997ff]/50 transition-all text-sm font-medium resize-none"
                  />
                </div>
              </div>

              <div className="p-8 bg-black/20 border-t border-white/5 flex items-center justify-end gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 text-[#86868b] hover:text-white font-bold text-sm transition-colors"
                >
                  {language === 'zh' ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={!newEnterprise.name.trim()}
                  className="px-8 py-3 bg-white text-black rounded-2xl font-bold text-sm hover:bg-[#f5f5f7] transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                  {language === 'zh' ? '确认添加' : 'Add Enterprise'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnterpriseManagement;
