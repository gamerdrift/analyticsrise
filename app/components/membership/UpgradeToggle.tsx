import React from 'react';

interface UpgradeToggleProps {
  isAnnual: boolean;
  onToggle: (annual: boolean) => void;
}

export const UpgradeToggle: React.FC<UpgradeToggleProps> = ({ isAnnual, onToggle }) => {
  return (
    <div className="flex items-center space-x-4">
      <span className={isAnnual ? 'text-gray-400' : 'text-white'}>Monthly</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          className="sr-only peer"
          checked={isAnnual}
          onChange={(e) => onToggle(e.target.checked)}
        />
        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
      </label>
      <span className={isAnnual ? 'text-white' : 'text-gray-400'}>Annual</span>
    </div>
  );
};
