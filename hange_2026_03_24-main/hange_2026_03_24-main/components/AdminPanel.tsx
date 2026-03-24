import React, { useState } from 'react';
import EnterpriseManagement from './EnterpriseManagement';
import UserManagement from './UserManagement';
import { useAppStore } from '../store';
import { translations } from '../constants';

const AdminPanel = () => {
  const { language } = useAppStore();
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'enterprises' | 'users'>('enterprises');

  return (
    <div className="h-full flex flex-col bg-black">
      <div className="h-16 flex items-center px-10 border-b border-[#1d1d1f] shrink-0 gap-8">
        <button 
          onClick={() => setActiveTab('enterprises')}
          className={`h-full flex items-center text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'enterprises' ? 'text-white border-white' : 'text-[#86868b] border-transparent hover:text-white'
          }`}
        >
          {t.enterpriseManagement.title}
        </button>
        <button 
          onClick={() => setActiveTab('users')}
          className={`h-full flex items-center text-sm font-bold transition-colors border-b-2 ${
            activeTab === 'users' ? 'text-white border-white' : 'text-[#86868b] border-transparent hover:text-white'
          }`}
        >
          {t.users.title}
        </button>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {activeTab === 'enterprises' ? <EnterpriseManagement /> : <UserManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
