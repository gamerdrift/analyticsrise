'use client';

import React, { useState } from 'react';
import { useExcelStudio, ConditionalRule } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { Sparkles, X, Palette, Trash2 } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConditionalFormattingModal({ isOpen, onClose }: Props) {
  const { state, dispatch } = useExcelStudio();
  const [ruleType, setRuleType] = useState<ConditionalRule['type']>('greater');
  const [thresholdVal, setThresholdVal] = useState('50000');
  const [targetColor, setTargetColor] = useState('#00E5FF');

  if (!isOpen) return null;

  const handleAddRule = () => {
    const newRule: ConditionalRule = {
      id: `rule_${Date.now()}`,
      type: ruleType,
      value: isNaN(Number(thresholdVal)) ? thresholdVal : Number(thresholdVal),
      targetColor,
    };
    dispatch({ type: 'ADD_CONDITIONAL_RULE', payload: { rule: newRule } });

    // Also apply a quick format to active selection range for visual feedback
    dispatch({
      type: 'APPLY_FORMATTING',
      payload: { formatting: { bgColor: `${targetColor}20`, fontColor: targetColor, bold: true } },
    });
    onClose();
  };

  const handleClear = () => {
    dispatch({ type: 'CLEAR_CONDITIONAL_RULES' });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#00E5FF]/30 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 font-mono text-xs text-white relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 border-b border-white/10 pb-3">
          <Palette className="w-5 h-5 text-[#00E5FF]" />
          <span className="font-bold text-sm uppercase tracking-wider text-[#00E5FF]">Conditional Formatting</span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-slate-400 mb-1">Rule Type:</label>
            <select
              value={ruleType}
              onChange={(e) => setRuleType(e.target.value as any)}
              className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
            >
              <option value="greater">Cell Value Greater Than</option>
              <option value="less">Cell Value Less Than</option>
              <option value="equal">Cell Value Equals</option>
              <option value="contains">Text Contains</option>
              <option value="color_scale">Heatmap 3-Color Scale</option>
            </select>
          </div>

          {ruleType !== 'color_scale' && (
            <div>
              <label className="block text-slate-400 mb-1">Value / Threshold:</label>
              <input
                type="text"
                value={thresholdVal}
                onChange={(e) => setThresholdVal(e.target.value)}
                placeholder="e.g. 50000"
                className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#00E5FF]"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 mb-1">Highlight Color Accent:</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={targetColor}
                onChange={(e) => setTargetColor(e.target.value)}
                className="w-10 h-10 rounded border-none cursor-pointer bg-transparent"
              />
              <span className="text-slate-300 font-bold uppercase">{targetColor}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-white/10">
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 font-bold transition-colors flex items-center gap-1"
          >
            <Trash2 className="w-4 h-4" /> Clear Rules
          </button>
          <button
            onClick={handleAddRule}
            className="px-4 py-2 rounded-lg bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" /> Apply Rule
          </button>
        </div>
      </div>
    </div>
  );
}
