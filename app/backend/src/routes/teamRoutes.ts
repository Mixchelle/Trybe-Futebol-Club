import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamRouter = Router();

teamRouter.get('/', (req, res) => TeamController.getAllTeams(req, res));
teamRouter.get('/:id', (req, res) => TeamController.getTeamById(req, res));

export default teamRouter;
