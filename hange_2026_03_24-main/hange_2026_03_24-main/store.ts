
import { create } from 'zustand';
import { Language, UserRole, Enterprise, mockEnterprises } from './constants';

interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  enterpriseId?: string; // Staff belongs to one enterprise
}

export interface CalendarEvent {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  owner: string;
  creatorId: string; // ID of the user who created the event
  location: string;
  description: string;
  attachments: string[];
  type: 'exhibition' | 'training' | 'meeting' | 'emergency' | 'other';
  color: string;
}

export interface MilestoneMedia {
  type: 'image' | 'video' | 'document';
  url: string;
  name?: string;
  size?: string;
}

export interface Milestone {
  id: string;
  title: string;
  time: string; // YYYY-MM-DD HH:mm
  status: 'completed' | 'in-progress' | 'pending';
  description?: string;
  media?: MilestoneMedia[];
  updatedBy?: string;
  updatedAt?: string;
}

export type ProjectStatus = 'Live' | 'Upcoming' | 'Completed';

export interface Project {
  id: string;
  title: string;
  status: ProjectStatus;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  city: string;
  tags: string[];
  category: string;
  client: string;
  isExclusive?: boolean;
  progress?: number; 
  enterpriseId: string;
  lastUpdate?: {
    time: string;
    action: string;
    photo: string;
  };
  compliance?: {
    insurance: boolean;
    designApproval: boolean;
    materialCert: boolean;
    safetyPlan: boolean;
  };
  milestones?: Milestone[];
}

