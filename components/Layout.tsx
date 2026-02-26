
import React, { useState } from 'react';
import { UserRoleType } from '../types';
import { 
  Target, 
  LayoutDashboard, 
  FileText, 
  BookOpen, 
  Activity, 
  ShieldAlert,
  UserCircle,
  Briefcase,
  PieChart as PieIcon,
  ChevronRight,
  Settings,
  CalendarCheck,
  Newspaper,
  X,
  Mail,
  Phone,
  MapPin,
  Building,
  Award,
  ChevronDown
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeRole: UserRoleType;
  setActiveRole: (role: UserRoleType) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeRole, setActiveRole, activeTab, setActiveTab }) => {
  const [showProfileModal, setShowProfileModal] = useState(false);

  const allSections = [
    {
      id: 'monitoring',
      title: '监控与决策',
      items: [
        { id: 'dashboard', label: '控制中心', icon: LayoutDashboard },
        { id: 'overview', label: '目标全景', icon: PieIcon },
        { id: 'health', label: '团队健康', icon: Activity },
        { id: 'report-monitor', label: '日报监控', icon: CalendarCheck },
      ]
    },
    {
      id: 'execution',
      title: '执行与协作',
      items: [
        { id: 'goals', label: '目标地图', icon: Target },
        { id: 'reports', label: '智能执行', icon: FileText },
        { id: 'support', label: '支撑价值', icon: Briefcase },
      ]
    },
    {
      id: 'sedimentation',
      title: '沉淀与进化',
      items: [
        { id: 'experiences', label: '经验库', icon: BookOpen },
        { id: 'ai-news', label: 'AI 资讯', icon: Newspaper },
        { id: 'settings', label: '系统管理', icon: Settings },
      ]
    }
  ];

  // Logic: Hide 'monitoring' section for employees, and 'settings' for non-super-admins
  const sections = allSections.map(section => ({
    ...section,
    items: section.items.filter(item => {
      if (item.id === 'settings' && activeRole !== UserRoleType.SUPER_ADMIN) return false;
      return true;
    })
  })).filter(section => {
    if (activeRole === UserRoleType.EMPLOYEE && section.id === 'monitoring') return false;
    return section.items.length > 0;
  });

  const roleLabels = {
    [UserRoleType.EMPLOYEE]: '员工 (IC)',
    [UserRoleType.TEAM_LEAD]: '小组长 (TL)',
    [UserRoleType.DEPT_HEAD]: '部门负责人 (DH)',
    [UserRoleType.SUPER_ADMIN]: '超级管理员 (SA)',
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200/60 flex flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-8 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-12 px-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-200/50 rotate-[-4deg]">
              <ShieldAlert className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">GIA</h1>
              <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] mt-1">Intelligence Agent</p>
            </div>
          </div>
          
          <nav className="flex-1 space-y-10 overflow-y-auto pr-2 scrollbar-hide">
            {sections.map((section) => (
              <div key={section.title}>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] px-4 mb-4">
                  {section.title}
                </p>
                <div className="space-y-1.5">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-[13px] font-bold transition-all duration-300 group ${
                        activeTab === item.id 
                          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 transition-colors'} />
                        {item.label}
                      </div>
                      {activeTab === item.id && <div className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-10 flex items-center justify-between z-10 sticky top-0">
          <div className="flex items-center gap-4">
             <div className="w-1 h-8 bg-indigo-600 rounded-full" />
             <div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Current Module</p>
               <h2 className="text-lg font-black text-slate-900 tracking-tight">
                 {allSections.flatMap(s => s.items).find(i => i.id === activeTab)?.label || '控制台'}
               </h2>
             </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-200/60 shadow-sm">
              <button 
                onClick={() => setActiveRole(UserRoleType.EMPLOYEE)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition-all duration-300 ${activeRole === UserRoleType.EMPLOYEE ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                员工
              </button>
              <button 
                onClick={() => setActiveRole(UserRoleType.TEAM_LEAD)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition-all duration-300 ${activeRole === UserRoleType.TEAM_LEAD ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                组长
              </button>
              <button 
                onClick={() => setActiveRole(UserRoleType.DEPT_HEAD)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition-all duration-300 ${activeRole === UserRoleType.DEPT_HEAD ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                负责人
              </button>
              <button 
                onClick={() => setActiveRole(UserRoleType.SUPER_ADMIN)}
                className={`px-3 py-1.5 text-[10px] font-black rounded-xl transition-all duration-300 ${activeRole === UserRoleType.SUPER_ADMIN ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100' : 'text-slate-400 hover:text-slate-600'}`}
              >
                管理员
              </button>
            </div>

            <div className="flex items-center gap-6">
              <div 
                className="flex items-center gap-4 cursor-pointer group"
                onClick={() => setShowProfileModal(true)}
              >
                <div className="flex flex-col items-end">
                  <span className="text-sm font-black text-slate-900 leading-none mb-1.5 group-hover:text-indigo-600 transition-colors">
                    {activeRole === UserRoleType.EMPLOYEE ? 'Alex' : activeRole === UserRoleType.TEAM_LEAD ? 'Sarah' : activeRole === UserRoleType.DEPT_HEAD ? 'Eric' : 'Admin'}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                      {roleLabels[activeRole]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shadow-inner group-hover:border-indigo-200 transition-all">
                    <UserCircle size={24} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <ChevronDown size={16} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10 scrollbar-thin bg-[#F9FAFB]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </section>
      </main>

      {/* User Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setShowProfileModal(false)} />
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            <div className="relative h-32 bg-gradient-to-r from-indigo-500 to-purple-600">
              <button 
                onClick={() => setShowProfileModal(false)}
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
                      src={`https://picsum.photos/seed/${activeRole === UserRoleType.EMPLOYEE ? 'Alex' : activeRole === UserRoleType.TEAM_LEAD ? 'Sarah' : activeRole === UserRoleType.DEPT_HEAD ? 'Eric' : 'Admin'}/200/200`} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
                <div className="mb-2">
                  <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-lg border border-indigo-100">
                    {roleLabels[activeRole]}
                  </span>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">
                    {activeRole === UserRoleType.EMPLOYEE ? 'Alex' : activeRole === UserRoleType.TEAM_LEAD ? 'Sarah' : activeRole === UserRoleType.DEPT_HEAD ? 'Eric' : 'Admin'}
                  </h2>
                  <p className="text-sm font-bold text-slate-400 mt-1">
                    {activeRole === UserRoleType.EMPLOYEE ? '前端开发工程师' : activeRole === UserRoleType.TEAM_LEAD ? '技术小组长' : activeRole === UserRoleType.DEPT_HEAD ? '部门负责人' : '系统管理员'}
                  </p>
                </div>

                <div className="space-y-4 py-6 border-y border-slate-100">
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <Building size={16} className="text-slate-400" />
                    <span>基础产品部 / 研发中心</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span>{activeRole === UserRoleType.EMPLOYEE ? 'alex' : activeRole === UserRoleType.TEAM_LEAD ? 'sarah' : activeRole === UserRoleType.DEPT_HEAD ? 'eric' : 'admin'}@company.com</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <Phone size={16} className="text-slate-400" />
                    <span>+86 138 0000 0000</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm font-bold text-slate-600">
                    <MapPin size={16} className="text-slate-400" />
                    <span>北京总部 / T3 研发楼</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">近期荣誉与成就</h3>
                  <div className="flex gap-3">
                    <div className="flex-1 bg-amber-50 border border-amber-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2">
                      <Award size={20} className="text-amber-500" />
                      <span className="text-[10px] font-bold text-amber-700">Q1 优秀员工</span>
                    </div>
                    <div className="flex-1 bg-emerald-50 border border-emerald-100 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-2">
                      <Target size={20} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-emerald-700">目标达成 100%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
