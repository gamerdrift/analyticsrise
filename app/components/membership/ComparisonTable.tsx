import React from 'react';

interface ComparisonTableProps {
  tier: 'free' | 'pro' | 'enterprise';
}

export const ComparisonTable: React.FC = () => {
  const rows = [
    { feature: 'Daily Simulator Limit', free: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Missions', free: 'Beginner', pro: 'Beginner, Advanced', enterprise: 'All' },
    { feature: 'Datasets', free: 'Public', pro: 'Public, Premium', enterprise: 'Public, Premium, Enterprise' },
    { feature: 'Certificates', free: 'Basic', pro: 'Basic, Premium', enterprise: 'Basic, Premium, Enterprise' },
    { feature: 'AI Mentor', free: '✖', pro: '✔', enterprise: '✔' },
    { feature: 'Resume Builder', free: '✖', pro: '✔', enterprise: '✔' },
    { feature: 'Portfolio Builder', free: '✖', pro: '✔', enterprise: '✔' },
    { feature: 'Advanced Analytics', free: '✖', pro: '✔', enterprise: '✔' },
    { feature: 'Priority Support', free: '✖', pro: '✔', enterprise: '✔' },
    { feature: 'Team Features', free: '✖', pro: '✖', enterprise: '✔' },
    { feature: 'Custom Branding', free: '✖', pro: '✖', enterprise: '✔' },
  ];

  return (
    <div className="overflow-x-auto rounded-lg shadow">
      <table className="min-w-full bg-gray-800 text-white">
        <thead>
          <tr>
            <th className="px-4 py-2 text-left">Feature</th>
            <th className="px-4 py-2">Free</th>
            <th className="px-4 py-2">Pro</th>
            <th className="px-4 py-2">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-800'}>
              <td className="px-4 py-2">{row.feature}</td>
              <td className="px-4 py-2 text-center">{row.free}</td>
              <td className="px-4 py-2 text-center">{row.pro}</td>
              <td className="px-4 py-2 text-center">{row.enterprise}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
