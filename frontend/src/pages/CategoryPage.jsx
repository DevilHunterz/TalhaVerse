import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, SlidersHorizontal } from 'lucide-react';
import { itemService } from '../services/api';
import { getContentTypeInfo, SORT_OPTIONS } from '../utils/constants';
import ItemCard from '../components/ItemCard';
import toast from 'react-hot-toast';

const CategoryPage = () => {
  const { type } = useParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const typeInfo = getContentTypeInfo(type);
  const Icon = typeInfo.icon;

  useEffect(() => {
    fetchItems();
  }, [type, sort, page]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await itemService.getItemsByType(type, {
        sort,
        page,
        limit: 12
      });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setLoading(true);
    try {
      const response = await itemService.getItems({
        type,
        search,
        sort,
        page: 1,
        limit: 12
      });
      setItems(response.data.items);
      setTotalPages(response.data.totalPages);
      setPage(1);
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Icon className={typeInfo.color} size={40} />
          <h1 className="text-4xl font-display font-bold">{typeInfo.label}</h1>
        </div>
        <p className="text-gray-400">
          Browse and download the best {typeInfo.label.toLowerCase()} for your game.
        </p>
      </motion.div>

      {/* Filters */}
      <div className="card p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="input pl-10"
              />
            </div>
          </form>

          {/* Sort */}
          <div className="flex items-center space-x-2">
            <SlidersHorizontal size={20} className="text-gray-500" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="input"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-400 text-lg">No items found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <ItemCard key={item._id} item={item} index={index} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-12">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-gray-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryPage;
