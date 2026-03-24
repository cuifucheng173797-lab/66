
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Star, ChevronRight, X, ArrowRight, Download, 
  Mail, Phone, FileText, Package, Leaf, ExternalLink,
  Layers, Search, Check, Send, Clock, Tag, Settings, Edit2, Trash2
} from 'lucide-react';
import { Language, translations, UserRole } from '../constants';
import { useAppStore } from '../store';

// --- Types ---

interface BasePartner {
  id: string;
  name: string;
  category: string;
  images: string[];
  location: string;
  email: string;
  phone: string;
  docs: { name: string; size: string }[];
  isStrategic?: boolean;
  dimensions: {
    overview: DimensionInfo;
    safeguard: DimensionInfo;
    substance: DimensionInfo;
    logic: DimensionInfo;
    quality: DimensionInfo;
    future: DimensionInfo;
  };
}

interface DimensionInfo {
  title: string;
  content: string;
  items: string[];
}

type Partner = BasePartner;

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  date: string;
  image: string;
  summary: string;
  location: string;
}

interface NewsItem {
  id: string;
  date: string;
  title: string;
  tag: string;
}

// --- Mock Data (Localized to Chinese) ---

const ACCREDITED_PARTNERS: Partner[] = [
  {
    id: 'hange',
    name: '上海瀚格广告有限公司',
    category: '展台设计与搭建',
    isStrategic: true,
    images: [
      'https://images.unsplash.com/photo-1540575861501-7ce0e1d51a39?w=800&q=80',
      'https://images.unsplash.com/photo-1531973576160-7125cd663d86?w=800&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80'
    ],
    location: '上海, 中国',
    email: 'info@hange-ad.com',
    phone: '+86 21 6666 8888',
    docs: [
      { name: '安全生产许可证.pdf', size: '1.2 MB' },
      { name: 'ISO 9001 质量认证.pdf', size: '2.5 MB' },
      { name: '企业信用等级证书.pdf', size: '0.8 MB' }
    ],
    dimensions: {
      overview: {
        title: '企业概况 (Overview)',
        content: '上海瀚格广告有限公司成立于2010年，是一家专注于全球展览展示、公关活动、商业空间设计的专业服务商。公司总部位于上海，在柏林、拉斯维加斯设有分支机构。',
        items: ['15年行业经验', '全球服务网络', '500+ 成功案例']
      },
      safeguard: {
        title: '安全 (Safeguard)',
        content: '拥有国家二级建筑装饰装修工程专业承包资质。所有现场施工人员均足额缴纳工伤保险与意外险。具备完善的突发事件应急预案，连续10年无重大安全事故记录。',
        items: ['安全生产许可证', '全员意外险覆盖', '现场安全员委派']
      },
      substance: {
        title: '材质 (Substance)',
        content: '严格执行 E0 级环保标准，优先使用可循环利用的铝型材与蜂窝板。所有木质基材均具备阻燃检测报告（B1级）。支持大豆基环保油墨印刷。',
        items: ['E0级环保板材', 'B1级阻燃认证', '可循环铝型材']
      },
      logic: {
        title: '流程 (Logic)',
        content: '采用标准化的“五步执行法”：需求分析 -> 方案深化 -> 工厂预制 -> 现场搭建 -> 撤场回收。每个环节均有数字化节点追踪，确保项目准时交付。',
        items: ['标准化SOP', '数字化进度追踪', '24小时响应机制']
      },
      quality: {
        title: '标准 (Quality)',
        content: '通过 ISO 9001 质量管理体系认证。建立“三级验收制度”，确保搭建精度误差控制在 ±2mm 以内。历史项目客户满意度保持在 98% 以上。',
        items: ['ISO 9001认证', '精密测量验收', '高满意度交付']
      },
      future: {
        title: '资产 (Future)',
        content: '建立有超过 5000 个 3D 展位模型资产库。拥有多项模块化展架实用新型专利。致力于推动展览行业的数字化转型与 AR 增强现实观展体验。',
        items: ['3D模型资产库', '模块化专利技术', 'AR互动开发能力']
      }
    }
  },
  { 
    id: 's1', 
    name: '极光视听科技 (Aurora AV)', 
    category: '视听设备', 
    images: [
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80'
    ],
    location: '柏林, 德国',
    email: 'contact@aurora-av.com',
    phone: '+49 30 123456',
    docs: [{ name: '2025 设备清单.pdf', size: '2.4 MB' }],
    dimensions: {
      overview: {
        title: '企业概况 (Overview)',
        content: '极光视听科技是全球领先的视听集成解决方案提供商，专注于高端会议、大型演艺及沉浸式空间的视听系统设计与租赁。',
        items: ['全球顶级设备库', '专业技术团队', '24/7 技术支持']
      },
      safeguard: { title: '安全 (Safeguard)', content: '符合欧盟视听设备安全标准，所有线缆均经过阻燃处理。', items: ['CE认证', '防触电保护'] },
      substance: { title: '材质 (Substance)', content: '使用低功耗 LED 芯片，减少碳足迹。', items: ['低能耗认证'] },
      logic: { title: '流程 (Logic)', content: '现场技术联调流程，确保零故障运行。', items: ['技术预演SOP'] },
      quality: { title: '标准 (Quality)', content: '4K 超高清显示标准，专业级调音。', items: ['4K显示标准'] },
      future: { title: '资产 (Future)', content: '支持全息投影与 8K 视频流处理。', items: ['全息技术库'] }
    }
  }
];

