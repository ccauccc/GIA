
import React, { useState, useMemo } from 'react';
import { MOCK_EXPERIENCES, MOCK_REPORTS } from '../constants';
import { UserRoleType } from '../types';
import { 
  Search, Plus, Filter, AlertCircle, CheckCircle2, Star, 
  Sparkles, X, BrainCircuit, Share2, Eye, ShieldCheck, 
  ChevronRight, Trash2, ArrowUpRight, MessageSquare, Loader2,
  Database, Lightbulb, Zap, HelpCircle, History, BookOpen,
  Bot, RefreshCcw, LayoutGrid, Timer, ArrowDownCircle, Network,
  TrendingUp, Award, Layers, Tag, Briefcase, ChevronDown
} from 'lucide-react';
import { refineExperienceInsight, smartSearchKnowledge, evolveLibraryFromReports } from '../services/geminiService';

interface ExperienceLibProps {
  role: UserRoleType;
}

interface ExperienceItem {
  id: string;
  type: '踩坑' | '最佳实践';
  description: string;
  reliability: number;
  trigger: string;
  solution: string;
  category: string;
  author?: string;
  date?: string;
  isVerified?: boolean;
  isAiGenerated?: boolean;
  mergeCount?: number;
}

const CATEGORIES = ['全部业务', '地图', '地址', '自动化生产', '位置大数据', '运营/管理'];

