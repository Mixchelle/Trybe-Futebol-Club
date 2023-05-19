import { NextFunction, Request, Response } from 'express';
import auth from '../Utils/Auth';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: 'Token not found' });
  }

  if (!auth.validateToken(token)) {
    return res.status(401).json({ message: 'Token must be a valid token' });
  }

  next();
};

export default validateToken;
