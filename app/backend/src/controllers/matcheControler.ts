import { Request, Response } from 'express';
import MatchService from '../services/matcheService';

class MatchController {
  public static async getAllMatches(req: Request, res: Response) {
    try {
      const { inProgress } = req.query;
      if (typeof inProgress === 'string') {
        const matches = await MatchService.getFilteredMatches(inProgress);
        return res.status(200).json(matches);
      }
      const matches = await MatchService.getAllMatches();
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch filtered matches' });
    }
  }

  public static async finishMatch(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await MatchService.finishMatch(Number(id));
      res.status(200).json({ message: 'Finished' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to finish match' });
    }
  }

  public static async updateMatch(req: Request, res: Response) {
    const { id } = req.params;
    const { homeTeamGoals, awayTeamGoals } = req.body;

    try {
      const result = await MatchService.updateMatch(Number(id), { homeTeamGoals, awayTeamGoals });
      return res.status(200).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Failed to update match' });
    }
  }

  public static async createMatch(req: Request, res: Response) {
    try {
      const match = await MatchService.createMatch(req.body);
      if ('status' in match) {
        return res.status(match.status).json({ message: match.message });
      }
      return res.status(201).json(match);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error });
    }
  }
}

export default MatchController;
