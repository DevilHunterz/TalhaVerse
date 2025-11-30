import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, User, LogOut, Shield, Moon, Sun, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-display font-bold glow-text"
            >
              TalhaVerse
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-gray-300 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/category/mod" className="text-gray-300 hover:text-primary-500 transition-colors">
              Mods
            </Link>
            <Link to="/category/texture-pack" className="text-gray-300 hover:text-primary-500 transition-colors">
              Textures
            </Link>
            <Link to="/category/modpack" className="text-gray-300 hover:text-primary-500 transition-colors">
              Modpacks
            </Link>
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-dark-hover transition-colors"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center space-x-1 text-primary-500 hover:text-primary-400 transition-colors"
                  >
                    <Shield size={18} />
                    <span>Admin</span>
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <User size={18} />
                  <span>{user.username}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-300 hover:text-primary-500 transition-colors"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-300 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-dark-hover transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-gray-800"
        >
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block text-gray-300 hover:text-primary-500 transition-colors">
              Home
            </Link>
            <Link to="/category/mod" className="block text-gray-300 hover:text-primary-500 transition-colors">
              Mods
            </Link>
            <Link to="/category/texture-pack" className="block text-gray-300 hover:text-primary-500 transition-colors">
              Textures
            </Link>
            <Link to="/category/modpack" className="block text-gray-300 hover:text-primary-500 transition-colors">
              Modpacks
            </Link>
            
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin" className="block text-primary-500 hover:text-primary-400 transition-colors">
                    Admin Panel
                  </Link>
                )}
                <Link to="/dashboard" className="block text-gray-300 hover:text-primary-500 transition-colors">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left text-gray-300 hover:text-primary-500 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-gray-300 hover:text-primary-500 transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="block btn-primary text-center">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
