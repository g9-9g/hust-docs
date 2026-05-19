import type { Role } from '../modules/users/user.model.js';

declare global {
  namespace Express {
    interface UserPayload {
      id: string;
      role: Role;
    }
    interface Request {
      user?: UserPayload;
    }
  }
}

export {};
