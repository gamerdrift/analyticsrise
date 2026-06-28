'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';


const DATASETS_LIST = [
  {
    id: 'ds-retail',
    title: 'Global Retail Transaction Ledger Q4',
    category: 'E-commerce & Retail',
    rows: 45200,
    columns: 12,
    size: '4.2 MB',
    format: 'CSV / Parquet',
    missingDataPct: '0.4%',
    desc: 'Contains order lines, product categories, regions, shipping times, sales, costs, discounts, and margins.',
    schema: [
      { col: 'transaction_id', type: 'INT', desc: 'Primary ID for retail transaction' },
      { col: 'order_date', type: 'DATE', desc: 'Timestamp of transaction event' },
      { col: 'customer_segment', type: 'VARCHAR(50)', desc: 'Corporate, Consumer, SMB' },
      { col: 'region', type: 'VARCHAR(50)', desc: 'Geographic market region' },
      { col: 'sales', type: 'DECIMAL(10,2)', desc: 'Gross transaction value' },
      { col: 'quantity', type: 'INT', desc: 'Number of units sold' },
    ]
  },
  {
    id: 'ds-saas',
    title: 'SaaS Customer Retention & Churn Metrics',
    category: 'Software & Technology',
    rows: 12800,
    columns: 9,
    size: '1.8 MB',
    format: 'CSV / JSON',
    missingDataPct: '1.2%',
    desc: 'Cohort tracking analysis, containing MRR variables, tenure logs, active sessions, and churn indicator flags.',
    schema: [
      { col: 'customer_id', type: 'INT', desc: 'Primary ID for SaaS customer profile' },
      { col: 'tenure_months', type: 'INT', desc: 'Number of months active subscription' },
      { col: 'mrr', type: 'DECIMAL(10,2)', desc: 'Monthly Recurring Revenue' },
      { col: 'support_tickets_30d', type: 'INT', desc: 'Help tickets logged in past 30 days' },
      { col: 'churned', type: 'BOOLEAN', desc: 'Flag indicating account churn (0/1)' },
    ]
  },
  {
    id: 'ds-marketing',
    title: 'Digital Marketing Ad Spend & Attribution',
    category: 'Marketing Analytics',
    rows: 95000,
    columns: 8,
    size: '8.4 MB',
    format: 'Parquet',
    missingDataPct: '0.0%',
    desc: 'Attribution clickstream data across Search, Social, Display, and Email campaigns with conversion values.',
    schema: [
      { col: 'impression_id', type: 'VARCHAR(50)', desc: 'Unique impression tag' },
      { col: 'channel', type: 'VARCHAR(30)', desc: 'Social, Search, Display, Email' },
      { col: 'spend_usd', type: 'DECIMAL(10,4)', desc: 'Advertising cash spent' },
      { col: 'conversions', type: 'INT', desc: 'Conversions attributed (0/1)' },
    ]
  }
];

export default function DatasetsPage() {
  const [selectedDataset, setSelectedDataset] = useState<typeof DATASETS_LIST[0] | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setDownloadProgress(0);
    
    // Simulated download timer
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadingId(null), 800);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Analytics Resources</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          CLEANED BUSINESS DATASETS
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Download cleaned, structurally sound business datasets to build your offline portfolio or run simulators.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* DATASETS CATALOG */}
        <div className="lg:col-span-2 space-y-6">
          {DATASETS_LIST.map((ds) => (
            <div 
              key={ds.id}
              onClick={() => setSelectedDataset(ds)}
              className={`glass-panel glass-panel-hover p-6 cursor-pointer flex flex-col justify-between transition-all ${
                selectedDataset?.id === ds.id ? 'border-[#00E5FF] shadow-[#00E5FF]/5 shadow-lg' : ''
              }`}
            >
              <div>
                <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
                  <span className="px-2 py-0.5 text-[9px] font-mono bg-white/5 rounded border border-white/5 text-[#4FC3F7] uppercase tracking-wider">
                    {ds.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">{ds.format}</span>
                </div>

                <h3 className="text-md font-bold text-white font-display uppercase tracking-wide">
                  {ds.title}
                </h3>
                
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  {ds.desc}
                </p>

                {/* Telemetry quick details */}
                <div className="grid grid-cols-4 gap-4 mt-6 p-3 bg-white/5 border border-white/5 rounded text-xs font-mono">
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Rows</span>
                    <span className="text-white font-bold">{ds.rows.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Cols</span>
                    <span className="text-white font-bold">{ds.columns}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">File Size</span>
                    <span className="text-white font-bold">{ds.size}</span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-500 block uppercase">Outliers</span>
                    <span className="text-[#00E676] font-bold">{ds.missingDataPct}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-end">
                {downloadingId === ds.id ? (
                  <div className="w-full">
                    <div className="flex justify-between text-[10px] font-mono text-slate-500 mb-1">
                      <span>Downloading telemetry...</span>
                      <span>{downloadProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#00E5FF] h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }} />
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(ds.id);
                    }}
                    className="px-6 py-2.5 cyber-button text-[10px] font-bold tracking-widest uppercase"
                  >
                    DOWNLOAD DATASET
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SCHEMA VIEW PANEL */}
        <div className="lg:col-span-1">
          {selectedDataset ? (
            <div className="glass-panel p-6 bg-[#090D14]/90 border border-[#00E5FF]/20 sticky top-6">
              <span className="text-[10px] text-[#4FC3F7] font-mono tracking-widest block uppercase mb-1">
                Relational Schema
              </span>
              <h2 className="text-lg font-bold text-white font-display uppercase tracking-wide border-b border-white/5 pb-3">
                {selectedDataset.title}
              </h2>

              <div className="space-y-4 my-6">
                <span className="text-[10px] text-slate-500 font-mono uppercase block">Column details:</span>
                {selectedDataset.schema.map((col, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/5 rounded-lg text-xs space-y-1 font-mono">
                    <div className="flex justify-between">
                      <span className="text-white font-bold">{col.col}</span>
                      <span className="text-[#00E5FF] text-[10px]">{col.type}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-normal">{col.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center text-slate-500 font-mono flex-center flex-col h-64">
              <svg className="w-10 h-10 text-slate-700 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4" />
              </svg>
              <span className="text-xs">Select a dataset from catalog to display relational SQL schemas.</span>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
}
