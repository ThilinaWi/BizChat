import { Request, Response } from 'express';
import Ticket from '../models/Ticket';
import Event from '../models/Event';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../utils/errors';
import { TicketStatus, EventStatus } from '../types';

// ─── PUBLIC: Get tickets for an event ────────────────────────────

export const getTicketsByEvent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const tickets = await Ticket.find({
      eventId,
      status: { $ne: TicketStatus.DISABLED },
    });

    // Sort in memory (Cosmos DB doesn't support order-by on unindexed fields)
    tickets.sort((a, b) => a.price - b.price);

    res.status(200).json({
      success: true,
      data: tickets,
    });
  }
);

// ─── PUBLIC: Get single ticket ───────────────────────────────────

export const getTicketById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    res.status(200).json({ success: true, data: ticket });
  }
);

// ─── MANAGER: Create ticket tier for an event ────────────────────

export const createTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { eventId, name, description, price, totalQuantity } = req.body;

    if (!eventId || !name || price === undefined || !totalQuantity) {
      throw new ValidationError('Missing required fields', [
        'eventId, name, price, and totalQuantity are required',
      ]);
    }

    const event = await Event.findById(eventId);
    if (!event) {
      throw new NotFoundError('Event not found');
    }

    if (event.status === EventStatus.CANCELLED) {
      throw new ValidationError('Cannot add tickets to a cancelled event');
    }

    const existing = await Ticket.findOne({ eventId, name: name.trim() });
    if (existing) {
      throw new ValidationError(`Ticket tier "${name}" already exists for this event`);
    }

    const ticket = await Ticket.create({
      eventId,
      name: name.trim(),
      description: description?.trim(),
      price,
      totalQuantity,
      soldQuantity: 0,
      status: TicketStatus.AVAILABLE,
      createdBy: (req.user as any)._id,
    });

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  }
);

// ─── MANAGER: Update ticket price / quantity ─────────────────────

export const updateTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    const { name, description, price, totalQuantity, status } = req.body;

    if (name !== undefined) ticket.name = name.trim();
    if (description !== undefined) ticket.description = description.trim();
    if (price !== undefined) {
      if (price < 0) throw new ValidationError('Price cannot be negative');
      ticket.price = price;
    }
    if (totalQuantity !== undefined) {
      if (totalQuantity < ticket.soldQuantity) {
        throw new ValidationError(
          `Total quantity cannot be less than already sold quantity (${ticket.soldQuantity})`
        );
      }
      ticket.totalQuantity = totalQuantity;
    }
    if (status !== undefined) {
      if (!Object.values(TicketStatus).includes(status)) {
        throw new ValidationError('Invalid ticket status');
      }
      ticket.status = status;
    }

    // Auto-update status based on quantity
    if (ticket.soldQuantity >= ticket.totalQuantity) {
      ticket.status = TicketStatus.SOLD_OUT;
    }

    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    });
  }
);

// ─── MANAGER: Delete ticket ──────────────────────────────────────

export const deleteTicket = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    if (ticket.soldQuantity > 0) {
      throw new ValidationError(
        'Cannot delete a ticket that has sold units. Disable it instead.'
      );
    }

    await Ticket.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  }
);

// ─── MANAGER: Get all tickets (management view) ─────────────────

export const getAllTickets = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.eventId) query.eventId = req.query.eventId;
    if (req.query.status) query.status = req.query.status;

    const [tickets, total] = await Promise.all([
      Ticket.find(query).skip(skip).limit(limit),
      Ticket.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: tickets,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);
