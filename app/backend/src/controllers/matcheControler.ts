import { Request, Response } from 'express';
import MatchService from '../services/matcheService';

class MatchController {
  // eslint-disable-next-line class-methods-use-this
  async getAllMatches(req: Request, res: Response) {
    try {
      const matches = await MatchService.getAllMatches();
      res.json(matches);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch matches' });
    }
  }
}

export default new MatchController();
