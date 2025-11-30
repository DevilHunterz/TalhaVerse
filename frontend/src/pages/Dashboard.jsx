import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Download, Heart, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold mb-8">Dashboard</h1>

        {/* User Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="text-primary-500" size={24} />
              <h2 className="text-xl font-semibold">Profile</h2>
            </div>
            <div className="space-y-2">
              <p className="text-gray-400">Username</p>
              <p className="font-semibold">{user?.username}</p>
              <p className="text-gray-400 mt-4">Email</p>
              <p className="font-semibold">{user?.email}</p>
              <p className="text-gray-400 mt-4">Role</p>
              <p className="font-semibold capitalize">{user?.role}</p>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Download className="text-blue-500" size={24} />
              <h2 className="text-xl font-semibold">Downloads</h2>
            </div>
            <p className="text-3xl font-bold">{user?.downloadHistory?.length || 0}</p>
            <p className="text-gray-400 mt-2">Total downloads</p>
          </div>

          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Heart className="text-pink-500" size={24} />
              <h2 className="text-xl font-semibold">Favorites</h2>
            </div>
            <p className="text-3xl font-bold">{user?.favorites?.length || 0}</p>
            <p className="text-gray-400 mt-2">Saved items</p>
          </div>
        </div>

        {/* Download History */}
        <div className="card p-6">
          <h2 className="text-2xl font-display font-bold mb-6">Recent Downloads</h2>
          {user?.downloadHistory?.length > 0 ? (
            <div className="space-y-4">
              {user.downloadHistory.slice(0, 5).map((download, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-dark-hover rounded-lg">
                  <div>
                    <p className="font-semibold">Item #{download.itemId}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(download.downloadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No downloads yet</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
