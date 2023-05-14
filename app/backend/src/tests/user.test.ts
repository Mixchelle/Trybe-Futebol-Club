import { Request, Response } from 'express';
import * as sinon from 'sinon';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/User';
import userService from '../services/userService';

chai.use(chaiHttp);

const { expect } = chai;

describe('UserController', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('login', () => {
    it('should return a token for successful login', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const token = 'testtoken';

      const loginStub = sinon.stub(userService, 'login');
      loginStub.resolves(token);

      const response = await chai
        .request(app)
        .post('/login')
        .send({ email, password });

      expect(response).to.have.status(200);
      expect(response.body).to.have.property('token').equal(token);
      expect(loginStub.calledOnceWithExactly(email, password)).to.be.true;
    });

    it('should return an error message for unsuccessful login', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
      const errorMessage = 'Invalid email or password';

      const loginStub = sinon.stub(userService, 'login');
      loginStub.resolves(null);

      const response = await chai
        .request(app)
        .post('/login')
        .send({ email, password });

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
      expect(loginStub.calledOnceWithExactly(email, password)).to.be.true;
    });
  });

  describe('getRole', () => {
    it('should return the user role with a valid token', async () => {
      const token = 'testtoken';
      const role = 'admin';

      const getUserByTokenStub = sinon.stub(userService, 'getUserByToken');
const user = new UserModel();
user.id = 1;
user.username = 'testuser';
user.email = 'test@example.com';
user.role = 'admin';
getUserByTokenStub.resolves(user);

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(200);
      expect(response.body).to.have.property('role').equal(role);
      expect(getUserByTokenStub.calledOnceWithExactly(token)).to.be.true;
    });

    it('should return an error message if the token is not found', async () => {
      const errorMessage = 'Token not found';

      const response = await chai.request(app).get('/login/role');

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
    });

    it('should return an error message if the token is invalid', async () => {
      const token = 'invalidtoken';
      const errorMessage = 'Token must be a valid token';

      const getUserByTokenStub = sinon.stub(userService, 'getUserByToken');
      getUserByTokenStub.resolves(null);

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
      expect(getUserByTokenStub.calledOnceWithExactly(token)).to.be.true;
    });

    it('should return an error message if the user is not found', async () => {
      const token = 'testtoken';
      const errorMessage = 'User not found';

      const getUserByTokenStub = sinon.stub(userService, 'getUserByToken');
      getUserByTokenStub.resolves(null);

      const response = await chai
        .request(app)
        .get('/login/role')
        .set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
      expect(getUserByTokenStub.calledOnceWithExactly(token)).to.be.true;
    });
  });
});
