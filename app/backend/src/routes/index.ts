import { Router } from 'express';
import teamsRouter from './teamRoutes';
import loginRouter from './loginRouter';
import matcheRouter from './matchesRouter';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);
router.use('/matches', matcheRouter);

export default router;
