import { Cpu, Layers, Package, Sparkles, Puzzle, Image, Wrench } from 'lucide-react';

export const CONTENT_TYPES = [
  { value: 'mod', label: 'Mods', icon: Cpu, color: 'text-blue-500' },
  { value: 'texture-pack', label: 'Texture Packs', icon: Layers, color: 'text-green-500' },
  { value: 'modpack', label: 'Modpacks', icon: Package, color: 'text-purple-500' },
  { value: 'shaderpack', label: 'Shaderpacks', icon: Sparkles, color: 'text-yellow-500' },
  { value: 'addon', label: 'Addons', icon: Puzzle, color: 'text-pink-500' },
  { value: 'resource-pack', label: 'Resource Packs', icon: Image, color: 'text-orange-500' },
  { value: 'tool', label: 'Tools', icon: Wrench, color: 'text-red-500' },
];

export const getContentTypeInfo = (type) => {
  return CONTENT_TYPES.find(ct => ct.value === type) || CONTENT_TYPES[0];
};

export const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: 'createdAt', label: 'Oldest' },
  { value: '-downloadsCount', label: 'Most Downloaded' },
  { value: '-rating.average', label: 'Top Rated' },
];

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
};
