require('dotenv').config();
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction, RequestHandler } from 'express';
import { promisify } from 'util';
import { UserRepository } from '../controllers/userController';
import { AppError } from "../utils/AppError";
import catchAsync from '../utils/catchAsync';

interface UserPayload {
  id: number;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

const verifyToken = promisify(jwt.verify) as (token: string, secret: string) => Promise<any>;

export const authenticateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  let token: string | undefined;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access', 401));
    }
    const decoded = await verifyToken(token, process.env.JWT_SECRET);
    const user = await UserRepository.findOneBy({ id: decoded.id });
    if (!user) {
      return next(new AppError('The user belonging to this token no longer exists', 401));
    }
    req.user = {
      id: user.id,
      role: user.role
    };
    next();
  }
})

export const authorizeUser = (roles: string[]): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)){
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  }
}