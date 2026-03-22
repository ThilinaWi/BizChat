import nodemailer from 'nodemailer';
import { log } from './logger';

const createTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    log.warn('SMTP not configured – emails will be logged only');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  });
};

let transporter: nodemailer.Transporter | null = null;

const getTransporter = () => {
  if (!transporter) {
    transporter = createTransporter();
  }
  return transporter;
};

const fromAddress = () => process.env.SMTP_FROM || 'noreply@bizchat.com';

// ─── Send confirmed ticket email ─────────────────────────────────

interface TicketEmailPayload {
  to: string;
  userName: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  venue: string;
  location: string;
  ticketType: string;
  quantity: number;
  totalAmount: number;
  bookingReference: string;
}

export const sendTicketConfirmationEmail = async (
  payload: TicketEmailPayload
): Promise<boolean> => {
  const {
    to,
    userName,
    eventTitle,
    eventDate,
    eventTime,
    venue,
    location,
    ticketType,
    quantity,
    totalAmount,
    bookingReference,
  } = payload;

  const subject = `🎟️ Your Ticket Confirmed – ${eventTitle}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
        <h1 style="color: #fff; margin: 0;">Ticket Confirmed! 🎉</h1>
      </div>
      
      <div style="background: #fff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">Hi <strong>${userName}</strong>,</p>
        <p style="font-size: 14px; color: #555;">Your booking has been verified and your ticket is confirmed. Here are the details:</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Booking Ref</td>
              <td style="padding: 8px 0; font-weight: bold; font-size: 14px; text-align: right;">${bookingReference}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Event</td>
              <td style="padding: 8px 0; font-weight: bold; font-size: 14px; text-align: right;">${eventTitle}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Date & Time</td>
              <td style="padding: 8px 0; font-size: 14px; text-align: right;">${eventDate} at ${eventTime}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Venue</td>
              <td style="padding: 8px 0; font-size: 14px; text-align: right;">${venue}, ${location}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Ticket Type</td>
              <td style="padding: 8px 0; font-size: 14px; text-align: right;">${ticketType}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #777; font-size: 13px;">Quantity</td>
              <td style="padding: 8px 0; font-size: 14px; text-align: right;">${quantity}</td>
            </tr>
            <tr style="border-top: 1px solid #ddd;">
              <td style="padding: 12px 0 0; color: #333; font-weight: bold; font-size: 15px;">Total Paid</td>
              <td style="padding: 12px 0 0; font-weight: bold; font-size: 15px; text-align: right; color: #667eea;">LKR ${totalAmount.toFixed(2)}</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; color: #999; text-align: center; margin-top: 20px;">
          Please present your booking reference <strong>${bookingReference}</strong> at the venue.
        </p>
      </div>
      
      <p style="font-size: 11px; color: #bbb; text-align: center; margin-top: 16px;">
        © ${new Date().getFullYear()} BizChat. All rights reserved.
      </p>
    </div>
  `;

  const transport = getTransporter();

  if (!transport) {
    log.info(`[EMAIL-MOCK] Ticket confirmation to ${to}`, { bookingReference, eventTitle });
    return true;
  }

  try {
    await transport.sendMail({
      from: fromAddress(),
      to,
      subject,
      html,
    });
    log.info(`Ticket confirmation email sent to ${to}`, { bookingReference });
    return true;
  } catch (error) {
    log.error('Failed to send ticket email', { error: (error as Error).message, to });
    return false;
  }
};
