import mongoose from 'mongoose';

export const connectMongoose = async () => {
  const url = process.env.MONGO_URL || "";
  const client = mongoose.connect(url);
  try {
    await client;
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}