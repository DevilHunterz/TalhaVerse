import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Edit, Star, Eye } from 'lucide-react';
import { adminService, itemService } from '../../services/api';
import { getContentTypeInfo, formatNumber } from '../../utils/constants';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await adminService.getAllItems({ limit: 50 });
      setItems(response.data.items);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      await itemService.deleteItem(id);
      toast.success('Item deleted');
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete item');
    }
  };

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      toast.error('No items selected');
      return;
    }

    if (!confirm(`Delete ${selectedItems.length} items?`)) return;

    try {
      await adminService.bulkDeleteItems(selectedItems);
      toast.success(`${selectedItems.length} items deleted`);
      setSelectedItems([]);
      fetchItems();
    } catch (error) {
      toast.error('Failed to delete items');
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await adminService.toggleFeatured(id);
      toast.success('Featured status updated');
      fetchItems();
    } catch (error) {
      toast.error('Failed to update featured status');
    }
  };

  const toggleSelectItem = (id) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
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
          <h1 className="text-4xl font-display font-bold">Manage Items</h1>
          {selectedItems.length > 0 && (
            <button
              onClick={handleBulkDelete}
              className="btn-primary flex items-center space-x-2 bg-red-600 hover:bg-red-700"
            >
              <Trash2 size={20} />
              <span>Delete Selected ({selectedItems.length})</span>
            </button>
          )}
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-hover">
                <tr>
                  <th className="px-6 py-4 text-left">
                    <input
                      type="checkbox"
                      checked={selectedItems.length === items.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedItems(items.map(i => i._id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                      className="rounded"
                    />
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Type</th>
                  <th className="px-6 py-4 text-left font-semibold">Downloads</th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {items.map((item) => {
                  const typeInfo = getContentTypeInfo(item.type);
                  return (
                    <tr key={item._id} className="hover:bg-dark-hover transition-colors">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item._id)}
                          onChange={() => toggleSelectItem(item._id)}
                          className="rounded"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <img
                            src={`http://localhost:5000/${item.thumbnail}`}
                            alt={item.title}
                            className="w-12 h-12 rounded object-cover"
                          />
                          <div>
                            <p className="font-semibold">{item.title}</p>
                            <p className="text-sm text-gray-400">{item.version}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="capitalize">{typeInfo.label}</span>
                      </td>
                      <td className="px-6 py-4">
                        {formatNumber(item.downloadsCount)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded text-xs ${
                            item.status === 'published' ? 'bg-green-500/20 text-green-500' :
                            item.status === 'draft' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-gray-500/20 text-gray-500'
                          }`}>
                            {item.status}
                          </span>
                          {item.featured && (
                            <Star size={16} className="fill-amber-500 text-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/item/${item.slug}`}
                            className="p-2 hover:bg-dark rounded transition-colors"
                            title="View"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleToggleFeatured(item._id)}
                            className="p-2 hover:bg-dark rounded transition-colors"
                            title="Toggle Featured"
                          >
                            <Star size={18} className={item.featured ? 'fill-amber-500 text-amber-500' : ''} />
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminItems;
