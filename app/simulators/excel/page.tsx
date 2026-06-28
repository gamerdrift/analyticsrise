'use client';

import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

// Mock initial sheet cells
const initialGrid = [
  ['Category', 'Q1 Sales', 'Q2 Sales', 'Q3 Sales', 'Q4 Sales'],
  ['Enterprise Sales', '45000', '52000', '49000', '65000'],
  ['SMB Sales', '15000', '18000', '16500', '22000'],
  ['Operating Cost', '38000', '41000', '39500', '45000'],
  ['Net Profit', '', '', '', ''], // B5 to E5 will be calculated
  ['Total Annual Profit', '', '', '', ''] // B6 will be calculated
];

const colHeaders = ['A', 'B', 'C', 'D', 'E', 'F'];

export default function ExcelSimulator() {
  const [grid, setGrid] = useState<string[][]>(initialGrid);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [activeStep, setActiveStep] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Select cell helper
  const handleSelectCell = (r: number, c: number) => {
    // Row 0 and Col 0 are headers or non-editable titles if we want
    if (r === 0 || c === 0) return; 
    setSelectedCell({ r, c });
    setEditValue(grid[r][c]);
    setErrorMsg('');
  };

  // Convert letter-number (e.g. B2) to { r, c }
  const parseCellCoord = (coord: string) => {
    const colLetter = coord.charAt(0).toUpperCase();
    const rowNum = parseInt(coord.substring(1));
    const c = colHeaders.indexOf(colLetter);
    const r = rowNum - 1; // 1-indexed to 0-indexed
    return { r, c };
  };

  // Safe cell value extractor
  const getCellValue = (r: number, c: number, currentGrid: string[][]): number => {
    if (r < 0 || r >= currentGrid.length || c < 0 || c >= currentGrid[0].length) return 0;
    const rawVal = currentGrid[r][c];
    if (rawVal.startsWith('=')) {
      // Evaluate formula recursive
      return evaluateFormulaStr(rawVal, r, c, currentGrid);
    }
    const parsed = parseFloat(rawVal);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Evaluate single formula string
  const evaluateFormulaStr = (formula: string, r: number, c: number, currentGrid: string[][]): number => {
    try {
      const cleanForm = formula.substring(1).toUpperCase().trim();

      // SUM range e.g. SUM(B2:B3) or SUM(B2:E2)
      if (cleanForm.startsWith('SUM(')) {
        const range = cleanForm.substring(4, cleanForm.length - 1);
        const [start, end] = range.split(':');
        const sCell = parseCellCoord(start);
        const eCell = parseCellCoord(end);

        let sum = 0;
        for (let row = Math.min(sCell.r, eCell.r); row <= Math.max(sCell.r, eCell.r); row++) {
          for (let col = Math.min(sCell.c, eCell.c); col <= Math.max(sCell.c, eCell.c); col++) {
            sum += getCellValue(row, col, currentGrid);
          }
        }
        return sum;
      }

      // AVERAGE range e.g. AVERAGE(B2:E2)
      if (cleanForm.startsWith('AVERAGE(')) {
        const range = cleanForm.substring(8, cleanForm.length - 1);
        const [start, end] = range.split(':');
        const sCell = parseCellCoord(start);
        const eCell = parseCellCoord(end);

        let sum = 0;
        let count = 0;
        for (let row = Math.min(sCell.r, eCell.r); row <= Math.max(sCell.r, eCell.r); row++) {
          for (let col = Math.min(sCell.c, eCell.c); col <= Math.max(sCell.c, eCell.c); col++) {
            sum += getCellValue(row, col, currentGrid);
            count++;
          }
        }
        return count > 0 ? sum / count : 0;
      }

      // Simple subtraction e.g. B2+B3-B4
      // We can regex split cell tokens
      if (cleanForm.includes('-')) {
        const [left, right] = cleanForm.split('-');
        const leftCell = parseCellCoord(left);
        const rightCell = parseCellCoord(right);
        return getCellValue(leftCell.r, leftCell.c, currentGrid) - getCellValue(rightCell.r, rightCell.c, currentGrid);
      }

      if (cleanForm.includes('+')) {
        const [left, right] = cleanForm.split('+');
        const leftCell = parseCellCoord(left);
        const rightCell = parseCellCoord(right);
        return getCellValue(leftCell.r, leftCell.c, currentGrid) + getCellValue(rightCell.r, rightCell.c, currentGrid);
      }

      // Direct cell ref e.g. =B2
      const target = parseCellCoord(cleanForm);
      return getCellValue(target.r, target.c, currentGrid);

    } catch (e) {
      return NaN;
    }
  };

  // Helper to render cell display values
  const getCellDisplayVal = (r: number, c: number): string => {
    const val = grid[r][c];
    if (val.startsWith('=')) {
      const computed = evaluateFormulaStr(val, r, c, grid);
      return isNaN(computed) ? '#VALUE!' : computed.toLocaleString();
    }
    const num = parseFloat(val);
    return !isNaN(num) && r > 0 && c > 0 ? num.toLocaleString() : val;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleApplyValue = () => {
    if (!selectedCell) return;
    const { r, c } = selectedCell;
    const newGrid = grid.map((row, rIdx) => 
      row.map((val, cIdx) => (rIdx === r && cIdx === c ? editValue : val))
    );
    setGrid(newGrid);

    // Scenario step validation
    validateScenarioSteps(newGrid, r, c, editValue);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleApplyValue();
    }
  };

  // Step check system
  const validateScenarioSteps = (newGrid: string[][], r: number, c: number, val: string) => {
    const uppercaseVal = val.toUpperCase().replace(/\s/g, '');
    
    if (activeStep === 1) {
      // Step 1: Calculate Q1 Net Profit in B5 (Enterprise Sales B2 + SMB Sales B3 - Operating Cost B4)
      // Acceptable formula: =B2+B3-B4
      if (r === 4 && c === 1) {
        if (uppercaseVal === '=B2+B3-B4') {
          setActiveStep(2);
          setSuccessMsg('Correct! Q1 Net Profit formula applied. Now copy or write formulas for Q2, Q3, and Q4 Net Profit.');
          setErrorMsg('');
        } else {
          setErrorMsg('Incorrect formula. Hint: We want Net Profit = Enterprise Sales (B2) + SMB Sales (B3) - Operating Cost (B4). Try "=B2+B3-B4"');
        }
      }
    } else if (activeStep === 2) {
      // Step 2: Ensure all Q1-Q4 formulas are applied
      const q2 = newGrid[4][2].toUpperCase().replace(/\s/g, '');
      const q3 = newGrid[4][3].toUpperCase().replace(/\s/g, '');
      const q4 = newGrid[4][4].toUpperCase().replace(/\s/g, '');

      if (q2 === '=C2+C3-C4' && q3 === '=D2+D3-D4' && q4 === '=E2+E3-E4') {
        setActiveStep(3);
        setSuccessMsg('Perfect! All Net Profit cells calculated correctly. Now go to B6 and sum the profits using SUM formula.');
        setErrorMsg('');
      } else {
        setErrorMsg('Apply the corresponding column formula to C5 (Q2), D5 (Q3), and E5 (Q4). E.g. "=C2+C3-C4" for C5.');
      }
    } else if (activeStep === 3) {
      // Step 3: Total Annual Profit in B6 =SUM(B5:E5)
      if (r === 5 && c === 1) {
        if (uppercaseVal === '=SUM(B5:E5)' || uppercaseVal === '=SUM(B5:E5)') {
          setActiveStep(4);
          setSuccessMsg('Configuration Authorized! Annual profit calculations validated successfully. Telemetry matches expected outputs.');
          setErrorMsg('');
        } else {
          setErrorMsg('Apply the correct range SUM formula. Hint: =SUM(B5:E5) in B6.');
        }
      }
    }
  };

  const handleReset = () => {
    setGrid(initialGrid);
    setSelectedCell(null);
    setEditValue('');
    setActiveStep(1);
    setSuccessMsg('');
    setErrorMsg('');
  };

  // Dynamic values for charts
  const chartValues = [
    evaluateFormulaStr(grid[4][1], 4, 1, grid),
    evaluateFormulaStr(grid[4][2], 4, 2, grid),
    evaluateFormulaStr(grid[4][3], 4, 3, grid),
    evaluateFormulaStr(grid[4][4], 4, 4, grid)
  ].map(v => (isNaN(v) ? 0 : v));

  const maxChartVal = Math.max(...chartValues, 50000);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-between flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Simulator Module</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
            EXCEL FORMULA PRACTICE LAB
          </h1>
        </div>

        <button 
          onClick={handleReset}
          className="px-4 py-2 border border-[#00E5FF]/20 bg-slate-900/50 hover:bg-[#00E5FF]/10 text-xs font-mono text-[#00E5FF] rounded transition-all duration-300"
        >
          RESET SYSTEM
        </button>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        
        {/* INSTRUCTIONS PANE */}
        <div className="glass-panel p-6 flex flex-col justify-between h-fit relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-[#107C41]" />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded bg-[#107C41] flex-center text-xs font-bold text-white">X</div>
              <h2 className="text-md font-bold text-white font-display uppercase tracking-wider">LAB OBJECTIVES</h2>
            </div>

            {/* Step list */}
            <div className="space-y-6">
              
              {/* Step 1 */}
              <div className={`p-4 rounded border transition-all ${
                activeStep === 1 ? 'border-[#107C41] bg-[#107C41]/5' : 'border-white/5 opacity-50'
              }`}>
                <span className="text-[10px] font-mono text-[#107C41] uppercase font-bold">Step 1: Calculate Net Profit</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Select cell <strong className="text-white font-mono bg-white/5 px-1 rounded">B5</strong> (Q1 Net Profit). Write a formula subtracting Operating Cost (B4) from total sales (Enterprise Sales <strong className="text-white">B2</strong> + SMB Sales <strong className="text-white">B3</strong>).
                </p>
                <code className="block mt-2 font-mono text-[10px] text-emerald-400 bg-black/40 p-2 rounded border border-[#107C41]/10">
                  Target: =B2+B3-B4
                </code>
              </div>

              {/* Step 2 */}
              <div className={`p-4 rounded border transition-all ${
                activeStep === 2 ? 'border-[#107C41] bg-[#107C41]/5' : 'border-white/5 opacity-50'
              }`}>
                <span className="text-[10px] font-mono text-[#107C41] uppercase font-bold">Step 2: Copy Across Quarters</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Apply similar formulas to cells <strong className="text-white">C5</strong>, <strong className="text-white">D5</strong>, and <strong className="text-white">E5</strong> using corresponding column coordinates (C, D, E).
                </p>
              </div>

              {/* Step 3 */}
              <div className={`p-4 rounded border transition-all ${
                activeStep === 3 ? 'border-[#107C41] bg-[#107C41]/5' : 'border-white/5 opacity-50'
              }`}>
                <span className="text-[10px] font-mono text-[#107C41] uppercase font-bold">Step 3: Sum Annual Profits</span>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Select cell <strong className="text-white font-mono bg-white/5 px-1 rounded">B6</strong>. Use the <strong className="text-white">SUM</strong> function to calculate the aggregate sum of all calculated Net Profits across Q1-Q4 (cells B5:E5).
                </p>
                <code className="block mt-2 font-mono text-[10px] text-emerald-400 bg-black/40 p-2 rounded border border-[#107C41]/10">
                  Target: =SUM(B5:E5)
                </code>
              </div>

            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-3">
            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-xs font-mono rounded">
                ✔ {successMsg}
              </div>
            )}
            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-500/30 text-rose-400 text-xs font-mono rounded animate-shake">
                ✖ {errorMsg}
              </div>
            )}
            {activeStep === 4 && (
              <div className="p-4 bg-[#00E5FF]/10 border border-[#00E5FF]/30 text-white rounded text-center">
                <span className="block text-xs font-bold text-[#00E5FF] mb-2 font-display uppercase tracking-widest">
                  LAB SUCCESSFULLY COMPLETED!
                </span>
                <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                  Annual profit calculations validated successfully. System XP telemetry updated.
                </p>
                <Link href="/" className="px-6 py-2.5 cyber-button text-xs font-bold tracking-widest inline-block">
                  Go back to Console
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* WORKSPACE & EDIT GRID */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          
          {/* Formula bar interface */}
          <div className="glass-panel p-4 flex gap-4 items-center bg-[#0C0F16]">
            {/* Cell indicator */}
            <div className="font-mono text-xs font-bold text-[#00E5FF] bg-[#00E5FF]/5 border border-[#00E5FF]/20 px-4 py-2 rounded uppercase tracking-wider min-w-[70px] text-center">
              {selectedCell ? `${colHeaders[selectedCell.c]}${selectedCell.r + 1}` : '--'}
            </div>
            
            {/* Text input */}
            <div className="flex-1 relative flex items-center">
              <span className="absolute left-3 text-slate-500 font-mono text-xs italic">fx</span>
              <input 
                type="text"
                value={editValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyPress}
                disabled={!selectedCell}
                placeholder={selectedCell ? 'Type values or formulas starting with = (e.g. =SUM(B2:E2))' : 'Select a cell in the grid below to input parameters'}
                className="w-full pl-8 bg-[#05070B] border border-white/10 hover:border-white/20 text-[#F5F7FA] font-mono text-sm rounded-lg py-2.5 focus:border-[#00E5FF] focus:ring-1 focus:ring-[#00E5FF]"
              />
            </div>

            {/* Apply Action */}
            <button 
              onClick={handleApplyValue}
              disabled={!selectedCell}
              className="px-6 py-2.5 bg-[#107C41] hover:bg-emerald-600 disabled:opacity-50 text-white font-mono text-xs font-bold rounded-lg transition-all"
            >
              ENTER
            </button>
          </div>

          {/* SPREADSHEET WORKSPACE */}
          <div className="glass-panel p-4 overflow-x-auto bg-[#07090E]">
            <table className="w-full min-w-[650px] border-collapse font-mono text-xs text-slate-300">
              <thead>
                <tr>
                  <th className="w-10 bg-slate-900 border border-white/5 py-2 text-center text-slate-500 text-[10px]"></th>
                  {colHeaders.map((col, idx) => (
                    <th key={col} className="bg-slate-900 border border-white/5 py-2 text-center text-slate-400 font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grid.map((row, rIdx) => (
                  <tr key={rIdx}>
                    {/* Row indicator */}
                    <td className="bg-slate-900 border border-white/5 py-2.5 text-center text-slate-500 font-bold w-10">
                      {rIdx + 1}
                    </td>
                    
                    {row.map((cellVal, cIdx) => {
                      const isSelected = selectedCell?.r === rIdx && selectedCell?.c === cIdx;
                      const isHeaderCol = cIdx === 0;
                      
                      return (
                        <td 
                          key={cIdx}
                          onClick={() => handleSelectCell(rIdx, cIdx)}
                          className={`border border-white/5 p-2 transition-all relative truncate max-w-[150px] ${
                            isHeaderCol ? 'bg-slate-950/70 font-semibold text-slate-300' : 'cursor-pointer hover:bg-white/5 text-right'
                          } ${
                            isSelected ? 'ring-1 ring-[#107C41] bg-[#107C41]/10 text-white z-10' : ''
                          }`}
                        >
                          {/* Formula value prefix check */}
                          {grid[rIdx][cIdx].startsWith('=') && !isSelected && (
                            <span className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500" title="Calculated Formula Cell" />
                          )}
                          
                          {getCellDisplayVal(rIdx, cIdx)}
                        </td>
                      );
                    })}
                    
                    {/* Empty placeholder cell for structure visual */}
                    <td className="border border-white/5 p-2 bg-slate-950/30"></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DYNAMIC VISUALIZATION CANVAS */}
          <div className="glass-panel p-6 bg-[#07090D] relative overflow-hidden">
            <h3 className="text-sm font-bold text-white font-display mb-4 uppercase tracking-wider">
              Dynamic Chart Preview: Net Profit Forecast
            </h3>

            {/* Simple dynamic SVG chart based on row values */}
            <div className="h-48 flex items-end justify-around border-b border-white/10 pt-4">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((qName, qIdx) => {
                const profit = chartValues[qIdx];
                const heightPct = maxChartVal > 0 ? (Math.max(profit, 0) / maxChartVal) * 100 : 0;
                
                return (
                  <div key={qName} className="flex flex-col items-center gap-2 w-16">
                    <span className="text-[10px] text-slate-400 font-mono">
                      {profit > 0 ? `$${profit.toLocaleString()}` : '$0'}
                    </span>
                    
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max(heightPct, 5)}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="w-8 rounded-t bg-gradient-to-t from-[#107C41] to-[#00E5FF] border-t border-[#00E5FF]/40 relative group"
                    >
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-950 text-white px-2 py-1 rounded text-[9px] font-mono opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#00E5FF]/20 whitespace-nowrap shadow-xl">
                        {qName} Profit: ${profit.toLocaleString()}
                      </div>
                    </motion.div>
                    
                    <span className="text-xs font-semibold text-slate-400 font-mono">
                      {qName}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
