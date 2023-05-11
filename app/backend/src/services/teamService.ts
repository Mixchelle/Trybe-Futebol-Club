import TeamModel, { TeamAttributes } from '../database/models/Team';

class TeamService {
  public static async getAllTeams(): Promise<TeamAttributes[]> {
    const allTeams = await TeamModel.findAll();
    return allTeams;
  }

  public static async getTeamById(id: string): Promise<TeamAttributes | null> {
    try {
      const team = await TeamModel.findOne({ where: { id } });
      if (!team) {
        return null;
      }
      return team;
    } catch (error) {
      throw new Error('Failed to fetch team');
    }
  }
}

export default TeamService;
