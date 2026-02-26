
import React from 'react';
import { X, TrendingUp, TrendingDown, ArrowRight, Zap, ShieldCheck, Target, Activity } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface StatDetailModalProps {
  stat: { label: string; value: string; icon: any; color: string };
  onClose: () => void;
}

const MOCK_TREND_DATA = [
  { name: 'W1', value: 30 },
  { name: 'W2', value: 45 },
  { name: 'W3', value: 38 },
  { name: 'W4', value: 52 },
  { name: 'W5', value: 65 },
  { name: 'W6', value: 58 },
  { name: 'W7', value: 72 },
];

const StatDetailModal: React.FC<StatDetailModalProps> = ({ stat, onClose }) => {
  const Icon = stat.icon;
  
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              stat.color === 'indigo' ? 'bg-indigo-600 shadow-indigo-200' : 
              stat.color === 'emerald' ? 'bg-emerald-600 shadow-emerald-200' : 
              stat.color === 'rose' ? 'bg-rose-600 shadow-rose-200' : 'bg-amber-600 shadow-amber-200'
            } text-white`}>
              <Icon size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{stat.label} <span className="text-slate-400 font-medium text-sm ml-2">深度指标分析</span></h2>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-widest">数据更新于: 2026-05-20 14:30</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] bg-slate-50/50">
          {/* Main Value & Trend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">当前数值</p>
              <div className="flex items-end gap-3">
                <span className="text-4xl font-black text-slate-900">{stat.value}</span>
                <div className="flex items-center gap-1 text-emerald-500 font-bold text-xs mb-1.5">
                  <TrendingUp size={14} />
                  <span>+12.5%</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">同环比状态</p>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400">同比</span>
                  <span className="text-sm font-black text-emerald-600">+8.2%</span>
                </div>
                <div className="w-px h-8 bg-slate-100" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400">环比</span>
                  <span className="text-sm font-black text-rose-600">-2.1%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" /> 近 7 周趋势变化
              </h3>
            </div>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_TREND_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                  <YAxis hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    labelStyle={{ fontWeight: 900, color: '#1e293b' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-indigo-600 p-6 rounded-3xl text-white shadow-lg shadow-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-white pointer-events-none"><Zap size={100} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Zap size={16} />
                <span className="text-xs font-black uppercase tracking-widest">GIA 智能洞察</span>
              </div>
              <p className="text-xs font-medium leading-relaxed opacity-90">
                当前指标“{stat.label}”处于稳健增长区间。系统预测在接下来的 2 个周期内，受“自动化演进”专项推进的影响，该指标有望进一步提升 15%-20%。建议保持当前的资源投入力度。
              </p>
            </div>
          </div>

          {/* Action Items */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <Target size={18} className="text-indigo-600" /> 关联优化建议
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {[
                '优化底层数据索引结构，提升查询效率',
                '加强与 BU 侧的需求对齐，确保价值闭环',
                '引入 AI 自动化质检流程，降低人工干预成本'
              ].map((text, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-indigo-100 transition-all group cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
                    <span className="text-xs font-bold text-slate-700">{text}</span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-600 transition-all" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-slate-900 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
          >
            完成查看
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatDetailModal;
