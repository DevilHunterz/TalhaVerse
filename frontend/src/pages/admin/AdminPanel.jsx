import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, Package, Download, TrendingUp, Upload, Settings } from 'lucide-react';
import { adminService } from '../../services/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-display font-bold">Admin Dashboard</h1>
          <Link to="/admin/upload" className="btn-primary flex items-center space-x-2">
            <Upload size={20} />
            <span>Upload Content</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="text-blue-500" size={32} />
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold mb-2">{stats?.totalUsers || 0}</p>
            <p className="text-gray-400">Total Users</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Package className="text-purple-500" size={32} />
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold mb-2">{stats?.totalItems || 0}</p>
            <p className="text-gray-400">Total Items</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Download className="text-primary-500" size={32} />
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <p className="text-3xl font-bold mb-2">{stats?.totalDownloads || 0}</p>
            <p className="text-gray-400">Total Downloads</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <Settings className="text-amber-500" size={32} />
            </div>
            <p className="text-3xl font-bold mb-2">{stats?.itemsByType?.length || 0}</p>
            <p className="text-gray-400">Content Types</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/admin/upload" className="card card-hover p-6 text-center group">
            <Upload className="mx-auto mb-4 text-primary-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-semibold mb-2">Upload Content</h3>
            <p className="text-gray-400">Add new mods, textures, and more</p>
          </Link>

          <Link to="/admin/items" className="card card-hover p-6 text-center group">
            <Package className="mx-auto mb-4 text-purple-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-semibold mb-2">Manage Items</h3>
            <p className="text-gray-400">Edit and delete content</p>
          </Link>

          <Link to="/admin/users" className="card card-hover p-6 text-center group">
            <Users className="mx-auto mb-4 text-blue-500 group-hover:scale-110 transition-transform" size={48} />
            <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
            <p className="text-gray-400">View and manage user accounts</p>
          </Link>
        </div>

        {/* Recent Items */}
        <div className="card p-6 mb-8">
          <h2 className="text-2xl font-display font-bold mb-6">Recent Uploads</h2>
          {stats?.recentItems?.length > 0 ? (
            <div className="space-y-4">
              {stats.recentItems.map((item) => (
                <div key={item._id} className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
                  <div>
                    <p className="font-semibold">{item.title}</p>
                    <p className="text-sm text-gray-400 capitalize">{item.type.replace('-', ' ')}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.downloadsCount} downloads</p>
                    <p className="text-sm text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No items yet</p>
          )}
        </div>

        {/* Items by Type */}
        {stats?.itemsByType?.length > 0 && (
          <div className="card p-6">
            <h2 className="text-2xl font-display font-bold mb-6">Content Distribution</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.itemsByType.map((type) => (
                <div key={type._id} className="p-4 bg-dark-hover rounded-lg text-center">
                  <p className="text-2xl font-bold mb-1">{type.count}</p>
                  <p className="text-sm text-gray-400 capitalize">{type._id.replace('-', ' ')}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminPanel;
