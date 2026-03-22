import mongoose, { Schema, Document } from 'mongoose';
import { ITicket, TicketStatus } from '../types';

export interface ITicketDocument extends Omit<ITicket, '_id'>, Document {
  availableQuantity: number;
}

const ticketSchema = new Schema<ITicketDocument>(
  {
    eventId: {
      type: String,
      required: true,
      ref: 'Event',
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Ticket name is required'],
      trim: true,
      maxlength: [100, 'Ticket name must not exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must not exceed 500 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Ticket price is required'],
      min: [0, 'Price cannot be negative'],
    },
    totalQuantity: {
      type: Number,
      required: [true, 'Total quantity is required'],
      min: [1, 'Total quantity must be at least 1'],
    },
    soldQuantity: {
      type: Number,
      default: 0,
      min: [0, 'Sold quantity cannot be negative'],
    },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.AVAILABLE,
    },
    createdBy: {
      type: String,
      required: true,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: available quantity
ticketSchema.virtual('availableQuantity').get(function () {
  return this.totalQuantity - this.soldQuantity;
});

ticketSchema.index({ eventId: 1, name: 1 }, { unique: true });

export default mongoose.model<ITicketDocument>('Ticket', ticketSchema);
