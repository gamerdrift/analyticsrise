'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Sparkles, Terminal, Shield, ChevronRight } from 'lucide-react';
import { AiEvaMessage as MessageType, AiEvaContext } from '@/lib/ai/eva/types';
import { aiEvaClient } from '@/lib/ai/eva/aiEvaClient';
import { getAiEvaQuotaState } from '@/lib/ai/eva/limits';
import { AiEvaChat } from './AiEvaChat';
import { AiEvaInput } from './AiEvaInput';
import { AiEvaContextBadge } from './AiEvaContextBadge';
import { AiEvaLimitNotice } from './AiEvaLimitNotice';
import { ArTriangleIcon } from '@/app/components/brand';
import { AnalyticsService } from '@/lib/services/analytics';
import { useAuth } from '@/lib/hooks/useAuth';

interface AiEvaPanelProps {
  isOpen: boolean;
  onClose: () => void;
  context?: AiEvaContext;
  onInsertCodeSnippet?: (code: string) => void;
}

export function AiEvaPanel({
  isOpen,
  onClose,
  context,
  onInsertCodeSnippet,
}: AiEvaPanelProps) {
  const { currentUser, userProfile } = useAuth();
  const isPro = (userProfile as any)?.tier === 'pro' || (userProfile as any)?.tier === 'enterprise';

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState(() => getAiEvaQuotaState(currentUser?.uid, isPro));

  // Log open event and update quota
  useEffect(() => {
    if (isOpen) {
      AnalyticsService.logAiEvaOpened({
        product: context?.product || 'sql-studio',
        challengeId: context?.challengeId,
      });
      setQuota(getAiEvaQuotaState(currentUser?.uid, isPro));
    }
  }, [isOpen, context?.product, context?.challengeId, currentUser?.uid, isPro]);


  if (!isOpen) return null;

  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: MessageType = {
      id: `msg_user_${Date.now()}`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    setMessages(newHistory);
    setIsLoading(true);

    try {
      const response = await aiEvaClient.sendMessage(userText, messages, context, isPro);

      const assistantMessage: MessageType = {
        id: response.id,
        role: 'assistant',
        content: response.content,
        codeSnippet: response.codeSnippet,
        suggestedPrompts: response.suggestedPrompts,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([...newHistory, assistantMessage]);
    } catch (err: any) {
      const errorMessage: MessageType = {
        id: `msg_err_${Date.now()}`,
        role: 'assistant',
        content: `⚠️ Something went wrong while connecting to AI-EVA. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, errorMessage]);
    } finally {
      setIsLoading(false);
      setQuota(getAiEvaQuotaState(currentUser?.uid, isPro));
    }

  };

  const handleResetConversation = () => {
    setMessages([]);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[440px] md:w-[480px] lg:w-[500px] bg-[#05070B] border-l border-white/10 shadow-2xl flex flex-col font-sans animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="h-14 border-b border-white/10 bg-[#080C14] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/15 border border-[#00E5FF]/40 flex items-center justify-center shadow-sm shadow-[#00E5FF]/20">
            <ArTriangleIcon size={18} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-black font-display text-white tracking-wider uppercase">
                AI-EVA
              </h2>
              <span className="text-[10px] text-slate-500 font-mono">· SQL Studio</span>
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              Active Learning Assistant
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetConversation}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Close AI-EVA"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Context Badge Subheader */}
      {context && (
        <div className="px-4 py-2 border-b border-white/5 bg-[#0D1117]/50 flex items-center justify-between">
          <AiEvaContextBadge context={context} />
        </div>
      )}

      {/* Main Chat Thread */}
      <main className="flex-1 p-4 overflow-hidden flex flex-col justify-between">
        <AiEvaChat
          messages={messages}
          isLoading={isLoading}
          context={context}
          onSelectPrompt={handleSendMessage}
          onApplyCodeSnippet={onInsertCodeSnippet}
          className="flex-1"
        />

        {/* Footer with Quota Notice + Input */}
        <div className="mt-3 pt-3 border-t border-white/5 flex flex-col gap-2.5 shrink-0">
          <AiEvaLimitNotice quota={quota} />
          <AiEvaInput
            onSend={handleSendMessage}
            isLoading={isLoading}
            disabled={quota.queriesRemaining === 0}
          />
        </div>
      </main>
    </div>
  );
}

export default AiEvaPanel;
