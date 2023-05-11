import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel, { TeamAttributes } from '../database/models/Team';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('GET /teams', () => {
  it('should return all teams correctly', async () => {
    const response = await chai.request(app).get('/teams');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal([
      { id: 1, teamName: 'Avaí/Kindermann' },
      { id: 2, teamName: 'Bahia' },
      { id: 3, teamName: 'Botafogo' },
    ]);
  });
});
