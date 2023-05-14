import { Router } from 'express';
import MatcherController from '../controllers/matcheControler';

const matcheRouter = Router();

matcheRouter.get('/', MatcherController.getAllMatches);

export default matcheRouter;
