'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';
import { Target, Trophy, Award, CheckCircle2, AlertCircle, Lightbulb, Bot, ChevronRight, Zap } from 'lucide-react';

export interface Mission {
  id: string;
  title: string;
  category: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Interview Challenge';
  objective: string;
  instructions: string[];
  targetCell: string; // e.g. "F5"
  expectedFormulaSubstring?: string; // e.g. "SUM"
  expectedMinNumericValue?: number;
  xpReward: number;
  badgeReward: string;
  hint: string;
}

export const MISSIONS_LIST: Mission[] = [
  {
    id: 'mission_beginner_1',
    title: 'Mission 1: Quarterly Sales Aggregation',
    category: 'Beginner',
    objective: 'Calculate the total annual sales for Enterprise Software across Q1 to Q4 using the SUM function.',
    instructions: [
      'Select cell F2 (Row 2, Column F).',
      'Enter the formula =SUM(B2:E2) into the formula bar.',
      'Press Enter to evaluate total quarterly sales.',
    ],
    targetCell: 'F2',
    expectedFormulaSubstring: 'SUM',
    expectedMinNumericValue: 500000,
    xpReward: 150,
    badgeReward: 'Excel SUM Apprentice',
    hint: 'Type =SUM(B2:E2) in cell F2 to sum Q1 through Q4.',
  },
  {
    id: 'mission_intermediate_2',
    title: 'Mission 2: Target Met Logical Audit',
    category: 'Intermediate',
    objective: 'Write an IF function to determine if Enterprise annual total exceeds $500,000.',
    instructions: [
      'Select cell H2.',
      'Enter formula =IF(F2>500000, "Target Met", "Below Target")',
      'Verify the evaluated text returns "Target Met".',
    ],
    targetCell: 'H2',
    expectedFormulaSubstring: 'IF',
    xpReward: 250,
    badgeReward: 'Logic Master',
    hint: 'Use =IF(F2>500000, "Target Met", "Below Target") in cell H2.',
  },
  {
    id: 'mission_advanced_3',
    title: 'Mission 3: Dynamic XLOOKUP Search',
    category: 'Advanced',
    objective: 'Use XLOOKUP to dynamically search the SKU catalog for product pricing.',
    instructions: [
      'Load the Retail Inventory sample dataset.',
      'Select cell F2.',
      'Write =XLOOKUP(A2, A2:A10, C2:C10) to return unit prices.',
    ],
    targetCell: 'F2',
    expectedFormulaSubstring: 'XLOOKUP',
    xpReward: 400,
    badgeReward: 'XLOOKUP Specialist',
    hint: 'XLOOKUP takes (lookup_value, lookup_array, return_array).',
  },
  {
    id: 'mission_expert_4',
    title: 'Mission 4: Multi-Criteria COUNTIFS',
    category: 'Expert',
    objective: 'Count total regional orders where Q1 revenue exceeds $40,000.',
    instructions: [
      'Select cell B10.',
      'Enter =COUNTIFS(B2:B5, ">40000")',
      'Verify the calculated count matches your criteria.',
    ],
    targetCell: 'B10',
    expectedFormulaSubstring: 'COUNTIFS',
    xpReward: 500,
    badgeReward: 'Analytics Vanguard',
    hint: 'COUNTIFS allows multi-condition range counting.',
  },
  {
    id: 'mission_interview_5',
    title: 'Mission 5: FAANG Financial Modeling Challenge',
    category: 'Interview Challenge',
    objective: 'Build a net profit waterfall model combining SUM, IF, and percentage margin formulas.',
    instructions: [
      'Select cell F5 in the financial statement dataset.',
      'Calculate Gross Profit minus Operating Cost with =SUM(F2:F3)-F4',
      'Verify net margin accuracy.',
    ],
    targetCell: 'F5',
    expectedFormulaSubstring: 'SUM',
    xpReward: 750,
    badgeReward: 'Wall Street Certified Analyst',
    hint: 'Subtract costs from total revenue using SUM and arithmetic operators.',
  },
];

