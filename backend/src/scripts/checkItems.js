require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('../models/Item.model');

const checkItems = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    const items = await Item.find({});
    
    if (items.length === 0) {
      console.log('No items found in database');
    } else {
      console.log(`Found ${items.length} item(s):\n`);
      items.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   Type: ${item.type}`);
        console.log(`   Thumbnail: ${item.thumbnail}`);
        console.log(`   Files: ${item.files.length}`);
        console.log(`   Screenshots: ${item.screenshots.length}`);
        console.log('');
      });
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

checkItems();
