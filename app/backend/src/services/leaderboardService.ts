/* eslint-disable max-lines-per-function */
import { MatchAttributes } from '../database/models/Matches';
import TeamService from './teamService';
import MatchService from './matcheService';

export interface HomeData {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: number;
}

interface TeamStats extends HomeData {
  efficiency: number;
}

function calculateTotalPoints(homeTeamGoals: number, awayTeamGoals: number): TeamStats {
  const result: TeamStats = {
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

class LeaderboardService {
  private static async calculateTeamStats(matches: MatchAttributes[]): Promise<TeamStats> {
    const result: TeamStats = {
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

    await Promise.all(
      matches.map(async (match) => {
        if (!match.inProgress) {
          result.totalGames += 1;
          const { homeTeamGoals, awayTeamGoals } = match;
          const matchResult = calculateTotalPoints(homeTeamGoals, awayTeamGoals);
          result.totalPoints += matchResult.totalPoints;
          result.totalVictories += matchResult.totalVictories;
          result.totalDraws += matchResult.totalDraws;
          result.totalLosses += matchResult.totalLosses;
          result.goalsFavor += homeTeamGoals;
          result.goalsOwn += awayTeamGoals;
          result.goalsBalance += homeTeamGoals - awayTeamGoals;
        }
      }),
    );

    // eslint-disable-next-line max-len
    result.efficiency = parseFloat(((result.totalPoints / (result.totalGames * 3)) * 100).toFixed(2));

    return result;
  }

  public static async getHomeData(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);

    const homeData: HomeData[] = await Promise.all(
      teams.map(async (team) => {
        const teamMatches = matches.filter((match) => match.homeTeamId === team.id);
        const teamStats = await this.calculateTeamStats(teamMatches);

        return {
          name: team.teamName,
          totalPoints: teamStats.totalPoints,
          totalGames: teamStats.totalGames,
          totalVictories: teamStats.totalVictories,
          totalDraws: teamStats.totalDraws,
          totalLosses: teamStats.totalLosses,
          goalsFavor: teamStats.goalsFavor,
          goalsOwn: teamStats.goalsOwn,
          goalsBalance: teamStats.goalsBalance,
          efficiency: teamStats.efficiency,
        };
      }),
    );

    return homeData;
  }

  public static async getAwayData(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);

    const awayData: HomeData[] = await Promise.all(
      teams.map(async (team) => {
        const teamMatches = matches.filter((match) => match.awayTeamId === team.id);
        const teamStats = await this.calculateTeamStats(teamMatches);

        return {
          name: team.teamName,
          totalPoints: teamStats.totalPoints,
          totalGames: teamStats.totalGames,
          totalVictories: teamStats.totalVictories,
          totalDraws: teamStats.totalDraws,
          totalLosses: teamStats.totalLosses,
          goalsFavor: teamStats.goalsFavor,
          goalsOwn: teamStats.goalsOwn,
          goalsBalance: teamStats.goalsBalance,
          efficiency: teamStats.efficiency,
        };
      }),
    );

    return awayData;
  }
}

export default LeaderboardService;
