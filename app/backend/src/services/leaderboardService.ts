import { MatchAttributes } from '../database/models/Matches';
import TeamService from './teamService';
import MatchService from './matcheService';
import { HomeData } from '../interfaces/leaderboard';
import { TeamAttributes } from '../database/models/Team';

type TeamStats = HomeData;

const initialPoints = {
  totalPoints: 0,
  totalVictories: 0,
  totalDraws: 0,
  totalLosses: 0,
  totalGames: 0,
  goalsFavor: 0,
  goalsOwn: 0,
  goalsBalance: 0,
  efficiency: 0,
  name: '',
};

class LeaderboardService {
  private static calculateTotalPoints(homeTeamGoals: number, awayTeamGoals: number): TeamStats {
    const result: TeamStats = { ...initialPoints };
    if (homeTeamGoals > awayTeamGoals) {
      result.totalPoints = 3;
      result.totalVictories = 1;
    } else if (homeTeamGoals < awayTeamGoals) {
      result.totalLosses = 1;
    } else {
      result.totalPoints = 1;
      result.totalDraws = 1;
    }
    return result;
  }

  private static calculateEfficiency(points: number, games: number): number {
    if (games === 0) return 0;
    const efficiency = (points / (games * 3)) * 100;
    return parseFloat(efficiency.toFixed(2));
  }

  private static async calculateTeamStats(matches: MatchAttributes[]): Promise<TeamStats> {
    const result: TeamStats = { ...initialPoints };
    matches.forEach((match) => {
      if (!match.inProgress) {
        result.totalGames += 1;
        const { homeTeamGoals, awayTeamGoals } = match;
        const matchResult = this.calculateTotalPoints(homeTeamGoals, awayTeamGoals);
        result.totalPoints += matchResult.totalPoints;
        result.totalVictories += matchResult.totalVictories;
        result.totalDraws += matchResult.totalDraws;
        result.totalLosses += matchResult.totalLosses;
        result.goalsFavor += homeTeamGoals;
        result.goalsOwn += awayTeamGoals;
        result.goalsBalance += homeTeamGoals - awayTeamGoals;
      }
    });
    result.efficiency = this.calculateEfficiency(result.totalPoints, result.totalGames);
    return result;
  }

  public static async getHomeData(teams: TeamAttributes[], matches: MatchAttributes[]):
  Promise<HomeData[]> {
    const homeData: HomeData[] = await Promise.all(teams.map(async (team) => {
      const teamMatches = matches.filter((match) => match.homeTeamId === team.id);
      const teamStats = await this.calculateTeamStats(teamMatches);
      const efficiency = this.calculateEfficiency(teamStats.totalPoints, teamStats.totalGames);
      return { name: team.teamName,
        totalPoints: teamStats.totalPoints,
        totalGames: teamStats.totalGames,
        totalVictories: teamStats.totalVictories,
        totalDraws: teamStats.totalDraws,
        totalLosses: teamStats.totalLosses,
        goalsFavor: teamStats.goalsFavor,
        goalsOwn: teamStats.goalsOwn,
        goalsBalance: teamStats.goalsBalance,
        efficiency,
      };
    }));

    return homeData;
  }

  public static async getAwayData(teams: TeamAttributes[], matches: MatchAttributes[]):
  Promise<HomeData[]> {
    const awayData = await Promise.all(
      teams.map(async (team) => {
        const teamMatches = matches.filter((match) => match.awayTeamId === team.id);
        const teamStats = await this.calculateTeamStats(teamMatches);
        return { name: team.teamName,
          totalPoints: teamStats.totalPoints,
          totalGames: teamStats.totalGames,
          totalVictories: teamStats.totalVictories,
          totalDraws: teamStats.totalDraws,
          totalLosses: teamStats.totalLosses,
          goalsFavor: teamStats.goalsFavor,
          goalsOwn: teamStats.goalsOwn,
          goalsBalance: teamStats.goalsBalance,
          efficiency: teamStats.efficiency };
      }),
    );

    return awayData;
  }

  public static sortTeamsByPoints(teams: HomeData[]): HomeData[] {
    return teams.sort((a, b) => b.totalPoints - a.totalPoints);
  }

  public static async getHomeLeaderboard(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);
    const homeData = await this.getHomeData(teams, matches);
    const result = await this.sortTeamsByPoints(homeData);
    return result;
  }

  public static async getAwayLeaderboard(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);
    const awayData = await this.getAwayData(teams, matches);
    const result = await this.sortTeamsByPoints(awayData);
    return result;
  }

  // public static async getAllData(homeData: HomeData[], awayData: HomeData[]): Promise<HomeData[]> {
  //   const allData = homeData.map((teamData) => {
  //     const awayTeamData = awayData.find((data) => data.name === teamData.name);
  //     return { ...teamData,
  //       totalPoints: teamData.totalPoints + (awayTeamData?.totalPoints || 0),
  //       totalGames: teamData.totalGames + (awayTeamData?.totalGames || 0),
  //       totalVictories: teamData.totalVictories + (awayTeamData?.totalVictories || 0),
  //       totalDraws: teamData.totalDraws + (awayTeamData?.totalDraws || 0),
  //       totalLosses: teamData.totalLosses + (awayTeamData?.totalLosses || 0),
  //       goalsFavor: teamData.goalsFavor + (awayTeamData?.goalsFavor || 0),
  //       goalsOwn: teamData.goalsOwn + (awayTeamData?.goalsOwn || 0),
  //       goalsBalance: teamData.goalsBalance + (awayTeamData?.goalsBalance || 0),
  //       efficiency: teamData.totalPoints + (awayTeamData?.totalPoints || 0),
  //     };
  //   });
  //   return allData;
  // }

  // public static async getAllLeaderboard(): Promise<HomeData[]> {
  //   const teams = await TeamService.getAllTeams();
  //   const matches = await MatchService.getIn(false);
  //   const homeData = await this.getHomeData(teams, matches);
  //   const awayData = await this.getAwayData(teams, matches);
  //   const allData = await this.getAllData(homeData, awayData);
  //   return this.sortTeamsByPoints(allData);
  // }
}

export default LeaderboardService;
