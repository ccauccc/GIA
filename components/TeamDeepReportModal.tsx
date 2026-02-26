import React from 'react';
import { 
  X, Target, ShieldCheck, Heart, Zap, 
  TrendingUp, AlertTriangle, CheckCircle2, 
  Activity, Users, ArrowRight
} from 'lucide-react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

interface TeamDeepReportModalProps {
  team: {
    name: string;
    score: number;
    stability: number;
    risk: number;
  };
  onClose: () => void;
}

const MOCK_RADAR_DATA = [
  { subject: '目标清晰度', A: 85, fullMark: 100 },
  { subject: '组织韧性', A: 78, fullMark: 100 },
  { subject: '协作耦合度', A: 92, fullMark: 100 },
  { subject: '创新指数', A: 65, fullMark: 100 },
  { subject: '反馈真实度', A: 88, fullMark: 100 },
  { subject: '执行稳定性', A: 82, fullMark: 100 },
];

const MOCK_MEMBERS = [
  { name: '张三', role: '资深开发', status: '健康', score: 92, trend: 'up' },
  { name: '李四', role: '产品经理', status: '波动', score: 78, trend: 'stable' },
  { name: '王五', role: '测试工程师', status: '风险', score: 65, trend: 'down' },
  { name: '赵六', role: '初级开发', status: '健康', score: 88, trend: 'up' },
];

const TeamDeepReportModal: React.FC<TeamDeepReportModalProps> = ({ team, onClose }) => {
  // Generate slightly different data based on team score to make it look real
  const radarData = MOCK_RADAR_DATA.map(d => ({
    ...d,
    A: Math.min(100, Math.max(40, d.A + (team.score - 80) + (Math.random() * 10 - 5)))
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg ${
              team.score > 85 ? 'bg-emerald-500 shadow-emerald-200' : 
              team.score > 70 ? 'bg-amber-500 shadow-amber-200' : 'bg-rose-500 shadow-rose-200'
            }`}>
              {team.score}
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">{team.name} <span className="text-slate-400 font-medium text-sm ml-2">深度健康诊断报告</span></h2>
              <div className="flex items-center gap-3 mt-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  team.score > 85 ? 'bg-emerald-50 text-emerald-600' : 
                  team.score > 70 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                }`}>
                  {team.score > 85 ? '健康状态' : team.score > 70 ? '亚健康' : '高风险'}
                </span>
                <span className="text-xs text-slate-400 font-bold">生成时间: 2026-02-23</span>
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
          
          {/* Top Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-indigo-600">
                <Activity size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">执行稳定性</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">{team.stability}%</span>
                <span className="text-xs font-bold text-emerald-500 mb-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" /> +2.4%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${team.stability}%` }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-rose-500">
                <AlertTriangle size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">风险暴露率</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">{team.risk}%</span>
                <span className="text-xs font-bold text-rose-500 mb-1 flex items-center">
                  <TrendingUp size={12} className="mr-1" /> +5.1%
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 rounded-full" style={{ width: `${team.risk}%` }} />
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4 text-amber-500">
                <Heart size={20} />
                <h3 className="text-sm font-black uppercase tracking-widest">情绪健康度</h3>
              </div>
              <div className="flex items-end gap-2 mb-2">
                <span className="text-4xl font-black text-slate-900">8.2</span>
                <span className="text-xs font-bold text-slate-400 mb-1">/ 10.0</span>
              </div>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= 4 ? 'bg-amber-400' : 'bg-slate-100'}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Main Analysis Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left: Radar Chart */}
            <div className="lg:col-span-1 bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                <Target size={18} className="text-indigo-600" /> 六维健康模型
              </h3>
              <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                      name={team.name}
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#6366f1', fontWeight: 700 }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 p-4 bg-slate-50 rounded-2xl text-xs text-slate-500 leading-relaxed">
                <span className="font-bold text-slate-700">分析：</span>
                {team.score > 80 
                  ? '团队整体结构均衡，特别是在“协作耦合度”上表现优异。建议继续保持当前的沟通机制。'
                  : '团队在“创新指数”和“组织韧性”方面存在短板，建议加强跨部门技术分享和抗压训练。'}
              </div>
            </div>

            {/* Right: AI Insights & Members */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* AI Insight Card */}
              <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-10 text-white pointer-events-none"><Zap size={180} /></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl"><Zap size={20} /></div>
                    <h3 className="text-lg font-black tracking-tight">GIA 智能诊断建议</h3>
                  </div>
                  <div className="space-y-4 text-indigo-50 font-medium leading-relaxed">
                    <p>
                      <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded text-sm mr-2">核心发现</span>
                      {team.name} 在本周期的交付效率虽然维持高位（稳定性 {team.stability}%），但风险暴露率（{team.risk}%）呈现上升趋势。主要集中在“技术选型”阶段的变更频繁。
                    </p>
                    <p>
                      <span className="text-white font-bold bg-white/20 px-1.5 py-0.5 rounded text-sm mr-2">行动建议</span>
                      建议 TL 在下周一的例会中，重点复盘“技术评审”流程。系统检测到 3 个关键模块存在重复返工现象，可参考“基础产品部”的《代码审查规范 v2.0》进行优化。
                    </p>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button className="px-5 py-2.5 bg-white text-indigo-600 font-black rounded-xl text-xs uppercase tracking-wider hover:bg-indigo-50 transition-colors flex items-center gap-2">
                      <CheckCircle2 size={14} /> 采纳建议并生成任务
                    </button>
                    <button className="px-5 py-2.5 bg-indigo-800/50 text-indigo-200 font-black rounded-xl text-xs uppercase tracking-wider hover:bg-indigo-800 transition-colors">
                      忽略
                    </button>
                  </div>
                </div>
              </div>

              {/* Member Health List */}
              <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <Users size={18} className="text-indigo-600" /> 成员状态概览
                </h3>
                <div className="space-y-3">
                  {MOCK_MEMBERS.map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-black text-sm">
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{member.name}</div>
                          <div className="text-[10px] text-slate-400 font-bold uppercase">{member.role}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <div className="text-xs font-bold text-slate-900">{member.score} 分</div>
                          <div className={`text-[10px] font-bold uppercase ${
                            member.status === '健康' ? 'text-emerald-500' : 
                            member.status === '波动' ? 'text-amber-500' : 'text-rose-500'
                          }`}>
                            {member.status}
                          </div>
                        </div>
                        <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all opacity-0 group-hover:opacity-100">
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamDeepReportModal;
