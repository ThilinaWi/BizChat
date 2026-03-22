import { IUserResponse } from './index';

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      user?: IUserResponse;
    }
    
    interface User extends IUserResponse {}
  }
}

export {};
