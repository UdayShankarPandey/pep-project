import mongoose from 'mongoose';
import env from './config/env.js';

const connectDB = async () => {
  const MONGODB_URI = env.MONGODB_URI;

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB Atlas successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
