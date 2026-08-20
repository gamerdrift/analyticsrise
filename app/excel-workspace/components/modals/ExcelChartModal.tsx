'use client';

import React, { useState } from 'react';
import { X, BarChart2, TrendingUp, PieChart, Layers } from 'lucide-react';
import { useExcelWorkspace } from '../../contexts/ExcelWorkspaceContext';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';

type ChartType = 'column' | 'bar' | 'line';

export default function ExcelChartModal() {
  const { state, dispatch, evaluateCell } = useExcelWorkspace();
  const [chartType, setChartType] = useState<ChartType>('column');
  const [labelColIndex, setLabelColIndex] = useState(0);
  const [valueColIndex, setValueColIndex] = useState(1);

  if (!state.isChartModalOpen) return null;

  const activeSheet = state.workbook?.sheets[state.activeSheetId];
  if (!activeSheet) return null;

  const headers = activeSheet.headers || [];

  // Extract labels and values from active sheet rows (skipping row 0 header)
  const chartData: Array<{ label: string; value: number }> = [];
  const maxRow = Math.min(20, activeSheet.rows);

  for (let r = 1; r < maxRow; r++) {
    const labelCell = activeSheet.cells[`${r},${labelColIndex}`];
    const valueCell = activeSheet.cells[`${r},${valueColIndex}`];

    const labelVal = labelCell ? evaluateCell(labelCell, activeSheet.cells) : `Row ${r}`;
    const valueVal = valueCell ? evaluateCell(valueCell, activeSheet.cells) : 0;

    const num = Number(valueVal);
    if (!isNaN(num) && labelVal) {
      chartData.push({
        label: String(labelVal),
        value: num,
      });
    }
  }

  const maxValue = chartData.length > 0 ? Math.max(...chartData.map((d) => d.value), 1) : 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0D1117] border border-[#1E293B] rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Chart Visualizer</h2>
              <p className="text-xs text-slate-400">Render charts directly from your active sheet data</p>
            </div>
          </div>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CHART_MODAL', payload: false })}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex flex-col gap-6 overflow-y-auto">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center gap-4 bg-[#161B22] p-3.5 rounded-xl border border-[#1E293B] text-xs">
            {/* Chart Type Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono">Type:</span>
              <div className="flex items-center gap-1 bg-[#0D1117] p-1 rounded-lg border border-[#1E293B]">
                <button
                  onClick={() => setChartType('column')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    chartType === 'column' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Column
                </button>
                <button
                  onClick={() => setChartType('bar')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    chartType === 'bar' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bar
                </button>
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2.5 py-1 rounded text-xs transition-colors ${
                    chartType === 'line' ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Line
                </button>
              </div>
            </div>

            {/* Label Column Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono">Labels:</span>
              <select
                value={labelColIndex}
                onChange={(e) => setLabelColIndex(parseInt(e.target.value, 10))}
                className="bg-[#0D1117] text-white border border-[#1E293B] rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>
                    {h}
                  </option>
                ))}
              </select>
            </div>

            {/* Value Column Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-mono">Values:</span>
              <select
                value={valueColIndex}
                onChange={(e) => setValueColIndex(parseInt(e.target.value, 10))}
                className="bg-[#0D1117] text-white border border-[#1E293B] rounded-lg px-2 py-1 text-xs focus:outline-none"
              >
                {headers.map((h, idx) => (
                  <option key={idx} value={idx}>
                    {h}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chart Rendering Canvas */}
          <div className="h-64 sm:h-80 bg-[#090D14] border border-[#1E293B] rounded-xl p-6 flex flex-col justify-end">
            {chartData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                No numeric data found in selected column.
              </div>
            ) : chartType === 'column' ? (
              <div className="h-full flex items-end gap-2 sm:gap-4 justify-between pt-6">
                {chartData.map((d, idx) => {
                  const pct = Math.max(8, (d.value / maxValue) * 100);
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono text-slate-400 group-hover:text-cyan-300 transition-colors">
                        {d.value.toLocaleString()}
                      </span>
                      <div
                        style={{ height: `${pct}%` }}
                        className="w-full max-w-[48px] rounded-t-lg bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-emerald-500 group-hover:to-cyan-300 transition-all duration-300 shadow-lg shadow-cyan-500/10"
                      />
                      <span className="text-[10px] font-mono text-slate-500 truncate w-full text-center group-hover:text-white">
                        {d.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : chartType === 'bar' ? (
              <div className="h-full flex flex-col justify-between gap-2 overflow-y-auto py-2">
                {chartData.map((d, idx) => {
                  const pct = Math.max(5, (d.value / maxValue) * 100);
                  return (
                    <div key={idx} className="flex items-center gap-3 text-xs font-mono">
                      <span className="w-24 truncate text-right text-slate-400 text-[11px]">{d.label}</span>
                      <div className="flex-1 bg-white/5 rounded-r-lg h-5 overflow-hidden">
                        <div
                          style={{ width: `${pct}%` }}
                          className="h-full rounded-r-lg bg-gradient-to-r from-emerald-500 to-cyan-400 flex items-center justify-end pr-2 text-[10px] font-bold text-black"
                        >
                          {d.value.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Line chart SVG */
              <div className="h-full flex flex-col justify-between relative">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 500 200" preserveAspectRatio="none">
                  {/* Grid lines */}
                  <line x1="0" y1="0" x2="500" y2="0" stroke="#1E293B" strokeDasharray="4" />
                  <line x1="0" y1="100" x2="500" y2="100" stroke="#1E293B" strokeDasharray="4" />
                  <line x1="0" y1="200" x2="500" y2="200" stroke="#1E293B" />

                  {/* Line polyline */}
                  {chartData.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="#00E5FF"
                      strokeWidth="3"
                      points={chartData
                        .map((d, idx) => {
                          const x = (idx / (chartData.length - 1)) * 500;
                          const y = 200 - (d.value / maxValue) * 180;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  )}

                  {/* Line points */}
                  {chartData.map((d, idx) => {
                    const x = (idx / (chartData.length - 1 || 1)) * 500;
                    const y = 200 - (d.value / maxValue) * 180;
                    return (
                      <circle key={idx} cx={x} cy={y} r="5" fill="#4FC3F7" stroke="#05070B" strokeWidth="2" />
                    );
                  })}
                </svg>

                {/* X Axis Labels */}
                <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-[#1E293B]">
                  {chartData.map((d, idx) => (
                    <span key={idx} className="truncate max-w-[60px] text-center">
                      {d.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#1E293B] bg-[#05070B] flex items-center justify-end">
          <button
            onClick={() => dispatch({ type: 'TOGGLE_CHART_MODAL', payload: false })}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
