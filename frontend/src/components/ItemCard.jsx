import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Download, Star } from 'lucide-react';
import { getContentTypeInfo, formatNumber } from '../utils/constants';

const ItemCard = ({ item, index = 0 }) => {
  const typeInfo = getContentTypeInfo(item.type);
  const Icon = typeInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="card card-hover group"
    >
      <Link to={`/item/${item.slug}`}>
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={`http://localhost:5000/${item.thumbnail}`}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark via-transparent to-transparent opacity-60"></div>
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 flex items-center space-x-1 px-3 py-1 rounded-full glass ${typeInfo.color}`}>
            <Icon size={14} />
            <span className="text-xs font-semibold">{typeInfo.label}</span>
          </div>

          {/* Featured Badge */}
          {item.featured && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-display font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-gray-400 mb-3 line-clamp-2">
            {item.shortDescription}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-3">
              <span className="flex items-center space-x-1">
                <Download size={14} />
                <span>{formatNumber(item.downloadsCount)}</span>
              </span>
              {item.rating.count > 0 && (
                <span className="flex items-center space-x-1">
                  <Star size={14} className="fill-amber-500 text-amber-500" />
                  <span>{item.rating.average.toFixed(1)}</span>
                </span>
              )}
            </div>
            <span className="text-xs">{item.version}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ItemCard;
