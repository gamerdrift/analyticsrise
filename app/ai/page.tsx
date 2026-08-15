'use client';

import React, { useState, useEffect, useRef } from 'react';
import { RevenueRiseShell } from '@/app/components/revenuerise/layout/RevenueRiseShell';
import {
  PageHeader,
  Panel,
  Card,
  Button,
  IconButton,
  Badge,
  Input,
  Tabs,
  Progress,
  Drawer,
  EmptyState,
} from '@/app/components/revenuerise/ui';
import {
  Bot,
  Send,
  Sparkles,
  Code2,
  Terminal,
  Cpu,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  ChevronRight,
  Shield,
  Layers,
  HelpCircle,
  BarChart2,
  ExternalLink,
} from 'lucide-react';
import {
  aiMentorClient,
  PedagogicalMode,
  ClientAIMessage,
  ClientAIConversation,
} from '@/lib/ai';
import { authAdapter, entitlementAdapter } from '@/lib/integrations/analyticsrise';

export default function AIMentorStudioPage() {
  const [activeMode, setActiveMode] = useState<PedagogicalMode>('socratic');
  const [inputQuery, setInputQuery] = useState('');
  const [conversations, setConversations] = useState<ClientAIConversation[]>([
    {
      id: 'conv_default_1',
      title: 'PostgreSQL Indexing & Optimization',
      pedagogicalMode: 'socratic',
      lastMessageAt: 'Just now',
      messageCount: 2,
    },
  ]);
  const [activeConvId, setActiveConvId] = useState<string>('conv_default_1');
  const [messages, setMessages] = useState<ClientAIMessage[]>([
    {
      id: 'msg_welcome',
      role: 'assistant',
      content:
        'Welcome to the RevenueRiseAI Mentor Studio. Select a pedagogical mode and ask any data architecture, relational SQL, Python, or market simulation question.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      suggestedFollowUps: [
        'How do I eliminate N+1 queries in PostgreSQL?',
        'What are the performance trade-offs of B-tree vs GIN indexes?',
        'How does Pandas vectorization optimize memory?',
      ],
      suggestedActionRoutes: ['/analytics', '/learning'],
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [quotaRemaining, setQuotaRemaining] = useState<number>(15);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string>('free');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Resolve user entitlement and quota snapshot
    async function loadEntitlements() {
      const user = await authAdapter.getCurrentUser();
      const uid = user?.uid || 'demo-user';
      const entitlement = await entitlementAdapter.getAuthoritativeEntitlement(uid);
      setUserPlan(entitlement.planId);
      const snapshot = await entitlementAdapter.getQuotaSnapshot(uid, 'ai_mentor_queries');
      setQuotaRemaining(snapshot.limit === -1 ? 999 : snapshot.remaining);
    }
    loadEntitlements();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleCreateNewConversation = () => {
    const newId = `conv_${Date.now()}`;
    const newConv: ClientAIConversation = {
      id: newId,
      title: 'New Session',
      pedagogicalMode: activeMode,
      lastMessageAt: 'Just now',
      messageCount: 0,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(newId);
    setMessages([
      {
        id: `msg_init_${Date.now()}`,
        role: 'assistant',
        content: `New session started in ${activeMode.toUpperCase().replace('_', ' ')} mode. How can I assist your engineering architecture today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        suggestedFollowUps: [
          'Explain database indexing trade-offs',
          'Review my Python ETL pipeline logic',
          'Conduct a mock system design interview',
        ],
        suggestedActionRoutes: ['/analytics', '/career'],
      },
    ]);
  };

  const handleDeleteConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeConvId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      if (remaining.length > 0) {
        setActiveConvId(remaining[0].id);
      } else {
        handleCreateNewConversation();
      }
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessageId = `msg_u_${Date.now()}`;
    const newUserMsg: ClientAIMessage = {
      id: userMessageId,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
    };

    setMessages((prev) => [...prev, newUserMsg]);
    if (!queryText) setInputQuery('');
    setIsLoading(true);

    try {
      const result = await aiMentorClient.sendMessage({
        conversationId: activeConvId,
        query: textToSend.trim(),
        pedagogicalMode: activeMode,
        capability: 'ai_mentor',
      });

      const assistantMsg: ClientAIMessage = {
        id: result.messageId,
        role: 'assistant',
        content: result.content,
        codeSnippet: result.codeSnippet,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        suggestedFollowUps: result.suggestedFollowUps,
        suggestedActionRoutes: result.suggestedActionRoutes,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      setQuotaRemaining((prev) => (prev > 0 && prev < 999 ? prev - 1 : prev));

      // Update conversation title if new
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeConvId
            ? {
                ...c,
                title: c.messageCount === 0 ? textToSend.slice(0, 36) + '...' : c.title,
                messageCount: c.messageCount + 2,
                lastMessageAt: 'Just now',
              }
            : c
        )
      );
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg_err_${Date.now()}`,
          role: 'assistant',
          content: `[AI Execution Notice]: ${err?.message || 'Unable to connect to AI engine. Please retry.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'failed',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const modeTabs = [
    { id: 'socratic', label: 'Socratic Guiding', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'direct', label: 'Direct Explanation', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'code_review', label: 'Code Review', icon: <Code2 className="w-3.5 h-3.5" /> },
    { id: 'interview_coach', label: 'Interview Coach', icon: <Bot className="w-3.5 h-3.5" /> },
  ];

  const conversationSidebarContent = (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Conversations</span>
        <Button
          size="sm"
          variant="outline"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
          onClick={handleCreateNewConversation}
        >
          New Chat
        </Button>
      </div>

      <div className="space-y-1 overflow-y-auto flex-1 pr-1">
        {conversations.map((conv) => {
          const isActive = conv.id === activeConvId;
          return (
            <div
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                isActive
                  ? 'bg-white/10 text-white border border-[#00E5FF]/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MessageSquare className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#00E5FF]' : 'text-slate-500'}`} />
                <div className="truncate text-xs font-medium">{conv.title}</div>
              </div>
              <IconButton
                icon={<Trash2 className="w-3.5 h-3.5 text-slate-500 group-hover:text-red-400" />}
                label="Delete Conversation"
                size="sm"
                variant="ghost"
                onClick={(e) => handleDeleteConversation(conv.id, e)}
              />
            </div>
          );
        })}
      </div>

      {/* Quota Indicator Card */}
      <Card className="p-3 bg-[#0A0F1D] border-white/10">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-slate-400">Monthly Usage</span>
          <Badge variant={userPlan === 'free' ? 'default' : 'neural'}>
            {userPlan.toUpperCase()}
          </Badge>
        </div>
        <Progress value={userPlan === 'free' ? ((15 - quotaRemaining) / 15) * 100 : 25} variant="intelligence" />
        <div className="text-[11px] text-slate-400 mt-2 flex justify-between">
          <span>{quotaRemaining === 999 ? 'Unlimited' : `${quotaRemaining} requests remaining`}</span>
          <Shield className="w-3 h-3 text-[#00E5FF]" />
        </div>
      </Card>
    </div>
  );

  return (
    <RevenueRiseShell>
      <div className="space-y-6">
        <PageHeader
          badge={<Badge variant="intelligence" dot>AI Intelligence Engine</Badge>}
          title="AI Mentor & Reasoning Studio"
          subtitle="24/7 Contextual Socratic Coaching • Syntax Diagnosis • Architectural Review"
          description="Interact with the stateful multimodal AI Mentor across multiple pedagogical modes with zero-trust security and automatic token budgeting."
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                leftIcon={<MessageSquare className="w-4 h-4" />}
                onClick={() => setIsMobileDrawerOpen(true)}
              >
                Chats ({conversations.length})
              </Button>
              <Badge variant="outline">Model: mock-intelligence-v1</Badge>
            </div>
          }
        />

        {/* Pedagogical Mode Switcher */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Tabs
            tabs={modeTabs}
            activeTab={activeMode}
            onChange={(id) => setActiveMode(id as PedagogicalMode)}
          />
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Shield className="w-3.5 h-3.5 text-[#00E5FF]" />
            <span>Trusted Backend Execution Boundary Active</span>
          </div>
        </div>

        {/* Main 3-Column / 2-Column Responsive Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Desktop Conversation Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <Panel title="Workspace Sessions" icon={<Layers className="w-4 h-4" />}>
              <div className="h-[520px]">{conversationSidebarContent}</div>
            </Panel>
          </div>

          {/* Center Chat Timeline Console */}
          <div className="col-span-1 lg:col-span-9">
            <Panel
              title={`Console: ${conversations.find((c) => c.id === activeConvId)?.title || 'Active Session'}`}
              icon={<Bot className="w-5 h-5 text-[#00E5FF]" />}
              statusBadge={<Badge variant="neural">Mode: {activeMode.toUpperCase()}</Badge>}
            >
              {/* Message Stream */}
              <div className="space-y-4 min-h-[380px] max-h-[460px] overflow-y-auto pr-2">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 mt-1">
                        <Bot className="w-4 h-4" />
                      </div>
                    )}

                    <div className="max-w-2xl space-y-2">
                      <div
                        className={`p-4 rounded-2xl text-xs leading-relaxed font-sans shadow-lg ${
                          msg.role === 'user'
                            ? 'bg-[#00E5FF]/15 border border-[#00E5FF]/40 text-white font-mono'
                            : 'bg-[#0D1424] border border-white/10 text-slate-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{msg.content}</div>

                        {/* Code Snippet Box */}
                        {msg.codeSnippet && (
                          <div className="mt-3 p-3 rounded-xl bg-[#05070B] border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                            <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-white/5 text-[10px] text-slate-500">
                              <span>SYNTAX PREVIEW</span>
                              <IconButton
                                icon={
                                  copiedId === msg.id ? (
                                    <Check className="w-3 h-3 text-emerald-400" />
                                  ) : (
                                    <Copy className="w-3 h-3 text-slate-400" />
                                  )
                                }
                                label="Copy Code"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleCopy(msg.id, msg.codeSnippet!)}
                              />
                            </div>
                            <pre>{msg.codeSnippet}</pre>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2 mt-2 border-t border-white/5 text-[10px] text-slate-500">
                          <span>{msg.timestamp}</span>
                          {msg.role === 'assistant' && (
                            <IconButton
                              icon={
                                copiedId === msg.id ? (
                                  <Check className="w-3 h-3 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3 h-3 text-slate-400" />
                                )
                              }
                              label="Copy Response"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleCopy(msg.id, msg.content)}
                            />
                          )}
                        </div>
                      </div>

                      {/* Suggested Follow-up Prompt Pills */}
                      {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {msg.suggestedFollowUps.map((prompt, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => handleSendMessage(prompt)}
                              className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00E5FF]/40 text-slate-300 hover:text-white transition-all text-left flex items-center gap-1.5"
                            >
                              <Sparkles className="w-3 h-3 text-[#00E5FF]" />
                              <span>{prompt}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Loading / Typing Indicator */}
                {isLoading && (
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0 animate-pulse">
                      <Bot className="w-4 h-4" />
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#0D1424] border border-white/10 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[#00E5FF] animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 rounded-full bg-cyan-300 animate-bounce [animation-delay:0.4s]" />
                      <span className="text-[11px] font-mono text-slate-400 ml-1">
                        Reasoning with {activeMode.toUpperCase()} policy...
                      </span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Composer Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex gap-2 pt-4 border-t border-white/5 mt-3"
              >
                <Input
                  value={inputQuery}
                  onChange={(e) => setInputQuery(e.target.value)}
                  placeholder={`Ask a technical question or query in ${activeMode} mode...`}
                  disabled={isLoading}
                  leftIcon={<Terminal className="w-4 h-4" />}
                />
                <Button
                  type="submit"
                  isLoading={isLoading}
                  leftIcon={<Send className="w-4 h-4" />}
                  size="md"
                >
                  Send
                </Button>
              </form>
            </Panel>
          </div>
        </div>

        {/* Mobile Slide-out Drawer for Conversations */}
        <Drawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
          title="Conversation Sessions"
          position="left"
        >
          {conversationSidebarContent}
        </Drawer>
      </div>
    </RevenueRiseShell>
  );
}
