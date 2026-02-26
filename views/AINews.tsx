
import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Newspaper, 
  TrendingUp, 
  Cpu, 
  Globe, 
  ExternalLink, 
  RefreshCw, 
  Search,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  ChevronRight,
  ArrowRight,
  X,
  Plus,
  User,
  Link as LinkIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  fullContent: string;
  category: '行业动态' | '技术突破' | '应用案例' | '政策法规';
  source: string;
  date: string;
  readTime: string;
  imageUrl: string;
  relevance: number; // 0-100
  tags: string[];
  contributor?: string;
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: '1',
    title: 'Gemini 3.1 Pro 发布：长文本处理能力实现质的飞跃',
    summary: '谷歌最新发布的 Gemini 3.1 Pro 模型在长文本理解和复杂推理方面表现卓越，特别是在处理超过 200 万 token 的上下文时，准确率提升了 35%。这对于我们处理海量日报数据和长周期目标对齐具有重大意义。',
    fullContent: `
      谷歌最新发布的 Gemini 3.1 Pro 模型在长文本理解和复杂推理方面表现卓越。

      ### 核心突破
      1. **上下文窗口扩展**：支持高达 200 万 token 的原生上下文，这意味着可以一次性处理数千份日报或数十万行的代码库。
      2. **推理能力增强**：在数学、编程和逻辑推理基准测试中，性能提升了 20% 以上。
      3. **多模态对齐**：视频和音频的理解更加细腻，能够精准捕捉长视频中的细微动作。

      ### 行业影响
      对于我们基础产品部而言，这预示着我们可以构建更加智能的“全量日报分析引擎”。不再受限于单篇日报的长度，AI 可以横跨整个季度，从数万条执行记录中自动提炼出战略级别的风险和机会。

      ### 建议行动
      - 评估将当前日报分析模型迁移至 Gemini 3.1 Pro 的可行性。
      - 探索利用超长上下文进行“全周期目标自动对齐”的技术方案。
    `,
    category: '技术突破',
    source: 'Google AI Blog',
    date: '2026-02-24',
    readTime: '5 min',
    imageUrl: 'https://picsum.photos/seed/ai1/800/450',
    relevance: 98,
    tags: ['LLM', '长文本', '推理']
  },
  {
    id: '2',
    title: 'AI + 地图：自动化测绘技术在东南亚市场取得突破',
    summary: '通过引入多模态大模型，某领先地图厂商实现了在复杂热带雨林环境下的道路自动识别，识别率从 60% 提升至 92%。该技术可直接参考用于我们的“台湾地图”及后续海外业务扩展。',
    fullContent: `
      在东南亚等复杂地理环境下，传统的测绘技术面临巨大挑战。

      ### 技术方案
      该方案采用了“视觉-激光雷达”融合的多模态大模型。通过对海量热带植被和非标准道路数据的预训练，模型学会了在遮挡严重的情况下“脑补”出真实的道路拓扑结构。

      ### 关键数据
      - **识别准确率**：从 60.5% 提升至 92.3%。
      - **人工复核成本**：降低了 75%。
      - **更新周期**：从月级缩短至天级。

      ### 对我们的启示
      我们的“台湾地图”项目在处理老旧街区和复杂巷弄时，可以借鉴这种“多源数据融合+大模型推理”的思路。特别是利用现有的街景影像进行自动化的属性提取，将极大加速 Q2 的重点城市覆盖进度。
    `,
    category: '应用案例',
    source: 'TechCrunch',
    date: '2026-02-23',
    readTime: '8 min',
    imageUrl: 'https://picsum.photos/seed/ai2/800/450',
    relevance: 95,
    tags: ['地图', '自动化测绘', '多模态']
  },
  {
    id: '3',
    title: '全球 AI 治理框架达成初步共识，强调数据隐私与透明度',
    summary: '在最新的全球 AI 峰会上，各国代表就 AI 模型的数据来源透明度达成一致。这要求我们在构建“经验库”和“日报监控”系统时，更加注重数据脱敏与合规性管理。',
    fullContent: `
      全球 AI 治理进入新阶段。

      ### 核心原则
      1. **透明度**：模型开发者必须公开训练数据的来源和处理流程。
      2. **隐私保护**：严格限制个人敏感信息在模型训练中的使用。
      3. **问责机制**：建立 AI 决策的追溯与解释机制。

      ### 落地建议
      我们在推进 GIA 智能体时，必须建立严格的“数据防火墙”。
      - **日报脱敏**：在进入 AI 分析流程前，自动识别并掩码姓名、电话等敏感信息。
      - **审计日志**：记录每一次 AI 调用的输入输出，确保过程可追溯。
    `,
    category: '政策法规',
    source: 'Reuters',
    date: '2026-02-22',
    readTime: '6 min',
    imageUrl: 'https://picsum.photos/seed/ai3/800/450',
    relevance: 85,
    tags: ['合规', '隐私', '治理']
  },
  {
    id: '4',
    title: '英伟达发布全新 Blackwell 架构 GPU，算力成本降低 40%',
    summary: '新一代 GPU 的发布将显著降低大模型微调和推理的成本。对于我们部门正在推进的“地址大模型”训练，这预示着未来更低的算力投入和更快的迭代速度。',
    fullContent: `
      英伟达再次刷新算力巅峰。

      ### 性能指标
      Blackwell 架构在 FP8 精度下的推理性能是 Hopper 架构的 5 倍。更重要的是，它引入了全新的液冷方案，使得单位算力的能耗降低了 25%。

      ### 业务价值
      对于基础产品部而言，这意味着：
      - **模型训练加速**：原本需要 2 周的地址模型微调，现在可能只需 3 天。
      - **推理成本下降**：我们可以为更多的业务场景提供实时 AI 支持，而无需担心高昂的 API 调用费用。
    `,
    category: '行业动态',
    source: 'NVIDIA News',
    date: '2026-02-21',
    readTime: '4 min',
    imageUrl: 'https://picsum.photos/seed/ai4/800/450',
    relevance: 90,
    tags: ['算力', 'GPU', '成本优化']
  }
];

