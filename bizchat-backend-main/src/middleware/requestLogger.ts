import morgan from 'morgan';
import { morganStream } from '../utils/logger';

// Define custom Morgan token for user ID
morgan.token('user-id', (req: any) => {
  return req.user?._id || 'unauthenticated';
});

// Create Morgan middleware with custom format
// Format: :method :url :status :response-time ms - :user-id
const requestLogger = morgan(
  ':method :url :status :response-time ms - user: :user-id',
  {
    stream: morganStream,
    skip: (req, res) => {
      // Skip logging for health check endpoint in production
      if (process.env.NODE_ENV === 'production' && req.url === '/health') {
        return true;
      }
      return false;
    },
  }
);

export default requestLogger;