const SUPPLIER_CATEGORIES = ['All', '展台设计与搭建', '视听设备', '展品物流', '人员外包', '技术支持'];

const CASES: CaseStudy[] = [
  {
    id: 'c1',
    title: 'CES 2025: 沉浸式 AI 体验馆',
    client: 'TechGiant 集团',
    date: '2025年1月',
    location: '拉斯维加斯',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
    summary: '500平米超大展台，配备透明OLED屏幕与实时AI交互舱，展示未来科技愿景。'
  },
  {
    id: 'c2',
    title: '上海车展: 零碳概念展台',
    client: '易动汽车',
    date: '2025年4月',
    location: '上海',
    image: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&q=80',
    summary: '全展台采用回收海洋塑料与可再生铝材搭建，树立汽车行业可持续发展新标准。'
  },
  {
    id: 'c3',
    title: 'IFA 柏林: 智能家居生态',
    client: '智联家居',
    date: '2024年9月',
    location: '柏林',
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800&q=80',
    summary: '构建模拟真实生活场景的多房间漫游体验，展示全联通智能家居生态系统。'
  }
];

const NEWS_LIST: NewsItem[] = [
  { id: 'n1', date: '今日 10:30', title: '2025 广州国际照明展览会定档发布', tag: '展讯' },
  { id: 'n2', date: '昨日 16:20', title: '绿色会展新国标正式实施，强调材料回收率', tag: '政策' },
  { id: 'n3', date: '10月24日', title: '商务部：前三季度境内专业场馆展览收入增长12%', tag: '数据' },
  { id: 'n4', date: '10月22日', title: 'CES 2025 创新奖名单出炉，中国企业占比创新高', tag: '奖项' },
  { id: 'n5', date: '10月20日', title: '虚拟展厅技术白皮书 v2.0 发布', tag: '技术' },
  { id: 'n6', date: '10月18日', title: '深圳国际会展中心引入 AI 智能导航系统', tag: '场馆' },
  { id: 'n7', date: '10月15日', title: '大型音乐节安保规范新细则解读', tag: '合规' },
  { id: 'n8', date: '10月12日', title: '全球展览业协会(UFI)发布最新行业晴雨表', tag: '国际' },
  { id: 'n9', date: '10月10日', title: '数字人民币在文旅场景应用试点扩大', tag: '金融' },
  { id: 'n10', date: '10月08日', title: '2024年中国会展经济国际合作论坛回顾', tag: '会议' },
];

// --- Sub-Components ---

