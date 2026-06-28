'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '@/app/components/layout/DashboardLayout';

// Mock DB tables
const MOCK_ORDERS = [
  { order_id: 101, customer_name: 'TechCorp Enterprise', segment: 'Enterprise', quarter: 'Q4', revenue: 75000 },
  { order_id: 102, customer_name: 'Global Ventures', segment: 'SMB', quarter: 'Q4', revenue: 15000 },
  { order_id: 103, customer_name: 'Hyperion Labs', segment: 'Enterprise', quarter: 'Q4', revenue: 58000 },
  { order_id: 104, customer_name: 'Acura Inc', segment: 'Enterprise', quarter: 'Q3', revenue: 95000 },
  { order_id: 105, customer_name: 'Nexa Retail', segment: 'SMB', quarter: 'Q4', revenue: 42000 },
  { order_id: 106, customer_name: 'Skyline Capital', segment: 'Enterprise', quarter: 'Q4', revenue: 120000 },
  { order_id: 107, customer_name: 'Vertex Media', segment: 'SMB', quarter: 'Q3', revenue: 8000 },
  { order_id: 108, customer_name: 'Core Dynamics', segment: 'Enterprise', quarter: 'Q4', revenue: 32000 },
];

const MOCK_SCHEMAS = {
  orders: [
    { name: 'order_id', type: 'INT', key: 'PRIMARY KEY' },
    { name: 'customer_name', type: 'VARCHAR(100)' },
    { name: 'segment', type: 'VARCHAR(50)' },
    { name: 'quarter', type: 'VARCHAR(10)' },
    { name: 'revenue', type: 'DECIMAL(10,2)' },
  ]
};

