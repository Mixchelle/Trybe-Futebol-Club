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
  efficiency: '0',
  name: '',
};

class LeaderboardServiceAway {
  private static calculateTotalPointsAway(homeTeamGoals: number, awayTeamGoals: number): TeamStats {
    const result: TeamStats = { ...initialPoints };
    if (awayTeamGoals > homeTeamGoals) {
      result.totalPoints = 3;
      result.totalVictories = 1;
    } else if (awayTeamGoals === homeTeamGoals) {
      result.totalPoints = 1;
      result.totalDraws = 1;
    } else {
      result.totalPoints = 0;
      result.totalLosses = 1;
    }
    return result;
  }

  private static calculateEfficiency(points: number, games: number): string {
    if (games === 0) return '0';
    const efficiency = (points / (games * 3)) * 100;
    return efficiency.toFixed(2).toString();
  }

  private static async calculateTeamStatsAway(matches: MatchAttributes[]): Promise<TeamStats> {
    const result: TeamStats = { ...initialPoints };
    matches.forEach((match) => {
      if (!match.inProgress) {
        result.totalGames += 1;
        const { homeTeamGoals, awayTeamGoals } = match;
        const matchResult = this.calculateTotalPointsAway(homeTeamGoals, awayTeamGoals);
        result.totalPoints += matchResult.totalPoints;
        result.totalVictories += matchResult.totalVictories;
        result.totalDraws += matchResult.totalDraws;
        result.totalLosses += matchResult.totalLosses;
        result.goalsFavor += awayTeamGoals;
        result.goalsOwn += homeTeamGoals;
        result.goalsBalance += awayTeamGoals - homeTeamGoals;
      }
    });
    result.efficiency = this.calculateEfficiency(result.totalPoints, result.totalGames);
    return result;
  }

  public static async getAwayData(teams: TeamAttributes[], matches: MatchAttributes[]):
  Promise<HomeData[]> {
    const awayData = await Promise.all(
      teams.map(async (team) => {
        const teamMatches = matches.filter((match) => match.awayTeamId === team.id);
        const teamStats = await this.calculateTeamStatsAway(teamMatches);
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
    return teams.sort((a, b) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.totalVictories === b.totalVictories) {
          if (a.goalsBalance === b.goalsBalance) {
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return a.totalVictories - b.totalVictories;
      }
      return b.totalPoints - a.totalPoints;
    });
  }

  public static async getAwayLeaderboard(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);
    const awayData = await this.getAwayData(teams, matches);
    const result = await this.sortTeamsByPoints(awayData);
    return result;
  }
}

export default LeaderboardServiceAway;
