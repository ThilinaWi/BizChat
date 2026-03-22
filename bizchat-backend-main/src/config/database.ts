import mongoose from 'mongoose';
import { log } from '../utils/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in environment variables');
    }

    await mongoose.connect(mongoUri);
    log.info('MongoDB connected successfully');
  } catch (error) {
    log.error('MongoDB connection error', error);
    process.exit(1);
  }
};
