
import React, { useState } from 'react';
import { UserRoleType, Goal, GoalStatus } from '../types';
import TeamDeepReportModal from '../components/TeamDeepReportModal';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell,
  LineChart, Line
} from 'recharts';
import { 
  Activity, ShieldCheck, Heart, Users, Target, Zap, 
  TrendingUp, AlertTriangle, CheckCircle2, Search,
  ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';

interface TeamHealthProps {
  role: UserRoleType;
  goals: Goal[];
  activeCycle: string;
}

const DEPT_HEALTH_DATA = [
  { subject: '目标清晰度', A: 85, fullMark: 100 },
  { subject: '组织韧性', A: 78, fullMark: 100 },
  { subject: '协作耦合度', A: 92, fullMark: 100 },
  { subject: '创新指数', A: 65, fullMark: 100 },
  { subject: '反馈真实度', A: 88, fullMark: 100 },
  { subject: '执行稳定性', A: 82, fullMark: 100 },
];

const TEAM_RANKING_DATA = [
  { name: '地图小组', score: 92, stability: 95, risk: 5 },
  { name: '自动化生产组', score: 85, stability: 88, risk: 12 },
  { name: '商业化运营组', score: 64, stability: 70, risk: 35 },
  { name: '数据中台组', score: 88, stability: 92, risk: 8 },
];

const INDIVIDUAL_HEALTH_DATA = [
  { name: '周杰米', score: 58, sentiment: '负面倾向', status: '高负载', trend: 'down' },
  { name: '张莎莎', score: 94, sentiment: '积极稳定', status: '健康', trend: 'up' },
  { name: '李阿强', score: 76, sentiment: '中性波动', status: '预警', trend: 'stable' },
  { name: 'Alex', score: 88, sentiment: '积极稳定', status: '健康', trend: 'up' },
];

const TeamHealth: React.FC<TeamHealthProps> = ({ role, goals, activeCycle }) => {
  const [activeLayer, setActiveLayer] = useState<'dept' | 'team' | 'individual'>(
    role === UserRoleType.DEPT_HEAD ? 'dept' : role === UserRoleType.TEAM_LEAD ? 'team' : 'individual'
  );
  const [selectedTeam, setSelectedTeam] = useState<typeof TEAM_RANKING_DATA[0] | null>(null);

  const isDH = role === UserRoleType.DEPT_HEAD;
  const isTL = role === UserRoleType.TEAM_LEAD || isDH;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {selectedTeam && (
        <TeamDeepReportModal 
          team={selectedTeam} 
          onClose={() => setSelectedTeam(null)} 
        />
      )}
      {/* 顶部三层架构导航 */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm flex gap-2 max-w-2xl mx-auto">
        <button 
          onClick={() => setActiveLayer('dept')}
          disabled={!isDH}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
            activeLayer === 'dept' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
              : isDH ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-200 cursor-not-allowed'
          }`}
        >
          <Target size={18} /> 部门全景
        </button>
        <button 
          onClick={() => setActiveLayer('team')}
          disabled={!isTL}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
            activeLayer === 'team' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
              : isTL ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-200 cursor-not-allowed'
          }`}
        >
          <Users size={18} /> 小组诊断
        </button>
        <button 
          onClick={() => setActiveLayer('individual')}
          className={`flex-1 py-3 px-6 rounded-2xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${
            activeLayer === 'individual' 
              ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' 
              : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          <Activity size={18} /> 个人洞察
        </button>
      </div>

      {activeLayer === 'dept' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* 部门层级：健康看板 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col items-center">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2 w-full">
                <Target size={18} className="text-indigo-600" /> 组织健康雷达
              </h3>
              <div className="w-full h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={DEPT_HEALTH_DATA}>
                    <PolarGrid stroke="#f1f5f9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Radar
                      name="部门健康"
                      dataKey="A"
                      stroke="#6366f1"
                      fill="#6366f1"
                      fillOpacity={0.4}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6 text-center">
                <div className="text-4xl font-black text-slate-900 tracking-tighter">82.4</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">组织综合健康指数</div>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <TrendingUp size={18} className="text-emerald-500" /> 关键指标趋势
                </h3>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500" /> <span className="text-[10px] font-black text-slate-400 uppercase">健康度</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500" /> <span className="text-[10px] font-black text-slate-400 uppercase">达成率</span></div>
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={TEAM_RANKING_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="score" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={24} />
                    <Bar dataKey="stability" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 p-6 bg-indigo-50/50 rounded-3xl border border-indigo-100 flex items-center gap-6">
                <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><Zap size={24} /></div>
                <div>
                  <h4 className="text-sm font-black text-indigo-900 leading-none mb-1">AI 战略建议</h4>
                  <p className="text-xs text-indigo-700 font-medium leading-relaxed italic">
                    组织整体协作度极高（92%），但“创新指数”偏低。建议 Q3 期间增加“前瞻性课题”目标权重。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeLayer === 'team' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* 小组层级：对比与诊断 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM_RANKING_DATA.map((team, idx) => (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-black text-slate-900 leading-none">{team.name}</h4>
                  <span className={`px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${
                    team.score > 85 ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                    team.score > 70 ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}>
                    {team.score > 85 ? '稳定' : team.score > 70 ? '波动' : '风险'}
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-3xl font-black text-slate-900">{team.score}</span>
                  <span className="text-xs font-bold text-slate-400">指数</span>
                </div>
                <div className="space-y-4 mt-6">
                  <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1.5">
                      <span>执行稳定性</span>
                      <span className="text-slate-700">{team.stability}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${team.stability}%` }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-1.5">
                      <span>风险暴露率</span>
                      <span className="text-rose-500">{team.risk}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500 rounded-full" style={{ width: `${team.risk}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center gap-2">
              <ShieldCheck size={18} className="text-indigo-600" /> 小组健康深度对比表
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/50">
                    <th className="px-6 py-4">小组名称</th>
                    <th className="px-6 py-4">目标清晰度</th>
                    <th className="px-6 py-4">风险自处理能力</th>
                    <th className="px-6 py-4">情绪健康度</th>
                    <th className="px-6 py-4 text-right">状态建议</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {TEAM_RANKING_DATA.map((team, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="font-bold text-slate-900">{team.name}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">TL: Sarah</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-700">88%</span>
                          <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-400" style={{ width: '88%' }} />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-xs font-bold text-slate-700">{100 - team.risk}%</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(star => <Heart key={star} size={12} className={star <= (team.score / 20) ? 'text-rose-500 fill-rose-500' : 'text-slate-200'} />)}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button 
                          onClick={() => setSelectedTeam(team)}
                          className="text-[11px] font-black text-indigo-600 hover:underline"
                        >
                          查看深度报告
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeLayer === 'individual' && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
          {/* 个人层级：情绪与负荷 */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Activity size={18} className="text-indigo-600" /> 员工个体健康扫描 (异常洞察)
              </h3>
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" placeholder="搜索成员..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {INDIVIDUAL_HEALTH_DATA.map((person, idx) => (
                <div key={idx} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100 flex items-start gap-6 hover:bg-white hover:shadow-lg transition-all">
                  <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black text-xl shadow-inner">
                    {person.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-black text-slate-900">{person.name}</h4>
                      <div className="flex items-center gap-1.5">
                        {person.trend === 'up' ? <ArrowUpRight size={14} className="text-emerald-500" /> : person.trend === 'down' ? <ArrowDownRight size={14} className="text-rose-500" /> : null}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${person.status === '健康' ? 'text-emerald-500' : person.status === '预警' ? 'text-amber-500' : 'text-rose-500'}`}>
                          {person.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">
                      <div className="flex items-center gap-1"><Activity size={12} /> 健康指数 {person.score}</div>
                      <div className="flex items-center gap-1"><Heart size={12} /> {person.sentiment}</div>
                    </div>
                    <div className="p-4 bg-white rounded-2xl border border-slate-100">
                      <p className="text-[10px] text-slate-400 font-black uppercase mb-1 flex items-center gap-1"><Info size={10} /> AI 洞察分析</p>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic">
                        {person.name === '周杰米' 
                          ? '近期日报反馈压力较大，目标处于偏离状态。建议 TL 介入进行资源协调。' 
                          : '目标达成稳健，情绪表达积极，具备承担更具挑战性任务的潜力。'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-20 opacity-5 text-white pointer-events-none"><ShieldCheck size={200} /></div>
             <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
               <div className="flex-1">
                 <h3 className="text-2xl font-black mb-4 tracking-tight">组织免疫系统：经验自净化</h3>
                 <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-xl">
                   GIA 正在自动捕捉由于“负荷过高”或“风险识别不足”导致的个人健康波动，并将这些信号转化为团队层级的“流程优化建议”，实现从个体疼痛到组织进化的闭环。
                 </p>
                 <div className="flex gap-4">
                   <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                      <div className="text-2xl font-black mb-1">12 项</div>
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">本月自动沉淀经验</div>
                   </div>
                   <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/10">
                      <div className="text-2xl font-black mb-1">96%</div>
                      <div className="text-[10px] font-black text-white/50 uppercase tracking-widest leading-none">风险预警覆盖率</div>
                   </div>
                 </div>
               </div>
               <button 
                 onClick={() => alert('正在生成组织免疫报告...\n- 风险自愈率：92%\n- 异常信号捕捉：14条\n- 经验自动沉淀：5项\n报告已推送至您的邮箱。')}
                 className="px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-900/50 uppercase tracking-widest text-sm flex items-center gap-3"
               >
                 <CheckCircle2 size={18} /> 查看全局免疫报告
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamHealth;
