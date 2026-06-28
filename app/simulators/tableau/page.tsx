'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

const DIMENSIONS = ['Sub-Category', 'Segment', 'Region'];
const MEASURES = ['Sales', 'Profit', 'Discount'];

const TABLEAU_DATA = [
  { subcategory: 'Phones', sales: 85000, profit: 12000 },
  { subcategory: 'Chairs', sales: 72000, profit: 9000 },
  { subcategory: 'Storage', sales: 61000, profit: 4500 },
  { subcategory: 'Tables', sales: 54000, profit: -6000 },
  { subcategory: 'Binders', sales: 42000, profit: 15000 },
];

export default function TableauSimulator() {
  const [columnsShelf, setColumnsShelf] = useState<string>('');
  const [rowsShelf, setRowsShelf] = useState<string>('');
  const [selectedField, setSelectedField] = useState<{ name: string; type: 'dim' | 'meas' } | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');
  const [labCompleted, setLabCompleted] = useState(false);

  // Field selection logic
  const handleSelectField = (name: string, type: 'dim' | 'meas') => {
    setSelectedField({ name, type });
  };

  // Add field to specific columns / rows shelf
  const handleAddToShelf = (shelf: 'cols' | 'rows') => {
    if (!selectedField) return;

    if (shelf === 'cols') {
      setColumnsShelf(selectedField.name);
    } else {
      setRowsShelf(selectedField.name);
    }

    validateTableauConfig(
      shelf === 'cols' ? selectedField.name : columnsShelf,
      shelf === 'rows' ? selectedField.name : rowsShelf
    );
  };

  // Validation logic
  const validateTableauConfig = (cols: string, rows: string) => {
    if (activeStep === 1) {
      // Step 1: Place Dimensions on Columns (Sub-Category) and Measures on Rows (Sales)
      if (cols === 'Sub-Category' && rows === 'Sales') {
        setActiveStep(2);
        setSuccessMsg('Perfect! Bar chart visual constructed. Analysis completed successfully.');
        setLabCompleted(true);
      }
    }
  };

  const handleReset = () => {
    setColumnsShelf('');
    setRowsShelf('');
    setSelectedField(null);
    setActiveStep(1);
    setSuccessMsg('');
    setLabCompleted(false);
  };

  const maxVal = Math.max(...TABLEAU_DATA.map(d => d.sales), 100000);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-between flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Simulator Module</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
            TABLEAU WORKBOOK PLAYGROUND
          </h1>
        </div>

        <button 
          onClick={handleReset}
          className="px-4 py-2 border border-[#00E5FF]/20 bg-slate-900/50 hover:bg-[#00E5FF]/10 text-xs font-mono text-[#00E5FF] rounded transition-all duration-300"
        >
          RESET WORKBOOK
        </button>
      </div>

      <div className="grid xl:grid-cols-4 gap-8">
        
        {/* SHEETS & OBJECTIVES */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* LAB INSTRUCTIONS */}
          <div className="glass-panel p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#E97627]" />
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3">
              Tableau Objective
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Construct a workbook layout. Map discrete <strong className="text-white">Sub-Category</strong> to columns and continuous <strong className="text-white">Sales</strong> to rows to build a distribution bar chart.
            </p>
            
            <div className="space-y-3">
              <div className={`p-3 rounded border text-xs ${activeStep === 1 ? 'border-[#E97627] bg-[#E97627]/5' : 'border-white/5 opacity-50'}`}>
                <strong>Workbook Setup</strong>
                <p className="text-[10px] text-slate-400 mt-1">Columns: Sub-Category (Dim)</p>
                <p className="text-[10px] text-slate-400 mt-1">Rows: SUM(Sales) (Meas)</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded mt-4">
                ✔ {successMsg}
              </div>
            )}
            
            {labCompleted && (
              <div className="mt-4 p-3 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded text-center">
                <span className="block text-xs font-bold text-[#00E5FF] mb-2 font-display uppercase tracking-wider">WORKBOOK SAVED!</span>
                <Link href="/" className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-display font-bold text-[10px] tracking-wider rounded inline-block">
                  FINISH LAB
                </Link>
              </div>
            )}
          </div>

          {/* TABLEAU FIELD LIST */}
          <div className="glass-panel p-5 space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-400 font-display uppercase tracking-widest mb-2">
                Dimensions (Discrete)
              </h3>
              <div className="space-y-1.5">
                {DIMENSIONS.map((dim) => (
                  <div 
                    key={dim}
                    onClick={() => handleSelectField(dim, 'dim')}
                    className={`p-2 rounded border text-xs font-mono transition-all cursor-pointer ${
                      selectedField?.name === dim
                        ? 'border-[#E97627] bg-[#E97627]/10 text-white font-bold'
                        : 'border-white/5 bg-white/5 text-[#4FC3F7] hover:text-white'
                    }`}
                  >
                    <span>Abc {dim}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-xs font-bold text-slate-400 font-display uppercase tracking-widest mb-2">
                Measures (Continuous)
              </h3>
              <div className="space-y-1.5">
                {MEASURES.map((meas) => (
                  <div 
                    key={meas}
                    onClick={() => handleSelectField(meas, 'meas')}
                    className={`p-2 rounded border text-xs font-mono transition-all cursor-pointer ${
                      selectedField?.name === meas
                        ? 'border-[#E97627] bg-[#E97627]/10 text-white font-bold'
                        : 'border-white/5 bg-white/5 text-emerald-400 hover:text-white'
                    }`}
                  >
                    <span># {meas}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* COLUMNS/ROWS SHELVES & MAIN VIEWPORT */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* Columns & Rows shelves bar */}
          <div className="glass-panel p-4 space-y-3 bg-[#090D14]">
            {/* Columns shelf */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-xs text-slate-400 font-mono font-bold">Columns:</span>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 p-2 bg-black/45 border border-white/5 rounded text-xs font-mono text-[#4FC3F7] min-h-[34px]">
                  {columnsShelf || '-- Drop Dimension --'}
                </div>
                {selectedField && (
                  <button 
                    onClick={() => handleAddToShelf('cols')}
                    className="px-4 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>

            {/* Rows shelf */}
            <div className="flex items-center gap-4">
              <span className="w-16 text-xs text-slate-400 font-mono font-bold">Rows:</span>
              <div className="flex-1 flex gap-2">
                <div className="flex-1 p-2 bg-black/45 border border-white/5 rounded text-xs font-mono text-emerald-400 min-h-[34px]">
                  {rowsShelf || '-- Drop Measure --'}
                </div>
                {selectedField && (
                  <button 
                    onClick={() => handleAddToShelf('rows')}
                    className="px-4 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300"
                  >
                    Add
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* TABLEAU WORKBOOK CANVAS */}
          <div className="glass-panel p-6 bg-slate-950 min-h-[400px] flex flex-col relative overflow-hidden">
            <div className="h-6 flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[10px] text-slate-500 font-mono">
              <span>Sheet 1 - Visual representation</span>
              <span className="text-[#E97627]">TABLEAU LAYOUT</span>
            </div>

            {columnsShelf === 'Sub-Category' && rowsShelf === 'Sales' ? (
              <div className="flex-1 flex items-end justify-around pt-10">
                {TABLEAU_DATA.map((row) => {
                  const heightPct = (row.sales / maxVal) * 80; // Scale to fit
                  return (
                    <div key={row.subcategory} className="flex flex-col items-center gap-3 w-16">
                      <span className="text-[10px] text-slate-400 font-mono">${row.sales.toLocaleString()}</span>
                      
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${heightPct}%` }}
                        transition={{ duration: 0.5 }}
                        className="w-10 rounded-t bg-gradient-to-t from-[#E97627] to-[#FFA726] border-t border-[#FFA726]/40"
                      />
                      
                      <span className="text-[10px] font-semibold text-slate-400 font-mono truncate w-14 text-center">
                        {row.subcategory}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex-center flex-col text-slate-600 font-mono gap-2 text-center">
                <svg className="w-10 h-10 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">Drag Dimensions to Columns and Measures to Rows to build distribution chart.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
