require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item.model');

const fixPaths = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const items = await Item.find({});
    
    let fixed = 0;
    for (const item of items) {
      let needsUpdate = false;
      
      // Fix thumbnail path
      if (item.thumbnail && item.thumbnail.includes('\\')) {
        item.thumbnail = item.thumbnail.replace(/\\/g, '/');
        needsUpdate = true;
      }
      
      // Fix screenshot paths
      if (item.screenshots && item.screenshots.length > 0) {
        item.screenshots = item.screenshots.map(s => s.replace(/\\/g, '/'));
        needsUpdate = true;
      }
      
      // Fix file paths
      if (item.files && item.files.length > 0) {
        item.files = item.files.map(f => ({
          ...f,
          storageUrl: f.storageUrl.replace(/\\/g, '/')
        }));
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        await item.save();
        console.log(`✅ Fixed paths for: ${item.title}`);
        fixed++;
      }
    }
    
    console.log(`\n✅ Fixed ${fixed} item(s)`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixPaths();
