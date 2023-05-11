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

  public static async getTeamById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const team = await TeamService.getTeamById(id);
      if (!team) {
        res.status(404).json({ message: 'Team not found' });
      } else {
        res.status(200).json(team);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch team' });
    }
  }
}

export default TeamController;
