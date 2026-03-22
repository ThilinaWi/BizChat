import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { connectDatabase } from './config/database';
import configurePassport from './config/passport';
import routes from './routes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import requestLogger from './middleware/requestLogger';
import { log } from './utils/logger';

dotenv.config();

const app: Application = express();

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://www.bizchat.lk',
  'https://bizchat.lk',
  'https://victorious-sea-0a55a3f0f.6.azurestaticapps.net'
];

app.use(cors({
  origin: (origin, callback) => {

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },

  methods: ['GET','POST','PUT','DELETE','PATCH','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Passport (Google OAuth)
configurePassport();
app.use(passport.initialize());

// Request logging
app.use(requestLogger);

app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'BizChat API is running',
    version: '2.0.0',
    features: [
      'JWT Authentication with Access & Refresh Tokens',
      'Google OAuth (Gmail Sign-in)',
      'Role-Based Access Control (User, Manager, Admin)',
      'Event & Ticket Management',
      'Booking with Venue Payment & Manager Verification',
      'Email Ticket Confirmation',
      'Comprehensive Error Handling',
      'User Management',
    ],
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/api', routes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 4500;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      log.info(`Server started successfully on port ${PORT}`);
      log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
      log.info(`Access token expiry: ${process.env.JWT_ACCESS_EXPIRES_IN || '15m'}`);
      log.info(`Refresh token expiry: ${process.env.JWT_REFRESH_EXPIRES_IN || '7d'}`);
    });
  } catch (error) {
    log.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();

// ─── Process-level safety nets ───────────────────────────────────
process.on('unhandledRejection', (reason: unknown) => {
  const message = reason instanceof Error ? reason.message : String(reason);
  const stack   = reason instanceof Error ? reason.stack   : undefined;
  log.error('Unhandled Promise Rejection — shutting down', { message, stack });
  process.exit(1);
});

process.on('uncaughtException', (error: Error) => {
  log.error('Uncaught Exception — shutting down', { message: error.message, stack: error.stack });
  process.exit(1);
});
