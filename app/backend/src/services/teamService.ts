import TeamModel, { TeamAttributes } from '../database/models/Team';

class TeamService {
  public static async getAllTeams(): Promise<TeamAttributes[]> {
    try {
      const allTeams = await TeamModel.findAll();
      return allTeams;
    } catch (error) {
      throw new Error('Failed to fetch teams');
    }
  }
}

export default TeamService;
