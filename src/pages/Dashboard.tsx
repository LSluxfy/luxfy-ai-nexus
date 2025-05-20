
import React from 'react';
import ProfileCard from '@/components/ProfileCard';
import DashboardMetrics from '@/components/dashboard/DashboardMetrics';
import StatsCards from '@/components/dashboard/StatsCards';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <StatsCards />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ProfileCard />
        </div>
        <div className="md:col-span-2">
          <DashboardMetrics />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