export default function MissionSidebar() {
  const { state, dispatch } = useExcelStudio();
  const { activeMissionId, missionProgress, sheets, activeSheetId } = state;
  const sheet = sheets[activeSheetId];

  const currentMission = MISSIONS_LIST.find((m) => m.id === activeMissionId) || MISSIONS_LIST[0];
  const isCompleted = Boolean(missionProgress[currentMission.id]?.completed);
  const [showHint, setShowHint] = useState(false);

  // Validate active worksheet state against current mission
  const validateMission = () => {
    if (!sheet) return false;
    let targetCellObj = null;

    // Search for cell matching target reference (e.g. F2 -> row 1, col 5)
    for (const cell of Object.values(sheet.cells)) {
      const cellRefStr = `${String.fromCharCode(65 + cell.address.col)}${cell.address.row + 1}`;
      if (cellRefStr.toUpperCase() === currentMission.targetCell.toUpperCase()) {
        targetCellObj = cell;
        break;
      }
    }

    if (!targetCellObj) return false;

    if (currentMission.expectedFormulaSubstring) {
      if (!targetCellObj.formula || !targetCellObj.formula.toUpperCase().includes(currentMission.expectedFormulaSubstring)) {
        return false;
      }
    }

    if (currentMission.expectedMinNumericValue) {
      const evalVal = Number(evaluateFormula(targetCellObj.formula || String(targetCellObj.value), sheet.cells));
      if (isNaN(evalVal) || evalVal < currentMission.expectedMinNumericValue) {
        return false;
      }
    }

    return true;
  };

  const handleVerify = () => {
    const isValid = validateMission();
    if (isValid) {
      dispatch({ type: 'COMPLETE_MISSION', payload: { missionId: currentMission.id, score: currentMission.xpReward } });
    } else {
      alert(`Mission criteria not yet satisfied in cell ${currentMission.targetCell}. Check your formula syntax!`);
    }
  };

  const completedMissionsCount = Object.values(missionProgress).filter((m) => m.completed).length;
  const completionPercentage = Math.round((completedMissionsCount / MISSIONS_LIST.length) * 100);

  return (
    <div className="space-y-4 font-mono text-xs text-white">
      {/* Header: Gamification Progress */}
      <div className="p-3 bg-[#05070B] border border-[#00E5FF]/30 rounded-xl space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#00E5FF] uppercase tracking-wider flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-amber-400" /> Certification Missions
          </span>
          <span className="px-2 py-0.5 rounded bg-[#00E5FF]/20 text-[#00E5FF] font-bold text-[10px]">
            {completionPercentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#00E5FF] to-emerald-400 h-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      {/* Mission Tier Selector */}
      <div className="space-y-1">
        <label className="text-[10px] uppercase text-slate-400 font-bold">Select Active Mission:</label>
        <select
          value={activeMissionId}
          onChange={(e) => {
            dispatch({ type: 'SET_ACTIVE_MISSION', payload: { missionId: e.target.value } });
            setShowHint(false);
          }}
          className="w-full bg-[#05070B] border border-slate-700 rounded-lg p-2 text-white font-bold focus:outline-none focus:border-[#00E5FF]"
        >
          {MISSIONS_LIST.map((m) => (
            <option key={m.id} value={m.id}>
              [{m.category}] {m.title}
            </option>
          ))}
        </select>
      </div>

      {/* Mission Detail Card */}
      <div className="bg-[#05070B] border border-slate-800 p-4 rounded-xl space-y-3 relative overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="px-2 py-0.5 rounded bg-[#00E5FF]/10 text-[9px] text-[#00E5FF] border border-[#00E5FF]/20 font-bold uppercase">
            {currentMission.category}
          </span>
          <span className="text-amber-400 font-bold flex items-center gap-1">
            <Zap className="w-3.5 h-3.5" /> +{currentMission.xpReward} XP
          </span>
        </div>

        <h4 className="font-bold text-white text-sm leading-snug">{currentMission.title}</h4>
        <p className="text-slate-300 text-[11px] leading-relaxed">{currentMission.objective}</p>

        {/* Instructions list */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold">Step-by-step Instructions:</span>
          {currentMission.instructions.map((inst, i) => (
            <div key={i} className="flex items-start gap-2 text-slate-300 text-[11px]">
              <span className="w-4 h-4 rounded-full bg-slate-800 text-[#00E5FF] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span>{inst}</span>
            </div>
          ))}
        </div>

        {/* AI Hint */}
        {showHint ? (
          <div className="p-2.5 rounded bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-[#00E5FF] text-[11px] flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{currentMission.hint}</span>
          </div>
        ) : (
          <button
            onClick={() => setShowHint(true)}
            className="text-[10px] text-[#00E5FF] hover:underline flex items-center gap-1"
          >
            <Lightbulb className="w-3 h-3" /> Need an AI Hint?
          </button>
        )}

        {/* Verification Status */}
        {isCompleted ? (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-5 h-5" /> Mission Completed!
            </span>
            <span className="text-[10px] text-slate-300">Badge: {currentMission.badgeReward}</span>
          </div>
        ) : (
          <button
            onClick={handleVerify}
            className="w-full py-2.5 rounded-lg bg-[#00E5FF] text-black font-bold hover:bg-[#4FC3F7] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" /> Verify Mission Answer
          </button>
        )}
      </div>

      {/* Trigger AI Mentor */}
      <button
        onClick={() => dispatch({ type: 'TOGGLE_AI_MENTOR', payload: true })}
        className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-[#00E5FF] border border-[#00E5FF]/30 font-bold transition-all flex items-center justify-center gap-2"
      >
        <Bot className="w-4 h-4" /> Ask AI Mentor for Guided Help
      </button>
    </div>
  );
}
