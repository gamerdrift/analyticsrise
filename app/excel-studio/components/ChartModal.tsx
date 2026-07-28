'use client';

import React, { useState } from 'react';
import { useExcelStudio } from '@/app/excel-studio/contexts/ExcelStudioContext';
import { evaluateFormula } from '@/lib/utils/excel/formulaEvaluator';
import { BarChart2, X, PieChart, LineChart, TrendingUp, DollarSign, Award, Layers } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChartModal({ isOpen, onClose }: Props) {
  const { state } = useExcelStudio();
  const { sheets, activeSheetId } = state;
  const sheet = sheets[activeSheetId];

  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie' | 'area'>('bar');

  if (!isOpen || !sheet) return null;

  // Extract chart dataset dynamically from active worksheet cells
  const extractChartData = () => {
    const dataPoints: Array<{ label: string; value: number }> = [];
    // Read up to 10 rows
    for (let r = 1; r < 12; r++) {
      const labelCell = sheet.cells[`${r},0`];
      const valCell = sheet.cells[`${r},1`] || sheet.cells[`${r},5`];
      if (labelCell && labelCell.value) {
        const label = String(labelCell.value);
        const evalVal = valCell
          ? Number(evaluateFormula(valCell.formula || String(valCell.value), sheet.cells))
          : 0;
        dataPoints.push({ label, value: isNaN(evalVal) ? 0 : evalVal });
      }
    }

    if (dataPoints.length === 0) {
      return [
        { label: 'Enterprise Software', value: 570000 },
        { label: 'SMB Subscriptions', value: 207000 },
        { label: 'Professional Services', value: 122500 },
      ];
    }
    return dataPoints;
  };

  const chartData = extractChartData();
  const totalSum = chartData.reduce((acc, curr) => acc + curr.value, 0);
  const avgVal = chartData.length > 0 ? totalSum / chartData.length : 0;
  const maxVal = chartData.reduce((max, c) => (c.value > max ? c.value : max), 0);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#0D1117] border border-[#00E5FF]/30 rounded-2xl w-full max-w-4xl p-6 shadow-2xl space-y-6 font-mono text-xs text-white relative max-h-[90vh] overflow-y-auto scrollbar-thin">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        {/* Header & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#00E5FF]" />
            <div>
              <h3 className="font-bold text-base text-[#00E5FF]">Dynamic Visualizations & KPI Dashboard</h3>
              <p className="text-[10px] text-slate-400">Live analytical chart representations derived from active worksheet data.</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#05070B] p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setChartType('bar')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'bar' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'line' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Line Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'pie' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pie Chart
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                chartType === 'area' ? 'bg-[#00E5FF] text-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              Area Chart
            </button>
          </div>
        </div>

        {/* Dynamic KPI Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#05070B] border border-[#00E5FF]/20 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#00E5FF]/10 text-[#00E5FF]">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Total Metric Sum</span>
              <p className="text-lg font-bold text-white mt-0.5">{formatCurrency(totalSum)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070B] border border-[#00E5FF]/20 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Average Category Value</span>
              <p className="text-lg font-bold text-white mt-0.5">{formatCurrency(avgVal)}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#05070B] border border-[#00E5FF]/20 flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Peak Item Revenue</span>
              <p className="text-lg font-bold text-white mt-0.5">{formatCurrency(maxVal)}</p>
            </div>
          </div>
        </div>

        {/* Dynamic Chart Container */}
        <div className="p-6 rounded-2xl bg-[#05070B] border border-slate-800 space-y-4">
          <h4 className="font-bold text-slate-300 text-xs uppercase tracking-wider">
            {chartType.toUpperCase()} REPRESENTATION — {sheet.name}
          </h4>

          {/* SVG Bar Chart Visualization */}
          {chartType === 'bar' && (
            <div className="space-y-3 pt-2">
              {chartData.map((dp, i) => {
                const percentage = maxVal > 0 ? (dp.value / maxVal) * 100 : 0;
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-300 font-bold">
                      <span>{dp.label}</span>
                      <span className="text-[#00E5FF]">{formatCurrency(dp.value)}</span>
                    </div>
                    <div className="w-full bg-slate-900 h-6 rounded-lg overflow-hidden p-0.5">
                      <div
                        className="bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] h-full rounded transition-all duration-500 flex items-center justify-end pr-2 text-[10px] font-bold text-black"
                        style={{ width: `${Math.max(5, percentage)}%` }}
                      >
                        {percentage > 20 && `${percentage.toFixed(0)}%`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SVG Pie Chart Visualization */}
          {chartType === 'pie' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="flex justify-center">
                <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 36 36">
                  {chartData.map((dp, idx) => {
                    const percent = totalSum > 0 ? (dp.value / totalSum) * 100 : 0;
                    const strokeDasharray = `${percent} ${100 - percent}`;
                    const colors = ['#00E5FF', '#4FC3F7', '#10B981', '#F59E0B', '#EC4899'];
                    return (
                      <circle
                        key={idx}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="transparent"
                        stroke={colors[idx % colors.length]}
                        strokeWidth="3"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset="0"
                      />
                    );
                  })}
                </svg>
              </div>
              <div className="space-y-2">
                {chartData.map((dp, idx) => {
                  const colors = ['#00E5FF', '#4FC3F7', '#10B981', '#F59E0B', '#EC4899'];
                  const percent = totalSum > 0 ? ((dp.value / totalSum) * 100).toFixed(1) : 0;
                  return (
                    <div key={idx} className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[idx % colors.length] }} />
                        <span className="text-slate-200 font-bold">{dp.label}</span>
                      </div>
                      <span className="text-[#00E5FF] font-bold">{percent}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(chartType === 'line' || chartType === 'area') && (
            <div className="h-48 flex items-end justify-between gap-4 pt-4 px-4 border-b border-l border-slate-700">
              {chartData.map((dp, idx) => {
                const heightPercent = maxVal > 0 ? (dp.value / maxVal) * 100 : 0;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <span className="text-[9px] text-[#00E5FF] opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      {formatCurrency(dp.value)}
                    </span>
                    <div
                      className={`w-full rounded-t ${
                        chartType === 'area'
                          ? 'bg-gradient-to-t from-[#00E5FF]/20 via-[#00E5FF]/60 to-[#00E5FF]'
                          : 'bg-[#00E5FF]'
                      }`}
                      style={{ height: `${Math.max(10, heightPercent)}%` }}
                    />
                    <span className="text-[9px] text-slate-400 mt-2 truncate w-full text-center">{dp.label}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
