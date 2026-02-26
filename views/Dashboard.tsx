
import React, { useState } from 'react';
import { UserRoleType, GoalStatus, Goal } from '../types';
import GoalDeepReportModal from '../components/GoalDeepReportModal';
import StatDetailModal from '../components/StatDetailModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, LineChart, Line } from 'recharts';
import { AlertCircle, CheckCircle, TrendingUp, Users, Target, Zap, ShieldAlert, PieChart as PieIcon, DollarSign, ArrowRight, UserCircle, BookOpen, X, Archive, Download, Loader2, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface DashboardProps {
  role: UserRoleType;
  goals: Goal[];
  activeCycle: string;
}

const Dashboard: React.FC<DashboardProps> = ({ role, goals, activeCycle }) => {
  const [selectedGoalForReport, setSelectedGoalForReport] = useState<Goal | null>(null);
  const [selectedStat, setSelectedStat] = useState<{ label: string; value: string; icon: any; color: string } | null>(null);
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<any>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosisProgress, setDiagnosisProgress] = useState(0);
  const [diagnosisStep, setDiagnosisStep] = useState('');
  const [selectedHistoryCycle, setSelectedHistoryCycle] = useState('2025 H2');

  const getStatusColor = (status: GoalStatus) => {
    switch (status) {
      case GoalStatus.STABLE: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case GoalStatus.DEVIATED: return 'text-amber-600 bg-amber-50 border-amber-100';
      case GoalStatus.HIGH_RISK: return 'text-rose-600 bg-rose-50 border-rose-100';
    }
  };

  const renderStats = () => {
    const statsConfig = {
      [UserRoleType.EMPLOYEE]: [
        { label: '执行中目标', value: goals.filter(g => g.type === '个人').length.toString(), icon: Target, color: 'indigo' },
        { label: '地址匹配率', value: '92%', icon: CheckCircle, color: 'emerald' },
        { label: '避坑预警', value: '1项', icon: ShieldAlert, color: 'rose' },
        { label: '执行效率', value: '96%', icon: TrendingUp, color: 'emerald' },
      ],
      [UserRoleType.TEAM_LEAD]: [
        { label: '小组目标', value: goals.filter(g => g.type !== '部门').length.toString(), icon: Target, color: 'indigo' },
        { label: '覆盖进度', value: '79%', icon: PieIcon, color: 'emerald' },
        { label: '风险信号', value: '2条', icon: AlertCircle, color: 'rose' },
        { label: '商业化推进', value: '25%', icon: Zap, color: 'amber' },
      ],
      [UserRoleType.DEPT_HEAD]: [
        { label: '战略主线', value: goals.filter(g => g.type === '部门').length.toString(), icon: Target, color: 'indigo' },
        { label: '预估年收', value: '¥1250w', icon: DollarSign, color: 'emerald' },
        { label: 'BU 支撑数', value: '4家', icon: Users, color: 'amber' },
        { label: '系统演进', value: '40%', icon: TrendingUp, color: 'indigo' },
      ],
      [UserRoleType.SUPER_ADMIN]: [
        { label: '战略主线', value: goals.filter(g => g.type === '部门').length.toString(), icon: Target, color: 'indigo' },
        { label: '预估年收', value: '¥1250w', icon: DollarSign, color: 'emerald' },
        { label: 'BU 支撑数', value: '4家', icon: Users, color: 'amber' },
        { label: '系统演进', value: '40%', icon: TrendingUp, color: 'indigo' },
      ]
    };

    return statsConfig[role].map((stat) => (
      <div 
        key={stat.label} 
        onClick={() => setSelectedStat(stat)}
        className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100/60 hover:shadow-xl hover:border-indigo-100 transition-all duration-500 group relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform duration-700 pointer-events-none">
          <stat.icon size={80} />
        </div>
        <div className="flex flex-col gap-6 relative z-10">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
            stat.color === 'indigo' ? 'bg-indigo-50 text-indigo-600' : 
            stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 
            stat.color === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'
          }`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
          </div>
        </div>
      </div>
    ));
  };

  const handleHistoryArchive = () => {
    setShowHistoryModal(true);
  };

  const handleIntelligentDiagnosis = () => {
    setShowDiagnosisModal(true);
    setIsDiagnosing(true);
    setDiagnosisProgress(0);
    setDiagnosisStep('初始化诊断引擎...');

    // Simulate diagnosis process
    setTimeout(() => { setDiagnosisProgress(20); setDiagnosisStep('检查目标对齐率...'); }, 800);
    setTimeout(() => { setDiagnosisProgress(45); setDiagnosisStep('分析风险因子...'); }, 1600);
    setTimeout(() => { setDiagnosisProgress(70); setDiagnosisStep('评估资源投入产出比...'); }, 2400);
    setTimeout(() => { setDiagnosisProgress(90); setDiagnosisStep('预测达成概率...'); }, 3200);
    setTimeout(() => { 
      setDiagnosisProgress(100); 
      setDiagnosisStep('诊断完成');
      setTimeout(() => setIsDiagnosing(false), 500);
    }, 4000);
  };

  const handleExportReport = () => {
    alert('报表生成中...\n已成功导出：2026_Q2_战略执行周报.pdf');
  };

  const handleFullReport = () => {
    alert('正在生成深度诊断报告...\n包含：\n- 组织效能分析\n- 关键路径瓶颈识别\n- 资源投入产出比\n报告已准备就绪。');
  };

  const calculateKPI = (goal: Goal) => {
    const importanceWeights = { 'P0': 1.5, 'P1': 1.2, 'P2': 1.0 };
    const levelWeights = { '部门': 1.5, '小组': 1.2, '个人': 1.0 };
    
    const impWeight = importanceWeights[goal.importance] || 1.0;
    const levelWeight = levelWeights[goal.type] || 1.0;
    const diffCoeff = goal.difficulty || 1.0;
    
    // Completion degree (progress)
    const score = (goal.progress / 100) * impWeight * diffCoeff * levelWeight * 100;
    return Math.round(score);
  };

  const getLeaderboardData = () => {
    const userStats: Record<string, { name: string; kpi: number; experience: number; aiLearning: number; avatar: string; goals: number }> = {};
    
    // Base data for users (to keep avatars and other metrics)
    const baseUsers = [
      { name: 'Alex', experience: 12, aiLearning: 95, avatar: 'https://picsum.photos/seed/1/32/32' },
      { name: 'Sarah', experience: 8, aiLearning: 88, avatar: 'https://picsum.photos/seed/2/32/32' },
      { name: 'Jerry', experience: 15, aiLearning: 72, avatar: 'https://picsum.photos/seed/3/32/32' },
      { name: 'Linda', experience: 5, aiLearning: 98, avatar: 'https://picsum.photos/seed/4/32/32' },
      { name: 'Kevin', experience: 9, aiLearning: 82, avatar: 'https://picsum.photos/seed/5/32/32' },
      { name: 'Eric', experience: 20, aiLearning: 90, avatar: 'https://picsum.photos/seed/6/32/32' },
    ];

    baseUsers.forEach(u => {
      userStats[u.name] = { ...u, kpi: 0, goals: 0 };
    });

    goals.forEach(goal => {
      const owners = [goal.owner, ...(goal.members || [])];
      const uniqueOwners = Array.from(new Set(owners));
      
      uniqueOwners.forEach(ownerName => {
        // Simple name matching for mock data
        const name = ownerName.split(' ')[0]; 
        if (userStats[name]) {
          userStats[name].kpi += calculateKPI(goal);
          userStats[name].goals += 1;
        }
      });
    });

    return Object.values(userStats).map(u => ({
      ...u,
      kpi: u.goals > 0 ? Math.round(u.kpi / u.goals) : 0
    }));
  };

  const LEADERBOARD_DATA = getLeaderboardData();

  const [sortBy, setSortBy] = useState<'kpi' | 'experience' | 'aiLearning'>('kpi');

  const sortedLeaderboard = [...LEADERBOARD_DATA].sort((a, b) => {
    if (sortBy === 'kpi') return b.kpi - a.kpi;
    if (sortBy === 'experience') return b.experience - a.experience;
    return b.aiLearning - a.aiLearning;
  });

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700 pb-12">
      {selectedGoalForReport && (
        <GoalDeepReportModal 
          goal={selectedGoalForReport} 
          onClose={() => setSelectedGoalForReport(null)} 
        />
      )}
      {selectedStat && (
        <StatDetailModal 
          stat={selectedStat} 
          onClose={() => setSelectedStat(null)} 
        />
      )}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100 text-white">
            <PieIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              当前执行周期: <span className="text-indigo-600">{activeCycle}</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              数据最后更新: 2026-05-20 14:30
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleHistoryArchive}
            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-all shadow-sm"
          >
            历史存档
          </button>
          <button 
            onClick={handleIntelligentDiagnosis}
            className="px-6 py-3 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
          >
            <Zap size={14} /> 智能诊断
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {renderStats()}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {role === UserRoleType.DEPT_HEAD || role === UserRoleType.SUPER_ADMIN ? (
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100/60 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">团队沉淀与进化排行榜</h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">排序依据:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-[10px] font-black text-indigo-600 bg-indigo-50 border-none rounded-lg px-2 py-1 outline-none cursor-pointer"
                >
                  <option value="kpi">综合 KPI 评分</option>
                  <option value="experience">经验分享</option>
                  <option value="aiLearning">AI 学习</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-4">
              {sortedLeaderboard.map((user, idx) => (
                <div 
                  key={user.name} 
                  onClick={() => setSelectedUserForDetails(user)}
                  className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-8 text-sm font-black text-slate-300 italic group-hover:text-indigo-600 transition-colors">0{idx + 1}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-white shadow-sm">
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{user.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">基础产品部</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-12">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">综合 KPI 评分</span>
                      <div className="flex items-center gap-2">
                        <Target size={14} className="text-indigo-600" />
                        <span className="text-sm font-black text-slate-900">{user.kpi} <span className="text-[10px] text-slate-400">分</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">经验贡献</span>
                      <div className="flex items-center gap-2">
                        <BookOpen size={14} className="text-indigo-500" />
                        <span className="text-sm font-black text-slate-900">{user.experience} <span className="text-[10px] text-slate-400">项</span></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">AI 学习力</span>
                      <div className="flex items-center gap-2">
                        <Zap size={14} className="text-amber-500" />
                        <span className="text-sm font-black text-slate-900">{user.aiLearning} <span className="text-[10px] text-slate-400">分</span></span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-all cursor-pointer">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-2 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100/60 flex flex-col">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
                  {role === UserRoleType.EMPLOYEE ? '我的目标产出详情' : role === UserRoleType.TEAM_LEAD ? `核心产出线进度 (${activeCycle})` : '部门战略达成分布'}
                </h3>
              </div>
              <button 
                onClick={handleExportReport}
                className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-4 py-2 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all"
              >
                导出报表
              </button>
            </div>
            <div className="flex-1 min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={goals.filter(g => role === UserRoleType.EMPLOYEE ? g.type === '个人' : g.type === '小组')}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="progress" radius={[8, 8, 0, 0]} barSize={40}>
                    {goals.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.status === GoalStatus.STABLE ? '#10b981' : entry.status === GoalStatus.DEVIATED ? '#f59e0b' : '#f43f5e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100/60 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-1.5 h-6 bg-amber-500 rounded-full" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">
              AI 战略洞察
            </h3>
          </div>
          <div className="space-y-6 flex-1">
            {role === UserRoleType.EMPLOYEE && (
              <>
                <div className="p-6 rounded-3xl bg-amber-50/50 border border-amber-100 relative overflow-hidden group hover:bg-amber-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-amber-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><ShieldAlert size={40} /></div>
                  <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-3">避坑推荐</p>
                  <p className="text-xs text-amber-900 font-bold leading-relaxed">正在处理“口语化搜索”，请参考 e-1 号经验，引入时空知识图谱强化语义对齐。</p>
                </div>
                <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden group hover:bg-indigo-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-indigo-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><Zap size={40} /></div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">行动建议</p>
                  <p className="text-xs text-indigo-900 font-bold leading-relaxed">建议优先处理台湾地图 Q2 发布所需的合规准入测试。</p>
                </div>
              </>
            )}
            {role === UserRoleType.TEAM_LEAD && (
              <>
                <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 relative overflow-hidden group hover:bg-rose-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-rose-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><AlertCircle size={40} /></div>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3">风险拦截: 商业化小组</p>
                  <p className="text-xs text-rose-900 font-bold leading-relaxed">企服商业化变现目标目前进度严重滞后（15%），核心在于 API 订阅增长乏力。</p>
                </div>
                <div className="p-6 rounded-3xl bg-emerald-50/50 border border-emerald-100 relative overflow-hidden group hover:bg-emerald-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-emerald-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><CheckCircle size={40} /></div>
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3">价值导向</p>
                  <p className="text-xs text-emerald-900 font-bold leading-relaxed">物流专题大数据（g-bigdata-1）已成功在 B1 事业部落地，价值闭环显著。</p>
                </div>
              </>
            )}
            {(role === UserRoleType.DEPT_HEAD || role === UserRoleType.SUPER_ADMIN) && (
              <>
                <div className="p-6 rounded-3xl bg-indigo-50/50 border border-indigo-100 relative overflow-hidden group hover:bg-indigo-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-indigo-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><Target size={40} /></div>
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">战略对齐率</p>
                  <p className="text-xs text-indigo-900 font-bold leading-relaxed">“物流地图”与“企服商业化”两大主线已形成双向闭环，整体达成预测率 85%。</p>
                </div>
                <div className="p-6 rounded-3xl bg-rose-50/50 border border-rose-100 relative overflow-hidden group hover:bg-rose-50 transition-all">
                  <div className="absolute top-0 right-0 p-4 opacity-[0.05] text-rose-900 pointer-events-none group-hover:scale-110 transition-transform duration-500"><ShieldAlert size={40} /></div>
                  <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mb-3">商业化预警</p>
                  <p className="text-xs text-rose-900 font-bold leading-relaxed">H2 阶段需重点关注“企服商业化”收入，目前距 Q4 预定 1250w 目标仍有较大缺口。</p>
                </div>
              </>
            )}
          </div>
          <button 
            onClick={handleFullReport}
            className="mt-8 w-full py-4 bg-slate-50 text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-100 transition-all border border-slate-100"
          >
            查看完整诊断报告
          </button>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100/60 overflow-hidden">
        <div className="p-10 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-indigo-600 rounded-full" />
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.15em]">2026 年度 {activeCycle} 战略执行明细</h3>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400 overflow-hidden">
                  <img src={`https://picsum.photos/seed/${i}/32/32`} alt="avatar" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-50 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                +12
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          {goals.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
                  <th className="px-10 py-6">目标分层 / 负责人</th>
                  <th className="px-10 py-6">当前进度</th>
                  <th className="px-10 py-6">状态</th>
                  <th className="px-10 py-6 text-right">战略对齐权重</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {goals
                  .filter(g => {
                    if (role === UserRoleType.EMPLOYEE) return g.type === '个人' || g.id === 'goal-map-1';
                    if (role === UserRoleType.TEAM_LEAD) return g.type !== '部门';
                    return true;
                  })
                  .map((goal) => (
                  <tr key={goal.id} className="hover:bg-slate-50/50 transition-all duration-300 group">
                    <td className="px-10 py-8">
                      <div className="font-black text-slate-900 tracking-tight text-base mb-1.5">{goal.name}</div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 uppercase tracking-widest">{goal.type}层级</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <UserCircle size={12} className="text-slate-300" /> {goal.owner}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-4">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden w-32 shadow-inner">
                          <div className={`h-full rounded-full transition-all duration-1000 ${
                            goal.status === GoalStatus.STABLE ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]' : 
                            goal.status === GoalStatus.DEVIATED ? 'bg-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.3)]' : 
                            'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                          }`} style={{ width: `${goal.progress}%` }} />
                        </div>
                        <span className="text-xs font-black text-slate-700 w-8">{goal.progress}%</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest ${getStatusColor(goal.status)}`}>
                        {goal.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center justify-end gap-6">
                        <span className="text-sm text-slate-900 font-black tracking-tight">
                          {goal.weight * 100}%
                        </span>
                        <button 
                          onClick={() => setSelectedGoalForReport(goal)}
                          className="w-10 h-10 flex items-center justify-center text-indigo-600 bg-indigo-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-indigo-600 hover:text-white shadow-sm"
                          title="查看深度诊断报告"
                        >
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-24 text-center text-slate-400 flex flex-col items-center gap-4">
              <Target size={48} className="opacity-10" />
              <p className="text-sm font-black uppercase tracking-widest opacity-40">当前周期 ({activeCycle}) 下暂无目标数据</p>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedUserForDetails(null)} />
          <div className="bg-white w-full max-w-3xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button 
                onClick={() => setSelectedUserForDetails(null)}
                className="absolute top-6 right-6 w-8 h-8 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="px-8 pb-8">
              <div className="relative -mt-16 mb-6 flex justify-between items-end">
                <div className="w-32 h-32 rounded-3xl bg-white p-2 shadow-xl">
                  <div className="w-full h-full rounded-2xl bg-slate-100 flex items-center justify-center overflow-hidden">
                    <img 
                      src={selectedUserForDetails.avatar} 
                      alt={selectedUserForDetails.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                    总体评分明细
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {selectedUserForDetails.name}
                  </h2>
                  <p className="text-sm font-bold text-slate-400 mt-1">
                    基础产品部
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 py-6 border-y border-slate-100">
                  <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Target size={16} className="text-indigo-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">综合 KPI 评分</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{selectedUserForDetails.kpi} <span className="text-xs text-slate-400 font-bold">分</span></div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">目标完成度</span>
                        <span className="text-emerald-600">+{(selectedUserForDetails.kpi * 0.6).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">难度系数加成</span>
                        <span className="text-indigo-600">+{(selectedUserForDetails.kpi * 0.3).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">重要性加成</span>
                        <span className="text-amber-600">+{(selectedUserForDetails.kpi * 0.1).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-emerald-50/50 rounded-2xl p-4 border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen size={16} className="text-emerald-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">经验贡献</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{selectedUserForDetails.experience} <span className="text-xs text-slate-400 font-bold">项</span></div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">最佳实践</span>
                        <span className="text-emerald-600">{Math.floor(selectedUserForDetails.experience * 0.4)} 篇</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">避坑指南</span>
                        <span className="text-indigo-600">{Math.floor(selectedUserForDetails.experience * 0.3)} 篇</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">复盘报告</span>
                        <span className="text-amber-600">{selectedUserForDetails.experience - Math.floor(selectedUserForDetails.experience * 0.4) - Math.floor(selectedUserForDetails.experience * 0.3)} 篇</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={16} className="text-amber-600" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">AI 学习力</span>
                    </div>
                    <div className="text-2xl font-black text-slate-900">{selectedUserForDetails.aiLearning} <span className="text-xs text-slate-400 font-bold">分</span></div>
                    <div className="mt-3 space-y-2">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">AI 工具使用频次</span>
                        <span className="text-emerald-600">+{(selectedUserForDetails.aiLearning * 0.5).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">资讯推荐次数</span>
                        <span className="text-indigo-600">+{(selectedUserForDetails.aiLearning * 0.3).toFixed(1)}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-500">模型训练贡献</span>
                        <span className="text-amber-600">+{(selectedUserForDetails.aiLearning * 0.2).toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 mb-1">综合进化指数</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">基于 KPI、经验分享与 AI 学习力的加权计算</p>
                  </div>
                  <div className="text-3xl font-black text-indigo-600">
                    {Math.round(selectedUserForDetails.kpi * 0.5 + selectedUserForDetails.experience * 2 + selectedUserForDetails.aiLearning * 0.3)}
                    <span className="text-sm text-slate-400 ml-1">分</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Archive Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowHistoryModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20 flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Archive size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">历史存档</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">云端数据调取与分析</p>
                </div>
              </div>
              <button 
                onClick={() => setShowHistoryModal(false)}
                className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 bg-slate-50/50">
              <div className="flex gap-6 mb-8">
                <div className="w-48 shrink-0 space-y-2">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 px-3">选择周期</h3>
                  {['2025 H2', '2025 H1', '2024 H2', '2024 H1'].map(cycle => (
                    <button
                      key={cycle}
                      onClick={() => setSelectedHistoryCycle(cycle)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                        selectedHistoryCycle === cycle 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' 
                          : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
                      }`}
                    >
                      {cycle} 周期
                    </button>
                  ))}
                </div>
                
                <div className="flex-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900">{selectedHistoryCycle} 执行总结</h3>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-emerald-100">
                      已归档
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">目标达成率</p>
                      <p className="text-2xl font-black text-slate-900">94.2<span className="text-sm text-slate-400 ml-1">%</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">核心产出</p>
                      <p className="text-2xl font-black text-slate-900">12<span className="text-sm text-slate-400 ml-1">项</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">团队健康度</p>
                      <p className="text-2xl font-black text-slate-900">A<span className="text-sm text-slate-400 ml-1">级</span></p>
                    </div>
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">沉淀经验</p>
                      <p className="text-2xl font-black text-slate-900">45<span className="text-sm text-slate-400 ml-1">篇</span></p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">关键里程碑</h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-bold text-slate-600">完成核心系统架构升级，系统性能提升 300%</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-bold text-slate-600">成功支撑 4 个 S 级业务线，营收贡献达预期 120%</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <p className="text-sm font-bold text-slate-600">团队规模扩张至 50 人，建立完善的培训体系</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0">
              <button 
                onClick={() => {
                  alert(`正在下载 ${selectedHistoryCycle} 完整归档报告...`);
                }}
                className="px-6 py-3 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
              >
                <Download size={16} /> 下载完整报告
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Intelligent Diagnosis Modal */}
      {showDiagnosisModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => !isDiagnosing && setShowDiagnosisModal(false)} />
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Zap size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900">智能诊断</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">GIA 全量数据扫描与分析</p>
                </div>
              </div>
              {!isDiagnosing && (
                <button 
                  onClick={() => setShowDiagnosisModal(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 hover:text-slate-600 transition-all"
                >
                  <X size={20} />
                </button>
              )}
            </div>
            
            <div className="p-8 bg-slate-50/50 min-h-[400px]">
              {isDiagnosing ? (
                <div className="h-full flex flex-col items-center justify-center space-y-8 py-12">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full border-4 border-slate-100 flex items-center justify-center">
                      <Loader2 size={40} className="text-indigo-600 animate-spin" />
                    </div>
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" style={{ animationDuration: '2s' }} />
                  </div>
                  
                  <div className="text-center space-y-4 w-full max-w-md">
                    <h3 className="text-lg font-black text-slate-900">{diagnosisStep}</h3>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
                        style={{ width: `${diagnosisProgress}%` }}
                      />
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{diagnosisProgress}% 完成</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-start gap-5">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                      <CheckCircle2 size={20} />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 mb-2">整体执行状态稳健</h3>
                      <p className="text-sm font-bold text-slate-600 leading-relaxed">
                        当前周期目标对齐率达到 95%，核心战略主线推进正常。团队健康度保持在较高水平，未发现系统性风险。
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Target size={18} className="text-indigo-600" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">达成概率预测</h4>
                      </div>
                      <div className="text-3xl font-black text-slate-900 mb-2">88<span className="text-sm text-slate-400 ml-1">%</span></div>
                      <p className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md inline-block">较上周提升 2%</p>
                    </div>
                    
                    <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
                      <div className="flex items-center gap-3 mb-4">
                        <Users size={18} className="text-indigo-600" />
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">组织效能</h4>
                      </div>
                      <div className="text-3xl font-black text-slate-900 mb-2">A-</div>
                      <p className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md inline-block">协作效率优于 85% 团队</p>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-3xl p-6 border border-amber-100">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertTriangle size={18} className="text-amber-600" />
                      <h4 className="text-sm font-black text-amber-900">GIA 智能建议</h4>
                    </div>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2 text-sm font-bold text-amber-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>建议重点关注“商业化”主线，当前进度略低于预期，存在资源瓶颈。</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm font-bold text-amber-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>“基础架构升级”项目存在延期风险，建议提前介入评估技术难点。</span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
            
            {!isDiagnosing && (
              <div className="p-6 border-t border-slate-100 bg-white flex justify-end shrink-0 gap-3">
                <button 
                  onClick={() => setShowDiagnosisModal(false)}
                  className="px-6 py-3 bg-slate-50 text-slate-600 font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-slate-100 transition-all"
                >
                  关闭
                </button>
                <button 
                  onClick={() => {
                    alert('正在生成深度诊断报告 PDF...');
                  }}
                  className="px-6 py-3 bg-indigo-600 text-white font-black text-[11px] uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                >
                  <FileText size={16} /> 导出完整报告
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
