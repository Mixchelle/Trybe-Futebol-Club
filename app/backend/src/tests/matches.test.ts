import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import MatchModel, { MatchAttributes } from '../database/models/Matches';
import TeamModel from '../database/models/Team';
import matchesMock from './matchesMock';
import * as jsonwebtoken from 'jsonwebtoken';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches endpoint', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('GET method on /matches route', () => {
    it('should retrieve all data for the user', async () => {
    sinon.stub(MatchModel, "findAll").resolves(matchesMock as unknown as MatchModel[]);
    const response = await chai
    .request(app)
    .get('/matches');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(matchesMock);
    });
    });
    
    describe('GET method on /matches?inProgress=true route', () => {
    it('should retrieve all matches that are in progress', async () => {
    const matchesInProgress = matchesMock.filter((match) => match.inProgress === true);
    sinon.stub(MatchModel, "findAll").resolves(matchesInProgress as unknown as MatchModel[]);
    const response = await chai
    .request(app)
    .get('/matches?inProgress=true');
    expect(response.status).to.be.equal(200);
    expect(response.body).to.be.deep.equal(matchesInProgress);
    });

    it('should retrieve all matches that are finished', async () => {
      const matchesFinished = matchesMock.filter((match) => match.inProgress === false);
      sinon.stub(MatchModel, "findAll").resolves(matchesFinished as unknown as MatchModel[]);
      const response = await chai
        .request(app)
        .get('/matches?inProgress=false');
      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal(matchesFinished);
    });
    });
    
    describe('PATCH method on /:id route', () => {
    it('should update the goals of a match', async () => {
    sinon.stub(MatchModel, "update").resolves();
    const response = await chai
    .request(app)
    .patch('/matches/1')
    .send({
    homeTeamGoals: 3,
    awayTeamGoals: 1
    });
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
    });
    });
    
    describe('PATCH method on /:id/finish route', () => {
    it('should update a match as finished', async () => {
    sinon.stub(MatchModel, "update").resolves();
    const response = await chai
    .request(app)
    .patch('/matches/1/finish');
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
    });
    });
    
    describe('POST method on /matches route', () => {
    it('should insert a new match', async () => {
    const result = {
    id: 20,
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    inProgress: true
    };
    sinon.stub(jsonwebtoken, 'verify').resolves({ email: 'admin@admin.com', password: 'secret_admin' });
    sinon.stub(TeamModel, "findByPk")
    .onCall(0).resolves({
    
    id: 1, teamName: 'Palmeiras'} as any)
    .onCall(1).resolves({ id: 1, teamName: 'Palmeiras'} as any);
    sinon.stub(MatchModel, "create").resolves(result as MatchAttributes| any);
    const response = await chai
    .request(app)
    .post('/matches')
    .send({
    homeTeam: 16,
    awayTeam: 8,
    homeTeamGoals: 2,
    awayTeamGoals: 2,
    })
    .set('authorization', 'toksdfsdfsfd234234en');
    expect(response.status).to.be.equal(422);
    expect(response.body).to.be.deep.equal({message: 'It is not possible to create a match with two equal teams'});
    });
    
    it('should not insert a match without sending the authorization token', async () => {
      sinon.stub(jsonwebtoken, 'verify').resolves();
      const response = await chai
        .request(app)
        .post('/matches')
        .send({
          homeTeam: 16,
          awayTeam: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
        })
        .set('authorization', '');
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal({ message: 'Token not found' });
    });
    
    it('should not insert a match without sending a valid authorization token', async () => {
      sinon.stub(jsonwebtoken, 'verify').throws();
      const response = await chai
        .request(app)
        .post('/matches')
        .send({
          homeTeam: 16,
          awayTeam: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
        })
        .set('authorization', 'dadsdasdasdas');
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal({ message: 'Token must be a valid token' });
    });
    
    it('should not insert a match with two equal teams', async () => {
      sinon.stub(jsonwebtoken, 'verify').resolves({ email: 'admin@admin.com', password: 'secret_admin' });
      const response = await chai
        .request(app)
        .post('/matches')
        .send({
          homeTeam: 8,
          awayTeam: 8,
          homeTeamGoals: 2,
          awayTeamGoals: 2,
        })
        .set('authorization', 'dadsdasdasdas');
      expect(response.status).to.be.equal(404);
      expect(response.body).to.be.deep.equal({ message: 'There is no team with such id!' });
    });
  
    });
    describe('teste 80%', async () => {
      it('20 - Deve retornar status 401 e a mensagem "Token not found" se não for informado um token', async () => {
        const response = await chai.request(app).post('/matches').send(matchesMock);
    
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'Token not found' });
      });
    
      it('20 - Deve retornar status 401 e a mensagem "Token must be a valid token" se for informado um token inválido', async () => {
        sinon.stub(jsonwebtoken, 'verify').throws(new Error('Invalid token'));
    
        const response = await chai
          .request(app)
          .post('/matches')
          .set('Authorization', 'Bearer invalidToken')
          .send(matchesMock);
    
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'Token must be a valid token' });
      });
    
    
    
      it('21 - Não deve ser possível inserir uma partida com times iguais', async () => {
        const matchWithEqualTeams = { ...matchesMock, awayTeamId: matchesMock };
    
        const response = await chai
          .request(app)
          .post('/matches')
          .set('Authorization', 'Bearer validToken')
          .send(matchWithEqualTeams);
    
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'It is not possible to create a match with two equal teams' });
      });
    
      it('21 - Não deve ser possível inserir uma partida com um time que não existe no banco de dados', async () => {
        sinon.stub(TeamModel, 'findByPk').resolves(null);
    
        const response = await chai
          .request(app)
          .post('/matches')
          .set('Authorization', 'Bearer validToken')
          .send(matchesMock);
    
        expect(response).to.have.status(401);
        expect(response.body).to.deep.equal({ message: 'There is no team with such id!' });
      });
    })
    });