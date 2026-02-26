
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, Loader2, Sparkles, Copy, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { queryTeamKnowledge } from '../services/geminiService';
import { MOCK_SUPPORT_PROJECTS } from '../constants';
import { Goal } from '../types';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

interface AIChatbotProps {
  goals: Goal[];
}

const AIChatbot: React.FC<AIChatbotProps> = ({ goals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: '您好！我是基础产品部 AI 助手。我可以帮您查询团队进度、事业部支撑情况或目标风险。' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setLoading(true);

    const context = `
      目标状态明细：${JSON.stringify(goals.map(g => ({ name: g.name, progress: g.progress, status: g.status, owner: g.owner })))}
      事业部支撑记录：${JSON.stringify(MOCK_SUPPORT_PROJECTS.map(s => ({ name: s.name, bu: s.bu, impact: s.valueImpact })))}
    `;

    try {
      const response = await queryTeamKnowledge(userMsg, context);
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: '抱歉，系统响应超时，请稍后再试。' }]);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleExpand = (id: number) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const LONG_TEXT_THRESHOLD = 180;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-2xl hover:scale-105 hover:bg-indigo-700 transition-all group relative"
        >
          <Bot size={32} />
          <div className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 border-2 border-white"></span>
          </div>
        </button>
      )}

      {isOpen && (
        <div className="w-[420px] h-[600px] bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-300">
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 flex items-center justify-between text-white shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md">
                <Sparkles size={20} />
              </div>
              <div>
                <span className="font-bold block leading-none">GIA 全域助手</span>
                <span className="text-[10px] text-white/70 font-medium">Gemini Pro Powered</span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/50 scroll-smooth">
            {messages.map((m, i) => {
              const isLong = m.text.length > LONG_TEXT_THRESHOLD;
              const isExpanded = expandedIds.has(i);
              const displayText = (isLong && !isExpanded) ? m.text.slice(0, LONG_TEXT_THRESHOLD) + '...' : m.text;

              return (
                <div key={i} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                  <div className={`group relative max-w-[90%] px-5 py-3.5 rounded-2xl text-[14px] leading-relaxed shadow-sm transition-all ${
                    m.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{displayText}</p>
                    {m.role === 'bot' && (
                      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => copyToClipboard(m.text, i)}
                            className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors"
                          >
                            {copiedId === i ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            {copiedId === i ? '已复制' : '复制'}
                          </button>
                        </div>
                        {isLong && (
                          <button 
                            onClick={() => toggleExpand(i)}
                            className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                          >
                            {isExpanded ? (
                              <><ChevronUp size={12} /> 收起</>
                            ) : (
                              <><ChevronDown size={12} /> 展开详情</>
                            )}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1.5 uppercase tracking-tighter">
                    {m.role === 'user' ? 'You' : 'GIA Agent'}
                  </span>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start animate-in fade-in slide-in-from-left-2">
                <div className="bg-white px-5 py-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-3">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full animate-bounce"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-400 italic">检索实时战略大图中...</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-5 bg-white border-t border-slate-100">
            <div className="relative flex items-center gap-2 bg-slate-100 rounded-2xl p-1 px-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all">
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="询问进度、风险或支撑价值..."
                className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium focus:outline-none placeholder:text-slate-400"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  input.trim() && !loading 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbot;
