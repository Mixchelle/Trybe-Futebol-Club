import chai from 'chai';
import chaiHttp from 'chai-http';

import { app } from '../app';

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
