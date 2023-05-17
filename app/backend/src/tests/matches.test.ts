import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import { app } from '../app';
import MatchModel, { MatchAttributes } from '../database/models/Matches';
import TeamModel from '../database/models/Team';
import * as jsonwebtoken from 'jsonwebtoken';
import matchesMock from './matchesMock';
import MatchService from '../services/matcheService';
import UserService from '../services/userService';


chai.use(chaiHttp);

const { expect } = chai;

describe('Matches endpoint', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET method on /matches route', () => {
    it('should retrieve all data for the user', async () => {
      sinon.stub(MatchModel, 'findAll').resolves(matchesMock as unknown as MatchModel[]);
      const response = await chai.request(app).get('/matches');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesMock);
    });
  });

  describe('MatchService', () => {
    afterEach(() => {
      sinon.restore();
    });

    describe('getAllMatches', () => {
      it('should return all matches with teams', async () => {
        sinon.stub(MatchModel, 'findAll').resolvesArg(0);
        const matches = await MatchService.getAllMatches();
        expect(matches).to.be.deep.equal(matchesMock);
      });
    });

    describe('getFilteredMatches', () => {
      it('should return filtered matches with teams', async () => {
        const inProgress = 'true';
        sinon.stub(MatchModel, 'findAll').resolvesArg(0);
        const matches = await MatchService.getFilteredMatches(inProgress);
        expect(matches).to.be.deep.equal(matchesMock);
      });
    });

    describe('finishMatch', () => {
      it('should finish a match and return it', async () => {
        const id = 1;
        const match: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 0
        };

        sinon.stub(MatchModel, 'findByPk').resolves(match as MatchModel);
        const updateStub = sinon.stub(MatchModel.prototype, 'update').resolves(match as MatchModel);

        const finishedMatch = await MatchService.finishMatch(id);

        sinon.assert.calledOnce(updateStub);
        sinon.assert.calledWith(updateStub, {
          homeTeamGoals: match.homeTeamGoals,
          awayTeamGoals: match.awayTeamGoals,
          inProgress: false
        });

        expect(finishedMatch).to.be.deep.equal(match);
      });
      it('finish', async () => {
        const a = await MatchService.finishMatch(100);
        expect(a).to.be.equal('Match not found')
      })
    it('finishmatch', async () => {
      const match = await MatchModel.findByPk(2);
      const a = await MatchService.finishMatch(100);
        expect(a).to.be.equal(match);
    });

    });

    describe('updateMatch', () => {
      it('should update the match and return a success message', async () => {
        const id = 1;
        const match = {
          homeTeamGoals: 2,
          awayTeamGoals: 1,
        };

        const result = await MatchService.updateMatch(id, match);
  
        expect(result).to.deep.equal({ message: 'Match updated' });
      });
  
      it('should return an error message when the match is not found', async () => {
        const id = 1;
        const match = {
          homeTeamGoals: 2,
          awayTeamGoals: 1,
        };
        sinon.stub(MatchModel, 'findByPk').resolves(null);
  
        const result = await MatchService.updateMatch(id, match);
  
        expect(result).to.deep.equal({ message: 'Match not found' });
      });
  
      it('should return an error message when an error occurs while updating the match', async () => {
        const id = 1;
        const match = {
          homeTeamGoals: 2,
          awayTeamGoals: 1,
        };
        sinon.stub(MatchModel, 'findByPk').throws(new Error('Failed to find match'));
  
        const result = await MatchService.updateMatch(id, match);
  
        expect(result).to.deep.equal({ message: 'Failed to update match' });
      });
    });

    describe('updateMatch', () => {
      it('should update a match and return a success message', async () => {
        const id = 1;
        const updatedMatchData = {
          homeTeamGoals: 3,
          awayTeamGoals: 2,
        };
        const match: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 0
        };

        sinon.stub(MatchModel, 'findByPk').resolves(match as MatchModel);
        const updateStub = sinon.stub(MatchModel.prototype, 'update').resolves(match as MatchModel);

        const result = await MatchService.updateMatch(id, updatedMatchData);

        sinon.assert.calledOnce(updateStub);
        sinon.assert.calledWith(updateStub, {
          homeTeamGoals: updatedMatchData.homeTeamGoals,
          awayTeamGoals: updatedMatchData.awayTeamGoals,
        });

        expect(result).to.deep.equal({ message: 'Match updated' });
      });
    });

    describe('createMatch', () => {
      it('should create a match and return it', async () => {
        const matchData: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 1,
        };
        const homeTeam = {
          id: 0,
          teamName: 'Home Team',
        };
        const awayTeam = {
          id: 1,
          teamName: 'Away Team',
        };

        sinon.stub(TeamModel, 'findByPk')
          .withArgs(matchData.homeTeamId)
          .resolves(homeTeam as TeamModel)
          .withArgs(matchData.awayTeamId)
          .resolves(awayTeam as TeamModel);

        const createStub = sinon.stub(MatchModel, 'create').resolves(matchData as MatchModel);

        const result = await MatchService.createMatch(matchData);

        sinon.assert.calledOnce(createStub);
        sinon.assert.calledWith(createStub, {
          ...matchData,
          inProgress: true,
        });

        expect(result).to.deep.equal(matchData);
      });

      it('should return an error when the home team is not found', async () => {
        const matchData: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 1,
        };

        sinon.stub(TeamModel, 'findByPk').resolves(null);

        const result = await MatchService.createMatch(matchData);

        expect(result).to.deep.equal({ status: 404, message: 'There is no team with such id!' });
      });

      it('should return an error when the away team is not found', async () => {
        const matchData: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 1,
        };
        const homeTeam = {
          id: 0,
          teamName: 'Home Team',
        };

        sinon.stub(TeamModel, 'findByPk')
          .withArgs(matchData.homeTeamId)
          .resolves(homeTeam as TeamModel)
          .withArgs(matchData.awayTeamId)
          .resolves(null);

        const result = await MatchService.createMatch(matchData);

        expect(result).to.deep.equal({ status: 404, message: 'There is no team with such id!' });
      });

      it('should return an error when creating a match with two equal teams', async () => {
        const matchData: MatchAttributes = {
          id: 1,
          homeTeamGoals: 2,
          awayTeamGoals: 1,
          inProgress: true,
          homeTeamId: 0,
          awayTeamId: 0,
        };
        const team = {
          id: 0,
          teamName: 'Team',
        };

        sinon.stub(TeamModel, 'findByPk').resolves(team as TeamModel);

        const result = await MatchService.createMatch(matchData);

        expect(result).to.deep.equal({ status: 422, message: 'It is not possible to create a match with two equal teams' });
      });
    });
  });
});