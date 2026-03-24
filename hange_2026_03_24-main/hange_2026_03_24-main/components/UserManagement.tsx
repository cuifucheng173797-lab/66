
import React from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store';
import { translations } from '../constants';
import { UserPlus, Shield, UserCheck, UserX, Mail, Search, MoreVertical } from 'lucide-react';

const UserManagement: React.FC = () => {
  const { language: lang, activeEnterprise } = useAppStore();
  const t = translations[lang];

  const mockUsers = [
    { id: 1, name: '张伟 (Zhang Wei)', email: 'zhang.wei@' + activeEnterprise?.id + '.com', role: 'Admin', status: 'Active', avatar: 'ZW' },
    { id: 2, name: '李娜 (Li Na)', email: 'li.na@' + activeEnterprise?.id + '.com', role: 'Editor', status: 'Active', avatar: 'LN' },
    { id: 3, name: '王强 (Wang Qiang)', email: 'wang.qiang@' + activeEnterprise?.id + '.com', role: 'Viewer', status: 'Offline', avatar: 'WQ' },
  ];

  return (
    <div className="h-full p-10 overflow-y-auto bg-black">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight mb-2">{t.users.title}</h1>
            <p className="text-[#86868b] text-sm">{t.users.list} - {activeEnterprise?.name}</p>
          </div>
          <button className="bg-white text-black px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-[#f5f5f7] transition-all shadow-xl shadow-white/5">
            <UserPlus size={18} />
            {t.users.invite}
          </button>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b]" size={18} />
            <input 
              type="text" 
              placeholder={t.digitalAssets.search}
              className="w-full bg-[#1c1c1e] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-[#2997ff]/50 transition-all"
            />
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-8 py-6 text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{t.users.list}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{t.users.role}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{t.users.status}</th>
                <th className="px-8 py-6 text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em] text-right">{t.users.actions}</th>
              </tr>
            </thead>
            <tbody>
              {mockUsers.map((user, index) => (
                <motion.tr 
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group hover:bg-white/[0.02] transition-colors border-b border-white/5 last:border-0"
                >
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2997ff] to-[#0071e3] flex items-center justify-center text-white font-bold text-xs">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{user.name}</div>
                        <div className="text-xs text-[#86868b] flex items-center gap-1 mt-0.5">
                          <Mail size={10} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-white uppercase tracking-widest">
                      <Shield size={10} className="text-[#2997ff]" />
                      {user.role}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-[#424245]'}`} />
                      <span className={`text-xs font-medium ${user.status === 'Active' ? 'text-white' : 'text-[#86868b]'}`}>
                        {user.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-[#86868b] hover:text-white transition-colors">
                        <UserCheck size={18} />
                      </button>
                      <button className="p-2 text-[#86868b] hover:text-rose-500 transition-colors">
                        <UserX size={18} />
                      </button>
                      <button className="p-2 text-[#86868b] hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
