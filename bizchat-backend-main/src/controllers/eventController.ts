import { Request, Response } from 'express';
import Event from '../models/Event';
import { asyncHandler } from '../middleware/errorHandler';
import { ValidationError, NotFoundError } from '../utils/errors';
import { EventStatus } from '../types';

// ─── PUBLIC: List published events ───────────────────────────────

export const getPublishedEvents = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = { status: EventStatus.PUBLISHED };

    // Optional: filter by upcoming only
    if (req.query.upcoming === 'true') {
      query.date = { $gte: new Date() };
    }

    const [events, total] = await Promise.all([
      Event.find(query).skip(skip).limit(limit),
      Event.countDocuments(query),
    ]);

    // Sort by date ascending in memory (Cosmos DB index compatibility)
    events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    res.status(200).json({
      success: true,
      data: events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);

// ─── PUBLIC: Get single event ────────────────────────────────────

export const getEventById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    res.status(200).json({ success: true, data: event });
  }
);

// ─── MANAGER / ADMIN: Create event ──────────────────────────────

export const createEvent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, description, date, time, venue, location, imageUrl, status } = req.body;

    if (!title || !description || !date || !time || !venue || !location) {
      throw new ValidationError('Missing required fields', [
        'title, description, date, time, venue, and location are required',
      ]);
    }

    const event = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: new Date(date),
      time: time.trim(),
      venue: venue.trim(),
      location: location.trim(),
      imageUrl: imageUrl?.trim(),
      status: status || EventStatus.DRAFT,
      createdBy: (req.user as any)._id,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  }
);

// ─── MANAGER / ADMIN: Update event ──────────────────────────────

export const updateEvent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    const allowedFields = ['title', 'description', 'date', 'time', 'venue', 'location', 'imageUrl', 'status'];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        (event as any)[field] = field === 'date' ? new Date(req.body[field]) : req.body[field];
      }
    }

    await event.save();

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  }
);

// ─── MANAGER / ADMIN: Delete event ──────────────────────────────

export const deleteEvent = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const event = await Event.findById(req.params.id);

    if (!event) {
      throw new NotFoundError('Event not found');
    }

    await Event.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Event deleted successfully',
    });
  }
);

// ─── MANAGER / ADMIN: List all events (incl. drafts) ────────────

export const getAllEvents = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (req.query.status) {
      query.status = req.query.status;
    }

    const [events, total] = await Promise.all([
      Event.find(query).skip(skip).limit(limit),
      Event.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: events,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  }
);
