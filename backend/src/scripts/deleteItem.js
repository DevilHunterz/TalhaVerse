require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item.model');
const fs = require('fs');
const path = require('path');

const deleteItemByTitle = async (titleSearch) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Find the item
    const item = await Item.findOne({ 
      title: { $regex: titleSearch, $options: 'i' } 
    });

    if (!item) {
      console.log(`❌ Item with title containing "${titleSearch}" not found`);
      process.exit(1);
    }

    console.log(`\n📦 Found item:`);
    console.log(`   Title: ${item.title}`);
    console.log(`   Type: ${item.type}`);
    console.log(`   Slug: ${item.slug}`);
    console.log(`   ID: ${item._id}`);

    // Delete associated files
    console.log(`\n🗑️  Deleting files...`);
    item.files.forEach(file => {
      const filePath = path.join(__dirname, '../../', file.storageUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`   ✅ Deleted: ${file.originalName}`);
      }
    });

    // Delete thumbnail
    if (item.thumbnail) {
      const thumbPath = path.join(__dirname, '../../', item.thumbnail);
      if (fs.existsSync(thumbPath)) {
        fs.unlinkSync(thumbPath);
        console.log(`   ✅ Deleted thumbnail`);
      }
    }

    // Delete screenshots
    item.screenshots.forEach(screenshot => {
      const screenshotPath = path.join(__dirname, '../../', screenshot);
      if (fs.existsSync(screenshotPath)) {
        fs.unlinkSync(screenshotPath);
        console.log(`   ✅ Deleted screenshot`);
      }
    });

    // Delete from database
    await Item.findByIdAndDelete(item._id);
    console.log(`\n✅ Item "${item.title}" deleted successfully from database`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

// Get title from command line argument
const titleSearch = process.argv[2] || 'FPSX';
deleteItemByTitle(titleSearch);
