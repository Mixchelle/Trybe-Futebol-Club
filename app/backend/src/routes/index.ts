import { Router } from 'express';
import teamsRouter from './teamRoutes';
import loginRouter from './loginRouter';

const router = Router();

router.use('/teams', teamsRouter);
router.use('/login', loginRouter);

export default router;
