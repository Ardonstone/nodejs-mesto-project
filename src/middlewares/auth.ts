import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import JWT_KEY from '../utils/config';
import AppError from '../errors/appError';

interface AuthRequest extends Request {
  user?: string | JwtPayload;
}

const auth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.jwt;

  if (!token) {
    return next(new AppError('Необходима авторизация', 401));
  }

  let payload;

  try {
    payload = jwt.verify(token, JWT_KEY);
  } catch (err) {
    return next(new AppError('Необходима авторизация', 401));
  }

  req.user = payload as { _id: string };

  return next();
};

export default auth;