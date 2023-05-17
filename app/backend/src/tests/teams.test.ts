import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel, { TeamAttributes } from '../database/models/Team';

import { Response } from 'superagent';
import { Model } from 'sequelize';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams endpoints', () => {
  let chaiHttpResponse: Response;
  let teamModelFindAllStub: sinon.SinonStub;
  let teamModelFindOneStub: sinon.SinonStub;

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /teams', () => {
    it('should respond with status 200 and return a list of all teams', async () => {
      const teams: TeamAttributes[] = [
        {
          id: 1,
          teamName: 'Team 1',
        },
        {
          id: 2,
          teamName: 'Team 2',
        },
      ];

      teamModelFindAllStub = sinon.stub(TeamModel, 'findAll').resolves(teams as unknown as Model<any, any>[]);

      chaiHttpResponse = await chai.request(app).get('/teams');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.an('array');
      expect(body).to.have.lengthOf(2);

      const team = body[0];
      expect(team).to.have.property('id', 1);
      expect(team).to.have.property('teamName', 'Team 1');
    });

    it('should respond with status 500 when an error occurs', async () => {
      teamModelFindAllStub = sinon.stub(TeamModel, 'findAll').throws(new Error('Database error'));

      chaiHttpResponse = await chai.request(app).get('/teams');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(500);
      expect(body).to.be.an('object');
      expect(body).to.have.property('message', 'Failed to fetch teams');
    });
  });

  describe('GET /teams/:id', () => {
    it('should respond with status 200 and return the corresponding team based on ID if it exists', async () => {
      const team: TeamAttributes = {
        id: 5,
        teamName: 'Cruzeiro',
      };

      teamModelFindOneStub = sinon.stub(TeamModel, 'findOne').resolves(team as unknown as Model<any, any>);

      chaiHttpResponse = await chai.request(app).get('/teams/5');

      const { status, body } = chaiHttpResponse;

      expect(status).to.be.equal(200);
      expect(body).to.be.an('object');
      expect(body).to.have.property('id', 5);
      expect(body).to.have.property('teamName', 'Cruzeiro');
    });

    it('should respond with status 404 and the correct message if the team does not exist', async () => {
      teamModelFindOneStub = sinon.stub(TeamModel, 'findOne').resolves(null);

      chaiHttpResponse = await chai.request(app).get('/teams/447');

      const { status, body } = chaiHttpResponse
;

  expect(status).to.be.equal(404);
  expect(body).to.be.an('object');
  expect(body).to.have.property('message', 'Team not found');
});

it('should respond with status 500 when an error occurs', async () => {
  teamModelFindOneStub = sinon.stub(TeamModel, 'findOne').throws(new Error('Database error'));

  chaiHttpResponse = await chai.request(app).get('/teams/5');

  const { status, body } = chaiHttpResponse;

  expect(status).to.be.equal(500);
  expect(body).to.be.an('object');
  expect(body).to.have.property('message', 'Failed to fetch team');
});
});
});