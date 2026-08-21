'use client';

import React, { useState, useEffect } from 'react';
import { X, RotateCcw, Sparkles, Terminal, Shield, ChevronRight, FileSpreadsheet, CheckSquare, Lock } from 'lucide-react';
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
  onToggleShareSample?: () => void;
  isSampleShared?: boolean;
}

export function AiEvaPanel({
  isOpen,
  onClose,
  context,
  onInsertCodeSnippet,
  onToggleShareSample,
  isSampleShared = false,
}: AiEvaPanelProps) {
  const { currentUser, userProfile } = useAuth();
  const isPro = (userProfile as any)?.tier === 'pro' || (userProfile as any)?.tier === 'enterprise';

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [quota, setQuota] = useState(() => getAiEvaQuotaState(currentUser?.uid, isPro));

  const isExcel = context?.product === 'excel-workspace' || context?.product === 'excel-studio';
  const excel = context?.excelContext;

  // Log open event and update quota
  useEffect(() => {
    if (isOpen) {
      if (isExcel) {
        AnalyticsService.logAiEvaExcelOpened({
          sheetCount: excel?.sheetCount || 1,
          rowCount: excel?.rowCount || 0,
          hasFormulaSelected: Boolean(excel?.activeFormula?.formulaText),
        });
      } else {
        AnalyticsService.logAiEvaOpened({
          product: context?.product || 'sql-studio',
          challengeId: context?.challengeId,
        });
      }
      setQuota(getAiEvaQuotaState(currentUser?.uid, isPro));
    }
  }, [isOpen, context?.product, context?.challengeId, currentUser?.uid, isPro, isExcel, excel?.sheetCount, excel?.rowCount, excel?.activeFormula?.formulaText]);

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
      if (isExcel) {
        AnalyticsService.logAiEvaExcelPromptSent({
          promptLength: userText.length,
          hasFormulaContext: Boolean(excel?.activeFormula?.formulaText),
          hasSampleApproved: Boolean(excel?.approvedSample?.userApproved),
        });
      }

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
              <span className="text-[10px] text-slate-500 font-mono">
                · {isExcel ? 'Excel Workspace' : 'SQL Studio'}
              </span>
            </div>
            <span className="text-[10px] font-mono text-[#00E5FF] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
              {isExcel ? 'Spreadsheet Intelligence' : 'Active Learning Assistant'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleResetConversation}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
              title="Reset conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            title="Close AI-EVA"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Context Badge & Optional Sample Sharing Subheader */}
      {context && (
        <div className="px-4 py-2 border-b border-white/5 bg-[#0D1117]/50 flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <AiEvaContextBadge context={context} />
          </div>

          {/* Level 2 Sample Sharing Control for Excel */}
          {isExcel && onToggleShareSample && (
            <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3 text-slate-500" />
                <span>Range Sharing:</span>
              </span>
              <button
                type="button"
                onClick={onToggleShareSample}
                className={`px-2 py-0.5 rounded border text-[10px] font-bold tracking-wider uppercase transition-all flex items-center gap-1 cursor-pointer ${
                  isSampleShared
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
                }`}
                title="Explicitly share a small sample of your selected range with AI-EVA"
              >
                <CheckSquare className="w-3 h-3" />
                <span>{isSampleShared ? 'Sample Attached (Active)' : 'Share Selected Range'}</span>
              </button>
            </div>
          )}
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
            placeholder={
              isExcel
                ? 'Ask AI-EVA about formulas, data cleaning, errors, or charts...'
                : 'Ask AI-EVA a question about your query, errors, or concepts...'
            }
          />
        </div>
      </main>
    </div>
  );
}

export default AiEvaPanel;
