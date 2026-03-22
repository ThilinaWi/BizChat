import { IUserResponse } from '../types'

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
    
    interface User extends IUserResponse {}
  }
}

export {};