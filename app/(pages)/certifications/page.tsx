'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/app/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

const CERTIFICATES_DATA = [
  {
    id: 'cert-01',
    title: 'Certified SQL Relational Expert',
    recipient: 'Analyst Guest',
    issueDate: 'June 28, 2026',
    verifyHash: 'ar_cert_9a48f2b3e8c9',
    status: 'Unlocked',
    desc: 'Demonstrated mastery in writing multi-table relational joins, aggregate query metrics, subqueries, CTE expressions, and database index tuning.'
  },
  {
    id: 'cert-02',
    title: 'Certified Financial Spreadsheet Modeler',
    recipient: 'Analyst Guest',
    issueDate: 'June 25, 2026',
    verifyHash: 'ar_cert_5f2d4e8c1b9a',
    status: 'Unlocked',
    desc: 'Demonstrated mastery in building financial scenario tables, sensitivity calculators, and multi-variable pivot dashboard indexes in Excel.'
  },
  {
    id: 'cert-03',
    title: 'Certified Power BI Dashboard Architect',
    recipient: 'Analyst Guest',
    issueDate: '--',
    verifyHash: '--',
    status: 'Locked',
    desc: 'Demonstrate competency setting up star schemas, writing calculated measures in DAX, and publishing dashboards.'
  }
];

export default function Certifications() {
  const [activeCert, setActiveCert] = useState<typeof CERTIFICATES_DATA[0] | null>(null);

  return (
    <DashboardLayout>
      <div className="mb-8">
        <span className="text-xs text-slate-500 font-mono tracking-widest uppercase">Credentials Shelf</span>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-wide font-display mt-1">
          PROFESSIONAL CERTIFICATIONS
        </h1>
        <p className="text-slate-400 text-sm mt-2">
          Verify and display your earned achievements. Share secure cryptographic hashes on your resume or LinkedIn profile.
        </p>
      </div>

      {/* Grid List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {CERTIFICATES_DATA.map((cert) => (
          <div 
            key={cert.id}
            className={`glass-panel p-6 flex flex-col justify-between h-64 border-t-2 relative overflow-hidden ${
              cert.status === 'Unlocked' ? 'border-[#00E5FF]' : 'border-slate-800'
            }`}
          >
            {/* Locked screen overlay */}
            {cert.status === 'Locked' && (
              <div className="absolute inset-0 bg-[#05070B]/60 backdrop-blur-[2px] z-10 flex-center flex-col text-slate-500 font-mono gap-2">
                <svg className="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-widest">Locked credential</span>
              </div>
            )}

            <div>
              <div className="flex justify-between items-start mb-3 font-mono text-[9px]">
                <span className="px-2 py-0.5 bg-[#00E5FF]/5 rounded border border-[#00E5FF]/20 text-[#00E5FF]">
                  VERIFIED
                </span>
                <span className="text-slate-500">ID: {cert.id}</span>
              </div>

              <h3 className="text-md font-bold text-white font-display uppercase tracking-wide leading-snug">
                {cert.title}
              </h3>
              
              <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
                {cert.desc}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-slate-500 font-mono">Issued: {cert.issueDate}</span>
              <button 
                onClick={() => setActiveCert(cert)}
                className="px-4 py-2 cyber-button text-[9px] font-bold tracking-widest uppercase"
              >
                VIEW CREDENTIAL
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* DYNAMIC DIGITAL CERTIFICATE VIEW MODAL */}
      <AnimatePresence>
        {activeCert && (
          <div className="fixed inset-0 z-50 flex-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCert(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            
            {/* Modal Certificate */}
            <motion.div 
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="relative w-full max-w-4xl p-1 bg-gradient-to-br from-[#00E5FF] via-[#4FC3F7] to-purple-600 rounded-xl overflow-hidden shadow-2xl z-10"
            >
              <div className="p-8 md:p-12 bg-[#0C1017] rounded-lg text-center space-y-8 grid-bg-dense relative">
                
                {/* Certificate top corner details */}
                <div className="flex justify-between items-start text-xs font-mono text-slate-500">
                  <div className="text-left">
                    <span className="block">ORGANIZATION: ANALYTICSRISE</span>
                    <span>LOCATION: CLOUD SERVER GATEWAY</span>
                  </div>
                  <div className="text-right">
                    <span className="block">TELEMETRY HASH: {activeCert.verifyHash}</span>
                    <span className="text-[#00E5FF] font-bold">AR SECURITY SIGNED</span>
                  </div>
                </div>

                <div className="space-y-4 max-w-xl mx-auto">
                  <span className="text-xs text-[#00E5FF] font-mono tracking-widest uppercase font-bold block">
                    Secured Certificate of Completion
                  </span>
                  
                  <h2 className="text-3xl md:text-5xl font-black text-white font-display tracking-wide uppercase">
                    CREDENTIAL AWARDED
                  </h2>
                  
                  <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-[#00E5FF] to-transparent mx-auto my-6" />
                  
                  <p className="text-sm text-slate-400 font-mono">This document officially registers and verifies that</p>
                  
                  <h3 className="text-xl md:text-3xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-[#00E5FF] to-[#4FC3F7] uppercase tracking-widest py-2">
                    {activeCert.recipient}
                  </h3>
                  
                  <p className="text-xs text-slate-400 leading-relaxed font-sans mt-4">
                    has successfully solved all realistic business practice scenarios and met the rigorous exam verification parameters required to qualify as a
                  </p>
                  
                  <h4 className="text-lg font-bold text-white font-display uppercase tracking-widest mt-4">
                    {activeCert.title}
                  </h4>
                </div>

                {/* Certificate Footer Signature areas */}
                <div className="flex justify-between items-end pt-10 border-t border-white/5 text-[10px] font-mono text-slate-500">
                  <div className="text-left space-y-1">
                    <span className="block font-bold text-white text-xs italic">AnalyticsRise System Core</span>
                    <span>VERIFICATION ENGINE AUTHENTICATED</span>
                  </div>
                  
                  {/* Badge */}
                  <div className="w-16 h-16 rounded-full border border-[#00E5FF]/20 flex-center bg-[#00E5FF]/5 shadow-inner">
                    <div className="text-center font-display font-black text-[10px] text-[#00E5FF] tracking-tighter leading-none">
                      AR<br />SYS
                    </div>
                  </div>
                  
                  <div className="text-right space-y-1">
                    <span className="block font-bold text-slate-400">ISSUED: {activeCert.issueDate}</span>
                    <span>SECURE CREDENTIAL CERTIFIED</span>
                  </div>
                </div>

                {/* Close Button */}
                <button 
                  onClick={() => setActiveCert(null)}
                  className="absolute top-4 right-4 text-slate-500 hover:text-white"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
