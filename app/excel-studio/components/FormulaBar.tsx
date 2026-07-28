'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { FORMULA_CATALOG, FormulaAutocompleteItem, formatCellReference } from '@/lib/utils/excel/formulaEvaluator';
import { Check, X, HelpCircle, Sparkles } from 'lucide-react';

export default function FormulaBar() {
  const { state, dispatch } = useExcelStudio();
  const { sheets, activeSheetId, selectedCell } = state;
  const sheet = sheets[activeSheetId];

  const activeCellKey = selectedCell ? `${selectedCell.row},${selectedCell.col}` : '0,0';
  const activeCellObj = sheet?.cells[activeCellKey];

  const [formulaValue, setFormulaValue] = useState('');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [filteredCatalog, setFilteredCatalog] = useState<FormulaAutocompleteItem[]>([]);
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<FormulaAutocompleteItem | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sync formula bar input when active selected cell changes
  useEffect(() => {
    if (activeCellObj) {
      setFormulaValue(activeCellObj.formula || String(activeCellObj.value ?? ''));
    } else {
      setFormulaValue('');
    }
    setShowAutocomplete(false);
  }, [selectedCell, activeCellObj]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormulaValue(val);

    if (val.startsWith('=')) {
      const query = val.substring(1).trim().toUpperCase();
      if (query.length >= 1) {
        const matches = FORMULA_CATALOG.filter((item) => item.name.startsWith(query));
        setFilteredCatalog(matches);
        setShowAutocomplete(matches.length > 0);
        if (matches.length > 0) setSelectedCatalogItem(matches[0]);
      } else {
        setFilteredCatalog(FORMULA_CATALOG);
        setShowAutocomplete(true);
      }
    } else {
      setShowAutocomplete(false);
    }
  };

  const handleSelectAutocomplete = (item: FormulaAutocompleteItem) => {
    setFormulaValue(`=${item.name}(`);
    setShowAutocomplete(false);
    if (inputRef.current) inputRef.current.focus();
  };

  const commitFormula = () => {
    if (!selectedCell) return;
    const isFormula = formulaValue.trim().startsWith('=');
    const formula = isFormula ? formulaValue.trim() : undefined;
    const num = Number(formulaValue);
    const value = isFormula ? '' : isNaN(num) || formulaValue.trim() === '' ? formulaValue : num;

    dispatch({
      type: 'UPDATE_CELL',
      payload: {
        address: selectedCell,
        value,
        formula,
      },
    });
    setShowAutocomplete(false);
  };

  const cancelFormula = () => {
    if (activeCellObj) {
      setFormulaValue(activeCellObj.formula || String(activeCellObj.value ?? ''));
    } else {
      setFormulaValue('');
    }
    setShowAutocomplete(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      commitFormula();
    } else if (e.key === 'Escape') {
      cancelFormula();
    }
  };

  return (
    <div className="flex-1 flex items-center gap-2 relative font-mono text-xs">
      {/* Formula Commit / Cancel Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={cancelFormula}
          className="p-1 rounded hover:bg-rose-500/20 text-rose-400 transition-colors"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
        <button
          onClick={commitFormula}
          className="p-1 rounded hover:bg-emerald-500/20 text-emerald-400 transition-colors"
          title="Commit Formula (Enter)"
        >
          <Check className="w-4 h-4" />
        </button>
        <span className="text-slate-600 font-bold px-1">fx</span>
      </div>

      {/* Formula Input */}
      <div className="flex-1 relative">
        <input
          ref={inputRef}
          type="text"
          value={formulaValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter a value or formula (e.g. =SUM(B2:E2))"
          className="w-full bg-[#05070B] border border-slate-700 rounded-lg px-3 py-1.5 text-white font-bold focus:outline-none focus:border-[#00E5FF] placeholder-slate-600"
        />

        {/* Formula Autocomplete Dropdown */}
        {showAutocomplete && filteredCatalog.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-[#0D1117] border border-[#00E5FF]/40 rounded-xl shadow-2xl z-50 p-2 max-h-60 overflow-y-auto scrollbar-thin">
            <div className="text-[10px] text-slate-500 uppercase font-bold px-2 pb-1 border-b border-white/5 flex items-center justify-between">
              <span>Formula Autocomplete</span>
              <span className="text-[#00E5FF]">Press to Select</span>
            </div>

            {filteredCatalog.map((item) => (
              <div
                key={item.name}
                onClick={() => handleSelectAutocomplete(item)}
                className="p-2 rounded hover:bg-[#00E5FF]/10 cursor-pointer transition-colors border-b border-white/5 last:border-b-0 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#00E5FF] group-hover:underline">{item.name}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-bold uppercase">
                    {item.category}
                  </span>
                </div>
                <div className="text-[11px] text-slate-300 font-semibold mt-0.5">{item.syntax}</div>
                <div className="text-[10px] text-slate-400 leading-tight mt-0.5">{item.description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
