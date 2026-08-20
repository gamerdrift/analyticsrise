'use client';

import React, { useState } from 'react';
import { FeatureId, ProductTier } from '@/lib/entitlements/types';
import { canUseFeature, getUpgradeContext } from '@/lib/entitlements/entitlements';
import UpgradePromptModal from './UpgradePromptModal';

interface FeatureGateProps {
  featureId: FeatureId;
  userTier?: ProductTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showModalOnTrigger?: boolean;
}

export default function FeatureGate({
  featureId,
  userTier = 'free',
  children,
  fallback,
  showModalOnTrigger = true,
}: FeatureGateProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAllowed = canUseFeature(featureId, userTier);

  if (isAllowed) {
    return <>{children}</>;
  }

  const upgradeContext = getUpgradeContext(featureId);

  return (
    <>
      {fallback ? (
        <div onClick={() => showModalOnTrigger && setIsModalOpen(true)}>
          {fallback}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="p-3 rounded-xl border border-[#00E5FF]/30 bg-[#00E5FF]/5 text-[#00E5FF] text-xs font-mono font-bold flex items-center justify-between w-full hover:bg-[#00E5FF]/10 transition-colors"
        >
          <span>{upgradeContext.title}</span>
          <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#00E5FF]/20">
            PRO
          </span>
        </button>
      )}

      {showModalOnTrigger && (
        <UpgradePromptModal
          isOpen={isModalOpen}
          context={upgradeContext}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
