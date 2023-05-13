import { JwtPayload, SignOptions, verify, sign } from 'jsonwebtoken';
import bcrypt = require('bcryptjs');

const secret = process.env.JWT_SECRET || 'theCenterWontHold';
if (!secret) throw new Error('JWT secret is not defined');

const options: SignOptions = {
  algorithm: 'HS256',
  expiresIn: '100d',
};

const generateToken = (payload: JwtPayload): string => {
  const token = sign(payload, secret, options);
  return token;
};

const validateToken = (token: string): boolean => {
  try {
    verify(token, secret);
    return true;
  } catch (error) {
    return false;
  }
};

const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> =>
  bcrypt.compare(password, hashedPassword);

const authToken = (token: string): JwtPayload => verify(token, secret) as JwtPayload;

const auth = {
  generateToken,
  validateToken,
  comparePasswords,
  authToken,
};

export default auth;
