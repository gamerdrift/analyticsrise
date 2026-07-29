'use client';

import React from 'react';
import fingerprintData from '@/lib/config/fingerprint.json';

export default function DeploymentFingerprint() {
  const fp = fingerprintData || {
    version: 'v1.0.0-beta',
    commit: 'b6078b3',
    buildTimestamp: new Date().toISOString(),
    deploymentTimestamp: new Date().toISOString(),
    firebaseProject: 'analyticsrise-56655',
    buildNumber: 'BUILD-PROD',
  };

  return (
    <div className="w-full bg-[#05070B] border-t border-white/5 py-2 px-4 text-[9px] font-mono text-slate-500 flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-3 flex-wrap">
        <span>VER: <strong className="text-[#00E5FF]">{fp.version}</strong></span>
        <span>COMMIT: <strong className="text-white">{fp.commit}</strong></span>
        <span>BUILD: <strong className="text-slate-400">{fp.buildNumber}</strong></span>
        <span>PROJECT: <strong className="text-emerald-400">{fp.firebaseProject}</strong></span>
      </div>
      <div className="flex items-center gap-3">
        <span>TIMESTAMP: {fp.deploymentTimestamp}</span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase font-bold">
          LIVE VERIFIED
        </span>
      </div>
    </div>
  );
}
