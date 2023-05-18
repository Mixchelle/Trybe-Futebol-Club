import { Router } from 'express';
import LeaderboardController from '../controllers/leaderboardController';

const leaderboardRouter = Router();

leaderboardRouter.get('/home', LeaderboardController.getHome);
leaderboardRouter.get('/away', LeaderboardController.getAway);
leaderboardRouter.get('/', LeaderboardController.getHome);

export default leaderboardRouter;
