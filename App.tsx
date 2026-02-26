
import React, { useState, useMemo, useEffect } from 'react';
import { UserRoleType, Goal, Team } from './types';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import DailyReport from './views/DailyReport';
import GoalGraph from './views/GoalGraph';
import ExperienceLib from './views/ExperienceLib';
import AINews from './views/AINews';
import SupportTracking from './views/SupportTracking';
import GoalOverview from './views/GoalOverview';
import SystemSettings from './views/SystemSettings';
import TeamHealth from './views/TeamHealth';
import ReportCalendarView from './views/ReportCalendarView';
import AIChatbot from './components/AIChatbot';
import { MOCK_GOALS } from './constants';

const App: React.FC = () => {
  const [activeRole, setActiveRole] = useState<UserRoleType>(UserRoleType.TEAM_LEAD);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [goals, setGoals] = useState<Goal[]>(MOCK_GOALS);
  const [activeCycle, setActiveCycle] = useState<string>('季度'); // 全局活跃周期状态
  
  // 字典配置状态 (全局共享)
  const [buOptions, setBuOptions] = useState<string[]>([
    '物流事业部', '企服事业部', '政务事业部', '金融 BU', '海外 BU', '基础产品部'
  ]);

  const [stageOptions, setStageOptions] = useState<string[]>([
    'POC验证', '技术选型', '合同对齐', '已签单', '正式交付', '已流失'
  ]);

  const [productLineOptions, setProductLineOptions] = useState<string[]>([
    '上门入户地图', '高精度配送索引', '地址标准化引擎', '时空搜索组件', '物流可视化大屏'
  ]);

  const [teams, setTeams] = useState<Team[]>([
    { id: 'team-1', name: '商业化小组', lead: 'Sarah', membersCount: 8, bu: '企服事业部' },
    { id: 'team-2', name: '物流算法组', lead: 'Jerry', membersCount: 12, bu: '物流事业部' },
    { id: 'team-3', name: '基础架构组', lead: 'Kevin', membersCount: 6, bu: '基础产品部' },
  ]);

  // Handle role-based tab restriction
  useEffect(() => {
    const restrictedTabs = ['dashboard', 'overview', 'health', 'report-monitor'];
    if (activeRole === UserRoleType.EMPLOYEE && restrictedTabs.includes(activeTab)) {
      setActiveTab('goals');
    }

    if (activeTab === 'settings' && activeRole !== UserRoleType.SUPER_ADMIN) {
      setActiveTab(activeRole === UserRoleType.EMPLOYEE ? 'goals' : 'dashboard');
    }
  }, [activeRole, activeTab]);

  // 根据当前活跃周期过滤目标
  const filteredGoalsByCycle = useMemo(() => {
    return goals.filter(g => g.period === activeCycle);
  }, [goals, activeCycle]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard role={activeRole} goals={filteredGoalsByCycle} activeCycle={activeCycle} />;
      case 'overview':
        return <GoalOverview role={activeRole} goals={filteredGoalsByCycle} activeCycle={activeCycle} />;
      case 'health':
        return <TeamHealth role={activeRole} goals={filteredGoalsByCycle} activeCycle={activeCycle} />;
      case 'report-monitor':
        return <ReportCalendarView role={activeRole} />;
      case 'goals':
        return <GoalGraph role={activeRole} goals={filteredGoalsByCycle} setGoals={setGoals} allGoals={goals} activeCycle={activeCycle} />;
      case 'reports':
        return <DailyReport role={activeRole} goals={filteredGoalsByCycle} />;
      case 'support':
        return <SupportTracking buOptions={buOptions} stageOptions={stageOptions} productLineOptions={productLineOptions} />;
      case 'experiences':
        return <ExperienceLib role={activeRole} />;
      case 'ai-news':
        return <AINews />;
      case 'settings':
        return (
          <SystemSettings 
            buOptions={buOptions} 
            setBuOptions={setBuOptions} 
            stageOptions={stageOptions} 
            setStageOptions={setStageOptions} 
            productLineOptions={productLineOptions}
            setProductLineOptions={setProductLineOptions}
            teams={teams}
            setTeams={setTeams}
          />
        );
      default:
        return <Dashboard role={activeRole} goals={filteredGoalsByCycle} activeCycle={activeCycle} />;
    }
  };

  return (
    <Layout 
      activeRole={activeRole} 
      setActiveRole={setActiveRole} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
    >
      {renderContent()}
      <AIChatbot goals={filteredGoalsByCycle} />
    </Layout>
  );
};

export default App;
