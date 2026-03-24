
export enum Language {
  ZH = 'zh',
  EN = 'en',
  DE = 'de'
}

export enum UserRole {
  SYSTEM_ADMIN = 'system_admin',
  ENT_HEAD = 'ent_head',
  ENT_STAFF = 'ent_staff'
}

export interface Enterprise {
  id: string;
  name: string;
  logo: string;
  description: string;
}

export const mockEnterprises: Enterprise[] = [
  { id: 'ent-a', name: '企业 A (Enterprise A)', logo: '🏢', description: '智能制造与工业互联网领军者' },
  { id: 'ent-b', name: '企业 B (Enterprise B)', logo: '🚀', description: '商业航天与高新材料研发中心' },
  { id: 'ent-c', name: '企业 C (Enterprise C)', logo: '🌱', description: '绿色能源与可持续发展实验室' },
  { id: 'ent-d', name: '企业 D (Enterprise D)', logo: '🧬', description: '生物医药与生命科学创新基地' },
];

export const CALENDAR_COLORS = [
  { id: 'blue', value: '#0071E3', label: '战略蓝' },
  { id: 'green', value: '#34c759', label: '政策绿' },
  { id: 'red', value: '#ff3b30', label: '紧急红' },
  { id: 'orange', value: '#ff9500', label: '展会/外部' },
  { id: 'purple', value: '#af52de', label: '高层会议' },
  { id: 'cyan', value: '#5ac8fa', label: '培训/考察' },
  { id: 'indigo', value: '#5856d6', label: '技术研发' },
  { id: 'pink', value: '#ff2d55', label: '行政/内部' },
  { id: 'gray', value: '#8e8e93', label: '归档/参考' },
  { id: 'amber', value: '#ffcc00', label: '待定/预警' },
];

export interface NavItem {
  id: string;
  roles: UserRole[];
  section: 'workspace' | 'management';
}

export const navItems: NavItem[] = [
  { id: 'intelligence', roles: [UserRole.SYSTEM_ADMIN, UserRole.ENT_HEAD, UserRole.ENT_STAFF], section: 'workspace' },
  { id: 'kanban', roles: [UserRole.SYSTEM_ADMIN, UserRole.ENT_HEAD, UserRole.ENT_STAFF], section: 'workspace' },
  { id: 'assets', roles: [UserRole.SYSTEM_ADMIN, UserRole.ENT_HEAD, UserRole.ENT_STAFF], section: 'workspace' },
  { id: 'partners', roles: [UserRole.SYSTEM_ADMIN, UserRole.ENT_HEAD, UserRole.ENT_STAFF], section: 'workspace' },
  { id: 'adminPanel', roles: [UserRole.SYSTEM_ADMIN], section: 'management' },
  { id: 'settings', roles: [UserRole.SYSTEM_ADMIN, UserRole.ENT_HEAD], section: 'management' },
];

