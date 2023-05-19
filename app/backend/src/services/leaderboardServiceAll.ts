// import { MatchAttributes } from '../database/models/Matches';
// import TeamService from './teamService';
// import MatchService from './matcheService';
// import { HomeData } from '../interfaces/leaderboard';
// import { TeamAttributes } from '../database/models/Team';

// type TeamStats = HomeData;

// const initialPoints = {
//   totalPoints: 0,
//   totalVictories: 0,
//   totalDraws: 0,
//   totalLosses: 0,
//   totalGames: 0,
//   goalsFavor: 0,
//   goalsOwn: 0,
//   goalsBalance: 0,
//   efficiency: '0',
//   name: '',
// };

// class LeaderboardServiceAway {
// // private static calculateTotalHome(homeTeamGoals: number, awayTeamGoals: number): number {
// // if (homeTeamGoals > awayTeamGoals) {
// // return 3;
// // } else if (homeTeamGoals < awayTeamGoals) {
// // return 0;
// // } else {
// // return 1;
// // }
// // }

//   private static calculateTotalAway(homeTeamGoals: number, awayTeamGoals: number): number {
//     if (awayTeamGoals > homeTeamGoals) {
//       return 3;
//     } if (awayTeamGoals < homeTeamGoals) {
//       return 0;
//     }
//     return 1;
//   }

//   private static calculateEfficiency(points: number, games: number): string {
//     if (games === 0) return '0';
//     const efficiency = (points / (games * 3)) * 100;
//     return efficiency.toFixed(2).toString();
//   }

//   private static async calculateTeamStats(matches: MatchAttributes[]): Promise<TeamStats> {
//     const result: TeamStats = { ...initialPoints };
//     matches.forEach((match) => {
//       const points = this.calculateTotalHome(match.homeTeamGoals, match.awayTeamGoals);
//       const pointsA = this.calculateTotalAway(match.homeTeamGoals, match.awayTeamGoals);

//       const goalsFavor = match.awayTeamGoals + match.homeTeamGoals;
//       const goalsOwn = match.homeTeamGoals;
//       const goalsBalance = goalsFavor - goalsOwn;
//       result.totalPoints += points;
//       result.totalGames++;
//       result.goalsFavor += goalsFavor;
//       result.goalsOwn += goalsOwn;
//       result.goalsBalance += goalsBalance;

//       if (points === 3) {
//         result.totalVictories++;
//       } else if (points === 1) {
//         result.totalDraws++;
//       } else {
//         result.totalLosses++;
//       }
//     });
//     result.efficiency = this.calculateEfficiency(result.totalPoints, result.totalGames);
//     return result;
//   }

//   public static async getData(teams: TeamAttributes[], matches: MatchAttributes[]): Promise<HomeData[]> {
//     const awayData = await Promise.all(
//       teams.map(async (team) => {
//         const teamMatches = matches.filter((match) => match.awayTeamId === team.id && match.status === 'FINALIZED');
//         const teamStats = await this.calculateTeamStats(teamMatches);
//         return {
//           name: team.teamName,
//           totalPoints: teamStats.totalPoints,
//           totalGames: teamStats.totalGames,
//           totalVictories: teamStats.totalVictories,
//           totalDraws: teamStats.totalDraws,
//           totalLosses: teamStats.totalLosses,
//           goalsFavor: teamStats.goalsFavor,
//           goalsOwn: teamStats.goalsOwn,
//           goalsBalance: teamStats.goalsBalance,
//           efficiency: teamStats.efficiency,
//         };
//       }),
//     );

//     return awayData;
//   }

//   public static sortTeamsByPoints(teams: HomeData[]): HomeData[] {
//     return teams.sort((a, b) => {
//       if (a.totalPoints === b.totalPoints) {
//         if (a.totalVictories === b.totalVictories) {
//           if (a.goalsBalance === b.goalsBalance) {
//             return b.goalsFavor - a.goalsFavor;
//           }
//           return b.goalsBalance - a.goalsBalance;
//         }
//         return b.totalVictories - a.totalVictories;
//       }
//       return b.totalPoints - a.totalPoints;
//     });
//   }

//   public static async getAllLeaderboard(): Promise<HomeData[]> {
//     const teams = await TeamService.getAllTeams();
//     const matches = await MatchService.getIn(false);
//     const awayData = await this.getData(teams, matches);
//     const result = await this.sortTeamsByPoints(awayData);
//     return result;
//   }
// }

// export default LeaderboardServiceAway;
