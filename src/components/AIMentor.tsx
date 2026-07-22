'use client';

// src/components/AIMentor.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bot, Send, Sparkles, X, Minimize2, Maximize2, Code, Lightbulb, ChevronRight } from 'lucide-react';
import { aiMentorService, ChatMessage, AIMentorContext } from '@/lib/services/aiMentorService';
import { motion, AnimatePresence } from 'framer-motion';

export interface AIMentorProps {
  mode?: 'floating' | 'embedded';
  context?: AIMentorContext;
  title?: string;
  className?: string;
}

export default function AIMentor({
  mode = 'floating',
  context = {},
  title = 'AI Analytics Mentor',
  className = '',
}: AIMentorProps) {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [inputMsg, setInputMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: `Hello! I am your AI Analytics Mentor. Ask me any question about SQL queries, Excel formulas, Python DataFrames, Power BI DAX, or your career roadmap!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const suggestedQuestions = aiMentorService.getSuggestedQuestions(context);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputMsg).trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg('');
    setIsTyping(true);

    try {
      const response = await aiMentorService.sendMessage(text, context, messages);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: response.message,
        codeSnippet: response.codeSnippet,
        suggestedActions: response.suggestedFollowUps,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'system',
        text: 'Unable to reach AI Mentor service. Please check your connectivity.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderChatBody = () => (
    <div className="flex flex-col h-full bg-[#0D1117] text-white">
      {/* Header */}
      <div className="p-3.5 border-b border-white/10 bg-[#161B22] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#00E5FF] to-[#4FC3F7] flex items-center justify-center text-black">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white flex items-center gap-1.5">
              {title}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            <span className="text-[9px] font-mono text-slate-400 block">Neural Intelligence Core v6.0</span>
          </div>
        </div>

        {mode === 'floating' && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setMinimized(!minimized)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
            >
              {minimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => setOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-white/5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {!minimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 scrollbar-thin text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-xl shadow-md ${
                    m.sender === 'user'
                      ? 'bg-[#00E5FF] text-black font-medium rounded-tr-none'
                      : m.sender === 'system'
                      ? 'bg-rose-950/80 text-rose-200 border border-rose-800'
                      : 'bg-[#161B22] text-slate-200 border border-white/10 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed whitespace-pre-wrap">{m.text}</p>

                  {m.codeSnippet && (
                    <div className="mt-2.5 p-2.5 rounded bg-[#05070B] border border-white/10 font-mono text-[11px] text-[#00E5FF] overflow-x-auto relative">
                      <div className="flex justify-between items-center text-[9px] text-slate-500 pb-1 mb-1 border-b border-white/5">
                        <span className="flex items-center gap-1 uppercase font-bold">
                          <Code className="w-3 h-3 text-[#00E5FF]" /> Suggested Code
                        </span>
                      </div>
                      <pre>{m.codeSnippet}</pre>
                    </div>
                  )}

                  <span className={`text-[8px] font-mono block mt-1.5 ${m.sender === 'user' ? 'text-black/60 text-right' : 'text-slate-500'}`}>
                    {m.timestamp}
                  </span>
                </div>

                {/* Follow-up chips */}
                {m.suggestedActions && m.suggestedActions.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 max-w-[85%]">
                    {m.suggestedActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(action)}
                        className="px-2.5 py-1 rounded-full bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] font-mono flex items-center gap-1 transition-colors text-left"
                      >
                        <ChevronRight className="w-3 h-3" /> {action}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono p-2 bg-[#161B22] border border-white/5 rounded-lg w-fit animate-pulse">
                <Sparkles className="w-3.5 h-3.5 text-[#00E5FF]" />
                <span>AI Mentor is analyzing workspace context...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Drawer if empty input */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-[#05070B] border-t border-white/5">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block mb-1.5 flex items-center gap-1">
                <Lightbulb className="w-3 h-3 text-amber-400" /> Suggested Prompts
              </span>
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="px-2 py-1 rounded bg-[#161B22] hover:bg-[#1E293B] text-slate-300 text-[10px] font-mono border border-white/5 whitespace-nowrap shrink-0 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 bg-[#161B22] border-t border-white/10 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask mentor (SQL, formulas, roadmap)..."
              className="flex-1 bg-[#05070B] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF]"
            />
            <button
              type="submit"
              disabled={!inputMsg.trim() || isTyping}
              className="p-2 rounded-lg bg-[#00E5FF] text-black hover:bg-[#4FC3F7] disabled:opacity-40 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </>
      )}
    </div>
  );

  if (mode === 'embedded') {
    return (
      <div className={`rounded-xl border border-white/10 overflow-hidden shadow-xl h-[480px] flex flex-col ${className}`}>
        {renderChatBody()}
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-80 sm:w-96 h-[500px] rounded-2xl border border-[#00E5FF]/30 shadow-2xl overflow-hidden mb-4"
          >
            {renderChatBody()}
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] text-black font-bold font-display shadow-2xl hover:scale-105 transition-all duration-300"
          aria-label="Open AI Mentor"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-950 animate-ping absolute top-2 right-2" />
          <Bot className="w-5 h-5 text-black" />
          <span className="text-xs uppercase tracking-wider font-extrabold hidden sm:inline">AI Mentor</span>
        </button>
      )}
    </div>
  );
}
