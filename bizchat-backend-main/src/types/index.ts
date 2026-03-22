import { UserRole } from '../constants/roles';

export interface IUser {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
  googleId?: string;
  avatar?: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserResponse {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  googleId?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}

export interface ISignInRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: IUserResponse;
}

export interface IRefreshToken {
  _id?: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt?: Date;
}

export interface ITokenPayload {
  userId: string;
  role: UserRole;
}

export interface IUpdateUserRequest {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
}

// ─── Google OAuth ────────────────────────────────────────────────

export interface IGoogleProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

// ─── Event ───────────────────────────────────────────────────────

export enum EventStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}

export interface IEvent {
  _id?: string;
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  location: string;
  imageUrl?: string;
  status: EventStatus;
  createdBy: string; // userId (admin or manager)
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Ticket (tier / type for an event) ───────────────────────────

export enum TicketStatus {
  AVAILABLE = 'available',
  SOLD_OUT = 'sold_out',
  DISABLED = 'disabled',
}

export interface ITicket {
  _id?: string;
  eventId: string;
  name: string; // e.g. "General", "VIP", "VVIP"
  description?: string;
  price: number;
  totalQuantity: number;
  soldQuantity: number;
  status: TicketStatus;
  createdBy: string; // managerId
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Booking ─────────────────────────────────────────────────────

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
}

export enum PaymentStatus {
  UNPAID = 'unpaid',
  PAID = 'paid',
  REFUNDED = 'refunded',
}

export interface IAttendee {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
}

export interface IBooking {
  _id?: string;
  bookingReference: string;
  userId: string;
  eventId: string;
  ticketId: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  attendees: IAttendee[];
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  verifiedBy?: string; // managerId who verified
  verifiedAt?: Date;
  ticketSentAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Create Manager Request ──────────────────────────────────────

export interface ICreateManagerRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  password: string;
}
