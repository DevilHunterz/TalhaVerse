const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  type: {
    type: String,
    required: true,
    enum: ['mod', 'texture-pack', 'modpack', 'shaderpack', 'addon', 'resource-pack', 'tool']
  },
  version: {
    type: String,
    required: true
  },
  gameVersion: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  tags: [{
    type: String,
    trim: true
  }],
  shortDescription: {
    type: String,
    required: true,
    maxlength: 200
  },
  fullDescription: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  files: [{
    filename: String,
    originalName: String,
    size: Number,
    fileType: String,
    storageUrl: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  downloadsCount: {
    type: Number,
    default: 0
  },
  rating: {
    average: {
      type: Number,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  featured: {
    type: Boolean,
    default: false
  },
  changelog: {
    type: String,
    default: ''
  },
  installInstructions: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['published', 'draft', 'archived'],
    default: 'published'
  }
}, {
  timestamps: true
});

// Index for search and filtering
itemSchema.index({ title: 'text', shortDescription: 'text', tags: 'text' });
itemSchema.index({ type: 1, createdAt: -1 });
itemSchema.index({ downloadsCount: -1 });
itemSchema.index({ slug: 1 });

module.exports = mongoose.model('Item', itemSchema);
