import MatchModel, { MatchAttributes } from '../database/models/Matches';
import TeamModel from '../database/models/Team';

const createError = (status: number, message: string) => ({ status, message });

class MatchService {
  public static async getAllMatches(): Promise<MatchAttributes[]> {
    const matches = await MatchModel.findAll({
      include: [
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
      ],
    });
    return matches;
  }

  public static async getFilteredMatches(inProgress: string | undefined)
    : Promise<MatchAttributes[]> {
    const matches = await MatchModel.findAll({
      where: { inProgress: inProgress === 'true' },
      include: [
        {
          model: TeamModel,
          as: 'awayTeam',
          attributes: ['teamName'],
        },
        {
          model: TeamModel,
          as: 'homeTeam',
          attributes: ['teamName'],
        },
      ],
    });

    return matches;
  }

  public static async finishMatch(id: number): Promise<MatchAttributes> {
    const match = await MatchModel.findByPk(id);
    if (!match) {
      throw new Error('Match not found');
    }
    match.inProgress = false;
    await match.save();
    return match;
  }

  public static async updateMatch(id: number, matches: {
    homeTeamGoals: number;
    awayTeamGoals: number;
  }): Promise<{ message: string }> {
    const match = await MatchModel.findByPk(id);
    if (!match) {
      return { message: 'Match not found' };
    }
    match.homeTeamGoals = matches.homeTeamGoals;
    match.awayTeamGoals = matches.awayTeamGoals;
    await match.save();
    return { message: 'Match updated' };
  }

  public static async createMatch(matchData: MatchAttributes):
  Promise<MatchAttributes | { status: number; message: string }> {
    const homeTeam = await TeamModel.findByPk(matchData.homeTeamId);
    const awayTeam = await TeamModel.findByPk(matchData.awayTeamId);
    if (!homeTeam || !awayTeam) {
      return createError(404, 'There is no team with such id!');
    }
    if (matchData.homeTeamId === matchData.awayTeamId) {
      return createError(422, 'It is not possible to create a match with two equal teams');
    }

    const match = await MatchModel.create({
      ...matchData,
      inProgress: true,
    });
    return match;
  }

  public static async getIn(inProgress: boolean) {
    const matches = MatchModel.findAll({
      where: { inProgress },
      include: [
        { model: TeamModel, as: 'awayTeam', attributes: ['teamName'] },
        { model: TeamModel, as: 'homeTeam', attributes: ['teamName'] },
      ],
    });
    return matches;
  }
}

export default MatchService;
