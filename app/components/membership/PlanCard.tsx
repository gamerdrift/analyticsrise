import React from 'react';
import Link from 'next/link';
import { SubscriptionTier, TierFeatures } from '@/app/types/subscription';

interface PlanCardProps {
  tier: SubscriptionTier;
  onSelect: (tier: SubscriptionTier) => void;
}

export const PlanCard: React.FC<PlanCardProps> = ({ tier, onSelect }) => {
  const features = TierFeatures[tier];
  const isFree = tier === SubscriptionTier.FREE;
  const price = isFree ? 'Free' : tier === SubscriptionTier.PRO ? '$9/mo' : '$29/mo';

  return (
    <div className="border rounded-lg p-6 shadow-sm bg-gradient-to-br from-gray-800 to-gray-700 text-white flex flex-col">
      <h3 className="text-2xl font-bold capitalize mb-4">{tier}</h3>
      <p className="text-xl mb-4 font-medium">{price}</p>
      <ul className="flex-1 mb-6 space-y-2">
        {Object.entries(features).map(([key, value]) => (
          <li key={key} className="flex items-center">
            <span className="material-icons text-green-400 mr-2">check_circle</span>
            <span>{key.replace(/([A-Z])/g, ' $1')}</span>
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelect(tier)}
        className="mt-auto bg-indigo-600 hover:bg-indigo-500 text-white py-2 px-4 rounded disabled:opacity-50"
        disabled={isFree}
      >
        {isFree ? 'Current Plan' : 'Select'}
      </button>
    </div>
  );
};
