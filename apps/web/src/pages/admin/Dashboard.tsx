import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Building2, Users, CreditCard, Activity } from 'lucide-react';

interface Stats {
  totalCompanies: number;
  totalUsers: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading stats...</div>;
  }

  const statCards = [
    { name: 'Total Companies', value: stats?.totalCompanies || 0, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Monthly Revenue', value: '$0', icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Active Sessions', value: '0', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100' },
  ];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <div key={card.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`${card.bg} p-3 rounded-lg`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">{card.name}</p>
              <h3 className="text-2xl font-bold text-gray-900">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Activity</h3>
          <p className="text-gray-500 text-sm italic">Audit logs will appear here...</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Newest Companies</h3>
          <p className="text-gray-500 text-sm italic">Latest registrations will appear here...</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
