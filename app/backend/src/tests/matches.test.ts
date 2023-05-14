import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel from '../database/models/Matches';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches endpoint', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET /matches', () => {
    it('deve retornar uma lista de partidas', async () => {
      const matches = [
        {
          id: 1,
          homeTeamId: 16,
          homeTeamGoals: 1,
          awayTeamId: 8,
          awayTeamGoals: 1,
          inProgress: false,
          homeTeam: { teamName: 'São Paulo' },
          awayTeam: { teamName: 'Grêmio' },
        },
      ];
      const findAllStub = sinon.stub(MatchModel, 'findAll');
      findAllStub.resolves(matches as any);

      const response = await chai.request(app).get('/matches');

      expect(response).to.have.status(200);
      expect(response.body).to.be.an('array');
      expect(response.body).to.have.lengthOf(matches.length);
      expect(response.body).to.deep.equal(matches);
    });
  });
});
