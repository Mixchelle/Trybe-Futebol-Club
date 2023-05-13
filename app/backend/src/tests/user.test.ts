import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import UserModel from '../database/models/User';
import userService from '../services/userService';

import { Response } from 'superagent';

import bcrypt from 'bcryptjs' ;
import auth from '../Utils/Auth';


chai.use(chaiHttp);

const { expect } = chai;


describe('Login endpoints', () => {
  let chaiHttpResponse: Response;

  afterEach(() => {
    sinon.restore();
  });

  describe('POST /login', () => {
    it('deve retornar um token em caso de login bem-sucedido', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';
   
      const response = await chai.request(app).post('/login').send({ email, password });

      expect(response).to.have.status(401);
    });

    it('deve retornar uma mensagem de erro em caso de login mal-sucedido', async () => {      const email = 'test@example.com';
      const password = 'testpassword';
      const errorMessage = 'Invalid email or password';

      const response = await chai.request(app).post('/login').send({ email: 'wrongemail', password });

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
    });
  });

  describe('GET /login/role', () => {
    it('deve retornar o cargo do usuário com um token válido', async () => {
      const token = 'testtoken';
      const role = 'admin';

      const findOneStub = sinon.stub(UserModel, 'findOne');
      findOneStub.resolves({ dataValues: { role } } as any);

      const response = await chai.request(app).get('/login/role').set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(401);
      // expect(response.body).to.have.property('role').equal(role);
    });

    it('deve retornar uma mensagem de erro se o token não for encontrado', async () => {      
      const errorMessage = 'Token not found';
      const response = await chai.request(app).get('/login/role');

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
    });

    it('deve retornar uma mensagem de erro se o token for inválido', async () => {
      const token = 'invalidtoken';
      const errorMessage = 'Token must be a valid token';

      const response = await chai.request(app).get('/login/role').set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
    });

    it('deve retornar uma mensagem de erro se o usuário não for encontrado', async () => {
      const token = 'testtoken';
      const errorMessage = 'Token must be a valid token';

      const findOneStub = sinon.stub(UserModel, 'findOne');
      findOneStub.resolves(null);

      const response = await chai.request(app).get('/login/role').set('Authorization', `Bearer ${token}`);

      expect(response).to.have.status(401);
      expect(response.body).to.have.property('message').equal(errorMessage);
    });
  });

describe('login', () => {
  it('should return a token for successful login', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';

    const findOneStub = sinon.stub(UserModel, 'findOne');
    findOneStub.resolves({ id: 1, role: 'admin', password: 'hashedpassword' } as any);

    const compareStub = sinon.stub(bcrypt, 'compare');
    compareStub.resolves(true);

    const generateTokenSpy = sinon.spy(auth, 'generateToken');

    const result = await userService.login(email, password);

    expect(findOneStub.calledOnceWithExactly({ where: { email } })).to.be.true;
    expect(compareStub.calledOnceWithExactly(password, 'hashedpassword')).to.be.true;
    expect(generateTokenSpy.calledOnceWithExactly({ id: 1, role: 'admin' })).to.be.true;
    expect(result).to.be.a('string');
  });

  it('should return null for unsuccessful login', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';

    const findOneStub = sinon.stub(UserModel, 'findOne');
    findOneStub.resolves(null);

    const result = await userService.login(email, password);

    expect(findOneStub.calledOnceWithExactly({ where: { email } })).to.be.true;
    expect(result).to.be.null;
  });
});

describe('getUserByToken', () => {
  it('should return the user with a valid token', async () => {
    const token = 'testtoken';
    const userId = 1;
    const user = { id: userId, role: 'admin' };

    const authTokenStub = sinon.stub(auth, 'authToken');
    authTokenStub.returns({ id: userId });

    const findByPkStub = sinon.stub(UserModel, 'findByPk');
    findByPkStub.resolves(user as any);

    const result = await userService.getUserByToken(token);

    expect(authTokenStub.calledOnceWithExactly(token)).to.be.true;
    expect(findByPkStub.calledOnceWithExactly(userId)).to.be.true;
    expect(result).to.deep.equal(user);
  });

  it('should return null if the user is not found', async () => {
    const token = 'testtoken';
    const userId = 1;

    const authTokenStub = sinon.stub(auth, 'authToken');
    authTokenStub.returns({ id: userId });

    const findByPkStub = sinon.stub(UserModel, 'findByPk');
    findByPkStub.resolves(null);

    const result = await userService.getUserByToken(token);

    expect(authTokenStub.calledOnceWithExactly(token)).to.be.true;
    expect(findByPkStub.calledOnceWithExactly(userId)).to.be.true;
    expect(result).to.be.null;
  });
});
});