const DetailModal: React.FC<{ 
  item: Partner; 
  onClose: () => void;
  isAdmin: boolean;
  onSave: (updatedItem: Partner) => void;
  initialEditMode?: boolean;
}> = ({ item, onClose, isAdmin, onSave, initialEditMode = false }) => {
  const { language } = useAppStore();
  const t = translations[language].partnerConnect.modal;
  const isZh = language === Language.ZH;

  const dimensionKeys = ['overview', 'safeguard', 'substance', 'logic', 'quality', 'future'] as const;

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>(dimensionKeys[0]);
  
  // Edit Mode States
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [editedItem, setEditedItem] = useState<Partner>(item);
  
  // Assets State
  const [partnerAssets, setPartnerAssets] = useState<any[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      const res = await fetch(`/api/assets?partnerId=${item.id}`);
      if (res.ok) {
        const data = await res.json();
        setPartnerAssets(data);
      }
    } catch (error) {
      console.error("Failed to fetch partner assets:", error);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, [item.id]);

  const handleUploadClick = (category: string) => {
    setUploadingCategory(category);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && uploadingCategory) {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append('files', file);
      });
      
      formData.append('partnerId', item.id);
      formData.append('docCategory', uploadingCategory);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          await fetchAssets();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
      
      if (fileInputRef.current) fileInputRef.current.value = '';
      setUploadingCategory(null);
    }
  };

  const deleteFile = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm(isZh ? "确定要删除此文件吗？" : "Are you sure you want to delete this file?")) {
      try {
        const res = await fetch(`/api/assets/${fileId}`, { method: 'DELETE' });
        if (res.ok) {
          setPartnerAssets(partnerAssets.filter(f => f.id !== fileId));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const downloadFile = (e: React.MouseEvent, url: string, title: string) => {
    e.stopPropagation();
    if (url) {
      window.open(url, '_blank');
    } else {
      alert(isZh ? `无法下载: ${title}` : `Cannot download: ${title}`);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    const container = scrollContainerRef.current;
    if (element && container) {
      const offsetTop = element.offsetTop;
      container.scrollTo({
        top: offsetTop - 20, // Small offset for breathing room
        behavior: 'smooth'
      });
      setActiveSection(id.replace('section-', ''));
    }
  };

  const handleSave = () => {
    onSave(editedItem);
    setIsEditMode(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 lg:p-10">
      <input 
        type="file" 
        ref={fileInputRef} 
        className="hidden" 
        multiple 
        onChange={handleFileChange} 
      />
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-full max-h-[90vh] bg-[#161617] rounded-[32px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col border border-[#2c2c2e]">
        {/* Header Image Area */}
        <div className="h-48 md:h-64 relative shrink-0">
          <img src={editedItem.images[0]} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#161617] via-transparent to-transparent" />
          
          <div className="absolute top-6 right-6 flex items-center gap-3">
            {isAdmin && (
              isEditMode ? (
                <button onClick={handleSave} className="px-4 py-2 bg-[#2997ff] rounded-full flex items-center justify-center text-white hover:bg-[#007aff] transition-colors text-sm font-bold shadow-lg">
                  <Check size={16} className="mr-1" /> {isZh ? '保存' : 'Save'}
                </button>
              ) : (
                <button onClick={() => setIsEditMode(true)} className="px-4 py-2 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors text-sm font-bold border border-white/10">
                  <Edit2 size={14} className="mr-1.5" /> {isZh ? '编辑' : 'Edit'}
                </button>
              )
            )}
            <button onClick={onClose} className="w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/60 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="absolute bottom-6 left-8 md:left-12 w-3/4">
            {editedItem.isStrategic && (
              <span className="inline-block px-3 py-1 bg-[#2997ff]/20 text-[#2997ff] border border-[#2997ff]/30 rounded-full text-[10px] font-bold uppercase tracking-widest mb-3">
                {isZh ? '战略伙伴' : 'Strategic'}
              </span>
            )}
            
            {isEditMode ? (
              <input 
                type="text" 
                value={editedItem.name} 
                onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
                className="text-3xl md:text-4xl font-bold text-white mb-2 bg-black/50 border border-[#2c2c2e] rounded-lg px-3 py-1 w-full outline-none focus:border-[#2997ff]"
              />
            ) : (
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{editedItem.name}</h2>
            )}
            
            <div className="flex items-center gap-4 text-gray-400 text-sm mt-2">
               {isEditMode ? (
                 <input 
                   type="text" 
                   value={editedItem.location} 
                   onChange={(e) => setEditedItem({...editedItem, location: e.target.value})}
                   className="bg-black/50 border border-[#2c2c2e] rounded px-2 py-1 text-sm outline-none focus:border-[#2997ff]"
                 />
               ) : (
                 <span className="flex items-center gap-1.5"><MapPinIcon size={14} /> {editedItem.location}</span>
               )}
               <span className="w-1 h-1 bg-gray-500 rounded-full" />
               {isEditMode ? (
                 <input 
                   type="text" 
                   value={editedItem.category} 
                   onChange={(e) => setEditedItem({...editedItem, category: e.target.value})}
                   className="bg-black/50 border border-[#2c2c2e] rounded px-2 py-1 text-sm outline-none focus:border-[#2997ff]"
                 />
               ) : (
                 <span>{editedItem.category}</span>
               )}
            </div>
          </div>
        </div>

        {/* Horizontal Navigation */}
        <div className="bg-[#1d1d1f] border-b border-[#2c2c2e] px-8 md:px-12 flex items-center gap-8 overflow-x-auto no-scrollbar shrink-0">
          {dimensionKeys.map((key) => (
            <button 
              key={key}
              onClick={() => scrollToSection(`section-${key}`)}
              className="py-4 text-sm font-medium text-[#86868b] hover:text-white transition-colors whitespace-nowrap border-b-2 border-transparent hover:border-[#2997ff]"
            >
              {editedItem.dimensions[key].title}
            </button>
          ))}
        </div>

        {/* Scrollable Content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar p-8 md:p-12 space-y-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Dimensions */}
            <div className="lg:col-span-2 space-y-20">
              {dimensionKeys.map((key) => (
                <section key={key} id={`section-${key}`} className="scroll-mt-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-[10px] font-mono text-[#2997ff] border border-[#2997ff]/30 px-2 py-0.5 rounded uppercase tracking-widest">
                      {key}
                    </div>
                    <div className="h-px flex-1 bg-[#2c2c2e]" />
                  </div>
                  
                  {isEditMode ? (
                    <input 
                      type="text" 
                      value={editedItem.dimensions[key].title} 
                      onChange={(e) => setEditedItem({
                        ...editedItem, 
                        dimensions: {
                          ...editedItem.dimensions, 
                          [key]: { ...editedItem.dimensions[key], title: e.target.value }
                        }
                      })}
                      className="text-2xl font-bold text-white mb-6 bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-3 py-2 w-full outline-none focus:border-[#2997ff]"
                    />
                  ) : (
                    <h3 className="text-2xl font-bold text-white mb-6">{editedItem.dimensions[key].title}</h3>
                  )}
                  
                  {isEditMode ? (
                    <textarea 
                      rows={4}
                      value={editedItem.dimensions[key].content} 
                      onChange={(e) => setEditedItem({
                        ...editedItem, 
                        dimensions: {
                          ...editedItem.dimensions, 
                          [key]: { ...editedItem.dimensions[key], content: e.target.value }
                        }
                      })}
                      className="text-[#86868b] text-lg leading-relaxed mb-8 bg-[#1d1d1f] border border-[#2c2c2e] rounded-lg px-4 py-3 w-full outline-none focus:border-[#2997ff] resize-none"
                    />
                  ) : (
                    <p className="text-[#86868b] text-lg leading-relaxed mb-8">{editedItem.dimensions[key].content}</p>
                  )}
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {editedItem.dimensions[key].items.map((point, idx) => {
                      const itemAssets = partnerAssets.filter(a => a.doc_category === point);
                      return (
                      <div key={idx} className="bg-[#1d1d1f] border border-[#2c2c2e] p-4 rounded-xl flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                          <CheckCircle size={16} className="text-[#2997ff] shrink-0" />
                          {isEditMode ? (
                            <input 
                              type="text" 
                              value={point} 
                              onChange={(e) => {
                                const newItems = [...editedItem.dimensions[key].items];
                                newItems[idx] = e.target.value;
                                setEditedItem({
                                  ...editedItem, 
                                  dimensions: {
                                    ...editedItem.dimensions, 
                                    [key]: { ...editedItem.dimensions[key], items: newItems }
                                  }
                                });
                              }}
                              className="bg-transparent border-b border-[#2c2c2e] text-sm text-gray-300 w-full outline-none focus:border-[#2997ff]"
                            />
                          ) : (
                            <span className="text-sm text-gray-300 font-bold">{point}</span>
                          )}
                        </div>
                        
                        {/* Assets List */}
                        <div className="flex flex-col gap-2 mt-2 pl-7">
                          {itemAssets.map(asset => (
                            <div key={asset.id} className="flex items-center justify-between bg-[#2c2c2e]/50 rounded-lg p-2 group">
                              <div 
                                className="flex items-center gap-2 overflow-hidden cursor-pointer hover:text-[#2997ff] transition-colors"
                                onClick={(e) => downloadFile(e, asset.url, asset.name)}
                              >
                                <FileText size={14} className="text-[#86868b] shrink-0" />
                                <span className="text-xs text-gray-300 truncate">{asset.name}</span>
                              </div>
                              {isAdmin && (
                                <button 
                                  onClick={(e) => deleteFile(e, asset.id)}
                                  className="text-[#86868b] hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all shrink-0"
                                >
                                  <Trash2 size={14} />
                                </button>
                              )}
                            </div>
                          ))}
                          
                          {isAdmin && (
                            <button 
                              onClick={() => handleUploadClick(point)}
                              className="flex items-center gap-2 text-xs text-[#2997ff] hover:text-blue-400 transition-colors mt-1"
                            >
                              <Plus size={12} /> {isZh ? '上传资料' : 'Upload Document'}
                            </button>
                          )}
                        </div>
                      </div>
                    )})}
                  </div>
                </section>
              ))}

              {/* Gallery */}
              <section>
                <div className="flex items-center gap-4 mb-6">
                  <div className="text-[10px] font-mono text-[#2997ff] border border-[#2997ff]/30 px-2 py-0.5 rounded uppercase tracking-widest">
                    Gallery
                  </div>
                  <div className="h-px flex-1 bg-[#2c2c2e]" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-6">{isZh ? '实景相册' : 'Gallery'}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {editedItem.images.map((img, idx) => (
                    <div key={idx} className="aspect-video rounded-xl overflow-hidden bg-[#1d1d1f] border border-[#2c2c2e] relative group">
                      <img src={img} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                      {isEditMode && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 bg-red-500 text-white rounded-full"><Trash2 size={14} /></button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Right Column: Docs & Contact */}
            <div className="space-y-6">
               <div className="bg-[#1d1d1f] rounded-2xl p-6 border border-[#2c2c2e] sticky top-0">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">{isZh ? '准入文档' : 'Documents'}</h3>
                  <div className="space-y-3 mb-8">
                    {editedItem.docs.map((doc, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-[#2c2c2e]/50 rounded-xl hover:bg-[#2c2c2e] transition-colors group cursor-pointer">
                         <div className="flex items-center gap-3 min-w-0">
                           <FileText size={18} className="text-[#2997ff]" />
                           <div className="min-w-0">
                             <div className="text-sm text-gray-200 truncate">{doc.name}</div>
                             <div className="text-xs text-gray-500">{doc.size}</div>
                           </div>
                         </div>
                         {isEditMode ? (
                           <Trash2 size={16} className="text-red-500 hover:text-red-400 transition-colors" />
                         ) : (
                           <Download size={16} className="text-gray-500 group-hover:text-white transition-colors" />
                         )}
                      </div>
                    ))}
                  </div>

                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">{isZh ? '联系方式' : 'Contact'}</h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-gray-300 shrink-0">
                           <Mail size={14} />
                        </div>
                        {isEditMode ? (
                          <input 
                            type="text" 
                            value={editedItem.email} 
                            onChange={(e) => setEditedItem({...editedItem, email: e.target.value})}
                            className="bg-[#161617] border border-[#2c2c2e] rounded px-2 py-1 text-sm text-white w-full outline-none focus:border-[#2997ff]"
                          />
                        ) : (
                          <div className="text-sm text-white select-all">{editedItem.email}</div>
                        )}
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center text-gray-300 shrink-0">
                           <Phone size={14} />
                        </div>
                        {isEditMode ? (
                          <input 
                            type="text" 
                            value={editedItem.phone} 
                            onChange={(e) => setEditedItem({...editedItem, phone: e.target.value})}
                            className="bg-[#161617] border border-[#2c2c2e] rounded px-2 py-1 text-sm text-white w-full outline-none focus:border-[#2997ff]"
                          />
                        ) : (
                          <div className="text-sm text-white">{editedItem.phone}</div>
                        )}
                     </div>
                  </div>
                  {!isEditMode && (
                    <button className="w-full mt-8 py-4 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20">
                      {isZh ? '发送准入询盘' : 'Send Inquiry'}
                    </button>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectRequirementForm: React.FC = () => {
  const { language } = useAppStore();
  const t = translations[language].partnerConnect.formSection;
  
  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-3">{t.title}</h2>
        <p className="text-[#86868b]">{t.subtitle}</p>
      </div>

      <form className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">{t.projectName}</label>
             <input type="text" placeholder="" className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">{t.eventType}</label>
             <select className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors appearance-none">
               <option>展览搭建 (Exhibition)</option>
               <option>企业活动 (Corporate Event)</option>
               <option>快闪店 (Pop-up Store)</option>
               <option>大型会议 (Conference)</option>
             </select>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">{t.budget}</label>
             <select className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors appearance-none">
               <option>¥50k - ¥200k</option>
               <option>¥200k - ¥500k</option>
               <option>¥500k - ¥2000k</option>
               <option>¥2000k+</option>
             </select>
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">{t.startDate}</label>
             <input type="date" className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors" />
           </div>
           <div className="space-y-2">
             <label className="text-sm font-medium text-gray-300">{t.location}</label>
             <input type="text" placeholder="" className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors" />
           </div>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium text-gray-300">{t.desc}</label>
           <textarea rows={6} placeholder="" className="w-full bg-[#1d1d1f] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors resize-none"></textarea>
        </div>

        <div className="space-y-2">
           <label className="text-sm font-medium text-gray-300">{t.attachments}</label>
           <div className="border-2 border-dashed border-[#2c2c2e] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#1d1d1f] transition-colors group">
              <UploadIcon className="text-[#86868b] group-hover:text-white mb-3 transition-colors" size={24} />
              <p className="text-sm text-[#86868b]">{t.dragDrop}</p>
           </div>
        </div>

        <div className="pt-4 flex justify-end">
           <button type="button" className="px-8 py-4 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
             <Send size={18} /> {t.submit}
           </button>
        </div>
      </form>
    </div>
  );
};

// --- Main Component ---

const PartnerConnect: React.FC = () => {
  const { language, user } = useAppStore();
  const t = translations[language].partnerConnect.sections;
  const [activeTab, setActiveTab] = useState<'accredited' | 'cases' | 'form'>('accredited');
  const [selectedItem, setSelectedItem] = useState<Partner | null>(null);
  const [supplierCategory, setSupplierCategory] = useState('All');
  const [isManageMode, setIsManageMode] = useState(false);
  const [isAddingPartner, setIsAddingPartner] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [newPartner, setNewPartner] = useState({
    name: '',
    category: 'All',
    location: '',
    email: '',
    phone: '',
    isStrategic: false
  });
  
  // Dynamic Categories State
  const [categories, setCategories] = useState<string[]>([]);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Suppliers State
  const [suppliers, setSuppliers] = useState<Partner[]>([]);

  const isSystemAdmin = user?.role === UserRole.SYSTEM_ADMIN;
  const isEntHead = user?.role === UserRole.ENT_HEAD;
  const canManage = isSystemAdmin || isEntHead;

  useEffect(() => {
    // Fetch categories and partners on mount
    const fetchData = async () => {
      try {
        const [catRes, partRes] = await Promise.all([
          fetch('/api/categories?type=partner'),
          fetch('/api/partners')
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.map((c: any) => c.name));
        }
        
        if (partRes.ok) {
          const partData = await partRes.json();
          setSuppliers(partData.length > 0 ? partData : ACCREDITED_PARTNERS);
        } else {
          setSuppliers(ACCREDITED_PARTNERS);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setSuppliers(ACCREDITED_PARTNERS);
      }
    };
    
    fetchData();
  }, []);

  const TABS = [
    { id: 'accredited', label: t.pool },
    { id: 'cases', label: t.cases },
    { id: 'form', label: t.form },
  ] as const;

  const filteredSuppliers = supplierCategory === 'All' 
    ? suppliers 
    : suppliers.filter(s => s.category === supplierCategory);

  const handleAddCategory = async () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName.trim())) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName.trim(), type: 'partner' })
        });
        if (res.ok) {
          setCategories([...categories, newCategoryName.trim()]);
          setNewCategoryName('');
          setIsAddingCategory(false);
        }
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const handleDeleteCategory = async (catToDelete: string) => {
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(catToDelete)}?type=partner`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setCategories(categories.filter(c => c !== catToDelete));
        if (supplierCategory === catToDelete) setSupplierCategory('All');
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const isZh = language === Language.ZH;

  const handleAddPartner = async () => {
    if (!newPartner.name) return;
    
    const partnerToAdd: Partner = {
      ...newPartner,
      id: Math.random().toString(36).substr(2, 9),
      category: newPartner.category === 'All' ? (categories[0] || 'Other') : newPartner.category,
      images: ['https://picsum.photos/seed/newpartner/800/600'],
      docs: [],
      dimensions: {
        overview: { title: isZh ? '公司概况' : 'Overview', content: '', items: [] },
        safeguard: { title: isZh ? '安全保障' : 'Safeguard', content: '', items: [] },
        substance: { title: isZh ? '材质标准' : 'Substance', content: '', items: [] },
        logic: { title: isZh ? '执行流程' : 'Logic', content: '', items: [] },
        quality: { title: isZh ? '质量标准' : 'Quality', content: '', items: [] },
        future: { title: isZh ? '未来资产' : 'Future', content: '', items: [] }
      }
    } as Partner;

    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(partnerToAdd)
      });
      
      if (res.ok) {
        setSuppliers([...suppliers, partnerToAdd]);
        setIsAddingPartner(false);
        setNewPartner({
          name: '',
          location: '',
          category: 'All',
          email: '',
          phone: '',
          isStrategic: false
        });
      }
    } catch (error) {
      console.error("Failed to add partner:", error);
      // Fallback for demo
      setSuppliers([...suppliers, partnerToAdd]);
      setIsAddingPartner(false);
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm(isZh ? '确定要删除该伙伴吗？' : 'Are you sure you want to delete this partner?')) return;
    
    try {
      const res = await fetch(`/api/partners/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSuppliers(suppliers.filter(s => s.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete partner:", error);
      // Fallback for demo
      setSuppliers(suppliers.filter(s => s.id !== id));
    }
  };

  const handleSaveSupplier = async (updatedSupplier: Partner) => {
    try {
      const res = await fetch(`/api/partners/${updatedSupplier.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSupplier)
      });
      if (res.ok) {
        setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
        if (selectedItem?.id === updatedSupplier.id) setSelectedItem(updatedSupplier);
      }
    } catch (error) {
      console.error("Failed to save supplier:", error);
      // Fallback for demo
      setSuppliers(suppliers.map(s => s.id === updatedSupplier.id ? updatedSupplier : s));
      if (selectedItem?.id === updatedSupplier.id) setSelectedItem(updatedSupplier);
    }
  };

  return (
    <div className="h-full flex flex-col bg-black relative">
      {/* Admin Manage Mode Toggle */}
      {canManage && (
        <div className="absolute top-4 right-10 flex items-center gap-3 z-50">
          <button 
            onClick={() => setIsManageMode(!isManageMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${
              isManageMode 
              ? 'bg-[#2997ff] text-white border-[#2997ff] shadow-lg shadow-blue-500/20' 
              : 'bg-[#1d1d1f] text-[#86868b] border-[#2c2c2e] hover:text-white'
            }`}
          >
            <Settings size={14} className={isManageMode ? 'animate-spin-slow' : ''} />
            <span className="text-xs font-bold">
              {language === Language.ZH ? (isManageMode ? '退出管理' : '管理模式') : (isManageMode ? 'Exit Manage' : 'Manage Mode')}
            </span>
          </button>
        </div>
      )}

      {/* Header & Tabs */}
      <div className="pt-8 px-6 md:px-10 shrink-0 space-y-6">
         <div className="flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-bold text-white tracking-tight">{translations[language].partnerConnect.title}</h2>
              <p className="text-[#86868b] text-sm mt-1">{translations[language].partnerConnect.marketplace}</p>
           </div>
           
           {/* Search */}
           <div className="hidden md:flex items-center bg-[#161617] rounded-full px-4 py-2 border border-[#2c2c2e] w-64 focus-within:border-[#2997ff] transition-colors">
              <Search size={14} className="text-[#86868b]" />
              <input type="text" placeholder={translations[language].partnerConnect.searchPlaceholder} className="bg-transparent border-none outline-none text-sm text-white ml-2 w-full placeholder:text-[#86868b]" />
           </div>
         </div>

         {/* Segmented Control */}
         <div className="inline-flex bg-[#161617] p-1 rounded-xl border border-[#2c2c2e]">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id 
                  ? 'bg-[#2c2c2e] text-white shadow-sm' 
                  : 'text-[#86868b] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="h-px w-full bg-[#1d1d1f]" />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10">
        
        {/* 1. Accredited Partners */}
        {activeTab === 'accredited' && (
          <div className="animate-in fade-in duration-500">
             {/* Category Filter Bar */}
             <div className="flex items-center justify-between mb-6">
                <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 items-center">
                  <button 
                    onClick={() => setSupplierCategory('All')}
                    className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                      supplierCategory === 'All'
                      ? 'bg-[#f5f5f7] text-black border-transparent shadow' 
                      : 'bg-[#161617] text-[#86868b] border-[#2c2c2e] hover:text-white hover:border-[#86868b]'
                    }`}
                  >
                    All
                  </button>
                  {categories.map(cat => (
                    <div key={cat} className="relative group shrink-0">
                      <button 
                        onClick={() => setSupplierCategory(cat)}
                        className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all border ${
                          supplierCategory === cat
                          ? 'bg-[#2c2c2e] text-white border-[#2c2c2e] shadow-md' 
                          : 'bg-[#161617] text-[#86868b] border-[#2c2c2e] hover:text-white hover:border-[#86868b]'
                        }`}
                      >
                        {cat}
                      </button>
                      {isManageMode && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat); }}
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm z-10"
                        >
                          <X size={10} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Add Input - Only in Manage Mode */}
                  {isManageMode && (
                    isAddingCategory ? (
                      <div className="flex items-center bg-[#1d1d1f] rounded-full px-2 border border-[#2997ff] shrink-0 animate-in fade-in zoom-in duration-200">
                         <input 
                           autoFocus
                           type="text" 
                           value={newCategoryName}
                           onChange={(e) => setNewCategoryName(e.target.value)}
                           onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                           placeholder={language === Language.ZH ? '新分类' : 'New Category'}
                           className="bg-transparent border-none outline-none text-xs text-white px-2 py-1.5 w-24 placeholder:text-[#86868b]"
                         />
                         <button onClick={handleAddCategory} className="w-5 h-5 rounded-full bg-[#2997ff] flex items-center justify-center text-white hover:bg-[#007aff]">
                           <Check size={10} />
                         </button>
                         <button onClick={() => setIsAddingCategory(false)} className="ml-1 w-5 h-5 flex items-center justify-center text-[#86868b] hover:text-white">
                           <X size={10} />
                         </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAddingCategory(true)}
                        className="shrink-0 w-7 h-7 rounded-full border border-dashed border-[#86868b] flex items-center justify-center text-[#86868b] hover:text-white hover:border-white transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    )
                  )}
                </div>
                
                {isManageMode && (
                  <button 
                    onClick={() => setIsAddingPartner(true)}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#2997ff] text-white rounded-full text-xs font-bold hover:bg-[#007aff] transition-colors shadow-lg shadow-blue-500/20"
                  >
                    <Plus size={14} /> {language === Language.ZH ? '添加伙伴' : 'Add Partner'}
                  </button>
                )}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSuppliers.map(s => (
                  <div 
                    key={s.id} 
                    onClick={() => setSelectedItem(s)} 
                    className={`group relative bg-[#161617] rounded-3xl overflow-hidden cursor-pointer hover:bg-[#1d1d1f] transition-all border ${
                      s.isStrategic ? 'border-[#2997ff]/30 shadow-[0_0_20px_-10px_rgba(41,151,255,0.2)]' : 'border-transparent hover:border-[#2c2c2e]'
                    }`}
                  >
                     {s.isStrategic && (
                       <div className="absolute top-4 left-4 z-10">
                         <span className="flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md text-[#2997ff] border border-[#2997ff]/30 rounded-full text-[9px] font-bold uppercase tracking-wider">
                           <Star size={10} fill="currentColor" /> Strategic
                         </span>
                       </div>
                     )}

                     {isManageMode && (
                       <div className="absolute top-4 right-4 z-10 flex gap-2">
                         <button 
                           onClick={(e) => { e.stopPropagation(); setSelectedItem(s); setIsEditMode(true); }}
                           className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#2997ff] transition-colors"
                         >
                           <Edit2 size={14} />
                         </button>
                         <button 
                           onClick={(e) => { e.stopPropagation(); handleDeletePartner(s.id); }}
                           className="w-8 h-8 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-red-500 transition-colors"
                         >
                           <Trash2 size={14} />
                         </button>
                       </div>
                     )}

                     <div className="aspect-[4/3] relative overflow-hidden">
                        <img src={s.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                     </div>
                     <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-xs text-[#2997ff] font-bold uppercase tracking-wider">{s.category}</div>
                          <div className="flex items-center gap-1 text-[10px] text-gray-500">
                            <MapPinIcon size={10} /> {s.location.split(',')[0]}
                          </div>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#2997ff] transition-colors">{s.name}</h3>
                        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                           <div className="flex items-center gap-2">
                             <FileText size={14} /> {s.docs.length} {language === Language.ZH ? '份文档' : 'Docs'}
                           </div>
                           <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                     </div>
                  </div>
                ))}
                {filteredSuppliers.length === 0 && (
                   <div className="col-span-full py-20 text-center text-[#86868b]">
                      {language === Language.ZH ? '未找到该分类下的供应商' : 'No suppliers found in this category'}
                   </div>
                )}
             </div>
          </div>
        )}

        {/* 3. Industry Cases & News */}
        {activeTab === 'cases' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
             
             {/* Left Column: Feature Cases (2/3) */}
             <div className="lg:col-span-2 space-y-6">
               <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                 <Star size={18} className="text-[#2997ff]" /> 深度案例
               </h3>
               {CASES.map(c => (
                 <div key={c.id} className="flex flex-col md:flex-row bg-[#161617] rounded-3xl overflow-hidden hover:bg-[#1d1d1f] transition-all group cursor-pointer border border-transparent hover:border-[#2c2c2e]">
                    <div className="w-full md:w-64 h-48 md:h-auto shrink-0 relative overflow-hidden">
                       <img src={c.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <div className="p-6 md:p-8 flex flex-col justify-center">
                       <div className="flex items-center gap-3 text-xs text-[#86868b] mb-3">
                          <span className="font-semibold text-[#2997ff] uppercase">{c.client}</span>
                          <span>•</span>
                          <span>{c.date}</span>
                          <span>•</span>
                          <span>{c.location}</span>
                       </div>
                       <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:underline decoration-[#2997ff] underline-offset-4 decoration-2">{c.title}</h3>
                       <p className="text-[#86868b] text-sm leading-relaxed">{c.summary}</p>
                       <div className="mt-4 flex items-center gap-2 text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-10px] group-hover:translate-x-0 duration-300">
                          阅读完整案例 <ArrowRight size={12} />
                       </div>
                    </div>
                 </div>
               ))}
             </div>

             {/* Right Column: Industry Briefs (1/3) */}
             <div className="lg:col-span-1">
                <div className="bg-[#161617] rounded-3xl p-6 border border-[#1d1d1f] sticky top-0">
                   <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Layers size={18} className="text-[#2997ff]" /> 行业快讯
                      </h3>
                      <button className="text-xs text-[#86868b] hover:text-white transition-colors">查看更多</button>
                   </div>
                   
                   <div className="space-y-0 relative">
                      {/* Timeline Line */}
                      <div className="absolute left-[5px] top-2 bottom-2 w-px bg-[#2c2c2e]" />
                      
                      {NEWS_LIST.map((news, idx) => (
                        <div key={news.id} className="group relative pl-6 py-3 first:pt-0 last:pb-0 hover:bg-[#1d1d1f] rounded-lg -ml-2 pl-8 transition-colors cursor-pointer">
                           {/* Timeline Dot */}
                           <div className="absolute left-[2px] top-[18px] w-[7px] h-[7px] rounded-full bg-[#2c2c2e] group-hover:bg-[#2997ff] border-2 border-[#161617] transition-colors z-10" />
                           
                           <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] text-[#86868b] font-mono">{news.date}</span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#2c2c2e] text-[#86868b] group-hover:text-white">{news.tag}</span>
                           </div>
                           <h4 className="text-xs font-medium text-gray-300 group-hover:text-white leading-relaxed line-clamp-2">
                             {news.title}
                           </h4>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

          </div>
        )}

        {/* 4. Project Form */}
        {activeTab === 'form' && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
             <ProjectRequirementForm />
          </div>
        )}

      </div>

      {/* Add Partner Modal */}
      {isAddingPartner && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsAddingPartner(false)} />
          <div className="relative w-full max-w-2xl bg-[#1c1c1e] rounded-[32px] border border-white/10 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-white">{isZh ? '添加新合作伙伴' : 'Add New Partner'}</h3>
                <button onClick={() => setIsAddingPartner(false)} className="text-[#86868b] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '名称' : 'Name'}</label>
                  <input 
                    type="text" 
                    value={newPartner.name}
                    onChange={(e) => setNewPartner({...newPartner, name: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] outline-none transition-all"
                    placeholder={isZh ? '输入伙伴名称...' : 'Enter partner name...'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '分类' : 'Category'}</label>
                  <select 
                    value={newPartner.category}
                    onChange={(e) => setNewPartner({...newPartner, category: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] outline-none transition-all appearance-none"
                  >
                    <option value="All">{isZh ? '选择分类' : 'Select Category'}</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '所在地' : 'Location'}</label>
                  <input 
                    type="text" 
                    value={newPartner.location}
                    onChange={(e) => setNewPartner({...newPartner, location: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] outline-none transition-all"
                    placeholder={isZh ? '例如：上海, 中国' : 'e.g. Shanghai, China'}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '战略伙伴' : 'Strategic'}</label>
                  <div className="flex items-center h-full">
                    <button 
                      onClick={() => setNewPartner({...newPartner, isStrategic: !newPartner.isStrategic})}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        newPartner.isStrategic 
                        ? 'bg-[#2997ff]/10 text-[#2997ff] border-[#2997ff]/30' 
                        : 'bg-black/40 text-[#86868b] border-[#2c2c2e]'
                      }`}
                    >
                      {newPartner.isStrategic ? (isZh ? '是' : 'Yes') : (isZh ? '否' : 'No')}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '邮箱' : 'Email'}</label>
                  <input 
                    type="email" 
                    value={newPartner.email}
                    onChange={(e) => setNewPartner({...newPartner, email: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#86868b] uppercase tracking-widest">{isZh ? '电话' : 'Phone'}</label>
                  <input 
                    type="text" 
                    value={newPartner.phone}
                    onChange={(e) => setNewPartner({...newPartner, phone: e.target.value})}
                    className="w-full bg-black/40 border border-[#2c2c2e] rounded-xl px-4 py-3 text-sm text-white focus:border-[#2997ff] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-10">
                <button 
                  onClick={() => setIsAddingPartner(false)}
                  className="flex-1 py-4 bg-[#1d1d1f] text-white text-sm font-bold rounded-2xl hover:bg-[#2c2c2e] transition-colors"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={handleAddPartner}
                  disabled={!newPartner.name}
                  className={`flex-1 py-4 text-white text-sm font-bold rounded-2xl transition-all ${
                    newPartner.name ? 'bg-[#2997ff] hover:bg-[#007aff] shadow-lg shadow-blue-500/20' : 'bg-[#1d1d1f] text-[#86868b] cursor-not-allowed'
                  }`}
                >
                  {isZh ? '创建伙伴' : 'Create Partner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedItem && (
        <DetailModal 
          item={selectedItem as Partner} 
          onClose={() => {
            setSelectedItem(null);
            setIsEditMode(false);
          }} 
          isAdmin={canManage && isManageMode}
          onSave={handleSaveSupplier}
          initialEditMode={isEditMode}
        />
      )}
    </div>
  );
};

// Helper Icon Components
const MapPinIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
);
const UploadIcon = ({ size, className }: { size: number; className?: string }) => (
   <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);
const Plus = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
);
const CheckCircle = ({ size, className }: { size: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);

export default PartnerConnect;
