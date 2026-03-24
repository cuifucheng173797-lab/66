
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Globe, Zap, Calendar, ArrowRight, 
  ChevronRight, ChevronLeft, Maximize2, Minimize2, 
  Plus, Download, Trash2, AlertTriangle,
  Lightbulb, ShieldCheck, Cpu, Network,
  TrendingUp, FileText, X, ChevronDown, ChevronUp,
  Info, MousePointer2, Layers, Target, Activity,
  Terminal, Database, Fingerprint, Clock, BarChart3,
  User, MapPin, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { translations, Language, CALENDAR_COLORS, UserRole } from '../constants';
import { useAppStore, CalendarEvent } from '../store';

interface IntelligenceCenterProps {
  language: Language;
}

const IntelligenceCenter: React.FC<IntelligenceCenterProps> = ({ language }) => {
  const { 
    calendarEvents, 
    addCalendarEvent, 
    deleteCalendarEvent, 
    user, 
    projects,
    setActiveTab,
    setSelectedProjectId
  } = useAppStore();
  const t = translations[language].intelligence;
  
  const isSystemAdmin = user?.role === UserRole.SYSTEM_ADMIN;
  const isEntHead = user?.role === UserRole.ENT_HEAD;
  const isStaff = user?.role === UserRole.ENT_STAFF;
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [activeBriefTab, setActiveBriefTab] = useState<string>('intl');
  
  // Calendar States
  const [selectedBrief, setSelectedBrief] = useState<typeof briefData[0] | null>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0);
  const [calendarView, setCalendarView] = useState<'2' | '6' | '12'>('2');

  const [formData, setFormData] = useState<Partial<CalendarEvent>>({
    title: '',
    owner: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    type: 'other',
    color: '#0071E3',
    attachments: []
  });

  // Daily Briefing Data
  const briefData = useMemo(() => [
    { 
      category: 'intl', 
      icon: <Globe size={16} />, 
      color: '#0071E3',
      gridSpan: 'md:col-span-8',
      tag: language === 'zh' ? '全球动态' : 'Global',
      items: Array.from({ length: 10 }).map((_, i) => ({
        title: language === 'zh' ? `国际情报 #${i + 1}: ${['VDMA 报告', '地缘政策', '出口标准', '供应链韧性', '欧洲市场', '对华贸易', '关税波动', '物流瓶颈', '跨国协作', '全球趋势'][i]}` : `Intl Intel #${i + 1}: ${['VDMA Report', 'Geopolitics', 'Export Standards', 'Supply Chain', 'EU Market', 'China Trade', 'Tariff Fluctuations', 'Logistics', 'Global Collab', 'Global Trends'][i]}`,
        desc: language === 'zh' ? '详细的情报摘要内容，涉及全球供应链及地缘政策影响。' : 'Detailed intelligence summary regarding global supply chain and geopolitical impacts.'
      }))
    },
    { 
      category: 'tech', 
      icon: <Cpu size={16} />, 
      color: '#A855F7',
      gridSpan: 'md:col-span-4',
      tag: language === 'zh' ? '前沿科技' : 'Tech',
      items: Array.from({ length: 10 }).map((_, i) => ({
        title: language === 'zh' ? `科技情报 #${i + 1}: ${['AI 机器人', '数字孪生', '新型材料', '工业 4.0', '自动化标准', '量子计算', '边缘计算', '5G 工业应用', '增材制造', '绿色能源'][i]}` : `Tech Intel #${i + 1}: ${['AI Robots', 'Digital Twin', 'New Materials', 'Industry 4.0', 'Automation Standards', 'Quantum Computing', 'Edge Computing', '5G Industrial', 'Additive Mfg', 'Green Energy'][i]}`,
        desc: language === 'zh' ? '关于工业 4.0 及前沿技术的最新进展与标准发布。' : 'Latest developments and standard releases in Industry 4.0 and frontier technologies.'
      }))
    },
    { 
      category: 'local', 
      icon: <ShieldCheck size={16} />, 
      color: '#10B981',
      gridSpan: 'md:col-span-4',
      tag: language === 'zh' ? '本地政策' : 'Local',
      items: Array.from({ length: 10 }).map((_, i) => ({
        title: language === 'zh' ? `本地情报 #${i + 1}: ${['工信部试点', '上海指令', '数字化补贴', '行政指令', '产线升级', '区域协作', '人才政策', '税收优惠', '环保要求', '安全生产'][i]}` : `Local Intel #${i + 1}: ${['MIIT Pilot', 'SH Directive', 'Digital Subsidy', 'Admin Order', 'Line Upgrade', 'Regional Collab', 'Talent Policy', 'Tax Incentives', 'Green Req', 'Safety Prod'][i]}`,
        desc: language === 'zh' ? '国内工信部政策、各省市数字化补贴及行政指令详情。' : 'Details on domestic MIIT policies, provincial digital subsidies, and administrative orders.'
      }))
    },
    { 
      category: 'industry', 
      icon: <TrendingUp size={16} />, 
      color: '#F59E0B',
      gridSpan: 'md:col-span-8',
      tag: language === 'zh' ? '行业波动' : 'Industry',
      items: Array.from({ length: 10 }).map((_, i) => ({
        title: language === 'zh' ? `行业情报 #${i + 1}: ${['汉诺威预订', 'CIIF 动态', 'PMI 指数', '原材料价格', '展位稀缺', '行业展会', '市场调研', '竞争对手', '采购趋势', '库存预警'][i]}` : `Industry Intel #${i + 1}: ${['Hannover Booking', 'CIIF News', 'PMI Index', 'Raw Materials', 'Booth Scarcity', 'Exhibitions', 'Market Research', 'Competitors', 'Sourcing Trends', 'Inventory Warning'][i]}`,
        desc: language === 'zh' ? '核心展会预订率、PMI 指数及原材料价格波动分析。' : 'Analysis of core exhibition booking rates, PMI index, and raw material price fluctuations.'
      }))
    }
  ], [language]);

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setShowReport(true);
    }, 2500);
  };

  const handleAddEvent = () => {
    if (!formData.title || !formData.startDate || !formData.endDate) return;
    
    const event: CalendarEvent = {
      id: editingEvent?.id || Math.random().toString(36).substr(2, 9),
      title: formData.title || '',
      startDate: formData.startDate || '',
      endDate: formData.endDate || '',
      owner: formData.owner || '',
      creatorId: editingEvent?.creatorId || user?.id || 'unknown',
      location: formData.location || '',
      description: formData.description || '',
      type: formData.type || 'other',
      color: formData.color || '#0071E3',
      attachments: formData.attachments || []
    };

    if (editingEvent) {
      useAppStore.getState().updateCalendarEvent(event);
    } else {
      addCalendarEvent(event);
    }
    
    setIsModalOpen(false);
    setEditingEvent(null);
    setFormData({
      title: '',
      owner: '',
      startDate: '',
      endDate: '',
      location: '',
      description: '',
      type: 'other',
      color: '#0071E3',
      attachments: []
    });
  };

  const openAddModal = (date?: string) => {
    setEditingEvent(null);
    setFormData({
      title: '',
      owner: '',
      startDate: date || new Date().toISOString().split('T')[0],
      endDate: date || new Date().toISOString().split('T')[0],
      location: '',
      description: '',
      type: 'other',
      color: '#0071E3',
      attachments: []
    });
    setIsModalOpen(true);
  };

  const canEditEvent = (event: CalendarEvent) => {
    if (isSystemAdmin || isEntHead) return true;
    return event.creatorId === user?.id;
  };

  const openEditModal = (event: CalendarEvent) => {
    if (!canEditEvent(event)) {
      // Just show details if can't edit? Or maybe just return.
      // For now, let's allow opening but disable save/delete in the modal if not owner.
    }
    setEditingEvent(event);
    setFormData(event);
    setIsModalOpen(true);
  };

  const getDaysUntil = (dateStr: string) => {
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  // Calendar Logic for Dual Month
  const renderMonth = (monthOffset: number) => {
    const date = new Date();
    date.setMonth(date.getMonth() + monthOffset + currentMonthOffset);
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const monthName = date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { month: 'long', year: 'numeric' });

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    // Helper to check if a date is within an event's range
    const getEventsForDate = (dateStr: string) => {
      const events = calendarEvents.filter(event => {
        return dateStr >= event.startDate && dateStr <= event.endDate;
      }).map(e => ({ ...e, isProject: false, isMilestone: false }));

      const projectsInDate = projects.filter(p => {
        return dateStr >= p.startDate && dateStr <= p.endDate;
      }).map(p => ({
        id: p.id,
        title: `[${language === 'zh' ? '项目' : 'PROJ'}] ${p.title}`,
        color: '#2997ff',
        isProject: true,
        isMilestone: false,
        project: p,
        startDate: p.startDate,
        endDate: p.endDate
      }));

      const milestonesInDate = projects.flatMap(p => 
        (p.milestones || []).filter(m => m.time === dateStr).map(m => ({
          id: m.id,
          title: `[${language === 'zh' ? '里程碑' : 'MILE'}] ${m.title}`,
          color: '#A855F7',
          isProject: false,
          isMilestone: true,
          project: p,
          milestone: m,
          startDate: m.time,
          endDate: m.time
        }))
      );

      return [...events, ...projectsInDate, ...milestonesInDate];
    };

    return (
      <div className="flex-1 min-w-[300px] space-y-6">
        <h3 className="text-sm font-bold text-white uppercase tracking-[0.3em] border-b border-white/10 pb-4">
          {monthName}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
            <div key={index} className={`text-[10px] font-bold text-center py-2 ${index === 0 || index === 6 ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>{d}</div>
          ))}
          {days.map((day, idx) => {
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
            const dayEvents = dateStr ? getEventsForDate(dateStr) : [];
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            const isWeekend = idx % 7 === 0 || idx % 7 === 6;

            return (
              <div 
                key={idx} 
                onClick={() => dateStr && openAddModal(dateStr)}
                className={`relative min-h-[90px] rounded-lg border flex flex-col items-start p-1.5 cursor-pointer transition-all group
                  ${!day ? 'border-transparent' : isWeekend ? 'border-white/5 bg-black/20 hover:bg-black/40 hover:border-white/10' : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/20'}
                `}
              >
                {day && (
                  <>
                    <span className={`text-[10px] font-bold mb-2 ${isToday ? 'bg-[#0071E3] text-white w-5 h-5 rounded-full flex items-center justify-center' : isWeekend ? 'text-[#6e6e73]' : 'text-[#86868b]'}`}>
                      {day}
                    </span>
                    <div className="w-full space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 3).map(e => {
                        const isSpecial = (e as any).isProject || (e as any).isMilestone;
                        return (
                          <div 
                            key={e.id} 
                            onClick={(ev) => {
                              ev.stopPropagation();
                              if (isSpecial) {
                                setSelectedProjectId((e as any).project.id);
                                setActiveTab('kanban');
                              } else {
                                openEditModal(e as CalendarEvent);
                              }
                            }}
                            className={`h-5 w-full rounded-md flex items-center px-2 transition-all hover:brightness-110 active:scale-[0.98] shadow-sm ${isSpecial ? 'ring-1 ring-white/20' : ''}`}
                            style={{ backgroundColor: e.color }}
                          >
                            <span className="text-[9px] font-bold text-white truncate leading-none">
                              {e.title}
                            </span>
                          </div>
                        );
                      })}
                      {dayEvents.length > 3 && (
                        <div className="text-[9px] font-bold text-[#86868b] px-1 pt-0.5">
                          + {dayEvents.length - 3} {language === 'zh' ? '更多' : 'more'}
                        </div>
                      )}
                    </div>
                    {/* Hover Plus */}
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={12} className="text-[#86868b]" />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col bg-black overflow-hidden selection:bg-[#0071E3]/30">
      <div className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12">
        <div className="max-w-7xl mx-auto space-y-20">
          
          {/* 1. Strategic Command Center - Unified HUD */}
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Terminal className="text-[#0071E3]" />
                {t.commandCenter.title}
              </h2>
              <div className="flex items-center gap-4 text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
                <span className="flex items-center gap-1.5"><Clock size={12} /> SYNC: 1.2s AGO</span>
                <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative overflow-hidden rounded-[32px] bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 shadow-2xl"
            >
              {/* Background Telemetry Grid */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.02),rgba(0,255,0,0.01),rgba(0,0,255,0.02))] bg-[length:100%_2px,3px_100%] z-0 opacity-20" />
              
              <div className="relative z-10 p-10 flex flex-col lg:grid lg:grid-cols-12 gap-12">
                {/* Left: Main Alert & Action (60%) */}
                <div className="lg:col-span-7 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="px-4 py-1.5 bg-[#0071E3]/20 border border-[#0071E3]/30 rounded-full text-[10px] font-bold text-[#0071E3] uppercase tracking-widest">
                      {t.commandCenter.badge}
                    </div>
                    <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">
                      {new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })} GMT
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {!showReport ? (
                      <motion.div 
                        key="alert"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="space-y-6"
                      >
                        <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                          {t.commandCenter.alertTitle}
                        </h3>
                        <p className="text-lg text-[#86868b] leading-relaxed">
                          {t.commandCenter.alertDesc}
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                          <button 
                            onClick={handleGenerateReport}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-8 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-full text-sm font-bold transition-all shadow-lg shadow-[#0071E3]/20 disabled:opacity-50"
                          >
                            {isGenerating ? (language === 'zh' ? '深度计算中...' : 'Computing...') : t.commandCenter.actionBtn} <ArrowRight size={18} />
                          </button>
                          <div className="flex items-center gap-6 px-6 py-4 bg-white/5 rounded-full border border-white/5">
                            <div className="space-y-1">
                              <div className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">{t.commandCenter.riskLevel}</div>
                              <div className="flex gap-1">
                                {[1,2,3,4,5].map(i => <div key={i} className={`w-3 h-1 rounded-full ${i <= 3 ? 'bg-amber-500' : 'bg-white/10'}`} />)}
                              </div>
                            </div>
                            <div className="w-px h-6 bg-white/10" />
                            <div className="space-y-1">
                              <div className="text-[9px] font-bold text-[#86868b] uppercase tracking-widest">{t.commandCenter.opportunity}</div>
                              <div className="text-xs font-bold text-green-500">+12.4%</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="report"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <BarChart3 className="text-[#0071E3]" />
                            <h4 className="text-xl font-bold text-white tracking-tight">STRATEGIC_MEMO_V2.0</h4>
                          </div>
                          <button onClick={() => setShowReport(false)} className="text-[#86868b] hover:text-white"><X size={20} /></button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                            <div className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">SIGNAL_DIAGNOSIS</div>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {language === 'zh' ? '汉诺威展位售罄信号，确认行业复苏拐点。' : 'Hannover booth sell-out confirms industry recovery inflection point.'}
                            </p>
                          </div>
                          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                            <div className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">COLLISION_ANALYSIS</div>
                            <p className="text-sm text-white/80 leading-relaxed">
                              {language === 'zh' ? '对撞资产：2026 欧洲出海计划。风险：品牌曝光缺失。' : 'Collision: 2026 Europe Plan. Risk: Brand exposure loss.'}
                            </p>
                          </div>
                          <div className="md:col-span-2 p-8 bg-[#0071E3]/10 border border-[#0071E3]/20 rounded-2xl space-y-4">
                            <div className="text-[10px] font-bold text-[#0071E3] uppercase tracking-widest">TACTICAL_INSTRUCTIONS</div>
                            <ul className="space-y-3">
                              {[
                                language === 'zh' ? '立即锁定备选展位供应商' : 'Lock alternative booth suppliers',
                                language === 'zh' ? '调整 Q2 预算，预留 10% 风险金' : 'Adjust Q2 budget, reserve 10% risk fund',
                                language === 'zh' ? '启动数字化试点专项申报' : 'Start digital pilot application'
                              ].map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-white font-bold">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#0071E3]" />
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: Logic Chain & Telemetry (40%) */}
                <div className="lg:col-span-5 space-y-8 border-l border-white/5 lg:pl-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.2em]">{t.commandCenter.logicTitle}</h4>
                    <div className="space-y-6 relative">
                      <div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-[#0071E3] via-[#0071E3]/20 to-transparent" />
                      {t.commandCenter.logicStages.map((stage, idx) => (
                        <div key={idx} className="relative z-10 flex items-center gap-6 group">
                          <div className="w-8 h-8 rounded-lg bg-[#0071E3] text-white flex items-center justify-center shadow-[0_0_15px_rgba(0,113,227,0.4)]">
                            {idx === 0 ? <Globe size={14} /> : idx === 1 ? <Network size={14} /> : <Target size={14} />}
                          </div>
                          <div>
                            <div className="text-[11px] font-bold text-white uppercase tracking-widest">{stage}</div>
                            <div className="text-[9px] font-mono text-[#0071E3]/70">STATUS: ACTIVE</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
                    <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">System Telemetry</div>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { label: t.commandCenter.telemetry.nodes, value: '1,242', color: 'text-blue-400' },
                        { label: t.commandCenter.telemetry.gates, value: 'ACTIVE', color: 'text-green-400' },
                        { label: t.commandCenter.telemetry.threat, value: 'NOMINAL', color: 'text-blue-400' }
                      ].map(item => (
                        <div key={item.label} className="flex items-center justify-between text-[10px] font-mono">
                          <span className="text-[#86868b]">{item.label}</span>
                          <span className={item.color}>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 2. Intelligence Matrix - Bento Grid */}
            <div className="space-y-10">
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Activity className="text-[#0071E3]" />
                {t.dailyBrief.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {briefData.map((brief) => (
                  <motion.div
                    key={brief.category}
                    whileHover={{ scale: 1.01, y: -5 }}
                    onClick={() => setSelectedBrief(brief)}
                    className={`group relative overflow-hidden rounded-[32px] p-8 bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 cursor-pointer transition-all ${brief.gridSpan}`}
                  >
                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none"
                      style={{ background: `radial-gradient(circle at center, ${brief.color}, transparent 70%)` }}
                    />

                    <div className="relative z-10 h-full flex flex-col">
                      <div className="flex items-center justify-between mb-8">
                        <div 
                          className="w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500"
                          style={{ backgroundColor: `${brief.color}20`, color: brief.color }}
                        >
                          {brief.icon}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-bold uppercase tracking-[0.2em] opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: brief.color }}>
                            {brief.tag}
                          </span>
                          <ArrowRight size={18} className="text-[#86868b] group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-white mb-4 tracking-tight group-hover:text-white transition-colors">
                        {t.dailyBrief.categories[brief.category as keyof typeof t.dailyBrief.categories]}
                      </h3>

                      {/* Preview List */}
                      <div className="space-y-3 mb-6 flex-1">
                        {brief.items.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-start gap-3 group/item">
                            <div className="w-1 h-1 rounded-full mt-2 transition-all group-hover/item:scale-150" style={{ backgroundColor: brief.color }} />
                            <p className="text-xs text-[#86868b] group-hover/item:text-white/80 transition-colors line-clamp-1">
                              {item.title}
                            </p>
                          </div>
                        ))}
                      </div>

                      <p className="text-xs text-[#86868b]/60 leading-relaxed italic">
                        {language === 'zh' ? `共 ${brief.items.length} 条情报待查阅` : `${brief.items.length} intel reports available`}
                      </p>
                    </div>
                    
                    {/* Decorative background element */}
                    <div 
                      className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-5 group-hover:opacity-20 transition-all duration-700"
                      style={{ backgroundColor: brief.color }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* 3. Smart Calendar - Dual Month & Cell Management */}
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <Calendar className="text-white" />
                {t.smartCalendar.title}
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1 mr-2">
                  <button onClick={() => setCalendarView('2')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${calendarView === '2' ? 'bg-white/20 text-white' : 'text-[#86868b] hover:text-white'}`}>2M</button>
                  <button onClick={() => setCalendarView('6')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${calendarView === '6' ? 'bg-white/20 text-white' : 'text-[#86868b] hover:text-white'}`}>6M</button>
                  <button onClick={() => setCalendarView('12')} className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${calendarView === '12' ? 'bg-white/20 text-white' : 'text-[#86868b] hover:text-white'}`}>12M</button>
                </div>
                <button 
                  onClick={() => setCurrentMonthOffset(0)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-white uppercase tracking-widest transition-all"
                >
                  {t.smartCalendar.today}
                </button>
                <div className="flex items-center bg-white/5 rounded-full border border-white/10 p-1">
                  <button 
                    onClick={() => setCurrentMonthOffset(prev => prev - parseInt(calendarView))}
                    className="p-2 hover:bg-white/10 rounded-full text-[#86868b] hover:text-white transition-all"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button 
                    onClick={() => setCurrentMonthOffset(prev => prev + parseInt(calendarView))}
                    className="p-2 hover:bg-white/10 rounded-full text-[#86868b] hover:text-white transition-all"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 rounded-[32px] p-10">
              <div className="grid gap-16 grid-cols-1 xl:grid-cols-2">
                {Array.from({ length: parseInt(calendarView) }).map((_, i) => (
                  <React.Fragment key={i}>
                    {renderMonth(i)}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </section>

          {/* Event Editor Modal */}
          <AnimatePresence>
            {isModalOpen && (
              <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsModalOpen(false)}
                  className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  className="relative w-full max-w-2xl bg-[#1c1c1e] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                  {/* Modal Header */}
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/2">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {editingEvent ? t.smartCalendar.editEvent : t.smartCalendar.title}
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-[#86868b] hover:text-white transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  {/* Modal Body */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {/* Title Input */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.title}</label>
                      <input 
                        type="text"
                        value={formData.title}
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder={t.smartCalendar.placeholders.title}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-[#424245] focus:outline-none focus:border-[#0071E3] transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Owner */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.owner}</label>
                        <div className="relative">
                          <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b]" />
                          <input 
                            type="text"
                            value={formData.owner}
                            onChange={e => setFormData({...formData, owner: e.target.value})}
                            placeholder={t.smartCalendar.placeholders.owner}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-[#424245] focus:outline-none focus:border-[#0071E3] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Location */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.location}</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-[#86868b]" />
                          <input 
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({...formData, location: e.target.value})}
                            placeholder={t.smartCalendar.placeholders.location}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 py-4 text-white placeholder:text-[#424245] focus:outline-none focus:border-[#0071E3] transition-colors"
                          />
                        </div>
                      </div>

                      {/* Start Date */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.startDate}</label>
                        <input 
                          type="date"
                          value={formData.startDate}
                          onChange={e => setFormData({...formData, startDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#0071E3] transition-colors [color-scheme:dark]"
                        />
                      </div>

                      {/* End Date */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.endDate}</label>
                        <input 
                          type="date"
                          value={formData.endDate}
                          onChange={e => setFormData({...formData, endDate: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-[#0071E3] transition-colors [color-scheme:dark]"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.description}</label>
                      <textarea 
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder={t.smartCalendar.placeholders.description}
                        rows={4}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-[#424245] focus:outline-none focus:border-[#0071E3] transition-colors resize-none"
                      />
                    </div>

                    {/* Color Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.color}</label>
                      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                        {CALENDAR_COLORS.map(c => (
                          <button
                            key={c.value}
                            onClick={() => setFormData({...formData, color: c.value})}
                            className={`aspect-square rounded-xl border-2 transition-all flex items-center justify-center
                              ${formData.color === c.value ? 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent opacity-60 hover:opacity-100'}
                            `}
                            style={{ backgroundColor: c.value }}
                            title={c.label[language]}
                          >
                            {formData.color === c.value && <div className="w-2 h-2 rounded-full bg-white" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Attachments Placeholder */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{t.smartCalendar.fields.attachments}</label>
                      <div className="border-2 border-dashed border-white/5 rounded-2xl p-8 flex flex-col items-center justify-center text-[#86868b] hover:bg-white/2 transition-colors cursor-pointer">
                        <FileText size={32} className="mb-3 opacity-20" />
                        <span className="text-xs">{t.smartCalendar.placeholders.attachments}</span>
                      </div>
                    </div>
                  </div>

                  {/* Modal Footer */}
                  <div className="p-8 border-t border-white/5 bg-white/2 flex items-center justify-between gap-4">
                    {editingEvent && canEditEvent(editingEvent) && (
                      <button 
                        onClick={() => {
                          deleteCalendarEvent(editingEvent.id);
                          setIsModalOpen(false);
                        }}
                        className="px-8 py-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-2xl font-bold text-sm transition-all flex items-center gap-2"
                      >
                        <Trash2 size={16} />
                        {t.smartCalendar.deleteEvent}
                      </button>
                    )}
                    <div className="flex items-center gap-4 ml-auto">
                      <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-sm transition-all"
                      >
                        {language === 'zh' ? '取消' : 'Cancel'}
                      </button>
                      {(!editingEvent || canEditEvent(editingEvent)) && (
                        <button 
                          onClick={handleAddEvent}
                          className="px-10 py-4 bg-[#0071E3] hover:bg-[#0077ED] text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(0,113,227,0.3)] transition-all"
                        >
                          {editingEvent ? t.smartCalendar.editEvent : t.smartCalendar.fields.title}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Side Drawer for Briefing Details */}
          <AnimatePresence>
            {selectedBrief && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBrief(null)}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
                />
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-[#1c1c1e] border-l border-white/10 z-[101] overflow-hidden flex flex-col"
                >
                  <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#1c1c1e]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#0071E3]/10 text-[#0071E3] flex items-center justify-center">
                        {selectedBrief.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white tracking-tight">
                          {t.dailyBrief.categories[selectedBrief.category as keyof typeof t.dailyBrief.categories]}
                        </h3>
                        <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest mt-1">Intelligence Stream</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedBrief(null)}
                      className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#86868b] hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                    {selectedBrief.items.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-6 rounded-2xl bg-white/2 border border-white/5 hover:border-white/10 transition-all"
                      >
                        <h4 className="text-base font-bold text-white mb-3">{item.title}</h4>
                        <p className="text-sm text-[#86868b] leading-relaxed">{item.desc}</p>
                        <div className="flex items-center gap-4 mt-4">
                          <div className="text-[10px] font-bold text-[#0071E3] uppercase tracking-widest">Verified</div>
                          <div className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">Source: VDMA-AI-NODE</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>


        </div>
      </div>
    </div>
  );
};

export default IntelligenceCenter;
