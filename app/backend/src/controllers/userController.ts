import { Request, Response } from 'express';
import UserService from '../services/userService';

class UserController {
  public static async login(req: Request, res: Response) {
    const { email, password } = req.body;
    try {
      const token = await UserService.login(email, password);
      if (typeof token !== 'string') {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.status(200).json({ token });
    } catch (error) {
      return res.status(401).json({ message: error });
    }
  }

  public static async getRole(req: Request, res: Response) {
    try {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({ message: 'Token not found' });
      }
      const user = await UserService.getUserByToken(token);
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
      return res.status(200).json({ role: user.role });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default UserController;
