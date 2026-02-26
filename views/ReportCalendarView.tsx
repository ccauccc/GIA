
import React, { useState, useMemo } from 'react';
import { UserRoleType } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bell, 
  Users, 
  User, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Settings2,
  X,
  Send,
  MessageSquare,
  Mail,
  Smartphone,
  CalendarCheck,
  AlertTriangle,
  History,
  TrendingUp,
  Check,
  Loader2,
  Filter,
  Search
} from 'lucide-react';

interface ReportCalendarViewProps {
  role: UserRoleType;
}

// Extended mock data for Dept Head view
const MOCK_TEAMS = [
  { id: 't1', name: '地图小组', lead: 'Sarah', compliance: 95 },
  { id: 't2', name: '自动化生产组', lead: 'Kevin', compliance: 82 },
  { id: 't3', name: '商业化运营组', lead: 'Linda', compliance: 68 },
  { id: 't4', name: '数据中台组', lead: 'Wang', compliance: 90 },
];

const MOCK_TEAM_MEMBERS = [
  { id: '1', name: 'Alex', status: 'filled', time: '18:30', hours: 8, team: '地图小组' },
  { id: '2', name: 'Sarah', status: 'filled', time: '19:15', hours: 8, team: '地图小组' },
  { id: '3', name: 'Jerry', status: 'missing', time: '--', hours: 0, team: '地图小组' },
  { id: '4', name: 'Min', status: 'missing', time: '--', hours: 0, team: '自动化生产组' },
  { id: '5', name: 'Eric', status: 'filled', time: '17:45', hours: 8, team: '自动化生产组' },
  { id: '6', name: 'Wang', status: 'filled', time: '20:10', hours: 9, team: '数据中台组' },
];

