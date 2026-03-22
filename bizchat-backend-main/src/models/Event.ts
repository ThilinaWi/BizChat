import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, EventStatus } from '../types';

export interface IEventDocument extends Omit<IEvent, '_id'>, Document {}

const eventSchema = new Schema<IEventDocument>(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
      trim: true,
      maxlength: [5000, 'Description must not exceed 5000 characters'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      default: EventStatus.DRAFT,
    },
    createdBy: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

eventSchema.index({ date: 1 });
eventSchema.index({ status: 1 });

export default mongoose.model<IEventDocument>('Event', eventSchema);
