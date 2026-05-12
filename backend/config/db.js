const mongoose = require('mongoose');

let memServer = null;

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;

    // Use in-memory MongoDB if no URI or local URI fails
    if (!uri || uri.includes('127.0.0.1') || uri.includes('localhost')) {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memServer = await MongoMemoryServer.create();
        uri = memServer.getUri();
        console.log('🧪 Using MongoDB Memory Server (in-memory database for development)');
      } catch (memErr) {
        console.log('⚠️  Falling back to local MongoDB:', uri);
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error('💡 Tip: Sign up at https://cloud.mongodb.com for a free Atlas cluster');
    process.exit(1);
  }
};

module.exports = connectDB;
