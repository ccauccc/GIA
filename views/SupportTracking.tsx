import React, { useState, useMemo } from 'react';
import { MOCK_SUPPORT_PROJECTS } from '../constants';
import { SupportProject, SupportTimelineEntry, ProjectStage, EvolutionItem, EvolutionSource } from '../types';
import { 
  Briefcase, CheckCircle2, Clock, Plus, BarChart2, Calendar, 
  TrendingUp, DollarSign, Target, PieChart as PieIcon, 
  ArrowUpRight, X, Sparkles, Loader2, Send, Info, Filter,
  ChevronRight, Lightbulb, Zap, BrainCircuit, Trash2,
  ListTodo, Kanban, Timer, Wallet, Globe, ArrowRight,
  ChevronDown, FileText, ShoppingCart, UserCheck, Activity,
  Layers, ArrowDown, TrendingDown, Edit3, Settings, ShieldAlert,
  GanttChartSquare, ClipboardList, TimerReset, Check, RotateCcw,
  CalendarDays, Building2, Workflow, History, MessageSquareQuote,
  Star, Gem, User, Tags, Package, LayoutGrid, ClipboardCheck,
  MessageSquare, Eye, ExternalLink, MoveRight, HelpCircle, Save
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Funnel, FunnelChart, LabelList, PieChart, Pie } from 'recharts';
import { GoogleGenAI } from "@google/genai";

const STAGE_COLORS: Record<string, string> = {
  'POC验证': 'text-blue-600 bg-blue-50 border-blue-100',
  '技术选型': 'text-indigo-600 bg-indigo-50 border-indigo-100',
  '合同对齐': 'text-amber-600 bg-amber-50 border-amber-100',
  '已签单': 'text-emerald-600 bg-emerald-50 border-emerald-100',
  '正式交付': 'text-purple-600 bg-purple-50 border-purple-100',
  '已流失': 'text-slate-400 bg-slate-50 border-slate-100'
};

const EVOLUTION_LANES = ['高价值沉淀', '产品验证中', '已加入路线图'] as const;

interface SupportTrackingProps {
  buOptions: string[];
  stageOptions: string[];
  productLineOptions: string[];
}

