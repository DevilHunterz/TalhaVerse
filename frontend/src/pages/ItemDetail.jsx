import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download, Calendar, User, Tag, Star, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { itemService, uploadService } from '../services/api';
import { getContentTypeInfo, formatFileSize, formatNumber } from '../utils/constants';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const ItemDetail = () => {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchItem();
  }, [slug]);

  const fetchItem = async () => {
    try {
      const response = await itemService.getItemBySlug(slug);
      setItem(response.data);
    } catch (error) {
      toast.error('Failed to load item');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (file) => {
    const downloadUrl = uploadService.getDownloadUrl(file._id, item._id);
    window.open(downloadUrl, '_blank');
    toast.success('Download started');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <p className="text-center text-gray-400">Item not found</p>
      </div>
    );
  }

  const typeInfo = getContentTypeInfo(item.type);
  const Icon = typeInfo.icon;
  const images = [item.thumbnail, ...item.screenshots];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back Button */}
      <Link
        to={`/category/${item.type}`}
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-primary-500 transition-colors mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back to {typeInfo.label}</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card overflow-hidden mb-6"
          >
            <img
              src={`http://localhost:5000/${images[selectedImage]}`}
              alt={item.title}
              className="w-full h-96 object-cover"
            />
            {images.length > 1 && (
              <div className="p-4 flex space-x-2 overflow-x-auto scrollbar-hide">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-primary-600' : 'border-transparent'
                    }`}
                  >
                    <img src={`http://localhost:5000/${img}`} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card p-6 mb-6"
          >
            <h2 className="text-2xl font-display font-bold mb-4">Description</h2>
            <div className="prose prose-invert max-w-none">
              <ReactMarkdown>{item.fullDescription}</ReactMarkdown>
            </div>
          </motion.div>

          {/* Installation */}
          {item.installInstructions && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card p-6 mb-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">Installation</h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{item.installInstructions}</ReactMarkdown>
              </div>
            </motion.div>
          )}

          {/* Changelog */}
          {item.changelog && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card p-6"
            >
              <h2 className="text-2xl font-display font-bold mb-4">Changelog</h2>
              <div className="prose prose-invert max-w-none">
                <ReactMarkdown>{item.changelog}</ReactMarkdown>
              </div>
            </motion.div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="sticky top-20 space-y-6"
          >
            {/* Title & Meta */}
            <div className="card p-6">
              <div className="flex items-center space-x-2 mb-3">
                <Icon className={typeInfo.color} size={24} />
                <span className="text-sm text-gray-400">{typeInfo.label}</span>
              </div>
              <h1 className="text-3xl font-display font-bold mb-4">{item.title}</h1>
              <p className="text-gray-400 mb-4">{item.shortDescription}</p>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Downloads</p>
                  <p className="text-xl font-bold">{formatNumber(item.downloadsCount)}</p>
                </div>
                {item.rating.count > 0 && (
                  <div>
                    <p className="text-sm text-gray-500">Rating</p>
                    <div className="flex items-center space-x-1">
                      <Star size={20} className="fill-amber-500 text-amber-500" />
                      <span className="text-xl font-bold">{item.rating.average.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Download Buttons */}
              <div className="space-y-2">
                {item.files.map((file, index) => (
                  <button
                    key={index}
                    onClick={() => handleDownload(file)}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <Download size={20} />
                    <span>Download {file.originalName}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div className="card p-6 space-y-4">
              <div className="flex items-start space-x-3">
                <User size={20} className="text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Author</p>
                  <p className="font-semibold">{item.author}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar size={20} className="text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Published</p>
                  <p className="font-semibold">{format(new Date(item.createdAt), 'MMM dd, yyyy')}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Tag size={20} className="text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Version</p>
                  <p className="font-semibold">{item.version}</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Tag size={20} className="text-gray-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Game Version</p>
                  <p className="font-semibold">{item.gameVersion}</p>
                </div>
              </div>

              {item.tags.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-dark-hover rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {item.files.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">File Size</p>
                  <p className="font-semibold">{formatFileSize(item.files[0].size)}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