export interface I18nData {
  label: string;
  login: string;
  welcomeBack: string;
  subtitle: string;
  emailLabel: string;
  passwordLabel: string;
  rememberMe: string;
  forgotPassword: string;
  submit: string;
  loader: string;
  partnerConnect: {
    title: string;
    sections: {
      pool: string;
      strategic: string;
      cases: string;
      form: string;
    };
    marketplace: string;
    details: string;
    copilot: string;
    searchPlaceholder: string;
    riskRadar: string;
    smartBrief: string;
    aiInsight: string;
    activeOrders: string;
    rfqButton: string;
    modal: {
      about: string;
      gallery: string;
      packages: string;
      eco: string;
      documents: string;
      contact: string;
      sendInquiry: string;
      select: string;
      strategicTag: string;
    };
    formSection: {
      title: string;
      subtitle: string;
      projectName: string;
      eventType: string;
      budget: string;
      startDate: string;
      location: string;
      desc: string;
      attachments: string;
      dragDrop: string;
      submit: string;
    };
  };
  projectKanban: {
    title: string;
    filters: {
      all: string;
      event: string;
      conference: string;
      exhibition: string;
      design: string;
      party: string;
      training: string;
      promotion: string;
      manage: string;
      done: string;
      addPlaceholder: string;
    };
    columns: {
      active: string;
      pipeline: string;
      archive: string;
    };
    status: {
      live: string;
      upcoming: string;
      completed: string;
    };
    card: {
      latestUpdate: string;
      addProject: string;
    };
  };
  digitalAssets: {
    title: string;
    stats: string;
    search: string;
    upload: string;
    newFolder: string;
    root: string;
    filters: {
      all: string;
      photos: string;
      videos: string;
      documents: string;
      manage: string;
      done: string;
      addPlaceholder: string;
    };
    empty: string;
  };
  overview: {
    title: string;
    subtitle: string;
    stats: {
      activeProjects: string;
      totalPartners: string;
      digitalAssets: string;
      systemHealth: string;
    };
  };
  intelligence: {
    title: string;
    commandCenter: {
      title: string;
      badge: string;
      alertTitle: string;
      alertDesc: string;
      riskLevel: string;
      opportunity: string;
      logicTitle: string;
      logicStages: string[];
      actionBtn: string;
      telemetry: {
        nodes: string;
        gates: string;
        threat: string;
      };
    };
    dailyBrief: {
      title: string;
      categories: {
        intl: string;
        tech: string;
        local: string;
        industry: string;
      };
    };
    smartCalendar: {
      title: string;
      addEvent: string;
      editEvent: string;
      deleteEvent: string;
      export: string;
      tMinus: string;
      fields: {
        title: string;
        owner: string;
        startDate: string;
        endDate: string;
        location: string;
        description: string;
        attachments: string;
        color: string;
      };
      placeholders: {
        title: string;
        owner: string;
        location: string;
        description: string;
        attachments: string;
      };
      showMore: string;
      showLess: string;
      nextMonth: string;
      today: string;
    };
  };
  settings: {
    title: string;
    tabs: {
      general: string;
      team: string;
      ai: string;
      notifications: string;
    };
    general: {
      orgName: string;
      timezone: string;
      language: string;
      save: string;
    };
    team: {
      invite: string;
      roleAdmin: string;
      roleEditor: string;
      statusActive: string;
    };
    ai: {
      keywordsTitle: string;
      keywordsDesc: string;
      creativityTitle: string;
      creativityDesc: string;
      sourcesTitle: string;
      autoReport: string;
    };
  };
  enterprise: {
    selectorTitle: string;
    selectorSubtitle: string;
    switch: string;
    current: string;
  };
  users: {
    title: string;
    invite: string;
    list: string;
    role: string;
    status: string;
    actions: string;
  };
  adminPanel: {
    title: string;
  };
  enterpriseManagement: {
    title: string;
    add: string;
    delete: string;
    name: string;
    logo: string;
    desc: string;
    confirmDelete: string;
    empty: string;
  };
}

