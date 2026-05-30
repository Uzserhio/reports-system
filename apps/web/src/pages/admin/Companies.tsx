import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Plus, Edit2, Shield, ShieldOff, CheckCircle2, XCircle } from 'lucide-react';

interface Company {
  id: string;
  name: string;
  slug: string;
  status: 'active' | 'suspended' | 'pending';
  enabledModules: string[];
  createdAt: string;
}

const Companies: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', slug: '' });

  const fetchCompanies = async () => {
    try {
      const response = await api.get('/admin/companies');
      setCompanies(response.data);
    } catch (err) {
      console.error('Failed to fetch companies', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/companies', formData);
      setIsModalOpen(false);
      setFormData({ name: '', slug: '' });
      fetchCompanies();
    } catch (err) {
      alert('Failed to create company');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" /> Active</span>;
      case 'suspended':
        return <span className="flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Suspended</span>;
      default:
        return <span className="flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading companies...</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Managed Companies</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" /> Add Company
        </button>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create New Company</h3>
            <form onSubmit={handleCreate}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Slug (URL identifier)</label>
                  <input
                    type="text"
                    required
                    pattern="[a-z0-9-]+"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Create Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Company Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Modules</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {companies.map((company) => (
              <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{company.name}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                  {company.slug}
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(company.status)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {company.enabledModules?.map(m => (
                      <span key={m} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded uppercase font-semibold">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(company.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <div className="flex space-x-3">
                    <button className="text-gray-400 hover:text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {company.status === 'active' ? (
                      <button className="text-gray-400 hover:text-red-600">
                        <ShieldOff className="w-4 h-4" />
                      </button>
                    ) : (
                      <button className="text-gray-400 hover:text-green-600">
                        <Shield className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Companies;