const SupportTracking: React.FC<SupportTrackingProps> = ({ buOptions, stageOptions, productLineOptions }) => {
  // Global Filter State
  const [filterDateStart, setFilterDateStart] = useState('2026-01-01');
  const [filterDateEnd, setFilterDateEnd] = useState('2026-12-31');
  const [selectedBu, setSelectedBu] = useState<string>('all');
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedFilterLines, setSelectedFilterLines] = useState<string[]>([]);

  const [projects, setProjects] = useState<SupportProject[]>(MOCK_SUPPORT_PROJECTS);
  
  const [evolutionItems, setEvolutionItems] = useState<EvolutionItem[]>([
    {
      id: 'evo-1',
      sourceType: EvolutionSource.PROJECT,
      sourceId: 's-b1',
      bu: '物流事业部',
      productLines: ['高精度配送索引'],
      iterationValue: '产研提取高并发下的数据索引优化算法',
      date: '2026-04-10',
      status: '高价值沉淀'
    },
    {
      id: 'evo-2',
      sourceType: EvolutionSource.COMMUNICATION,
      sourceName: '日常晨会对齐',
      bu: '企服事业部',
      productLines: ['地址标准化引擎'],
      iterationValue: '产品演进：支持非标准自然语言地址的模糊匹配权重配置',
      date: '2026-05-12',
      status: '产品验证中'
    }
  ]);

  const [activeView, setActiveView] = useState<'overview' | 'list' | 'evolution'>('overview');
  const [expandedProjectId, setExpandedProjectId] = useState<string | null>(MOCK_SUPPORT_PROJECTS[0]?.id);
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isEvoModalOpen, setIsEvoModalOpen] = useState(false);
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [isEvoAiOptimizing, setIsEvoAiOptimizing] = useState(false);
  const [isLineFilterOpen, setIsLineFilterOpen] = useState(false);

  // Evo Detail & Analysis Modal State
  const [isEvoDetailOpen, setIsEvoDetailOpen] = useState(false);
  const [selectedEvoItem, setSelectedEvoItem] = useState<EvolutionItem | null>(null);
  const [isDeepAnalyzing, setIsDeepAnalyzing] = useState(false);
  const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);
  const [editingAnalysisText, setEditingAnalysisText] = useState('');

  // Initialization Form State
  const [initForm, setInitForm] = useState<Partial<SupportProject>>({
    name: '', bu: buOptions[0] || '', stage: stageOptions[0] || 'POC验证', status: '进行中', estimatedValue: 0, initiator: '', productLines: [], valueImpact: '', date: new Date().toISOString().split('T')[0]
  });
  const [newTagInput, setNewTagInput] = useState('');

  // Evolution Form State
  const [evoForm, setEvoForm] = useState<Partial<EvolutionItem>>({
    sourceType: EvolutionSource.PROJECT, sourceId: '', sourceName: '', bu: buOptions[0] || '', productLines: [], iterationValue: '', date: new Date().toISOString().split('T')[0], status: '高价值沉淀'
  });

  // New Record Form State
  const [newRecord, setNewRecord] = useState<Partial<SupportTimelineEntry>>({
    startTime: new Date().toISOString().split('T')[0], estimatedDeliveryDate: '', advancementStatus: stageOptions[0] || '', requirementItems: '', iterationValue: '', hours: 2,
  });
  const [selectedEntryTags, setSelectedEntryTags] = useState<string[]>([]);

  // Filtered Projects
  const filteredProjects = useMemo(() => {
    return projects.filter(p => {
      const dateMatch = p.date >= filterDateStart && p.date <= filterDateEnd;
      const buMatch = selectedBu === 'all' || p.bu === selectedBu;
      const stageMatch = selectedStage === 'all' || p.stage === selectedStage;
      const lineMatch = selectedFilterLines.length === 0 || p.productLines.some(line => selectedFilterLines.includes(line));
      return dateMatch && buMatch && stageMatch && lineMatch;
    });
  }, [projects, filterDateStart, filterDateEnd, selectedBu, selectedStage, selectedFilterLines]);

  // Filtered Evolution Items
  const filteredEvolutionItems = useMemo(() => {
    return evolutionItems.filter(item => {
      const dateMatch = item.date >= filterDateStart && item.date <= filterDateEnd;
      const buMatch = selectedBu === 'all' || item.bu === selectedBu;
      const lineMatch = selectedFilterLines.length === 0 || item.productLines.some(line => selectedFilterLines.includes(line));
      return dateMatch && buMatch && lineMatch;
    });
  }, [evolutionItems, filterDateStart, filterDateEnd, selectedBu, selectedFilterLines]);

  // Analytics
  const overviewStats = useMemo(() => {
    let totalEstimatedValue = 0;
    let totalActualValue = 0;
    let totalInvestedHours = 0;

    const buCountMap: Record<string, number> = {};
    const buValueMap: Record<string, number> = {};
    const statusCountMap: Record<string, number> = { '进行中': 0, '已完成': 0, '阻塞': 0 };
    const stageCountMap: Record<string, number> = {};
    stageOptions.forEach(s => stageCountMap[s] = 0);
    
    filteredProjects.forEach(p => {
      buCountMap[p.bu] = (buCountMap[p.bu] || 0) + 1;
      statusCountMap[p.status] = (statusCountMap[p.status] || 0) + 1;
      stageCountMap[p.stage] = (stageCountMap[p.stage] || 0) + 1;
      const projectVal = p.estimatedValue || 0;
      buValueMap[p.bu] = (buValueMap[p.bu] || 0) + projectVal;
      totalEstimatedValue += projectVal;
      totalActualValue += (p.actualValue || 0);
      
      // Calculate hours from timeline
      p.timeline?.forEach(entry => {
        totalInvestedHours += (entry.hours || 0);
      });
    });

    const buChartData = Object.entries(buCountMap).map(([name, value]) => ({ name, value, revenue: buValueMap[name] }));
    const statusChartData = Object.entries(statusCountMap).map(([name, value]) => ({ name, value }));
    const stageChartData = Object.entries(stageCountMap).map(([name, value]) => ({ name, value }));

    const funnelData = stageOptions.map(stage => ({
      name: stage,
      value: projects.filter(p => {
        const stageIdx = stageOptions.indexOf(p.stage);
        const currentIdx = stageOptions.indexOf(stage);
        return stageIdx >= currentIdx; 
      }).length
    })).filter(d => d.value > 0);

    const lineRevenueMap: Record<string, number> = {};
    const lineCountMap: Record<string, number> = {};
    filteredProjects.forEach(p => {
      p.productLines.forEach(line => {
        lineCountMap[line] = (lineCountMap[line] || 0) + 1;
        const allocatedValue = (p.actualValue || p.estimatedValue) / (p.productLines.length || 1);
        lineRevenueMap[line] = (lineRevenueMap[line] || 0) + allocatedValue;
      });
    });
    const productLineData = Object.entries(lineRevenueMap).map(([name, revenue]) => ({ name, revenue, count: lineCountMap[name] })).sort((a, b) => b.revenue - a.revenue);
    
    const evoCategories = ['体验优化', '核心能力', '合规闭环', '性能提升'];
    const evoData = evoCategories.map(cat => {
      const count = filteredEvolutionItems.length;
      return { name: cat, value: Math.floor(count / 4) + (cat === '核心能力' ? count % 4 : 0) };
    });

    const conversionRate = filteredProjects.length > 0 
      ? ((filteredEvolutionItems.length / filteredProjects.length) * 100).toFixed(1) 
      : '0';

    return { 
      buChartData, 
      funnelData, 
      productLineData, 
      evoData,
      statusChartData,
      stageChartData,
      summary: {
        projectCount: filteredProjects.length,
        estimatedValue: totalEstimatedValue,
        actualValue: totalActualValue,
        hours: totalInvestedHours,
        conversionRate,
        buCount: Object.keys(buCountMap).length
      }
    };
  }, [filteredProjects, stageOptions, projects, filteredEvolutionItems]);

  const toggleEntryTag = (tag: string) => setSelectedEntryTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  const toggleFilterLine = (tag: string) => setSelectedFilterLines(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);

  const handleInitProject = () => {
    if (!initForm.name || !initForm.initiator) return;
    const newProj: SupportProject = {
      id: `s-${Date.now()}`, name: initForm.name, bu: initForm.bu || '其他', stage: initForm.stage || 'POC验证', status: '进行中', estimatedValue: initForm.estimatedValue || 0, initiator: initForm.initiator, productLines: initForm.productLines || [], valueImpact: initForm.valueImpact || '', date: initForm.date || new Date().toISOString().split('T')[0], timeline: []
    };
    setProjects(prev => [newProj, ...prev]);
    setIsInitModalOpen(false);
    setInitForm({ name: '', bu: buOptions[0] || '', stage: stageOptions[0] || 'POC验证', status: '进行中', estimatedValue: 0, initiator: '', productLines: [], valueImpact: '', date: new Date().toISOString().split('T')[0] });
  };

  const addProjectTag = () => {
    const val = newTagInput.trim();
    if (val) {
      if (!initForm.productLines?.includes(val)) {
        setInitForm(prev => ({
          ...prev,
          productLines: [...(prev.productLines || []), val]
        }));
      }
      setNewTagInput('');
    }
  };

  const handleAddEvolutionItem = () => {
    if (!evoForm.iterationValue) return;
    const newItem: EvolutionItem = {
      id: `evo-${Date.now()}`, sourceType: EvolutionSource.PROJECT, sourceId: evoForm.sourceId, sourceName: evoForm.sourceName, bu: evoForm.bu || '其他', productLines: evoForm.productLines || [], iterationValue: evoForm.iterationValue || '', date: evoForm.date || new Date().toISOString().split('T')[0], status: evoForm.status as any || '高价值沉淀'
    };
    setEvolutionItems(prev => [newItem, ...prev]);
    setIsEvoModalOpen(false);
    setEvoForm({ sourceType: EvolutionSource.PROJECT, sourceId: '', sourceName: '', bu: buOptions[0] || '', productLines: [], iterationValue: '', date: new Date().toISOString().split('T')[0], status: '高价值沉淀' });
  };

  const updateProjectStage = (projectId: string, newStage: ProjectStage) => setProjects(prev => prev.map(p => p.id === projectId ? { ...p, stage: newStage } : p));

  const handleAiExtract = async () => {
    if (!newRecord.requirementItems) return;
    setIsAiOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `分析以下业务支撑需求，识别其背后的“标准产品迭代价值”。需求描述："${newRecord.requirementItems}"。请返回一个简洁的结论。`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setNewRecord(prev => ({ ...prev, iterationValue: response.text || prev.iterationValue }));
    } catch (e) { console.error(e); } finally { setIsAiOptimizing(false); }
  };

  const handleEvoAiOptimize = async () => {
    if (!evoForm.iterationValue) return;
    setIsEvoAiOptimizing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一个资深产品专家。请将以下业务需求或反馈优化为“通用的标准产品能力描述”，提升其价值颗粒度和专业性。原始描述："${evoForm.iterationValue}"。请直接返回优化后的简洁结论（50字以内）。`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setEvoForm(prev => ({ ...prev, iterationValue: response.text || prev.iterationValue }));
    } catch (e) { console.error(e); } finally { setIsEvoAiOptimizing(false); }
  };

  const handleDeepAnalysis = async () => {
    if (!selectedEvoItem) return;
    setIsDeepAnalyzing(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `你是一名产品架构师。请针对以下识别出来的“产品迭代需求”，从“通用性、必要性、产品化路径”三个维度进行深入分析。
      需求摘要：${selectedEvoItem.iterationValue}
      来源BU：${selectedEvoItem.bu}
      所属产线：${selectedEvoItem.productLines.join(', ')}
      
      请提供一个专业的、具有洞察力的产品分析总结（150字左右），并给出是否纳入路线图的建议。`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      const analysis = response.text || '分析失败，请稍后重试。';
      
      const updatedItem = { ...selectedEvoItem, productAnalysis: analysis };
      setEvolutionItems(prev => prev.map(item => item.id === selectedEvoItem.id ? updatedItem : item));
      setSelectedEvoItem(updatedItem);
      // Sync editing text if not currently editing
      if (!isEditingAnalysis) {
        setEditingAnalysisText(analysis);
      }
    } catch (e) { console.error(e); } finally { setIsDeepAnalyzing(false); }
  };

  const handleUpdateEvoStatus = (newStatus: EvolutionItem['status']) => {
    if (!selectedEvoItem) return;
    const updatedItem = { ...selectedEvoItem, status: newStatus };
    setEvolutionItems(prev => prev.map(item => item.id === selectedEvoItem.id ? updatedItem : item));
    setSelectedEvoItem(updatedItem);
  };

  const handleSaveManualAnalysis = () => {
    if (!selectedEvoItem) return;
    const updatedItem = { ...selectedEvoItem, productAnalysis: editingAnalysisText };
    setEvolutionItems(prev => prev.map(item => item.id === selectedEvoItem.id ? updatedItem : item));
    setSelectedEvoItem(updatedItem);
    setIsEditingAnalysis(false);
  };

  const addTimelineEntry = (projectId: string) => {
    if (!newRecord.advancementStatus || !newRecord.startTime) return;
    const entry: SupportTimelineEntry = {
      id: `te-${Date.now()}`, startTime: newRecord.startTime, estimatedDeliveryDate: newRecord.estimatedDeliveryDate, advancementStatus: newRecord.advancementStatus || '', requirementItems: newRecord.requirementItems || '', iterationValue: newRecord.iterationValue || '', hours: Number(newRecord.hours) || 0, productLineTag: selectedEntryTags.join('; ')
    };
    const targetProject = projects.find(p => p.id === projectId);
    if (!targetProject) return;
    setProjects(prev => prev.map(p => {
      if (p.id === projectId) {
        let updatedProductLines = [...(p.productLines || [])];
        selectedEntryTags.forEach(tag => { if (!updatedProductLines.includes(tag)) updatedProductLines.push(tag); });
        return { ...p, stage: entry.advancementStatus, productLines: updatedProductLines, timeline: [entry, ...(p.timeline || [])].sort((a, b) => b.startTime.localeCompare(a.startTime)) };
      }
      return p;
    }));
    if (entry.iterationValue.trim()) {
      const newEvo: EvolutionItem = {
        id: `evo-sync-${Date.now()}`, sourceType: EvolutionSource.PROJECT, sourceId: projectId, bu: targetProject.bu, productLines: selectedEntryTags.length > 0 ? selectedEntryTags : targetProject.productLines, iterationValue: entry.iterationValue, date: entry.startTime, status: '高价值沉淀'
      };
      setEvolutionItems(prev => [newEvo, ...prev]);
    }
    setNewRecord({ startTime: new Date().toISOString().split('T')[0], estimatedDeliveryDate: '', advancementStatus: stageOptions[0] || '', requirementItems: '', iterationValue: '', hours: 2 });
    setSelectedEntryTags([]);
  };

  const deleteTimelineEntry = (projectId: string, entryId: string) => setProjects(prev => prev.map(p => p.id === projectId ? { ...p, timeline: p.timeline?.filter(te => te.id !== entryId) } : p));
  const handleResetFilters = () => { setFilterDateStart('2026-01-01'); setFilterDateEnd('2026-12-31'); setSelectedBu('all'); setSelectedStage('all'); setSelectedFilterLines([]); };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-24 max-w-7xl mx-auto">
      {/* Title Card */}
      <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100/60 flex flex-col lg:flex-row lg:items-center justify-between gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-indigo-600 pointer-events-none group-hover:scale-110 transition-transform duration-1000"><Activity size={220} /></div>
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 rotate-[-3deg] group-hover:rotate-0 transition-transform duration-500">
            <Briefcase size={36} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">支撑价值全链路日志</h2>
            <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-2xl border border-slate-100 w-fit">
               <button 
                onClick={() => setActiveView('overview')} 
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeView === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                <LayoutGrid size={14}/> 统计看板
               </button>
               <button 
                onClick={() => setActiveView('list')} 
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeView === 'list' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                <History size={14}/> 支撑项目
               </button>
               <button 
                onClick={() => setActiveView('evolution')} 
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeView === 'evolution' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
               >
                <Zap size={14}/> 识别产品化
               </button>
            </div>
          </div>
        </div>
        <div className="relative z-10">
          {activeView === 'evolution' ? (
            <button onClick={() => setIsEvoModalOpen(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group/btn">
              <Zap size={18} className="group-hover:scale-110 transition-transform" /> 识别需求增加
            </button>
          ) : (
            <button onClick={() => setIsInitModalOpen(true)} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-2 group/btn">
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 初始化项目主体
            </button>
          )}
        </div>
      </div>

      {/* Global Filter Module */}
      <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col md:flex-row items-center gap-8 z-30 relative">
        <div className="flex items-center gap-3 bg-indigo-50/50 p-2.5 rounded-[1.5rem] border border-indigo-100/50">
          <div className="flex items-center gap-3 px-5 py-3 bg-white border border-indigo-100 rounded-2xl shadow-sm">
            <CalendarDays size={18} className="text-indigo-500" />
            <div className="flex items-center gap-3">
              <input type="date" value={filterDateStart} onChange={(e) => setFilterDateStart(e.target.value)} className="text-[11px] font-black uppercase outline-none cursor-pointer bg-transparent text-indigo-900 w-[115px]" />
              <ArrowRight size={14} className="text-indigo-300" />
              <input type="date" value={filterDateEnd} onChange={(e) => setFilterDateEnd(e.target.value)} className="text-[11px] font-black uppercase outline-none cursor-pointer bg-transparent text-indigo-900 w-[115px]" />
            </div>
          </div>
        </div>
        <div className="h-12 w-px bg-slate-100 hidden md:block" />
        <div className="flex flex-1 items-center gap-6 w-full">
           <div className="flex-1 relative group">
              <Building2 size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select value={selectedBu} onChange={(e) => setSelectedBu(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all appearance-none shadow-inner">
                <option value="all">全部事业部</option>
                {buOptions.map(bu => <option key={bu} value={bu}>{bu}</option>)}
              </select>
           </div>
           <div className="flex-1 relative group">
              <Workflow size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select value={selectedStage} onChange={(e) => setSelectedStage(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-500/10 cursor-pointer transition-all appearance-none shadow-inner">
                <option value="all">全部生命周期阶段</option>
                {stageOptions.map(stage => <option key={stage} value={stage}>{stage}</option>)}
              </select>
           </div>
           <div className="flex-1 relative">
              <button onClick={() => setIsLineFilterOpen(!isLineFilterOpen)} className={`w-full flex items-center justify-between pl-5 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-[1.5rem] text-[11px] font-black uppercase tracking-widest outline-none transition-all shadow-inner ${selectedFilterLines.length > 0 ? 'text-indigo-600 ring-2 ring-indigo-500/20' : 'text-slate-400'}`}>
                 <div className="flex items-center gap-3 truncate">
                    <Package size={18} className={selectedFilterLines.length > 0 ? 'text-indigo-600' : 'text-slate-400'} />
                    <span>{selectedFilterLines.length > 0 ? `已选产线 (${selectedFilterLines.length})` : '全部产线维度'}</span>
                 </div>
                 <ChevronDown size={16} className={`transition-transform duration-300 ${isLineFilterOpen ? 'rotate-180' : ''}`} />
              </button>
              {isLineFilterOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsLineFilterOpen(false)} />
                  <div className="absolute top-full left-0 mt-3 w-full bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 px-1">选择过滤产线</p>
                     <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-2">
                        {productLineOptions.map(line => (<button key={line} onClick={() => toggleFilterLine(line)} className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-[11px] font-black uppercase transition-all ${selectedFilterLines.includes(line) ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500 hover:bg-slate-50'}`}><span className="truncate">{line}</span>{selectedFilterLines.includes(line) && <Check size={16} />}</button>))}
                     </div>
                     {selectedFilterLines.length > 0 && (<button onClick={() => setSelectedFilterLines([])} className="w-full mt-4 pt-4 border-t border-slate-50 text-[10px] font-black text-rose-500 uppercase hover:underline text-center tracking-widest">清除选择</button>)}
                  </div>
                </>
              )}
           </div>
        </div>
        <button onClick={handleResetFilters} className="p-4 bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-[1.5rem] transition-all shadow-inner"><RotateCcw size={20} /></button>
      </div>

      {activeView === 'overview' && (
        <div className="space-y-10 animate-in slide-in-from-bottom-6 duration-700">
           {/* Metric Cards Row */}
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="bg-white p-8 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col justify-between group hover:border-indigo-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-indigo-600 group-hover:scale-110 transition-transform duration-700"><Briefcase size={100} /></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                    <Briefcase size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">支撑项目</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{overviewStats.summary.projectCount}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">当前筛选总量</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col justify-between group hover:border-emerald-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-emerald-600 group-hover:scale-110 transition-transform duration-700"><DollarSign size={100} /></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                    <DollarSign size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">预估总价值</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-4xl font-black text-emerald-600 tracking-tighter">¥{overviewStats.summary.estimatedValue}W</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">支撑贡献总额</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col justify-between group hover:border-blue-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-blue-600 group-hover:scale-110 transition-transform duration-700"><Clock size={100} /></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Clock size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">累计投入工时</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{overviewStats.summary.hours}h</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">产研支撑成本</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col justify-between group hover:border-amber-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-amber-600 group-hover:scale-110 transition-transform duration-700"><Zap size={100} /></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 shadow-sm">
                    <Zap size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">产品化转化率</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-4xl font-black text-amber-600 tracking-tighter">{overviewStats.summary.conversionRate}%</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">演进力沉淀率</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2rem] border border-slate-100/60 shadow-sm flex flex-col justify-between group hover:border-purple-100 hover:shadow-xl transition-all duration-500 relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-purple-600 group-hover:scale-110 transition-transform duration-700"><Building2 size={100} /></div>
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm">
                    <Building2 size={24} />
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">核心BU覆盖</span>
                </div>
                <div className="relative z-10">
                   <h4 className="text-4xl font-black text-slate-900 tracking-tighter">{overviewStats.summary.buCount}</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">组织触达深度</p>
                </div>
              </div>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col h-[500px]">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">按事业部统计 (BU)</h3>
                 </div>
                 <div className="flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={overviewStats.buChartData} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} /><Bar dataKey="value" name="项目数" fill="#6366f1" radius={[0, 6, 6, 0]} barSize={24} /><Bar dataKey="revenue" name="估值(万)" fill="#10b981" radius={[0, 6, 6, 0]} barSize={24} /></BarChart></ResponsiveContainer></div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col h-[500px]">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-rose-500 rounded-full" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">按项目状态统计</h3>
                 </div>
                 <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</span>
                       <span className="text-2xl font-black text-slate-900">{overviewStats.summary.projectCount}</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={overviewStats.statusChartData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">{overviewStats.statusChartData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.name === '进行中' ? '#6366f1' : entry.name === '已完成' ? '#10b981' : '#f43f5e'} />))}</Pie><Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} /></PieChart></ResponsiveContainer>
                 </div>
                 <div className="mt-8 grid grid-cols-3 gap-4">{overviewStats.statusChartData.map((d, i) => (<div key={i} className="flex flex-col items-center p-3 bg-slate-50 rounded-2xl border border-slate-100"><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{d.name}</div><div className="text-xs font-black text-slate-700">{d.value} 项</div></div>))}</div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col h-[500px]">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">按推进状态统计 (生命周期)</h3>
                 </div>
                 <div className="flex-1"><ResponsiveContainer width="100%" height="100%"><BarChart data={overviewStats.stageChartData}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" /><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 700, fill: '#94a3b8' }} /><YAxis hide /><Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} /><Bar dataKey="value" name="项目数" fill="#818cf8" radius={[6, 6, 0, 0]} barSize={36} /></BarChart></ResponsiveContainer></div>
              </div>
           </div>
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] border border-slate-100/60 shadow-sm">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">产线经营维度：售卖与价值分析</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{overviewStats.productLineData.map((line, idx) => (<div key={idx} className="p-6 bg-slate-50/50 rounded-[2rem] border border-slate-100 flex items-center justify-between group hover:bg-white hover:border-emerald-100 hover:shadow-xl transition-all duration-500"><div className="flex items-center gap-5"><div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm group-hover:scale-110 transition-transform duration-500"><Package size={28} /></div><div><div className="text-base font-black text-slate-900 tracking-tight">{line.name}</div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">关联项目：{line.count} 个</div></div></div><div className="text-right"><div className="text-xl font-black text-emerald-600 tracking-tight">¥{line.revenue.toFixed(0)}W</div><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1.5">经营贡献</div></div></div>))}</div>
              </div>
              <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100/60 shadow-sm flex flex-col">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
                    <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em] flex items-center gap-2">需求转化产品迭代统计</h3>
                 </div>
                 <div className="flex-1 min-h-[300px] flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={overviewStats.evoData} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" stroke="none">{overviewStats.evoData.map((entry, index) => (<Cell key={`cell-${index}`} fill={['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'][index % 4]} />))}</Pie><Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} /></PieChart></ResponsiveContainer>
                 </div>
                 <div className="mt-8 grid grid-cols-2 gap-4">{overviewStats.evoData.map((d, i) => (<div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100"><div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{backgroundColor: ['#f59e0b', '#fbbf24', '#fcd34d', '#fef3c7'][i % 4]}} /><div className="flex-1 min-w-0"><div className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{d.name}</div><div className="text-sm font-black text-slate-700">{d.value} 项</div></div></div>))}</div>
              </div>
           </div>
        </div>
      )}

      {activeView === 'list' ? (
        <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
          {filteredProjects.map(proj => {
            const isExpanded = expandedProjectId === proj.id; 
            const currentStageIndex = stageOptions.indexOf(proj.stage); 
            const totalHours = (proj.timeline || []).reduce((acc, te) => acc + (te.hours || 0), 0);
            return (
              <div key={proj.id} className={`bg-white rounded-[3rem] border transition-all duration-500 overflow-hidden shadow-sm ${isExpanded ? 'border-indigo-200 shadow-2xl scale-[1.01]' : 'border-slate-100 hover:border-slate-200 hover:shadow-lg'}`}>
                <div className={`p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 cursor-pointer transition-colors ${isExpanded ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`} onClick={() => setExpandedProjectId(isExpanded ? null : proj.id)}>
                  <div className="flex items-center gap-8">
                    <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center transition-all duration-500 ${isExpanded ? 'bg-indigo-600 text-white rotate-[-6deg] shadow-xl shadow-indigo-100' : 'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500'}`}>
                      <Briefcase size={32} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-black text-indigo-600 bg-white px-3 py-1 rounded-xl border border-indigo-100 uppercase tracking-widest shadow-sm">{proj.bu}</span>
                        <span className={`text-[10px] font-black px-3 py-1 rounded-xl border uppercase tracking-widest shadow-sm ${STAGE_COLORS[proj.stage] || 'bg-white text-slate-400 border-slate-100'}`}>{proj.stage}</span>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 leading-tight tracking-tight">{proj.name}</h3>
                      <div className="flex items-center gap-6 mt-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><User size={14} className="text-slate-300"/> 发起人: {proj.initiator}</p>
                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2"><DollarSign size={14} className="text-emerald-400"/> 预估价值: ¥{proj.estimatedValue}W</p>
                        <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                        <div className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest"><Timer size={14} /> 累计耗时：{totalHours} h</div>
                      </div>
                    </div>
                  </div>
                  <button className={`p-5 rounded-2xl transition-all duration-500 ${isExpanded ? 'bg-indigo-600 text-white shadow-xl rotate-180' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}>
                    <ChevronDown size={24} />
                  </button>
                </div>
                {isExpanded && (
                  <div className="p-10 pt-0 space-y-12 animate-in slide-in-from-top-6 duration-700">
                    <div className="flex items-center justify-between relative px-12 py-10 bg-slate-50/50 rounded-[3rem] border border-slate-100 shadow-inner">
                      <div className="absolute top-1/2 left-24 right-24 h-1.5 bg-slate-200 -translate-y-1/2 rounded-full" />
                      <div className="absolute top-1/2 left-24 h-1.5 bg-indigo-500 -translate-y-1/2 transition-all duration-1000 rounded-full" style={{ width: `${Math.max(0, (currentStageIndex / (stageOptions.length - 1)) * 82)}%` }} />
                      {stageOptions.map((step, idx) => { 
                        const isPast = idx < currentStageIndex; 
                        const isCurrent = idx === currentStageIndex; 
                        return (
                          <button key={step} onClick={(e) => { e.stopPropagation(); updateProjectStage(proj.id, step); }} className="relative z-10 flex flex-col items-center group">
                            <div className={`w-12 h-12 rounded-2xl border-4 flex items-center justify-center transition-all duration-500 ${isPast ? 'bg-indigo-500 border-indigo-200 text-white shadow-xl shadow-indigo-100' : isCurrent ? 'bg-white border-indigo-500 text-indigo-600 shadow-2xl scale-125' : 'bg-white border-slate-200 text-slate-300'}`}>
                              {isPast ? <Check size={24} /> : <span className="text-sm font-black">{idx + 1}</span>}
                            </div>
                            <span className={`absolute -bottom-10 whitespace-nowrap text-[10px] font-black uppercase tracking-[0.15em] transition-colors ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>{step}</span>
                          </button>
                        ); 
                      })}
                    </div>
                    
                    <div className="bg-white p-10 rounded-[3rem] border-2 border-indigo-100 shadow-2xl shadow-indigo-50/50 space-y-10 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-2.5 h-full bg-indigo-600" />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shadow-sm"><Edit3 size={24}/></div>
                          <h4 className="text-base font-black text-slate-800 uppercase tracking-[0.2em]">录入最新推进记录</h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                        <div className="md:col-span-3 space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">开始时间</label>
                          <input type="date" value={newRecord.startTime} onChange={(e) => setNewRecord({...newRecord, startTime: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner transition-all" />
                        </div>
                        <div className="md:col-span-3 space-y-3">
                          <label className="text-[10px] font-black text-rose-500 uppercase tracking-widest ml-1">预估交付时间</label>
                          <input type="date" value={newRecord.estimatedDeliveryDate} onChange={(e) => setNewRecord({...newRecord, estimatedDeliveryDate: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-rose-500/10 shadow-inner transition-all" />
                        </div>
                        <div className="md:col-span-3 space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">推进状态阶段</label>
                          <select value={newRecord.advancementStatus} onChange={(e) => setNewRecord({...newRecord, advancementStatus: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none cursor-pointer focus:ring-4 focus:ring-indigo-500/10 appearance-none shadow-inner transition-all">{stageOptions.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select>
                        </div>
                        <div className="md:col-span-3 space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">工时 (h)</label>
                          <div className="relative">
                            <Timer className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                            <input type="number" value={newRecord.hours} onChange={(e) => setNewRecord({...newRecord, hours: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-5 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-inner transition-all" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">关联产线标签</label>
                        <div className="flex flex-wrap gap-2.5 p-5 bg-slate-50 border border-slate-200 rounded-[2rem] min-h-[56px] shadow-inner">
                          {productLineOptions.map(line => (
                            <button key={line} onClick={() => toggleEntryTag(line)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all flex items-center gap-2 border ${selectedEntryTags.includes(line) ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}>
                              <Package size={12} /> {line}{selectedEntryTags.includes(line) && <Check size={12} />}
                            </button>
                          ))}
                          <input placeholder="+ 快速新增产线..." className="flex-1 bg-transparent border-none px-4 py-2 text-[10px] font-bold outline-none min-w-[180px]" onKeyDown={(e) => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value.trim(); if (val && !selectedEntryTags.includes(val)) { toggleEntryTag(val); (e.target as HTMLInputElement).value = ''; } } }} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <label className="text-[10px] font-black text-indigo-500 uppercase tracking-widest ml-1 flex items-center gap-2"><ListTodo size={16}/> 支撑事项描述</label>
                            <button onClick={handleAiExtract} disabled={!newRecord.requirementItems || isAiOptimizing} className="flex items-center gap-2 text-[10px] font-black text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-50 shadow-sm border border-indigo-100">{isAiOptimizing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14}/>} AI 识别价值点</button>
                          </div>
                          <textarea value={newRecord.requirementItems} onChange={(e) => setNewRecord({...newRecord, requirementItems: e.target.value})} className="w-full h-36 bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-medium outline-none resize-none shadow-inner focus:ring-4 focus:ring-indigo-500/10 transition-all" placeholder="记录具体业务支撑细节或进展说明..." />
                        </div>
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest ml-1 flex items-center gap-2"><Gem size={16}/> 识别产品迭代价值</label>
                          <textarea value={newRecord.iterationValue} onChange={(e) => setNewRecord({...newRecord, iterationValue: e.target.value})} className="w-full h-36 bg-emerald-50/30 border border-emerald-100 rounded-[2rem] px-6 py-5 text-sm font-medium outline-none text-emerald-900 resize-none shadow-inner focus:ring-4 focus:ring-emerald-500/10 transition-all" placeholder="分析如何将该记录转化为通用的产品能力..." />
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => addTimelineEntry(proj.id)} disabled={!newRecord.advancementStatus} className="px-12 py-5 bg-indigo-600 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center gap-3 disabled:opacity-50 group/save">
                          <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /> 录入流水线并同步状态
                        </button>
                      </div>
                    </div>
                    <div className="space-y-10 relative">
                      <div className="absolute left-[39px] top-6 bottom-6 w-1.5 bg-slate-100 rounded-full" />
                      {(proj.timeline || []).length > 0 ? proj.timeline?.map((entry, idx) => (
                        <div key={entry.id} className="relative pl-24 group/item">
                          <div className="absolute left-6 top-4 w-8 h-8 rounded-full border-4 border-white shadow-xl flex items-center justify-center transition-all duration-500 bg-indigo-500 group-hover/item:scale-125 group-hover/item:rotate-12 z-10">
                            <Target size={14} className="text-white" />
                          </div>
                          <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm group-hover/item:shadow-2xl group-hover/item:border-indigo-100 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-[0.02] text-indigo-600 pointer-events-none group-hover/item:scale-110 transition-transform duration-1000"><History size={120} /></div>
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 relative z-10">
                              <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{entry.startTime}</span>
                                  <h5 className="text-xl font-black text-slate-900 mt-1.5 tracking-tight">{entry.advancementStatus}</h5>
                                </div>
                                {entry.productLineTag && (
                                  <div className="flex flex-wrap gap-2">
                                    {entry.productLineTag.split('; ').map((tag, tIdx) => (
                                      <span key={tIdx} className="px-3 py-1 rounded-xl text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-100 flex items-center gap-1.5 shadow-sm"><Package size={12}/> {tag}</span>
                                    ))}
                                  </div>
                                )}
                                <div className="flex items-center gap-2.5 px-4 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl shadow-sm">
                                  <Clock size={14} className="text-indigo-400" />
                                  <span className="text-[10px] font-black text-indigo-600">{entry.hours} h</span>
                                </div>
                                {entry.estimatedDeliveryDate && (
                                  <div className="flex items-center gap-2.5 px-4 py-1.5 bg-rose-50 border border-rose-100 rounded-xl text-[10px] font-black text-rose-600 uppercase shadow-sm">
                                    <Calendar size={14} className="text-rose-400"/> 预估交付：{entry.estimatedDeliveryDate}
                                  </div>
                                )}
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); deleteTimelineEntry(proj.id, entry.id); }} className="p-3 text-slate-200 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all opacity-0 group-hover/item:opacity-100">
                                <Trash2 size={20}/>
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                              <div className="p-8 bg-slate-50 rounded-[2.5rem] border border-slate-100 group-hover/item:bg-white transition-colors duration-500">
                                <div className="flex items-center gap-3 mb-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]"><FileText size={18} className="text-indigo-400"/> 支撑事项明细</div>
                                <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{entry.requirementItems}</p>
                              </div>
                              <div className="p-8 bg-emerald-50/30 rounded-[2.5rem] border border-emerald-100 relative overflow-hidden group-hover/item:bg-emerald-50/50 transition-colors duration-500">
                                <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-emerald-900 pointer-events-none"><Zap size={60} /></div>
                                <div className="flex items-center gap-3 mb-5 text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]"><Gem size={18}/> 产品迭代价值识别</div>
                                <p className="text-sm font-bold text-emerald-800 leading-relaxed">{entry.iterationValue}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )) : (
                        <div className="py-24 flex flex-col items-center justify-center text-slate-300 italic opacity-50 ml-12">
                          <div className="w-20 h-20 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6"><History size={40} /></div>
                          <p className="text-sm font-black uppercase tracking-[0.2em]">该项目主体下暂无推进日志</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {filteredProjects.length === 0 && (<div className="py-32 bg-white rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300"><History size={64} className="mb-4 opacity-20" /><p className="font-black uppercase tracking-widest">当前筛选条件下暂无支撑记录</p></div>)}
        </div>
      ) : activeView === 'evolution' ? (
        /* Evolution View (Productization Focus) */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 animate-in slide-in-from-right-6 duration-700">
           {EVOLUTION_LANES.map(lane => (
             <div key={lane} className="bg-slate-50/30 p-8 rounded-[3rem] border border-slate-100 flex flex-col gap-8">
                <div className="flex items-center justify-between px-3">
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Zap size={20} className="text-indigo-600" /> {lane}
                  </h3>
                  <span className="px-3 py-1 bg-white rounded-xl text-[10px] font-black text-slate-400 border border-slate-100 shadow-sm">
                    {filteredEvolutionItems.filter(item => item.status === lane).length}
                  </span>
                </div>
                <div className="space-y-6">
                   {filteredEvolutionItems.filter(item => item.status === lane).map(item => (
                     <div 
                        key={item.id} 
                        onClick={() => { setSelectedEvoItem(item); setIsEvoDetailOpen(true); setIsEditingAnalysis(false); }}
                        className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-200 hover:scale-[1.02] transition-all duration-500 group relative overflow-hidden cursor-pointer"
                      >
                        {item.sourceType === EvolutionSource.PROJECT ? (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500" />
                        ) : (
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                        )}
                        <div className="flex items-center justify-between mb-5">
                           <div className="flex items-center gap-2.5">
                             <span className={`text-[9px] font-black px-2.5 py-1 rounded-xl border uppercase tracking-widest shadow-sm ${item.sourceType === EvolutionSource.PROJECT ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                               {item.sourceType}
                             </span>
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.bu}</span>
                           </div>
                           <div className="flex items-center gap-2">
                             {item.productAnalysis && <div className="p-1.5 bg-amber-50 text-amber-600 rounded-xl shadow-sm" title="已完成产品分析"><BrainCircuit size={14}/></div>}
                             <Star size={16} className="text-amber-400 fill-amber-400 drop-shadow-sm" />
                           </div>
                        </div>
                        <h4 className="text-base font-black text-slate-900 mb-5 leading-snug group-hover:text-indigo-600 transition-colors tracking-tight">{item.iterationValue}</h4>
                        <div className="flex flex-wrap gap-2 mb-6">
                           {item.productLines.map(pl => (
                             <span key={pl} className="px-2.5 py-1 bg-slate-50 text-slate-400 text-[9px] font-bold rounded-xl border border-slate-100 uppercase tracking-tighter">{pl}</span>
                           ))}
                        </div>
                        <div className="pt-5 border-t border-slate-50 flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                           <span className="truncate max-w-[160px] flex items-center gap-2">
                             <Target size={12} className="text-slate-300" /> {item.sourceType === EvolutionSource.PROJECT ? projects.find(p => p.id === item.sourceId)?.name : item.sourceName}
                           </span>
                           <span className="flex items-center gap-2"><Calendar size={12} className="text-slate-300" /> {item.date}</span>
                        </div>
                        
                        <div className="absolute bottom-6 right-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0 flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em]">
                           查看并分析 <ChevronRight size={14} />
                        </div>
                     </div>
                   ))}
                   {filteredEvolutionItems.filter(item => item.status === lane).length === 0 && (
                     <div className="py-16 flex flex-col items-center justify-center text-slate-300 italic opacity-50 bg-white/50 rounded-[2.5rem] border border-dashed border-slate-200">
                       <Zap size={40} className="mb-3 opacity-20" />
                       <p className="text-[10px] font-black uppercase tracking-widest">暂无符合条件的记录</p>
                     </div>
                   )}
                </div>
             </div>
           ))}
        </div>
      ) : null}

      {/* Evolution Detail & Analysis Modal */}
      {isEvoDetailOpen && selectedEvoItem && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsEvoDetailOpen(false)} />
           <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
              <div className="bg-indigo-600 px-10 py-8 flex items-center justify-between text-white flex-shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><Eye size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black tracking-tight">需求深度详情与产品化路径</h3>
                       <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">ID: {selectedEvoItem.id} | 状态: {selectedEvoItem.status}</p>
                    </div>
                 </div>
                 <button onClick={() => setIsEvoDetailOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
              </div>

              <div className="p-10 space-y-12 overflow-y-auto flex-1 scrollbar-thin">
                 {/* Basic Info Header */}
                 <div className="bg-slate-50/50 p-10 rounded-[3.5rem] border border-slate-100 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-indigo-900 pointer-events-none -rotate-12"><Zap size={180}/></div>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase border shadow-sm ${selectedEvoItem.sourceType === EvolutionSource.PROJECT ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                             {selectedEvoItem.sourceType}
                          </span>
                          <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">识别时间：{selectedEvoItem.date}</span>
                       </div>
                       <div className="flex items-center gap-3">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">当前阶段:</span>
                          <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase border shadow-md ${
                             selectedEvoItem.status === '高价值沉淀' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                             selectedEvoItem.status === '产品验证中' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                             'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}>
                             {selectedEvoItem.status}
                          </div>
                       </div>
                    </div>
                    
                    <div className="relative z-10">
                       <h4 className="text-3xl font-black text-slate-900 leading-tight mb-6 tracking-tight">{selectedEvoItem.iterationValue}</h4>
                       <div className="flex flex-wrap gap-3">
                          {selectedEvoItem.productLines.map(pl => (
                             <span key={pl} className="px-4 py-2 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase flex items-center gap-2.5 shadow-sm transition-all hover:border-indigo-200 hover:text-indigo-600">
                                <Package size={14} className="text-indigo-400"/> {pl}
                             </span>
                          ))}
                       </div>
                    </div>

                    <div className="pt-8 border-t border-slate-200/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm"><Building2 size={22}/></div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">所属事业部</p>
                             <p className="text-base font-black text-slate-800">{selectedEvoItem.bu}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-500 border border-slate-100 shadow-sm"><History size={22}/></div>
                          <div className="max-w-[240px]">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">源自渠道</p>
                             <p className="text-base font-black text-slate-800 truncate">{selectedEvoItem.sourceType === EvolutionSource.PROJECT ? projects.find(p => p.id === selectedEvoItem.sourceId)?.name : selectedEvoItem.sourceName}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Analysis Section */}
                 <section className="space-y-6 pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                       <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2 bg-amber-50 text-amber-600 rounded-xl flex-shrink-0"><BrainCircuit size={20}/></div>
                          <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest truncate">产品专家分析与评估</h4>
                       </div>
                       <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                         {selectedEvoItem.productAnalysis && !isEditingAnalysis && (
                           <button 
                            onClick={() => { setIsEditingAnalysis(true); setEditingAnalysisText(selectedEvoItem.productAnalysis || ''); }}
                            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center gap-2 shadow-sm"
                           >
                            <Edit3 size={14}/> 编辑评估结论
                           </button>
                         )}
                         <button 
                          onClick={handleDeepAnalysis}
                          disabled={isDeepAnalyzing}
                          className="px-5 py-2.5 bg-indigo-50 text-indigo-600 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2 shadow-sm border border-indigo-100"
                         >
                          {isDeepAnalyzing ? <Loader2 size={14} className="animate-spin"/> : <Sparkles size={14}/>} 
                          {selectedEvoItem.productAnalysis ? '重新生成分析' : 'AI 深度分析'}
                         </button>
                       </div>
                    </div>

                    <div className={`p-8 rounded-[2.5rem] border-2 transition-all relative overflow-hidden ${selectedEvoItem.productAnalysis || isEditingAnalysis ? 'bg-amber-50/30 border-amber-100 shadow-xl shadow-amber-50/50' : 'bg-slate-50 border-dashed border-slate-200'}`}>
                       {isDeepAnalyzing ? (
                         <div className="py-20 flex flex-col items-center justify-center gap-4">
                            <Loader2 size={40} className="text-indigo-500 animate-spin" />
                            <p className="text-xs font-black text-indigo-900 uppercase tracking-widest animate-pulse">正在调动 AI 架构师资源...</p>
                         </div>
                       ) : isEditingAnalysis ? (
                         <div className="space-y-4 animate-in fade-in duration-300">
                            <textarea 
                              value={editingAnalysisText}
                              onChange={(e) => setEditingAnalysisText(e.target.value)}
                              className="w-full h-64 bg-white border border-amber-200 rounded-3xl p-6 text-sm font-medium text-slate-700 leading-loose outline-none focus:ring-4 focus:ring-amber-500/10 shadow-inner resize-none"
                              placeholder="在此输入或完善产品专家评估结论，针对 AI 的局限性进行修正..."
                            />
                            <div className="flex justify-end gap-3">
                               <button 
                                onClick={() => setIsEditingAnalysis(false)}
                                className="px-5 py-2 bg-white border border-slate-200 text-slate-500 text-[10px] font-black uppercase rounded-xl hover:bg-slate-50 transition-all"
                               >
                                 取消
                               </button>
                               <button 
                                onClick={handleSaveManualAnalysis}
                                className="px-6 py-2 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
                               >
                                 <Save size={14}/> 保存修正
                               </button>
                            </div>
                         </div>
                       ) : selectedEvoItem.productAnalysis ? (
                         <>
                            <div className="absolute top-0 right-0 p-8 opacity-[0.04] text-amber-900 pointer-events-none rotate-12"><LayoutGrid size={160}/></div>
                            <p className="text-sm font-medium text-slate-700 leading-loose relative z-10 whitespace-pre-wrap italic">
                               {selectedEvoItem.productAnalysis}
                            </p>
                            <div className="mt-8 pt-6 border-t border-amber-100/50 flex items-center justify-between relative z-10">
                               <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"/> <span className="text-[10px] font-black text-slate-500 uppercase">高通用性</span></div>
                                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"/> <span className="text-[10px] font-black text-slate-500 uppercase">建议纳入 Roadmap</span></div>
                               </div>
                               <span className="text-[9px] font-black text-amber-600 uppercase tracking-tighter">
                                 {selectedEvoItem.productAnalysis.includes('已保存') ? '人工修正于：' : '结论更新于：'}{new Date().toLocaleTimeString()}
                               </span>
                            </div>
                         </>
                       ) : (
                         <div className="py-16 flex flex-col items-center justify-center text-slate-300 italic opacity-50">
                            <BrainCircuit size={48} className="mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest">暂无分析结论，请点击上方按钮触发深度评估</p>
                         </div>
                       )}
                    </div>
                 </section>

                 {/* Status Transition Control */}
                 <section className="space-y-8">
                    <div className="flex items-center gap-4">
                       <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl shadow-sm"><Workflow size={24}/></div>
                       <h4 className="text-base font-black text-slate-800 uppercase tracking-[0.2em]">生命周期流转控制</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                       {EVOLUTION_LANES.map(lane => (
                          <button 
                             key={lane}
                             onClick={() => handleUpdateEvoStatus(lane)}
                             className={`p-8 rounded-[2.5rem] border-2 transition-all duration-500 flex flex-col gap-4 relative overflow-hidden group ${
                                selectedEvoItem.status === lane 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xl shadow-indigo-200 scale-[1.02]' 
                                : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200 hover:shadow-xl hover:-translate-y-1'
                             }`}
                          >
                             <div className="flex items-center justify-between relative z-10">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${selectedEvoItem.status === lane ? 'text-indigo-200' : 'text-slate-400'}`}>Stage</span>
                                {selectedEvoItem.status === lane && <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md animate-in zoom-in duration-300"><CheckCircle2 size={20} className="text-white"/></div>}
                             </div>
                             <span className="text-lg font-black uppercase tracking-tight relative z-10">{lane}</span>
                             {selectedEvoItem.status === lane && <div className="absolute top-0 right-0 p-6 opacity-10 text-white pointer-events-none"><Star size={80} className="animate-pulse" /></div>}
                             <div className={`mt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest relative z-10 ${selectedEvoItem.status === lane ? 'text-indigo-200' : 'text-slate-300 group-hover:text-indigo-400'}`}>
                                {lane === '高价值沉淀' ? '进入资产库' : lane === '产品验证中' ? '开启 POC 与打磨' : '正式并入产品主干'} <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
                             </div>
                          </button>
                       ))}
                    </div>
                 </section>
              </div>

              <div className="p-10 pt-0 flex gap-4 flex-shrink-0">
                 <button onClick={() => setIsEvoDetailOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase rounded-3xl hover:bg-slate-200 transition-all">关闭详情</button>
                 {selectedEvoItem.status !== '已加入路线图' && (
                   <button 
                    onClick={() => handleUpdateEvoStatus('已加入路线图')}
                    className="flex-[2] py-4 bg-emerald-600 text-white font-black text-xs uppercase rounded-3xl hover:bg-emerald-700 shadow-xl transition-all flex items-center justify-center gap-3"
                   >
                    <ExternalLink size={18} /> 直接纳入 Roadmap
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Evolution Item Modal (Requirement Entry) */}
      {isEvoModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsEvoModalOpen(false)} />
           <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
              <div className="bg-indigo-600 px-10 py-8 flex items-center justify-between text-white flex-shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><Zap size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black tracking-tight">识别需求录入</h3>
                       <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">将业务洞察转化为产品演进力</p>
                    </div>
                 </div>
                 <button onClick={() => setIsEvoModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8 overflow-y-auto flex-1 scrollbar-thin">
                 <div className="space-y-4">
                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">需求来源类型</label>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={() => setEvoForm({...evoForm, sourceType: EvolutionSource.PROJECT})} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${evoForm.sourceType === EvolutionSource.PROJECT ? 'bg-indigo-50 border-indigo-600 text-indigo-600 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}><Briefcase size={24} /><span className="text-xs font-black uppercase">从项目运营转化过来</span></button>
                       <button onClick={() => setEvoForm({...evoForm, sourceType: EvolutionSource.COMMUNICATION})} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${evoForm.sourceType === EvolutionSource.COMMUNICATION ? 'bg-emerald-50 border-emerald-600 text-emerald-600 shadow-md' : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200'}`}><MessageSquare size={24} /><span className="text-xs font-black uppercase">从日常沟通中识别</span></button>
                    </div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                       <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">{evoForm.sourceType === EvolutionSource.PROJECT ? '关联支撑项目主体' : '日常沟通场景描述'}</label>
                       {evoForm.sourceType === EvolutionSource.PROJECT ? (
                          <select value={evoForm.sourceId} onChange={(e) => setEvoForm({...evoForm, sourceId: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner"><option value="">选择已有项目...</option>{projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
                       ) : (
                          <input value={evoForm.sourceName} onChange={(e) => setEvoForm({...evoForm, sourceName: e.target.value})} placeholder="例如：事业部周会、客户拜访反馈等" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner" />
                       )}
                    </div>
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">识别时间</label><input type="date" value={evoForm.date} onChange={(e) => setEvoForm({...evoForm, date: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner" /></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">所属业务事业部 (BU)</label><select value={evoForm.bu} onChange={(e) => setEvoForm({...evoForm, bu: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner appearance-none">{buOptions.map(bu => <option key={bu} value={bu}>{bu}</option>)}</select></div>
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">看板阶段状态</label><select value={evoForm.status} onChange={(e) => setEvoForm({...evoForm, status: e.target.value as any})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold outline-none shadow-inner appearance-none">{EVOLUTION_LANES.map(lane => <option key={lane} value={lane}>{lane}</option>)}</select></div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2"><Tags size={14} className="text-indigo-500" /> 关联产线标签 (支持多选)</label>
                    <div className="flex flex-wrap gap-2 p-5 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner">
                       {productLineOptions.map(tag => (
                         <button key={tag} onClick={() => { const current = evoForm.productLines || []; const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]; setEvoForm({...evoForm, productLines: next}); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border transition-all ${evoForm.productLines?.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}><Package size={12}/> {tag}{evoForm.productLines?.includes(tag) && <Check size={12}/>}</button>
                       ))}
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between">
                       <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">核心产品迭代价值描述</label>
                       <button onClick={handleEvoAiOptimize} disabled={!evoForm.iterationValue || isEvoAiOptimizing} className="flex items-center gap-1.5 text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg hover:bg-indigo-100 transition-all disabled:opacity-50">{isEvoAiOptimizing ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12}/>} AI 优化价值点</button>
                    </div>
                    <textarea value={evoForm.iterationValue} onChange={(e) => setEvoForm({...evoForm, iterationValue: e.target.value})} placeholder="简述该需求如何转化为通用的标准产品能力..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-medium outline-none resize-none shadow-inner" />
                 </div>
              </div>
              <div className="p-10 pt-0 flex gap-4 flex-shrink-0"><button onClick={() => setIsEvoModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase rounded-3xl hover:bg-slate-200 transition-all">取消</button><button onClick={handleAddEvolutionItem} disabled={!evoForm.iterationValue} className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-3xl hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"><CheckCircle2 size={18} /> 确认并录入看板</button></div>
           </div>
        </div>
      )}

      {/* Initialization Project Modal */}
      {isInitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsInitModalOpen(false)} />
           <div className="bg-white w-full max-w-3xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
              <div className="bg-indigo-600 px-10 py-8 flex items-center justify-between text-white flex-shrink-0">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md"><Briefcase size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black tracking-tight">初始化项目主体</h3>
                       <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">创建支撑价值流的根节点</p>
                    </div>
                 </div>
                 <button onClick={() => setIsInitModalOpen(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
              </div>
              <div className="p-10 space-y-8 overflow-y-auto flex-1 scrollbar-thin">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">项目名称</label><div className="relative"><Briefcase className="absolute left-5 top-4 text-indigo-400" size={18} /><input value={initForm.name} onChange={(e) => setInitForm({...initForm, name: e.target.value})} placeholder="例如：B1 物流事业部核心链路对齐" className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300" /></div></div>
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">项目发起人 (Initiator)</label><div className="relative"><User className="absolute left-5 top-4 text-indigo-400" size={18} /><input value={initForm.initiator} onChange={(e) => setInitForm({...initForm, initiator: e.target.value})} placeholder="负责人或事业部对接人" className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all" /></div></div>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">所属事业部 (BU)</label><div className="relative"><Building2 className="absolute left-5 top-4 text-indigo-400" size={18} /><select value={initForm.bu} onChange={(e) => setInitForm({...initForm, bu: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none shadow-inner appearance-none">{buOptions.map(bu => <option key={bu} value={bu}>{bu}</option>)}</select></div></div>
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">项目状态 (Stage)</label><div className="relative"><ClipboardCheck className="absolute left-5 top-4 text-indigo-400" size={18} /><select value={initForm.stage} onChange={(e) => setInitForm({...initForm, stage: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-bold outline-none shadow-inner appearance-none">{stageOptions.map(stage => <option key={stage} value={stage}>{stage}</option>)}</select></div></div>
                    <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">预估项目价值 (万元)</label><div className="relative"><DollarSign className="absolute left-5 top-4 text-emerald-500" size={18} /><input type="number" value={initForm.estimatedValue} onChange={(e) => setInitForm({...initForm, estimatedValue: parseFloat(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-black outline-none shadow-inner" /></div></div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest flex items-center gap-2"><Tags size={14} className="text-indigo-500" /> 关联产线标签 (支持多选)</label>
                    <div className="flex flex-wrap gap-2 p-5 bg-slate-50 border border-slate-200 rounded-[2rem] shadow-inner mb-3">
                       {productLineOptions.map(tag => (<button key={tag} onClick={() => { const current = initForm.productLines || []; const next = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag]; setInitForm({...initForm, productLines: next}); }} className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border transition-all ${initForm.productLines?.includes(tag) ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-200'}`}><Package size={12}/> {tag}{initForm.productLines?.includes(tag) && <Check size={12}/>}</button>))}
                       <div className="w-full mt-4 flex gap-2"><input value={newTagInput} onChange={(e) => setNewTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addProjectTag()} placeholder="+ 新增经营产线..." className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" /><button onClick={addProjectTag} className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all"><Plus size={18}/></button></div>
                    </div>
                 </div>
                 <div className="space-y-3"><label className="text-[11px] font-bold text-slate-400 uppercase ml-1 tracking-widest">价值愿景与预期影响力</label><textarea value={initForm.valueImpact} onChange={(e) => setInitForm({...initForm, valueImpact: e.target.value})} placeholder="简述该项目支撑对 BU 的核心意义..." className="w-full h-32 bg-slate-50 border border-slate-200 rounded-[2rem] px-6 py-5 text-sm font-medium outline-none resize-none shadow-inner" /></div>
              </div>
              <div className="p-10 pt-0 flex gap-4 flex-shrink-0"><button onClick={() => setIsInitModalOpen(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase rounded-3xl hover:bg-slate-200 transition-all">取消</button><button onClick={handleInitProject} disabled={!initForm.name || !initForm.initiator} className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-3xl hover:bg-indigo-700 shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"><CheckCircle2 size={18} />确认初始化项目</button></div>
           </div>
        </div>
      )}
    </div>
  );
};

export default SupportTracking;