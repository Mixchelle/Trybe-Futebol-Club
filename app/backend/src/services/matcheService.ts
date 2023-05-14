import MatchModel, { MatchAttributes } from '../database/models/Matches';

class MatchService {
  // eslint-disable-next-line class-methods-use-this
  async getAllMatches() {
    const allMatches = await MatchModel.findAll();
    return allMatches;
  }
}

export default new MatchService();
