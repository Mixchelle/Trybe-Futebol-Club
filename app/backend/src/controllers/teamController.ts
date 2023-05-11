import { Request, Response } from 'express';
import TeamService from '../services/teamService';

class TeamController {
  public static async getAllTeams(req: Request, res: Response): Promise<void> {
    try {
      const teams = await TeamService.getAllTeams();
      res.status(200).json(teams);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch teams' });
    }
  }
}

export default TeamController;
