import { Request, Response } from 'express';
import LeaderboardService from '../services/leaderboardService';
import { HomeData } from '../interfaces/leaderboard';

class LeaderboardController {
  public static async getHome(_req: Request, res: Response): Promise<void> {
    try {
      const homeData: HomeData[] = await LeaderboardService.getHomeLeaderboard();
      res.status(200).json(homeData);
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  public static async getAway(_req: Request, res: Response): Promise<void> {
    try {
      const awayData: HomeData[] = await LeaderboardService.getAwayLeaderboard();
      res.status(200).json(awayData);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // public static async getAll(req: Request, res: Response): Promise<void> {
  //   try {
  //     const awayData: HomeData[] = await LeaderboardService.getAllLeaderboard();
  //     res.status(200).json(awayData);
  //   } catch (error) {
  //     res.status(500).json({ error });
  //   }
  // }
}

export default LeaderboardController;
