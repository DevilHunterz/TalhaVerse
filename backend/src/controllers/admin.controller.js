const User = require('../models/User.model');
const Item = require('../models/Item.model');

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalDownloads = await Item.aggregate([
      { $group: { _id: null, total: { $sum: '$downloadsCount' } } }
    ]);

    const recentItems = await Item.find()
      .sort('-createdAt')
      .limit(5)
      .select('title type createdAt downloadsCount');

    const itemsByType = await Item.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Downloads per day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const downloadsPerDay = await Item.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          downloads: { $sum: '$downloadsCount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalUsers,
      totalItems,
      totalDownloads: totalDownloads[0]?.total || 0,
      recentItems,
      itemsByType,
      downloadsPerDay
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Error fetching statistics' });
  }
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User role updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting yourself
    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get all items (including drafts)
exports.getAllItems = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;

    const items = await Item.find(query)
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Item.countDocuments(query);

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

// Bulk delete items
exports.bulkDeleteItems = async (req, res) => {
  try {
    const { itemIds } = req.body;

    if (!Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ message: 'Invalid item IDs' });
    }

    await Item.deleteMany({ _id: { $in: itemIds } });

    res.json({ message: `${itemIds.length} items deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting items' });
  }
};

// Toggle featured status
exports.toggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await Item.findById(id);

    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }

    item.featured = !item.featured;
    await item.save();

    res.json({ message: 'Featured status updated', item });
  } catch (error) {
    res.status(500).json({ message: 'Error updating featured status' });
  }
};
