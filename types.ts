export enum GoalType {
  INDIVIDUAL = '个人',
  TEAM = '小组',
  DEPARTMENT = '部门'
}

export enum GoalCategory {
  ORG_SPECIAL = '组织专项',
  MAP = '地图',
  ADDRESS = '地址',
  LOCATION_DATA = '位置大数据',
  AUTO_PROD = '自动化生产',
  ROUTINE = '常规事项'
}

export enum GoalStatus {
  STABLE = '稳定',
  DEVIATED = '偏离',
  HIGH_RISK = '高风险'
}

export interface ActionItem {
  id: string;
  text: string;
  done: boolean;
  startDate?: string;
  endDate?: string;
}

export interface Goal {
  id: string;
  name: string;
  type: GoalType;
  category: GoalCategory; 
  period: string; 
  weight: number; 
  status: GoalStatus;
  progress: number; 
  upstreamIds: string[];
  downstreamIds: string[];
  riskTolerance: '低' | '中' | '高';
  owner: string;
  members?: string[]; 
  importance: 'P0' | 'P1' | 'P2';
  difficulty: 1.3 | 1.0 | 0.7;
  quantification?: string;
  startDate?: string;
  endDate?: string;
  actionItems: ActionItem[];
  tags?: string[];
  summary?: string;
  productLine?: string;
  periodSummaries?: {
    [key in '日' | '周' | '月' | '季' | '年']?: {
      currentGoal: string;
      progressAndRisk: string;
      nextGoal: string;
    }
  };
}

export type ProjectStage = string;

// Support Execution Timeline Model
export interface SupportTimelineEntry {
  id: string;
  startTime: string;           // Start Time (Acts as Advancement Time)
  estimatedDeliveryDate?: string; // Estimated Delivery Time
  advancementStatus: string;   
  requirementItems: string;    
  iterationValue: string;      
  hours: number;               
  productLineTag?: string;     
}

export interface SupportProject {
  id: string;
  name: string;
  bu: string;
  stage: ProjectStage;
  status: '进行中' | '已完成' | '阻塞';
  valueImpact: string;
  estimatedValue: number; 
  actualValue?: number; 
  date: string;
  initiator: string;           
  productLines: string[];      
  timeline?: SupportTimelineEntry[]; 
  newScenarios?: string[];
  periodSummaries?: {
    [key in '日' | '周' | '月' | '季' | '年']?: {
      currentSummary: string;
      issues: string;
      nextSummary: string;
    }
  };
}

export enum EvolutionSource {
  PROJECT = '项目转化',
  COMMUNICATION = '日常识别'
}

export interface EvolutionItem {
  id: string;
  sourceType: EvolutionSource;
  sourceId?: string; // Linked Project ID if PROJECT
  sourceName?: string; // Descriptive name if COMMUNICATION
  bu: string;
  productLines: string[];
  iterationValue: string;
  date: string;
  status: '高价值沉淀' | '产品验证中' | '已加入路线图';
  productAnalysis?: string; // New field for detailed analysis
}

export interface UserRole {
  role: '员工' | '小组长' | '部门负责人' | '超级管理员';
}

export enum UserRoleType {
  EMPLOYEE = '员工',
  TEAM_LEAD = '小组长',
  DEPT_HEAD = '部门负责人',
  SUPER_ADMIN = '超级管理员'
}

export interface RiskAnalysis {
  level: '低' | '中' | '高';
  explanation: string;
  affectedGoals: string[];
  suggestedActions: string[];
}

export interface Team {
  id: string;
  name: string;
  lead: string;
  membersCount: number;
  bu: string;
}
