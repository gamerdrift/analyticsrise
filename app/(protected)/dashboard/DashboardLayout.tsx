import React from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import TopNav from '../../components/dashboard/TopNav';
import '../../styles/dashboard.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="dashboard-root">
      <Sidebar />
      <div className="dashboard-main">
        <TopNav />
        <main className="dashboard-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
