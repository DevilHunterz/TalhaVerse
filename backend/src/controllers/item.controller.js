const Item = require('../models/Item.model');
const User = require('../models/User.model');
const slugify = require('slugify');
const fs = require('fs');
const path = require('path');

// Get all items with filters
exports.getItems = async (req, res) => {
  try {
    const { 
      type, 
      search, 
      sort = '-createdAt', 
      page = 1, 
      limit = 12,
      gameVersion,
      tags
    } = req.query;

    const query = { status: 'published' };

    if (type) query.type = type;
    if (gameVersion) query.gameVersion = gameVersion;
    if (tags) query.tags = { $in: tags.split(',') };
    if (search) {
      query.$text = { $search: search };
    }

    const items = await Item.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v');

    const count = await Item.countDocuments(query);

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({ message: 'Error fetching items' });
  }
};

// Get single item by slug
exports.getItemBySlug = async (req, res) => {
  try {
    const item = await Item.findOne({ slug: req.params.slug, status: 'published' });
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching item' });
  }
};

// Get items by type
exports.getItemsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { sort = '-createdAt', page = 1, limit = 12 } = req.query;

    const items = await Item.find({ type, status: 'published' })
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Item.countDocuments({ type, status: 'published' });

    res.json({
      items,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items' });
  }
};

// Get featured items
exports.getFeaturedItems = async (req, res) => {
  try {
    const items = await Item.find({ featured: true, status: 'published' })
      .sort('-createdAt')
      .limit(6);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured items' });
  }
};

// Get trending items (most downloaded in last 7 days)
exports.getTrendingItems = async (req, res) => {
  try {
    const items = await Item.find({ status: 'published' })
      .sort('-downloadsCount')
      .limit(8);

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching trending items' });
  }
};

// Create item (admin only)
exports.createItem = async (req, res) => {
  try {
    const itemData = req.body;
    
    // Generate slug
    itemData.slug = slugify(itemData.title, { lower: true, strict: true });
    
    // Check if slug exists
    const existingItem = await Item.findOne({ slug: itemData.slug });
    if (existingItem) {
      itemData.slug = `${itemData.slug}-${Date.now()}`;
    }

    // Set author
    itemData.authorId = req.user._id;
    if (!itemData.author) {
      itemData.author = req.user.username;
    }

    const item = new Item(itemData);
    await item.save();

    res.status(201).json({ message: 'Item created successfully', item });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({ message: 'Error creating item' });
  }
};

// Update item (admin only)
exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // If title is updated, regenerate slug
    if (updates.title) {
      updates.slug = slugify(updates.title, { lower: true, strict: true });
    }

    const item = await Item.findByIdAndUpdate(id, updates, { new: true });

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    res.json({ message: 'Item updated successfully', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating item' });
  }
};

// Delete item (admin only)
exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    // Delete associated files
    item.files.forEach(file => {
      const filePath = path.join(__dirname, '../../', file.storageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await Item.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item' });
  }
};

// Download file
exports.downloadFile = async (req, res) => {
  try {
    const { fileId } = req.params;
    const { itemId } = req.query;

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    const file = item.files.find(f => f._id.toString() === fileId);
    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    const filePath = path.join(__dirname, '../../', file.storageUrl);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found on server' });
    }

    // Increment download count
    item.downloadsCount += 1;
    await item.save();

    // Add to user download history if authenticated
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, {
        $push: {
          downloadHistory: {
            itemId: item._id,
            downloadedAt: new Date()
          }
        }
      });
    }

    // Send file
    res.download(filePath, file.originalName);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ message: 'Error downloading file' });
  }
};
