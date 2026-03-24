import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, HardDrive, ShieldAlert, 
  Search, Plus, MoreHorizontal, Activity,
  Database, Server, Shield, LayoutDashboard,
  FolderOpen, LayoutTemplate, Network, BrainCircuit,
  Settings, ChevronRight, CreditCard, Edit2, Trash2, X, LogIn, ChevronDown, Key
} from 'lucide-react';
import { Language, translations } from '../constants';
import { useAppStore } from '../store';

interface Enterprise {
  id: string;
  name: string;
  users: number;
  storageUsed: string;
  status: 'Active' | 'Suspended';
}

const SuperAdminDashboard: React.FC<{ onSimulateTenant: (tenantId: string) => void; onLogout: () => void }> = ({ onSimulateTenant, onLogout }) => {
  const { language } = useAppStore();
  const isZh = language === Language.ZH;
  const [activeTab, setActiveTab] = useState('overview');
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isSimulateModalOpen, setIsSimulateModalOpen] = useState(false);
  const [simulateTenantId, setSimulateTenantId] = useState('');

  useEffect(() => {
    const fetchEnterprises = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch('/api/enterprises');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setEnterprises(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchEnterprises();
  }, []);

  const handleSimulateSubmit = () => {
    if (simulateTenantId.trim()) {
      onSimulateTenant(simulateTenantId.trim());
      setIsSimulateModalOpen(false);
      setSimulateTenantId('');
    }
  };

  const renderContent = () => {
    if (loading) {
      return <SkeletonLoader isZh={isZh} />;
    }
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-12 bg-red-500/10 border border-red-500/20 rounded-2xl animate-in fade-in">
          <ShieldAlert size={48} className="text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">{isZh ? '数据加载失败' : 'Failed to load data'}</h3>
          <p className="text-[#86868b] text-sm">{error}</p>
        </div>
      );
    }
    switch (activeTab) {
      case 'overview':
        return <OverviewContent enterprises={enterprises} loading={loading} isZh={isZh} onSimulateTenant={onSimulateTenant} />;
      case 'tenants':
        return <TenantsControlContent isZh={isZh} enterprises={enterprises} loading={loading} onSimulateTenant={onSimulateTenant} />;
      default:
        return <PlaceholderContent title={activeTab} isZh={isZh} />;
    }
  };

  const getPageTitle = () => {
    switch (activeTab) {
      case 'overview': return isZh ? '数据大盘' : 'Dashboard Overview';
      case 'tenants': return isZh ? '租户与账号管理' : 'Tenants & Accounts';
      default: return '';
    }
  };

  return (
    <div className="h-full flex bg-black overflow-hidden animate-in fade-in duration-500 text-white">
      {/* Sidebar */}
      <div className="w-64 bg-[#161617] border-r border-[#1d1d1f] flex flex-col shrink-0 z-20">
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-6 border-b border-[#1d1d1f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
              <Shield size={16} />
            </div>
            <span className="font-bold text-[#f5f5f7] tracking-tight text-lg">
              {isZh ? '超级管理后台' : 'Super Admin'}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 custom-scrollbar">
          {/* Main */}
          <div className="space-y-1">
            <NavItem 
              icon={<LayoutDashboard size={18} />} 
              label={isZh ? '数据大盘' : 'Dashboard'} 
              isActive={activeTab === 'overview'} 
              onClick={() => setActiveTab('overview')} 
            />
            <NavItem 
              icon={<Building2 size={18} />} 
              label={isZh ? '租户与账号' : 'Tenants'} 
              isActive={activeTab === 'tenants'} 
              onClick={() => setActiveTab('tenants')} 
            />
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#1d1d1f]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
          >
            <LogIn size={18} className="rotate-180" />
            {isZh ? '退出登录' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-black relative">
        {/* Top Header */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-[#1d1d1f] shrink-0 bg-black/80 backdrop-blur-md z-10 absolute top-0 left-0 right-0">
          <h2 className="text-xl font-bold text-[#f5f5f7] tracking-tight">
            {getPageTitle()}
          </h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSimulateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
            >
              <LogIn size={14} />
              {isZh ? '登录到 Dashboard' : 'Login to Dashboard'}
            </button>
            <button className="px-4 py-2 bg-[#1d1d1f] hover:bg-[#2c2c2e] text-white text-xs font-semibold rounded-lg transition-colors border border-[#2c2c2e] flex items-center gap-2">
              <Server size={14} />
              {isZh ? '阿里云控制台' : 'Aliyun Console'}
            </button>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto pt-28 pb-8 px-8 custom-scrollbar">
          <div className="max-w-[1400px] mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>

      {/* Simulate Login Modal */}
      {isSimulateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#161617] border border-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-[#1d1d1f]">
              <h3 className="text-lg font-semibold text-white">
                {isZh ? '模拟登录 Dashboard' : 'Simulate Dashboard Login'}
              </h3>
              <button 
                onClick={() => setIsSimulateModalOpen(false)}
                className="text-[#86868b] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-[#86868b]">
                {isZh 
                  ? '请输入您要模拟登录的租户 ID。您将以超级管理员身份进入该租户的 Dashboard，并拥有所有修改权限。' 
                  : 'Please enter the Tenant ID you want to simulate. You will enter their Dashboard as a Super Admin with full edit permissions.'}
              </p>
              <div className="space-y-2">
                <label className="text-xs font-medium text-[#86868b] uppercase tracking-wider">
                  {isZh ? '租户 ID' : 'Tenant ID'}
                </label>
                <input 
                  type="text" 
                  value={simulateTenantId}
                  onChange={(e) => setSimulateTenantId(e.target.value)}
                  placeholder={isZh ? "例如: ent_001" : "e.g., ent_001"}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSimulateSubmit();
                  }}
                />
              </div>
            </div>
            <div className="p-6 border-t border-[#1d1d1f] flex justify-end gap-3 bg-[#1d1d1f]/30">
              <button 
                onClick={() => setIsSimulateModalOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white hover:bg-[#2c2c2e] transition-colors"
              >
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button 
                onClick={handleSimulateSubmit}
                disabled={!simulateTenantId.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition-colors shadow-lg shadow-blue-500/20"
              >
                {isZh ? '进入 Dashboard' : 'Enter Dashboard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive 
        ? 'bg-[#2997ff]/10 text-[#2997ff]' 
        : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-[#1d1d1f]'
    }`}
  >
    {icon}
    {label}
  </button>
);

const OverviewContent: React.FC<{ enterprises: Enterprise[], loading: boolean, isZh: boolean, onSimulateTenant: (tenantId: string) => void }> = ({ enterprises, loading, isZh, onSimulateTenant }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* Stats Row */}
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatCard 
        icon={<Building2 size={20} className="text-blue-400" />}
        title={isZh ? '入驻企业总数' : 'Total Enterprises'}
        value={enterprises.length.toString()}
        trend="+2 this month"
      />
      <StatCard 
        icon={<Users size={20} className="text-emerald-400" />}
        title={isZh ? '活跃用户总数' : 'Total Active Users'}
        value="1,248"
        trend="+12% vs last month"
      />
      <StatCard 
        icon={<HardDrive size={20} className="text-purple-400" />}
        title={isZh ? 'OSS 存储总量' : 'Total OSS Storage'}
        value="842.5 GB"
        trend="Aliyun OSS (Hangzhou)"
      />
      <StatCard 
        icon={<Database size={20} className="text-amber-400" />}
        title={isZh ? 'RDS 数据库负载' : 'RDS DB Load'}
        value="24%"
        trend="Healthy"
      />
    </div>
  </div>
);

interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string | null;
  role: string;
  status: 'Active' | 'Suspended';
}

const TenantsControlContent: React.FC<{ isZh: boolean, enterprises: Enterprise[], loading: boolean, onSimulateTenant: (tenantId: string) => void }> = ({ isZh, enterprises, loading, onSimulateTenant }) => {
  const [activeTab, setActiveTab] = useState<'enterprises' | 'users'>('enterprises');
  const [users, setUsers] = useState<User[]>([
    { id: 'u1', name: 'Super Admin', email: 'admin@hangai.com', tenantId: null, role: 'SUPER_ADMIN', status: 'Active' },
    { id: 'u2', name: 'Alice (Tenant A)', email: 'a@hangai.com', tenantId: 'ent_001', role: 'TENANT_ADMIN', status: 'Active' },
    { id: 'u3', name: 'Bob (Tenant B)', email: 'b@hangai.com', tenantId: 'ent_002', role: 'TENANT_ADMIN', status: 'Active' },
    { id: 'u4', name: 'Charlie', email: 'c@hangai.com', tenantId: 'ent_001', role: 'MEMBER', status: 'Suspended' },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', tenantId: '', role: 'MEMBER' });
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordUser, setPasswordUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const handleOpenPasswordModal = (user: User) => {
    setPasswordUser(user);
    setNewPassword('');
    setIsPasswordModalOpen(true);
  };

  const handleSavePassword = () => {
    // Simulate API call
    console.log(`Password for ${passwordUser?.name} changed to ${newPassword}`);
    setIsPasswordModalOpen(false);
    setPasswordUser(null);
    setNewPassword('');
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name, email: user.email, tenantId: user.tenantId || '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', tenantId: enterprises[0]?.id || '', role: 'MEMBER' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData, tenantId: formData.tenantId || null } : u));
    } else {
      setUsers([...users, { id: Date.now().toString(), ...formData, tenantId: formData.tenantId || null, status: 'Active' }]);
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      setUsers(users.filter(u => u.id !== userToDelete));
      setUserToDelete(null);
    }
  };

  const getTenantName = (tenantId: string | null) => {
    if (!tenantId) return isZh ? '平台运营方 (无租户)' : 'Platform (No Tenant)';
    const ent = enterprises.find(e => e.id === tenantId);
    return ent ? ent.name : tenantId;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-[#1d1d1f] pb-4">
        <button
          onClick={() => setActiveTab('enterprises')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'enterprises'
              ? 'bg-[#2c2c2e] text-white'
              : 'text-[#86868b] hover:text-white hover:bg-[#1d1d1f]'
          }`}
        >
          {isZh ? '企业租户列表' : 'Enterprise Tenants'}
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-[#2c2c2e] text-white'
              : 'text-[#86868b] hover:text-white hover:bg-[#1d1d1f]'
          }`}
        >
          {isZh ? '全局用户管理' : 'Global Users'}
        </button>
      </div>

      {activeTab === 'enterprises' && (
        <div className="bg-[#161617] rounded-[24px] border border-[#1d1d1f] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-[#1d1d1f] flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">
              {isZh ? '企业租户列表 (Tenants)' : 'Enterprise Tenants'}
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#1d1d1f] px-3 py-1.5 rounded-lg border border-[#2c2c2e]">
                <Search size={14} className="text-[#86868b]" />
                <input 
                  type="text" 
                  placeholder={isZh ? '搜索企业名称...' : 'Search enterprises...'}
                  className="bg-transparent border-none outline-none text-xs text-white w-48 placeholder:text-[#86868b]"
                />
              </div>
              <button className="px-3 py-1.5 bg-[#2997ff] hover:bg-[#007aff] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2">
                <Plus size={14} />
                {isZh ? '新建' : 'New'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1d1d1f] text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  <th className="p-4 pl-6">{isZh ? '企业名称' : 'Enterprise Name'}</th>
                  <th className="p-4">{isZh ? '租户 ID' : 'Tenant ID'}</th>
                  <th className="p-4">{isZh ? '用户数' : 'Users'}</th>
                  <th className="p-4">{isZh ? 'OSS 存储用量' : 'Storage Used'}</th>
                  <th className="p-4">{isZh ? '状态' : 'Status'}</th>
                  <th className="p-4 pr-6 text-right">{isZh ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-[#86868b]">Loading...</td>
                  </tr>
                ) : enterprises.map((ent) => (
                  <tr key={ent.id} className="border-b border-[#1d1d1f] hover:bg-[#1c1c1e] transition-colors group">
                    <td className="p-4 pl-6 font-medium text-[#f5f5f7] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#2c2c2e] flex items-center justify-center text-[#86868b]">
                        <Building2 size={14} />
                      </div>
                      {ent.name}
                    </td>
                    <td className="p-4 text-[#86868b] font-mono text-xs">{ent.id}</td>
                    <td className="p-4 text-[#f5f5f7]">{ent.users}</td>
                    <td className="p-4 text-[#f5f5f7]">{ent.storageUsed}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        ent.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {ent.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => onSimulateTenant(ent.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-blue-400 hover:text-blue-300 transition-colors px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20"
                          title={isZh ? '模拟登录该租户' : 'Simulate Login'}
                        >
                          <LogIn size={14} />
                          {isZh ? '模拟登录 Dashboard' : 'Simulate Dashboard'}
                        </button>
                        <button className="text-[#86868b] hover:text-white transition-colors p-2 rounded-lg hover:bg-[#2c2c2e]">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-[#161617] rounded-[24px] border border-[#1d1d1f] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-6 border-b border-[#1d1d1f] flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-white">
                {isZh ? '全局用户管理 (Global Users)' : 'Global User Management'}
              </h3>
              <p className="text-sm text-[#86868b] mt-1">
                {isZh ? '管理所有租户下的员工账号及平台管理员' : 'Manage all tenant accounts and platform admins'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-[#1d1d1f] px-3 py-1.5 rounded-lg border border-[#2c2c2e]">
                <Search size={14} className="text-[#86868b]" />
                <input 
                  type="text" 
                  placeholder={isZh ? '搜索邮箱或姓名...' : 'Search email or name...'}
                  className="bg-transparent border-none outline-none text-xs text-white w-48 placeholder:text-[#86868b]"
                />
              </div>
              <button 
                onClick={() => handleOpenModal()}
                className="px-3 py-1.5 bg-[#2997ff] hover:bg-[#007aff] text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <Plus size={14} />
                {isZh ? '添加用户' : 'Add User'}
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1d1d1f] text-xs font-semibold text-[#86868b] uppercase tracking-wider">
                  <th className="p-4 pl-6">{isZh ? '用户信息' : 'User'}</th>
                  <th className="p-4">{isZh ? '所属企业 (租户)' : 'Enterprise (Tenant)'}</th>
                  <th className="p-4">{isZh ? '系统角色' : 'Role'}</th>
                  <th className="p-4">{isZh ? '状态' : 'Status'}</th>
                  <th className="p-4 pr-6 text-right">{isZh ? '操作' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-[#1d1d1f] hover:bg-[#1c1c1e] transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-[#f5f5f7]">{user.name}</div>
                          <div className="text-xs text-[#86868b]">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-[#86868b] text-xs">
                      <div className="flex items-center gap-2">
                        <Building2 size={12} />
                        {getTenantName(user.tenantId)}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase bg-[#2c2c2e] text-[#f5f5f7]">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase ${
                        user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenPasswordModal(user)} className="text-[#86868b] hover:text-amber-400 transition-colors p-2 rounded-lg hover:bg-[#2c2c2e]" title={isZh ? '修改密码' : 'Change Password'}>
                          <Key size={14} />
                        </button>
                        <button onClick={() => handleOpenModal(user)} className="text-[#86868b] hover:text-blue-400 transition-colors p-2 rounded-lg hover:bg-[#2c2c2e]" title={isZh ? '编辑' : 'Edit'}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => setUserToDelete(user.id)} className="text-[#86868b] hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-[#2c2c2e]" title={isZh ? '删除' : 'Delete'}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161617] border border-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#2c2c2e]">
              <h3 className="text-lg font-semibold text-white">
                {editingUser ? (isZh ? '编辑用户' : 'Edit User') : (isZh ? '添加新用户' : 'Add New User')}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#86868b] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">{isZh ? '姓名' : 'Name'}</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">{isZh ? '邮箱账号' : 'Email'}</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">{isZh ? '所属企业 (租户)' : 'Enterprise (Tenant)'}</label>
                <select 
                  value={formData.tenantId}
                  onChange={e => setFormData({...formData, tenantId: e.target.value})}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="">{isZh ? '-- 平台运营方 (无租户) --' : '-- Platform (No Tenant) --'}</option>
                  {enterprises.map(ent => (
                    <option key={ent.id} value={ent.id}>{ent.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#86868b] mb-1.5">{isZh ? '系统权限角色' : 'System Role'}</label>
                <select 
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                >
                  <option value="SUPER_ADMIN">{isZh ? '超级管理员 (仅限平台方)' : 'Super Admin (Platform Only)'}</option>
                  <option value="TENANT_ADMIN">{isZh ? '企业管理员' : 'Tenant Admin'}</option>
                  <option value="MEMBER">{isZh ? '普通成员' : 'Member'}</option>
                  <option value="GUEST">{isZh ? '外部访客' : 'Guest'}</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[#2c2c2e] bg-[#1d1d1f]/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-[#86868b] hover:text-white transition-colors">
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button onClick={handleSave} className="px-4 py-2 bg-[#2997ff] hover:bg-[#007aff] text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20">
                {isZh ? '保存设置' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161617] border border-[#2c2c2e] rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isZh ? '确认删除用户？' : 'Confirm Delete?'}
            </h3>
            <p className="text-sm text-[#86868b] mb-6">
              {isZh ? '此操作不可逆，该用户将无法再登录系统。' : 'This action cannot be undone. The user will lose access.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => setUserToDelete(null)} className="px-4 py-2 text-sm font-medium text-[#86868b] hover:text-white transition-colors bg-[#2c2c2e] rounded-lg">
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-red-500/20">
                {isZh ? '确认删除' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {isPasswordModalOpen && passwordUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161617] border border-[#2c2c2e] rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-[#2c2c2e]">
              <h3 className="text-lg font-semibold text-white">
                {isZh ? '修改密码' : 'Change Password'}
              </h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="text-[#86868b] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#2c2c2e]">
                <X size={18} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <p className="text-sm text-[#86868b]">
                {isZh ? `正在为用户 ${passwordUser.name} 修改密码。` : `Changing password for user ${passwordUser.name}.`}
              </p>
              <div>
                <label className="block text-sm font-medium text-[#86868b] mb-1.5">
                  {isZh ? '新密码' : 'New Password'}
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder={isZh ? '请输入新密码' : 'Enter new password'}
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-5 border-t border-[#2c2c2e] bg-[#1d1d1f]/50">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#86868b] hover:text-white transition-colors"
              >
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button
                onClick={handleSavePassword}
                disabled={!newPassword}
                className="px-4 py-2 bg-[#2997ff] hover:bg-[#007aff] text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isZh ? '保存' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PlaceholderContent: React.FC<{ title: string, isZh: boolean }> = ({ title, isZh }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-[#2c2c2e] rounded-[24px] text-[#86868b] bg-[#161617]/50">
    <Settings size={48} className="mb-6 opacity-20" />
    <h3 className="text-xl font-semibold text-[#f5f5f7] mb-2">{title}</h3>
    <p className="text-sm">{isZh ? `该模块正在开发中，敬请期待...` : `This module is under development...`}</p>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode; title: string; value: string; trend: string }> = ({ icon, title, value, trend }) => (
  <div className="bg-[#161617] rounded-[24px] p-6 border border-[#1d1d1f]">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-10 h-10 rounded-xl bg-[#1d1d1f] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-sm font-medium text-[#86868b]">{title}</h3>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{value}</div>
    <div className="text-xs text-[#86868b]">{trend}</div>
  </div>
);

const SkeletonLoader: React.FC<{ isZh: boolean }> = ({ isZh }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="bg-[#161617] border border-[#1d1d1f] rounded-2xl p-6 h-32 animate-pulse">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#2c2c2e]" />
            <div className="h-4 w-24 bg-[#2c2c2e] rounded" />
          </div>
          <div className="h-8 w-16 bg-[#2c2c2e] rounded mb-2" />
          <div className="h-3 w-32 bg-[#2c2c2e] rounded" />
        </div>
      ))}
    </div>
    <div className="bg-[#161617] border border-[#1d1d1f] rounded-2xl p-6 h-96 animate-pulse">
      <div className="h-6 w-48 bg-[#2c2c2e] rounded mb-6" />
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-12 w-full bg-[#2c2c2e] rounded" />
        ))}
      </div>
    </div>
  </div>
);

export default SuperAdminDashboard;
