import { Router } from 'express';
import teamsRouter from './teamRoutes';
import loginRouter from './loginRouter';
import matchesRouter from './matchesRouter';
import leaderboardRouter from './leaderboardRoutes';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);
router.use('/matches', matchesRouter);
router.use('/leaderboard', leaderboardRouter);

export default router;
