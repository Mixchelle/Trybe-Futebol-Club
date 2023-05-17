import bcrypt = require('bcryptjs') ;
import User from '../database/models/User';
import auth from '../Utils/Auth';

class UserService {
  public static async login(email: string, password: string): Promise<string | unknown> {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return null;

    const token = auth.generateToken({ id: user.id, role: user.role });

    return token;
  }

  public static async getUserByToken(token: string): Promise<User | null> {
    const decodedToken = auth.authToken(token);
    const userId = decodedToken.id;
    const result = await User.findByPk(userId);
    return result;
  }
}

export default UserService;
