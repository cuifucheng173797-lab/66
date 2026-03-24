import React from 'react';
import { 
  ArrowLeft, Clock, MapPin, Calendar, 
  ShieldCheck, AlertCircle, CheckCircle2, 
  Circle, FileText, Image as ImageIcon,
  Activity, UploadCloud, MoreHorizontal,
  Users, Plus, Edit3, Download, Trash2,
  ChevronDown, Camera, X, Save, User, Maximize2
} from 'lucide-react';
import { useAppStore, Project, Milestone } from '../store';
import { Language, UserRole } from '../constants';

interface ProjectWorkspaceProps {
  project: Project;
  onBack: () => void;
}

const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({ project, onBack }) => {
  const { language, user } = useAppStore();
  const isZh = language === Language.ZH;
  const isSystemAdmin = user?.role === UserRole.SYSTEM_ADMIN;
  const isEntHead = user?.role === UserRole.ENT_HEAD;
  const canManageMilestones = isSystemAdmin || isEntHead;
  
  const [currentStatus, setCurrentStatus] = React.useState(project.status);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = React.useState(false);
  
  // Progress State
  const [isManualProgress, setIsManualProgress] = React.useState(false);
  const [manualProgressValue, setManualProgressValue] = React.useState(project.progress || 0);
  const [isProgressModalOpen, setIsProgressModalOpen] = React.useState(false);
  const [tempProgress, setTempProgress] = React.useState(manualProgressValue);
  
  // Export State
  const [isExporting, setIsExporting] = React.useState(false);
  const [exportProgress, setExportProgress] = React.useState(0);

  // New Milestone State
  const [isAddingMilestone, setIsAddingMilestone] = React.useState(false);
  const [newMilestone, setNewMilestone] = React.useState<Partial<Milestone>>({
    title: '',
    time: new Date().toISOString().split('T')[0],
    status: 'pending',
    description: ''
  });
  
  // Delete Confirmation State
  const [itemToDelete, setItemToDelete] = React.useState<{ id: string; name: string; type: 'milestone' | 'material' | 'compliance' } | null>(null);
  
  // Milestone Editing State
  const [editingMilestone, setEditingMilestone] = React.useState<Milestone | null>(null);
  const [milestones, setMilestones] = React.useState<Milestone[]>(project.milestones || [
    { id: '1', title: isZh ? '项目启动' : 'Project Kickoff', time: '2026-03-01', status: 'completed', description: isZh ? '项目正式立项，组建核心团队。' : 'Project officially initiated, core team formed.' },
    { id: '2', title: isZh ? '设计方案确认' : 'Design Confirmed', time: '2026-03-05', status: 'completed', description: isZh ? '完成3D渲染图及施工图审核。' : 'Completed 3D rendering and construction drawing review.' },
    { id: '3', title: isZh ? '现场搭建' : 'On-site Setup', time: '2026-03-10', status: 'in-progress', description: isZh ? '展台结构搭建中，同步进行强弱电布线。' : 'Booth structure under construction, electrical wiring in progress.', media: [{ type: 'image', url: 'https://picsum.photos/seed/setup/800/600', name: 'Setup_Photo_01.jpg' }] },
  ]);

  // Preview State
  const [previewMedia, setPreviewMedia] = React.useState<{ url: string; type: 'image' | 'video'; name?: string } | null>(null);

  // Auto-sort milestones by date
  const sortedMilestones = React.useMemo(() => {
    return [...milestones].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
  }, [milestones]);

  // Auto-calculate progress based on completed milestones
  const autoProgress = React.useMemo(() => {
    if (milestones.length === 0) return 0;
    const completedCount = milestones.filter(m => m.status === 'completed').length;
    return Math.round((completedCount / milestones.length) * 100);
  }, [milestones]);

  const handleStatusChange = (status: Project['status']) => {
    setCurrentStatus(status);
    setIsStatusMenuOpen(false);
  };

  const handleSaveMilestone = (updated: Milestone) => {
    const now = new Date().toLocaleString();
    const finalMilestone = {
      ...updated,
      updatedBy: user?.name || (isZh ? '管理员' : 'Admin'),
      updatedAt: now
    };
    
    setMilestones(prev => prev.map(m => m.id === finalMilestone.id ? finalMilestone : m));
    setEditingMilestone(null);
  };

  const handleAddMilestone = () => {
    if (!newMilestone.title) return;
    
    const now = new Date().toLocaleString();
    const milestone: Milestone = {
      id: Math.random().toString(36).substr(2, 9),
      title: newMilestone.title || '',
      time: newMilestone.time || new Date().toISOString().split('T')[0],
      status: newMilestone.status as any || 'pending',
      description: newMilestone.description,
      updatedBy: user?.name || (isZh ? '管理员' : 'Admin'),
      updatedAt: now
    };
    
    setMilestones(prev => [...prev, milestone]);
    setIsAddingMilestone(false);
    setNewMilestone({
      title: '',
      time: new Date().toISOString().split('T')[0],
      status: 'pending',
      description: ''
    });
  };

  const handleUpdateProgress = () => {
    setManualProgressValue(tempProgress);
    setIsProgressModalOpen(false);
  };

  const handleExport = () => {
    setIsExporting(true);
    setExportProgress(0);
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsExporting(false);
            // Final success message handled in UI or alert
          }, 800);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);
  };

  const handleDeleteItem = () => {
    if (!itemToDelete) return;
    
    if (itemToDelete.type === 'milestone') {
      setMilestones(prev => prev.filter(m => m.id !== itemToDelete.id));
    }
    // In a real app, we'd filter materials/compliance too
    console.log(`Deleted ${itemToDelete.type}: ${itemToDelete.name}`);
    setItemToDelete(null);
  };

  const handleFileUpload = (type: string) => {
    console.log(`Simulating upload for ${type}...`);
    // In a real app, this would trigger a file input click
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(isZh ? `已选择文件: ${file.name} (上传功能集成中)` : `Selected file: ${file.name} (Upload integration in progress)`);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="h-20 flex items-center justify-between px-6 md:px-10 border-b border-[#1d1d1f] shrink-0 bg-black/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-[#1d1d1f] text-[#86868b] hover:text-white hover:bg-[#2c2c2e] transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="h-4 w-px bg-[#1d1d1f]" />
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-xl font-bold text-[#f5f5f7] tracking-tight">{project.title}</h2>
              
              {/* Status Switcher for Admins */}
              <div className="relative">
                <button 
                  disabled={!isSystemAdmin}
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={`flex items-center gap-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                    currentStatus === 'Live' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                    currentStatus === 'Upcoming' ? 'bg-[#2997ff]/10 text-[#2997ff] border border-[#2997ff]/20' :
                    'bg-[#1d1d1f] text-[#86868b] border border-[#2c2c2e]'
                  } ${isSystemAdmin ? 'hover:bg-white/5 cursor-pointer' : 'cursor-default'}`}
                >
                  {currentStatus === 'Live' && <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse mr-0.5" />}
                  {currentStatus}
                  {isSystemAdmin && <ChevronDown size={10} className={`transition-transform duration-300 ${isStatusMenuOpen ? 'rotate-180' : ''}`} />}
                </button>

                {isSystemAdmin && isStatusMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setIsStatusMenuOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-32 bg-[#1c1c1e] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-30 py-1 backdrop-blur-xl">
                      {(['Upcoming', 'Live', 'Completed'] as const).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleStatusChange(s)}
                          className={`w-full text-left px-4 py-2 text-[10px] font-bold uppercase tracking-widest transition-colors ${
                            currentStatus === s ? 'text-white bg-white/5' : 'text-[#86868b] hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#86868b] font-medium">
              <span className="flex items-center gap-1"><MapPin size={12} /> {project.city}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {project.startDate} - {project.endDate}</span>
              <span className="flex items-center gap-1"><Users size={12} /> {project.client}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={handleExport}
             className="px-4 py-2 bg-[#1d1d1f] hover:bg-[#2c2c2e] text-white text-xs font-semibold rounded-lg transition-colors border border-[#2c2c2e] flex items-center gap-2"
           >
             <Download size={14} />
             {isZh ? '导出报告' : 'Export Report'}
           </button>
           {isSystemAdmin && (
             <div className="flex items-center gap-2 bg-[#1d1d1f] p-1 rounded-xl border border-[#2c2c2e]">
               <button 
                 onClick={() => setIsManualProgress(!isManualProgress)}
                 className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                   isManualProgress 
                   ? 'bg-[#2997ff] text-white shadow-lg shadow-blue-500/20' 
                   : 'text-[#86868b] hover:text-white'
                 }`}
               >
                 {isZh ? '手动覆盖' : 'Manual Override'}
               </button>
               {isManualProgress && (
                 <button 
                   onClick={() => {
                     setTempProgress(manualProgressValue);
                     setIsProgressModalOpen(true);
                   }}
                   className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-colors border border-white/10"
                 >
                   {manualProgressValue}%
                 </button>
               )}
             </div>
           )}
        </div>
      </div>

      {/* Workspace Content - Bento Grid */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Progress & Updates (Span 2) */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Progress Card */}
            <div className="bg-[#161617] rounded-[24px] p-8 border border-[#1d1d1f]">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{isZh ? '项目执行进度' : 'Execution Progress'}</h3>
                  <p className="text-xs text-[#86868b]">{isZh ? '实时同步现场数据' : 'Real-time field data sync'}</p>
                </div>
                <div className="text-4xl font-black text-[#2997ff] tracking-tighter">
                  {isManualProgress ? manualProgressValue : autoProgress}<span className="text-xl text-[#86868b] ml-1">%</span>
                </div>
              </div>
              <div className="h-3 w-full bg-[#1d1d1f] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#2997ff] to-purple-500 rounded-full relative transition-all duration-1000 ease-out"
                  style={{ width: `${isManualProgress ? manualProgressValue : autoProgress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite] -skew-x-12 translate-x-[-100%]" />
                </div>
              </div>
            </div>

            {/* Timeline & Milestones */}
            <div className="bg-[#161617] rounded-[24px] p-8 border border-[#1d1d1f]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Activity size={18} className="text-[#2997ff]" />
                  {isZh ? '执行时间轴与里程碑' : 'Execution Timeline & Milestones'}
                </h3>
                {canManageMilestones && (
                  <button 
                    onClick={() => setIsAddingMilestone(true)}
                    className="px-3 py-1.5 bg-[#1d1d1f] hover:bg-[#2c2c2e] text-[#2997ff] text-[10px] font-bold uppercase tracking-wider rounded-lg border border-[#2c2c2e] transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={12} />
                    {isZh ? '添加动态' : 'Add Update'}
                  </button>
                )}
              </div>

              <div className="relative space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-[#1d1d1f]">
                {sortedMilestones.map((milestone, i) => (
                  <div key={milestone.id || i} className="relative pl-10">
                    {/* Status Indicator */}
                    <div className={`absolute left-0 top-1.5 w-6 h-6 rounded-full flex items-center justify-center z-10 
                      ${milestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 
                        milestone.status === 'in-progress' ? 'bg-[#2997ff]/20 text-[#2997ff]' : 
                        'bg-[#1d1d1f] text-[#86868b]'}`}
                    >
                      {milestone.status === 'completed' ? <CheckCircle2 size={14} /> : 
                       milestone.status === 'in-progress' ? <div className="w-2 h-2 bg-[#2997ff] rounded-full animate-pulse" /> :
                       <Circle size={14} />}
                    </div>

                    <div className="flex flex-col gap-2 group/milestone">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className={`text-sm font-bold ${milestone.status === 'completed' ? 'text-[#86868b]' : 'text-[#f5f5f7]'}`}>
                              {milestone.title}
                            </h4>
                            {milestone.status === 'in-progress' && (
                              <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[9px] font-bold uppercase rounded">
                                {isZh ? '实时' : 'LIVE'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-[#86868b] font-medium mt-0.5 flex items-center gap-1.5">
                            <Clock size={10} /> {milestone.time}
                          </div>
                        </div>
                        
                        {/* Common Actions for Milestone */}
                        <div className="flex items-center gap-1 opacity-0 group-hover/milestone:opacity-100 transition-opacity">
                          {canManageMilestones && (
                            <>
                              <button 
                                onClick={() => handleFileUpload('milestone')}
                                className="p-1.5 text-[#86868b] hover:text-white hover:bg-[#1d1d1f] rounded-lg transition-all" 
                                title="Upload"
                              >
                                <Camera size={14} />
                              </button>
                              <button 
                                onClick={() => setEditingMilestone(milestone)}
                                className="p-1.5 text-[#86868b] hover:text-white hover:bg-[#1d1d1f] rounded-lg transition-all" 
                                title="Edit"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={() => setItemToDelete({ id: milestone.id, name: milestone.title, type: 'milestone' })}
                                className="p-1.5 text-[#86868b] hover:text-rose-400 hover:bg-[#1d1d1f] rounded-lg transition-all" 
                                title="Delete"
                              >
                                <Trash2 size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </div>

                      {milestone.description && (
                        <p className="text-xs text-[#86868b] leading-relaxed max-w-2xl">
                          {milestone.description}
                        </p>
                      )}

                      {/* Audit Info */}
                      {milestone.updatedBy && (
                        <div className="flex items-center gap-2 text-[9px] text-[#86868b] font-medium bg-white/2 self-start px-2 py-0.5 rounded border border-white/5">
                          <User size={10} />
                          {isZh ? '修改人：' : 'Modified by: '} {milestone.updatedBy}
                          <span className="w-1 h-1 bg-white/10 rounded-full mx-1" />
                          {isZh ? '时间：' : 'Time: '} {milestone.updatedAt}
                        </div>
                      )}

                      {/* Media Attachments */}
                      {milestone.media && milestone.media.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-3">
                          {milestone.media.map((item, idx) => (
                            <div key={idx} className="group/media relative">
                              {item.type === 'image' ? (
                                <div className="w-40 h-24 rounded-xl overflow-hidden border border-[#1d1d1f] bg-black relative">
                                  <img src={item.url} alt="Milestone" className="w-full h-full object-cover transition-transform group-hover/media:scale-110" />
                                  <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/media:opacity-100 gap-2">
                                    <button 
                                      onClick={() => setPreviewMedia({ url: item.url, type: 'image', name: item.name })}
                                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all"
                                    >
                                      <Maximize2 size={14} />
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#2997ff] text-white flex items-center justify-center backdrop-blur-md transition-all">
                                      <Download size={14} />
                                    </button>
                                  </div>
                                </div>
                              ) : item.type === 'video' ? (
                                <div className="w-40 h-24 rounded-xl overflow-hidden border border-[#1d1d1f] bg-black flex items-center justify-center group-hover/media:bg-[#1d1d1f] transition-colors relative">
                                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#86868b] group-hover/media:text-[#2997ff] transition-colors">
                                    <ImageIcon size={16} />
                                  </div>
                                  <div className="absolute inset-0 bg-black/20 group-hover/media:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover/media:opacity-100 gap-2">
                                    <button 
                                      onClick={() => setPreviewMedia({ url: item.url, type: 'video', name: item.name })}
                                      className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all"
                                    >
                                      <Maximize2 size={14} />
                                    </button>
                                    <button className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#2997ff] text-white flex items-center justify-center backdrop-blur-md transition-all">
                                      <Download size={14} />
                                    </button>
                                  </div>
                                  <div className="absolute bottom-2 left-2 right-2">
                                    <span className="text-[8px] text-white/60 font-medium truncate block">{item.name}</span>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center gap-3 p-3 bg-[#1d1d1f] rounded-xl border border-[#2c2c2e] hover:border-[#86868b] transition-all cursor-pointer group/file">
                                  <FileText size={16} className="text-[#2997ff]" />
                                  <div className="min-w-0 flex-1">
                                    <div className="text-[10px] font-bold text-[#f5f5f7] truncate max-w-[100px]">{item.name}</div>
                                    <div className="text-[8px] text-[#86868b] mt-0.5">{item.size}</div>
                                  </div>
                                  <button className="p-1 text-[#86868b] hover:text-white transition-colors">
                                    <Download size={12} />
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Compliance & Assets (Span 1) */}
          <div className="space-y-6">
            
            {/* Compliance & Safety */}
            <div className="bg-[#161617] rounded-[24px] p-8 border border-[#1d1d1f]">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <h3 className="text-lg font-semibold text-white">{isZh ? '合规与安全' : 'Compliance & Safety'}</h3>
                </div>
                <button className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-[#86868b] hover:text-white hover:bg-[#2c2c2e] transition-colors">
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <AssetItem 
                  isAdmin={true} 
                  icon={<FileText size={16} />} 
                  name={isZh ? '安全管理制度.pdf' : 'Safety_Regulations.pdf'} 
                  size="1.2 MB" 
                  status="signed"
                  onDelete={() => setItemToDelete({ id: 's1', name: isZh ? '安全管理制度.pdf' : 'Safety_Regulations.pdf', type: 'compliance' })}
                />
                <AssetItem 
                  isAdmin={true} 
                  icon={<FileText size={16} />} 
                  name={isZh ? '应急处置预案.pdf' : 'Emergency_Plan.pdf'} 
                  size="2.5 MB" 
                  status="pending"
                  onDelete={() => setItemToDelete({ id: 's2', name: isZh ? '应急处置预案.pdf' : 'Emergency_Plan.pdf', type: 'compliance' })}
                />
                <AssetItem 
                  isAdmin={true} 
                  icon={<FileText size={16} />} 
                  name={isZh ? '特种作业证件.pdf' : 'Special_Certificates.pdf'} 
                  size="4.8 MB" 
                  status="expired"
                  onDelete={() => setItemToDelete({ id: 's3', name: isZh ? '特种作业证件.pdf' : 'Special_Certificates.pdf', type: 'compliance' })}
                />
              </div>
              
              <button 
                onClick={() => handleFileUpload('compliance')}
                className="w-full mt-6 py-3 border border-dashed border-[#2c2c2e] rounded-xl text-[#86868b] text-xs font-medium hover:border-[#86868b] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud size={14} /> {isZh ? '上传安全资料' : 'Upload Safety Docs'}
              </button>
            </div>

            {/* Project Materials */}
            <div className="bg-[#161617] rounded-[24px] p-8 border border-[#1d1d1f]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-white">{isZh ? '项目资料' : 'Project Materials'}</h3>
                <button 
                  onClick={() => handleFileUpload('material')}
                  className="w-8 h-8 rounded-full bg-[#1d1d1f] flex items-center justify-center text-[#86868b] hover:text-white hover:bg-[#2c2c2e] transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
              
              <div className="space-y-3">
                <AssetItem 
                  isAdmin={true} 
                  icon={<FileText size={16} />} 
                  name={isZh ? '主合同_v2.pdf' : 'Contract_v2.pdf'} 
                  size="2.4 MB" 
                  onDelete={() => setItemToDelete({ id: 'm1', name: isZh ? '主合同_v2.pdf' : 'Contract_v2.pdf', type: 'material' })}
                />
                <AssetItem 
                  isAdmin={true} 
                  icon={<ImageIcon size={16} />} 
                  name={isZh ? '展台3D渲染图.png' : '3D_Render.png'} 
                  size="18.1 MB" 
                  onDelete={() => setItemToDelete({ id: 'm2', name: isZh ? '展台3D渲染图.png' : '3D_Render.png', type: 'material' })}
                />
                <AssetItem 
                  isAdmin={true} 
                  icon={<FileText size={16} />} 
                  name={isZh ? '施工报价单.xlsx' : 'Quotation.xlsx'} 
                  size="842 KB" 
                  onDelete={() => setItemToDelete({ id: 'm3', name: isZh ? '施工报价单.xlsx' : 'Quotation.xlsx', type: 'material' })}
                />
              </div>
              
              <button 
                onClick={() => handleFileUpload('material')}
                className="w-full mt-6 py-3 border border-dashed border-[#2c2c2e] rounded-xl text-[#86868b] text-xs font-medium hover:border-[#86868b] hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <UploadCloud size={14} /> {isZh ? '上传新资料' : 'Upload Materials'}
              </button>
            </div>

          </div>
        </div>
      </div>
      {/* Add Milestone Modal */}
      {isAddingMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsAddingMilestone(false)} />
          <div className="relative w-full max-w-lg bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">{isZh ? '添加新动态' : 'Add New Update'}</h3>
                <button onClick={() => setIsAddingMilestone(false)} className="text-[#86868b] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '标题' : 'Title'}</label>
                  <input 
                    type="text" 
                    placeholder={isZh ? '输入里程碑标题...' : 'Enter milestone title...'}
                    value={newMilestone.title}
                    onChange={(e) => setNewMilestone({...newMilestone, title: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '时间' : 'Time'}</label>
                  <input 
                    type="date" 
                    value={newMilestone.time}
                    onChange={(e) => setNewMilestone({...newMilestone, time: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '初始状态' : 'Initial Status'}</label>
                  <div className="flex gap-2">
                    {(['completed', 'in-progress', 'pending'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setNewMilestone({...newMilestone, status: s})}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          newMilestone.status === s 
                          ? 'bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/30' 
                          : 'bg-black/40 text-[#86868b] border-[#2c2c2e] hover:border-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '详细描述' : 'Description'}</label>
                  <textarea 
                    rows={3}
                    placeholder={isZh ? '描述当前进度或重要事项...' : 'Describe current progress or important notes...'}
                    value={newMilestone.description}
                    onChange={(e) => setNewMilestone({...newMilestone, description: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => setIsAddingMilestone(false)}
                  className="flex-1 py-3 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2c2c2e] transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleAddMilestone}
                  disabled={!newMilestone.title}
                  className={`flex-1 py-3 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-colors flex items-center justify-center gap-2 ${
                    newMilestone.title ? 'bg-[#2997ff] hover:bg-[#007aff]' : 'bg-[#1d1d1f] text-[#86868b] cursor-not-allowed'
                  }`}
                >
                  <Plus size={14} /> {isZh ? '添加' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Simulation Overlay */}
      {isExporting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-in fade-in duration-500">
          <div className="max-w-md w-full px-10 text-center">
            <div className="relative w-32 h-32 mx-auto mb-10">
              {/* Apple-style circular loader */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  className="text-white/5"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="60"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="transparent"
                  strokeDasharray={377}
                  strokeDashoffset={377 - (377 * exportProgress) / 100}
                  className="text-[#2997ff] transition-all duration-300 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-white tracking-tighter">{exportProgress}%</span>
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">
              {exportProgress < 100 
                ? (isZh ? '正在生成项目报告...' : 'Generating Project Report...') 
                : (isZh ? '报告生成成功' : 'Report Generated Successfully')}
            </h3>
            <p className="text-[#86868b] text-sm mb-10">
              {exportProgress < 100 
                ? (isZh ? '正在汇总里程碑、现场媒体及合规文档' : 'Compiling milestones, media, and compliance docs') 
                : (isZh ? '文件已准备就绪' : 'Your file is ready')}
            </p>
            
            {exportProgress === 100 && (
              <div className="animate-in zoom-in-95 duration-500">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 mb-8 flex items-center gap-3 text-emerald-400 text-sm font-medium">
                  <CheckCircle2 size={20} />
                  {isZh ? '报告已保存至本地下载文件夹' : 'Report saved to your local downloads folder'}
                </div>
                <button 
                  onClick={() => setIsExporting(false)}
                  className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#f5f5f7] transition-colors"
                >
                  {isZh ? '完成' : 'Done'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {editingMilestone && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingMilestone(null)} />
          <div className="relative w-full max-w-lg bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-white">{isZh ? '编辑里程碑' : 'Edit Milestone'}</h3>
                <button onClick={() => setEditingMilestone(null)} className="text-[#86868b] hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '标题' : 'Title'}</label>
                  <input 
                    type="text" 
                    value={editingMilestone.title}
                    onChange={(e) => setEditingMilestone({...editingMilestone, title: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '时间' : 'Time'}</label>
                  <input 
                    type="date" 
                    value={editingMilestone.time}
                    onChange={(e) => setEditingMilestone({...editingMilestone, time: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '状态' : 'Status'}</label>
                  <div className="flex gap-2">
                    {(['completed', 'in-progress', 'pending'] as const).map((s) => (
                      <button
                        key={s}
                        onClick={() => setEditingMilestone({...editingMilestone, status: s})}
                        className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${
                          editingMilestone.status === s 
                          ? 'bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/30' 
                          : 'bg-black/40 text-[#86868b] border-[#2c2c2e] hover:border-white/20'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '简介' : 'Description'}</label>
                  <textarea 
                    rows={3}
                    value={editingMilestone.description}
                    onChange={(e) => setEditingMilestone({...editingMilestone, description: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] focus:ring-1 focus:ring-[#2997ff] outline-none transition-all resize-none"
                  />
                </div>

                {/* Media Management in Edit Modal */}
                {editingMilestone.media && editingMilestone.media.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '附件管理' : 'Media Management'}</label>
                    <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                      {editingMilestone.media.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-black/20 rounded-lg border border-white/5">
                          <div className="flex items-center gap-2 min-w-0">
                            {item.type === 'image' ? <ImageIcon size={14} className="text-[#2997ff]" /> : <FileText size={14} className="text-[#2997ff]" />}
                            <span className="text-[10px] text-[#f5f5f7] truncate">{item.name || `File_${idx}`}</span>
                          </div>
                          <button 
                            onClick={() => {
                              const newMedia = [...(editingMilestone.media || [])];
                              newMedia.splice(idx, 1);
                              setEditingMilestone({...editingMilestone, media: newMedia});
                            }}
                            className="p-1 text-[#86868b] hover:text-rose-400 transition-colors"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => setEditingMilestone(null)}
                  className="flex-1 py-3 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2c2c2e] transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={() => handleSaveMilestone(editingMilestone)}
                  className="flex-1 py-3 bg-[#2997ff] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#007aff] transition-colors flex items-center justify-center gap-2"
                >
                  <Save size={14} /> {isZh ? '保存' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Media Preview Lightbox */}
      {previewMedia && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setPreviewMedia(null)} />
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <div className="absolute top-6 right-6 z-10 flex gap-3">
              <button className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all">
                <Download size={20} />
              </button>
              <button 
                onClick={() => setPreviewMedia(null)}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="w-full h-full flex items-center justify-center">
              {previewMedia.type === 'image' ? (
                <img src={previewMedia.url} alt={previewMedia.name} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="w-full h-full bg-[#1c1c1e] flex flex-col items-center justify-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-[#2997ff]/10 flex items-center justify-center text-[#2997ff]">
                    <Activity size={48} className="animate-pulse" />
                  </div>
                  <p className="text-white font-medium">{isZh ? '视频播放器集成中...' : 'Video player integration in progress...'}</p>
                  <p className="text-[#86868b] text-sm">{previewMedia.name}</p>
                </div>
              )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="text-white font-bold text-lg">{previewMedia.name}</h4>
            </div>
          </div>
        </div>
      )}

      {/* Progress Update Modal */}
      {isProgressModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsProgressModalOpen(false)} />
          <div className="relative w-full max-w-md bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-8">{isZh ? '更新执行进度' : 'Update Progress'}</h3>
            
            <div className="space-y-8">
              <div className="text-center">
                <div className="text-6xl font-black text-[#2997ff] tracking-tighter mb-2">
                  {tempProgress}<span className="text-2xl text-[#86868b] ml-1">%</span>
                </div>
                <p className="text-xs text-[#86868b] uppercase tracking-widest font-bold">
                  {isZh ? '拖动滑块调整' : 'Slide to adjust'}
                </p>
              </div>
              
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={tempProgress}
                onChange={(e) => setTempProgress(parseInt(e.target.value))}
                className="w-full h-2 bg-[#1d1d1f] rounded-full appearance-none cursor-pointer accent-[#2997ff]"
              />
              
              <div className="flex gap-3 pt-4">
                <button 
                  onClick={() => setIsProgressModalOpen(false)}
                  className="flex-1 py-4 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2c2c2e] transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleUpdateProgress}
                  className="flex-1 py-4 bg-[#2997ff] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#007aff] transition-colors"
                >
                  {isZh ? '确认更新' : 'Confirm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setItemToDelete(null)} />
          <div className="relative w-full max-w-sm bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{isZh ? '确认删除？' : 'Confirm Delete?'}</h3>
            <p className="text-sm text-[#86868b] mb-8 leading-relaxed">
              {isZh ? `您确定要删除“${itemToDelete.name}”吗？此操作无法撤销。` : `Are you sure you want to delete "${itemToDelete.name}"? This action cannot be undone.`}
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setItemToDelete(null)}
                className="flex-1 py-4 bg-[#1d1d1f] text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-[#2c2c2e] transition-colors"
              >
                {isZh ? '取消' : 'Cancel'}
              </button>
              <button 
                onClick={handleDeleteItem}
                className="flex-1 py-4 bg-rose-500 text-white text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-colors"
              >
                {isZh ? '删除' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ComplianceItem: React.FC<{ label: string; status: 'signed' | 'pending' | 'expired' }> = ({ label, status }) => {
  const { language } = useAppStore();
  const isZh = language === Language.ZH;
  
  const statusConfig = {
    signed: {
      text: isZh ? '已签署' : 'Signed',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      icon: <CheckCircle2 size={12} />
    },
    pending: {
      text: isZh ? '待审核' : 'Pending',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      icon: <AlertCircle size={12} />
    },
    expired: {
      text: isZh ? '已过期' : 'Expired',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10',
      icon: <AlertCircle size={12} />
    }
  };

  const config = statusConfig[status];

  return (
    <div className="flex justify-between items-center group/item p-2 hover:bg-white/5 rounded-xl transition-colors">
      <div className="flex items-center gap-3">
        <FileText size={14} className="text-[#86868b]" />
        <span className="text-sm text-[#f5f5f7] font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className={`flex items-center gap-1.5 ${config.color} ${config.bg} px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider`}>
          {config.icon} {config.text}
        </div>
        <button className="p-1.5 text-[#86868b] hover:text-white transition-colors opacity-0 group-hover/item:opacity-100">
          <Download size={14} />
        </button>
      </div>
    </div>
  );
};

const AssetItem: React.FC<{ 
  icon: React.ReactNode; 
  name: string; 
  size: string; 
  isAdmin: boolean; 
  status?: 'signed' | 'pending' | 'expired';
  onDelete?: () => void 
}> = ({ icon, name, size, isAdmin, status, onDelete }) => {
  const isZh = useAppStore.getState().language === Language.ZH;
  
  return (
    <div className="flex items-center gap-3 p-3 bg-[#1d1d1f] rounded-xl hover:bg-[#2c2c2e] transition-colors cursor-pointer group">
      <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-[#2997ff]">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-[#f5f5f7] truncate group-hover:text-white transition-colors">{name}</div>
          {status && (
            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
              status === 'signed' ? 'bg-emerald-500/10 text-emerald-400' :
              status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
              'bg-rose-500/10 text-rose-400'
            }`}>
              {status === 'signed' ? (isZh ? '已签署' : 'Signed') :
               status === 'pending' ? (isZh ? '待审核' : 'Pending') :
               (isZh ? '已过期' : 'Expired')}
            </span>
          )}
        </div>
        <div className="text-[10px] text-[#86868b] mt-0.5">{size}</div>
      </div>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-1.5 text-[#86868b] hover:text-[#2997ff] transition-colors" title="Download">
          <Download size={14} />
        </button>
        {(isAdmin || onDelete) && (
          <>
            <button className="p-1.5 text-[#86868b] hover:text-white transition-colors" title="Edit">
              <Edit3 size={14} />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
              className="p-1.5 text-[#86868b] hover:text-rose-400 transition-colors" 
              title="Delete"
            >
              <Trash2 size={14} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectWorkspace;
