import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Booking from '../models/Booking';
import Ticket from '../models/Ticket';
import Event from '../models/Event';
import User from '../models/User';
import { asyncHandler } from '../middleware/errorHandler';
import {
  ValidationError,
  NotFoundError,
  AuthenticationError,
  AuthorizationError,
} from '../utils/errors';
import { BookingStatus, PaymentStatus, EventStatus, TicketStatus, IAttendee } from '../types';
import { sendTicketConfirmationEmail } from '../utils/email';
import { log } from '../utils/logger';
import { validateEmail, validatePhoneNumber } from '../utils/validation';

// ─── Generate booking reference ──────────────────────────────────

const generateBookingRef = (): string => {
  return `BK-${uuidv4().substring(0, 8).toUpperCase()}`;
};

// ─── USER: Create booking ────────────────────────────────────────

export const createBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new AuthenticationError('Authentication required');

    const { ticketId, quantity, attendees } = req.body;
    const userId = (req.user as any)._id;

    if (!ticketId || !quantity) {
      throw new ValidationError('Missing required fields', [
        'ticketId and quantity are required',
      ]);
    }

    if (quantity < 1 || quantity > 10) {
      throw new ValidationError('Quantity must be between 1 and 10');
    }

    // Validate attendees
    if (!attendees || !Array.isArray(attendees) || attendees.length !== quantity) {
      throw new ValidationError(
        `Please provide attendee details for all ${quantity} ticket(s)`
      );
    }

    for (let i = 0; i < attendees.length; i++) {
      const a = attendees[i];
      if (!a.firstName || !a.lastName || !a.email || !a.phoneNumber) {
        throw new ValidationError(
          `Attendee ${i + 1}: First name, last name, email, and phone number are required`
        );
      }
      if (!validateEmail(a.email)) {
        throw new ValidationError(`Attendee ${i + 1}: Invalid email address`);
      }
      if (!validatePhoneNumber(a.phoneNumber)) {
        throw new ValidationError(`Attendee ${i + 1}: Invalid phone number`);
      }
    }

    const sanitizedAttendees: IAttendee[] = attendees.map((a: any) => ({
      firstName: a.firstName.trim(),
      lastName: a.lastName.trim(),
      email: a.email.trim().toLowerCase(),
      phoneNumber: a.phoneNumber.trim(),
    }));

    // Fetch ticket
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw new NotFoundError('Ticket not found');

    if (ticket.status !== TicketStatus.AVAILABLE) {
      throw new ValidationError('This ticket is not available for booking');
    }

    // Check availability
    const available = ticket.totalQuantity - ticket.soldQuantity;
    if (quantity > available) {
      throw new ValidationError(
        `Only ${available} ticket(s) remaining for this tier`
      );
    }

    // Fetch event to ensure it's still active
    const event = await Event.findById(ticket.eventId);
    if (!event || event.status !== EventStatus.PUBLISHED) {
      throw new ValidationError('Event is not available for booking');
    }

    // Create booking
    const bookingReference = generateBookingRef();
    const booking = await Booking.create({
      bookingReference,
      userId,
      eventId: ticket.eventId,
      ticketId: ticket._id!.toString(),
      quantity,
      unitPrice: ticket.price,
      totalAmount: ticket.price * quantity,
      attendees: sanitizedAttendees,
      bookingStatus: BookingStatus.PENDING,
      paymentStatus: PaymentStatus.UNPAID,
    });

    // Increment sold quantity
    ticket.soldQuantity += quantity;
    if (ticket.soldQuantity >= ticket.totalQuantity) {
      ticket.status = TicketStatus.SOLD_OUT;
    }
    await ticket.save();

    res.status(201).json({
      success: true,
      message: 'Booking created. Please pay at the venue and have a manager verify your booking.',
      data: booking,
    });
  }
);

// ─── USER: Get my bookings ───────────────────────────────────────

export const getMyBookings = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new AuthenticationError('Authentication required');

    const userId = (req.user as any)._id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [bookings, total] = await Promise.all([
      Booking.find({ userId }).skip(skip).limit(limit),
      Booking.countDocuments({ userId }),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);

// ─── USER: Get single booking ────────────────────────────────────

export const getBookingById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new AuthenticationError('Authentication required');

    const booking = await Booking.findById(req.params.id);

    if (!booking) throw new NotFoundError('Booking not found');

    // Users can only see their own bookings, managers/admins can see any
    const userRole = (req.user as any).role;
    if (
      userRole === 'user' &&
      booking.userId !== (req.user as any)._id
    ) {
      throw new AuthorizationError('You can only view your own bookings');
    }

    res.status(200).json({ success: true, data: booking });
  }
);

// ─── USER: Cancel booking ────────────────────────────────────────