export const translations: Record<Language, I18nData> = {
  [Language.ZH]: {
    label: "中文",
    login: "登录",
    welcomeBack: "欢迎回来",
    subtitle: "登录您的智能协会管理工作台",
    emailLabel: "工作邮箱",
    passwordLabel: "密码",
    rememberMe: "记住我",
    forgotPassword: "忘记密码?",
    submit: "安全登录",
    loader: "核心系统同步中...",
    partnerConnect: {
      title: "伙伴协同",
      sections: {
        pool: "准入伙伴",
        strategic: "战略级合作伙伴",
        cases: "行业案例",
        form: "项目需求表"
      },
      marketplace: "资源索引",
      details: "供应商全景",
      copilot: "采购驾驶舱",
      searchPlaceholder: "搜索资源、案例...",
      riskRadar: "风险评估雷达",
      smartBrief: "智能需求单",
      aiInsight: "AI 决策建议",
      activeOrders: "活跃订单",
      rfqButton: "生成 RFQ 需求书",
      modal: {
        about: "企业概况",
        gallery: "精彩案例",
        packages: "年度合作方案",
        eco: "可持续发展选项",
        documents: "资质文档",
        contact: "联系方式",
        sendInquiry: "发送询盘",
        select: "选择方案",
        strategicTag: "战略合作伙伴"
      },
      formSection: {
        title: "发起项目协作",
        subtitle: "填写核心需求，AI 将为您匹配最佳供应商并生成执行简报。",
        projectName: "项目名称",
        eventType: "活动类型",
        budget: "预算范围",
        startDate: "启动日期",
        location: "举办地点",
        desc: "需求描述与规格",
        attachments: "附件上传",
        dragDrop: "拖拽户型图或参考图到此处",
        submit: "提交需求"
      }
    },
    projectKanban: {
      title: "项目看板",
      filters: {
        all: "全部",
        event: "活动",
        conference: "会议",
        exhibition: "展会",
        design: "设计",
        party: "派对",
        training: "培训",
        promotion: "宣传",
        manage: "管理分类",
        done: "完成",
        addPlaceholder: "输入新分类..."
      },
      columns: {
        active: "执行中 (Active)",
        pipeline: "筹备中 (Pipeline)",
        archive: "已归档 (Archive)"
      },
      status: {
        live: "进行中",
        upcoming: "即将开始",
        completed: "已完成"
      },
      card: {
        latestUpdate: "现场实时动态",
        addProject: "新建项目"
      }
    },
    digitalAssets: {
      title: "数字资产库",
      stats: "1,240 个项目 • 4.2 GB",
      search: "搜索文件...",
      upload: "上传",
      newFolder: "新建文件夹",
      root: "资产库",
      filters: {
        all: "全部资产",
        photos: "图片库",
        videos: "视频流",
        documents: "文档归档",
        manage: "管理分类",
        done: "完成",
        addPlaceholder: "新分类名称..."
      },
      empty: "此文件夹为空"
    },
    overview: {
      title: '业务概览',
      subtitle: '实时业务动态与核心指标',
      stats: {
        activeProjects: '进行中项目',
        totalPartners: '合作伙伴',
        digitalAssets: '数字资产',
        systemHealth: '系统状态',
      },
    },
    intelligence: {
      title: "情报雷达",
      commandCenter: {
        title: "战略情报指挥中心",
        badge: "实时情报简报",
        alertTitle: "亚太半导体中心探测到市场波动",
        alertDesc: "AI分析显示，韩国科技行业的战略转向指标增加了14%。交叉引用表明，在下一财季内，供应链重新路由的可能性为82%。建议立即进行投资组合审计。",
        riskLevel: "风险等级",
        opportunity: "机会潜力",
        logicTitle: "AI 核心逻辑链路",
        logicStages: ["情报捕捉", "逻辑交叉", "策略生成"],
        actionBtn: "执行战略指令",
        telemetry: {
          nodes: "数据节点",
          gates: "逻辑门",
          threat: "威胁等级"
        }
      },
      dailyBrief: {
        title: "情报矩阵",
        categories: {
          intl: "国际视野",
          tech: "前沿科技",
          local: "本地政策",
          industry: "行业波动"
        }
      },
      smartCalendar: {
        title: "日历",
        addEvent: "添加战略节点",
        editEvent: "编辑战略节点",
        deleteEvent: "删除节点",
        export: "导出日程",
        tMinus: "倒计时",
        fields: {
          title: "战略标题",
          owner: "负责人",
          startDate: "开始日期",
          endDate: "结束日期",
          location: "地理位置",
          description: "内容简介",
          attachments: "关联文档",
          color: "标注颜色"
        },
        placeholders: {
          title: "输入战略节点标题...",
          owner: "指派负责人...",
          location: "输入物理地点或会议链接...",
          description: "输入详细背景说明...",
          attachments: "点击或拖拽上传关联文档"
        },
        showMore: "查看更多",
        showLess: "收起",
        nextMonth: "次月预演",
        today: "回到今日"
      }
    },
    settings: {
      title: "系统配置",
      tabs: {
        general: "通用设置",
        team: "团队权限",
        ai: "AI 偏好",
        notifications: "通知管理"
      },
      general: {
        orgName: "组织名称",
        timezone: "默认时区",
        language: "系统语言",
        save: "保存更改"
      },
      team: {
        invite: "邀请成员",
        roleAdmin: "管理员",
        roleEditor: "编辑",
        statusActive: "已激活"
      },
      ai: {
        keywordsTitle: "情报监控关键词",
        keywordsDesc: "定义 AI 在全球资讯流中抓取的重点领域，用逗号分隔。",
        creativityTitle: "生成模型创造力",
        creativityDesc: "调整 AI 生成简报和建议时的发散程度。",
        sourcesTitle: "数据来源偏好",
        autoReport: "每日自动生成早报"
      }
    },
    enterprise: {
      selectorTitle: "选择要管理的企业",
      selectorSubtitle: "作为系统管理员，您可以进入任何企业环境进行针对性管理。",
      switch: "切换企业",
      current: "当前企业"
    },
    users: {
      title: "人员管理",
      invite: "邀请新成员",
      list: "成员列表",
      role: "角色权限",
      status: "在线状态",
      actions: "操作"
    },
    adminPanel: {
      title: "系统管理",
    },
    enterpriseManagement: {
      title: "企业管理",
      add: "添加企业",
      delete: "删除企业",
      name: "企业名称",
      logo: "图标 (Emoji)",
      desc: "企业描述",
      confirmDelete: "确定要删除该企业吗？此操作不可恢复。",
      empty: "暂无企业信息"
    }
  },
  [Language.EN]: {
    label: "English",
    login: "LOGIN",
    welcomeBack: "Welcome Back",
    subtitle: "Log in to your Association Management Workbench",
    emailLabel: "Work Email",
    passwordLabel: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    submit: "Secure Login",
    loader: "SYSTEM SYNCING...",
    partnerConnect: {
      title: "Partner Connect",
      sections: {
        pool: "Accredited Partners",
        strategic: "Strategic Partners",
        cases: "Industry Cases",
        form: "Project Brief"
      },
      marketplace: "Resource Index",
      details: "Supplier 360",
      copilot: "Procurement Copilot",
      searchPlaceholder: "Search resources, cases...",
      riskRadar: "Risk Assessment Radar",
      smartBrief: "Smart Brief",
      aiInsight: "AI Insights",
      activeOrders: "Active Orders",
      rfqButton: "Generate RFQ",
      modal: {
        about: "About",
        gallery: "Gallery",
        packages: "Cooperation Packages",
        eco: "Eco-Friendly Options",
        documents: "Documents",
        contact: "Contact",
        sendInquiry: "Send Inquiry",
        select: "Select",
        strategicTag: "Strategic Partner"
      },
      formSection: {
        title: "Start Your Project",
        subtitle: "Fill out the details below to generate a smart brief for partners.",
        projectName: "Project Name",
        eventType: "Event Type",
        budget: "Budget Range",
        startDate: "Start Date",
        location: "Location",
        desc: "Description & Requirements",
        attachments: "Attachments",
        dragDrop: "Drag & drop floor plans or mood boards here",
        submit: "Submit Request"
      }
    },
    projectKanban: {
      title: "Project Kanban",
      filters: {
        all: "All",
        event: "Events",
        conference: "Conferences",
        exhibition: "Exhibitions",
        design: "Design",
        party: "Parties",
        training: "Training",
        promotion: "Promotion",
        manage: "Manage",
        done: "Done",
        addPlaceholder: "New category..."
      },
      columns: {
        active: "Active",
        pipeline: "Pipeline",
        archive: "Archive"
      },
      status: {
        live: "Live",
        upcoming: "Upcoming",
        completed: "Completed"
      },
      card: {
        latestUpdate: "Latest Update",
        addProject: "Add Project"
      }
    },
    digitalAssets: {
      title: "Digital Assets",
      stats: "1,240 items • 4.2 GB",
      search: "Search files...",
      upload: "Upload",
      newFolder: "New Folder",
      root: "Library",
      filters: {
        all: "All Assets",
        photos: "Photos",
        videos: "Videos",
        documents: "Documents",
        manage: "Manage",
        done: "Done",
        addPlaceholder: "New Category..."
      },
      empty: "This folder is empty"
    },
    overview: {
      title: 'Overview',
      subtitle: 'Real-time business dynamics and core metrics',
      stats: {
        activeProjects: 'Active Projects',
        totalPartners: 'Total Partners',
        digitalAssets: 'Digital Assets',
        systemHealth: 'System Health',
      },
    },
    intelligence: {
      title: "Intelligence Radar",
      commandCenter: {
        title: "Strategic Command Center",
        badge: "Real-time Intel Briefing",
        alertTitle: "Asia-Pacific Semiconductor Center detects market volatility",
        alertDesc: "AI analysis shows a 14% increase in strategic shift indicators in the South Korean tech industry. Cross-referencing suggests an 82% probability of supply chain rerouting in the next fiscal quarter. Immediate portfolio audit recommended.",
        riskLevel: "Risk Level",
        opportunity: "Opportunity",
        logicTitle: "AI Core Logic Chain",
        logicStages: ["Signal Capture", "Logic Cross", "Strategy Gen"],
        actionBtn: "Execute Strategic Instructions",
        telemetry: {
          nodes: "DATA_NODES",
          gates: "LOGIC_GATES",
          threat: "THREAT_LVL"
        }
      },
      dailyBrief: {
        title: "Intelligence Matrix",
        categories: {
          intl: "International",
          tech: "Technology",
          local: "Local Policy",
          industry: "Industry"
        }
      },
      smartCalendar: {
        title: "Calendar",
        addEvent: "Add Strategic Node",
        editEvent: "Edit Strategic Node",
        deleteEvent: "Delete Node",
        export: "Export Schedule",
        tMinus: "T-Minus",
        fields: {
          title: "Strategic Title",
          owner: "Owner",
          startDate: "Start Date",
          endDate: "End Date",
          location: "Location",
          description: "Description",
          attachments: "Attachments",
          color: "Label Color"
        },
        placeholders: {
          title: "Enter strategic node title...",
          owner: "Assign owner...",
          location: "Enter physical location or meeting link...",
          description: "Enter detailed background description...",
          attachments: "Click or drag to upload attachments"
        },
        showMore: "Show More",
        showLess: "Show Less",
        nextMonth: "Next Month Preview",
        today: "Today"
      }
    },
    settings: {
      title: "System Configuration",
      tabs: {
        general: "General",
        team: "Team & Roles",
        ai: "AI Preferences",
        notifications: "Notifications"
      },
      general: {
        orgName: "Organization Name",
        timezone: "Default Timezone",
        language: "System Language",
        save: "Save Changes"
      },
      team: {
        invite: "Invite Member",
        roleAdmin: "Admin",
        roleEditor: "Editor",
        statusActive: "Active"
      },
      ai: {
        keywordsTitle: "Monitoring Keywords",
        keywordsDesc: "Define key areas for AI to track in the global feed, separated by commas.",
        creativityTitle: "Model Creativity",
        creativityDesc: "Adjust how divergent the AI suggestions and reports should be.",
        sourcesTitle: "Data Sources",
        autoReport: "Auto-generate Daily Brief"
      }
    },
    enterprise: {
      selectorTitle: "Select Enterprise to Manage",
      selectorSubtitle: "As a system administrator, you can enter any enterprise environment for targeted management.",
      switch: "Switch Enterprise",
      current: "Current Enterprise"
    },
    users: {
      title: "User Management",
      invite: "Invite Member",
      list: "Member List",
      role: "Role & Permissions",
      status: "Status",
      actions: "Actions"
    },
    adminPanel: {
      title: "System Management",
    },
    enterpriseManagement: {
      title: "Enterprise Management",
      add: "Add Enterprise",
      delete: "Delete Enterprise",
      name: "Enterprise Name",
      logo: "Logo (Emoji)",
      desc: "Description",
      confirmDelete: "Are you sure you want to delete this enterprise? This action cannot be undone.",
      empty: "No enterprises found"
    }
  },
  [Language.DE]: {
    label: "Deutsch",
    login: "ANMELDEN",
    welcomeBack: "Willkommen zurück",
    subtitle: "Melden Sie sich an Ihrem Management-Workbench an",
    emailLabel: "Arbeits-E-Mail",
    passwordLabel: "Passwort",
    rememberMe: "Angemeldet bleiben",
    forgotPassword: "Passwort vergessen?",
    submit: "Sicherer Login",
    loader: "SYSTEM SYNCHRONISATION...",
    partnerConnect: {
      title: "Partner-Verbindung",
      sections: {
        pool: "Lieferantenpool",
        strategic: "Strategische Partner",
        cases: "Branchenfälle",
        form: "Projektformular"
      },
      marketplace: "Ressourcen-Index",
      details: "Lieferanten-Panorama",
      copilot: "Beschaffungs-Copilot",
      searchPlaceholder: "Suche Ressourcen...",
      riskRadar: "Risikobewertungsradar",
      smartBrief: "Smart Brief",
      aiInsight: "KI-Einblicke",
      activeOrders: "Aktive Aufträge",
      rfqButton: "RFQ generieren",
      modal: {
        about: "Über uns",
        gallery: "Galerie",
        packages: "Kooperationspakete",
        eco: "Umweltfreundliche Optionen",
        documents: "Dokumente",
        contact: "Kontakt",
        sendInquiry: "Anfrage senden",
        select: "Auswählen",
        strategicTag: "Strategischer Partner"
      },
      formSection: {
        title: "Projekt starten",
        subtitle: "Füllen Sie die Details aus, um ein Smart Brief zu erstellen.",
        projectName: "Projektname",
        eventType: "Veranstaltungstyp",
        budget: "Budgetrahmen",
        startDate: "Startdatum",
        location: "Ort",
        desc: "Beschreibung & Anforderungen",
        attachments: "Anhänge",
        dragDrop: "Grundrisse oder Moodboards hierher ziehen",
        submit: "Anfrage senden"
      }
    },
    projectKanban: {
      title: "Projekt Kanban",
      filters: {
        all: "Alle",
        event: "Veranstaltungen",
        conference: "Konferenzen",
        exhibition: "Messen",
        design: "Design",
        party: "Partys",
        training: "Schulungen",
        promotion: "Werbung",
        manage: "Verwalten",
        done: "Fertig",
        addPlaceholder: "Neue Kategorie..."
      },
      columns: {
        active: "Aktiv",
        pipeline: "Pipeline",
        archive: "Archiv"
      },
      status: {
        live: "Live",
        upcoming: "Kommend",
        completed: "Abgeschlossen"
      },
      card: {
        latestUpdate: "Letztes Update",
        addProject: "Projekt hinzufügen"
      }
    },
    digitalAssets: {
      title: "Digitale Vermögenswerte",
      stats: "1,240 Artikel • 4.2 GB",
      search: "Dateien suchen...",
      upload: "Hochladen",
      newFolder: "Neuer Ordner",
      root: "Bibliothek",
      filters: {
        all: "Alle Werte",
        photos: "Fotos",
        videos: "Videos",
        documents: "Dokumente",
        manage: "Verwalten",
        done: "Fertig",
        addPlaceholder: "Neue Kategorie..."
      },
      empty: "Dieser Ordner ist leer"
    },
    overview: {
      title: 'Übersicht',
      subtitle: 'Echtzeit-Business-Dynamik und Kernmetriken',
      stats: {
        activeProjects: 'Aktive Projekte',
        totalPartners: 'Partner insgesamt',
        digitalAssets: 'Digitale Assets',
        systemHealth: 'Systemstatus',
      },
    },
    intelligence: {
      title: "Intelligenz-Radar",
      commandCenter: {
        title: "Strategisches Kommandozentrum",
        badge: "Echtzeit-Intelligenz-Briefing",
        alertTitle: "Marktschwankungen im asiatisch-pazifischen Halbleiterzentrum entdeckt",
        alertDesc: "Die KI-Analyse zeigt einen Anstieg der strategischen Pivot-Indikatoren im koreanischen Tech-Sektor um 14 %. Querverweise deuten auf eine 82 %ige Wahrscheinlichkeit einer Lieferketten-Umleitung innerhalb des nächsten Quartals hin. Portfolio-Audit empfohlen.",
        riskLevel: "Risikostufe",
        opportunity: "Chance",
        logicTitle: "KI-Kernlogikkette",
        logicStages: ["Signalerfassung", "Logik-Kreuzung", "Strategie-Gen"],
        actionBtn: "Strategische Anweisungen ausführen",
        telemetry: {
          nodes: "DATENKNOTEN",
          gates: "LOGIKGATTER",
          threat: "BEDROHUNG"
        }
      },
      dailyBrief: {
        title: "Intelligenz-Matrix",
        categories: {
          intl: "International",
          tech: "Technologie",
          local: "Lokale Politik",
          industry: "Industrie"
        }
      },
      smartCalendar: {
        title: "Smart Kalender",
        addEvent: "Strategischen Knoten hinzufügen",
        editEvent: "Strategischen Knoten bearbeiten",
        deleteEvent: "Knoten löschen",
        export: "Zeitplan exportieren",
        tMinus: "T-Minus",
        fields: {
          title: "Strategischer Titel",
          owner: "Verantwortlicher",
          startDate: "Startdatum",
          endDate: "Enddatum",
          location: "Standort",
          description: "Beschreibung",
          attachments: "Anhänge",
          color: "Label-Farbe"
        },
        placeholders: {
          title: "Titel des strategischen Knotens eingeben...",
          owner: "Verantwortlichen zuweisen...",
          location: "Physischen Standort oder Meeting-Link eingeben...",
          description: "Detaillierte Hintergrundbeschreibung eingeben...",
          attachments: "Klicken oder ziehen, um Anhänge hochzuladen"
        },
        showMore: "Mehr anzeigen",
        showLess: "Weniger anzeigen",
        nextMonth: "Vorschau auf nächsten Monat",
        today: "Heute"
      }
    },
    settings: {
      title: "Systemkonfiguration",
      tabs: {
        general: "Allgemein",
        team: "Team & Rollen",
        ai: "KI-Präferenzen",
        notifications: "Benachrichtigungen"
      },
      general: {
        orgName: "Organisationsname",
        timezone: "Standardzeitzone",
        language: "Systemsprache",
        save: "Änderungen speichern"
      },
      team: {
        invite: "Mitglied einladen",
        roleAdmin: "Admin",
        roleEditor: "Redakteur",
        statusActive: "Aktiv"
      },
      ai: {
        keywordsTitle: "Überwachungs-Keywords",
        keywordsDesc: "Definieren Sie Schlüsselbereiche für die KI-Verfolgung, getrennt durch Kommas.",
        creativityTitle: "Modellkreativität",
        creativityDesc: "Passen Sie an, wie divergent die KI-Vorschläge sein sollen.",
        sourcesTitle: "Datenquellen",
        autoReport: "Tägliches Briefing automatisch erstellen"
      }
    },
    enterprise: {
      selectorTitle: "Unternehmen zur Verwaltung auswählen",
      selectorSubtitle: "Als Systemadministrator können Sie jede Unternehmensumgebung für eine gezielte Verwaltung betreten.",
      switch: "Unternehmen wechseln",
      current: "Aktuelles Unternehmen"
    },
    users: {
      title: "Benutzerverwaltung",
      invite: "Mitglied einladen",
      list: "Mitgliederliste",
      role: "Rollen & Berechtigungen",
      status: "Status",
      actions: "Aktionen"
    },
    adminPanel: {
      title: "Systemverwaltung",
    },
    enterpriseManagement: {
      title: "Unternehmensverwaltung",
      add: "Unternehmen hinzufügen",
      delete: "Unternehmen löschen",
      name: "Unternehmensname",
      logo: "Logo (Emoji)",
      desc: "Beschreibung",
      confirmDelete: "Sind Sie sicher, dass Sie dieses Unternehmen löschen möchten? Dieser Vorgang kann nicht rückgängig gemacht werden.",
      empty: "Keine Unternehmen gefunden"
    }
  }
};
