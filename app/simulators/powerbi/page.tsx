'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion } from 'framer-motion';

const MOCK_FIELDS = ['Region', 'Product Category', 'Sales', 'Date', 'Net Profit'];

const REGIONAL_SALES_DATA = [
  { region: 'North America', sales: 120000, profit: 45000 },
  { region: 'Europe', sales: 95000, profit: 32000 },
  { region: 'Asia-Pacific', sales: 145000, profit: 58000 },
  { region: 'Latin America', sales: 40000, profit: 12000 },
];

export default function PowerBiSimulator() {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [axisSlot, setAxisSlot] = useState<string>('');
  const [valueSlot, setValueSlot] = useState<string>('');
  const [kpiSlot, setKpiSlot] = useState<string>('');
  const [activeStep, setActiveStep] = useState(1);
  const [successMsg, setSuccessMsg] = useState('');
  const [labCompleted, setLabCompleted] = useState(false);

  // Field selection logic
  const handleSelectField = (field: string) => {
    // Toggle field selection
    if (selectedFields.includes(field)) {
      setSelectedFields(selectedFields.filter(f => f !== field));
    } else {
      setSelectedFields([...selectedFields, field]);
    }
  };

  // Add field to specific configuration slots
  const handleAddToSlot = (field: string, slot: 'axis' | 'value' | 'kpi') => {
    if (slot === 'axis') {
      setAxisSlot(field);
    } else if (slot === 'value') {
      setValueSlot(field);
    } else if (slot === 'kpi') {
      setKpiSlot(field);
    }

    validateReportConfig(
      slot === 'axis' ? field : axisSlot,
      slot === 'value' ? field : valueSlot,
      slot === 'kpi' ? field : kpiSlot
    );
  };

  // Validation logic
  const validateReportConfig = (axis: string, val: string, kpi: string) => {
    if (activeStep === 1) {
      // Step 1: Create Regional Sales Bar Chart
      // Requires Axis: Region, Value: Sales
      if (axis === 'Region' && val === 'Sales') {
        setActiveStep(2);
        setSuccessMsg('Nice! Bar Chart generated. Next, configure the KPI card to display Total Sales.');
      }
    } else if (activeStep === 2) {
      // Step 2: KPI Card Value: Sales
      if (axis === 'Region' && val === 'Sales' && kpi === 'Sales') {
        setActiveStep(3);
        setSuccessMsg('Perfect! KPI Card configured successfully. Report telemetry matches target specification.');
        setLabCompleted(true);
      }
    }
  };

  const handleReset = () => {
    setSelectedFields([]);
    setAxisSlot('');
    setValueSlot('');
    setKpiSlot('');
    setActiveStep(1);
    setSuccessMsg('');
    setLabCompleted(false);
  };

  // Calculated KPI total
  const totalSales = REGIONAL_SALES_DATA.reduce((acc, curr) => acc + curr.sales, 0);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-between flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Simulator Module</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
            POWER BI REPORT CANVAS
          </h1>
        </div>

        <button 
          onClick={handleReset}
          className="px-4 py-2 border border-[#00E5FF]/20 bg-slate-900/50 hover:bg-[#00E5FF]/10 text-xs font-mono text-[#00E5FF] rounded transition-all duration-300"
        >
          RESET REPORT
        </button>
      </div>

      <div className="grid xl:grid-cols-4 gap-8">
        
        {/* FIELDS & CHANNELS CONFIG */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* LAB INSTRUCTION CARD */}
          <div className="glass-panel p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#F2C811]" />
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3">
              Report Goal
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Construct a sales performance dashboard dashboard. Configure the Visual elements:
            </p>
            
            <div className="space-y-4">
              <div className={`p-3 rounded border text-xs ${activeStep === 1 ? 'border-[#F2C811] bg-[#F2C811]/5' : 'border-white/5 opacity-50'}`}>
                <strong>1. Regional Sales Bar Chart</strong>
                <p className="text-[10px] text-slate-400 mt-1">Map &quot;Region&quot; to Axis and &quot;Sales&quot; to Values.</p>
              </div>
              <div className={`p-3 rounded border text-xs ${activeStep === 2 ? 'border-[#F2C811] bg-[#F2C811]/5' : 'border-white/5 opacity-50'}`}>
                <strong>2. Core KPI Card</strong>
                <p className="text-[10px] text-slate-400 mt-1">Map &quot;Sales&quot; to the Card Value slot.</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono rounded mt-4">
                ✔ {successMsg}
              </div>
            )}
            
            {labCompleted && (
              <div className="mt-4 p-3 bg-[#00E5FF]/10 border border-[#00E5FF]/20 rounded text-center">
                <span className="block text-xs font-bold text-[#00E5FF] mb-2 font-display uppercase tracking-wider">REPORT COMPLETE!</span>
                <Link href="/" className="px-4 py-2 bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-display font-bold text-[10px] tracking-wider rounded inline-block">
                  FINISH LAB
                </Link>
              </div>
            )}
          </div>

          {/* FIELDS DIRECTORY */}
          <div className="glass-panel p-5">
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3">
              Data Fields
            </h3>
            <div className="space-y-2">
              {MOCK_FIELDS.map((field) => (
                <div 
                  key={field}
                  onClick={() => handleSelectField(field)}
                  className={`p-2.5 rounded border text-xs font-mono transition-all flex items-center justify-between cursor-pointer ${
                    selectedFields.includes(field)
                      ? 'border-[#F2C811] bg-[#F2C811]/10 text-white font-bold'
                      : 'border-white/5 bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📊 {field}</span>
                  {selectedFields.includes(field) && (
                    <span className="text-[10px] text-[#F2C811]">SELECTED</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* REPORT CANVAS & VISUAL SLOTS */}
        <div className="xl:col-span-3 grid md:grid-cols-3 gap-6 h-fit">
          
          {/* VISUAL CONFIGURATION SLOTS */}
          <div className="md:col-span-1 glass-panel p-6 space-y-6 bg-[#090D14]">
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest pb-3 border-b border-white/5">
              Visualization Slots
            </h3>

            {/* Bar Chart Visual slots */}
            <div className="space-y-4">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Regional Bar Chart Slots</span>
              
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Axis (Categorical)</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-black/45 border border-white/5 rounded text-xs font-mono text-[#F2C811] min-h-[34px]">
                    {axisSlot || '-- Drop field --'}
                  </div>
                  {selectedFields.length > 0 && (
                    <button 
                      onClick={() => handleAddToSlot(selectedFields[selectedFields.length - 1], 'axis')}
                      className="px-3 bg-slate-800 hover:bg-slate-700 rounded text-xs text-[#F2C811]"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Values (Numeric)</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-black/45 border border-white/5 rounded text-xs font-mono text-[#F2C811] min-h-[34px]">
                    {valueSlot || '-- Drop field --'}
                  </div>
                  {selectedFields.length > 0 && (
                    <button 
                      onClick={() => handleAddToSlot(selectedFields[selectedFields.length - 1], 'value')}
                      className="px-3 bg-slate-800 hover:bg-slate-700 rounded text-xs text-[#F2C811]"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* KPI Visual Slots */}
            <div className="space-y-4 pt-4 border-t border-white/5">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">KPI Card Slots</span>
              
              <div>
                <label className="text-[10px] text-slate-400 font-mono block mb-1">Card Value</label>
                <div className="flex gap-2">
                  <div className="flex-1 p-2 bg-black/45 border border-white/5 rounded text-xs font-mono text-[#F2C811] min-h-[34px]">
                    {kpiSlot || '-- Drop field --'}
                  </div>
                  {selectedFields.length > 0 && (
                    <button 
                      onClick={() => handleAddToSlot(selectedFields[selectedFields.length - 1], 'kpi')}
                      className="px-3 bg-slate-800 hover:bg-slate-700 rounded text-xs text-[#F2C811]"
                    >
                      Add
                    </button>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* DYNAMIC CANVAS REPORT */}
          <div className="md:col-span-2 glass-panel p-6 bg-slate-950 flex flex-col gap-6 relative overflow-hidden min-h-[500px]">
            <div className="h-6 flex items-center justify-between border-b border-white/5 pb-2 mb-2 text-[10px] text-slate-500 font-mono">
              <span>REPORT CANVAS - DRAFT MODE</span>
              <span className="text-[#F2C811]">POWER BI LAYOUT</span>
            </div>

            {/* Top row: KPI Card placeholder */}
            <div className="grid grid-cols-2 gap-4">
              
              <div className="p-4 bg-white/5 border border-white/5 rounded flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Sales Target Status</span>
                <span className="text-xl font-bold font-display text-emerald-400">100% ONLINE</span>
              </div>

              <div className="p-4 bg-white/5 border border-white/5 rounded flex flex-col justify-between min-h-[100px]">
                <span className="text-[10px] text-slate-500 font-mono uppercase">Total Revenue KPI</span>
                {kpiSlot === 'Sales' ? (
                  <motion.span 
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-black font-mono text-[#F2C811] tracking-wide"
                  >
                    ${totalSales.toLocaleString()}
                  </motion.span>
                ) : (
                  <span className="text-xs text-slate-600 font-mono">Configure slot to load KPI data</span>
                )}
              </div>

            </div>

            {/* Bottom row: Bar Chart placeholder */}
            <div className="flex-1 bg-white/5 border border-white/5 rounded p-6 flex flex-col justify-between min-h-[280px]">
              <span className="text-[10px] text-slate-500 font-mono uppercase block mb-4">
                Region Sales bar chart
              </span>
              
              {axisSlot === 'Region' && valueSlot === 'Sales' ? (
                <div className="flex-1 flex flex-col justify-around">
                  {REGIONAL_SALES_DATA.map((row) => {
                    const widthPct = (row.sales / 150000) * 100;
                    return (
                      <div key={row.region} className="flex items-center gap-4">
                        <span className="w-24 text-xs font-semibold text-slate-300 truncate">{row.region}</span>
                        <div className="flex-1 h-5 bg-slate-900 rounded overflow-hidden relative">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${widthPct}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-[#F2C811] to-[#00E5FF] rounded"
                          />
                        </div>
                        <span className="w-16 text-xs text-right font-mono font-bold text-white">
                          ${row.sales.toLocaleString()}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex-1 flex-center flex-col text-slate-600 font-mono gap-2 text-center">
                  <svg className="w-10 h-10 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <span className="text-xs">Drag &quot;Region&quot; to Axis and &quot;Sales&quot; to Values to generate bar chart.</span>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