export const cancelBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new AuthenticationError('Authentication required');

    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.userId !== (req.user as any)._id) {
      throw new AuthorizationError('You can only cancel your own bookings');
    }

    if (booking.bookingStatus === BookingStatus.CONFIRMED) {
      throw new ValidationError('Cannot cancel a confirmed booking. Contact support.');
    }

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new ValidationError('Booking is already cancelled');
    }

    // Restore ticket quantity
    const ticket = await Ticket.findById(booking.ticketId);
    if (ticket) {
      ticket.soldQuantity = Math.max(0, ticket.soldQuantity - booking.quantity);
      if (ticket.status === TicketStatus.SOLD_OUT && ticket.soldQuantity < ticket.totalQuantity) {
        ticket.status = TicketStatus.AVAILABLE;
      }
      await ticket.save();
    }

    booking.bookingStatus = BookingStatus.CANCELLED;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      data: booking,
    });
  }
);

// ─── MANAGER: Verify booking (after receiving payment at venue) ──

export const verifyBooking = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    if (!req.user) throw new AuthenticationError('Authentication required');

    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new NotFoundError('Booking not found');

    if (booking.bookingStatus === BookingStatus.CANCELLED) {
      throw new ValidationError('Cannot verify a cancelled booking');
    }

    if (booking.bookingStatus === BookingStatus.CONFIRMED) {
      throw new ValidationError('Booking is already verified');
    }

    const managerId = (req.user as any)._id;

    // Mark as paid & confirmed
    booking.paymentStatus = PaymentStatus.PAID;
    booking.bookingStatus = BookingStatus.CONFIRMED;
    booking.verifiedBy = managerId;
    booking.verifiedAt = new Date();

    await booking.save();

    // Send ticket to user's email
    const [user, event, ticket] = await Promise.all([
      User.findById(booking.userId),
      Event.findById(booking.eventId),
      Ticket.findById(booking.ticketId),
    ]);

    if (user && event && ticket) {
      // Send email to the first attendee's email (booking contact)
      const primaryAttendee = booking.attendees[0];
      const emailTo = primaryAttendee ? primaryAttendee.email : user.email;
      const emailName = primaryAttendee
        ? `${primaryAttendee.firstName} ${primaryAttendee.lastName}`
        : `${user.firstName} ${user.lastName}`;

      const emailSent = await sendTicketConfirmationEmail({
        to: emailTo,
        userName: emailName,
        eventTitle: event.title,
        eventDate: event.date.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }),
        eventTime: event.time,
        venue: event.venue,
        location: event.location,
        ticketType: ticket.name,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        bookingReference: booking.bookingReference,
      });

      if (emailSent) {
        booking.ticketSentAt = new Date();
        await booking.save();
      }
    }

    res.status(200).json({
      success: true,
      message: 'Booking verified and ticket sent to user email',
      data: booking,
    });
  }
);

// ─── MANAGER: Lookup booking by reference ────────────────────────

export const getBookingByReference = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { reference } = req.params;

    const ref = Array.isArray(reference) ? reference[0] : reference;

    const booking = await Booking.findOne({
      bookingReference: ref.toUpperCase(),
    });

    if (!booking) throw new NotFoundError('Booking not found');

    // Also return user & event info for manager context
    const [user, event, ticket] = await Promise.all([
      User.findById(booking.userId).select('-password'),
      Event.findById(booking.eventId),
      Ticket.findById(booking.ticketId),
    ]);

    res.status(200).json({
      success: true,
      data: {
        booking,
        user,
        event,
        ticket,
      },
    });
  }
);

// ─── MANAGER: List all bookings (with filters) ──────────────────

export const getAllBookings = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.eventId) query.eventId = req.query.eventId;
    if (req.query.bookingStatus) query.bookingStatus = req.query.bookingStatus;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;

    const [bookings, total] = await Promise.all([
      Booking.find(query).skip(skip).limit(limit),
      Booking.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: bookings,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);

// ─── MANAGER: Get booking stats for an event ─────────────────────

export const getBookingStats = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) throw new NotFoundError('Event not found');

    // CosmosDB for MongoDB does not support $group aggregation — use countDocuments per status
    const statuses = Object.values(BookingStatus);

    const statusCounts = await Promise.all(
      statuses.map(async (status) => {
        const [count, bookings] = await Promise.all([
          Booking.countDocuments({ eventId, bookingStatus: status }),
          Booking.find({ eventId, bookingStatus: status }).select('totalAmount quantity'),
        ]);
        const totalAmount = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
        const totalTickets = bookings.reduce((sum, b) => sum + b.quantity, 0);
        return { status, count, totalAmount, totalTickets };
      })
    );

    const totalBookings = statusCounts.reduce((sum, s) => sum + s.count, 0);
    const totalRevenue = statusCounts
      .filter((s) => s.status === BookingStatus.CONFIRMED)
      .reduce((sum, s) => sum + s.totalAmount, 0);

    const byStatus = statusCounts.reduce(
      (acc, s) => {
        if (s.count > 0) {
          acc[s.status] = { count: s.count, totalAmount: s.totalAmount, totalTickets: s.totalTickets };
        }
        return acc;
      },
      {} as Record<string, any>
    );

    res.status(200).json({
      success: true,
      data: {
        eventId,
        eventTitle: event.title,
        totalBookings,
        totalRevenue,
        byStatus,
      },
    });
  }
);