const ExperienceLib: React.FC<ExperienceLibProps> = ({ role }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('全部业务');
  const [activeType, setActiveType] = useState<'all' | '踩坑' | '最佳实践'>('all');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [experiences, setExperiences] = useState<ExperienceItem[]>(MOCK_EXPERIENCES as any);
  const [selectedItem, setSelectedItem] = useState<ExperienceItem | null>(null);
  
  // AI States
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isRefining, setIsRefining] = useState(false);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionStep, setEvolutionStep] = useState(0); 
  
  const [shareForm, setShareForm] = useState({
    type: '踩坑' as '踩坑' | '最佳实践',
    rawText: '',
    category: '地址'
  });

  const isManager = role === UserRoleType.TEAM_LEAD || role === UserRoleType.DEPT_HEAD || role === UserRoleType.SUPER_ADMIN;

  const filtered = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return experiences.filter(exp => {
      const matchesSearch = exp.description.toLowerCase().includes(term) || 
                            exp.solution.toLowerCase().includes(term);
      const matchesCat = activeCategory === '全部业务' || exp.category === activeCategory;
      const matchesType = activeType === 'all' || exp.type === activeType;
      return matchesSearch && matchesCat && matchesType;
    });
  }, [experiences, searchTerm, activeCategory, activeType]);

  const handleTriggerEvolution = async () => {
    setIsEvolving(true);
    setEvolutionStep(1);
    await new Promise(r => setTimeout(r, 1200));
    setEvolutionStep(2);
    try {
      const results = await evolveLibraryFromReports(MOCK_REPORTS, experiences);
      setEvolutionStep(3);
      await new Promise(r => setTimeout(r, 1000));
      
      let nextLib = [...experiences];
      results.forEach((res: any) => {
        if (res.action === 'CREATE') {
          nextLib.unshift({
            id: `evo-${Date.now()}-${Math.random()}`,
            type: res.type || '踩坑',
            description: res.title,
            reliability: 0.85,
            trigger: res.trigger,
            solution: res.solution,
            category: res.category || '地图',
            author: '组织机器人',
            date: new Date().toISOString().split('T')[0],
            isAiGenerated: true,
            mergeCount: 1
          });
        } else if (res.action === 'UPDATE') {
          nextLib = nextLib.map(item => 
            item.id === res.targetId 
              ? { ...item, reliability: Math.min(1, item.reliability + 0.05), mergeCount: (item.mergeCount || 1) + 1 } 
              : item
          );
        }
      });
      setExperiences(nextLib);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvolving(false);
      setEvolutionStep(0);
    }
  };

  const handleAiSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsAiSearching(true);
    try {
      const relevantIds = await smartSearchKnowledge(searchTerm, experiences);
      if (relevantIds.length > 0) {
        const sorted = [...experiences].sort((a, b) => {
          const aIndex = relevantIds.indexOf(a.id);
          const bIndex = relevantIds.indexOf(b.id);
          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;
          return aIndex - bIndex;
        });
        setExperiences(sorted);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiSearching(false);
    }
  };

  const handleShare = async () => {
    if (!shareForm.rawText.trim()) return;
    setIsRefining(true);
    try {
      const refined = await refineExperienceInsight(shareForm.rawText, shareForm.type);
      if (refined) {
        const newItem: ExperienceItem = {
          id: `e-${Date.now()}`,
          type: shareForm.type,
          description: refined.title || refined.description,
          reliability: 0.8,
          trigger: refined.trigger,
          solution: refined.solution,
          category: refined.category || '地图',
          author: role === UserRoleType.EMPLOYEE ? 'Alex' : 'Sarah',
          date: new Date().toISOString().split('T')[0],
          isVerified: false
        };
        setExperiences(prev => [newItem, ...prev]);
        setIsShareModalOpen(false);
        setShareForm({ type: '踩坑', rawText: '', category: '地址' });
      }
    } catch (e) {
      alert('AI 优化失败，请手动录入。');
    } finally {
      setIsRefining(false);
    }
  };

  /**
   * Fix: Added missing verifyItem function to handle experience verification status updates.
   */
  const verifyItem = (id: string) => {
    setExperiences(prev => prev.map(item => 
      item.id === id ? { ...item, isVerified: true } : item
    ));
    if (selectedItem?.id === id) {
      setSelectedItem(prev => prev ? { ...prev, isVerified: true } : null);
    }
  };

  return (
    <div className="flex gap-8 h-full animate-in fade-in duration-700 max-w-[1600px] mx-auto pb-10">
      
      {/* 1. 左侧业务分类导航栏 */}
      <aside className="w-64 flex-shrink-0 space-y-6 sticky top-0 h-fit">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
           <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
             <Layers size={14} /> 业务线导航
           </h3>
           <nav className="space-y-1">
             {CATEGORIES.map(cat => (
               <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-sm font-bold transition-all flex items-center justify-between group ${
                  activeCategory === cat 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                  : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'
                }`}
               >
                 <span className="truncate">{cat}</span>
                 {activeCategory === cat ? <ChevronRight size={14} /> : <span className="text-[10px] opacity-0 group-hover:opacity-100">{experiences.filter(e => e.category === cat).length || ''}</span>}
               </button>
             ))}
           </nav>
        </div>

        {/* 统计指标小卡片 */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4 overflow-hidden relative group">
           <div className="absolute -right-4 -bottom-4 opacity-5 text-white group-hover:rotate-12 transition-transform duration-700"><TrendingUp size={120}/></div>
           <div className="relative z-10">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">组织经验资产</p>
              <h4 className="text-2xl font-black">{experiences.length} <span className="text-xs font-bold text-slate-500">项</span></h4>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
                 <div className="text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">AI 提炼</p>
                    <p className="text-xs font-black">{experiences.filter(e => e.isAiGenerated).length}</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-tighter">专家认证</p>
                    <p className="text-xs font-black text-emerald-400">{experiences.filter(e => e.isVerified).length}</p>
                 </div>
              </div>
           </div>
        </div>
      </aside>

      {/* 2. 右侧主体内容区域 */}
      <main className="flex-1 space-y-6 overflow-y-auto pr-2 scrollbar-hide">
        
        {/* 精简后的顶部工具栏 */}
        <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 relative group w-full md:w-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="搜索业务教训：如 'Kafka'、'模型召回'..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-500/5 outline-none text-sm font-bold transition-all"
            />
          </div>

          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full md:w-auto">
             <button onClick={() => setActiveType('all')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}>全部</button>
             <button onClick={() => setActiveType('踩坑')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === '踩坑' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}>踩坑</button>
             <button onClick={() => setActiveType('最佳实践')} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${activeType === '最佳实践' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}>实践</button>
          </div>

          <div className="flex gap-2 w-full md:w-auto">
             <button 
              onClick={handleAiSearch}
              className="px-6 py-3 bg-white border border-indigo-100 text-indigo-600 rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 hover:bg-indigo-50 shadow-sm"
             >
               {isAiSearching ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />} AI 搜索
             </button>
             <button 
              onClick={() => setIsShareModalOpen(true)}
              className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase flex items-center gap-2 hover:bg-slate-800 shadow-lg shadow-slate-100"
             >
               <Share2 size={14} /> 分享见解
             </button>
          </div>
        </div>

        {/* AI 进化状态栏 - 精简模式 */}
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-[2rem] px-8 py-4 flex items-center justify-between group">
           <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isEvolving ? 'bg-indigo-600 animate-pulse' : 'bg-white shadow-sm'}`}>
                {isEvolving ? <Loader2 className="text-white animate-spin" size={20} /> : <Bot className="text-indigo-600" size={20} />}
              </div>
              <div>
                <p className="text-xs font-black text-indigo-900">
                  {isEvolving ? (evolutionStep === 1 ? '检索实时日报流...' : evolutionStep === 2 ? '语义特征提取中...' : '同步至组织库...') : 'AI 组织进化引擎'}
                </p>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-tighter">
                  {isEvolving ? 'Processing Knowledge Evolution' : '系统正在持续从业务日报中提炼通用经验'}
                </p>
              </div>
           </div>
           {!isEvolving && (
             <button 
              onClick={handleTriggerEvolution}
              className="px-5 py-2 bg-white text-indigo-600 border border-indigo-100 rounded-xl text-[10px] font-black uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
             >
               同步最新日报教训
             </button>
           )}
        </div>

        {/* 经验网格 - 调整为更紧凑的 2 列或 3 列 */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filtered.map((exp) => (
            <div 
              key={exp.id} 
              onClick={() => setSelectedItem(exp)}
              className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col h-full"
            >
              <div className={`absolute top-0 left-0 w-1.5 h-full ${exp.type === '踩坑' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
              
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                   <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase border ${exp.type === '踩坑' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                     {exp.type}
                   </span>
                   <span className="text-[9px] font-black text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 uppercase">{exp.category}</span>
                   {exp.isVerified && <span className="p-1 bg-indigo-50 text-indigo-600 rounded-md shadow-sm border border-indigo-100"><ShieldCheck size={12}/></span>}
                </div>
                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                   <Star size={12} className="text-amber-400 fill-amber-400" />
                   <span className="text-[10px] font-black text-slate-400">{(exp.reliability * 100).toFixed(0)}%</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-slate-800 mb-6 leading-relaxed group-hover:text-indigo-600 transition-colors line-clamp-2 min-h-[56px]">
                {exp.description}
              </h3>

              <div className="space-y-3 flex-1">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 flex items-center gap-1"><Zap size={10} className="text-amber-500" /> 背景</p>
                   <p className="text-[13px] font-medium text-slate-600 line-clamp-2 leading-relaxed italic">{exp.trigger}</p>
                </div>
                <div className="p-4 bg-indigo-50/30 rounded-2xl border border-indigo-100/30 group-hover:bg-indigo-50 transition-colors">
                   <p className="text-[9px] font-black text-indigo-500 uppercase tracking-widest mb-1 flex items-center gap-1"><Lightbulb size={10}/> 标准方案</p>
                   <p className="text-[13px] font-black text-indigo-900/80 line-clamp-2 leading-relaxed">{exp.solution}</p>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase">
                     {exp.author === '组织机器人' ? <Bot size={14} className="text-indigo-600"/> : exp.author?.[0]}
                   </div>
                   <p className="text-[10px] font-bold text-slate-500">{exp.author}</p>
                </div>
                {exp.mergeCount && exp.mergeCount > 1 && (
                  <div className="text-[9px] font-black text-amber-600 uppercase flex items-center gap-1">
                    <RefreshCcw size={10} /> 聚合 {exp.mergeCount} 篇
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
             <div className="col-span-full py-40 flex flex-col items-center justify-center text-slate-300 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                <HelpCircle size={64} className="mb-4 opacity-10" />
                <p className="text-sm font-black uppercase tracking-[0.2em]">未找到符合条件的经验</p>
             </div>
          )}
        </div>
      </main>

      {/* 详情弹窗 (保持原有的高级风格，但优化间距) */}
      {selectedItem && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedItem(null)} />
          <div className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
            <div className={`p-8 flex items-center justify-between text-white ${selectedItem.type === '踩坑' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
                   {selectedItem.type === '踩坑' ? <AlertCircle size={28}/> : <CheckCircle2 size={28}/>}
                </div>
                <div>
                   <h3 className="text-xl font-black tracking-tight">{selectedItem.type}案例轨迹</h3>
                   <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">归档: {selectedItem.date} | 业务: {selectedItem.category}</p>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X size={20}/></button>
            </div>

            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-thin">
               <div className="space-y-4">
                  <h2 className="text-3xl font-black text-slate-900 leading-tight">{selectedItem.description}</h2>
                  {selectedItem.mergeCount && selectedItem.mergeCount > 1 && (
                    <div className="p-6 bg-indigo-50 rounded-3xl border border-indigo-100 flex items-start gap-4">
                       <div className="p-2 bg-white rounded-xl text-indigo-600 shadow-sm"><BrainCircuit size={18}/></div>
                       <div>
                          <p className="text-xs font-bold text-indigo-900">语义聚合历史 (Semantic Aggregation)</p>
                          <p className="text-xs text-indigo-700 mt-1 leading-relaxed">系统已自动识别并合并了最近 7 天内的 {selectedItem.mergeCount} 篇相似教训，置信度 {(selectedItem.reliability * 100).toFixed(0)}%。</p>
                       </div>
                    </div>
                  )}
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} className="text-amber-500" /> 触发条件 (Context)</h4>
                    <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 shadow-inner min-h-[160px]">
                       <p className="text-sm font-medium text-slate-600 leading-loose italic whitespace-pre-wrap">{selectedItem.trigger}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Lightbulb size={14} className="text-indigo-600" /> 标准方案 (Protocol)</h4>
                    <div className="p-6 bg-indigo-50/30 rounded-[2rem] border border-indigo-100 shadow-xl shadow-indigo-50/20 min-h-[160px]">
                       <p className="text-sm font-black text-indigo-900 leading-loose whitespace-pre-wrap">{selectedItem.solution}</p>
                    </div>
                  </div>
               </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
               <button onClick={() => setSelectedItem(null)} className="px-8 py-3 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase rounded-2xl hover:bg-slate-50 transition-all">关闭</button>
               <div className="flex gap-3">
                  {isManager && !selectedItem.isVerified && (
                    <button 
                      onClick={() => verifyItem(selectedItem.id)}
                      className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 font-black text-xs uppercase rounded-2xl hover:bg-indigo-50"
                    >
                      官方认证
                    </button>
                  )}
                  <button 
                    onClick={() => alert('已成功分享至项目组！\n- 接收人：' + (selectedItem.category === '地图' ? '地图事业部全员' : '相关业务线成员') + '\n- 渠道：钉钉/邮件/系统通知\n- 状态：待确认学习')}
                    className="px-8 py-3 bg-slate-900 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Share2 size={16}/> 分享项目组
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 分享见解弹窗 (保持原样) */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsShareModalOpen(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
             <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><Share2 size={24}/></div>
                  <div>
                     <h3 className="text-xl font-black tracking-tight">沉淀实战见解</h3>
                     <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-1">贡献一次经验，提升组织整体上限</p>
                  </div>
                </div>
                <button onClick={() => setIsShareModalOpen(false)} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl transition-all"><X size={20}/></button>
             </div>
             <div className="p-10 space-y-6 flex-1 overflow-y-auto scrollbar-thin">
                <div className="grid grid-cols-2 gap-4">
                   <button onClick={() => setShareForm({...shareForm, type: '踩坑'})} className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-3 ${shareForm.type === '踩坑' ? 'bg-rose-50 border-rose-500 text-rose-700' : 'bg-white border-slate-100 text-slate-400'}`}><AlertCircle size={20}/> <span className="text-xs font-black uppercase">实战踩坑</span></button>
                   <button onClick={() => setShareForm({...shareForm, type: '最佳实践'})} className={`p-5 rounded-2xl border-2 transition-all flex items-center gap-3 ${shareForm.type === '最佳实践' ? 'bg-emerald-50 border-emerald-500 text-emerald-700' : 'bg-white border-slate-100 text-slate-400'}`}><CheckCircle2 size={20}/> <span className="text-xs font-black uppercase">最佳实践</span></button>
                </div>
                <textarea 
                   value={shareForm.rawText}
                   onChange={(e) => setShareForm({...shareForm, rawText: e.target.value})}
                   placeholder="详细描述发生了什么，你的处理方案是什么，以及最后的教训或经验，AI 将自动精炼..."
                   className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2rem] p-6 text-sm font-medium outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none shadow-inner leading-relaxed"
                />
             </div>
             <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button onClick={() => setIsShareModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase rounded-2xl hover:bg-slate-100">取消</button>
                <button onClick={handleShare} disabled={!shareForm.rawText.trim() || isRefining} className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50">
                   {isRefining ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18}/>} AI 优化并存库
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceLib;
