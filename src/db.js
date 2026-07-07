import mongoose from 'mongoose';

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error('CRITICAL: MONGODB_URI environment variable is not defined in .env.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`Connected to MongoDB Atlas successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Failed to connect to MongoDB Atlas: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
