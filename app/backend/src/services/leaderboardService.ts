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

class LeaderboardService {
  public static calculateTotalPoints(homeTeamGoals: number, awayTeamGoals: number): TeamStats {
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

  public static calculateEfficiency(points: number, games: number): string {
    if (games === 0) return '0';
    const efficiency = (points / (games * 3)) * 100;
    return efficiency.toFixed(2).toString();
  }

  public static async calculateTeamStats(matches: MatchAttributes[]): Promise<TeamStats> {
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

  public static sortTeamsByPoints(teams: HomeData[]): HomeData[] {
    return teams.sort((a, b) => {
      if (a.totalPoints === b.totalPoints) {
        if (a.totalVictories === b.totalVictories) {
          if (a.goalsBalance === b.goalsBalance) {
            return b.goalsFavor - a.goalsFavor;
          }
          return b.goalsBalance - a.goalsBalance;
        }
        return b.totalVictories - a.totalVictories;
      }
      return b.totalPoints - a.totalPoints;
    });
  }

  public static async getHomeLeaderboard(): Promise<HomeData[]> {
    const teams = await TeamService.getAllTeams();
    const matches = await MatchService.getIn(false);
    const homeData = await this.getHomeData(teams, matches);
    const result = await this.sortTeamsByPoints(homeData);
    return result;
  }

  // eslint-disable-next-line max-lines-per-function
  public static async sumTeamData(homeTeam: HomeData[], awayTeam: HomeData[]): Promise<HomeData[]> {
    const teamData: Record<string, HomeData> = {};

    [...homeTeam, ...awayTeam].forEach((data) => {
      const { name, ...rest } = data;

      if (!teamData[name]) {
        teamData[name] = { name, ...rest };
      } else {
        teamData[name].totalPoints += data.totalPoints;
        teamData[name].totalGames += data.totalGames;
        teamData[name].totalVictories += data.totalVictories;
        teamData[name].totalDraws += data.totalDraws;
        teamData[name].totalLosses += data.totalLosses;
        teamData[name].goalsFavor += data.goalsFavor;
        teamData[name].goalsOwn += data.goalsOwn;
        teamData[name].goalsBalance = teamData[name].goalsFavor - teamData[name].goalsOwn;
        teamData[name].efficiency = this.calculateEfficiency(
          teamData[name].totalPoints,
          teamData[name].totalGames,
        );
      }
    });

    const combinedData: HomeData[] = Object.values(teamData);
    return this.sortTeamsByPoints(combinedData);
  }
}

export default LeaderboardService;
