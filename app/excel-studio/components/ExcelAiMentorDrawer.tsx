'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { evaluateFormula, formatCellReference } from '@/lib/utils/excel/formulaEvaluator';
import { Bot, X, Sparkles, Send, HelpCircle, AlertTriangle, Lightbulb, PieChart, Check } from 'lucide-react';

export default function ExcelAiMentorDrawer() {
  const { state, dispatch } = useExcelStudio();
  const { isAiMentorOpen, activeSheetId, sheets, selectedCell } = state;
  const sheet = sheets[activeSheetId];

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; code?: string }>>([
    {
      sender: 'ai',
      text: 'Greetings Analyst! I am your AnalyticsRise AI Excel Mentor. Ask me to build a formula, diagnose spreadsheet errors, or explain complex functions like XLOOKUP or VLOOKUP.',
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isAiMentorOpen) return null;

  const activeCellKey = selectedCell ? `${selectedCell.row},${selectedCell.col}` : '0,0';
  const activeCellObj = sheet?.cells[activeCellKey];
  const activeCellRef = selectedCell ? formatCellReference(selectedCell.row, selectedCell.col) : 'A1';

  const handleSendPrompt = (customPrompt?: string) => {
    const query = customPrompt || prompt;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setPrompt('');
    setIsProcessing(true);

    setTimeout(() => {
      let aiResponseText = '';
      let generatedFormula = '';

      const lower = query.toLowerCase();

      if (lower.includes('sum') || lower.includes('total') || lower.includes('add')) {
        aiResponseText = `Here is the optimal formula to calculate the total sum for range B2 to B10:`;
        generatedFormula = `=SUM(B2:B10)`;
      } else if (lower.includes('average') || lower.includes('avg') || lower.includes('mean')) {
        aiResponseText = `To calculate the arithmetic mean across your sales data, use the AVERAGE function:`;
        generatedFormula = `=AVERAGE(B2:E2)`;
      } else if (lower.includes('xlookup') || lower.includes('vlookup') || lower.includes('lookup')) {
        aiResponseText = `XLOOKUP is the modern, powerful replacement for VLOOKUP. It searches column B for your key and returns values from column C:`;
        generatedFormula = `=XLOOKUP(A2, B2:B20, C2:C20, "Not Found")`;
      } else if (lower.includes('if') || lower.includes('condition') || lower.includes('target')) {
        aiResponseText = `You can evaluate conditional logic with the IF function:`;
        generatedFormula = `=IF(F2>100000, "Target Met", "Below Target")`;
      } else if (lower.includes('error') || lower.includes('diagnose') || lower.includes('#')) {
        aiResponseText = `I analyzed cell ${activeCellRef}. Ensure all cell references in range formulas contain numeric values and no circular dependencies exist.`;
      } else if (lower.includes('pivot') || lower.includes('table')) {
        aiResponseText = `Pivot Tables allow you to summarize and slice multi-dimensional business datasets instantly. Group your segments in Rows and drag Revenue metrics to Values!`;
      } else {
        aiResponseText = `Based on your active cell ${activeCellRef} and worksheet "${sheet?.name}", here is a recommended analytical formula:`;
        generatedFormula = `=IF(SUM(B2:E2)>50000, "High Margin", "Standard")`;
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: aiResponseText, code: generatedFormula || undefined },
      ]);
      setIsProcessing(false);
    }, 600);
  };

  const handleApplyFormula = (code: string) => {
    if (!selectedCell) return;
    dispatch({
      type: 'UPDATE_CELL',
      payload: {
        address: selectedCell,
        value: '',
        formula: code,
      },
    });
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-[#0D1117] border-l border-[#00E5FF]/30 shadow-2xl z-50 flex flex-col font-mono text-xs text-white">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#05070B]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-[#00E5FF]">AI Excel Mentor</h3>
            <span className="text-[10px] text-slate-400">Context: Cell {activeCellRef} ({sheet?.name})</span>
          </div>
        </div>
        <button
          onClick={() => dispatch({ type: 'TOGGLE_AI_MENTOR', payload: false })}
          className="text-slate-400 hover:text-white p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-[#0A0D12] border-b border-white/5 flex gap-1.5 overflow-x-auto scrollbar-thin">
        <button
          onClick={() => handleSendPrompt('Build formula for total sum')}
          className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] whitespace-nowrap hover:bg-[#00E5FF]/20"
        >
          ✨ Build SUM
        </button>
        <button
          onClick={() => handleSendPrompt('Explain XLOOKUP vs VLOOKUP')}
          className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] whitespace-nowrap hover:bg-[#00E5FF]/20"
        >
          🔍 XLOOKUP
        </button>
        <button
          onClick={() => handleSendPrompt('Diagnose spreadsheet errors')}
          className="px-2.5 py-1 rounded bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/20 text-[10px] whitespace-nowrap hover:bg-[#00E5FF]/20"
        >
          ⚠️ Fix Error
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 scrollbar-thin">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[90%] ${
              m.sender === 'user'
                ? 'ml-auto bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/30'
                : 'mr-auto bg-[#05070B] text-slate-200 border border-slate-800'
            }`}
          >
            <p className="leading-snug">{m.text}</p>
            {m.code && (
              <div className="mt-2 p-2 bg-black/60 rounded border border-[#00E5FF]/40 text-[#00E5FF] font-bold flex items-center justify-between gap-2">
                <code>{m.code}</code>
                <button
                  onClick={() => handleApplyFormula(m.code!)}
                  className="px-2 py-1 bg-[#00E5FF] text-black text-[10px] rounded hover:bg-[#4FC3F7] font-bold transition-colors shrink-0"
                >
                  Insert Cell {activeCellRef}
                </button>
              </div>
            )}
          </div>
        ))}
        {isProcessing && (
          <div className="p-3 rounded-xl bg-[#05070B] text-[#00E5FF] border border-slate-800 animate-pulse text-[11px]">
            AI Mentor analyzing formulas & cell context...
          </div>
        )}
      </div>

      {/* Prompt Input */}
      <div className="p-3 border-t border-white/10 bg-[#05070B] flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
          placeholder="Ask AI Mentor to build formula..."
          className="flex-1 bg-[#0D1117] border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF] text-xs"
        />
        <button
          onClick={() => handleSendPrompt()}
          disabled={!prompt.trim()}
          className="p-2 rounded-lg bg-[#00E5FF] text-black font-bold disabled:opacity-40 hover:bg-[#4FC3F7] transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
