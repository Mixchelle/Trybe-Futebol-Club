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


});