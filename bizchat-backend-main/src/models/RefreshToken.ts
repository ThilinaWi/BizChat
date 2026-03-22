import mongoose, { Schema, Document } from 'mongoose';
import { IRefreshToken } from '../types';

export interface IRefreshTokenDocument extends Omit<IRefreshToken, '_id'>, Document {}

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: {
      type: String,
      required: true,
      ref: 'User',
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model<IRefreshTokenDocument>('RefreshToken', refreshTokenSchema);
