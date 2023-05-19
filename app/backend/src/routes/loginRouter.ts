import { Router } from 'express';
import validateLogin from '../middleware/validateLogin';
import validateToken from '../middleware/validateToken';
import UserController from '../controllers/userController';

const loginRouter = Router();

loginRouter.post('/', validateLogin, UserController.login);
loginRouter.get('/role', validateToken, UserController.getRole);

export default loginRouter;
