import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamRouter = Router();

teamRouter.get('/', TeamController.getAllTeams);
teamRouter.get('/:id', TeamController.getTeamById);

export default teamRouter;
