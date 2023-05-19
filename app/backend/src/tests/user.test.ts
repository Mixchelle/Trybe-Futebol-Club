import { Request, Response } from 'express';
import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jsonwebtoken from 'jsonwebtoken';
// @ts-ignore

import chaiHttp = require('chai-http');
import { app } from '../app';
import UserModel from '../database/models/User';
import userService from '../services/userService';
import UserController from '../controllers/userController';
import UserService from '../services/userService';
import auth from '../Utils/Auth';
import validateLogin from '../middleware/validateToken';


chai.use(chaiHttp);

const { expect } = chai;

describe('endpoint /login', () => {
  afterEach(() => {
    sinon.restore();
  });

  const userMock =
  {
    id: 1,
    username: 'Admin',
    role: 'admin',
    email: 'admin@admin.com',
    password: '$2a$08$xi.Hxk1czAO0nZR..B393u10aED0RQ1N3PAEXQ7HxtLjKPEZBu.PW'
  };

  const token = auth.generateToken({ id: userMock.id, role: userMock.role });

  describe('/login', () => {
    it('should return a token for successful login', async () => {
      sinon.stub(UserModel, 'findOne').resolves(userMock as unknown as UserModel);
      sinon.stub(jsonwebtoken, 'sign').resolves(token);

      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: 'secret_admin'
        });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.deep.equal({ token });
    });

    it('should return an error message for invalid email or password', async () => {
      sinon.stub(UserModel, 'findOne').resolves(null);

      const response = await chai
        .request(app)
        .post('/login')
        .send({
          password: 'secret_admin'
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });

    it('should return an error message when email is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: '',
          password: 'secret_admin'
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });

    it('should return an error message when password is not provided', async () => {
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@admin.com',
          password: ''
        });

      expect(response.status).to.be.equal(400);
      expect(response.body).to.be.deep.equal({ message: 'All fields must be filled' });
    });
    it('User does not provide a valid email', async () => {
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@test.com',
          password: 'secret_admin'
        });
    
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });
    
    it('User does not provide a valid password', async () => {
      const response = await chai
        .request(app)
        .post('/login')
        .send({
          email: 'admin@test.com',
          password: 'password'
        });
    
      expect(response.status).to.be.equal(401);
      expect(response.body).to.be.deep.equal({ message: 'Invalid email or password' });
    });
    it('função getbytoken', async () =>{

      const t = await UserService.getUserByToken(token);

      expect(t).to.be.deep.equal(userMock)
    })
  });

  describe('/login/role', () => {
    it('should return the user role when a valid token is provided', async () => {
      sinon.stub(userService, 'getUserByToken').resolves(userMock as unknown as UserModel);

      const response = await chai
      .request(app)
      .get('/login/role')
      .auth(token, { type: 'bearer' });

      expect(response.status).to.be.equal(200);
      expect(response.body).to.be.an('object');
      expect(response.body).to.be.deep.equal({ role: 'user' });

    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ role: userMock.role });
  });
  
  it('should return an error message when token is not provided', async () => {
    const response = await chai
      .request(app)
      .get('/login/role');
  
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token not found' });
  });
  
  it('should return an error message when an invalid token is provided', async () => {
    const invalidToken = 'invalid-token';
  
    const response = await chai
      .request(app)
      .get('/login/role')
      .set('Authorization', `Bearer ${invalidToken}`);
  
    expect(response.status).to.be.equal(401);
    expect(response.body).to.be.deep.equal({ message: 'Token must be a valid token' });
  });
  
});

describe('validateLogin', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: any; // Alteração feita aqui

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: () => res as Response, // Alteração feita aqui
      json: () => res as Response, // Alteração feita aqui
    };
    next = () => {};
  });

  it('should return 400 if email or password is missing', () => {
    validateLogin(req as Request, res as Response, next);
    expect(res.status).to.be.equal(400); // Alteração feita aqui
    expect(res.json).to.be.equal({ message: 'All fields must be filled' }); // Alteração feita aqui
  });

  it('should return 401 if email is invalid or password length is less than 6', () => {
    req.body.email = 'invalidEmail';
    req.body.password = 'pass';
    validateLogin(req as Request, res as Response, next);
    expect(res.status).to.be.equal(401); // Alteração feita aqui
    expect(res.json).to.be.equal({ message: 'Invalid email or password' }); // Alteração feita aqui
  });

  it('should call next if email and password are valid', () => {
    req.body.email = 'validemail@example.com';
    req.body.password = 'validpassword';
    const nextSpy = sinon.spy();
    validateLogin(req as Request, res as Response, nextSpy);
    expect(nextSpy.called).to.be.true; // Alteração feita aqui
  });
});
});