interface AppState {
  language: Language;
  setLanguage: (lang: Language) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  enterprises: Enterprise[];
  addEnterprise: (ent: Enterprise) => void;
  deleteEnterprise: (id: string) => void;
  activeEnterprise: Enterprise | null;
  setActiveEnterprise: (ent: Enterprise | null) => void;
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: CalendarEvent) => void;
  deleteCalendarEvent: (id: string) => void;
  updateCalendarEvent: (event: CalendarEvent) => void;
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedProjectId: string | null;
  setSelectedProjectId: (id: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: Language.ZH,
  setLanguage: (lang) => set({ language: lang }),
  user: null,
  setUser: (user) => set({ user }),
  enterprises: mockEnterprises,
  addEnterprise: (ent) => set((state) => ({ enterprises: [...state.enterprises, ent] })),
  deleteEnterprise: (id) => set((state) => ({ 
    enterprises: state.enterprises.filter(e => e.id !== id),
    activeEnterprise: state.activeEnterprise?.id === id ? null : state.activeEnterprise
  })),
  activeEnterprise: null,
  setActiveEnterprise: (ent) => set({ activeEnterprise: ent }),
  calendarEvents: [
    { 
      id: '1', 
      title: 'Hannover Messe 2026', 
      startDate: '2026-04-20', 
      endDate: '2026-04-24', 
      owner: '张部长',
      creatorId: 'admin-1',
      location: 'Hannover Exhibition Center',
      description: '全球领先的工业贸易展览会。',
      attachments: [],
      type: 'exhibition', 
      color: '#0071E3' 
    },
    { 
      id: '2', 
      title: 'CIIF 2026 Planning', 
      startDate: '2026-05-15', 
      endDate: '2026-05-15', 
      owner: '李经理',
      creatorId: 'head-1',
      location: '上海国家会展中心',
      description: '中国国际工业博览会筹备会议。',
      attachments: [],
      type: 'meeting', 
      color: '#af52de' 
    },
    { 
      id: '3', 
      title: 'Digital Twin Workshop', 
      startDate: '2026-03-28', 
      endDate: '2026-03-30', 
      owner: '王专家',
      creatorId: 'staff-1',
      location: '线上会议',
      description: '数字孪生技术深度研讨。',
      attachments: [],
      type: 'training', 
      color: '#34c759' 
    },
  ],
  projects: [
    {
      id: 'p1',
      title: '2026 上海国际自行车展',
      status: 'Live',
      startDate: '2026-03-10',
      endDate: '2026-03-12',
      city: '上海',
      tags: ['特装搭建', '现场执行'],
      category: 'Exhibition',
      progress: 75,
      client: '国际自行车协会',
      enterpriseId: 'ent_001',
      lastUpdate: {
        time: '10分钟前',
        action: '主桁架结构已完成吊装',
        photo: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=400&q=80'
      },
      milestones: [
        {
          id: 'm1',
          title: '展台结构设计确认',
          time: '2026-03-05 14:00',
          status: 'completed',
          description: '主展位 3D 方案已获客户最终签字确认。',
          media: [
            { type: 'document', url: '#', name: '设计方案_最终版.pdf', size: '12.4 MB' },
            { type: 'image', url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80' }
          ]
        },
        {
          id: 'm2',
          title: '施工材料进场报备',
          time: '2026-03-08 09:30',
          status: 'completed',
          description: '所有防火材料及结构件已通过场馆安检。',
          media: [
            { type: 'document', url: '#', name: '材料清单.xlsx', size: '1.2 MB' }
          ]
        },
        {
          id: 'm3',
          title: '主结构搭建完成',
          time: '2026-03-10 16:45',
          status: 'in-progress',
          description: '主桁架已吊装完毕，正在进行灯光布线。',
          media: [
            { type: 'image', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80' },
            { type: 'video', url: '#', name: '现场施工快报.mp4' }
          ]
        }
      ]
    },
    {
      id: 'p2',
      title: '全球半导体技术峰会',
      status: 'Upcoming',
      startDate: '2026-11-12',
      endDate: '2026-11-15',
      city: '慕尼黑',
      tags: ['跨国协同', '德国独家'],
      category: 'Conference',
      isExclusive: true,
      client: '全球半导体集团',
      enterpriseId: 'ent_001',
      compliance: { insurance: true, designApproval: true, materialCert: false, safetyPlan: true }
    },
    {
      id: 'p3',
      title: '航空科技新品发布会',
      status: 'Completed',
      startDate: '2026-09-20',
      endDate: '2026-09-22',
      city: '上海',
      tags: ['360㎡', '复刻展台'],
      category: 'Promotion',
      client: '航空科技系统',
      enterpriseId: 'ent_002'
    },
    {
      id: 'p4',
      title: '年度经销商培训营',
      status: 'Upcoming',
      startDate: '2026-10-05',
      endDate: '2026-10-08',
      city: '北京',
      tags: ['内部培训', '封闭式'],
      category: 'Training',
      client: '北汽集团',
      enterpriseId: 'ent_002'
    },
    {
      id: 'p5',
      title: '智能制造设备巡展',
      status: 'Live',
      startDate: '2026-04-15',
      endDate: '2026-04-18',
      city: '深圳',
      tags: ['巡回展出', '精密仪器'],
      category: 'Exhibition',
      progress: 40,
      client: '大族激光',
      enterpriseId: 'ent_001',
      lastUpdate: {
        time: '1小时前',
        action: '深圳站展位搭建开始',
        photo: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&q=80'
      }
    },
  ],
  addCalendarEvent: (event) => set((state) => ({ calendarEvents: [...state.calendarEvents, event] })),
  deleteCalendarEvent: (id) => set((state) => ({ calendarEvents: state.calendarEvents.filter(e => e.id !== id) })),
  updateCalendarEvent: (event) => set((state) => ({ 
    calendarEvents: state.calendarEvents.map(e => e.id === event.id ? event : e) 
  })),
  addProject: (project) => set((state) => ({ projects: [...state.projects, project] })),
  updateProject: (project) => set((state) => ({ 
    projects: state.projects.map(p => p.id === project.id ? project : p) 
  })),
  deleteProject: (id) => set((state) => ({ projects: state.projects.filter(p => p.id !== id) })),
  activeTab: 'intelligence',
  setActiveTab: (tab) => set({ activeTab: tab }),
  selectedProjectId: null,
  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
}));
