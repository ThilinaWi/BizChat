import mongoose, { Schema, Document } from 'mongoose';
import { IBooking, BookingStatus, PaymentStatus } from '../types';

export interface IBookingDocument extends Omit<IBooking, '_id'>, Document {}

const attendeeSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phoneNumber: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBookingDocument>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    userId: {
      type: String,
      required: true,
      ref: 'User',
      index: true,
    },
    eventId: {
      type: String,
      required: true,
      ref: 'Event',
      index: true,
    },
    ticketId: {
      type: String,
      required: true,
      ref: 'Ticket',
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    unitPrice: {
      type: Number,
      required: true,
      min: [0, 'Unit price cannot be negative'],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'Total amount cannot be negative'],
    },
    attendees: {
      type: [attendeeSchema],
      required: true,
    },
    bookingStatus: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.UNPAID,
    },
    verifiedBy: {
      type: String,
      ref: 'User',
    },
    verifiedAt: {
      type: Date,
    },
    ticketSentAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ paymentStatus: 1 });

export default mongoose.model<IBookingDocument>('Booking', bookingSchema);
