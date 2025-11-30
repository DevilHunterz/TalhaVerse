import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadService, itemService } from '../../services/api';
import { CONTENT_TYPES } from '../../utils/constants';
import toast from 'react-hot-toast';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'mod',
    version: '',
    gameVersion: '',
    author: '',
    tags: '',
    shortDescription: '',
    fullDescription: '',
    installInstructions: '',
    changelog: '',
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [screenshots, setScreenshots] = useState([]);
  const [files, setFiles] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    if (e.target.files[0]) {
      setThumbnail(e.target.files[0]);
    }
  };

  const handleScreenshotsChange = (e) => {
    setScreenshots(Array.from(e.target.files));
  };

  const handleFilesChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!thumbnail) {
      toast.error('Thumbnail is required');
      return;
    }

    if (files.length === 0) {
      toast.error('At least one file is required');
      return;
    }

    setLoading(true);

    try {
      // Upload files first
      const uploadFormData = new FormData();
      uploadFormData.append('thumbnail', thumbnail);
      screenshots.forEach(file => uploadFormData.append('screenshots', file));
      files.forEach(file => uploadFormData.append('files', file));

      const uploadResponse = await uploadService.uploadFiles(uploadFormData);

      // Create item with uploaded file data
      const itemData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        thumbnail: uploadResponse.data.thumbnail,
        screenshots: uploadResponse.data.screenshots || [],
        files: uploadResponse.data.files || [],
      };

      await itemService.createItem(itemData);
      toast.success('Item uploaded successfully!');
      navigate('/admin');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-display font-bold mb-8">Upload Content</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  {CONTENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Version *</label>
                <input
                  type="text"
                  name="version"
                  value={formData.version}
                  onChange={handleChange}
                  className="input"
                  placeholder="1.0.0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Game Version *</label>
                <input
                  type="text"
                  name="gameVersion"
                  value={formData.gameVersion}
                  onChange={handleChange}
                  className="input"
                  placeholder="1.20.1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Author *</label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="input"
                  placeholder="adventure, magic, rpg"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium mb-2">Short Description *</label>
              <textarea
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="input"
                rows="2"
                maxLength="200"
                required
              />
              <p className="text-sm text-gray-500 mt-1">{formData.shortDescription.length}/200</p>
            </div>
          </div>

          {/* Descriptions */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-6">Detailed Information</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Description * (Markdown supported)</label>
                <textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  className="input"
                  rows="6"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Installation Instructions (Markdown supported)</label>
                <textarea
                  name="installInstructions"
                  value={formData.installInstructions}
                  onChange={handleChange}
                  className="input"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Changelog (Markdown supported)</label>
                <textarea
                  name="changelog"
                  value={formData.changelog}
                  onChange={handleChange}
                  className="input"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Files */}
          <div className="card p-6">
            <h2 className="text-2xl font-semibold mb-6">Files & Media</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Thumbnail * (JPG, PNG, WebP)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="input"
                  required
                />
                {thumbnail && (
                  <p className="text-sm text-green-500 mt-2">Selected: {thumbnail.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Screenshots (Optional, max 10)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleScreenshotsChange}
                  className="input"
                />
                {screenshots.length > 0 && (
                  <p className="text-sm text-green-500 mt-2">{screenshots.length} file(s) selected</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Content Files * (.zip, .rar, .jar, .mcpack, .mcaddon)
                </label>
                <input
                  type="file"
                  accept=".zip,.rar,.jar,.mcpack,.mcaddon,.mcworld"
                  multiple
                  onChange={handleFilesChange}
                  className="input"
                  required
                />
                {files.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {files.map((file, index) => (
                      <p key={index} className="text-sm text-green-500">
                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              ) : (
                <>
                  <Upload size={20} />
                  <span>Upload Content</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminUpload;
