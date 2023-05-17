import { Router } from 'express';
import MatchController from '../controllers/matcheControler';
import validateToken from '../middleware/validateToken';

const matchesRouter = Router();

matchesRouter.get('/', MatchController.getAllMatches);

matchesRouter.patch('/:id', validateToken, MatchController.updateMatch);
matchesRouter.patch('/:id/finish', validateToken, MatchController.finishMatch);

matchesRouter.post('/', validateToken, MatchController.createMatch);

export default matchesRouter;
