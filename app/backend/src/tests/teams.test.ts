import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import TeamModel, { TeamAttributes } from '../database/models/Team';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams endpoints', () => {
let chaiHttpResponse: Response;

afterEach(() => {
  sinon.restore();
});

describe('Ao fazer uma solicitação GET para /teams', () => {
  it('a API responde com o status 200 e a lista de todos os times', async () => {
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

describe('Ao fazer uma solicitação GET para /teams/:id', () => {
  it('e o time existe: a API responde com o status 200 e os dados correspondentes ao time com base no ID', async () => {
  chaiHttpResponse = await chai
  .request(app)
  .get('/teams/5');
  
    const { status, body } = chaiHttpResponse;
  
    expect(status).to.be.equal(200);
    expect(body).to.be.an('object');
    expect(body).to.have.property('id', 5);
    expect(body).to.have.property('teamName', 'Cruzeiro');
  });
  
  it('e o time não existe: a API responde com o status 404 e a mensagem correta', async () => {    chaiHttpResponse = await chai
      .request(app)
      .get('/teams/447');
  
    const { status, body } = chaiHttpResponse;
  
    expect(status).to.be.equal(404);
    expect(body).to.be.an('object');
    expect(body).to.have.property('message', 'Team not found');
  });
  })



  
});
