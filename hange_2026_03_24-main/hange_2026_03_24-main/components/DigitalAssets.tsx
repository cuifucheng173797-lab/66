
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, Plus, MoreHorizontal, Folder, 
  ChevronRight, ArrowLeft, Settings, X, 
  CheckCircle, File, Film, Image as ImageIcon,
  Home, Lock, Unlock, Download, Trash2, Eye
} from 'lucide-react';
import { Language, translations, UserRole } from '../constants';
import { useAppStore } from '../store';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type AssetType = 'Image' | 'Video' | 'Document';

interface FileAsset {
  id: string;
  type: AssetType;
  title: string;
  url?: string;
  size?: string;
  date?: string;
  parentId: string | null;
  categoryTag?: string;
  enterpriseId: string;
}

interface FolderAsset {
  id: string;
  name: string;
  parentId: string | null;
  itemCount: number;
  categoryTag?: string;
  enterpriseId: string;
}

interface FilterCategory {
  key: string;
}

// --- Mock Data ---

const INITIAL_FOLDERS: FolderAsset[] = [
  // Enterprise A (ent-a)
  { id: 'f1', name: '2026 展会现场图库', parentId: null, itemCount: 24, categoryTag: 'Photos', enterpriseId: 'ent-a' },
  { id: 'f4', name: 'Q1 市场活动', parentId: 'f1', itemCount: 8, enterpriseId: 'ent-a' },
  
  // Enterprise B (ent-b)
  { id: 'f2', name: '工程施工蓝图', parentId: null, itemCount: 12, categoryTag: 'Documents', enterpriseId: 'ent-b' },
  { id: 'f5', name: '合同与协议', parentId: 'f2', itemCount: 6, enterpriseId: 'ent-b' },
  
  // Enterprise C (ent-c)
  { id: 'f3', name: '品牌宣传片', parentId: null, itemCount: 15, categoryTag: 'Videos', enterpriseId: 'ent-c' },
];

