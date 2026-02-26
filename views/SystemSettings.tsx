
import React, { useState } from 'react';
import { 
  Settings, Plus, Trash2, ShieldCheck, Database, Zap, 
  Layers, Book, Building2, Server, ChevronRight, Workflow, Package,
  Cpu, BarChart3, Coins, Activity, X, Users
} from 'lucide-react';
import { GoalCategory, Team } from '../types';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface SystemSettingsProps {
  buOptions: string[];
  setBuOptions: (options: string[]) => void;
  stageOptions: string[];
  setStageOptions: (options: string[]) => void;
  productLineOptions: string[];
  setProductLineOptions: (options: string[]) => void;
  teams: Team[];
  setTeams: (teams: Team[]) => void;
}

const SystemSettings: React.FC<SystemSettingsProps> = ({ 
  buOptions, setBuOptions, stageOptions, setStageOptions, productLineOptions, setProductLineOptions,
  teams, setTeams
}) => {
  const [activeConfigTab, setActiveConfigTab] = useState<'dictionary' | 'ai' | 'model' | 'team'>('dictionary');
  
  // Model Management State
  const [availableModels, setAvailableModels] = useState([
    { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (默认 - 高性能/低延迟)', provider: 'Google', status: 'Active' },
    { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro (高推理/复杂逻辑)', provider: 'Google', status: 'Active' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash (稳定版)', provider: 'Google', status: 'Active' },
  ]);
  const [selectedModel, setSelectedModel] = useState('gemini-3-flash-preview');
  const [showAddModelModal, setShowAddModelModal] = useState(false);
  const [newModelForm, setNewModelForm] = useState({ name: '', id: '', provider: 'Custom' });

  const [usageData] = useState([
    { date: '02-18', tokens: 450000, cost: 0.45 },
    { date: '02-19', tokens: 520000, cost: 0.52 },
    { date: '02-20', tokens: 380000, cost: 0.38 },
    { date: '02-21', tokens: 890000, cost: 0.89 },
    { date: '02-22', tokens: 1200000, cost: 1.20 },
    { date: '02-23', tokens: 950000, cost: 0.95 },
    { date: '02-24', tokens: 1100000, cost: 1.10 },
  ]);

  const [moduleUsage] = useState([
    { name: '目标深度分析', value: 4500000, color: '#6366f1' },
    { name: '日报经验提炼', value: 3200000, color: '#f59e0b' },
    { name: '智能问答助手', value: 2800000, color: '#10b981' },
    { name: '风险自动识别', value: 1900000, color: '#f43f5e' },
  ]);

  const handleAddModel = () => {
    if (newModelForm.name && newModelForm.id) {
      setAvailableModels([...availableModels, { ...newModelForm, status: 'Active' }]);
      setShowAddModelModal(false);
      setNewModelForm({ name: '', id: '', provider: 'Custom' });
    }
  };

  // Dictionary State
  const [categories, setCategories] = useState<string[]>(Object.values(GoalCategory));
  const [newCategory, setNewCategory] = useState('');
  const [newBu, setNewBu] = useState('');
  const [newStage, setNewStage] = useState('');
  const [newProductLine, setNewProductLine] = useState('');

  // Team Management State
  const [showAddTeamModal, setShowAddTeamModal] = useState(false);
  const [newTeamForm, setNewTeamForm] = useState({ name: '', lead: '', bu: buOptions[0] || '', membersCount: 0 });

  const handleAddTeam = () => {
    if (newTeamForm.name && newTeamForm.lead) {
      const newTeam: Team = {
        id: `team-${Date.now()}`,
        ...newTeamForm
      };
      setTeams([...teams, newTeam]);
      setShowAddTeamModal(false);
      setNewTeamForm({ name: '', lead: '', bu: buOptions[0] || '', membersCount: 0 });
    }
  };

  const removeTeam = (id: string) => {
    setTeams(teams.filter(t => t.id !== id));
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory('');
    }
  };

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const addBu = () => {
    if (newBu.trim() && !buOptions.includes(newBu.trim())) {
      setBuOptions([...buOptions, newBu.trim()]);
      setNewBu('');
    }
  };

  const removeBu = (bu: string) => {
    setBuOptions(buOptions.filter(b => b !== bu));
  };

  const addStage = () => {
    if (newStage.trim() && !stageOptions.includes(newStage.trim())) {
      setStageOptions([...stageOptions, newStage.trim()]);
      setNewStage('');
    }
  };

  const removeStage = (stage: string) => {
    setStageOptions(stageOptions.filter(s => s !== stage));
  };

  const addProductLine = () => {
    if (newProductLine.trim() && !productLineOptions.includes(newProductLine.trim())) {
      setProductLineOptions([...productLineOptions, newProductLine.trim()]);
      setNewProductLine('');
    }
  };

  const removeProductLine = (line: string) => {
    setProductLineOptions(productLineOptions.filter(l => l !== line));
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 h-[calc(100vh-140px)] animate-in fade-in duration-700">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-white rounded-3xl border border-slate-100 shadow-sm p-4 flex flex-col h-full">
        <div className="p-4 mb-4">
           <div className="flex items-center gap-3 mb-1">
             <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-100">
               <Settings size={18} />
             </div>
             <h2 className="text-lg font-black text-slate-900">配置管理</h2>
           </div>
           <p className="text-[10px] text-slate-400 font-medium pl-11">系统全域参数控制台</p>
        </div>
        
        <div className="space-y-2 flex-1">
          <button 
            onClick={() => setActiveConfigTab('dictionary')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
              activeConfigTab === 'dictionary' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Book size={18} /> 字典管理
            </div>
            {activeConfigTab === 'dictionary' && <ChevronRight size={16} className="text-indigo-400" />}
          </button>
          
          <button 
            onClick={() => setActiveConfigTab('ai')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
              activeConfigTab === 'ai' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Zap size={18} /> AI 配置管理
            </div>
            {activeConfigTab === 'ai' && <ChevronRight size={16} className="text-indigo-400" />}
          </button>

          <button 
            onClick={() => setActiveConfigTab('model')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
              activeConfigTab === 'model' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Cpu size={18} /> 大模型管理
            </div>
            {activeConfigTab === 'model' && <ChevronRight size={16} className="text-indigo-400" />}
          </button>

          <button 
            onClick={() => setActiveConfigTab('team')}
            className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm font-bold transition-all ${
              activeConfigTab === 'team' 
                ? 'bg-indigo-50 text-indigo-700 shadow-sm' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users size={18} /> 小组与组长管理
            </div>
            {activeConfigTab === 'team' && <ChevronRight size={16} className="text-indigo-400" />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto pr-2">
        {activeConfigTab === 'dictionary' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
            {/* 1.1 一级业务层级 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Layers size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">1.1 一级业务层级 (Categories)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">定义目标的最高层级业务归属，用于全景地图聚合。</p>
                </div>
              </div>
              
              <div className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="输入新业务层级名称..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <button 
                  onClick={addCategory}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} /> 添加
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map(cat => (
                  <div key={cat} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-400 group-hover:bg-indigo-600 transition-colors" />
                      <span className="text-sm font-black text-slate-700">{cat}</span>
                    </div>
                    <button 
                      onClick={() => removeCategory(cat)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.2 BU 字典配置 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">1.2 BU 字典配置 (Business Units)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">管理组织支撑的事业部/部门名单。</p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newBu}
                  onChange={(e) => setNewBu(e.target.value)}
                  placeholder="输入新事业部名称..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
                <button 
                  onClick={addBu}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} /> 添加
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {buOptions.map(bu => (
                  <div key={bu} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-emerald-100 hover:shadow-sm transition-all">
                    <span className="text-sm font-black text-slate-700 pl-2">{bu}</span>
                    <button 
                      onClick={() => removeBu(bu)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.3 生命周期状态配置 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                  <Workflow size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">1.3 生命周期状态 (Life Cycle Stages)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">定义项目从 POC 到 交付的全流程节点。</p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newStage}
                  onChange={(e) => setNewStage(e.target.value)}
                  placeholder="输入新生命周期阶段..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                />
                <button 
                  onClick={addStage}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} /> 添加
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {stageOptions.map(stage => (
                  <div key={stage} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                    <span className="text-sm font-black text-slate-700 pl-2">{stage}</span>
                    <button 
                      onClick={() => removeStage(stage)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 1.4 产线管理配置 */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-50">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Package size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">1.4 产线管理 (Product Lines)</h3>
                  <p className="text-xs text-slate-400 font-bold mt-1">管理全域售卖及经营统计的产线模版。</p>
                </div>
              </div>

              <div className="flex gap-3 mb-8">
                <input 
                  type="text" 
                  value={newProductLine}
                  onChange={(e) => setNewProductLine(e.target.value)}
                  placeholder="输入新产线名称..."
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-3 text-sm font-bold outline-none focus:ring-4 focus:ring-amber-500/10 transition-all"
                />
                <button 
                  onClick={addProductLine}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-amber-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} /> 添加
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {productLineOptions.map(line => (
                  <div key={line} className="group p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:bg-white hover:border-amber-100 hover:shadow-sm transition-all">
                    <span className="text-sm font-black text-slate-700 pl-2">{line}</span>
                    <button 
                      onClick={() => removeProductLine(line)}
                      className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100 p-1.5 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'ai' && (
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-12 animate-in slide-in-from-right-4 duration-500">
             <div className="pb-6 border-b border-slate-50">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                   <Zap className="text-amber-500" size={28} /> AI 核心配置管理
                </h3>
                <p className="text-sm text-slate-500 font-medium mt-2">配置全局 AI 模型的风险敏感度、知识沉淀阈值及数据安全策略。</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Risk Strategy */}
               <section className="space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                     <ShieldCheck size={20} />
                   </div>
                   <h4 className="text-lg font-black text-slate-800">风险治理策略</h4>
                 </div>
                 
                 <div className="p-6 bg-slate-50 rounded-3xl space-y-6 border border-slate-100">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">预警灵敏度 (Sensitivity)</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-[10px] font-black">75%</span>
                      </div>
                      <input type="range" className="w-full accent-amber-500 h-2 bg-slate-200 rounded-full cursor-pointer" defaultValue={75} />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                        当语义中包含“可能”、“如果不”等模糊词汇时，触发【高风险】标记的概率阈值。
                      </p>
                    </div>

                    <div className="space-y-3 pt-4 border-t border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-widest">经验沉淀分值 (Threshold)</span>
                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[10px] font-black">85分</span>
                      </div>
                      <input type="range" className="w-full accent-indigo-500 h-2 bg-slate-200 rounded-full cursor-pointer" defaultValue={85} />
                      <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                         只有置信度高于此分值的“踩坑”或“最佳实践”才会被自动收录进组织经验库。
                      </p>
                    </div>
                 </div>
               </section>

               {/* Data Safety */}
               <section className="space-y-6">
                 <div className="flex items-center gap-3 mb-4">
                   <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                     <Server size={20} />
                   </div>
                   <h4 className="text-lg font-black text-slate-800">数据与安全配置</h4>
                 </div>

                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl hover:border-emerald-200 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <Database size={20} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                         <div>
                            <div className="text-sm font-black text-slate-900">每日全量冷备份</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">上次备份: 02:00 AM</div>
                         </div>
                      </div>
                      <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>

                   <div className="flex items-center justify-between p-5 bg-white border border-slate-200 rounded-3xl hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                         <ShieldCheck size={20} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                         <div>
                            <div className="text-sm font-black text-slate-900">敏感信息 DLP 脱敏</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">过滤规则: 薪资, 手机号</div>
                         </div>
                      </div>
                      <div className="w-12 h-6 bg-indigo-500 rounded-full relative shadow-inner">
                         <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                      </div>
                   </div>
                 </div>
               </section>
             </div>
          </div>
        )}

        {activeConfigTab === 'model' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
            {/* Model Selection & Status */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Cpu size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">全局大模型配置</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">管理系统核心 AI 引擎及其运行状态。</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setShowAddModelModal(true)}
                    className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg flex items-center gap-2"
                  >
                    <Plus size={14} /> 添加新模型
                  </button>
                  <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
                    <Activity size={14} className="animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest">服务运行中</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">当前活跃模型</label>
                    <select 
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                    >
                      {availableModels.map(model => (
                        <option key={model.id} value={model.id}>{model.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                      <Zap size={16} />
                      <span className="text-xs font-black uppercase tracking-widest">模型特性</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-3 rounded-xl border border-indigo-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">上下文窗口</p>
                        <p className="text-sm font-black text-slate-900">1M Tokens</p>
                      </div>
                      <div className="bg-white p-3 rounded-xl border border-indigo-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">推理速度</p>
                        <p className="text-sm font-black text-slate-900">~80 t/s</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 opacity-10 group-hover:rotate-12 transition-transform duration-700">
                    <Coins size={160} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">本月预估费用 (USD)</p>
                      <h4 className="text-5xl font-black tracking-tighter">$142.85</h4>
                    </div>
                    <div className="space-y-4 pt-6 border-t border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">累计 Token 消耗</span>
                        <span className="text-sm font-black">12.4M</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400">平均费用 / 1M Tokens</span>
                        <span className="text-sm font-black text-emerald-400">$0.012</span>
                      </div>
                    </div>
                    <button className="w-full py-3 bg-white text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl">
                      查看计费详情
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Usage Monitoring Chart & Module Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <BarChart3 size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Token 消耗趋势</h3>
                      <p className="text-xs text-slate-400 font-bold mt-1">实时监控全域 AI 调用的流量分布。</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-[10px] font-black uppercase">7天</button>
                    <button className="px-4 py-2 bg-white border border-slate-200 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-50">30天</button>
                  </div>
                </div>

                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={usageData}>
                      <defs>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fontWeight: 900, fill: '#94a3b8'}}
                        tickFormatter={(val) => `${(val / 1000000).toFixed(1)}M`}
                      />
                      <Tooltip 
                        contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: 'bold'}}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="tokens" 
                        stroke="#6366f1" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorTokens)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Layers size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">功能模块消耗</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">按业务场景拆分 Token 投入。</p>
                  </div>
                </div>

                <div className="flex-1 space-y-6">
                  {moduleUsage.map((module) => (
                    <div key={module.name} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-black text-slate-700">{module.name}</span>
                        <span className="text-[10px] font-black text-slate-400">{(module.value / 1000000).toFixed(1)}M Tokens</span>
                      </div>
                      <div className="w-full h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ 
                            width: `${(module.value / moduleUsage.reduce((acc, m) => acc + m.value, 0)) * 100}%`,
                            backgroundColor: module.color 
                          }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic text-center">
                    提示：目标深度分析模块消耗最高，建议优化 Prompt 长度或增加缓存策略。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeConfigTab === 'team' && (
          <div className="space-y-8 animate-in slide-in-from-right-4 duration-500 pb-20">
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900">小组与组长配置管理</h3>
                    <p className="text-xs text-slate-400 font-bold mt-1">管理组织架构中的执行小组及其负责人。</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddTeamModal(true)}
                  className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg"
                >
                  <Plus size={18} /> 新增小组
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {teams.map(team => (
                  <div key={team.id} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
                      <Users size={60} />
                    </div>
                    <div className="relative z-10 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-widest">{team.bu}</span>
                        <button 
                          onClick={() => removeTeam(team.id)}
                          className="text-slate-300 hover:text-rose-500 transition-colors p-1.5 hover:bg-rose-50 rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-lg font-black text-slate-900">{team.name}</h4>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden">
                            <img src={`https://picsum.photos/seed/${team.lead}/32/32`} alt={team.lead} referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">小组长</p>
                            <p className="text-sm font-black text-slate-700">{team.lead}</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Users size={14} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">{team.membersCount} 位成员</span>
                        </div>
                        <button className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">编辑详情</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Team Modal */}
        {showAddTeamModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowAddTeamModal(false)} />
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Users size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">新增执行小组</h3>
                </div>
                <button onClick={() => setShowAddTeamModal(false)} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">小组名称</label>
                  <input 
                    type="text" 
                    value={newTeamForm.name}
                    onChange={(e) => setNewTeamForm({...newTeamForm, name: e.target.value})}
                    placeholder="例如: 商业化小组, 算法优化组..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">小组长姓名</label>
                  <input 
                    type="text" 
                    value={newTeamForm.lead}
                    onChange={(e) => setNewTeamForm({...newTeamForm, lead: e.target.value})}
                    placeholder="例如: Sarah, Jerry..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">所属事业部 (BU)</label>
                  <select 
                    value={newTeamForm.bu}
                    onChange={(e) => setNewTeamForm({...newTeamForm, bu: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    {buOptions.map(bu => (
                      <option key={bu} value={bu}>{bu}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">初始成员数量</label>
                  <input 
                    type="number" 
                    value={newTeamForm.membersCount}
                    onChange={(e) => setNewTeamForm({...newTeamForm, membersCount: parseInt(e.target.value) || 0})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setShowAddTeamModal(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase rounded-2xl hover:bg-slate-100"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddTeam}
                  disabled={!newTeamForm.name || !newTeamForm.lead}
                  className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl disabled:opacity-50"
                >
                  确认创建小组
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Model Modal */}
        {showAddModelModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowAddModelModal(false)} />
            <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Plus size={24} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">添加自定义模型</h3>
                </div>
                <button onClick={() => setShowAddModelModal(false)} className="text-slate-400 hover:text-slate-600 p-2 transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">模型显示名称</label>
                  <input 
                    type="text" 
                    value={newModelForm.name}
                    onChange={(e) => setNewModelForm({...newModelForm, name: e.target.value})}
                    placeholder="例如: GPT-4o, Claude 3.5..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">模型 ID / API 标识符</label>
                  <input 
                    type="text" 
                    value={newModelForm.id}
                    onChange={(e) => setNewModelForm({...newModelForm, id: e.target.value})}
                    placeholder="例如: gpt-4o-2024-05-13..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">服务提供商</label>
                  <select 
                    value={newModelForm.provider}
                    onChange={(e) => setNewModelForm({...newModelForm, provider: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
                  >
                    <option value="Google">Google Gemini</option>
                    <option value="OpenAI">OpenAI</option>
                    <option value="Anthropic">Anthropic</option>
                    <option value="Custom">自定义 / 中转</option>
                  </select>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setShowAddModelModal(false)}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase rounded-2xl hover:bg-slate-100"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddModel}
                  disabled={!newModelForm.name || !newModelForm.id}
                  className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl disabled:opacity-50"
                >
                  确认添加模型
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SystemSettings;