export default function SqlSimulator() {
  const [query, setQuery] = useState('SELECT customer_name, quarter, revenue \nFROM orders \nWHERE segment = \'Enterprise\' \n  AND revenue > 50000 \n  AND quarter = \'Q4\';');
  const [results, setResults] = useState<any[]>([]);
  const [execTime, setExecTime] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [labCompleted, setLabCompleted] = useState(false);

  // In-memory lightweight SQL parser/evaluator
  const executeQuery = () => {
    setErrorMsg('');
    setSuccessMsg('');
    const startTime = performance.now();

    try {
      // Clean query text
      const cleanSql = query.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
      const uppercaseSql = cleanSql.toUpperCase();

      // Check basic parsing validity
      if (!uppercaseSql.startsWith('SELECT ')) {
        throw new Error('Syntax Error: Queries must start with SELECT');
      }

      if (!uppercaseSql.includes(' FROM ')) {
        throw new Error('Syntax Error: Missing FROM clause');
      }

      // Extract columns
      const selectIndex = uppercaseSql.indexOf('SELECT ') + 7;
      const fromIndex = uppercaseSql.indexOf(' FROM ');
      const columnsPart = cleanSql.substring(selectIndex, fromIndex).trim();

      // Extract table
      let tablePart = '';
      let wherePart = '';
      const whereIndex = uppercaseSql.indexOf(' WHERE ');

      if (whereIndex !== -1) {
        tablePart = cleanSql.substring(fromIndex + 6, whereIndex).trim();
        wherePart = cleanSql.substring(whereIndex + 7).trim();
      } else {
        tablePart = cleanSql.substring(fromIndex + 6).trim();
      }

      if (tablePart.toLowerCase() !== 'orders') {
        throw new Error(`Database Error: Table '${tablePart}' not found in current schema.`);
      }

      // Filter rows based on WHERE clause
      let filteredRows = [...MOCK_ORDERS];

      if (wherePart) {
        // Simple manual parsing of typical conditions: segment = 'Enterprise' AND revenue > 50000 AND quarter = 'Q4'
        const conditions = wherePart.split(/ AND /i);
        
        conditions.forEach(cond => {
          const cleanCond = cond.replace(/\s+/g, ' ').trim();
          
          if (cleanCond.includes('=')) {
            let [col, val] = cleanCond.split('=');
            col = col.trim().toLowerCase();
            val = val.trim().replace(/['"]/g, ''); // strip quotes
            
            filteredRows = filteredRows.filter(row => {
              const rowVal = (row as any)[col];
              return String(rowVal).toLowerCase() === val.toLowerCase();
            });
          } else if (cleanCond.includes('>')) {
            const parts = cleanCond.split('>');
            const col = parts[0].trim().toLowerCase();
            const val = parts[1].trim();
            const numericVal = parseFloat(val);
            
            filteredRows = filteredRows.filter(row => {
              const rowVal = parseFloat((row as any)[col]);
              return rowVal > numericVal;
            });
          } else if (cleanCond.includes('<')) {
            const parts = cleanCond.split('<');
            const col = parts[0].trim().toLowerCase();
            const val = parts[1].trim();
            const numericVal = parseFloat(val);
            
            filteredRows = filteredRows.filter(row => {
              const rowVal = parseFloat((row as any)[col]);
              return rowVal < numericVal;
            });
          }
        });
      }

      // Project columns
      const selectedCols = columnsPart.split(',').map(c => c.trim().toLowerCase());
      
      const mappedResults = filteredRows.map(row => {
        const obj: any = {};
        selectedCols.forEach(col => {
          if (col === '*') {
            Object.assign(obj, row);
          } else if (col in row) {
            obj[col] = (row as any)[col];
          } else {
            throw new Error(`Schema Error: Column '${col}' not found in table 'orders'`);
          }
        });
        return obj;
      });

      setResults(mappedResults);
      setExecTime(performance.now() - startTime);

      // Verify Scenario Completion:
      // Target output has exactly the rows: TechCorp Enterprise ($75,000), Hyperion Labs ($58,000), Skyline Capital ($120,000)
      const targetQueryMatches = 
        mappedResults.length === 3 &&
        mappedResults.some(r => r.customer_name === 'TechCorp Enterprise') &&
        mappedResults.some(r => r.customer_name === 'Hyperion Labs') &&
        mappedResults.some(r => r.customer_name === 'Skyline Capital') &&
        selectedCols.includes('customer_name') &&
        selectedCols.includes('revenue') &&
        selectedCols.includes('quarter');

      if (targetQueryMatches) {
        setSuccessMsg('Query Verified! Data output matches the corporate target. Level verified.');
        setLabCompleted(true);
      } else {
        setSuccessMsg(`Query executed successfully. Returned ${mappedResults.length} rows.`);
      }

    } catch (e: any) {
      setErrorMsg(e.message);
      setResults([]);
      setExecTime(null);
    }
  };

  const handleApplyPreset = (presetSql: string) => {
    setQuery(presetSql);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-between flex-wrap gap-4">
        <div>
          <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Simulator Module</span>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
            SQL CONSOLE PLAYGROUND
          </h1>
        </div>
      </div>

      <div className="grid xl:grid-cols-4 gap-8">
        
        {/* SIDEBAR: SCHEMA & OBJECTIVES */}
        <div className="xl:col-span-1 space-y-6">
          
          {/* LAB OBJECTIVE CARD */}
          <div className="glass-panel p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#00E5FF]" />
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3">
              Lab Objective
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Write a SELECT query to filter Q4 sales metrics. Retrieve the <strong className="text-white">customer_name</strong>, <strong className="text-white">quarter</strong>, and <strong className="text-white">revenue</strong> for all <strong className="text-white">Enterprise</strong> segment records where revenue is greater than <strong className="text-white">$50,000</strong>.
            </p>
            
            <div className="space-y-2">
              <span className="text-[10px] text-slate-500 font-mono uppercase block">Expected Outputs:</span>
              <ul className="text-[10px] text-slate-400 font-mono list-disc pl-4 space-y-1">
                <li>segment = &apos;Enterprise&apos;</li>
                <li>quarter = &apos;Q4&apos;</li>
                <li>revenue &gt; 50000</li>
              </ul>
            </div>
          </div>

          {/* TABLE SCHEMA VIEWER */}
          <div className="glass-panel p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-800" />
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-[#00E5FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4" />
              </svg>
              SCHEMA: orders
            </h3>
            
            <div className="space-y-2 font-mono text-[10px]">
              {MOCK_SCHEMAS.orders.map((col, idx) => (
                <div key={idx} className="flex justify-between border-b border-white/5 py-1">
                  <span className="text-slate-300 font-bold">{col.name}</span>
                  <span className="text-slate-500">{col.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TEMPLATE QUICK LOGS */}
          <div className="glass-panel p-5">
            <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest mb-3">
              Query Presets
            </h3>
            <div className="space-y-2">
              <button 
                onClick={() => handleApplyPreset('SELECT * FROM orders;')}
                className="w-full text-left p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-slate-300 rounded"
              >
                SELECT * FROM orders;
              </button>
              <button 
                onClick={() => handleApplyPreset('SELECT customer_name, segment, revenue FROM orders WHERE segment = \'SMB\';')}
                className="w-full text-left p-2 bg-white/5 hover:bg-white/10 border border-white/5 text-[10px] font-mono text-slate-300 rounded"
              >
                SELECT segment FROM orders WHERE segment = &apos;SMB&apos;;
              </button>
            </div>
          </div>

        </div>

        {/* WORKSPACE & QUERY EXECUTION */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* SQL Editor terminal */}
          <div className="glass-panel overflow-hidden border border-[#00E5FF]/20">
            {/* Window chrome header */}
            <div className="h-10 bg-[#0C0F16] border-b border-white/5 flex items-center justify-between px-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-xs font-mono text-slate-500 ml-4">orders.sql</span>
              </div>
              
              <button 
                onClick={executeQuery}
                className="px-6 py-1 bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-mono text-xs font-black rounded transition-all flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                RUN QUERY
              </button>
            </div>

            {/* SQL Input Area */}
            <textarea 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-44 p-6 bg-[#05070B] text-slate-200 font-mono text-sm border-none focus:outline-none focus:ring-0 resize-none leading-relaxed"
            />
          </div>

          {/* TELEMETRY FEEDBACK */}
          {errorMsg && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/30 text-rose-400 font-mono text-xs rounded-lg">
              ❌ {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs rounded-lg flex items-center justify-between flex-wrap gap-4">
              <span>✔ {successMsg}</span>
              {labCompleted && (
                <Link href="/" className="px-4 py-1.5 bg-[#00E5FF] hover:bg-[#00B8CC] text-black font-display font-bold text-[10px] tracking-wider rounded">
                  NEXT LEVEL
                </Link>
              )}
            </div>
          )}

          {/* OUTPUT VIEWPORT */}
          <div className="glass-panel p-6 bg-[#07090E] min-h-[250px] relative">
            <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
              <h3 className="text-xs font-bold text-white font-display uppercase tracking-widest flex items-center gap-2">
                Query Results Console
              </h3>
              {execTime !== null && (
                <span className="text-[10px] text-slate-500 font-mono">
                  Time: {execTime.toFixed(2)} ms | Status: SUCCESS
                </span>
              )}
            </div>

            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-500 uppercase text-[10px]">
                      {Object.keys(results[0]).map((key) => (
                        <th key={key} className="py-2.5 px-4 font-bold">{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((row, idx) => (
                      <tr key={idx} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        {Object.values(row).map((val: any, vIdx) => (
                          <td key={vIdx} className="py-3 px-4">
                            {typeof val === 'number' && val > 1000 ? `$${val.toLocaleString()}` : String(val)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-44 flex-center flex-col text-slate-500 gap-2">
                <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-xs font-mono">Console Idle. Click &quot;RUN QUERY&quot; to fetch results.</span>
              </div>
            )}
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