const AINews: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  
  // Manual Add State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newArticleUrl, setNewArticleUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const categories = ['全部', '行业动态', '技术突破', '应用案例', '政策法规'];

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setIsSyncing(false);
      // In a real app, we would fetch new data here
    }, 2000);
  };

  const handleAddNews = () => {
    if (!newArticleUrl.trim()) return;
    setIsAnalyzing(true);
    
    // Simulate AI analysis and categorization
    setTimeout(() => {
      const categories: ('行业动态' | '技术突破' | '应用案例' | '政策法规')[] = ['行业动态', '技术突破', '应用案例', '政策法规'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const newItem: NewsItem = {
        id: `custom-${Date.now()}`,
        title: 'AI 自动提取：' + (newArticleUrl.length > 30 ? newArticleUrl.substring(0, 30) + '...' : newArticleUrl),
        summary: '这是 AI 自动生成的摘要。该资讯与我们的业务高度相关，建议重点关注。员工自主添加的资讯已自动归类并计算个人学习贡献值。',
        fullContent: '这是 AI 自动抓取并总结的全文内容...\n\n来源链接：' + newArticleUrl,
        category: randomCategory,
        source: '外部链接',
        date: new Date().toISOString().split('T')[0],
        readTime: '3 min',
        imageUrl: `https://picsum.photos/seed/${Date.now()}/800/450`,
        relevance: 88,
        tags: ['AI推荐', '团队学习'],
        contributor: 'Alex' // Simulated current user
      };
      
      setNews([newItem, ...news]);
      setIsAnalyzing(false);
      setShowAddModal(false);
      setNewArticleUrl('');
    }, 1500);
  };

  const filteredNews = news.filter(item => {
    const matchesCategory = activeCategory === '全部' || item.category === activeCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-100">
              <Sparkles size={20} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">AI 行业资讯同步</h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            每日同步全球 AI 进展，深度关联地图与位置服务行业，助力团队持续进化。
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜索资讯..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 pr-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all w-64 shadow-sm"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 border border-indigo-100 text-xs font-black uppercase rounded-2xl hover:bg-indigo-50 transition-all shadow-sm"
          >
            <Plus size={16} />
            推荐资讯
          </button>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-xs font-black uppercase rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50"
          >
            <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
            {isSyncing ? '同步中...' : '立即同步'}
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
              activeCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Detail Modal */}
      <AnimatePresence>
        {selectedNews && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNews(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl relative z-10 overflow-hidden flex flex-col border border-white/20"
            >
              <div className="relative h-64 flex-shrink-0">
                <img 
                  src={selectedNews.imageUrl} 
                  alt={selectedNews.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
                >
                  <X size={24} />
                </button>
                <div className="absolute bottom-8 left-10 right-10">
                  <span className="px-3 py-1 bg-indigo-600 text-[10px] font-black text-white uppercase rounded-lg mb-4 inline-block">
                    {selectedNews.category}
                  </span>
                  <h2 className="text-3xl font-black text-white leading-tight">{selectedNews.title}</h2>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-10 space-y-8 scrollbar-thin">
                <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">发布日期</span>
                      <span className="text-sm font-bold text-slate-700">{selectedNews.date}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">来源</span>
                      <span className="text-sm font-bold text-slate-700">{selectedNews.source}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100" />
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">阅读时长</span>
                      <span className="text-sm font-bold text-slate-700">{selectedNews.readTime}</span>
                    </div>
                    {selectedNews.contributor && (
                      <>
                        <div className="w-px h-8 bg-slate-100" />
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">贡献者</span>
                          <span className="text-sm font-bold text-indigo-600 flex items-center gap-1">
                            <User size={14} /> {selectedNews.contributor}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"><Bookmark size={20} /></button>
                    <button className="p-3 bg-slate-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"><Share2 size={20} /></button>
                  </div>
                </div>

                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-600 font-medium leading-relaxed whitespace-pre-wrap text-base">
                    {selectedNews.fullContent}
                  </div>
                </div>

                <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-indigo-600 text-white rounded-xl"><Zap size={18} /></div>
                    <h4 className="text-sm font-black text-indigo-900 uppercase tracking-widest">行业深度关联分析</h4>
                  </div>
                  <p className="text-sm text-indigo-800 font-medium leading-relaxed">
                    该资讯与我们当前的“{selectedNews.tags[0]}”技术主线高度契合。建议相关团队在下周的周会中讨论如何将此技术突破应用到现有的业务流程中，以提升整体执行效能。
                  </p>
                </div>
              </div>
              
              <div className="p-8 bg-slate-50 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={() => setSelectedNews(null)}
                  className="px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-slate-800 transition-all"
                >
                  关闭阅读
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Featured News / Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Feed */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredNews.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:hidden" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-[10px] font-black text-slate-900 uppercase rounded-lg shadow-sm">
                        {item.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-8 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="flex items-center gap-1"><Clock size={12} /> {item.date}</span>
                        <span className="w-1 h-1 bg-slate-300 rounded-full" />
                        <span>{item.source}</span>
                        {item.contributor && (
                          <>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-indigo-500 flex items-center gap-1 bg-indigo-50 px-2 py-0.5 rounded-md">
                              <User size={10} /> {item.contributor} 贡献
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Bookmark size={16} /></button>
                        <button className="p-2 text-slate-300 hover:text-indigo-600 transition-colors"><Share2 size={16} /></button>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-black text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors leading-tight">
                      {item.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6 line-clamp-2">
                      {item.summary}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {item.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <button 
                        onClick={() => setSelectedNews(item)}
                        className="flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest group/btn"
                      >
                        阅读全文 <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredNews.length === 0 && (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                <Search size={32} />
              </div>
              <p className="text-sm font-bold text-slate-400">未找到相关资讯，换个关键词试试？</p>
            </div>
          )}
        </div>

        {/* Sidebar / Stats */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Insight Card */}
          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-indigo-900/20">
            <div className="absolute top-0 right-0 p-10 opacity-10 text-white pointer-events-none rotate-12"><Zap size={120} /></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-white/20 backdrop-blur-md rounded-xl"><Sparkles size={20} /></div>
                <h3 className="text-lg font-black tracking-tight">今日 AI 洞察</h3>
              </div>
              <p className="text-sm text-indigo-100 font-medium leading-relaxed mb-8">
                “多模态大模型在地理空间数据的处理效率上已突破临界点。建议本周重点关注‘自动化测绘’模块的 Prompt 优化，预计可提升 15% 的标注准确率。”
              </p>
              <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">行业相关度</span>
                  <span className="text-xl font-black">92%</span>
                </div>
                <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full border-4 border-indigo-400 border-t-transparent animate-spin" />
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <TrendingUp size={18} className="text-indigo-600" /> 热门话题
            </h3>
            <div className="space-y-4">
              {[
                { label: '多模态地理编码', count: 124, trend: '+12%' },
                { label: '时空大模型', count: 89, trend: '+5%' },
                { label: '自动驾驶仿真', count: 56, trend: '+24%' },
                { label: 'AI 辅助标注', count: 42, trend: '-2%' },
              ].map((topic, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors cursor-pointer group">
                  <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-900">{topic.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-slate-400">{topic.count} 阅读</span>
                    <span className={`text-[10px] font-black ${topic.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {topic.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Progress */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Cpu size={18} className="text-indigo-600" /> 团队 AI 学习力
            </h3>
            <div className="space-y-6">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-black text-slate-900">78%</span>
                <span className="text-[10px] font-black text-emerald-500 uppercase">超越 85% 团队</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '78%' }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full" 
                />
              </div>
              <p className="text-[10px] text-slate-400 font-medium leading-relaxed italic">
                学习力基于资讯阅读时长、经验库贡献、<span className="text-indigo-500 font-bold">资讯推荐次数</span>及 AI 工具调用频率综合计算。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Add News Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isAnalyzing && setShowAddModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden border border-white/20"
            >
              <div className="p-8 pb-6 flex items-center justify-between border-b border-slate-50">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-900">推荐 AI 资讯</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">AI 将自动提取并归类</p>
                  </div>
                </div>
                <button 
                  onClick={() => !isAnalyzing && setShowAddModal(false)} 
                  className="text-slate-400 hover:text-slate-600 p-2 transition-colors"
                  disabled={isAnalyzing}
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-6">
                <div className="space-y-3">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">资讯链接或文本</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-5 top-4 text-indigo-400" size={18} />
                    <textarea 
                      value={newArticleUrl}
                      onChange={(e) => setNewArticleUrl(e.target.value)}
                      placeholder="粘贴文章链接或直接输入资讯内容..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-[1.5rem] pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all placeholder:text-slate-300 min-h-[120px] resize-none"
                      disabled={isAnalyzing}
                    />
                  </div>
                </div>

                {isAnalyzing && (
                  <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center gap-3 animate-pulse">
                    <Sparkles size={24} className="text-indigo-500 animate-bounce" />
                    <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">AI 正在提取内容并智能归类...</p>
                  </div>
                )}
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  disabled={isAnalyzing}
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 font-black text-xs uppercase rounded-2xl hover:bg-slate-100 disabled:opacity-50"
                >
                  取消
                </button>
                <button 
                  onClick={handleAddNews}
                  disabled={!newArticleUrl.trim() || isAnalyzing}
                  className="flex-[2] py-4 bg-indigo-600 text-white font-black text-xs uppercase rounded-2xl hover:bg-indigo-700 shadow-xl disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
                >
                  {isAnalyzing ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" /> 处理中
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} /> 提交并分析
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AINews;
