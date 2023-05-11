import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel, { TeamAttributes } from '../database/models/Team';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Clubs endpoints', () => {
let chaiHttpResponse: Response;

afterEach(() => {
  sinon.restore();
});

describe('When making GET request to /teams', () => {
it('API responds with status 200 and list of all teams', async () => {
chaiHttpResponse = await chai
.request(app)
.get('/teams');

  const { status, body } = chaiHttpResponse;

  expect(status).to.be.equal(200);
  expect(body).to.be.an('array');
  expect(body).to.have.length.greaterThan(0);

  const team = body[0];
  expect(team).to.have.property('id');
  expect(team).to.have.property('teamName');
});
});

describe('When making GET request to /teams/:id', () => {
  it('and team exists: API responds with status 200 and corresponding team data based on id', async () => {
  chaiHttpResponse = await chai
  .request(app)
  .get('/teams/5');
  
    const { status, body } = chaiHttpResponse;
  
    expect(status).to.be.equal(200);
    expect(body).to.be.an('object');
    expect(body).to.have.property('id', 5);
    expect(body).to.have.property('teamName', 'Cruzeiro');
  });
  
  it('and team does not exist: API responds with status 404 and correct message', async () => {
    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/447');
  
    const { status, body } = chaiHttpResponse;
  
    expect(status).to.be.equal(404);
    expect(body).to.be.an('object');
    expect(body).to.have.property('message', 'Team not found');
  });
  })
});