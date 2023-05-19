import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';
import LeaderboardServiceAway from '../services/leaderboardServiceAway';
import { HomeData } from '../interfaces/leaderboard';

class LeaderboardController {
  public static async getHome(req: Request, res: Response): Promise<void> {
    try {
      const homeData: HomeData[] = await LeaderboardService.getHomeLeaderboard();
      res.status(200).json(homeData);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public static async getAway(req: Request, res: Response): Promise<void> {
    try {
      const awayData: HomeData[] = await LeaderboardServiceAway.getAwayLeaderboard();
      res.status(200).json(awayData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  public static async getAll(req: Request, res: Response): Promise<void> {
    try {
      const homeData: HomeData[] = await LeaderboardService.getHomeLeaderboard();
      const awayData: HomeData[] = await LeaderboardServiceAway.getAwayLeaderboard();
      const allData: HomeData[] = await LeaderboardService.sumTeamData(homeData, awayData);
      res.status(200).json(allData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default LeaderboardController;
