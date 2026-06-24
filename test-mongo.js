const mongoose = require('mongoose');

async function testConnection() {
  try {
    const uri = "mongodb+srv://BAsudev:NJocQ6uIb4GYoGst@pixel-2-ascii.4iklki8.mongodb.net/?appName=Pixel-2-ASCII";
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Successfully connected to MongoDB!");
    process.exit(0);
  } catch (error) {
    console.error("MongoDB Connection Error:");
    console.error(error.message);
    process.exit(1);
  }
}

testConnection();