const INITIAL_FILES: FileAsset[] = [
  // Enterprise A (ent-a)
  { id: 'file-1', type: 'Image', title: '自行车展-主展台全景', url: 'https://images.unsplash.com/photo-1513828583688-c52646db42da?w=800&q=80', parentId: 'f1', categoryTag: 'Photos', enterpriseId: 'ent-a', size: '4.2 MB', date: '2026-03-15' },
  { id: 'file-1-2', type: 'Image', title: '现场施工-桁架吊装', url: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&q=80', parentId: 'f1', categoryTag: 'Photos', enterpriseId: 'ent-a', size: '3.8 MB', date: '2026-03-18' },
  { id: 'file-2', type: 'Document', title: '中转文件-物流清单', url: 'https://picsum.photos/seed/doc1/600/800', parentId: null, categoryTag: 'Documents', enterpriseId: 'ent-a', size: '1.2 MB', date: '2026-03-20' },
  
  // Enterprise B (ent-b)
  { id: 'file-3', type: 'Document', title: '蓝图-A1区结构图', url: 'https://picsum.photos/seed/blueprint/600/800', parentId: 'f2', categoryTag: 'Documents', enterpriseId: 'ent-b', size: '15.4 MB', date: '2026-03-10' },
  { id: 'file-3-2', type: 'Document', title: '2026 采购意向书', url: 'https://picsum.photos/seed/contract/600/800', parentId: 'f5', categoryTag: 'Documents', enterpriseId: 'ent-b', size: '2.1 MB', date: '2026-03-12' },
  
  // Enterprise C (ent-c)
  { id: 'file-4', type: 'Video', title: '品牌形象片-2026版', url: 'https://picsum.photos/seed/video1/600/600', parentId: 'f3', categoryTag: 'Videos', enterpriseId: 'ent-c', size: '124.5 MB', date: '2026-03-05' },
];

const DigitalAssets: React.FC<{ tenantId: string | null; isSuperAdminView?: boolean }> = ({ tenantId, isSuperAdminView }) => {
  const { language, user, activeEnterprise } = useAppStore();
  const t = translations[language].digitalAssets;
  const isZh = language === Language.ZH;

  // --- State ---
  const [categories, setCategories] = useState<FilterCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isManaging, setIsManaging] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [navStack, setNavStack] = useState<FolderAsset[]>([]); 
  const [folders, setFolders] = useState<FolderAsset[]>(INITIAL_FOLDERS);
  const [files, setFiles] = useState<FileAsset[]>(INITIAL_FILES);
  const [previewFile, setPreviewFile] = useState<FileAsset | null>(null);
  
  // New Folder Modal State
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // File Upload Ref
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories?type=asset');
        if (res.ok) {
          const data = await res.json();
          setCategories(data.map((c: any) => ({ key: c.name })));
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // --- Derived State ---
  const currentFolderId = navStack.length > 0 ? navStack[navStack.length - 1].id : null;
  const currentFolder = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  // Permission Check: Everyone can edit now
  const isEditable = true;

  const getCategoryLabel = (cat: FilterCategory) => {
    const translationKey = cat.key.toLowerCase() as keyof typeof t.filters;
    return t.filters[translationKey] || cat.key;
  };

  // --- Actions ---

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: newCategoryName.trim(), type: 'asset' })
        });
        if (res.ok) {
          setCategories([...categories, { key: newCategoryName.trim() }]);
          setNewCategoryName('');
          setIsAddingCategory(false);
        }
      } catch (error) {
        console.error("Failed to add category:", error);
      }
    }
  };

  const handleDeleteCategory = async (idx: number) => {
    const catToDelete = categories[idx];
    try {
      const res = await fetch(`/api/categories/${encodeURIComponent(catToDelete.key)}?type=asset`, {
        method: 'DELETE'
      });
      if (res.ok) {
        const newCats = [...categories];
        newCats.splice(idx, 1);
        setCategories(newCats);
        if (activeCategory === catToDelete.key) setActiveCategory('All');
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  const enterFolder = (folder: FolderAsset) => {
    setNavStack([...navStack, folder]);
  };

  const navigateToBreadcrumb = (index: number) => {
    if (index === -1) {
      setNavStack([]);
    } else {
      setNavStack(navStack.slice(0, index + 1));
    }
  };

  const fetchFoldersAndAssets = async () => {
    try {
      const parentIdQuery = currentFolderId ? `?parentId=${currentFolderId}` : '';
      const folderIdQuery = currentFolderId ? `?folderId=${currentFolderId}` : '';
      
      const [foldersRes, assetsRes] = await Promise.all([
        fetch(`/api/folders${parentIdQuery}`),
        fetch(`/api/assets${folderIdQuery}`)
      ]);

      if (foldersRes.ok) {
        const data = await foldersRes.json();
        const mappedFolders = data.map((f: any) => ({
          id: f.id,
          name: f.name,
          parentId: f.parent_id,
          categoryTag: f.category_tag,
          enterpriseId: f.enterprise_id,
          itemCount: f.itemCount
        }));
        setFolders(mappedFolders);
      }

      if (assetsRes.ok) {
        const data = await assetsRes.json();
        const mappedAssets = data.map((a: any) => ({
          id: a.id,
          type: a.type,
          title: a.name,
          url: a.url,
          size: a.size,
          date: a.created_at.split(' ')[0],
          parentId: a.folder_id,
          enterpriseId: a.enterprise_id
        }));
        setFiles(mappedAssets);
      }
    } catch (error) {
      console.error("Failed to fetch folders and assets:", error);
    }
  };

  useEffect(() => {
    fetchFoldersAndAssets();
  }, [currentFolderId, activeEnterprise?.id]);

  const createNewFolderInCurrentView = () => {
    setIsCreatingFolder(true);
    setNewFolderName(isZh ? '新建文件夹' : 'New Folder');
  };

  const confirmCreateFolder = async () => {
    if (newFolderName.trim()) {
      try {
        const res = await fetch('/api/folders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: newFolderName.trim(),
            parentId: currentFolderId,
            categoryTag: activeCategory === 'All' ? undefined : activeCategory,
            enterpriseId: activeEnterprise?.id || tenantId || '',
          })
        });
        
        if (res.ok) {
          await fetchFoldersAndAssets();
          setIsCreatingFolder(false);
        }
      } catch (error) {
        console.error("Failed to create folder:", error);
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const formData = new FormData();
      Array.from(e.target.files).forEach(file => {
        formData.append('files', file);
      });
      
      if (currentFolderId) formData.append('folderId', currentFolderId);
      const targetEnterpriseId = activeEnterprise?.id || tenantId;
      if (targetEnterpriseId) formData.append('enterpriseId', targetEnterpriseId);

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          await fetchFoldersAndAssets();
        }
      } catch (error) {
        console.error("Upload failed:", error);
      }
      
      // Reset input
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (e: React.MouseEvent, fileId: string) => {
    e.stopPropagation();
    if (confirm(isZh ? "确定要删除此文件吗？" : "Are you sure you want to delete this file?")) {
      try {
        const res = await fetch(`/api/assets/${fileId}`, { method: 'DELETE' });
        if (res.ok) {
          setFiles(files.filter(f => f.id !== fileId));
          if (previewFile?.id === fileId) setPreviewFile(null);
        }
      } catch (error) {
        console.error("Failed to delete file:", error);
      }
    }
  };

  const deleteFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    if (confirm(isZh ? "确定要删除此文件夹及其所有内容吗？" : "Are you sure you want to delete this folder and all its contents?")) {
      // In a real app, you'd call a DELETE /api/folders/:id endpoint here
      setFolders(folders.filter(f => f.id !== folderId));
    }
  };

  const downloadFile = (e: React.MouseEvent, file: FileAsset) => {
    e.stopPropagation();
    if (file.url) {
      window.open(file.url, '_blank');
    } else {
      alert(isZh ? `无法下载: ${file.title}` : `Cannot download: ${file.title}`);
    }
  };

  // --- Filtering Logic ---

  const currentViewItems = useMemo(() => {
    const targetEnterpriseId = activeEnterprise?.id || tenantId;
    
    // 1. Filter by Enterprise
    const tenantFolders = folders.filter(f => f.enterpriseId === targetEnterpriseId);
    const tenantFiles = files.filter(f => f.enterpriseId === targetEnterpriseId);

    // 2. Filter by Level (Parent ID)
    let relevantFolders = tenantFolders.filter(f => f.parentId === currentFolderId);
    let relevantFiles = tenantFiles.filter(f => f.parentId === currentFolderId);

    // 3. Filter by Category (Capsule Bar) - ONLY if at Root Level
    if (currentFolderId === null && activeCategory !== 'All') {
       relevantFolders = relevantFolders.filter(f => f.categoryTag === activeCategory);
       relevantFiles = relevantFiles.filter(f => f.categoryTag === activeCategory);
    }

    return { folders: relevantFolders, files: relevantFiles };
  }, [folders, files, currentFolderId, activeCategory, activeEnterprise, tenantId]);

  return (
    <div className="h-full flex flex-col bg-black relative">
      {isSuperAdminView && (
        <div className="absolute top-4 right-10 flex items-center gap-2 bg-amber-500/20 text-amber-500 px-3 py-1.5 rounded-lg border border-amber-500/30 text-xs font-bold z-50">
          <Settings size={14} />
          {language === Language.ZH ? '超级管理员修改模式' : 'Super Admin Edit Mode'}
        </div>
      )}
      
      {/* 1. Floating Capsule Filter Bar (Top) */}
      <div className="h-20 flex items-center px-6 md:px-10 border-b border-[#1d1d1f] shrink-0 gap-4">
        <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 pr-4">
          <button 
            onClick={() => { setActiveCategory('All'); setNavStack([]); }}
            className={`shrink-0 px-5 py-2 rounded-full text-xs font-semibold transition-all ${
              activeCategory === 'All'
              ? 'bg-[#f5f5f7] text-black shadow-lg shadow-white/10 scale-105' 
              : 'bg-[#161617] text-[#86868b] hover:text-white border border-[#2c2c2e]'
            }`}
          >
            {t.filters.all}
          </button>

          {categories.map((cat, idx) => (
            <div key={`${cat.key}-${idx}`} className="relative group shrink-0">
               <button 
                onClick={() => { setActiveCategory(cat.key); setNavStack([]); }}
                className={`px-5 py-2 rounded-full text-xs font-semibold transition-all border ${
                  activeCategory === cat.key
                  ? 'bg-[#2c2c2e] text-white border-[#2c2c2e] shadow-md' 
                  : 'bg-[#161617] text-[#86868b] border-[#2c2c2e] hover:text-white hover:border-[#86868b]'
                }`}
              >
                {getCategoryLabel(cat)}
              </button>
              
              {isManaging && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteCategory(idx); }}
                  className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform shadow-sm z-10"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              )}
            </div>
          ))}

          {/* Add Input - Everyone can add */}
          {isAddingCategory ? (
            <div className="flex items-center bg-[#1d1d1f] rounded-full px-2 border border-[#2997ff] shrink-0 animate-in fade-in zoom-in duration-200">
               <input 
                 autoFocus
                 type="text" 
                 value={newCategoryName}
                 onChange={(e) => setNewCategoryName(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                 placeholder={t.filters.addPlaceholder}
                 className="bg-transparent border-none outline-none text-xs text-white px-2 py-2 w-28 placeholder:text-[#86868b]"
               />
               <button onClick={handleAddCategory} className="w-6 h-6 rounded-full bg-[#2997ff] flex items-center justify-center text-white hover:bg-[#007aff]">
                 <CheckCircle size={12} />
               </button>
               <button onClick={() => setIsAddingCategory(false)} className="ml-1 w-6 h-6 flex items-center justify-center text-[#86868b] hover:text-white">
                 <X size={12} />
               </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAddingCategory(true)}
              className="shrink-0 w-8 h-8 rounded-full border border-dashed border-[#86868b] flex items-center justify-center text-[#86868b] hover:text-white hover:border-white transition-colors"
            >
              <Plus size={14} />
            </button>
          )}
        </div>

        {/* Tools - Everyone can manage */}
        <div className="flex items-center gap-2 pl-4 border-l border-[#1d1d1f]">
           <button 
             onClick={() => setIsManaging(!isManaging)}
             className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
               isManaging ? 'bg-[#2997ff]/20 text-[#2997ff]' : 'text-[#86868b] hover:text-white'
             }`}
           >
             <Settings size={14} />
             <span className="hidden md:inline">{isManaging ? t.filters.done : t.filters.manage}</span>
           </button>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col p-6 lg:p-10 overflow-hidden">
         
         {/* Breadcrumbs & Actions */}
         <div className="flex items-center justify-between mb-8 shrink-0">
            <div className="flex items-center gap-2 overflow-hidden">
               <button 
                  onClick={() => navigateToBreadcrumb(-1)}
                  className={`flex items-center gap-2 text-sm font-medium transition-colors ${navStack.length === 0 ? 'text-white' : 'text-[#86868b] hover:text-white'}`}
               >
                  <Home size={16} />
                  <span>{t.root}</span>
               </button>
               
               {navStack.map((folder, idx) => (
                  <React.Fragment key={folder.id}>
                    <ChevronRight size={14} className="text-[#2c2c2e] shrink-0" />
                    <button 
                       onClick={() => navigateToBreadcrumb(idx)}
                       className={`text-sm font-medium truncate max-w-[120px] transition-colors ${idx === navStack.length - 1 ? 'text-white' : 'text-[#86868b] hover:text-white'}`}
                    >
                       {folder.name}
                    </button>
                  </React.Fragment>
               ))}
            </div>

            <div className="flex items-center gap-3">
               {isEditable && (
                 <>
                   <button onClick={createNewFolderInCurrentView} className="flex items-center gap-2 px-4 py-2 bg-[#1d1d1f] hover:bg-[#2c2c2e] text-white rounded-xl text-xs font-medium transition-colors border border-[#2c2c2e]">
                      <Folder size={14} />
                      <span className="hidden sm:inline">{t.newFolder}</span>
                   </button>
                   <button onClick={handleUploadClick} className="flex items-center gap-2 px-4 py-2 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-xl text-xs font-medium transition-colors shadow-lg shadow-blue-500/20">
                      <Plus size={14} />
                      <span className="hidden sm:inline">{t.upload}</span>
                   </button>
                   <input 
                     type="file" 
                     multiple 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     className="hidden" 
                   />
                 </>
               )}
            </div>
         </div>

         {/* 3. Grid View */}
         <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
            {currentViewItems.folders.length === 0 && currentViewItems.files.length === 0 ? (
               <div className="h-64 flex flex-col items-center justify-center text-[#86868b]">
                  <div className="w-16 h-16 rounded-full bg-[#161617] flex items-center justify-center mb-4">
                     <Folder size={24} className="opacity-50" />
                  </div>
                  <p className="text-sm">{t.empty}</p>
               </div>
            ) : (
               <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                  
                  {/* Render Folders */}
                  {currentViewItems.folders.map(folder => {
                    return (
                      <div 
                         key={folder.id} 
                         onClick={() => enterFolder(folder)}
                         className="group relative aspect-square bg-[#161617] hover:bg-[#1d1d1f] border border-transparent hover:border-[#2c2c2e] rounded-[24px] cursor-pointer transition-all duration-300 active:scale-95 flex flex-col items-center justify-center gap-3"
                      >
                         <div className="w-16 h-14 rounded-xl flex items-center justify-center transition-colors bg-[#2997ff]/10 group-hover:bg-[#2997ff]/20">
                            <Folder size={32} className="text-[#2997ff] fill-[#2997ff]/20" />
                         </div>
                         
                         {/* Action Menu */}
                         <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => deleteFolder(e, folder.id)}
                              className="p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors"
                            >
                              <Trash2 size={12} />
                            </button>
                         </div>

                         <div className="text-center px-4">
                            <div className="text-sm font-medium truncate w-full text-[#f5f5f7]">
                              {folder.name}
                            </div>
                            <div className="text-[10px] text-[#86868b] mt-1">{folder.itemCount} items</div>
                         </div>
                      </div>
                    );
                  })}

                  {/* Render Files */}
                  {currentViewItems.files.map(asset => (
                     <div 
                        key={asset.id} 
                        onClick={() => setPreviewFile(asset)}
                        className="group relative aspect-square bg-[#161617] rounded-[24px] overflow-hidden cursor-pointer border border-[#161617] hover:border-[#2c2c2e]"
                     >
                        <img src={asset.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        
                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                           <div className="text-white text-sm font-medium truncate w-full mb-3">{asset.title}</div>
                           
                           <div className="flex items-center gap-2">
                              <button 
                                onClick={(e) => downloadFile(e, asset)}
                                className="flex-1 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-lg text-white text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                <Download size={12} /> {isZh ? '下载' : 'DL'}
                              </button>
                              <button 
                                onClick={(e) => deleteFile(e, asset.id)}
                                className="w-9 h-9 bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white backdrop-blur-md rounded-lg flex items-center justify-center transition-colors"
                              >
                                <Trash2 size={14} />
                              </button>
                           </div>
                        </div>
                        
                        {/* Type Badge */}
                        <div className="absolute top-3 right-3 px-2 py-0.5 bg-black/60 backdrop-blur rounded text-[10px] font-bold text-white uppercase flex items-center gap-1">
                           {asset.type === 'Video' && <Film size={10} />}
                           {asset.type === 'Image' && <ImageIcon size={10} />}
                           {asset.type === 'Document' && <File size={10} />}
                           <span>{asset.type === 'Image' ? 'IMG' : asset.type === 'Video' ? 'MOV' : asset.type === 'Document' ? 'DOC' : 'FILE'}</span>
                        </div>
                     </div>
                  ))}

                  {/* Quick Create Folder Action - Only if editable */}
                  {isEditable && (
                    <div onClick={createNewFolderInCurrentView} className="aspect-square rounded-[24px] border-2 border-dashed border-[#2c2c2e] flex flex-col items-center justify-center text-[#86868b] hover:border-[#86868b] hover:text-white transition-colors cursor-pointer active:scale-95">
                       <Folder size={24} className="mb-2" />
                       <span className="text-xs font-medium">{t.newFolder}</span>
                    </div>
                  )}

                  {/* Quick Upload Action - Only if editable */}
                  {isEditable && (
                    <div onClick={handleUploadClick} className="aspect-square rounded-[24px] border-2 border-dashed border-[#2c2c2e] flex flex-col items-center justify-center text-[#86868b] hover:border-[#86868b] hover:text-white transition-colors cursor-pointer active:scale-95">
                       <Plus size={24} className="mb-2" />
                       <span className="text-xs font-medium">{t.upload}</span>
                    </div>
                  )}
                </div>
            )}
         </div>

      </div>

      {/* 4. Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-10 bg-black/95 backdrop-blur-xl"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col bg-[#161617] rounded-[32px] overflow-hidden border border-[#2c2c2e] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#1d1d1f]">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#2997ff]/10 flex items-center justify-center text-[#2997ff]">
                    {previewFile.type === 'Image' ? <ImageIcon size={20} /> : previewFile.type === 'Video' ? <Film size={20} /> : <File size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">{previewFile.title}</h3>
                    <p className="text-xs text-[#86868b] mt-0.5">{previewFile.size} • {previewFile.date}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setPreviewFile(null)}
                  className="w-10 h-10 rounded-full bg-[#1d1d1f] flex items-center justify-center text-[#86868b] hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-hidden flex items-center justify-center p-10 bg-black/40">
                {previewFile.type === 'Image' ? (
                  <img src={previewFile.url} alt={previewFile.title} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
                ) : previewFile.type === 'Video' ? (
                  <div className="w-full max-w-3xl aspect-video bg-black rounded-2xl flex flex-col items-center justify-center border border-[#2c2c2e]">
                    <div className="w-20 h-20 rounded-full bg-[#2997ff] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                      <Film size={32} />
                    </div>
                    <span className="mt-6 text-sm text-[#86868b] font-medium">{isZh ? '视频预览暂不可用' : 'Video preview unavailable'}</span>
                  </div>
                ) : (
                  <div className="w-full max-w-md p-10 bg-[#1d1d1f] rounded-3xl border border-[#2c2c2e] flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-2xl bg-white/5 flex items-center justify-center text-[#2997ff] mb-6">
                      <File size={48} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">{previewFile.title}</h4>
                    <p className="text-sm text-[#86868b] mb-8 leading-relaxed">
                      {isZh ? '此文档格式需要下载后查看完整内容。' : 'This document format requires download to view full content.'}
                    </p>
                    <button 
                      onClick={(e) => downloadFile(e, previewFile)}
                      className="w-full py-4 bg-[#2997ff] hover:bg-[#007aff] text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
                    >
                      <Download size={20} /> {isZh ? '立即下载' : 'Download Now'}
                    </button>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 bg-[#1d1d1f]/50 border-t border-[#1d1d1f] flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => downloadFile(e, previewFile)}
                    className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors"
                  >
                    <Download size={18} /> {isZh ? '下载' : 'Download'}
                  </button>
                  <button className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-bold transition-colors">
                    <Settings size={18} /> {isZh ? '重命名' : 'Rename'}
                  </button>
                </div>
                <button 
                  onClick={(e) => deleteFile(e, previewFile.id)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl text-sm font-bold transition-colors"
                >
                  <Trash2 size={18} /> {isZh ? '删除文件' : 'Delete File'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 5. New Folder Modal */}
      <AnimatePresence>
        {isCreatingFolder && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsCreatingFolder(false)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#1d1d1f] rounded-2xl border border-[#2c2c2e] shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-lg font-bold text-white mb-4">{isZh ? '新建文件夹' : 'New Folder'}</h3>
                <input 
                  autoFocus
                  type="text" 
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmCreateFolder()}
                  placeholder={isZh ? '文件夹名称' : 'Folder Name'}
                  className="w-full bg-[#161617] border border-[#2c2c2e] rounded-xl px-4 py-3 text-white focus:border-[#2997ff] outline-none transition-colors"
                />
              </div>
              <div className="flex items-center border-t border-[#2c2c2e]">
                <button 
                  onClick={() => setIsCreatingFolder(false)}
                  className="flex-1 py-4 text-sm font-medium text-[#86868b] hover:text-white transition-colors border-r border-[#2c2c2e]"
                >
                  {isZh ? '取消' : 'Cancel'}
                </button>
                <button 
                  onClick={confirmCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="flex-1 py-4 text-sm font-bold text-[#2997ff] hover:text-blue-400 disabled:opacity-50 disabled:hover:text-[#2997ff] transition-colors"
                >
                  {isZh ? '创建' : 'Create'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DigitalAssets;
