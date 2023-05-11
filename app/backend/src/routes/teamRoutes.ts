import { Router } from 'express';
import TeamController from '../controllers/teamController';

const teamRouter = Router();

teamRouter.get('/', (req, res) => TeamController.getAllTeams(req, res));

export default teamRouter;
