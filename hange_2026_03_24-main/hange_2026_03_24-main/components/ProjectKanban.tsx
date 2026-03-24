
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Tag, Flag, 
  MoreVertical, Plus, ChevronRight, 
  Clock, CheckCircle2, Layout, 
  Maximize2, Trash2, Edit3, 
  Globe, ShieldCheck, Zap, X,
  ArrowRight, Camera, FileText, Download,
  AlertCircle, ShieldAlert, Image as ImageIcon,
  CheckCircle, HelpCircle, Copy, MessageCircle,
  Layers, Settings, Search, ArrowUpDown,
  Filter, Check
} from 'lucide-react';
import { Language, translations, UserRole } from '../constants';
import ProjectWorkspace from './ProjectWorkspace';
import { useAppStore, Project, ProjectStatus, Milestone } from '../store';

const ProjectCard: React.FC<{ 
  project: Project; 
  onClick: () => void;
}> = ({ project, onClick }) => {
  const { language } = useAppStore();
  const t = translations[language].projectKanban;

  const displayDate = useMemo(() => {
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    
    if (startMonth === endMonth) {
      return `${startMonth}月 ${startDay} - ${endDay}`;
    }
    return `${startMonth}月 ${startDay} - ${endMonth}月 ${endDay}`;
  }, [project.startDate, project.endDate]);

  return (
    <div 
      onClick={onClick}
      className="group relative bg-[#161617] hover:bg-[#1c1c1e] rounded-[32px] p-8 cursor-pointer transition-all duration-500 border border-white/5 hover:border-white/10"
    >
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-wrap gap-2">
          {project.status === 'Live' && (
            <span className="flex items-center gap-1.5 px-3 py-1 bg-[#1d1d1f] text-emerald-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-emerald-400/20">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> {t.status.live}
            </span>
          )}
          {project.status === 'Upcoming' && (
            <span className="px-3 py-1 bg-[#1d1d1f] text-[#0071E3] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#0071E3]/20">
              {t.status.upcoming}
            </span>
          )}
          {project.status === 'Completed' && (
             <span className="px-3 py-1 bg-[#1d1d1f] text-[#86868b] text-[10px] font-bold uppercase tracking-widest rounded-full border border-white/5">
              {t.status.completed}
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-bold text-white leading-tight mb-3 group-hover:text-[#0071E3] transition-colors tracking-tight">
          {project.title}
        </h3>
        <div className="flex items-center gap-4 text-xs font-medium text-[#86868b]">
           <div className="flex items-center gap-1.5"><MapPin size={12} /> {project.city}</div>
           <div className="w-1 h-1 bg-white/10 rounded-full" />
           <div className="flex items-center gap-1.5"><Calendar size={12} /> {displayDate}</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map(tag => (
           <span key={tag} className="text-[9px] font-bold text-[#86868b] bg-white/5 px-2.5 py-1 rounded-lg uppercase tracking-wider border border-white/5">{tag}</span>
        ))}
      </div>
    </div>
  );
};

const ProjectKanban: React.FC<{ tenantId: string | null; isSuperAdminView?: boolean }> = ({ tenantId, isSuperAdminView }) => {
  const { 
    language, 
    user, 
    activeEnterprise, 
    projects: allProjects,
    selectedProjectId,
    setSelectedProjectId
  } = useAppStore();
  const t = translations[language].projectKanban;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'progress' | 'title'>('date');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Core categories
  const coreCategories = [
    { key: 'Event' },
    { key: 'Conference' },
    { key: 'Exhibition' },
    { key: 'Design' },
  ];

  // Custom categories state
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Fetch custom categories
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?type=project');
        if (res.ok) {
          const data = await res.json();
          setCustomCategories(data.map((c: any) => c.name));
        }
      } catch (error) {
        console.error("Failed to fetch project categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !customCategories.includes(newCategoryName.trim())) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName.trim(), type: 'project' })
        });
        if (res.ok) {
          setCustomCategories([...customCategories, newCategoryName.trim()]);
          setNewCategoryName('');
          setIsAddingCategory(false);
        }
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    if (!window.confirm(language === Language.ZH ? '确定要删除该分类吗？' : 'Are you sure you want to delete this category?')) return;
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(catToDelete)}?type=project`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCustomCategories(customCategories.filter(c => c !== catToDelete));
        if (filter === catToDelete) setFilter('All');
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const [filter, setFilter] = useState<string | 'All'>('All');

  const getLabel = (catKey: string) => {
    const translationKey = catKey.toLowerCase() as keyof typeof t.filters;
    return t.filters[translationKey] || catKey;
  };

  const columns = [
    { status: 'Live', title: t.columns.active, color: '#10b981' },
    { status: 'Upcoming', title: t.columns.pipeline, color: '#0071E3' },
    { status: 'Completed', title: t.columns.archive, color: '#86868b' },
  ];

  const filteredProjects = useMemo(() => {
    const targetEnterpriseId = activeEnterprise?.id || tenantId;
    let projects = allProjects.filter(p => p.enterpriseId === targetEnterpriseId);
    
    // Category Filter
    if (filter !== 'All') {
      projects = projects.filter(p => p.category === filter);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      projects = projects.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.city.toLowerCase().includes(q) || 
        p.client.toLowerCase().includes(q)
      );
    }

    // Sorting
    return projects.sort((a, b) => {
      if (sortBy === 'title') return a.title.localeCompare(b.title);
      if (sortBy === 'progress') return (b.progress || 0) - (a.progress || 0);
      return b.startDate.localeCompare(a.startDate); // Simple date sort
    });
  }, [filter, tenantId, activeEnterprise, searchQuery, sortBy, allProjects]);

  const isSuperAdmin = user?.role === UserRole.SYSTEM_ADMIN || isSuperAdminView;

  if (selectedProjectId) {
    const project = allProjects.find(p => p.id === selectedProjectId);
    if (project) {
      return <ProjectWorkspace project={project} onBack={() => setSelectedProjectId(null)} />;
    }
  }

  return (
    <div className="h-full flex flex-col bg-black relative">
      {isSuperAdmin && (
        <div className="absolute top-4 right-10 flex items-center gap-2 bg-[#0071E3]/20 text-[#0071E3] px-3 py-1.5 rounded-lg border border-[#0071E3]/30 text-[10px] font-bold z-50 uppercase tracking-widest">
          <ShieldCheck size={14} />
          {language === Language.ZH ? '超级管理员模式' : 'SUPER ADMIN MODE'}
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="h-24 flex items-center justify-between px-10 border-b border-white/5 shrink-0 bg-black/40 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar max-w-[70%]">
          <button 
            onClick={() => setFilter('All')}
            className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
              filter === 'All'
              ? 'bg-white text-black shadow-xl scale-105' 
              : 'bg-white/5 text-[#86868b] hover:text-white border border-white/5'
            }`}
          >
            {t.filters.all}
          </button>

          {coreCategories.map((cat) => (
            <button 
              key={cat.key}
              onClick={() => setFilter(cat.key)}
              className={`shrink-0 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                filter === cat.key
                ? 'bg-white/10 text-white border-white/20 shadow-lg' 
                : 'bg-white/5 text-[#86868b] border-white/5 hover:text-white hover:border-white/20'
              }`}
            >
              {getLabel(cat.key)}
            </button>
          ))}

          {customCategories.map((cat) => (
            <div key={cat} className="relative group/cat shrink-0">
              <button 
                onClick={() => setFilter(cat)}
                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
                  filter === cat
                  ? 'bg-white/10 text-white border-white/20 shadow-lg' 
                  : 'bg-white/5 text-[#86868b] border-white/5 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
              {isSuperAdmin && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/cat:opacity-100 transition-opacity"
                >
                  <X size={10} />
                </button>
              )}
            </div>
          ))}

          {isSuperAdmin && (
            <div className="flex items-center gap-2 shrink-0">
              {isAddingCategory ? (
                <div className="flex items-center bg-white/5 border border-white/10 rounded-full px-3 py-1 animate-in fade-in slide-in-from-left-2">
                  <input 
                    autoFocus
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                    placeholder={t.filters.addPlaceholder}
                    className="bg-transparent border-none outline-none text-[10px] text-white w-24 placeholder:text-[#86868b]"
                  />
                  <button onClick={handleAddCategory} className="text-emerald-400 p-1 hover:scale-110 transition-transform">
                    <Check size={14} />
                  </button>
                  <button onClick={() => setIsAddingCategory(false)} className="text-[#86868b] p-1 hover:scale-110 transition-transform">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setIsAddingCategory(true)}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#86868b] hover:text-white hover:border-white/20 transition-all"
                >
                  <Plus size={14} />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative group">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-[#0071E3] transition-colors" />
            <input 
              type="text" 
              placeholder={language === Language.ZH ? '搜索项目、城市、客户...' : 'Search projects, cities...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-2.5 text-xs text-white placeholder-[#86868b] focus:bg-white/10 focus:border-[#0071E3]/50 focus:ring-1 focus:ring-[#0071E3]/30 outline-none transition-all w-64"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none bg-white/5 border border-white/10 rounded-2xl pl-6 pr-10 py-2.5 text-xs font-bold text-[#86868b] hover:text-white hover:border-white/20 outline-none transition-all cursor-pointer uppercase tracking-widest"
            >
              <option value="date">{language === Language.ZH ? '按日期' : 'BY DATE'}</option>
              <option value="progress">{language === Language.ZH ? '按进度' : 'BY PROGRESS'}</option>
              <option value="title">{language === Language.ZH ? '按名称' : 'BY NAME'}</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868b] pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto p-12 flex gap-10 custom-scrollbar">
        {columns.map(col => (
          <div key={col.title} className="w-[420px] shrink-0 flex flex-col relative pt-4">
            {/* Top Color Bar (Apple Style) */}
            <div 
              className="absolute top-0 left-4 right-4 h-1 rounded-full z-10" 
              style={{ backgroundColor: col.color }}
            />
            
            <div className="flex items-center justify-between mb-8 px-4">
              <h4 className="text-xs font-bold text-[#86868b] uppercase tracking-[0.2em] flex items-center gap-3">
                {col.title}
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="text-white font-mono">{filteredProjects.filter(p => p.status === col.status).length}</span>
              </h4>
            </div>
            
            <div className="flex-1 space-y-6">
               {filteredProjects.filter(p => p.status === col.status).length === 0 ? (
                 <div className="py-12 px-8 border border-dashed border-white/5 rounded-[32px] text-center bg-white/[0.01]">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4 text-[#86868b]">
                     <Filter size={24} />
                   </div>
                   <p className="text-xs font-bold text-[#86868b] uppercase tracking-widest">
                     {language === Language.ZH ? '暂无匹配项目' : 'No matching projects'}
                   </p>
                 </div>
               ) : (
                 filteredProjects.filter(p => p.status === col.status).map(p => (
                   <ProjectCard 
                      key={p.id} 
                      project={p} 
                      onClick={() => setSelectedProjectId(p.id)} 
                    />
                 ))
               )}
               
               {isSuperAdmin && col.status !== 'Completed' && (
                 <button 
                   onClick={() => setIsCreateModalOpen(true)}
                   className="w-full py-6 border-2 border-dashed border-white/5 rounded-[32px] text-[#86868b] text-sm font-bold uppercase tracking-widest hover:border-white/20 hover:text-white transition-all bg-white/[0.02]"
                 >
                   + {t.card.addProject}
                 </button>
               )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal Placeholder */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">{t.card.addProject}</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-[#86868b] hover:text-white">
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-6">
                <div className="p-12 border-2 border-dashed border-white/5 rounded-3xl text-center bg-white/[0.02]">
                  <Plus size={48} className="mx-auto text-[#0071E3] mb-4" />
                  <p className="text-sm text-[#86868b] font-medium">
                    {language === Language.ZH ? '新建项目表单正在集成中...' : 'New project form integration in progress...'}
                  </p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="w-full py-4 bg-[#0071E3] text-white rounded-2xl font-bold uppercase tracking-widest text-xs"
                >
                  {language === Language.ZH ? '返回' : 'BACK'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectKanban;
