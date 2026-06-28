'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock Databases and datasets
const mockSalesDb = [
  { id: 1, product: 'Enterprise DB', region: 'West', revenue: 58000, units: 12 },
  { id: 2, product: 'Security Analytics', region: 'East', revenue: 61000, units: 8 },
  { id: 3, product: 'BI Cloud Connector', region: 'West', revenue: 45000, units: 15 },
  { id: 4, product: 'Data Pipeline API', region: 'East', revenue: 32000, units: 4 },
  { id: 5, product: 'ML Modeler Studio', region: 'North', revenue: 75000, units: 10 },
  { id: 6, product: 'SaaS Telemetry Core', region: 'South', revenue: 29000, units: 20 },
];

export default function InteractivePreview() {
  const [activeTab, setActiveTab] = useState<'sql' | 'excel' | 'powerbi' | 'tableau'>('sql');

  // SQL State
  const [sqlQuery, setSqlQuery] = useState("SELECT * FROM sales WHERE region = 'West' ORDER BY revenue DESC;");
  const [sqlResult, setSqlResult] = useState<typeof mockSalesDb>(
    mockSalesDb.filter((r) => r.region === 'West').sort((a, b) => b.revenue - a.revenue)
  );
  const [sqlStatus, setSqlStatus] = useState('SYSTEM STATE: idle. Ready to execute query.');

  // Excel State
  const [excelCells, setExcelCells] = useState({
    B2: '15000',
    B3: '22000',
  });
  const handleExcelChange = (cell: 'B2' | 'B3', val: string) => {
    const numeric = val.replace(/[^0-9]/g, '');
    setExcelCells((prev) => ({ ...prev, [cell]: numeric }));
  };
  const b2Num = parseFloat(excelCells.B2) || 0;
  const b3Num = parseFloat(excelCells.B3) || 0;
  const excelTotal = b2Num + b3Num;

  // Power BI State
  const [biDimension, setBiDimension] = useState<string | null>('Region');
  const [biMeasure, setBiMeasure] = useState<string | null>('Revenue');
  const [biChartType, setBiChartType] = useState<'bar' | 'pie'>('bar');

  // Tableau State
  const [tableauMarkColor, setTableauMarkColor] = useState('#00E5FF');
  const [tableauDensity, setTableauDensity] = useState(60);

  const handleRunSql = () => {
    try {
      const lower = sqlQuery.toLowerCase();
      if (!lower.includes('select')) {
        setSqlResult([]);
        setSqlStatus('ERROR: Query must begin with SELECT statement.');
        return;
      }
      
      let filtered = [...mockSalesDb];
      if (lower.includes("region = 'west'") || lower.includes("region='west'")) {
        filtered = filtered.filter((r) => r.region === 'West');
      } else if (lower.includes("region = 'east'") || lower.includes("region='east'")) {
        filtered = filtered.filter((r) => r.region === 'East');
      } else if (lower.includes("region = 'north'") || lower.includes("region='north'")) {
        filtered = filtered.filter((r) => r.region === 'North');
      } else if (lower.includes("region = 'south'") || lower.includes("region='south'")) {
        filtered = filtered.filter((r) => r.region === 'South');
      }

      if (lower.includes('order by revenue desc')) {
        filtered.sort((a, b) => b.revenue - a.revenue);
      }

      setSqlResult(filtered);
      setSqlStatus(`SUCCESS: Found ${filtered.length} rows inside 'sales' table.`);
    } catch {
      setSqlStatus('ERROR: Syntax compilation failure.');
    }
  };

  return (
    <section id="simulators" className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
      {/* Headings */}
      <div className="text-center mb-16">
        <h2 className="text-xs uppercase tracking-widest text-[#00E5FF] font-mono font-bold mb-3">
          Interactive Simulators
        </h2>
        <p className="text-3xl md:text-4xl font-bold text-white font-display uppercase tracking-wide">
          TEST RUN THE WORKSPACES INSTANTLY
        </p>
        <p className="text-slate-400 mt-4 max-w-2xl mx-auto text-sm">
          Get a hands-on preview of the fully-featured tools available inside the console. Write SQL queries, update cell formulas, or map database fields below.
        </p>
      </div>

      {/* Simulator Interface Wrapper */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Selector */}
        <div className="flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          {[
            { id: 'sql', title: 'SQL Console', desc: 'Query database tables' },
            { id: 'excel', title: 'Excel Sheets', desc: 'Aggregate data cells' },
            { id: 'powerbi', title: 'Power BI Planner', desc: 'Drag-and-drop visuals' },
            { id: 'tableau', title: 'Tableau Sheets', desc: 'Distribution analytics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`p-4 rounded-lg text-left flex-1 min-w-[200px] lg:min-w-0 transition-all border ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#00E5FF]/10 to-[#4FC3F7]/5 border-[#00E5FF] text-white'
                  : 'bg-[#0D1117]/60 border-white/5 text-slate-400 hover:text-white hover:border-slate-800'
              }`}
            >
              <span className="block text-sm font-bold font-display uppercase tracking-wider">
                {tab.title}
              </span>
              <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1 block">
                {tab.desc}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Canvas Area */}
        <div className="lg:col-span-3 min-h-[460px] p-6 rounded-xl border border-white/10 bg-[#0D1117]/70 backdrop-blur-md relative flex flex-col justify-between overflow-hidden shadow-2xl">
          {/* Header Controls */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/50" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <span className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
              Live Preview Workstation
            </span>
          </div>

          {/* Active Workstation Render */}
          <div className="flex-1 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {activeTab === 'sql' && (
                <motion.div
                  key="sql"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid md:grid-cols-3 gap-6">
                    {/* Console Editor */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="relative">
                        <textarea
                          value={sqlQuery}
                          onChange={(e) => setSqlQuery(e.target.value)}
                          className="w-full h-32 p-4 rounded bg-[#05070B] border border-white/10 font-mono text-xs text-[#00E5FF] focus:outline-none focus:border-[#00E5FF]/50 resize-none"
                          spellCheck="false"
                        />
                        <button
                          onClick={handleRunSql}
                          className="absolute bottom-4 right-4 px-4 py-2 bg-[#00E5FF] text-black text-[10px] font-mono font-bold tracking-widest uppercase rounded hover:bg-white transition-colors"
                        >
                          RUN QUERY
                        </button>
                      </div>
                      <div className="p-3 bg-[#05070B] border border-white/5 rounded text-[10px] font-mono text-slate-400">
                        {sqlStatus}
                      </div>
                    </div>

                    {/* Schema Explorer */}
                    <div className="p-4 rounded bg-[#05070B] border border-white/5 font-mono text-[10px] text-slate-400">
                      <h4 className="font-bold text-white uppercase tracking-wider mb-3">SCHEMA EXPLORER</h4>
                      <div className="space-y-2">
                        <div>
                          <span className="text-[#00E5FF]">table</span> sales
                          <ul className="pl-4 list-disc space-y-1 mt-1 text-slate-500">
                            <li>id <span className="text-slate-600">int</span></li>
                            <li>product <span className="text-slate-600">varchar</span></li>
                            <li>region <span className="text-slate-600">varchar</span></li>
                            <li>revenue <span className="text-slate-600">int</span></li>
                            <li>units <span className="text-slate-600">int</span></li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Panel */}
                  <div className="overflow-x-auto rounded border border-white/5">
                    <table className="w-full font-mono text-xs text-slate-300">
                      <thead className="bg-[#05070B] text-slate-500 uppercase text-[9px] tracking-widest text-left">
                        <tr>
                          <th className="p-3">ID</th>
                          <th className="p-3">Product</th>
                          <th className="p-3">Region</th>
                          <th className="p-3 text-right">Revenue</th>
                          <th className="p-3 text-right">Units</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {sqlResult.length > 0 ? (
                          sqlResult.map((row) => (
                            <tr key={row.id} className="hover:bg-white/5">
                              <td className="p-3 text-slate-600">{row.id}</td>
                              <td className="p-3 font-semibold text-white">{row.product}</td>
                              <td className="p-3 text-[#4FC3F7]">{row.region}</td>
                              <td className="p-3 text-right text-emerald-400">${row.revenue.toLocaleString()}</td>
                              <td className="p-3 text-right">{row.units}</td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={5} className="p-6 text-center text-slate-600 uppercase tracking-widest">
                              No records returned.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {activeTab === 'excel' && (
                <motion.div
                  key="excel"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-2 gap-8"
                >
                  {/* Excel Sheet */}
                  <div className="space-y-4 font-mono text-xs">
                    <div className="bg-[#05070B] border border-white/10 rounded overflow-hidden">
                      <div className="grid grid-cols-4 bg-slate-900/50 text-slate-500 text-center text-[10px] font-bold border-b border-white/10 uppercase">
                        <div className="p-2 border-r border-white/10" />
                        <div className="p-2 border-r border-white/10">A</div>
                        <div className="p-2 border-r border-white/10">B</div>
                        <div className="p-2">C</div>
                      </div>
                      
                      {/* Row 1: Headers */}
                      <div className="grid grid-cols-4 border-b border-white/5 text-center">
                        <div className="p-2 bg-slate-900/30 text-slate-600 text-[10px] border-r border-white/5">1</div>
                        <div className="p-2 border-r border-white/5 text-slate-400">Quarter</div>
                        <div className="p-2 border-r border-white/5 text-slate-400">Target</div>
                        <div className="p-2 text-slate-400">Forecast</div>
                      </div>

                      {/* Row 2: Q1 */}
                      <div className="grid grid-cols-4 border-b border-white/5 text-center items-center">
                        <div className="p-2 bg-slate-900/30 text-slate-600 text-[10px] border-r border-white/5">2</div>
                        <div className="p-2 border-r border-white/5 text-slate-400">Q1</div>
                        <div className="p-2 border-r border-white/5 bg-slate-950">
                          <input
                            type="text"
                            value={excelCells.B2}
                            onChange={(e) => handleExcelChange('B2', e.target.value)}
                            className="bg-transparent text-[#00E5FF] w-full text-center focus:outline-none"
                          />
                        </div>
                        <div className="p-2 text-slate-500">${(b2Num * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>

                      {/* Row 3: Q2 */}
                      <div className="grid grid-cols-4 border-b border-white/5 text-center items-center">
                        <div className="p-2 bg-slate-900/30 text-slate-600 text-[10px] border-r border-white/5">3</div>
                        <div className="p-2 border-r border-white/5 text-slate-400">Q2</div>
                        <div className="p-2 border-r border-white/5 bg-slate-950">
                          <input
                            type="text"
                            value={excelCells.B3}
                            onChange={(e) => handleExcelChange('B3', e.target.value)}
                            className="bg-transparent text-[#00E5FF] w-full text-center focus:outline-none"
                          />
                        </div>
                        <div className="p-2 text-slate-500">${(b3Num * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>

                      {/* Row 4: Total */}
                      <div className="grid grid-cols-4 text-center items-center font-bold bg-[#00E5FF]/5">
                        <div className="p-2 bg-slate-900/30 text-slate-600 text-[10px] border-r border-white/5">4</div>
                        <div className="p-2 border-r border-white/5 text-white">Total</div>
                        <div className="p-2 border-r border-white/5 text-[#00E5FF] font-black">${excelTotal.toLocaleString()}</div>
                        <div className="p-2 text-slate-400">${(excelTotal * 1.15).toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 italic">
                      💡 Tip: Try editing the Cyan input numbers under column B!
                    </div>
                  </div>

                  {/* SVG Chart Preview */}
                  <div className="flex flex-col justify-between p-6 rounded bg-[#05070B] border border-white/5 min-h-[220px]">
                    <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mb-4">SVG Total Sales Forecast</span>
                    
                    {/* SVG Bars */}
                    <div className="flex-1 flex items-end justify-around h-32 px-4 border-b border-slate-800 pb-2 gap-4">
                      {/* Q1 Bar */}
                      <div className="flex flex-col items-center w-full max-w-[64px] gap-2">
                        <span className="text-[10px] font-mono text-slate-400">${b2Num.toLocaleString()}</span>
                        <div 
                          className="w-full bg-[#00E5FF]/80 rounded-t transition-all duration-300"
                          style={{ height: `${Math.min(b2Num / 400, 100)}px` }}
                        />
                        <span className="text-[10px] font-mono text-slate-500">Q1</span>
                      </div>

                      {/* Q2 Bar */}
                      <div className="flex flex-col items-center w-full max-w-[64px] gap-2">
                        <span className="text-[10px] font-mono text-slate-400">${b3Num.toLocaleString()}</span>
                        <div 
                          className="w-full bg-[#4FC3F7]/80 rounded-t transition-all duration-300"
                          style={{ height: `${Math.min(b3Num / 400, 100)}px` }}
                        />
                        <span className="text-[10px] font-mono text-slate-500">Q2</span>
                      </div>

                      {/* Total Bar */}
                      <div className="flex flex-col items-center w-full max-w-[64px] gap-2">
                        <span className="text-[10px] font-mono text-[#00E5FF] font-bold">${excelTotal.toLocaleString()}</span>
                        <div 
                          className="w-full bg-gradient-to-t from-[#00E5FF] to-[#4FC3F7] rounded-t transition-all duration-300 shadow-md shadow-[#00E5FF]/20"
                          style={{ height: `${Math.min(excelTotal / 400, 100)}px` }}
                        />
                        <span className="text-[10px] font-mono text-slate-400">Total</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'powerbi' && (
                <motion.div
                  key="powerbi"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-3 gap-6 font-mono text-xs"
                >
                  {/* Fields Panel */}
                  <div className="p-4 rounded bg-[#05070B] border border-white/5 space-y-4">
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[10px]">FIELDS</h4>
                      <div className="space-y-1.5 text-[10px]">
                        {[
                          { name: 'Region', type: 'dimension' },
                          { name: 'Revenue', type: 'measure' },
                          { name: 'Units Sold', type: 'measure' },
                          { name: 'Category', type: 'dimension' },
                        ].map((field) => (
                          <button
                            key={field.name}
                            onClick={() => {
                              if (field.type === 'dimension') {
                                setBiDimension(field.name);
                              } else {
                                setBiMeasure(field.name);
                              }
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded text-left transition-all ${
                              (field.type === 'dimension' && biDimension === field.name) ||
                              (field.type === 'measure' && biMeasure === field.name)
                                ? 'bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30'
                                : 'bg-slate-900 border border-transparent text-slate-400 hover:text-white'
                            }`}
                          >
                            <span>{field.name}</span>
                            <span className="text-[8px] uppercase tracking-widest text-slate-600 font-bold">
                              {field.type}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[10px]">VISUALS</h4>
                      <div className="grid grid-cols-2 gap-2 text-[9px] font-bold">
                        <button
                          onClick={() => setBiChartType('bar')}
                          className={`p-2 rounded border text-center ${
                            biChartType === 'bar'
                              ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                              : 'bg-slate-900 border-white/5 text-slate-400'
                          }`}
                        >
                          BAR CHART
                        </button>
                        <button
                          onClick={() => setBiChartType('pie')}
                          className={`p-2 rounded border text-center ${
                            biChartType === 'pie'
                              ? 'bg-[#00E5FF]/15 border-[#00E5FF] text-[#00E5FF]'
                              : 'bg-slate-900 border-white/5 text-slate-400'
                          }`}
                        >
                          PIE CHART
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Workspace Canvas Preview */}
                  <div className="md:col-span-2 flex flex-col justify-between p-6 rounded bg-[#05070B] border border-white/5 min-h-[300px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4 text-[10px] text-slate-500">
                      <span>BI Visual Canvas</span>
                      <span>ACTIVE: {biDimension || 'None'} × {biMeasure || 'None'}</span>
                    </div>

                    {/* SVG Graphic Output */}
                    <div className="flex-1 flex items-center justify-center">
                      {biChartType === 'bar' ? (
                        <div className="w-full flex items-end justify-around h-40 border-b border-slate-800 pb-2 gap-2">
                          {[
                            { group: 'North', val: 75 },
                            { group: 'South', val: 29 },
                            { group: 'West', val: 103 },
                            { group: 'East', val: 93 },
                          ].map((b) => (
                            <div key={b.group} className="flex flex-col items-center w-full max-w-[40px] gap-2">
                              <span className="text-[9px] text-slate-500">
                                {biMeasure === 'Revenue' ? `$${b.val}K` : `${Math.floor(b.val / 5)}`}
                              </span>
                              <div
                                className="w-full bg-[#00E5FF] rounded-t transition-all duration-500"
                                style={{ height: `${b.val}px` }}
                              />
                              <span className="text-[9px] text-slate-600">{b.group}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative w-40 h-40 flex-center">
                          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                            {/* West */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#00E5FF" strokeWidth="20" strokeDasharray="251" strokeDashoffset="60" />
                            {/* East */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#4FC3F7" strokeWidth="20" strokeDasharray="251" strokeDashoffset="135" />
                            {/* North */}
                            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#1E293B" strokeWidth="20" strokeDasharray="251" strokeDashoffset="210" />
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-500 uppercase">{biDimension}</span>
                            <span className="text-[11px] text-white font-bold">{biMeasure}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'tableau' && (
                <motion.div
                  key="tableau"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid md:grid-cols-3 gap-6 font-mono text-xs"
                >
                  {/* Marks Card Settings */}
                  <div className="p-4 rounded bg-[#05070B] border border-white/5 space-y-6">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[10px]">MARKS CARD</h4>
                    
                    {/* Color selector */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-wider block">COLOR PALETTE</span>
                      <div className="flex gap-2">
                        {['#00E5FF', '#4FC3F7', '#FFD600', '#00E676'].map((col) => (
                          <button
                            key={col}
                            onClick={() => setTableauMarkColor(col)}
                            className="w-6 h-6 rounded-full border border-white/10 cursor-pointer transition-transform hover:scale-110"
                            style={{ backgroundColor: col }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Density Slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] text-slate-500 uppercase">
                        <span>DATA DENSITY</span>
                        <span className="text-white font-bold">{tableauDensity}%</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="100"
                        value={tableauDensity}
                        onChange={(e) => setTableauDensity(Number(e.target.value))}
                        className="w-full accent-[#00E5FF] cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Workbook Canvas */}
                  <div className="md:col-span-2 flex flex-col justify-between p-6 rounded bg-[#05070B] border border-white/5 min-h-[300px]">
                    <div className="flex items-center justify-between border-b border-white/5 pb-2 mb-4 text-[10px] text-slate-500">
                      <span>Tableau Sheet Aggregation</span>
                      <span>Marks Count: {Math.floor(tableauDensity * 1.5)}</span>
                    </div>

                    {/* Dynamic Aggregated Heat Grid */}
                    <div className="flex-1 grid grid-cols-8 gap-2 p-2">
                      {Array.from({ length: 32 }).map((_, idx) => {
                        const opacity = Math.min((idx / 32) * (tableauDensity / 100) + 0.15, 1.0);
                        return (
                          <div
                            key={idx}
                            className="rounded transition-all duration-300"
                            style={{
                              backgroundColor: tableauMarkColor,
                              opacity: opacity,
                              minHeight: '32px'
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Telemetry Info */}
          <div className="mt-6 pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 font-mono gap-2">
            <span>CORES COMPILED: RELATIONAL_ENGINE_ONLINE</span>
            <span className="text-[#00E5FF] uppercase tracking-widest animate-pulse">
              System Ready for Simulation
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
