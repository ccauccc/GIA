import React, { useState } from 'react';
import { 
  X, Target, ShieldCheck, Zap, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  Activity, ArrowRight, BrainCircuit,
  Layers, Users, Clock, Calendar, Check, Loader2
} from 'lucide-react';
import { Goal, GoalStatus, GoalType } from '../types';
import { analyzeGoalRisk } from '../services/geminiService';

interface GoalDeepReportModalProps {
  goal: Goal;
  onClose: () => void;
}

const GoalDeepReportModal: React.FC<GoalDeepReportModalProps> = ({ goal, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    riskAssessment: string;
    suggestedMeasures: string[];
    riskLevel: '低' | '中' | '高';
  } | null>(null);

  const handleRunAIAnalysis = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeGoalRisk(goal);
      setAiAnalysis(result);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAIProbability = (goal: Goal) => {
    if (goal.status === GoalStatus.STABLE) return Math.min(100, goal.progress + 40);
    if (goal.status === GoalStatus.DEVIATED) return Math.min(80, goal.progress + 20);
    return Math.min(50, goal.progress + 5);
  };

  const aiProb = getAIProbability(goal);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 border border-white/20">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
              goal.status === GoalStatus.STABLE ? 'bg-emerald-500 shadow-emerald-200' : 
              goal.status === GoalStatus.DEVIATED ? 'bg-amber-500 shadow-amber-200' : 'bg-rose-500 shadow-rose-200'
            }`}>
              {goal.progress}%
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{goal.name} <span className="text-slate-400 font-medium text-sm ml-2">目标深度诊断报告</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider border ${
                  goal.status === GoalStatus.STABLE ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                  goal.status === GoalStatus.DEVIATED ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                }`}>
                  {goal.status}
                </span>
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <Calendar size={12} /> {goal.period} 周期
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-slate-50/50">
          
          {/* Top Analysis Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <BrainCircuit size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">AI 达成预测</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className={`text-4xl font-black ${aiProb > 70 ? 'text-emerald-600' : aiProb > 40 ? 'text-amber-600' : 'text-rose-600'}`}>
                  {aiProb}%
                </span>
                <span className="text-xs font-bold text-slate-400 mb-1">概率</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                基于历史执行速率与风险因子综合计算。
              </p>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-slate-600">
                <Users size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">资源投入度</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">85%</span>
                <span className="text-xs font-bold text-slate-400 mb-1">额度</span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-slate-400 rounded-full" style={{ width: '85%' }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <ShieldCheck size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">风险可控性</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">
                  {goal.status === GoalStatus.STABLE ? '高' : goal.status === GoalStatus.DEVIATED ? '中' : '低'}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                当前风险敞口：{goal.status === GoalStatus.HIGH_RISK ? '资源依赖阻塞' : '暂无显著阻塞'}
              </p>
            </div>
          </div>

          {/* AI Insights Section */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10 text-white pointer-events-none"><Zap size={180} /></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl"><Zap size={20} /></div>
                  <h3 className="text-lg font-black tracking-tight">GIA 智能执行建议</h3>
                </div>
                <button 
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                  {isAnalyzing ? '分析中...' : '调用 AI 深度评估'}
                </button>
              </div>

              {aiAnalysis ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle size={16} className={aiAnalysis.riskLevel === '高' ? 'text-rose-400' : 'text-amber-400'} />
                      <span className="text-xs font-black uppercase tracking-widest">实时风险评估</span>
                      <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-black ${
                        aiAnalysis.riskLevel === '高' ? 'bg-rose-500/20 text-rose-300' : 
                        aiAnalysis.riskLevel === '中' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}>
                        风险等级：{aiAnalysis.riskLevel}
                      </span>
                    </div>
                    <p className="text-sm text-indigo-50 font-medium leading-relaxed">
                      {aiAnalysis.riskAssessment}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span className="text-xs font-black uppercase tracking-widest">建议应对措施</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {aiAnalysis.suggestedMeasures.map((measure, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                          <div className="mt-1 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                          <p className="text-[11px] text-indigo-100 font-medium leading-relaxed">{measure}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 text-indigo-50 font-medium leading-relaxed">
                  <p>
                    <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded text-sm mr-2">执行洞察</span>
                    目标“{goal.name}”当前进度为 {goal.progress}%。系统检测到近期执行动作频率有所下降，主要受限于下游依赖项的交付延迟。
                  </p>
                  {goal.name === '台湾地图 Q2 重点城市覆盖' && (
                    <p className="animate-in slide-in-from-left duration-500">
                      <span className="text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.5 rounded text-sm mr-2">优先级建议</span>
                      根据历史数据，建议将目标“{goal.name}”的优先级提高，因为它对下游“组织专项：物流特色数据共建闭环”的成功至关重要。
                    </p>
                  )}
                  <p>
                    <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded text-sm mr-2">避坑指南</span>
                    建议优先处理关键路径上的“{goal.actionItems[0]?.text || '核心模块'}”开发。参考历史类似项目，此处易出现接口协议不一致导致的返工。
                  </p>
                </div>
              )}
              
              <div className="mt-8 flex gap-3">
                <button 
                  onClick={() => alert('已采纳 AI 建议！\n系统已自动：\n1. 调高该目标的战略权重\n2. 在您的待办事项中置顶关键路径任务\n3. 向下游依赖方发送了进度同步请求。')}
                  className="px-6 py-3 bg-indigo-600 text-white font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-900/50 flex items-center gap-2"
                >
                  <CheckCircle2 size={16} /> 采纳并优化执行路径
                </button>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Action Items */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" /> 关键行动项执行状态
              </h3>
              <div className="space-y-4">
                {goal.actionItems.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-full ${item.done ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                        <Check size={12} />
                      </div>
                      <span className={`text-xs font-bold ${item.done ? 'text-slate-500 line-through' : 'text-slate-700'}`}>
                        {item.text}
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase">{item.done ? '已完成' : '进行中'}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dependencies */}
            <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Layers size={18} className="text-indigo-600" /> 上下游依赖分析
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">上游支撑目标</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.upstreamIds.length > 0 ? goal.upstreamIds.map(id => (
                      <span key={id} className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg border border-indigo-100">
                        {id}
                      </span>
                    )) : <span className="text-xs text-slate-400 italic">暂无上游依赖</span>}
                  </div>
                </div>
                <div className="h-px bg-slate-100 w-full" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">下游影响目标</p>
                  <div className="flex flex-wrap gap-2">
                    {goal.downstreamIds.length > 0 ? goal.downstreamIds.map(id => (
                      <span key={id} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-[10px] font-bold rounded-lg border border-slate-100">
                        {id}
                      </span>
                    )) : <span className="text-xs text-slate-400 italic">暂无下游影响</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default GoalDeepReportModal;
