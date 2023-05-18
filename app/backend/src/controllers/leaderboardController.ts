import { Request, Response } from 'express';
import LeaderboardService, { HomeData } from '../services/leaderboardService';

class LeaderboardController {
  public static async getHome(req: Request, res: Response): Promise<void> {
    try {
      const homeData: HomeData[] = await LeaderboardService.getHomeData();
      const sortedData = homeData.sort((a, b) => {
        if (a.totalPoints === b.totalPoints) {
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalPoints - a.totalPoints;
      });

      res.json(sortedData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default LeaderboardController;
