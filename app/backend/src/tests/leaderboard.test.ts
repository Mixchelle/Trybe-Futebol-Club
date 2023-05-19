import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import LeaderboardService from '../services/leaderboardService';
import TeamService from '../services/teamService';
import MatchService from '../services/matcheService';
import expectedHomeData from './mockClass';
import { app } from '../app';
import awayMock from './mock/awayMock';

interface Teste {
  homeTeamId: number;
  awayTeamId: number;
  homeTeamGoals: number;
  awayTeamGoals: number;
  inProgress: boolean;
}

interface HomeData {
  name: string;
  totalPoints: number;
  totalGames: number;
  totalVictories: number;
  totalDraws: number;
  totalLosses: number;
  goalsFavor: number;
  goalsOwn: number;
  goalsBalance: number;
  efficiency: string;
  
}


chai.use(chaiHttp);

const { expect } = chai;

describe('leaderboard endpoint', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('Endpoint /leaderboard/home', () => {
    it('should return the home leaderboard', async () => {
      const teams = [
        { id: 1, teamName: 'Santos' },
        { id: 2, teamName: 'Palmeiras' },
        { id: 3, teamName: 'Corinthians' },
        { id: 4, teamName: 'Grêmio' },
        { id: 5, teamName: 'Real Brasília' },
        { id: 6, teamName: 'São Paulo' },
        { id: 7, teamName: 'Internacional' },
        { id: 8, teamName: 'Flamengo' },
      ];

      const matches = await MatchService.getAllMatches();

      sinon.stub(TeamService, 'getAllTeams').resolves(teams);
      sinon.stub(MatchService, 'getAllMatches').resolves(matches);

      const response = await chai.request(app).get('/leaderboard/home');

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal(expectedHomeData);
    });

    it('should calculate total points correctly', () => {
      const homeTeamGoals = 2;
      const awayTeamGoals = 1;
      const result = LeaderboardService.calculateTotalPoints(homeTeamGoals, awayTeamGoals);
      expect(result.totalPoints).to.equal(3);
      expect(result.totalVictories).to.equal(1);
    });

    it('should calculate efficiency correctly', () => {
      const points = 9;
      const games = 3;
      const result = LeaderboardService.calculateEfficiency(points, games);
      expect(result).to.equal('100.00');
    });

    it('should calculate team stats correctly', async () => {
      const matches = await MatchService.getAllMatches();

      const result = await LeaderboardService.calculateTeamStats(matches);
      expect(result.totalPoints).to.equal(4);
      expect(result.totalVictories).to.equal(1);
      expect(result.totalDraws).to.equal(1);
      expect(result.totalLosses).to.equal(1);
      expect(result.goalsFavor).to.equal(3);
      expect(result.goalsOwn).to.equal(3);
    });
  });

  describe('Endpoint /leaderboard/away', () => {
    it('should return the away leaderboard', async () => {
   
      const response = await chai.request(app).get('/leaderboard/away');

      expect(response.status).to.equal(200);
    });
  });
});