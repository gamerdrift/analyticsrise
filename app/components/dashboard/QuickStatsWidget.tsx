import React, { useEffect, useState } from 'react';
import { DashboardData } from '../../types/dashboard';
import UserService from '../../services/user';

const QuickStatsWidget: React.FC = () => {
  const [stats, setStats] = useState<DashboardData['quickStats'] | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await UserService.fetchDashboardData('placeholder-uid'); // uid will be replaced with actual user id via context later
        setStats(data.quickStats);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  if (!stats) return <div className="widget glass p-4">Loading stats...</div>;

  return (
    <section className="widget glass p-6 rounded-xl grid grid-cols-2 gap-4">
      <div>
        <h3 className="text-sm font-medium text-gray-300">Progress</h3>
        <p className="text-2xl font-bold text-white">{stats.progressPercent}%</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-300">Modules Completed</h3>
        <p className="text-2xl font-bold text-white">{stats.completedModules}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-300">Streak (days)</h3>
        <p className="text-2xl font-bold text-white">{stats.streakDays}</p>
      </div>
      <div>
        <h3 className="text-sm font-medium text-gray-300">XP Earned</h3>
        <p className="text-2xl font-bold text-white">{stats.xpEarned}</p>
      </div>
    </section>
  );
};

export default QuickStatsWidget;