const ReportCalendarView: React.FC<ReportCalendarViewProps> = ({ role }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [showConfig, setShowConfig] = useState(false);
  const [isReminding, setIsReminding] = useState(false);
  const [remindSuccess, setRemindSuccess] = useState(false);
  
  // Sidebar filter state
  const [sidebarFilter, setSidebarFilter] = useState<'all' | 'filled' | 'missing' | 'me'>('all');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Reminder Config State
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [reminderTime, setReminderTime] = useState('18:30');
  const [reminderChannels, setReminderChannels] = useState(['app', 'sms']);
  const [skipHolidays, setSkipHolidays] = useState(true);

  const isDH = role === UserRoleType.DEPT_HEAD;
  const isTL = role === UserRoleType.TEAM_LEAD;
  const isEmployee = role === UserRoleType.EMPLOYEE;

  const currentUserName = useMemo(() => {
    if (role === UserRoleType.EMPLOYEE) return 'Alex';
    if (role === UserRoleType.TEAM_LEAD) return 'Sarah';
    return 'Eric';
  }, [role]);

  const daysInMonth = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentDate]);

  const startDay = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentDate]);

  const monthName = currentDate.toLocaleString('zh-CN', { month: 'long', year: 'numeric' });

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  // Logic to simulate historical health/status
  const getDayStatus = (day: number) => {
    const today = new Date();
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (checkDate > today) return 'upcoming';
    
    // Seed random based on date for consistent mocks
    const seed = (currentDate.getMonth() + 1) * 100 + day;
    const random = (seed * 9301 + 49297) % 233280 / 233280;

    if (isEmployee) return random > 0.15 ? 'filled' : 'missing';
    return Math.floor(random * 40) + 60; // 60-100% compliance
  };

  const handleOneClickRemind = () => {
    setIsReminding(true);
    setTimeout(() => {
      setIsReminding(false);
      setRemindSuccess(true);
      setTimeout(() => setRemindSuccess(false), 3000);
    }, 1500);
  };

  const filteredMembers = useMemo(() => {
    let result = MOCK_TEAM_MEMBERS;
    
    // 1. Department Filter
    if (selectedDept !== 'all') {
      result = result.filter(m => m.team === selectedDept);
    }

    // 2. Search Filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(m => m.name.toLowerCase().includes(query));
    }

    // 3. Status/Me Filter
    if (sidebarFilter === 'me') {
      result = result.filter(m => m.name === currentUserName);
    } else if (sidebarFilter !== 'all') {
      result = result.filter(m => m.status === sidebarFilter);
    }

    return result;
  }, [sidebarFilter, currentUserName, selectedDept, searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700 h-full flex flex-col">
      {/* Dynamic Header Section */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] text-indigo-600 pointer-events-none">
          <CalendarCheck size={180} />
        </div>
        
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-indigo-100">
            <CalendarCheck size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {isEmployee ? '执行轨迹：日报填报日历' : isTL ? '监控中心：小组填报合规看板' : '决策看板：部门填报全景监控'}
            </h2>
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">
              {isEmployee ? '沉淀每日产出，确保目标闭环' : '实时追踪组织执行活跃度，降低管理衰减'}
            </p>
          </div>
        </div>

        {!isEmployee && (
          <div className="flex items-center gap-3 relative z-10">
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-400 uppercase">预计催办时间</span>
                  <span className="text-xs font-black text-indigo-600">{reminderTime}</span>
               </div>
               <div className="w-px h-6 bg-slate-200 mx-2" />
               <button onClick={() => setShowConfig(true)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                 <Settings2 size={18} />
               </button>
            </div>
            <button 
              onClick={() => setShowConfig(true)}
              className="lg:hidden px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-sm hover:border-indigo-200 hover:text-indigo-600 transition-all flex items-center gap-2"
            >
              <Settings2 size={16} /> 配置
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        {/* Calendar Area */}
        <div className="lg:col-span-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronLeft size={20} /></button>
              <h3 className="text-lg font-black text-slate-900 min-w-[140px] text-center tracking-tight">{monthName}</h3>
              <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400"><ChevronRight size={20} /></button>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isEmployee ? '已填报' : '高合规 (>90%)'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {isEmployee ? '缺勤' : '低合规 (<70%)'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 flex-1">
            {['日', '一', '二', '三', '四', '五', '六'].map(d => (
              <div key={d} className="text-center text-[11px] font-black text-slate-300 uppercase py-2 tracking-widest">{d}</div>
            ))}
            
            {Array.from({ length: startDay }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const status = getDayStatus(day);
              const isSelected = selectedDay === day;
              const isToday = new Date().getDate() === day && new Date().getMonth() === currentDate.getMonth() && new Date().getFullYear() === currentDate.getFullYear();

              let cellClass = "relative flex flex-col items-center justify-center aspect-square rounded-3xl transition-all border-2 ";
              let dotClass = "absolute bottom-3 w-1.5 h-1.5 rounded-full ";
              
              if (isSelected) {
                cellClass += "bg-indigo-50 border-indigo-200 shadow-inner ";
              } else {
                cellClass += "bg-slate-50/30 border-transparent hover:border-slate-100 hover:bg-white ";
              }

              if (status === 'filled') dotClass += "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
              else if (status === 'missing') dotClass += "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]";
              else if (typeof status === 'number') {
                if (status >= 90) dotClass += "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]";
                else if (status >= 75) dotClass += "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]";
                else dotClass += "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]";
              }

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={cellClass}
                >
                  <span className={`text-base font-black ${isSelected ? 'text-indigo-600' : 'text-slate-700'}`}>
                    {day}
                  </span>
                  
                  {status !== 'upcoming' && (
                    <>
                      <div className={dotClass} />
                      {!isEmployee && typeof status === 'number' && (
                        <span className={`text-[9px] font-black mt-1 opacity-60 ${status >= 90 ? 'text-emerald-600' : status >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                          {status}%
                        </span>
                      )}
                    </>
                  )}
                  
                  {isToday && (
                    <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white shadow-sm" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Details Sidebar with Glassmorphism */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] border border-slate-100 shadow-xl p-8 flex-1 flex flex-col min-h-0 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05] text-indigo-900 pointer-events-none">
              <History size={120} />
            </div>

            <div className="flex flex-col mb-8 relative z-10 gap-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  {isEmployee ? <User size={18} className="text-indigo-600" /> : <Users size={18} className="text-indigo-600" />} 
                  {selectedDay}日 执行明细
                </h3>
                <span className="text-[10px] font-black text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-xl shadow-sm">
                  {isEmployee ? '个人执行' : isTL ? '小组看板' : '部门看板'}
                </span>
              </div>

              {!isEmployee && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                      <input 
                        type="text" 
                        placeholder="搜索个人..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder:text-slate-400"
                      />
                    </div>
                    {isDH && (
                      <select 
                        value={selectedDept}
                        onChange={(e) => setSelectedDept(e.target.value)}
                        className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all cursor-pointer text-slate-600"
                      >
                        <option value="all">所有部门</option>
                        {MOCK_TEAMS.map(t => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200">
                    <button 
                      onClick={() => setSidebarFilter('all')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarFilter === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      全部
                    </button>
                    <button 
                      onClick={() => setSidebarFilter('me')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarFilter === 'me' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      只看自己
                    </button>
                    <button 
                      onClick={() => setSidebarFilter('filled')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarFilter === 'filled' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      已填写
                    </button>
                    <button 
                      onClick={() => setSidebarFilter('missing')}
                      className={`py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl ${sidebarFilter === 'missing' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      未填写
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide relative z-10">
              {isEmployee ? (
                <div className="space-y-6 animate-in fade-in duration-500">
                  <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 p-4 opacity-10 text-emerald-900 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={60} />
                     </div>
                     <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">当日状态：已完成填报</p>
                     <p className="text-sm font-bold text-emerald-900 leading-relaxed">日报已于 18:45 自动归档，工时覆盖 8.0h，关联战略目标：<span className="underline">自动化生产演进</span></p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">执行深度</p>
                        <p className="text-lg font-black text-slate-800">High</p>
                     </div>
                     <div className="p-5 bg-white border border-slate-100 rounded-2xl shadow-sm text-center">
                        <p className="text-[9px] font-black text-slate-400 uppercase mb-1">风险拦截</p>
                        <p className="text-lg font-black text-slate-800">0</p>
                     </div>
                  </div>
                </div>
              ) : (
                /* Filtered Content */
                <div className="space-y-4 animate-in fade-in duration-300">
                  {filteredMembers.map(member => (
                    <div key={member.id} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-100 hover:shadow-md transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center font-black text-slate-400 uppercase group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                          {member.name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{member.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{member.status === 'filled' ? `耗时: ${member.hours}h` : '等待中'}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {member.status === 'filled' ? (
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        ) : (
                          <button onClick={handleOneClickRemind} className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all">
                             <Bell size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="py-12 text-center">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest italic">暂无符合条件的成员</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {!isEmployee && (
               <div className="mt-8 relative z-10">
                 <button 
                  onClick={handleOneClickRemind}
                  disabled={isReminding}
                  className={`w-full py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl ${
                    remindSuccess 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-slate-900 text-white hover:bg-indigo-600 shadow-slate-200'
                  }`}
                 >
                   {isReminding ? (
                     <Loader2 className="animate-spin" size={18} />
                   ) : remindSuccess ? (
                     <><Check size={18} /> 通知已全渠道下发</>
                   ) : (
                     <><Send size={18} /> 一键催办本日缺勤人员</>
                   )}
                 </button>
                 <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4 tracking-tighter">
                    点击后将通过 GIA 助手、短信及工作软件进行触达
                 </p>
               </div>
            )}
          </div>
        </div>
      </div>

      {/* Reminder Config Modal (Keeping original for brevity) */}
      {showConfig && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowConfig(false)} />
          <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="bg-indigo-600 p-8 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md shadow-inner">
                  <Bell size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">自动催办通知配置</h3>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-widest mt-0.5">配置组织级填报守则与触达策略</p>
                </div>
              </div>
              <button onClick={() => setShowConfig(false)} className="w-10 h-10 flex items-center justify-center hover:bg-white/10 rounded-2xl transition-all"><X size={24} /></button>
            </div>

            <div className="p-10 space-y-10">
              <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm"><Check size={24}/></div>
                    <div>
                      <h4 className="text-sm font-black text-indigo-900 mb-0.5">启用智能定时催办</h4>
                      <p className="text-[10px] text-indigo-600/60 font-bold uppercase leading-none">AI 将在检测到异常时自动补发通知</p>
                    </div>
                 </div>
                 <button 
                  onClick={() => setReminderEnabled(!reminderEnabled)}
                  className={`w-14 h-8 rounded-full relative transition-all shadow-inner ${reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                 >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${reminderEnabled ? 'right-1' : 'left-1'}`} />
                 </button>
              </div>

              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><Clock size={12}/> 每日触达时间点</label>
                    <div className="relative">
                       <Clock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                       <input 
                        type="time" 
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-14 pr-6 py-4 text-sm font-black outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all" 
                       />
                    </div>
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2"><CalendarCheck size={12}/> 节假日策略</label>
                    <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
                       <button 
                        onClick={() => setSkipHolidays(true)}
                        className={`flex-1 py-3 text-[10px] font-black rounded-xl uppercase transition-all ${skipHolidays ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                       >
                         自动跳过
                       </button>
                       <button 
                        onClick={() => setSkipHolidays(false)}
                        className={`flex-1 py-3 text-[10px] font-black rounded-xl uppercase transition-all ${!skipHolidays ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}
                       >
                         强制填报
                       </button>
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">全渠道触达配置</label>
                 <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'app', label: 'GIA 助手', icon: MessageSquare },
                      { id: 'sms', label: '短信提醒', icon: Smartphone },
                      { id: 'mail', label: '邮件触达', icon: Mail },
                    ].map(ch => (
                      <button 
                        key={ch.id}
                        onClick={() => setReminderChannels(prev => prev.includes(ch.id) ? prev.filter(c => c !== ch.id) : [...prev, ch.id])}
                        className={`flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all gap-3 ${
                          reminderChannels.includes(ch.id) ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-md shadow-indigo-50/50' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                        }`}
                      >
                        <ch.icon size={24} />
                        <span className="text-[10px] font-black uppercase">{ch.label}</span>
                      </button>
                    ))}
                 </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button onClick={() => setShowConfig(false)} className="flex-1 py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase rounded-3xl hover:bg-slate-200 transition-all">取消</button>
                <button onClick={() => { setShowConfig(false); alert('配置已同步至全域监控模块'); }} className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-3xl hover:bg-indigo-700 shadow-2xl shadow-indigo-100 flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> 保存并启用全局策略
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportCalendarView;
